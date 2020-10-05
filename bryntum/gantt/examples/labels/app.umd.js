function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    DateHelper = _bryntum$gantt.DateHelper;
/* eslint-disable no-unused-vars */

function reconfigureGantt(_ref) {
  var source = _ref.source;
  gantt.blockRefresh = true;
  gantt.features.labels.setConfig(source.featureSpec);
  gantt.rowHeight = source.rowHeight;
  gantt.barMargin = source.barMargin;
  gantt.blockRefresh = false;
  gantt.refresh(true);
}

var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});

var topLabel = {
  field: 'name',
  editor: {
    type: 'textfield'
  }
},
    bottomLabel = {
  field: 'startDate',
  renderer: function renderer(_ref2) {
    var taskRecord = _ref2.taskRecord;
    return DateHelper.format(taskRecord.startDate, 'DD-MMM-Y');
  }
},
    leftLabel = {
  renderer: function renderer(_ref3) {
    var taskRecord = _ref3.taskRecord;
    return 'Id: ' + taskRecord.id;
  }
},
    rightLabel = {
  renderer: function renderer(_ref4) {
    var taskRecord = _ref4.taskRecord;
    return taskRecord.duration + ' ' + DateHelper.getLocalizedNameOfUnit(taskRecord.durationUnit, taskRecord.duration !== 1);
  }
},
    _WidgetHelper$append = WidgetHelper.append([{
  type: 'buttonGroup',
  items: [{
    text: 'Top + Bottom',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 70,
    barMargin: 5,
    cls: 'b-orange b-raised',
    ref: 'top',
    pressed: true,
    featureSpec: {
      top: topLabel,
      bottom: bottomLabel,
      left: null,
      right: null
    }
  }, {
    text: 'Left + Right',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 45,
    barMargin: 10,
    cls: 'b-orange b-raised',
    featureSpec: {
      top: null,
      bottom: null,
      left: leftLabel,
      right: rightLabel
    }
  }, {
    text: 'All',
    toggleGroup: 'labels',
    listeners: {
      toggle: reconfigureGantt
    },
    rowHeight: 70,
    barMargin: 5,
    cls: 'b-orange b-raised',
    featureSpec: {
      top: topLabel,
      bottom: bottomLabel,
      left: leftLabel,
      right: rightLabel
    }
  }]
}], {
  insertFirst: document.getElementById('tools') || document.body
}),
    _WidgetHelper$append2 = _slicedToArray(_WidgetHelper$append, 1),
    buttons = _WidgetHelper$append2[0],
    gantt = new Gantt({
  adopt: 'container',
  startDate: '2019-01-08',
  endDate: '2019-04-01',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }],
  viewPreset: 'weekAndDayLetter',
  rowHeight: buttons.widgetMap.top.rowHeight,
  barMargin: buttons.widgetMap.top.barMargin,
  features: {
    labels: buttons.widgetMap.top.featureSpec
  }
});

project.load();