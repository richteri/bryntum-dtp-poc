var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    Toast = _bryntum$gantt.Toast,
    EffectResolutionResult = _bryntum$gantt.EffectResolutionResult;
/* eslint-disable no-unused-vars */

var project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  },
  listeners: {
    // let's track scheduling conflicts happened
    schedulingconflict: function schedulingconflict(context) {
      // show notification to user
      Toast.show('Scheduling conflict has happened ..recent changes were reverted'); // as the conflict resolution approach let's simply cancel the changes

      context.continueWithResolutionResult(EffectResolutionResult.Cancel);
    }
  }
});
new Gantt({
  adopt: 'container',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    width: 250
  }],
  // Custom task content, display task name on child tasks
  taskRenderer: function taskRenderer(_ref) {
    var taskRecord = _ref.taskRecord;

    if (taskRecord.isLeaf && !taskRecord.isMilestone) {
      return taskRecord.name;
    }
  }
});
project.load();