function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

_objectDestructuringEmpty(bryntum.gantt);
/* eslint-disable no-unused-vars, import/extensions */


var project = window.project = new ProjectModel({
  taskModelClass: Task,
  dependencyModelClass: Dependency,
  resourceModelClass: Resource,
  assignmentModelClass: Assignment,
  calendarModelClass: Calendar,
  transport: {
    load: {
      url: 'ganttcrud/load',
      paramName: 'q'
    },
    sync: {
      url: 'ganttcrud/sync'
    }
  },
  listeners: {
    syncfail: function syncfail(_ref) {
      var response = _ref.response,
          responseText = _ref.responseText;

      if (!response || !response.success) {
        backendTools.serverError('Could not sync the data with the server.', responseText);
      }
    }
  },
  autoLoad: false,
  autoSync: false
});
var gantt = window.gantt = new Gantt({
  project: project,
  weekStartDay: 1,
  startDate: '2012-08-28',
  endDate: '2012-11-05',
  columns: [{
    type: 'wbs'
  }, {
    type: 'name',
    width: 250
  }, {
    type: 'startdate'
  }, {
    type: 'duration'
  }, {
    type: 'percentdone',
    width: 70
  }, {
    type: 'resourceassignment',
    width: 120
  }, {
    type: 'predecessor',
    width: 112
  }, {
    type: 'successor',
    width: 112
  }, {
    type: 'schedulingmodecolumn'
  }, {
    type: 'calendar'
  }, {
    type: 'percentdone',
    showCircle: true,
    text: '%',
    width: 70
  }, {
    type: 'constrainttype'
  }, {
    type: 'constraintdate'
  }, {
    type: 'deadlinedate'
  }, {
    type: 'addnew'
  }],
  subGridConfigs: {
    locked: {
      flex: 1
    },
    normal: {
      flex: 2
    }
  },
  columnLines: false,
  features: {
    indicators: {
      items: {
        deadline: true,
        earlyDates: false,
        lateDates: false,
        constraintDate: false
      }
    },
    rollups: {
      disabled: true
    },
    progressLine: {
      disabled: true,
      statusDate: new Date(2019, 1, 10)
    },
    taskContextMenu: {
      // Our items is merged with the provided defaultItems
      // So we add the provided convertToMilestone option.
      items: {
        convertToMilestone: true
      },
      processItems: function processItems(_ref2) {
        var taskRecord = _ref2.taskRecord,
            items = _ref2.items;

        if (taskRecord.isMilestone) {
          items.convertToMilestone = false;
        }
      }
    },
    filter: true,
    dependencyEdit: true,
    timeRanges: {
      showCurrentTimeLine: true
    },
    labels: {
      left: {
        field: 'name',
        editor: {
          type: 'textfield'
        }
      }
    }
  }
}); // Add Save / Load / Reset buttons toolbar and server data load/sync handlers

var backendTools = new BackendTools(gantt);
new Panel({
  adopt: 'container',
  layout: 'fit',
  items: [gantt],
  tbar: new GanttToolbar({
    gantt: gantt
  })
}); // console.time("load data");

project.load().then(function () {
  // console.timeEnd("load data");
  var stm = gantt.project.stm;
  stm.enable();
  stm.autoRecord = true; // let's track scheduling conflicts happened

  project.on('schedulingconflict', function (context) {
    // show notification to user
    Toast.show('Scheduling conflict has happened ..recent changes were reverted'); // as the conflict resolution approach let's simply cancel the changes

    context.continueWithResolutionResult(EffectResolutionResult.Cancel);
  });
}).catch(function (_ref3) {
  var response = _ref3.response,
      responseText = _ref3.responseText;

  if (response && response.message) {
    Toast.show({
      html: "".concat(response.message, "<br>\n                    <b>Please make sure that you've read readme.md file carefully\n                    and setup the database connection accordingly.</b>"),
      color: 'b-red',
      style: 'color:white',
      timeout: 0
    });
  }
});