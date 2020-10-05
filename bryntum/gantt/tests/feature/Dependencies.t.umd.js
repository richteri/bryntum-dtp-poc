function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should render dependencies', function (t) {
    gantt = t.getGantt({
      appendTo: document.body
    });
    t.selectorCountIs('.b-sch-dependency', 10, 'Elements found for all valid dependencies');
    gantt.dependencies.forEach(function (dep) {
      return t.assertDependency(gantt, dep);
    });
  });
  t.it('Creating dependencies with D&D', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var project = gantt.project,
        t12 = project.getEventStore().getById(12),
        t13 = project.getEventStore().getById(13);
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t.is(t12.startDate, t13.startDate, 'Tasks 12 and 13 start at the same time');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      moveCursorTo: "[data-task-id='12'] .b-gantt-task"
    }, {
      waitForElementVisible: '.b-sch-terminal-right'
    }, {
      drag: '.b-sch-terminal-right',
      to: "[data-task-id='13'] .b-gantt-task",
      dragOnly: true
    }, {
      moveCursorTo: "[data-task-id='13'] .b-gantt-task .b-sch-terminal-left"
    }, {
      mouseUp: null
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return project.waitForPropagateCompleted();

            case 2:
              t.is(t13.startDate, t12.endDate, 'Task 13 shifted to start after Task 12 ends after dependency creation');

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  t.it('Aborting creating dependency shouldn\'t throw an exception in Gantt', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var done;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              done = t.livesOkAsync('No expcetion thrown');
              t.chain({
                moveCursorTo: "[data-task-id='12'] .b-gantt-task"
              }, {
                waitForElementVisible: '.b-sch-terminal-right'
              }, {
                drag: '.b-sch-terminal-right',
                to: "[data-task-id='13'] .b-gantt-task"
              }, done);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Creating: Should not be valid to drop on a task bar', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      moveCursorTo: "[data-task-id='12'] .b-gantt-task"
    }, {
      waitForElementVisible: '.b-sch-terminal-right'
    }, {
      drag: '.b-sch-terminal-right',
      to: "[data-task-id='13'] .b-gantt-task",
      dragOnly: true
    }, {
      waitForElementVisible: '.b-tooltip .b-icon-invalid'
    }, {
      mouseUp: null
    });
  });
  t.it('Creating: Validating dependencies while D&D', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      },
      dependencies: []
    });
    t.chain({
      moveCursorTo: "[data-task-id='12'] .b-gantt-task"
    }, {
      waitForElementVisible: '.b-sch-terminal-right'
    }, {
      drag: '.b-sch-terminal-right',
      to: "[data-task-id='13'] .b-gantt-task",
      dragOnly: true
    }, {
      moveCursorTo: "[data-task-id='13'] .b-gantt-task .b-sch-terminal-left"
    }, // Happens too fast after change to validate only once per terminal
    // {
    //     waitForElementVisible : '.b-tooltip .b-icon-checking'
    // },
    {
      waitForElementVisible: '.b-tooltip .b-icon-valid'
    }, {
      waitForElementVisible: '.b-sch-terminal-left.b-valid'
    }, {
      mouseUp: null
    }, {
      waitForSelector: '.b-sch-dependency'
    });
  });
  t.it('Creating: Should not be valid to create dependencies between connected tasks', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.wontFire(gantt.dependencyStore, 'add');
    t.chain({
      moveCursorTo: "[data-task-id='12'] .b-gantt-task"
    }, {
      waitForElementVisible: '.b-sch-terminal-right'
    }, {
      drag: '.b-sch-terminal-right',
      to: "[data-task-id='14'] .b-gantt-task",
      dragOnly: true
    }, {
      moveCursorTo: "[data-task-id='14'] .b-gantt-task .b-sch-terminal-left"
    }, // Happens too fast after change to validate only once per terminal
    // {
    //     waitForElementVisible : '.b-tooltip .b-icon-checking'
    // },
    {
      waitForElementVisible: '.b-tooltip .b-icon-invalid'
    }, {
      waitForElementVisible: '.b-sch-terminal-left.b-invalid'
    }, {
      mouseUp: null
    });
  });
  t.it('Editing dependencies', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var project, multiDepTask, multiDepTaskPredecessorCellCtx, predecessors, predecessorField, tabs, dependencyGrid, predecessorPicker, saveButton, durationField;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              gantt = t.getGantt({
                columns: [{
                  text: 'Predecessors',
                  field: 'predecessors',
                  type: 'dependency',
                  width: 200
                }],
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              project = gantt.project;
              _context7.next = 4;
              return project.waitForPropagateCompleted();

            case 4:
              multiDepTask = project.eventStore.find(function (t) {
                return t.predecessors.length === 3;
              }), multiDepTaskPredecessorCellCtx = {
                id: multiDepTask.id,
                columnId: 'predecessors'
              };
              predecessors = multiDepTask.predecessors; // Initial values correct

              t.is(predecessors[0].toString(true), '11');
              t.is(predecessors[1].toString(true), '12');
              t.is(predecessors[2].toString(true), '13');
              t.is(gantt.getCell(multiDepTaskPredecessorCellCtx).innerText, '11;12;13');
              t.chain({
                waitFor: function waitFor() {
                  return gantt.features.cellEdit.editorContext;
                },
                trigger: {
                  doubleclick: function doubleclick() {
                    return gantt.getCell(multiDepTaskPredecessorCellCtx);
                  }
                }
              }, function (next) {
                predecessorField = gantt.features.cellEdit.editorContext.editor.inputField; // Field is populated correctly both in underlying Dependency record content and raw value

                t.is(predecessorField.input.value, '11;12;13');
                t.isDeeply(predecessorField.value, predecessors);
                next();
              }, {
                // Expand the dropdown
                waitFor: function waitFor() {
                  return predecessorField.picker.isVisible;
                },
                trigger: {
                  click: function click() {
                    return predecessorField.triggers.expand.element;
                  }
                }
              }, function (next) {
                t.selectorExists('.b-list-item.id11.b-selected.b-fs');
                t.selectorExists('.b-list-item.id12.b-selected.b-fs');
                t.selectorExists('.b-list-item.id13.b-selected.b-fs');
                next();
              }, // Toggle the to side to make the relationship FF
              {
                click: '.b-list-item.id11.b-selected.b-fs [data-side="to"]'
              }, function (next) {
                t.is(predecessorField.input.value, '11FF;12;13');
                next();
              }, // Toggle the from side to make the relationship SF
              {
                click: '.b-list-item.id11.b-selected.b-ff [data-side="from"]'
              }, function (next) {
                t.is(predecessorField.input.value, '11SF;12;13');
                next();
              }, // Toggle the to side to make the relationship SS
              {
                click: '.b-list-item.id11.b-selected.b-sf [data-side="to"]'
              }, function (next) {
                t.is(predecessorField.input.value, '11SS;12;13');
                next();
              }, // Toggle the from side to make the relationship FS
              {
                click: '.b-list-item.id11.b-selected.b-ss [data-side="from"]'
              }, function (next) {
                t.is(predecessorField.input.value, '11;12;13');
                next();
              }, {
                click: '.b-list-item.id11.b-selected.b-fs .b-predecessor-item-text'
              }, // Task 11 is no longer a predecessor
              function (next) {
                t.selectorNotExists('.b-list-item.id11.b-selected.b-fs');
                t.is(predecessorField.input.value, '12;13');
                next();
              }, {
                click: '.b-list-item.id11 .b-predecessor-item-text'
              }, // Task 11 is a predecessor again
              function (next) {
                t.selectorExists('.b-list-item.id11.b-selected.b-fs');
                t.is(predecessorField.input.value, '12;13;11');
                t.moveMouseTo(predecessorField.input, next);
              }, // -----------------------
              // Double click the destination task of these three deps
              {
                dblclick: '.b-gantt-task-wrap[data-task-id="14"]'
              }, // Select the predecessors tab of the TabPanel
              {
                click: '.b-tabpanel-tab.b-predecessors-tab'
              }, // Begin editing the link type of the first dep
              {
                dblclick: '.b-grid-cell[data-column="type"]'
              }, // Collect widget refs
              function (next) {
                // All three incoming dependencies have zero lag to begin with
                t.selectorCountIs('.b-grid-cell:contains("0 days")', 3);
                saveButton = gantt.features.taskEdit.editor.widgetMap.saveButton;
                tabs = gantt.features.taskEdit.editor.widgetMap.tabs.widgetMap;
                dependencyGrid = tabs.predecessorstab.widgetMap['predecessorstab-grid'];
                next();
              }, // Dropdown the link types
              function (next) {
                predecessorPicker = dependencyGrid.features.cellEdit.editorContext.editor.inputField;
                next();
              }, {
                waitFor: function waitFor() {
                  return predecessorPicker.picker.isVisible;
                },
                trigger: {
                  click: function click() {
                    return predecessorPicker.triggers.expand.element;
                  }
                }
              }, // Select the SS item
              {
                click: '.b-list-item[data-index="0"]'
              }, // This will finish dependency type editing and start propagation, plus it will start full lag editing
              {
                dblclick: '.b-grid-cell[data-column="fullLag"]'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", project.waitForPropagateCompleted());

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), function (next) {
                durationField = dependencyGrid.features.cellEdit.editorContext.editor.inputField;
                next();
              }, // Make it +1 day
              {
                click: function click() {
                  return durationField.triggers.spin.upButton;
                }
              },
              /*#__PURE__*/
              // Wait for the propagate of the changed value
              _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        return _context5.abrupt("return", project.waitForPropagateCompleted());

                      case 1:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })), // Editing must not have been stopped by a store reload.
              function (next) {
                t.ok(dependencyGrid.features.cellEdit.editorContext && dependencyGrid.features.cellEdit.editorContext.editor.containsFocus, 'Changing the lag did not terminate the edit');
                next();
              }, // Save the edit
              {
                click: function click() {
                  return saveButton.element;
                }
              }, // Check that the cell has been updtaed
              {
                waitFor: function waitFor() {
                  return gantt.getCell(multiDepTaskPredecessorCellCtx).innerText === '12SS+1d;13;11';
                }
              }, // Now lets edit that lag text
              {
                dblclick: gantt.getCell(multiDepTaskPredecessorCellCtx)
              }, // Check that the editor has been primed with correct new textual value
              {
                waitFor: function waitFor() {
                  return predecessorField.containsFocus && predecessorField.input.value === '12SS+1d;13;11';
                }
              }, // This just switches the lag from +1 day to -1 day
              {
                type: '12FF-1d;13;11[ENTER]',
                clearExisting: true
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        return _context6.abrupt("return", project.waitForPropagateCompleted());

                      case 1:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })), function () {
                predecessors = multiDepTask.predecessors; // Check the input was parsed correctly and the predecessors are correct

                t.is(predecessors[0].toString(true), '12FF-1d');
                t.is(predecessors[1].toString(true), '13');
                t.is(predecessors[2].toString(true), '11');
              });

            case 11:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should not cancel edit when editing a new dependency', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      var editorContext;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              gantt = t.getGantt({
                columns: [{
                  text: 'Predecessors',
                  field: 'predecessors',
                  type: 'dependency',
                  width: 200
                }],
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              t.chain({
                dblClick: '.b-gantt-task.id11'
              }, {
                waitForSelector: '.b-taskeditor'
              }, function (next) {
                gantt.features.taskEdit.editor.widgetMap.tabs.layout.animateCardChange = false;
                next();
              }, {
                click: '.b-tabpanel-tab-title:contains(Predecessors)'
              }, {
                click: '.b-predecessorstab .b-add-button'
              }, {
                waitFor: function waitFor() {
                  editorContext = gantt.features.taskEdit.editor.widgetMap['predecessorstab-grid'].features.cellEdit.editorContext;
                  return editorContext && editorContext.editor.containsFocus;
                }
              }, function (next) {
                t.click(editorContext.editor.inputField.triggers.expand.element).then(next);
              }, function (next) {
                t.click(editorContext.editor.inputField.picker.getItem(2)).then(next);
              }, {
                type: '[TAB]'
              }, // Nothing should happen. The test is that editiong does not finish
              // so there's no event to wait for.
              {
                waitFor: 500
              }, function () {
                editorContext = gantt.features.taskEdit.editor.widgetMap['predecessorstab-grid'].features.cellEdit.editorContext;
                t.ok(editorContext && editorContext.editor.containsFocus);
              });

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x3) {
      return _ref8.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/338

  t.it('Creating: Should not crash when moving mouse outside schedule area', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      moveCursorTo: "[data-task-id='12'] .b-gantt-task"
    }, {
      drag: '.b-sch-terminal-right',
      to: '.b-grid-splitter',
      dragOnly: true
    }, {
      waitFor: 500,
      desc: 'Waiting for transition to end'
    });
  });
  t.it('Should not throw an exception when mouse is moved out from task terminal of a removed task', function (t) {
    gantt = t.getGantt({
      transitionDuration: 500,
      enableEventAnimations: true,
      // Needs explicitly configuring because IE11 turns animations off
      useInitialAnimation: false,
      tasks: [{
        id: 41,
        name: 'Task 41',
        cls: 'task41',
        startDate: '2017-01-16',
        duration: 2,
        leaf: true
      }]
    });
    t.chain({
      click: '.b-gantt-task'
    }, {
      moveCursorTo: '.b-sch-terminal'
    }, {
      type: '[DELETE]'
    }, // This step is required to reproduce the bug, no extra mouse movement needed
    function (next) {
      // The bug happens when the element becomes `pointer-events: none;` due to being
      // put into an animated removing state. Mouseout is triggered in a real UI,
      // so we have to explicitly fire one here.
      t.simulator.simulateEvent(document.querySelector('.b-sch-terminal'), 'mouseout');
      next();
    }, {
      waitForSelectorNotFound: gantt.unreleasedEventSelector,
      desc: 'Task was removed'
    });
  });
});