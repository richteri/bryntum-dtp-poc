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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should support configuring extra widgets for each tab', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskEdit: {
          editorConfig: {
            height: '40em',
            extraItems: {
              generaltab: [{
                type: 'button',
                text: 'general'
              }],
              successorstab: [{
                type: 'button',
                text: 'successors'
              }],
              predecessorstab: [{
                type: 'button',
                text: 'predecessors'
              }],
              resourcestab: [{
                type: 'button',
                text: 'resources'
              }],
              advancedtab: [{
                type: 'button',
                text: 'advanced'
              }],
              notestab: [{
                type: 'button',
                text: 'notes'
              }]
            }
          }
        }
      }
    });
    var steps = [];
    ['general', 'successors', 'predecessors', 'resources', 'advanced', 'notes'].forEach(function (text, i) {
      steps.push({
        click: ".b-tabpanel-tab:nth-child(".concat(i + 1, ")")
      }, {
        waitForSelector: ".b-".concat(text, "tab .b-button:contains(").concat(text, ")")
      });
    });
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt.editTask(gantt.taskStore.getById(11));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), steps);
  }); // https://app.assembla.com/spaces/bryntum/tickets/8785

  t.it('Should support configuring listeners', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskEdit: {
          editorConfig: {
            listeners: {
              beforeClose: function beforeClose() {}
            }
          }
        }
      }
    });
    var editor = gantt.features.taskEdit.getEditor();
    t.ok(editor.listeners.cancel, 'Cancel listener is present');
    t.ok(editor.listeners.delete, 'Delete listener is present');
    t.ok(editor.listeners.save, 'Save listener is present');
    t.ok(editor.listeners.requestpropagation, 'RequestPropagation listener is present');
    t.ok(editor.listeners.beforeclose, 'BeforeClose listener is present');
  }); // https://app.assembla.com/spaces/bryntum/tickets/8885

  t.it('tabsConfig is not taken into account by TaskEditor', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var FilesTab, features;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // #region FilesTab
              FilesTab = /*#__PURE__*/function (_Grid) {
                _inherits(FilesTab, _Grid);

                var _super = _createSuper(FilesTab);

                function FilesTab() {
                  _classCallCheck(this, FilesTab);

                  return _super.apply(this, arguments);
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
                  key: "$name",
                  get: function get() {
                    return 'FilesTab';
                  }
                }, {
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
                        htmlEncode: false,
                        renderer: function renderer(_ref3) {
                          var record = _ref3.record;
                          return "<i class=\"b-fa b-fa-fw b-fa-".concat(record.data.icon, "\"></i>").concat(record.data.name);
                        }
                      }]
                    };
                  }
                }]);

                return FilesTab;
              }(Grid);

              BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab); // #endregion FilesTab
              // #region features config

              features = {
                taskTooltip: false,
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
              }; // #endregion features config

              gantt = t.getGantt({
                appendTo: document.body,
                features: features
              });
              t.chain({
                dblClick: '.b-gantt-task.id11'
              }, {
                waitForSelector: '.b-taskeditor',
                desc: 'Task editor appeared'
              }, {
                waitForSelector: '.b-tabpanel-tab-title:textEquals(Common)',
                desc: 'Renamed General -> Common tab appeared'
              }, {
                waitForSelectorNotFound: '.b-tabpanel-tab-title:textEquals(Notes)',
                desc: 'Notes tab is removed'
              }, function (next) {
                t.ok(gantt.taskEdit.editor.widgetMap.deadlineField, 'Custom Deadline field appeared');
                next();
              }, {
                waitForSelector: '.b-tabpanel-tab :textEquals(Files)',
                desc: 'Files tab appeared'
              }, {
                click: '.b-tabpanel-tab :textEquals(Files)'
              }, {
                waitFor: function waitFor() {
                  return gantt.taskEdit.editor.widgetMap.tabs.activeItem.$name === 'FilesTab';
                },
                desc: 'Files tab active'
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
});