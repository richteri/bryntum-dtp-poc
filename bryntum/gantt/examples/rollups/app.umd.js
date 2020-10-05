var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper;
/* eslint-disable no-unused-vars */

var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: 'data/tasks.json'
    }
  }
});
var gantt = new Gantt({
  adopt: 'container',
  project: project,
  columns: [{
    type: 'wbs'
  }, {
    type: 'name'
  }, {
    type: 'rollup'
  }],
  viewPreset: 'monthAndYear',
  // Allow extra space for rollups
  rowHeight: 50,
  barMargin: 11,
  columnLines: true,
  features: {
    rollups: true
  }
});
WidgetHelper.append([{
  cls: 'b-blue b-bright',
  type: 'checkbox',
  text: 'Show Rollups',
  checked: true,
  toggleable: true,
  onAction: function onAction(_ref) {
    var checked = _ref.checked;
    gantt.features.rollups.disabled = !checked;
  }
}], {
  insertFirst: document.getElementById('tools') || document.body
});
project.load();