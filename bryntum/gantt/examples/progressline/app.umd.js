var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper;
/* eslint-disable no-unused-vars */

var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var statusDate = new Date(2019, 0, 27);
WidgetHelper.append([{
  type: 'checkbox',
  label: 'Show project line',
  checked: true,
  cls: 'b-bright',
  listeners: {
    change: function change(_ref) {
      var checked = _ref.checked;
      return gantt.features.progressLine.disabled = !checked;
    }
  }
}, {
  type: 'datefield',
  label: 'Project status date',
  value: statusDate,
  step: '1d',
  cls: 'b-bright b-statusdate',
  listeners: {
    change: function change(_ref2) {
      var value = _ref2.value;
      gantt.features.progressLine.statusDate = value;
    }
  }
}], {
  insertFirst: document.getElementById('tools') || document.body
});
var gantt = new Gantt({
  adopt: 'container',
  startDate: '2019-01-08',
  endDate: '2019-04-01',
  project: project,
  features: {
    progressLine: {
      statusDate: statusDate
    }
  },
  columns: [{
    type: 'name',
    width: 250
  }],
  viewPreset: 'weekAndDayLetter'
});
project.load();