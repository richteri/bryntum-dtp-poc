function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.describe('Milestone column based on checkbox', function (t) {
    t.it('Should render properly', function (t) {
      gantt = t.getGantt({
        appendTo: document.body,
        id: 'gantt',
        columns: [{
          type: MilestoneColumn.type,
          width: 80
        }]
      });
      t.chain({
        waitForRowsVisible: gantt
      }, function (next) {
        t.selectorExists('[data-index=2] [data-column=milestone] .b-checkbox', 'Cell rendered correctly');
        t.selectorExists('[data-index=5] [data-column=milestone] .b-checkbox input:checked', 'Cell rendered correctly');
        next();
      });
    });
    t.it('Should change milestone property', function (t) {
      gantt = t.getGantt({
        appendTo: document.body,
        id: 'gantt',
        columns: [{
          type: MilestoneColumn.type,
          width: 80
        }]
      });
      t.chain({
        waitForRowsVisible: gantt
      }, {
        click: '[data-index=2] [data-column=milestone] .b-checkbox'
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", gantt.project.waitForPropagateCompleted());

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })), function (next) {
        t.ok(gantt.taskStore.getAt(2).milestone, 'Milestone status changed');
        next();
      }, {
        click: '[data-index=2] [data-column=milestone] .b-checkbox'
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", gantt.project.waitForPropagateCompleted());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })), function (next) {
        t.notOk(gantt.taskStore.getAt(2).milestone, 'Milestone status changed back');
        next();
      });
    });
  });
});