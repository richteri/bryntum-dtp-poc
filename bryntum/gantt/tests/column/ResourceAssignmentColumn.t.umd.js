function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global Gantt */
StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && gantt.destroy();
    gantt = null;
  }); // Here we check that effort column shows the same value which is showed in its editor #950

  t.it('Should render column properly', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var project, raColumn, gotData;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt = new Gantt({
                id: 'gantt',
                appendTo: document.body,
                rowHeight: 45,
                taskStore: t.getTaskStore(),
                resourceStore: t.getTeamResourceStore(),
                assignmentStore: t.getTeamAssignmentStore(),
                columns: [{
                  type: 'name',
                  text: 'Name',
                  width: 170,
                  field: 'name'
                }, {
                  type: ResourceAssignmentColumn.type,
                  id: 'resourceassignment',
                  width: 250
                }]
              });
              project = gantt.project;
              _context2.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              gotData = false;
              t.chain.apply(t, [{
                waitForRowsVisible: gantt
              }, function (next) {
                raColumn = gantt.columns.getById('resourceassignment');
                next();
              }].concat(_toConsumableArray(project.getEventStore().map(function (event) {
                return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var idx, _t$query, _t$query2, cellEl, valueElement;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return gantt.scrollCellIntoView({
                            id: event.id,
                            columnId: 'resourceassignment'
                          });

                        case 2:
                          idx = gantt.taskStore.allRecords.indexOf(event), _t$query = t.query(".b-grid-row[data-index=".concat(idx, "] .b-grid-cell[data-column-id=resourceassignment]")), _t$query2 = _slicedToArray(_t$query, 1), cellEl = _t$query2[0], valueElement = document.createElement('div');
                          gotData = gotData || cellEl.innerHTML != '';
                          raColumn.renderer({
                            value: event.assignments,
                            cellElement: valueElement
                          });
                          t.is(cellEl.innerHTML, valueElement.innerHTML, 'Rendered ok');

                        case 6:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));
              })), [function (next) {
                t.ok(gotData, 'Resource assignment column data has been rendered');
              }]));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Editor should be configurable with floating assignments behavior', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var run;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              run = /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(float) {
                  var project, eventStore, assignmentStore, task1, task1idx, Terence;
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          gantt = new Gantt({
                            id: 'gantt',
                            appendTo: document.body,
                            rowHeight: 45,
                            taskStore: t.getTaskStore(),
                            resourceStore: t.getTeamResourceStore(),
                            assignmentStore: t.getTeamAssignmentStore(),
                            columns: [{
                              type: 'name',
                              text: 'Name',
                              width: 170,
                              field: 'name'
                            }, {
                              type: ResourceAssignmentColumn.type,
                              width: 250,
                              editor: {
                                store: {
                                  floatAssignedResources: float
                                }
                              }
                            }]
                          });
                          project = gantt.project;
                          _context4.next = 4;
                          return project.waitForPropagateCompleted();

                        case 4:
                          eventStore = project.eventStore, assignmentStore = project.assignmentStore, task1 = eventStore.getById(115), task1idx = eventStore.allRecords.indexOf(task1), Terence = project.resourceStore.getById(12);
                          t.is(Terence.name, 'Terence', 'Got Terence'); // Assigning Terence to task1, Terence is the last resource if sorted just by name, so he will be shown
                          // last if rendered with floatAssignedResources : false config for assignment manipulation store, which
                          // column editor should pass through

                          assignmentStore.add({
                            event: task1,
                            resource: Terence
                          });
                          _context4.next = 9;
                          return project.propagate();

                        case 9:
                          _context4.next = 11;
                          return new Promise(function (resolve) {
                            t.chain({
                              waitForRowsVisible: gantt
                            }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                  switch (_context3.prev = _context3.next) {
                                    case 0:
                                      t.ok(Array.from(task1.assignments).some(function (a) {
                                        return a.resource === Terence;
                                      }), 'Terence is assigned to task1');

                                    case 1:
                                    case "end":
                                      return _context3.stop();
                                  }
                                }
                              }, _callee3);
                            })), {
                              dblClick: ".b-grid-row[data-index=".concat(task1idx, "] .b-grid-cell[data-column=assignments]")
                            }, {
                              click: '.b-assignmentfield .b-icon-down'
                            }, {
                              waitForElementVisible: '.b-assignmentpicker'
                            }, // Finding Terence row, it should be last row in the grid
                            function (next) {
                              var teranceRow = t.query(".b-assignmentpicker .b-grid-row:contains(".concat(Terence.name, ")"));
                              t.ok(teranceRow && teranceRow.length, "Got ".concat(Terence.name, " row"));
                              teranceRow = teranceRow[0];
                              var terrenceIndex = Number(teranceRow.dataset.index);
                              t.selectorExists(".b-assignmentpicker .b-grid-row[data-index=".concat(terrenceIndex, "]"), "".concat(Terence.name, " row query is valid"));

                              if (float) {
                                t.selectorExists(".b-assignmentpicker .b-grid-row[data-index=".concat(terrenceIndex + 1, "]"), "".concat(Terence.name, " row is not the last row"));
                              } else {
                                t.selectorNotExists(".b-assignmentpicker .b-grid-row[data-index=".concat(terrenceIndex + 1, "]"), "".concat(Terence.name, " row is the last row"));
                              }

                              resolve();
                            });
                          });

                        case 11:
                          gantt.destroy();
                          gantt = null;

                        case 13:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                }));

                return function run(_x3) {
                  return _ref4.apply(this, arguments);
                };
              }();

              t.diag('Testing with floating resources');
              _context5.next = 4;
              return run(true);

            case 4:
              t.diag('Testing w/o floating resources');
              _context5.next = 7;
              return run(false);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should be possible to edit assignments', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var project, eventStore, task1, task1idx, Arcady, assignmentField;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              gantt = new Gantt({
                id: 'gantt',
                appendTo: document.body,
                rowHeight: 45,
                taskStore: t.getTaskStore(),
                resourceStore: t.getTeamResourceStore(),
                assignmentStore: t.getTeamAssignmentStore(),
                columns: [{
                  type: 'name',
                  text: 'Name',
                  width: 170,
                  field: 'name'
                }, {
                  type: ResourceAssignmentColumn.type,
                  id: 'resourceassignment',
                  width: 250
                }]
              });
              project = gantt.project;
              _context7.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              eventStore = project.eventStore, task1 = eventStore.getById(115), task1idx = eventStore.allRecords.indexOf(task1), Arcady = project.resourceStore.getById(1);
              t.chain({
                waitForRowsVisible: gantt
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        t.ok(Array.from(task1.assignments).some(function (a) {
                          return a.resource.id === Arcady.id;
                        }), 'Arcady is initially assigned to task1');

                      case 1:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })), {
                dblClick: ".b-grid-row[data-index=".concat(task1idx, "] .b-grid-cell[data-column=assignments]")
              }, function (next) {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                t.click(assignmentField.triggers.expand.element).then(next);
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox'
              }, {
                click: '.b-assignmentpicker .b-button:contains(Save)'
              }, function (next) {
                t.notOk(Array.from(task1.assignments).some(function (a) {
                  return a.resource.id === Arcady.id;
                }), 'Arcady is now unassigned from task1');
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should be possible to remove assignments by removing the chip from the ChipView', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var project, eventStore, task1, task1idx, Arcady, assignmentField;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              gantt = new Gantt({
                id: 'gantt',
                appendTo: document.body,
                rowHeight: 45,
                taskStore: t.getTaskStore(),
                resourceStore: t.getTeamResourceStore(),
                assignmentStore: t.getTeamAssignmentStore(),
                columns: [{
                  type: 'name',
                  text: 'Name',
                  width: 170,
                  field: 'name'
                }, {
                  type: ResourceAssignmentColumn.type,
                  id: 'resourceassignment',
                  width: 250
                }]
              });
              project = gantt.project;
              _context9.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              eventStore = project.eventStore, task1 = eventStore.getById(115), task1idx = eventStore.allRecords.indexOf(task1), Arcady = project.resourceStore.getById(1);
              t.chain({
                waitForRowsVisible: gantt
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        t.ok(Array.from(task1.assignments).some(function (a) {
                          return a.resource.id === Arcady.id;
                        }), 'Arcady is initially assigned to task1');

                      case 1:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })), {
                dblClick: ".b-grid-row[data-index=".concat(task1idx, "] .b-grid-cell[data-column=assignments]")
              }, function (next) {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField; // Click the remove icon of Arcady's Chip

                t.click(assignmentField.chipView.getItem(0).querySelector('.b-icon-clear')).then(next);
              }, {
                click: '.b-assignmentpicker .b-button:contains(Save)'
              }, function (next) {
                t.notOk(Array.from(task1.assignments).some(function (a) {
                  return a.resource.id === Arcady.id;
                }), 'Arcady is now unassigned from task1');
              });

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x5) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Should be possible to make assignments by checking a checkbox', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      var project, eventStore, task1, task1idx, newlyAssignedResource, assignmentField;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              gantt = new Gantt({
                id: 'gantt',
                appendTo: document.body,
                rowHeight: 45,
                taskStore: t.getTaskStore(),
                resourceStore: t.getTeamResourceStore(),
                assignmentStore: t.getTeamAssignmentStore(),
                columns: [{
                  type: 'name',
                  text: 'Name',
                  width: 170,
                  field: 'name'
                }, {
                  type: ResourceAssignmentColumn.type,
                  id: 'resourceassignment',
                  width: 250
                }]
              });
              project = gantt.project;
              _context11.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              eventStore = project.eventStore, task1 = eventStore.getById(115), task1idx = eventStore.allRecords.indexOf(task1), newlyAssignedResource = project.resourceStore.getAt(2);
              t.chain({
                waitForRowsVisible: gantt
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        t.notOk(Array.from(task1.assignments).some(function (a) {
                          return a.resource.id === newlyAssignedResource.id;
                        }), "".concat(newlyAssignedResource.name, " is not initially assigned to task1"));

                      case 1:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              })), {
                dblClick: ".b-grid-row[data-index=".concat(task1idx, "] .b-grid-cell[data-column=assignments]")
              }, function (next) {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                t.click(assignmentField.triggers.expand.element).then(next);
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=2] .b-checkbox'
              }, {
                click: '.b-assignmentpicker .b-button:contains(Save)'
              }, function (next) {
                t.notOk(Array.from(task1.assignments).some(function (a) {
                  return a.resource.id === newlyAssignedResource.id;
                }), "".concat(newlyAssignedResource.name, " is now assigned to task1"));
              });

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x6) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Moving a picker column should not terminate the edit', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
      var run;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              run = /*#__PURE__*/function () {
                var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(float) {
                  var project, task1idx;
                  return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          gantt = new Gantt({
                            id: 'gantt',
                            appendTo: document.body,
                            rowHeight: 45,
                            taskStore: t.getTaskStore(),
                            resourceStore: t.getTeamResourceStore(),
                            assignmentStore: t.getTeamAssignmentStore(),
                            columns: [{
                              type: 'name',
                              text: 'Name',
                              width: 170,
                              field: 'name'
                            }, {
                              type: ResourceAssignmentColumn.type,
                              width: 250,
                              editor: {
                                store: {
                                  floatAssignedResources: float
                                }
                              }
                            }]
                          });
                          project = gantt.project;
                          _context12.next = 4;
                          return project.waitForPropagateCompleted();

                        case 4:
                          task1idx = project.eventStore.allRecords.indexOf(project.eventStore.getById(115));
                          _context12.next = 7;
                          return project.propagate();

                        case 7:
                          _context12.next = 9;
                          return new Promise(function (resolve) {
                            t.chain({
                              waitForRowsVisible: gantt
                            }, {
                              dblClick: ".b-grid-row[data-index=".concat(task1idx, "] .b-grid-cell[data-column=assignments]")
                            }, {
                              click: '.b-assignmentfield .b-icon-down'
                            }, {
                              waitForElementVisible: '.b-assignmentpicker'
                            }, {
                              drag: '.b-assignmentpicker .b-grid-header:contains(Units)',
                              to: '.b-assignmentpicker .b-grid-header:first-child'
                            }, // Picker should still be here
                            function (next) {
                              t.selectorExists('.b-assignmentpicker', 'Picker is still visible');
                              resolve();
                            });
                          });

                        case 9:
                          gantt.destroy();
                          gantt = null;

                        case 11:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }));

                return function run(_x8) {
                  return _ref13.apply(this, arguments);
                };
              }();

              t.diag('Testing with floating resources');
              _context13.next = 4;
              return run(true);

            case 4:
              t.diag('Testing w/o floating resources');
              _context13.next = 7;
              return run(false);

            case 7:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x7) {
      return _ref12.apply(this, arguments);
    };
  }()); // Test should run though to completion. There's a throw for duplicated assignments

  t.it('Should not duplicate assignments when editing an unassigned task\'s assignments twice', /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
      var project, newTask, newTaskCell, assignmentField;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              gantt = new Gantt({
                id: 'gantt',
                appendTo: document.body,
                rowHeight: 45,
                taskStore: t.getTaskStore(),
                resourceStore: t.getTeamResourceStore(),
                assignmentStore: t.getTeamAssignmentStore(),
                columns: [{
                  type: 'name',
                  text: 'Name',
                  width: 170,
                  field: 'name'
                }, {
                  type: ResourceAssignmentColumn.type,
                  id: 'resourceassignment',
                  width: 250
                }]
              });
              project = gantt.project;
              _context14.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              t.chain({
                waitForRowsVisible: gantt
              }, {
                contextmenu: function contextmenu() {
                  return gantt.getCell({
                    record: gantt.taskStore.last,
                    column: 1
                  });
                }
              }, {
                moveMouseTo: '.b-menuitem:contains(Add)'
              }, {
                click: '.b-menuitem:contains(Task below)'
              }, function (next) {
                newTask = gantt.taskStore.last;
                newTaskCell = gantt.getCell({
                  record: newTask,
                  column: 1
                });
                next();
              }, {
                dblClick: function dblClick() {
                  return newTaskCell;
                }
              }, function (next) {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                next();
              }, {
                click: function click() {
                  return assignmentField.triggers.expand.element;
                }
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox'
              }, {
                click: '.b-assignmentpicker .b-button:contains(Save)'
              }, {
                type: '[ENTER]'
              }, // Start editing again with the same task.
              // The setProjectEvent should cause a correct data load even though it's the same event
              // as last time editing was invoked. It checks the event's generation now.
              {
                dblClick: function dblClick() {
                  return newTaskCell;
                }
              }, function (next) {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                next();
              }, {
                click: function click() {
                  return assignmentField.triggers.expand.element;
                }
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                dblclick: '.b-assignmentgrid .b-grid-row[data-index=0] .b-grid-cell[data-column=units]'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-assignmentpicker .b-button:contains(Save)'
              }, {
                type: '[ENTER]'
              }, function () {
                // We allocated Arcady, then changed the units down to 90
                t.is(newTask.assignments.length, 1);
                t.is(newTask.assignments[0].resource.name, 'Arcady');
                t.is(newTask.assignments[0].units, 90);
              });

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x9) {
      return _ref14.apply(this, arguments);
    };
  }());
  t.it('Should throw if not configuring avatars properly', function (t) {
    t.throwsOk(function () {
      gantt = t.getGantt({
        columns: [{
          type: ResourceAssignmentColumn.type,
          id: 'resourceassignment',
          width: 250,
          showAvatars: true
        }]
      });
    }, 'Must provide a resourceImageFolderPath where resource images are located');
  });
  t.it('Should render special image if images are not set on the resource', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: 'foo',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1
      }, {
        id: 2,
        event: 12,
        resource: 1
      }],
      resources: [{
        id: 1,
        name: 'Mike'
      }, {
        id: 2,
        name: 'Dave'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true
      }]
    });
    t.chain({
      waitForSelector: '.b-resource-avatar-container img[src^=data]',
      desc: 'resources without images should use default image'
    }, {
      waitForSelectorNotFound: '.b-resource-avatar-container img:not([src^=data])',
      desc: 'resources without images should use default image'
    });
  });
  t.it('Should render special image if resource images are not found', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: 'foo',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1
      }, {
        id: 2,
        event: 12,
        resource: 1
      }],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'nope'
      }, {
        id: 2,
        name: 'Dave',
        image: 'nope2'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true
      }]
    });
    t.chain({
      waitForSelectorNotFound: '.b-resource-avatar-container img:not([src^=data])',
      desc: 'resources where image is not found should use default image'
    });
  });
  t.it('Should render resource image if defined', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: '../examples/_shared/images/users/',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1
      }, {
        id: 2,
        event: 11,
        resource: 2,
        units: 50
      }, {
        id: 3,
        event: 11,
        resource: 3
      }],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'mike.jpg'
      }, {
        id: 2,
        name: 'Dave',
        image: 'dave.jpg'
      }, {
        id: 3,
        name: 'Secret Guy'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true,
        width: 100
      }]
    });
    t.chain({
      waitForSelector: '.b-resource-avatar-container img[src*=mike]'
    }, {
      waitForSelector: '.b-resource-avatar-container img[src*=dave]'
    }, function () {
      var imgMike = document.querySelector('img[src*=mike]'),
          imgDave = document.querySelector('img[src*=dave]');
      t.is(imgMike.getAttribute('data-btip'), 'Mike 100%');
      t.is(imgDave.getAttribute('data-btip'), 'Dave 50% (+1 more resources)');
    });
  });
  t.it('Should show assigned resources in assignment field chip view when editing is started', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: '../examples/_shared/images/users/',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1,
        units: 50
      }, {
        id: 2,
        event: 12,
        resource: 2,
        units: 50
      }],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'mike.jpg'
      }, {
        id: 2,
        name: 'Dave',
        image: 'dave.jpg'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true,
        width: 100
      }]
    });
    t.chain({
      dblclick: '.b-resource-avatar-container img[src*=mike]'
    }, {
      waitForSelector: '.b-assignment-chipview .b-chip:contains(Mike 50%)'
    }, {
      click: '.b-resource-avatar-container img[src*=dave]'
    }, {
      waitForSelector: '.b-assignment-chipview .b-chip:contains(Dave 50%)'
    });
  });
  t.it('Should not affect assigned resources if pressing cancel', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: '../examples/_shared/images/users/',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1,
        units: 50
      }, {
        id: 2,
        event: 12,
        resource: 2,
        units: 50
      }],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'mike.jpg'
      }, {
        id: 2,
        name: 'Dave',
        image: 'dave.jpg'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true,
        width: 100
      }]
    });
    t.chain({
      dblclick: '.b-resource-avatar-container img[src*=mike]'
    }, {
      type: '[DOWN]'
    }, {
      click: '.b-assignmentpicker .b-button:contains(Cancel)'
    }, {
      waitForSelector: '.b-assignment-chipview .b-chip:contains(Mike 50%)'
    }, {
      click: '.b-tree-cell'
    }, {
      dblclick: '.b-resource-avatar-container img[src*=mike]'
    }, {
      waitForSelector: '.b-assignment-chipview .b-chip:contains(Mike 50%)'
    });
  });
  t.it('Should not show field tooltip if no resources are assigned', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: '../examples/_shared/images/users/',
      assignments: [],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'mike.jpg'
      }, {
        id: 2,
        name: 'Dave',
        image: 'dave.jpg'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true,
        width: 100
      }]
    });
    t.chain({
      dblClick: ".b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]"
    }, {
      type: '[DOWN]'
    }, {
      click: '.b-grid-cell.b-check-cell'
    }, {
      click: '.b-assignmentpicker .b-button:contains(Cancel)'
    }, {
      click: ".b-grid-row[data-index=3] .b-grid-cell[data-column=name]"
    }, {
      click: ".b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]"
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              return _context15.abrupt("return", t.selectorNotExists('[data-btip=true]'));

            case 1:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
  }); // https://github.com/bryntum/support/issues/391

  t.it('Should not crash when clicking outside assignment editor with cell editing active', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: '../examples/_shared/images/users/',
      assignments: [],
      resources: [{
        id: 1,
        name: 'Mike',
        image: 'mike.jpg'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true,
        width: 100
      }]
    });
    t.chain({
      dblClick: ".b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]"
    }, {
      type: '[DOWN]'
    }, {
      dblClick: '.b-grid-cell[data-column="units"]'
    }, {
      type: '10'
    }, {
      click: '.b-tree-cell'
    });
  }); // https://github.com/bryntum/support/issues/418

  t.it('Should rerender cells after a change in resourceStore', function (t) {
    gantt = t.getGantt({
      assignments: [{
        id: 1,
        event: 11,
        resource: 1,
        units: 50
      }],
      resources: [{
        id: 1,
        name: 'Mike'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: false
      }]
    });
    t.chain({
      waitForSelector: '.b-resourceassignment-cell:contains(Mike)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              return _context16.abrupt("return", gantt.resourceStore.first.set('name', 'Dave'));

            case 1:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })), {
      waitForSelector: '.b-resourceassignment-cell:contains(Dave)'
    });
  });
  t.it('Should render defaultResourceImageName if provided', function (t) {
    gantt = t.getGantt({
      resourceImageFolderPath: './',
      defaultResourceImageName: 'favicon-gantt.png',
      assignments: [{
        id: 1,
        event: 11,
        resource: 1,
        units: 50
      }],
      resources: [{
        id: 1,
        name: 'Mike'
      }],
      columns: [{
        type: ResourceAssignmentColumn.type,
        showAvatars: true
      }]
    });
    t.chain({
      waitForSelector: '.b-resource-avatar-container img[src*="favicon-gantt.png"]'
    });
  });
});