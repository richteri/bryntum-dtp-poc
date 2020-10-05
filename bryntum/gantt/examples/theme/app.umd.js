var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    GlobalEvents = _bryntum$gantt.GlobalEvents,
    Panel = _bryntum$gantt.Panel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    DomHelper = _bryntum$gantt.DomHelper;
/* eslint-disable no-unused-vars */

var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new Gantt({
  project: project,
  columns: [{
    type: 'wbs'
  }, {
    type: 'name'
  }],
  subGridConfigs: {
    locked: {
      flex: 1
    },
    normal: {
      flex: 2
    }
  },
  features: {
    columnLines: false,
    filter: true,
    timeRanges: {
      showHeaderElements: true
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
});
var panel = new Panel({
  adopt: 'container',
  layout: 'fit',
  items: [gantt],
  tbar: {
    items: [{
      type: 'widget',
      cls: 'label',
      html: 'Theme:'
    }, {
      type: 'buttonGroup',
      items: ['Stockholm', 'Light', 'Dark', 'Material', 'Default'].map(function (name) {
        return {
          id: name.toLowerCase(),
          color: 'b-blue',
          text: name,
          pressed: DomHelper.themeInfo.name === name,
          enableToggle: true,
          toggleGroup: 'theme',
          onAction: function onAction(_ref) {
            var button = _ref.source;
            DomHelper.setTheme(button.text);
          }
        };
      })
    }]
  }
});
GlobalEvents.on({
  theme: function theme(themeChangeEvent) {
    WidgetHelper.getById(themeChangeEvent.theme).pressed = true;
  }
});
project.load();