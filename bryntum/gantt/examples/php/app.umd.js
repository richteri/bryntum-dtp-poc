function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
    Toolbar = _bryntum$gantt.Toolbar,
    Toast = _bryntum$gantt.Toast,
    DateHelper = _bryntum$gantt.DateHelper,
    CSSHelper = _bryntum$gantt.CSSHelper,
    Column = _bryntum$gantt.Column,
    ColumnStore = _bryntum$gantt.ColumnStore,
    TaskModel = _bryntum$gantt.TaskModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    Gantt = _bryntum$gantt.Gantt,
    Panel = _bryntum$gantt.Panel,
    ProjectModel = _bryntum$gantt.ProjectModel,
    EffectResolutionResult = _bryntum$gantt.EffectResolutionResult;
/**
 * @module GanttToolbar
 */

/**
 * @extends Core/widget/Toolbar
 */

var GanttToolbar = /*#__PURE__*/function (_Toolbar) {
  _inherits(GanttToolbar, _Toolbar);

  var _super = _createSuper(GanttToolbar);

  function GanttToolbar() {
    _classCallCheck(this, GanttToolbar);

    return _super.apply(this, arguments);
  }

  _createClass(GanttToolbar, [{
    key: "construct",
    value: function construct(config) {
      var me = this,
          gantt = me.gantt = me.owner = config.gantt,
          project = gantt.project;
      project.on({
        load: me.updateStartDateField,
        propagationComplete: me.updateStartDateField,
        thisObj: me
      });
      var stm = project.stm;
      stm.on({
        recordingstop: me.updateUndoRedoButtons,
        restoringstop: me.updateUndoRedoButtons,
        stmDisabled: me.updateUndoRedoButtons,
        queueReset: me.updateUndoRedoButtons,
        thisObj: me
      });

      _get(_getPrototypeOf(GanttToolbar.prototype), "construct", this).call(this, config);

      me.styleNode = document.createElement('style');
      document.head.appendChild(me.styleNode);
    }
  }, {
    key: "updateUndoRedoButtons",
    value: function updateUndoRedoButtons() {
      var stm = this.gantt.project.stm,
          _this$widgetMap = this.widgetMap,
          undoBtn = _this$widgetMap.undoBtn,
          redoBtn = _this$widgetMap.redoBtn,
          redoCount = stm.length - stm.position;
      undoBtn.badge = stm.position || '';
      redoBtn.badge = redoCount || '';
      undoBtn.disabled = !stm.canUndo;
      redoBtn.disabled = !stm.canRedo;
    }
  }, {
    key: "setAnimationDuration",
    value: function setAnimationDuration(value) {
      var me = this,
          cssText = ".b-animating .b-gantt-task-wrap { transition-duration: ".concat(value / 1000, "s !important; }");
      me.gantt.transitionDuration = value;

      if (me.transitionRule) {
        me.transitionRule.cssText = cssText;
      } else {
        me.transitionRule = CSSHelper.insertRule(cssText);
      }
    }
  }, {
    key: "updateStartDateField",
    value: function updateStartDateField() {
      var startDateField = this.widgetMap.startDateField;
      startDateField.value = this.gantt.project.startDate; // This handler is called on project.load/propagationComplete, so now we have the
      // initial start date. Prior to this time, the empty (default) value would be
      // flagged as invalid.

      startDateField.required = true;
    } // region controller methods

  }, {
    key: "onAddTaskClick",
    value: function () {
      var _onAddTaskClick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var gantt, added;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                gantt = this.gantt, added = gantt.taskStore.rootNode.appendChild({
                  name: 'New task',
                  duration: 1
                }); // run propagation to calculate new task fields

                _context.next = 3;
                return gantt.project.propagate();

              case 3:
                _context.next = 5;
                return gantt.scrollRowIntoView(added);

              case 5:
                gantt.features.cellEdit.startEditing({
                  record: added,
                  field: 'name'
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onAddTaskClick() {
        return _onAddTaskClick.apply(this, arguments);
      }

      return onAddTaskClick;
    }()
  }, {
    key: "onEditTaskClick",
    value: function onEditTaskClick() {
      var gantt = this.gantt;

      if (gantt.selectedRecord) {
        gantt.editTask(gantt.selectedRecord);
      } else {
        Toast.show('First select the task you want to edit');
      }
    }
  }, {
    key: "onExpandAllClick",
    value: function onExpandAllClick() {
      this.gantt.expandAll();
    }
  }, {
    key: "onCollapseAllClick",
    value: function onCollapseAllClick() {
      this.gantt.collapseAll();
    }
  }, {
    key: "onZoomInClick",
    value: function onZoomInClick() {
      this.gantt.zoomIn();
    }
  }, {
    key: "onZoomOutClick",
    value: function onZoomOutClick() {
      this.gantt.zoomOut();
    }
  }, {
    key: "onZoomToFitClick",
    value: function onZoomToFitClick() {
      this.gantt.zoomToFit({
        leftMargin: 50,
        rightMargin: 50
      });
    }
  }, {
    key: "onShiftPreviousClick",
    value: function onShiftPreviousClick() {
      this.gantt.shiftPrevious();
    }
  }, {
    key: "onShiftNextClick",
    value: function onShiftNextClick() {
      this.gantt.shiftNext();
    }
  }, {
    key: "onStartDateChange",
    value: function onStartDateChange(_ref) {
      var value = _ref.value,
          oldValue = _ref.oldValue;

      if (!oldValue) {
        // ignore initial set
        return;
      }

      this.gantt.startDate = DateHelper.add(value, -1, 'week');
      this.gantt.project.setStartDate(value);
    }
  }, {
    key: "onFilterChange",
    value: function onFilterChange(_ref2) {
      var value = _ref2.value;

      if (value === '') {
        this.gantt.taskStore.clearFilters();
      } else {
        value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.gantt.taskStore.filter({
          filters: function filters(task) {
            return task.name && task.name.match(new RegExp(value, 'i'));
          },
          replace: true
        });
      }
    }
  }, {
    key: "onFeaturesClick",
    value: function onFeaturesClick(_ref3) {
      var item = _ref3.source;
      var gantt = this.gantt;

      if (item.feature) {
        var feature = gantt.features[item.feature];
        feature.disabled = !feature.disabled;
      } else if (item.subGrid) {
        var subGrid = gantt.subGrids[item.subGrid];
        subGrid.collapsed = !subGrid.collapsed;
      }
    }
  }, {
    key: "onFeaturesShow",
    value: function onFeaturesShow(_ref4) {
      var menu = _ref4.source;
      var gantt = this.gantt;
      menu.items.map(function (item) {
        var feature = item.feature;

        if (feature) {
          // a feature might be not presented in the gantt
          // (the code is shared between "advanced" and "php" demos which use a bit different set of features)
          if (gantt.features[feature]) {
            item.checked = !gantt.features[feature].disabled;
          } // hide not existing features
          else {
              item.hide();
            }
        } else {
          item.checked = gantt.subGrids[item.subGrid].collapsed;
        }
      });
    }
  }, {
    key: "onSettingsShow",
    value: function onSettingsShow(_ref5) {
      var menu = _ref5.source;
      var gantt = this.gantt,
          widgetMap = menu.widgetMap;
      widgetMap.rowHeight.value = gantt.rowHeight;
      widgetMap.barMargin.value = gantt.barMargin;
      widgetMap.barMargin.max = gantt.rowHeight / 2 - 5;
      widgetMap.duration.value = gantt.transitionDuration;
    }
  }, {
    key: "onSettingsRowHeightChange",
    value: function onSettingsRowHeightChange(_ref6) {
      var value = _ref6.value;
      this.gantt.rowHeight = value;
      this.widgetMap.settingsButton.menu.widgetMap.barMargin.max = value / 2 - 5;
    }
  }, {
    key: "onSettingsMarginChange",
    value: function onSettingsMarginChange(_ref7) {
      var value = _ref7.value;
      this.gantt.barMargin = value;
    }
  }, {
    key: "onSettingsDurationChange",
    value: function onSettingsDurationChange(_ref8) {
      var value = _ref8.value;
      this.gantt.transitionDuration = value;
      this.styleNode.innerHTML = ".b-animating .b-gantt-task-wrap { transition-duration: ".concat(value / 1000, "s !important; }");
    }
  }, {
    key: "onCriticalPathsClick",
    value: function onCriticalPathsClick(_ref9) {
      var source = _ref9.source;
      this.gantt.features.criticalPaths.disabled = !source.pressed;
    }
  }, {
    key: "onUndoClick",
    value: function onUndoClick() {
      this.gantt.project.stm.canUndo && this.gantt.project.stm.undo();
    }
  }, {
    key: "onRedoClick",
    value: function onRedoClick() {
      this.gantt.project.stm.canRedo && this.gantt.project.stm.redo();
    } // endregion

  }], [{
    key: "$name",
    get: function get() {
      return 'GanttToolbar';
    }
  }, {
    key: "defaultConfig",
    get: function get() {
      return {
        items: [{
          type: 'buttonGroup',
          items: [{
            type: 'button',
            color: 'b-green',
            ref: 'addTaskButton',
            icon: 'b-fa b-fa-plus',
            text: 'Create',
            tooltip: 'Create new task',
            onAction: 'up.onAddTaskClick'
          }]
        }, {
          type: 'buttonGroup',
          items: [{
            type: 'button',
            color: 'b-blue',
            ref: 'editTaskButton',
            icon: 'b-fa b-fa-pen',
            text: 'Edit',
            tooltip: 'Edit selected task',
            onAction: 'up.onEditTaskClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'undoBtn',
            icon: 'b-icon b-fa b-fa-undo',
            tooltip: 'Undo',
            disabled: true,
            width: '2em',
            onAction: 'up.onUndoClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'redoBtn',
            icon: 'b-icon b-fa b-fa-redo',
            tooltip: 'Redo',
            disabled: true,
            width: '2em',
            onAction: 'up.onRedoClick'
          }]
        }, {
          type: 'buttonGroup',
          items: [{
            type: 'button',
            color: 'b-blue',
            ref: 'expandAllButton',
            icon: 'b-fa b-fa-angle-double-down',
            tooltip: 'Expand all',
            onAction: 'up.onExpandAllClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'collapseAllButton',
            icon: 'b-fa b-fa-angle-double-up',
            tooltip: 'Collapse all',
            onAction: 'up.onCollapseAllClick'
          }]
        }, {
          type: 'buttonGroup',
          items: [{
            type: 'button',
            color: 'b-blue',
            ref: 'zoomInButton',
            icon: 'b-fa b-fa-search-plus',
            tooltip: 'Zoom in',
            onAction: 'up.onZoomInClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'zoomOutButton',
            icon: 'b-fa b-fa-search-minus',
            tooltip: 'Zoom out',
            onAction: 'up.onZoomOutClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'zoomToFitButton',
            icon: 'b-fa b-fa-compress-arrows-alt',
            tooltip: 'Zoom to fit',
            onAction: 'up.onZoomToFitClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'previousButton',
            icon: 'b-fa b-fa-angle-left',
            tooltip: 'Previous time span',
            onAction: 'up.onShiftPreviousClick'
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'nextButton',
            icon: 'b-fa b-fa-angle-right',
            tooltip: 'Next time span',
            onAction: 'up.onShiftNextClick'
          }]
        }, {
          type: 'buttonGroup',
          items: [{
            type: 'button',
            color: 'b-blue',
            ref: 'featuresButton',
            icon: 'b-fa b-fa-tasks',
            text: 'Features',
            tooltip: 'Toggle features',
            toggleable: true,
            menu: {
              onItem: 'up.onFeaturesClick',
              onBeforeShow: 'up.onFeaturesShow',
              items: [{
                text: 'Draw dependencies',
                feature: 'dependencies',
                checked: false
              }, {
                text: 'Task labels',
                feature: 'labels',
                checked: false
              }, {
                text: 'Project lines',
                feature: 'projectLines',
                checked: false
              }, {
                text: 'Highlight non-working time',
                feature: 'nonWorkingTime',
                checked: false
              }, {
                text: 'Enable cell editing',
                feature: 'cellEdit',
                checked: false
              }, {
                text: 'Show baselines',
                feature: 'baselines',
                checked: false
              }, {
                text: 'Show rollups',
                feature: 'rollups',
                checked: false
              }, {
                text: 'Show progress line',
                feature: 'progressLine',
                checked: false
              }, {
                text: 'Hide schedule',
                cls: 'b-separator',
                subGrid: 'normal',
                checked: false
              }]
            }
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'settingsButton',
            icon: 'b-fa b-fa-cogs',
            text: 'Settings',
            tooltip: 'Adjust settings',
            toggleable: true,
            menu: {
              type: 'popup',
              anchor: true,
              cls: 'settings-menu',
              layoutStyle: {
                flexDirection: 'column'
              },
              onBeforeShow: 'up.onSettingsShow',
              items: [{
                type: 'slider',
                ref: 'rowHeight',
                text: 'Row height',
                width: '12em',
                showValue: true,
                min: 30,
                max: 70,
                onInput: 'up.onSettingsRowHeightChange'
              }, {
                type: 'slider',
                ref: 'barMargin',
                text: 'Bar margin',
                width: '12em',
                showValue: true,
                min: 0,
                max: 10,
                onInput: 'up.onSettingsMarginChange'
              }, {
                type: 'slider',
                ref: 'duration',
                text: 'Animation duration ',
                width: '12em',
                min: 0,
                max: 2000,
                step: 100,
                showValue: true,
                onInput: 'up.onSettingsDurationChange'
              }]
            }
          }, {
            type: 'button',
            color: 'b-blue',
            ref: 'criticalPathsButton',
            icon: 'b-fa b-fa-fire',
            text: 'Critical paths',
            tooltip: 'Highlight critical paths',
            toggleable: true,
            onAction: 'up.onCriticalPathsClick'
          }]
        }, {
          type: 'datefield',
          ref: 'startDateField',
          label: 'Project start',
          // required  : true, (done on load)
          flex: '1 2 17em',
          listeners: {
            change: 'up.onStartDateChange'
          }
        }, {
          type: 'textfield',
          ref: 'filterByName',
          cls: 'filter-by-name',
          flex: '1 1 12.5em',
          // Label used for material, hidden in other themes
          label: 'Find tasks by name',
          // Placeholder for others
          placeholder: 'Find tasks by name',
          clearable: true,
          keyStrokeChangeDelay: 100,
          triggers: {
            filter: {
              align: 'end',
              cls: 'b-fa b-fa-filter'
            }
          },
          onChange: 'up.onFilterChange'
        }]
      };
    }
  }]);

  return GanttToolbar;
}(Toolbar);

;
/**
 * @module StatusColumn
 */

/**
 * A column showing the status of a task
 *
 * @extends Gantt/column/Column
 * @classType statuscolumn
 */

var StatusColumn = /*#__PURE__*/function (_Column) {
  _inherits(StatusColumn, _Column);

  var _super2 = _createSuper(StatusColumn);

  function StatusColumn() {
    _classCallCheck(this, StatusColumn);

    return _super2.apply(this, arguments);
  }

  _createClass(StatusColumn, [{
    key: "renderer",
    //endregion
    value: function renderer(_ref10) {
      var record = _ref10.record;
      var status = '';

      if (record.isCompleted) {
        status = 'Completed';
      } else if (record.endDate < Date.now()) {
        status = 'Late';
      } else if (record.isStarted) {
        status = 'Started';
      }

      return status ? {
        tag: 'i',
        className: "b-fa b-fa-circle ".concat(status),
        html: status
      } : '';
    }
  }], [{
    key: "type",
    get: function get() {
      return 'statuscolumn';
    }
  }, {
    key: "isGanttColumn",
    get: function get() {
      return true;
    }
  }, {
    key: "defaults",
    get: function get() {
      return {
        // Set your default instance config properties here
        text: 'Status',
        editor: false,
        cellCls: 'b-status-column-cell',
        htmlEncode: false
      };
    }
  }]);

  return StatusColumn;
}(Column);

ColumnStore.registerColumnType(StatusColumn); // here you can extend our default Task class with your additional fields, methods and logic

var Task = /*#__PURE__*/function (_TaskModel) {
  _inherits(Task, _TaskModel);

  var _super3 = _createSuper(Task);

  function Task() {
    _classCallCheck(this, Task);

    return _super3.apply(this, arguments);
  }

  _createClass(Task, [{
    key: "isLate",
    get: function get() {
      return this.deadline && Date.now() > this.deadline;
    }
  }], [{
    key: "fields",
    get: function get() {
      return [{
        name: 'deadline',
        type: 'date'
      }];
    }
  }]);

  return Task;
}(TaskModel);
/**
 * @module BackendTools
 */


var BackendTools = /*#__PURE__*/function () {
  //region Constructor
  function BackendTools(gantt) {
    _classCallCheck(this, BackendTools);

    var me = this;
    me.gantt = gantt;
    me.project = gantt.project;
    me.stm = me.project.stm;

    var _WidgetHelper$append = WidgetHelper.append([{
      ref: 'saveButton',
      type: 'button',
      icon: 'b-fa b-fa-cloud-upload-alt',
      color: 'b-green b-raised',
      text: 'Save',
      tooltip: 'Save changes to server',
      disabled: true,
      onAction: function onAction() {
        return me.onSaveClick();
      }
    }, {
      ref: 'loadButton',
      type: 'button',
      icon: 'b-fa b-fa-cloud-download-alt',
      color: 'b-blue b-raised',
      text: 'Load',
      tooltip: 'Load data from server',
      onAction: function onAction() {
        return me.onLoadClick();
      }
    }, {
      ref: 'resetButton',
      type: 'button',
      icon: 'b-fa b-fa-recycle',
      color: 'b-red b-raised',
      text: 'Reset',
      tooltip: 'Reset server data',
      style: 'margin-right: 1em',
      onAction: function onAction() {
        return me.onResetClick();
      }
    }], {
      insertFirst: document.getElementById('tools') || document.body
    });

    var _WidgetHelper$append2 = _slicedToArray(_WidgetHelper$append, 3);

    me.saveButton = _WidgetHelper$append2[0];
    me.loadButton = _WidgetHelper$append2[1];
    me.resetButton = _WidgetHelper$append2[2];
    // track project changes to disable/enable "Save" button
    gantt.project.on({
      load: me.onAfterLoadSync,
      sync: me.onAfterLoadSync,
      haschanges: me.onProjectChanges,
      nochanges: me.onProjectChanges,
      thisObj: me
    });
    gantt.on({
      startCellEdit: me.onStartCellEdit,
      cancelCellEdit: me.onEndCellEdit,
      finishCellEdit: me.onEndCellEdit,
      thisObj: me
    });
  } //endregion
  //region internal procedures


  _createClass(BackendTools, [{
    key: "loadFromServer",
    value: function loadFromServer(requestOptions) {
      Toast.hideAll();
      var me = this;

      function triggerLoadRequest() {
        me.project.load(requestOptions).catch(function () {});
      } // If task editor was open we wait until editing is canceled and then load or reset data


      if (me.gantt.features.taskEdit.isEditing) {
        me.gantt.on({
          taskEditCanceled: triggerLoadRequest,
          thisObj: me,
          once: true
        });
      } else {
        triggerLoadRequest();
      }
    } //endregion
    //region Listeners

  }, {
    key: "onProjectChanges",
    value: function onProjectChanges(_ref11) {
      var type = _ref11.type;
      // disable "Save" button if there is no changes in the project data
      this.saveButton.disabled = type === 'nochanges';
    }
  }, {
    key: "onAfterLoadSync",
    value: function onAfterLoadSync() {
      // since we load all the stores data from the server
      // we reset undo/redo queue (it no longer makes sense)
      this.stm.disable();
      this.stm.resetQueue();
      this.stm.enable();
    }
  }, {
    key: "onEndCellEdit",
    value: function onEndCellEdit() {
      this.editorContext = null;
    }
  }, {
    key: "onStartCellEdit",
    value: function onStartCellEdit(_ref12) {
      var editorContext = _ref12.editorContext;
      this.editorContext = editorContext;
    }
  }, {
    key: "onSaveClick",
    value: function onSaveClick() {
      // finish editing before changes persisting
      var me = this;
      me.editorContext && me.gantt.features.cellEdit.finishEditing(me.editorContext);
      me.project.sync().catch(function () {});
    }
  }, {
    key: "onLoadClick",
    value: function onLoadClick() {
      this.loadFromServer();
    }
  }, {
    key: "onResetClick",
    value: function onResetClick() {
      this.loadFromServer({
        reset: true
      });
    } //endregion
    //region Error handling

  }, {
    key: "serverError",
    value: function serverError(text, responseText) {
      console.error("Error: ".concat(text, "\nServer response:\n").concat(responseText));
      Toast.show({
        html: "Server response:<br>".concat(responseText, "<br>\n                    <b>Please make sure that you've read readme.md file carefully\n                    and setup the database connection accordingly.</b>"),
        color: 'b-red',
        style: 'color:white',
        timeout: 0
      });
    } //endregion

  }]);

  return BackendTools;
}();

;
var project = window.project = new ProjectModel({
  // Let the Project know we want to use our own Task model with custom fields / methods
  taskModelClass: Task,
  transport: {
    load: {
      url: 'php/load.php',
      paramName: 'q'
    },
    sync: {
      url: 'php/sync.php'
    }
  },
  listeners: {
    beforeSend: function beforeSend(_ref13) {
      var params = _ref13.params;
      // can be used to dynamically add arbitrary parameters to data load/sync requests
      // for example here we add "config" parameter (we use it for testing purposes)
      var queryString = new URLSearchParams(window.location.search);
      params.config = queryString.get('config') || '';
    },
    syncfail: function syncfail(_ref14) {
      var response = _ref14.response,
          responseText = _ref14.responseText;

      if (!response || !response.success) {
        backendTools.serverError('Could not sync the data with the server.', responseText);
      }
    }
  }
});
var gantt = new Gantt({
  project: project,
  startDate: '2019-01-12',
  endDate: '2019-03-24',
  resourceImageFolderPath: '../_shared/images/users/',
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
    type: 'percentdone',
    width: 70
  }, {
    type: 'resourceassignment',
    showAvatars: true,
    width: 120
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
    type: 'percentdone',
    showCircle: true,
    text: '%',
    width: 70
  }, {
    type: 'constrainttype'
  }, {
    type: 'constraintdate'
  }, {
    type: 'statuscolumn'
  }, {
    type: 'date',
    text: 'Deadline',
    field: 'deadline'
  }, {
    type: 'addnew'
  }],
  subGridConfigs: {
    locked: {
      flex: 1
    },
    normal: {
      flex: 2
    }
  },
  columnLines: false,
  features: {
    rollups: {
      disabled: true
    },
    progressLine: {
      disabled: true,
      statusDate: new Date(2019, 1, 10)
    },
    taskContextMenu: {
      // Our items is merged with the provided defaultItems
      // So we add the provided convertToMilestone option.
      items: {
        convertToMilestone: true
      },
      processItems: function processItems(_ref15) {
        var taskRecord = _ref15.taskRecord,
            items = _ref15.items;

        if (taskRecord.isMilestone) {
          items.convertToMilestone = false;
        }
      }
    },
    filter: true,
    dependencyEdit: true,
    timeRanges: {
      showCurrentTimeLine: true
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
}); // Add Save / Load / Reset buttons toolbar and server data load/sync handlers

var backendTools = new BackendTools(gantt);
new Panel({
  adopt: 'container',
  layout: 'fit',
  items: [gantt],
  tbar: new GanttToolbar({
    gantt: gantt
  })
}); // console.time("load data");

project.load().then(function () {
  // console.timeEnd("load data");
  var stm = gantt.project.stm;
  stm.enable();
  stm.autoRecord = true; // let's track scheduling conflicts happened

  project.on('schedulingconflict', function (context) {
    // show notification to user
    Toast.show('Scheduling conflict has happened ..recent changes were reverted'); // as the conflict resolution approach let's simply cancel the changes

    context.continueWithResolutionResult(EffectResolutionResult.Cancel);
  });
}).catch(function (_ref16) {
  var response = _ref16.response,
      responseText = _ref16.responseText;

  if (response && response.message) {
    Toast.show({
      html: "".concat(response.message, "<br>\n                    <b>Please make sure that you've read readme.md file carefully\n                    and setup the database connection accordingly.</b>"),
      cls: 'php-demo-error-message',
      timeout: 0
    });
  }
});