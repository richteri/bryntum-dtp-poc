function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && !gantt.isDestroyed && gantt.destroy();
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      appendTo: document.body
    });
  });
  t.it('Should add hover class to task and all its dependencies', function (t) {
    t.chain({
      moveCursorTo: '.b-gantt-task-wrap:not(.b-gantt-task-parent)'
    }, {
      waitForSelector: '.b-gantt-task-wrap.b-gantt-task-hover'
    }, {
      waitForSelector: '.b-sch-dependency-over'
    });
  });
  t.it('Should display terminals for task moved by propagate', function (t) {
    gantt.dependencyStore.removeAll();
    t.chain({
      moveMouseTo: [0, 0]
    }, {
      moveMouseTo: '[data-task-id="11"]'
    }, {
      drag: '.b-sch-terminal-right',
      to: '[data-task-id="12"]',
      dragOnly: true
    }, {
      moveMouseTo: '[data-task-id="12"] .b-sch-terminal-left'
    }, {
      mouseUp: null
    }, {
      waitForPropagate: gantt.project
    }, {
      moveMouseTo: '[data-task-id="12"]'
    }, function () {
      t.selectorExists('[data-task-id="12"] .b-sch-terminal-left', 'Terminal shown');
    });
  });
  t.it('Should not fail on hover over task and dependencies', function (t) {
    var dependencyChain = [],
        taskChain = [];
    DomHelper.forEachSelector('.b-sch-dependency', function (element) {
      dependencyChain.push({
        moveMouseTo: element
      });
    });
    gantt.taskStore.forEach(function (task) {
      taskChain.push({
        moveMouseTo: "[data-task-id=\"".concat(task.id, "\"]")
      });
    });
    t.chain(dependencyChain, taskChain, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt.dependencyStore.removeAll();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), taskChain);
  });
});