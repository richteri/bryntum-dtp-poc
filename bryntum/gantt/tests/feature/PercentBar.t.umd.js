function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function assertPercentBarWidth(t, taskRecord) {
    var taskElement = gantt.getElementFromTaskRecord(taskRecord),
        percentBar = taskElement.querySelector('.b-gantt-task-percent'),
        expectedWidth = taskElement.offsetWidth * taskRecord.percentDone / 100;
    t.isApprox(expectedWidth, percentBar.offsetWidth, "Correct percent bar width for ".concat(taskRecord.name, ", ").concat(taskRecord.percentDone, "%"));
  }

  t.it('Should render percent bars', function (t) {
    gantt = t.getGantt();
    var taskElements = Array.from(document.querySelectorAll('.b-gantt-task-wrap:not(.b-milestone-wrap)'));
    t.selectorExists('.b-gantt-task-percent', 'Percent bar rendered');
    t.selectorCountIs('.b-gantt-task-percent', taskElements.length, 'One per normal task rendered'); // Check all widths

    taskElements.forEach(function (taskElement) {
      assertPercentBarWidth(t, gantt.resolveTaskRecord(taskElement));
    });
  });
  t.it('Should update percent bar when data changes', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                enableEventAnimations: false
              });
              task = gantt.taskStore.getById(11);
              _context.next = 4;
              return task.setPercentDone(10);

            case 4:
              assertPercentBarWidth(t, task);
              _context.next = 7;
              return task.setPercentDone(90);

            case 7:
              assertPercentBarWidth(t, task);
              _context.next = 10;
              return task.setPercentDone(100);

            case 10:
              assertPercentBarWidth(t, task);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should set percent to 0 if dragging fully to the start of the bar', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt = t.getGantt();
              task = gantt.taskStore.getById(11);
              task.cls = 'foo';
              _context2.next = 5;
              return task.setDuration(1);

            case 5:
              _context2.next = 7;
              return task.setPercentDone(10);

            case 7:
              t.chain({
                moveCursorTo: '.foo.b-gantt-task'
              }, {
                drag: '.foo .b-gantt-task-percent-handle',
                by: [-100, 0]
              }, {
                waitForPropagate: gantt.project
              }, function () {
                t.is(task.percentDone, 0);
                t.is(task.duration, 1);
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should be possible to resize percent bar to 100% of the task width', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              gantt = t.getGantt({
                tickWidth: 40,
                features: {
                  taskTooltip: false
                }
              });
              t.chain({
                waitForPropagate: gantt
              }, {
                moveMouseTo: '.b-gantt-task.id11'
              }, {
                drag: '.id11 .b-gantt-task-percent-handle',
                by: [400, 0],
                dragOnly: true
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var barEl, barWidth, taskWidth;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        barEl = document.querySelector('.id11 .b-gantt-task-percent'), barWidth = barEl.offsetWidth, taskWidth = barEl.parentElement.offsetWidth;
                        t.is(barWidth, taskWidth, 'Percent bar size is ok');

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })), {
                moveMouseTo: '.b-gantt-task.id11',
                offset: [0, '50%']
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var barEl, barWidth;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        barEl = document.querySelector('.id11 .b-gantt-task-percent'), barWidth = barEl.offsetWidth;
                        t.is(barWidth, 1, 'Percent bar size is ok');

                      case 2:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                mouseUp: null
              });

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should not show resize handle if Gantt is readOnly', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              gantt = t.getGantt({
                readOnly: true,
                features: {
                  taskTooltip: false
                }
              });
              task = gantt.taskStore.getById(11);
              task.cls = 'foo';
              t.chain({
                moveCursorTo: '.b-gantt-task.foo'
              }, function () {
                t.elementIsNotVisible('.foo .b-gantt-task-percent-handle', 'Handle not shown when readOnly is set');
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', function (t) {
    gantt = t.getGantt({
      tasks: [{
        id: 6,
        name: 'Task 6',
        startDate: new Date(2011, 6, 28),
        duration: 5
      }]
    });
    gantt.features.percentBar.disabled = true;
    t.selectorNotExists('.b-gantt-task-percent', 'No percent bars');
    gantt.features.percentBar.disabled = false;
    t.selectorExists('.b-gantt-task-percent', 'Percent bars shown');
    gantt.features.percentBar.allowResize = false;
    t.chain({
      moveCursorTo: '.b-gantt-task-wrap:not(.b-gantt-task-parent) .b-gantt-task'
    }, function (next) {
      t.elementIsNotVisible('.b-gantt-task-percent-handle', 'resize handle hidden');
      gantt.features.percentBar.allowResize = true;
      next();
    }, {
      moveCursorTo: [0, 0]
    }, {
      moveCursorTo: '.b-gantt-task-wrap:not(.b-gantt-task-parent) .b-gantt-task'
    }, function (next) {
      t.elementIsVisible('.b-gantt-task-percent-handle', 'resize handle visible');
    });
  });
  t.it('Percent bar drag should not affect the task duration', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              new Panel({
                adopt: document.body,
                layout: 'fit',
                items: [gantt = t.getGantt({
                  appendTo: null
                })]
              });
              task = gantt.taskStore.getById(11);
              task.cls = 'foo';
              _context7.next = 5;
              return task.setDuration(1);

            case 5:
              _context7.next = 7;
              return task.setPercentDone(10);

            case 7:
              t.chain({
                moveCursorTo: '.foo.b-gantt-task'
              }, {
                drag: '.foo .b-gantt-task-percent-handle',
                by: [100, 0]
              }, {
                waitForPropagate: gantt.project
              }, function () {
                t.is(task.percentDone, 100);
                t.is(task.duration, 1);
              });

            case 8:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x5) {
      return _ref7.apply(this, arguments);
    };
  }());
});