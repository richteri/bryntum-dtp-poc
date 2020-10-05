(function () {
  var targetElement = document.querySelector('div[data-file="gantt/feature/CellEdit.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>This demo shows the cell edit feature, double-click <b>Name</b> column cells or click the <b>Edit</b> button to start editing:</p>'; //START
  // Project contains all the data and is responsible for correct scheduling

  var project = new bryntum.gantt.ProjectModel({
    startDate: new Date(2017, 0, 1),
    tasksData: [{
      id: 1,
      name: 'Write docs',
      expanded: true,
      children: [{
        id: 2,
        name: 'Proof-read docs',
        startDate: '2017-01-02',
        endDate: '2017-01-05'
      }, {
        id: 3,
        name: 'Release docs',
        startDate: '2017-01-09',
        endDate: '2017-01-10'
      }]
    }],
    dependenciesData: [{
      fromTask: 2,
      toTask: 3
    }]
  }); // Panel holding toolbar and Gantt

  var panel = new bryntum.gantt.Panel({
    appendTo: targetElement,
    layoutConfig: {
      alignItems: 'stretch',
      alignContent: 'stretch'
    },
    tbar: [{
      type: 'button',
      text: 'Edit',
      onClick: function onClick(_ref) {
        var source = _ref.source;
        var gantt = source.parent.parent.widgetMap.gantt;
        gantt.startEditing({
          field: 'name',
          record: gantt.selectedRecords.length && gantt.selectedRecords[0] || gantt.taskStore.first
        });
      }
    }],
    items: [{
      type: 'gantt',
      ref: 'gantt',
      // reference is used to easily obtain Gantt reference in it's parent container (see Edit button click handler)
      flex: '1 0 100%',
      project: project,
      // Gantt needs project to get schedule data from
      startDate: new Date(2016, 11, 31),
      endDate: new Date(2017, 0, 11),
      height: 300,
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name'
      }]
    }]
  }); //END
})();