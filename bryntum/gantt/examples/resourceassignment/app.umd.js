var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    AjaxHelper = _bryntum$gantt.AjaxHelper,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    AssignmentField = _bryntum$gantt.AssignmentField;
/* eslint-disable no-unused-vars */

var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new Gantt({
  adopt: 'container',
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }, {
    type: 'resourceassignment',
    width: 250,
    editor: {
      type: AssignmentField.type,
      picker: {
        // This config is applied over the provided picker grid's config
        // Object based configs are merged. The columns, being an array is concatenated
        // onto the provided column set.
        grid: {
          features: {
            filterBar: true,
            group: 'resource.city',
            contextMenu: false
          },
          columns: [{
            text: 'Calendar',
            field: 'resource.calendar.name',
            filterable: false,
            editor: false,
            width: 85
          }]
        }
      }
    }
  }],
  project: project
});
project.load();