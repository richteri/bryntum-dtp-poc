function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  window.AjaxHelper = AjaxHelper;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function checkSelected(t, id) {
    t.ok(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), "Task ".concat(id, " has .b-task-selected class"));
  }

  function checkUnselected(t, id) {
    t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById(id)).classList.contains('b-task-selected'), "Task ".concat(id, " has no .b-task-selected class"));
  }

  t.it('Should select task on row select', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0
    });
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              checkUnselected(t, '1');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      click: '.b-grid-row.id1',
      desc: 'Click on row'
    }, {
      waitForSelector: '.b-task-selected'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              checkSelected(t, '1');

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), {
      click: '.b-grid-subgrid-normal .b-grid-row.id11',
      desc: 'Click empty space'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              checkUnselected(t, '1');
              checkSelected(t, '11');

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  t.it('Should select row on task click', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0
    });
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              checkUnselected(t, '1');

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })), {
      click: '[data-task-id="12"]',
      desc: 'Click on task'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              checkSelected(t, '12');

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })), {
      click: '[data-task-id="13"]',
      options: {
        metaKey: true,
        ctrlKey: true
      },
      desc: 'Multiselect with ctrl click on task'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              checkSelected(t, '12');
              checkSelected(t, '13');

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
  t.it('Contextmenu should preserve selection', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0,
      features: {
        taskTooltip: false
      }
    });
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              checkUnselected(t, '1');

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })), {
      click: '[data-task-id="12"]',
      desc: 'Click on task 12'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              checkSelected(t, '12');

            case 1:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })), {
      click: '[data-task-id="13"]',
      options: {
        metaKey: true,
        ctrlKey: true
      },
      desc: 'Ctrl+click on task 13'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              checkSelected(t, '12');
              checkSelected(t, '13');

            case 2:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })), {
      contextmenu: '[data-task-id="13"]',
      desc: 'Contextmenu on a multiselection of tasks'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              checkSelected(t, '12');
              checkSelected(t, '13');

            case 2:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  t.it('Should select task and not scroll on empty space click', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      var config;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return ProjectGenerator.generateAsync(100, 30, function () {});

            case 2:
              config = _context11.sent;
              gantt = t.getGantt({
                appendTo: document.body,
                project: config,
                startDate: config.startDate,
                endDate: config.endDate
              });
              gantt.subGrids.normal.scrollable.x = 300;
              t.chain({
                click: '.b-grid-subgrid-normal .b-grid-row[data-index="1"]'
              }, {
                waitForSelector: '.b-task-selected'
              }, function (next) {
                checkSelected(t, '2');
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved');
                next();
              }, {
                click: '.b-grid-subgrid-normal .b-grid-row[data-index="2"]'
              }, function (next) {
                t.is(gantt.subGrids.normal.scrollable.x, 300, 'Scroll position preserved'); // Scroll to check selecting invisible tasks below

                gantt.subGrids.normal.scrollable.y = 1800;
                t.notOk(gantt.getElementFromTaskRecord(gantt.taskStore.getById('58')), 'Task is not rendered');
                next();
              }, {
                click: '.b-grid-row[data-index="52"]'
              }, function (next) {
                // Scroll to make task visible
                gantt.subGrids.normal.scrollable.x = 1000;
                next();
              }, function () {
                checkSelected(t, '58');
              });

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x) {
      return _ref11.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/429

  t.it('Should update task selection if project is reloaded', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              t.mockUrl('load', function (url, params, options) {
                return {
                  responseText: JSON.stringify({
                    success: true,
                    revision: 1,
                    tasks: {
                      rows: t.getProjectTaskData()
                    }
                  })
                };
              });
              gantt = t.getGantt({
                project: {
                  transport: {
                    load: {
                      url: 'load'
                    }
                  }
                }
              });
              gantt.selectedRecord = gantt.project.firstChild;
              _context12.next = 5;
              return gantt.project.load();

            case 5:
              t.is(gantt.selectedRecord, gantt.project.firstChild, 'Selected parent node still selected after project reload');
              gantt.selectedRecord = gantt.project.taskStore.getById(11);
              _context12.next = 9;
              return gantt.project.load();

            case 9:
              t.is(gantt.selectedRecord, gantt.project.taskStore.getById(11), 'Selected leaf node still selected after project reload');

            case 10:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x2) {
      return _ref12.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/495

  t.it('Should not fail on ctrl/cmd drag', function (t) {
    gantt = t.getGantt();
    t.chain({
      action: 'drag',
      target: '[data-task-id="11"]',
      options: {
        ctrlKey: true
      },
      by: [100, 0]
    }, function () {
      t.is(gantt.selectedRecord, gantt.taskStore.getById(11), 'Selected record is correct');
    });
  });
  t.it('Should not fail on ctrl/cmd drag in case of multiselection', function (t) {
    gantt = t.getGantt();
    var task11 = gantt.taskStore.getById(11),
        task12 = gantt.taskStore.getById(12);
    t.chain({
      click: '[data-task-id="12"]',
      ctrlKey: true
    }, {
      action: 'drag',
      target: '[data-task-id="11"]',
      options: {
        ctrlKey: true
      },
      by: [100, 0]
    }, function () {
      t.is(gantt.selectedRecord, task11, 'Selected record is correct');
      t.is(gantt.selectedRecords.length, 2, 'Selection is correct');
      t.is(gantt.selectedRecords[0], task12, 'First selected record is correct');
      t.is(gantt.selectedRecords[1], task11, 'Second selected record is correct');
    });
  });
});