function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && gantt.destroy();
  });
  t.it('Should render properly', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: SchedulingModeColumn.type,
        width: 80
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function (next) {
      t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)', 'Cell rendered correctly');
      t.selectorExists('[data-index=3] [data-column=schedulingMode]:textEquals(Fixed Units)', 'Cell rendered correctly');
      t.selectorExists('[data-index=4] [data-column=schedulingMode]:textEquals(Fixed Effort)', 'Cell rendered correctly');
      next();
    });
  });
  t.it('Should change scheduling mode property', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: SchedulingModeColumn.type,
        width: 80
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, {
      dblclick: '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)'
    }, {
      click: '.b-fieldtrigger'
    }, {
      click: '.b-list-item:textEquals(Fixed Units)'
    }, {
      type: '[TAB]'
    }, function (next) {
      t.is(gantt.taskStore.getAt(2).schedulingMode, 'FixedUnits', 'Switched to fixed units');
      next();
    }, {
      dblclick: '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Units)'
    }, {
      click: '.b-fieldtrigger'
    }, {
      click: '.b-list-item:textEquals(Fixed Effort)'
    }, {
      type: '[TAB]'
    }, function (next) {
      t.is(gantt.taskStore.getAt(2).milestone, false, 'Switched to fixed effort');
      next();
    }, {
      dblclick: '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Effort)'
    }, {
      click: '.b-fieldtrigger'
    }, {
      click: '.b-list-item:textEquals(Fixed Duration)'
    }, {
      type: '[TAB]'
    }, function (next) {
      t.is(gantt.taskStore.getAt(2).schedulingMode, 'FixedDuration', 'Switched to fixed duration');
      next();
    });
  });
  t.it('Should update display value when scheduling mode is changed', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: SchedulingModeColumn.type,
        width: 80
      }]
    });
    var model = gantt.taskStore.getAt(2),
        project = gantt.project;
    t.chain({
      waitForRowsVisible: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              model.schedulingMode = 'FixedUnits';
              _context2.next = 3;
              return project.propagate();

            case 3:
              t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Units)', 'Cell re-rendered correctly');
              model.schedulingMode = 'FixedEffort';
              _context2.next = 7;
              return project.propagate();

            case 7:
              t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Effort)', 'Cell re-rendered correctly');
              model.schedulingMode = 'FixedDuration';
              _context2.next = 11;
              return project.propagate();

            case 11:
              t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)', 'Cell re-rendered correctly');

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
});