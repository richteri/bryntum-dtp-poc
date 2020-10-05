function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    TaskModel = _bryntum$gantt.TaskModel;
/* eslint-disable no-unused-vars */

var MyTaskModel = /*#__PURE__*/function (_TaskModel) {
  _inherits(MyTaskModel, _TaskModel);

  var _super = _createSuper(MyTaskModel);

  function MyTaskModel() {
    _classCallCheck(this, MyTaskModel);

    return _super.apply(this, arguments);
  }

  _createClass(MyTaskModel, null, [{
    key: "fields",
    get: function get() {
      return [{
        name: 'cost',
        type: 'number'
      }];
    }
  }]);

  return MyTaskModel;
}(TaskModel); // Must happen now so that field definitions are added to the prototype chain's fieldMap


MyTaskModel.exposeProperties();
var project = new ProjectModel({
  taskModelClass: MyTaskModel,
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
}),
    gantt = new Gantt({
  adopt: 'container',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    width: 250
  }, {
    type: 'startdate'
  }, {
    type: 'duration'
  }, {
    type: 'aggregate',
    text: 'Cost<br><span style="font-size:0.8em">(aggregated)</span>',
    field: 'cost',
    width: 100,
    htmlEncode: false,
    renderer: function renderer(_ref) {
      var record = _ref.record,
          value = _ref.value;
      return record.isLeaf ? "$".concat(value || 0) : "<b>$".concat(value || 0, "</b>");
    }
  }],
  features: {
    taskEdit: {
      editorConfig: {
        height: '37em',
        extraItems: {
          generaltab: [{
            html: '',
            ref: 'costGroup',
            dataset: {
              text: 'Cost'
            },
            cls: 'b-divider',
            flex: '1 0 100%'
          }, {
            type: 'number',
            ref: 'costField',
            name: 'cost',
            label: 'Cost',
            flex: '.5 0',
            cls: 'b-inline'
          }]
        }
      }
    }
  },
  listeners: {
    // Disable Cost editing for parent tasks
    beforeTaskEdit: function beforeTaskEdit(_ref2) {
      var taskRecord = _ref2.taskRecord;
      gantt.taskEdit.editor.widgetMap.costField.disabled = !taskRecord.isLeaf;
    }
  }
});
project.load();