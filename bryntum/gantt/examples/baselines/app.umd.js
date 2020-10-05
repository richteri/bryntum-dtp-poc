var _bryntum$gantt = bryntum.gantt,
    DateHelper = _bryntum$gantt.DateHelper,
    Panel = _bryntum$gantt.Panel,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel;
/* eslint-disable no-unused-vars */

function setBaseline(index) {
  gantt.taskStore.setBaseline(index);
}

function toggleBaselineVisible(index, visible) {
  gantt.element.classList[visible ? 'remove' : 'add']("b-hide-baseline-".concat(index));
}

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
  // Allow extra space for baseline(s)
  rowHeight: 60,
  features: {
    baselines: {
      template: function template(data) {
        var me = this,
            baseline = data.baseline,
            task = baseline.task,
            delayed = task.startDate > baseline.startDate,
            overrun = task.durationMS > baseline.durationMS;
        var decimalPrecision = me.decimalPrecision;

        if (decimalPrecision == null) {
          decimalPrecision = me.client.durationDisplayPrecision;
        }

        var multiplier = Math.pow(10, decimalPrecision),
            displayDuration = Math.round(baseline.duration * multiplier) / multiplier;
        return "\n                    <div class=\"b-gantt-task-title\">".concat(task.name, " (").concat(me.L('baseline'), " ").concat(baseline.parentIndex + 1, ")</div>\n                    <table>\n                    <tr><td>").concat(me.L('Start'), ":</td><td>").concat(data.startClockHtml, "</td></tr>\n                    ").concat(baseline.milestone ? '' : "\n                        <tr><td>".concat(me.L('End'), ":</td><td>").concat(data.endClockHtml, "</td></tr>\n                        <tr><td>").concat(me.L('Duration'), ":</td><td class=\"b-right\">").concat(displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(baseline.durationUnit, baseline.duration !== 1), "</td></tr>\n                    "), "\n                    </table>\n                    ").concat(delayed ? "\n                        <h4 class=\"statusmessage b-baseline-delay\"><i class=\"statusicon b-fa b-fa-exclamation-triangle\"></i>".concat(me.L('Delayed start by'), " ").concat(DateHelper.formatDelta(task.startDate - baseline.startDate), "</h4>\n                    ") : '', "\n                    ").concat(overrun ? "\n                        <h4 class=\"statusmessage b-baseline-overrun\"><i class=\"statusicon b-fa b-fa-exclamation-triangle\"></i>".concat(me.L('Overrun by'), " ").concat(DateHelper.formatDelta(task.durationMS - baseline.durationMS), "</h4>\n                    ") : '', "\n                    ");
      }
    },
    columnLines: false,
    filter: true,
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
  flex: 1,
  layout: 'fit',
  items: [gantt],
  tbar: {
    items: [{
      cls: 'b-blue',
      type: 'button',
      text: 'Set baseline',
      icon: 'b-fa-bars',
      iconAlign: 'end',
      menu: [{
        text: 'Set baseline 1',
        onItem: function onItem() {
          setBaseline(1);
        }
      }, {
        text: 'Set baseline 2',
        onItem: function onItem() {
          setBaseline(2);
        }
      }, {
        text: 'Set baseline 3',
        onItem: function onItem() {
          setBaseline(3);
        }
      }]
    }, {
      cls: 'b-blue',
      type: 'button',
      text: 'Show baseline',
      icon: 'b-fa-bars',
      iconAlign: 'end',
      menu: [{
        checked: true,
        text: 'Baseline 1',
        onToggle: function onToggle(_ref) {
          var checked = _ref.checked;
          toggleBaselineVisible(1, checked);
        }
      }, {
        checked: true,
        text: 'Baseline 2',
        onToggle: function onToggle(_ref2) {
          var checked = _ref2.checked;
          toggleBaselineVisible(2, checked);
        }
      }, {
        checked: true,
        text: 'Baseline 3',
        onToggle: function onToggle(_ref3) {
          var checked = _ref3.checked;
          toggleBaselineVisible(3, checked);
        }
      }]
    }, {
      cls: 'b-blue',
      type: 'checkbox',
      text: 'Show baselines',
      checked: true,
      toggleable: true,
      onAction: function onAction(_ref4) {
        var checked = _ref4.checked;
        gantt.features.baselines.disabled = !checked;
      }
    }]
  }
});
project.load();