function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _bryntum$gantt = bryntum.gantt,
    Grid = _bryntum$gantt.Grid,
    BryntumWidgetAdapterRegister = _bryntum$gantt.BryntumWidgetAdapterRegister,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    Panel = _bryntum$gantt.Panel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    Splitter = _bryntum$gantt.Splitter;
/* eslint-disable no-unused-vars */

var TimeRangesGrid = /*#__PURE__*/function (_Grid) {
  _inherits(TimeRangesGrid, _Grid);

  var _super = _createSuper(TimeRangesGrid);

  function TimeRangesGrid() {
    _classCallCheck(this, TimeRangesGrid);

    return _super.apply(this, arguments);
  }

  _createClass(TimeRangesGrid, [{
    key: "construct",
    value: function construct(config) {
      _get(_getPrototypeOf(TimeRangesGrid.prototype), "construct", this).call(this, config);
    }
  }], [{
    key: "defaultConfig",
    get: function get() {
      return {
        features: {
          stripe: true,
          sort: 'startDate'
        },
        columns: [{
          text: 'Time ranges',
          flex: 1,
          field: 'name'
        }, {
          type: 'date',
          text: 'Start Date',
          width: 110,
          align: 'right',
          field: 'startDate'
        }, {
          type: 'number',
          text: 'Duration',
          width: 100,
          field: 'duration',
          min: 0,
          instantUpdate: true,
          renderer: function renderer(data) {
            return "".concat(data.record.duration, " d");
          }
        }]
      };
    }
  }]);

  return TimeRangesGrid;
}(Grid);

;
BryntumWidgetAdapterRegister.register('timerangesgrid', TimeRangesGrid);
/* eslint-disable no-unused-vars */

WidgetHelper.append([{
  type: 'button',
  toggleable: true,
  color: 'b-blue b-raised',
  text: 'Show header elements',
  tooltip: 'Toggles the rendering of time range header elements',
  pressed: true,
  icon: 'b-fa-square',
  pressedIcon: 'b-fa-check-square',
  onClick: function onClick(_ref) {
    var button = _ref.source;
    gantt.features.timeRanges.showHeaderElements = button.pressed;
  }
}], {
  insertFirst: document.getElementById('tools') || document.body
});
var project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/timeranges.json'
    }
  }
});
var gantt = new Gantt({
  flex: '1 1 auto',
  appendTo: 'main',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    width: 250
  }],
  features: {
    timeRanges: {
      enableResizing: true,
      showCurrentTimeLine: false,
      showHeaderElements: true
    }
  }
});
project.load();
var timeRangeStore = gantt.features.timeRanges.store;
new Splitter({
  appendTo: 'main'
});
new Panel({
  id: 'timerangesContainer',
  flex: '0 0 350px',
  layout: 'fit',
  appendTo: 'main',
  items: [{
    type: 'timerangesgrid',
    store: timeRangeStore
  }],
  bbar: [{
    type: 'button',
    text: 'Add',
    icon: 'b-fa-plus',
    cls: 'b-green',
    tooltip: 'Add new time range',
    onClick: function onClick() {
      timeRangeStore.add({
        name: 'New range',
        startDate: new Date(2019, 1, 27),
        duration: 5
      });
    }
  }]
});