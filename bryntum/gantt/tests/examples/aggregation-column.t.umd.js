function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, task;
  t.waitFor(function () {
    gantt = bryntum.query('gantt');

    if (gantt) {
      task = gantt.taskStore.first;
      return true;
    }
  });
  t.it('Should edit child cost inline and recalculate parent cost', function (t) {
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t.is(task.cost, 116750, 'Correct cost calculated');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      waitForSelector: '.b-grid-cell:contains("$116750")',
      description: 'Correct cost displayed'
    }, {
      dblClick: '.b-grid-row[data-index="2"] .b-grid-cell[data-column="cost"]',
      description: 'Open cost column editor'
    }, {
      waitForSelector: '.b-grid-cell[data-column="cost"].b-editing',
      description: 'Editor displayed'
    }, {
      type: '10[ENTER]',
      description: 'Edit Cost',
      clearExisting: true
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t.is(task.cost, 116560, 'Correct cost calculated');

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), {
      waitForSelector: '.b-grid-cell:contains("$116560")',
      description: 'Correct cost displayed'
    });
  });
  t.it('Should edit child cost in Task edit dialog and recalculate parent cost', function (t) {
    t.chain({
      rightClick: '.b-grid-row[data-index="2"] .b-grid-cell[data-column="cost"]',
      description: 'Open cost column editor'
    }, {
      click: '.b-menu-text:contains(Edit)'
    }, {
      click: '.b-numberfield input[name=cost]'
    }, {
      type: '20',
      description: 'Edit Cost',
      clearExisting: true
    }, {
      click: '.b-button:contains(Save)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              t.is(task.cost, 116570, 'Correct cost calculated');

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), {
      waitForSelector: '.b-grid-cell:contains("$116570")',
      description: 'Correct cost displayed'
    });
  });
  t.it('Should not edit calculated parent cost', function (t) {
    t.chain({
      dblClick: '.b-grid-row[data-index="1"] .b-grid-cell[data-column="cost"]',
      description: 'Try to open cost column editor'
    }, {
      waitForSelectorNotFound: '.b-grid-cell[data-column="cost"].b-editing',
      description: 'Editor does not displayed'
    });
  });
  t.it('Should edit parent name', function (t) {
    t.chain({
      dblClick: '.b-grid-row[data-index="1"] .b-grid-cell[data-column="name"]',
      description: 'Try to open name column editor'
    }, {
      waitForSelector: '.b-grid-cell[data-column="name"].b-editing',
      description: 'Editor is displayed'
    });
  }); // Caught by monkeytest

  t.it('Should not fail on dblclick at normal subgrid', function (t) {
    t.chain({
      dblClick: '.b-grid-subgrid-normal',
      offset: [100, 50]
    });
  });
});