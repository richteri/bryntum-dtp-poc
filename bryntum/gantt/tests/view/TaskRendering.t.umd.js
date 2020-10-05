function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global ProjectModel */
StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function assertTask(t, taskOrId, index) {
    var task = getTask(taskOrId),
        taskEl = gantt.getElementFromTaskRecord(task),
        hasParentClass = taskEl && taskEl.parentElement.classList.contains('b-gantt-task-parent');
    var result = true;

    if (!taskEl) {
      t.fail("Element for ".concat(task.name, " is not found"));
      result = false;
    } else {
      if (task.isLeaf && hasParentClass || !task.isLeaf && !hasParentClass) {
        t.fail("".concat(task.name, " has incorrect leaf/parent cls"));
        result = false;
      }

      if (!isTaskPositioned(t, task)) {
        t.fail("".concat(task.name, " is positioned incorrectly"));
        result = false;
      }
    }

    if (index != null) {
      var currentTask = gantt.getRecordFromElement(gantt.rowManager.rows[index].elements.normal);
      t.is(currentTask.id, task.id, "Task ".concat(task.name, " is displayed in correct row"));
    }

    if (result) {
      t.pass("".concat(task.name, " is ok"));
    }
  }

  function isTaskPositioned(t, taskOrId) {
    var task = getTask(taskOrId),
        taskEl = gantt.getElementFromTaskRecord(task),
        taskBox = taskEl.getBoundingClientRect(),
        // cannot rely on cells order, need to validate
    // https://app.assembla.com/spaces/bryntum/tickets/7598-subgrids-order-need-to-be-fixed/details
    rowBox = gantt.getRowFor(task).cells.find(function (cell) {
      return cell.classList.contains('b-sch-timeaxis-cell');
    }).getBoundingClientRect();
    return taskBox.top >= rowBox.top && taskBox.bottom <= rowBox.bottom && (task.isMilestone || taskBox.left === gantt.getCoordinateFromDate(task.startDate, false));
  }

  function tasksPositioned(t) {
    return gantt.project.eventStore.getRange().filter(function (record) {
      return gantt.getRowFor(record);
    }).every(function (record) {
      return isTaskPositioned(t, record);
    });
  }

  function getTask(id) {
    return gantt.project.eventStore.getById(id);
  }

  function assertTaskBox(t, taskOrId, x, y, width) {
    var task = gantt.taskStore.getById(taskOrId),
        element = gantt.getElementFromTaskRecord(task);

    if (x === null) {
      t.notOk(element, "Unexpected element found for task ".concat(task.id, " ").concat(task.name));
    } else {
      var box = Rectangle.from(element, gantt.timeAxisSubGridElement);
      t.isApprox(box.left, x, 1, 'Correct x');
      t.isApprox(box.top, y, 1, 'Correct y');
      t.isApprox(box.width, width, 1, 'Correct width'); // Dont care about height, always the same
    }
  }

  t.it('Gantt should refresh on task add/update/remove', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var projectA;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tasks: [{
                  id: 1,
                  name: 'Project A',
                  startDate: '2017-01-16',
                  duration: 5,
                  expanded: true,
                  children: [{
                    id: 11,
                    name: 'Child 1',
                    startDate: '2017-01-16',
                    duration: 5,
                    leaf: true,
                    cls: 'child1'
                  }]
                }, {
                  id: 2,
                  name: 'Project B',
                  startDate: '2017-01-16',
                  duration: 5
                }, {
                  id: 3,
                  name: 'Project C',
                  startDate: '2017-01-17',
                  duration: 4
                }],
                dependencies: []
              });
              projectA = getTask(1);
              t.chain({
                waitForSelector: '.b-gantt-task'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return projectA.waitForPropagateCompleted();

                      case 2:
                        t.diag('Append child to the bottom');
                        projectA.appendChild({
                          id: 12,
                          name: 'Child 2',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child2'
                        });

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })), {
                waitForSelector: '.b-gantt-task.child2'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        t.diag('Insert child to the top');
                        projectA.insertChild({
                          id: 13,
                          name: 'Child 3',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child3'
                        }, getTask(11));

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })), {
                waitForSelector: '.b-gantt-task.child3'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        t.diag('Remove task');
                        getTask(11).remove();
                        t.selectorNotExists('.b-gantt-task.child1');

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })), {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        t.diag('Update task');
                        _context4.next = 3;
                        return getTask(12).setStartDate(new Date(2017, 0, 18));

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                click: '.b-grid-header.b-sortable',
                desc: 'Sort tasks'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        t.diag('Append child to sorted project A. It should appear first');
                        projectA.appendChild({
                          id: 14,
                          name: 'Child 1',
                          startDate: '2017-01-18',
                          duration: 1,
                          cls: 'child1'
                        });

                      case 2:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })), {
                waitForSelector: '.b-gantt-task.child1'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, function () {
                t.diag('Filter store');
                projectA.project.eventStore.filter(function (r) {
                  return r.name !== 'Child 2';
                });
                t.ok(tasksPositioned(t), 'Tasks positioned ok');
              });

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Gantt should refresh when multiple tasks added/removed', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      var projectA;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tasks: [{
                  id: 1,
                  name: 'Project A',
                  startDate: '2017-01-16',
                  duration: 5,
                  expanded: true,
                  children: [{
                    id: 11,
                    name: 'Child 1',
                    startDate: '2017-01-16',
                    duration: 5,
                    leaf: true,
                    cls: 'child1'
                  }]
                }, {
                  id: 2,
                  name: 'Project B',
                  startDate: '2017-01-16',
                  duration: 5
                }, {
                  id: 3,
                  name: 'Project C',
                  startDate: '2017-01-17',
                  duration: 4
                }],
                dependencies: []
              });
              projectA = getTask(1);
              t.chain({
                waitForSelector: '.b-gantt-task'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        return _context7.abrupt("return", projectA.waitForPropagateCompleted());

                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        t.diag('Append child to the bottom');
                        projectA.appendChild([{
                          id: 12,
                          name: 'Child 2',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child2'
                        }, {
                          id: 13,
                          name: 'Child 3',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child3'
                        }]);

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })), {
                waitForSelector: '.b-gantt-task.child2'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        t.diag('Insert child to the top');
                        projectA.insertChild([{
                          id: 14,
                          name: 'Child 4',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child4'
                        }, {
                          id: 15,
                          name: 'Child 5',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child5'
                        }], getTask(11));

                      case 2:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })), {
                waitForSelector: '.b-gantt-task.child4'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              });

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x2) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should render tasks properly after scroll', function (t) {
    var tasks = [],
        dependencies = [];

    for (var i = 0; i < 20; i++) {
      var currentId = i + 1,
          task = {
        id: currentId,
        name: "Task ".concat(currentId),
        startDate: '2017-01-17',
        duration: 2,
        expanded: true,
        children: []
      };

      for (var j = 0; j < 10; j++) {
        task.children.push({
          id: "".concat(currentId, "-").concat(j + 1),
          name: "Task ".concat(currentId, "-").concat(j + 1),
          startDate: '2017-01-17',
          duration: 2
        });

        if (j < 9) {
          dependencies.push({
            id: "".concat(currentId, "-").concat(j + 1),
            fromEvent: "".concat(currentId, "-").concat(j + 1),
            toEvent: "".concat(currentId, "-").concat(j + 2),
            lag: -1
          });
        }
      }

      tasks.push(task);
    }

    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        labels: {
          right: 'name'
        }
      },
      startDate: '2017-01-15',
      endDate: '2017-02-19',
      tasks: tasks,
      dependencies: dependencies
    });

    function assertRenderedTasks() {
      Array.from(document.querySelectorAll('.b-gantt-task-wrap')).forEach(function (el) {
        var taskRecord = gantt.resolveTaskRecord(el);
        assertTask(t, taskRecord);
      });
    }

    function assertDependencies() {
      Array.from(gantt.foregroundCanvas.querySelectorAll('.b-sch-dependency')).forEach(function (dep) {
        t.assertDependency(gantt, gantt.getDependencyForElement(dep));
      });
    }

    var _dependenciesDrawn = false,
        scrollEnded = false;
    t.chain({
      waitForPropagate: gantt
    }, {
      waitFor: tasksPositioned,
      desc: 'Tasks positioned ok'
    }, function (next) {
      assertRenderedTasks();
      gantt.on({
        dependenciesDrawn: function dependenciesDrawn() {
          return _dependenciesDrawn = true;
        },
        once: true
      });
      gantt.scrollable.on({
        scrollend: function scrollend() {
          return scrollEnded = true;
        },
        once: true
      });
      t.diag('Scrolling down to 1000px');
      gantt.scrollTop = 1000;
      next();
    }, {
      waitFor: function waitFor() {
        return _dependenciesDrawn && scrollEnded;
      },
      desc: 'Scroll ended & dependencies are redrawn'
    }, function (next) {
      assertRenderedTasks();
      assertDependencies();
      _dependenciesDrawn = false;
      scrollEnded = false;
      gantt.on({
        dependenciesDrawn: function dependenciesDrawn() {
          return _dependenciesDrawn = true;
        },
        once: true
      });
      gantt.scrollable.on({
        scrollend: function scrollend() {
          return scrollEnded = true;
        },
        once: true
      });
      t.diag('Scrolling up to 0px');
      gantt.scrollTop = 0;
      next();
    }, {
      waitFor: function waitFor() {
        return _dependenciesDrawn && scrollEnded;
      },
      desc: 'Scroll ended & dependencies are redrawn'
    }, function (next) {
      assertRenderedTasks();
      assertDependencies();
    });
  });
  t.it('Should render tasks properly after tree node removal', function (t) {
    gantt = t.getGantt();
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              gantt.taskStore.getById(3).remove();
              Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(function (el) {
                var task = gantt.getRecordFromElement(el);
                assertTask(t, task);
              });
              _context11.next = 4;
              return gantt.collapse(gantt.taskStore.getById(2));

            case 4:
              gantt.taskStore.getById(22).remove();

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })), {
      waitForPropagate: gantt
    }, {
      waitForSelectorNotFound: '.b-animating'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(function (el) {
                var task = gantt.getRecordFromElement(el);
                assertTask(t, task);
              });

            case 1:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  t.it('Should add task below', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      tasks: [{
        id: 1,
        name: 'Project A',
        startDate: '2017-01-16',
        duration: 5,
        expanded: true,
        children: [{
          id: 11,
          name: 'Child 1',
          startDate: '2017-01-16',
          duration: 5,
          leaf: true,
          cls: 'child1'
        }]
      }, {
        id: 2,
        name: 'Project B',
        startDate: '2017-01-16',
        duration: 5
      }, {
        id: 3,
        name: 'Project C',
        startDate: '2017-01-17',
        duration: 4
      }],
      dependencies: [],
      columns: [{
        type: 'wbs'
      }, {
        type: 'name'
      }]
    });
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              gantt.addTaskBelow(getTask(11));
              return _context13.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 2:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '2', '3']);
              gantt.addTaskBelow(getTask(11));
              return _context14.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '2', '3']);
              gantt.addTaskBelow(getTask(11));
              return _context15.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 3:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '2', '3']);

            case 1:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  }); // this test case needs to be reviewed after https://github.com/bryntum/support/issues/552

  t.it('Should add task below a task with constraint', /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(t) {
      var _gantt, project, newTask;

      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tasks: [{
                  id: 11,
                  startDate: '2017-01-16',
                  duration: 1
                }],
                dependencies: [],
                columns: [{
                  type: 'name'
                }]
              });
              _gantt = gantt, project = _gantt.project;
              t.is(project.startDate, new Date(2017, 0, 16));
              _context17.next = 5;
              return project.waitForPropagateCompleted();

            case 5:
              _context17.next = 7;
              return project.getEventById(11).setStartDate(new Date(2017, 0, 18));

            case 7:
              _context17.next = 9;
              return gantt.addTaskBelow(project.getEventById(11));

            case 9:
              newTask = _context17.sent;
              t.is(newTask.startDate, new Date(2017, 0, 18));
              t.is(newTask.endDate, new Date(2017, 0, 19));

            case 12:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x3) {
      return _ref17.apply(this, arguments);
    };
  }());
  t.it('Should add task above/below milestone', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      startDate: '2019-05-27',
      endDate: '2019-06-01',
      project: new ProjectModel({
        eventsData: [{
          id: 1,
          name: 'Project A',
          startDate: '2019-05-27',
          duration: 2,
          expanded: true,
          children: [{
            id: 11,
            name: 'Child 11',
            startDate: '2019-05-27',
            duration: 2,
            leaf: true
          }, {
            id: 12,
            name: 'Child 12',
            startDate: '2019-05-29',
            duration: 0,
            leaf: true
          }]
        }, {
          id: 2,
          name: 'Project B',
          startDate: '2019-05-27',
          duration: 5
        }],
        calendarsData: [{
          id: 'general',
          name: 'General',
          intervals: [{
            recurrentStartDate: 'on Sat at 00:00',
            recurrentEndDate: 'on Mon at 00:00',
            isWorking: false
          }]
        }],
        dependenciesData: [{
          fromEvent: 11,
          toEvent: 12
        }],
        calendar: 'general'
      }),
      columns: [{
        type: 'wbs'
      }, {
        type: 'name'
      }],
      features: {
        taskContextMenu: true
      }
    });
    var task1, task2, task3;
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return gantt.addTaskBelow(getTask(12));

            case 2:
              task1 = _context18.sent;
              t.is(task1.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task1.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task1.duration, 0, 'Duration date ok');

            case 6:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '2']);
              _context19.next = 3;
              return gantt.addTaskBelow(getTask(12));

            case 3:
              task2 = _context19.sent;
              t.is(task2.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task2.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task2.duration, 0, 'Duration date ok');

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '2']);
              _context20.next = 3;
              return gantt.addTaskAbove(getTask(12));

            case 3:
              task3 = _context20.sent;
              t.is(task3.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task3.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task3.duration, 0, 'Duration date ok');

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7;
      },
      desc: 'Rows are ok'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '2']);
              [task1, task2, task3].forEach(function (record) {
                t.is(record.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(record.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(record.duration, 0, 'Duration date ok');
              });

            case 2:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    })));
  });
  t.it('Appending new task should not cause scheduling conflict', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      startDate: '2019-05-20',
      endDate: '2019-05-27',
      project: {
        startDate: '2019-05-20',
        tasksData: [{
          id: 1,
          name: 'Project A',
          startDate: '2019-05-20',
          duration: 1,
          expanded: true,
          children: [{
            id: 11,
            name: 'Task 11',
            startDate: '2019-05-20',
            duration: 1
          }, {
            id: 12,
            name: 'Task 12',
            startDate: '2019-05-21',
            expanded: true,
            children: [{
              id: 121,
              name: 'task 121',
              startDate: '2019-05-21',
              duration: 1
            }]
          }]
        }],
        dependenciesData: [{
          id: 1,
          fromEvent: 11,
          toEvent: 12
        }]
      }
    });
    t.wontFire(gantt.project, 'schedulingconflict'); // we added listener, we have to continue propagation

    gantt.project.on('schedulingconflict', function (_ref22) {
      var continueWithResolutionResult = _ref22.continueWithResolutionResult;
      continueWithResolutionResult();
    });
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
      var task;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return gantt.addTaskBelow(gantt.taskStore.getById(121));

            case 2:
              task = _context22.sent;
              t.is(task.startDate, new Date(2019, 4, 21), 'Task start is ok');
              t.is(task.endDate, new Date(2019, 4, 22), 'Task end is ok');
              t.is(task.duration, 1, 'Task duration is ok');

            case 6:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    })));
  });
  t.it('Appending a milestone should not throw', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      startDate: '2019-05-20',
      endDate: '2019-05-27',
      project: {
        startDate: '2019-05-20',
        tasksData: [{
          id: 1,
          name: 'Project A',
          startDate: '2019-05-20',
          duration: 1,
          expanded: true,
          children: [{
            id: 11,
            name: 'Task 11',
            startDate: '2019-05-20',
            duration: 1
          }]
        }],
        dependenciesData: []
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
      var task;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return gantt.addTask(gantt.taskStore.getById(11), {
                milestone: true
              });

            case 2:
              task = _context23.sent;
              t.is(task.startDate, new Date(2019, 4, 20), 'Task start is ok');
              t.is(task.endDate, new Date(2019, 4, 20), 'Task end is ok');
              t.is(task.duration, 0, 'Task duration is ok');

            case 6:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23);
    })));
  });
  t.it('Gantt tasks should animate to new state when modified', /*#__PURE__*/function () {
    var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(t) {
      var project, task11, task11El, startTask11Rect, expectedTask11Data, startTime;
      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                startDate: '2019-07-07',
                endDate: '2019-07-29',
                project: {
                  startDate: '2019-07-07',
                  duration: 30,
                  eventsData: [{
                    id: 1,
                    name: 'Project A',
                    duration: 30,
                    expanded: true,
                    children: [{
                      id: 11,
                      name: 'Child 1',
                      duration: 5,
                      leaf: true,
                      cls: 'child1'
                    }]
                  }]
                }
              });
              project = gantt.project, task11 = gantt.taskStore.getById(11), task11El = gantt.getElementFromTaskRecord(task11);
              t.chain({
                waitForPropagate: project
              }, // Wait for initial animation to be over
              {
                waitForSelectorNotFound: '.b-animating'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
                return regeneratorRuntime.wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        t.diag('Change position of task 11'); // Capture start position

                        startTask11Rect = Rectangle.from(task11El, gantt.timeAxisSubGridElement); // Make a long transition so we can determine that it moves slowly

                        CSSHelper.insertRule('.b-animating .b-gantt-task-wrap { transition-duration: 5s !important; }');
                        gantt.transitionDuration = 5000; // When we hit the end condition, *approx* 5000ms must have elapsed from here

                        startTime = performance.now(); // Move task into future and make it longer

                        task11.set({
                          startDate: '2019-07-15',
                          endDate: '2019-07-27',
                          duration: 10
                        });
                        project.propagate();

                      case 7:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })), // Wait for corrected data to get to the task
              {
                waitForPropagate: project
              }, function (next) {
                var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement); // It must not start moving until the next AF

                t.is(r.x, startTask11Rect.x, 'Task has not started moving');
                t.is(r.width, startTask11Rect.width, 'Task has not started changing width');
                next();
              }, {
                waitFor: 500
              }, // After 500 ms, it must not have moved to its final position
              function (next) {
                // Calculate the final position where it will animate to.
                expectedTask11Data = gantt.taskRendering.getTaskBox(task11);
                var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                t.isLess(r.x, expectedTask11Data.left, 'Task has not reached its final position');
                t.isLess(r.width, expectedTask11Data.width, 'Task has not reached its funal width');
                next();
              }, // Wait for final position and width to happen.
              {
                waitFor: function waitFor() {
                  var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                  return r.x === expectedTask11Data.left && r.width === expectedTask11Data.width;
                },
                desc: 'Task has reached its final position and width'
              }, // It must have taken Approx 5 seconds to get here
              function () {
                // .7 second margin due to slow test platforms
                t.isApprox(performance.now(), startTime + 5000, 700, 'Transition took correct time');
              });

            case 3:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25);
    }));

    return function (_x4) {
      return _ref25.apply(this, arguments);
    };
  }());
  t.it('Tasks that starts/ends outside timeaxis should render correctly', /*#__PURE__*/function () {
    var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(t) {
      var tickWidth;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              tickWidth = 150;
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tickWidth: tickWidth,
                startDate: new Date(2017, 0, 22),
                endDate: new Date(2017, 0, 29)
              });
              assertTaskBox(t, 1000, -6 * tickWidth, 10, 19 * tickWidth);
              assertTaskBox(t, 1, -6 * tickWidth, 56, 10 * tickWidth);
              assertTaskBox(t, 2, 4 * tickWidth, 286, 9 * tickWidth);
              assertTaskBox(t, 22, 4 * tickWidth, 378, 4 * tickWidth);
              assertTaskBox(t, 23, null);
              assertTaskBox(t, 234, null);

            case 8:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26);
    }));

    return function (_x5) {
      return _ref27.apply(this, arguments);
    };
  }());
  t.it('Should trigger renderTask and releaseTask', function (t) {
    var renderCount = 0,
        releaseCount = 0;
    gantt = t.getGantt({
      listeners: {
        renderTask: function renderTask() {
          renderCount++;
        },
        releaseTask: function releaseTask() {
          releaseCount++;
        }
      }
    });
    var initialRenderCount = renderCount;
    t.diag('Initial render');
    t.is(renderCount, document.querySelectorAll('.b-gantt-task').length, 'Correct render count');
    t.is(releaseCount, 0, 'Correct release count');
    t.diag('Remove task');
    gantt.taskStore.last.remove();
    t.is(renderCount, initialRenderCount, 'Correct render count');
    t.is(releaseCount, 1, 'Correct release count');
  });
  t.it('should not get a box for removed task', function (t) {
    gantt = t.getGantt();
    var task = gantt.taskStore.getById(11);
    task.remove();
    t.notOk(gantt.getTaskBox(task), 'No box returned for removed task');
  });
  t.it('should include task content element when using icon', function (t) {
    gantt = t.getGantt();
    t.selectorNotExists('.b-gantt-task-content', 'task content not found initially');
    gantt.taskStore.getAt(0).taskIconCls = 'b-fa b-fa-car';
    t.selectorExists('.b-gantt-task-content', 'task content found after assigning icon');
    t.selectorExists('.b-gantt-task-content i', 'icon found');
  });
  t.it('should use taskRenderer', function (t) {
    gantt = t.getGantt({
      taskRenderer: function taskRenderer(_ref28) {
        var taskRecord = _ref28.taskRecord;

        if (taskRecord.id === 1) {
          return;
        }

        if (taskRecord.id === 12) {
          return null;
        }

        return taskRecord.name;
      }
    });
    gantt.taskStore.getAt(0).taskIconCls = 'b-fa b-fa-car';
    gantt.taskStore.getAt(2).taskIconCls = 'b-fa b-fa-air-freshener';
    t.selectorExists('.b-gantt-task:textEquals(Project A) i', 'taskRenderer used for parent');
    t.selectorExists('.b-gantt-task:textEquals(Investigate) i', 'taskRenderer used for child');
    t.selectorNotExists('.b-gantt-task:textEquals(undefined)', 'No undefined');
    t.selectorNotExists('.b-gantt-task:textEquals(null)', 'No null');
  });
  t.it('should work with taskRenderer returning DOM config', function (t) {
    gantt = t.getGantt({
      taskRenderer: function taskRenderer(_ref29) {
        var taskRecord = _ref29.taskRecord;
        return {
          tag: 'b',
          html: taskRecord.name
        };
      }
    });
    t.selectorExists('.b-gantt-task b:textEquals(Project A)', 'taskRenderer used for parent');
    t.selectorExists('.b-gantt-task b:textEquals(Investigate)', 'taskRenderer used for child');
  });
  t.it('should work with taskRenderer returning HTML string', function (t) {
    gantt = t.getGantt({
      taskRenderer: function taskRenderer(_ref30) {
        var taskRecord = _ref30.taskRecord;
        return "<b>".concat(taskRecord.name, "</b>");
      }
    });
    t.selectorExists('.b-gantt-task b:textEquals(Project A)', 'taskRenderer used for parent');
    t.selectorExists('.b-gantt-task b:textEquals(Investigate)', 'taskRenderer used for child');
  }); // https://github.com/bryntum/support/issues/255

  t.it('Should show tasks after adding columns to locked grid with schedule region collapsed ', /*#__PURE__*/function () {
    var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(t) {
      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              gantt = t.getGantt();
              t.chain({
                waitForRowsVisible: gantt
              }, function () {
                return gantt.subGrids.normal.collapse();
              }, function (next) {
                gantt.columns.add({
                  region: 'locked',
                  text: 'foo'
                });
                next();
              }, function () {
                return gantt.subGrids.normal.expand();
              }, {
                waitForElementTop: '.b-gantt-task'
              });

            case 2:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27);
    }));

    return function (_x6) {
      return _ref31.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/399

  t.it('Should calculate width if a milestone gets duration', function (t) {
    gantt = t.getGantt();
    var task = gantt.taskStore.getById(14);
    var oldWidth;
    t.chain({
      waitForRowsVisible: gantt
    }, function (next) {
      oldWidth = gantt.getElementFromTaskRecord(task).offsetWidth;
      next();
    }, function () {
      return task.setDuration(10);
    }, {
      waitFor: function waitFor() {
        return gantt.getElementFromTaskRecord(task).offsetWidth > oldWidth;
      },
      desc: 'Task has a width greater than when it was a milestone'
    });
  });
  t.it('Should accept wrapperCls string value in taskRenderer', function (t) {
    gantt = t.getGantt({
      taskRenderer: function taskRenderer(_ref32) {
        var taskRecord = _ref32.taskRecord,
            renderData = _ref32.renderData;
        renderData.wrapperCls += 'foo';
      }
    });
    t.chain({
      waitForSelector: '.b-gantt-task-wrap.foo'
    });
  });
});