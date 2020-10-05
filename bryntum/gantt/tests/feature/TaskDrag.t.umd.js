function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Basic dragging should work', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task = gantt.taskStore.getById(11),
        taskSelector = "[data-task-id=".concat(task.id, "]"),
        initialX = DomHelper.getTranslateX(t.query(taskSelector)[0]),
        initialStart = task.startDate,
        deltaX = gantt.tickSize * 2;
    t.chain({
      drag: taskSelector,
      by: [deltaX, 0]
    }, function (next, el) {
      t.is(task.startDate, DateHelper.add(initialStart, 2, 'days'), 'Correct startDate after drag');
      t.isApprox(DomHelper.getTranslateX(el), initialX + deltaX, 'Correct x after drag');
    });
  });
  t.it('Dragging a parent in a big data set should work', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var config, initialPosition;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return ProjectGenerator.generateAsync(500, 50, function () {});

            case 2:
              config = _context.sent;
              gantt = t.getGantt({
                appendTo: document.body,
                project: config,
                startDate: config.startDate,
                endDate: config.endDate,
                features: {
                  taskTooltip: false
                }
              });
              t.chain({
                waitForPropagate: gantt
              }, function (next) {
                // remember initial left coordinate
                initialPosition = Rectangle.from(document.querySelector('[data-task-id="2"]'), gantt.timeAxisSubGridElement).x;
                next();
              }, {
                drag: '[data-task-id="2"]',
                by: [100, 0],
                desc: 'Task dragged +100 pixels to the right'
              }, {
                waitForPropagate: gantt.project
              }, function () {
                t.isApprox(Rectangle.from(document.querySelector('[data-task-id="2"]'), gantt.timeAxisSubGridElement).x, initialPosition + 100, 'Correct position');
              });

            case 5:
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
  t.it('Dragging a task to before the project start date should fail and reset', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var config, startX;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return ProjectGenerator.generateAsync(500, 50, function () {});

            case 2:
              config = _context2.sent;
              gantt = t.getGantt({
                appendTo: document.body,
                project: config,
                // Create space to the left to drag into
                startDate: DateHelper.add(config.startDate, -7, 'days'),
                endDate: config.endDate,
                features: {
                  taskTooltip: false,
                  projectLines: true
                }
              });
              t.chain({
                waitForPropagate: gantt
              }, function (next) {
                startX = document.querySelector('[data-task-id="3"]').getBoundingClientRect().left;
                next();
              }, // Drag to before project start date
              {
                drag: '[data-task-id="3"]',
                by: [-100, 0],
                desc: 'Dragging to before project start date'
              }, {
                waitForPropagate: gantt.project
              }, {
                waitFor: function waitFor() {
                  return document.querySelector('[data-task-id="3"]').getBoundingClientRect().left === startX;
                },
                desc: 'Task reverted to original position'
              });

            case 5:
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
  t.it('Should live ok when dragging outside of timeline view', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, {
      drag: '.b-gantt-task.id12',
      to: '.id12'
    }, {
      drag: '.b-gantt-task.id12',
      to: '.b-sch-header-timeaxis-cell'
    });
  });
  t.it('Should reschedule project after task reordering', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, {
      drag: '.id13',
      to: '.id21',
      toOffset: [50, 10]
    }, {
      waitFor: function waitFor() {
        var task1 = gantt.taskStore.getById(13),
            task2 = gantt.taskStore.getById(2);
        return task1.parent === task2 && task2.startDate.getTime() === task1.startDate.getTime();
      }
    });
  });
  t.it('Dragging should drag the real task element', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task = gantt.taskStore.getById(11),
        taskEl = gantt.getElementFromTaskRecord(task).parentNode,
        taskSelector = "[data-task-id=".concat(task.id, "]"),
        initialX = DomHelper.getTranslateX(t.query(taskSelector)[0]),
        initialStart = task.startDate,
        deltaX = gantt.tickSize * 2;
    t.chain({
      drag: taskSelector,
      by: [deltaX, 0],
      dragInly: true
    }, function (next, el) {
      var taskEls = Array.from(document.querySelectorAll('[data-task-id="11"]')); // Task element must not be duplicated

      t.is(taskEls.length, 1); // All references to a task bar must reference the real task's element.

      t.is(gantt.features.taskDrag.dragData.eventBarEls[0], taskEl);
      t.is(taskEls[0], taskEl);
      t.is(task.startDate, DateHelper.add(initialStart, 2, 'days'), 'Correct startDate after drag');
      t.isApprox(DomHelper.getTranslateX(el), initialX + deltaX, 'Correct x after drag');
    });
  });
  t.it('Dragging task and moving mouse over the timeline widget should not crash', function (t) {
    new Timeline({
      project: t.getProject(),
      appendTo: document.body
    });
    gantt = t.getGantt();
    t.chain({
      drag: '.b-gantt-task',
      to: '.b-timeline'
    });
  }); // https://github.com/bryntum/support/issues/860

  t.it('Dragging task with dependency to filtered out task should not crash', function (t) {
    gantt = t.getGantt(); // This leaves one event with predecessors and successor filtered out

    gantt.taskStore.filterBy(function (task) {
      return task.name.match(/report/i);
    });
    t.firesOnce(gantt, 'taskdrop');
    t.chain({
      drag: '.b-milestone-wrap',
      by: [100, 0]
    });
  });
});