var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    Button = _bryntum$gantt.Button,
    ObjectHelper = _bryntum$gantt.ObjectHelper;
/* eslint-disable no-unused-vars */

new Button({
  type: 'button',
  text: 'Export',
  ref: 'excelExportBtn',
  color: 'b-blue b-raised',
  insertFirst: document.getElementById('tools') || document.body,
  onAction: function onAction() {
    var filename = gantt.project.taskStore.first && gantt.project.taskStore.first.name;
    gantt.features.excelExporter.export({
      filename: filename
    });
  }
});
var project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new Gantt({
  adopt: 'container',
  project: project,
  features: {
    excelExporter: {
      // Choose the date format for date fields
      dateFormat: 'YYYY-MM-DD HH:mm'
    }
  },
  subGridConfigs: {
    locked: {
      flex: 1
    },
    normal: {
      flex: 2
    }
  },
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
    type: 'effort'
  }, {
    type: 'resourceassignment'
  }, {
    type: 'percentdone',
    width: 70
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
    type: 'constrainttype'
  }, {
    type: 'constraintdate'
  }, {
    type: 'addnew'
  }]
});
project.load();