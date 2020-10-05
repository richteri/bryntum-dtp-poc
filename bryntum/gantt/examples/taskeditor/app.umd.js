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
    BryntumWidgetAdapterRegister = _bryntum$gantt.BryntumWidgetAdapterRegister,
    Combo = _bryntum$gantt.Combo,
    Grid = _bryntum$gantt.Grid,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    TaskModel = _bryntum$gantt.TaskModel;
var baseColors = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray', 'silver', 'white'];

var ColorField = /*#__PURE__*/function (_Combo) {
  _inherits(ColorField, _Combo);

  var _super = _createSuper(ColorField);

  function ColorField() {
    _classCallCheck(this, ColorField);

    return _super.apply(this, arguments);
  }

  _createClass(ColorField, null, [{
    key: "type",
    get: function get() {
      return 'colorfield';
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        clearable: true,
        items: baseColors,
        picker: {
          cls: 'b-color-picker-container',
          itemCls: 'b-color-picker-item',
          itemTpl: function itemTpl(item) {
            return "<div style=\"background-color:".concat(item.id, "\"></div>");
          }
        }
      };
    }
  }]);

  return ColorField;
}(Combo);

BryntumWidgetAdapterRegister.register(ColorField.type, ColorField);
/**
 * @module FilesTab
 */

/**
 * @internal
 */

var FilesTab = /*#__PURE__*/function (_Grid) {
  _inherits(FilesTab, _Grid);

  var _super2 = _createSuper(FilesTab);

  function FilesTab() {
    _classCallCheck(this, FilesTab);

    return _super2.apply(this, arguments);
  }

  _createClass(FilesTab, [{
    key: "loadEvent",
    value: function loadEvent(eventRecord) {
      var files = [];

      for (var i = 0; i < Math.random() * 10; i++) {
        var nbr = Math.round(Math.random() * 5);

        switch (nbr) {
          case 1:
            files.push({
              name: "Image".concat(nbr, ".pdf"),
              icon: 'image'
            });
            break;

          case 2:
            files.push({
              name: "Charts".concat(nbr, ".pdf"),
              icon: 'chart-pie'
            });
            break;

          case 3:
            files.push({
              name: "Spreadsheet".concat(nbr, ".pdf"),
              icon: 'file-excel'
            });
            break;

          case 4:
            files.push({
              name: "Document".concat(nbr, ".pdf"),
              icon: 'file-word'
            });
            break;

          case 5:
            files.push({
              name: "Report".concat(nbr, ".pdf"),
              icon: 'user-chart'
            });
            break;
        }
      }

      this.store.data = files;
    }
  }], [{
    key: "type",
    get: function get() {
      return 'filestab';
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        title: 'Files',
        defaults: {
          labelWidth: 200
        },
        columns: [{
          text: 'Files attached to task',
          field: 'name',
          type: 'template',
          template: function template(data) {
            return "<i class=\"b-fa b-fa-fw b-fa-".concat(data.record.data.icon, "\"></i>").concat(data.record.data.name);
          }
        }]
      };
    }
  }]);

  return FilesTab;
}(Grid);

BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab);
/* eslint-disable no-unused-vars */

var MyModel = /*#__PURE__*/function (_TaskModel) {
  _inherits(MyModel, _TaskModel);

  var _super3 = _createSuper(MyModel);

  function MyModel() {
    _classCallCheck(this, MyModel);

    return _super3.apply(this, arguments);
  }

  _createClass(MyModel, null, [{
    key: "fields",
    get: function get() {
      return [{
        name: 'deadline',
        type: 'date'
      }, {
        name: 'color'
      }];
    }
  }]);

  return MyModel;
}(TaskModel);

var project = window.project = new ProjectModel({
  taskModelClass: MyModel,
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
var gantt = new Gantt({
  adopt: 'container',
  features: {
    taskEdit: {
      editorConfig: {
        height: '37em',
        extraItems: {
          generaltab: [{
            html: '',
            dataset: {
              text: 'Custom fields'
            },
            cls: 'b-divider',
            flex: '1 0 100%'
          }, {
            type: 'datefield',
            ref: 'deadlineField',
            name: 'deadline',
            label: 'Deadline',
            flex: '1 0 50%',
            cls: 'b-inline'
          }, {
            type: 'colorfield',
            ref: 'colorField',
            name: 'color',
            label: 'Color',
            flex: '1 0 50%',
            cls: 'b-inline'
          }]
        }
      },
      tabsConfig: {
        // change title of General tab
        generaltab: {
          title: 'Common'
        },
        // remove Notes tab
        notestab: false,
        // add custom Files tab
        filestab: {
          type: 'filestab'
        }
      }
    }
  },
  taskRenderer: function taskRenderer(_ref) {
    var taskRecord = _ref.taskRecord,
        tplData = _ref.tplData;

    if (taskRecord.color) {
      tplData.style += "background-color:".concat(taskRecord.color);
    }
  },
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }, {
    type: 'date',
    field: 'deadline',
    text: 'Deadline'
  }],
  project: project
});
project.load();