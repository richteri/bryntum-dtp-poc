function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global ProjectModel */
StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should render duration', function (t) {
    var project = new ProjectModel({
      startDate: '2017-01-16',
      eventsData: [{
        id: 1,
        cls: 'id1',
        name: 'Planning',
        percentDone: 60,
        startDate: '2017-01-16',
        duration: 10,
        expanded: true,
        rollup: true,
        children: [{
          id: 11,
          cls: 'id11',
          name: 'Investigate',
          percentDone: 70,
          startDate: '2017-01-16',
          duration: 10,
          durationUnit: 'day'
        }, {
          id: 12,
          cls: 'id12',
          name: 'Assign resources',
          percentDone: 60,
          startDate: '2017-01-16',
          duration: 8,
          durationUnit: 'minute'
        }, {
          id: 13,
          cls: 'id13',
          name: 'Assign resources',
          percentDone: 60,
          startDate: '2017-01-16'
        }]
      }]
    });
    gantt = t.getGantt({
      appendTo: document.body,
      height: 300,
      project: project,
      columns: [{
        type: NameColumn.type,
        width: 150
      }, {
        type: DurationColumn.type,
        width: 150
      }]
    });
    t.chain({
      waitForPropagate: project
    }, {
      waitForSelector: '.b-number-cell:textEquals(10 days)'
    }, {
      waitForSelector: '.b-number-cell:textEquals(8 minutes)'
    }, {
      waitForSelector: '.b-grid-row:last-child .b-number-cell:empty'
    });
  });
  t.it('Should not be allowed to edit duration on parents', function (t) {
    var project = new ProjectModel({
      startDate: '2017-01-16',
      eventsData: [{
        id: 1,
        name: 'Planning',
        percentDone: 60,
        startDate: '2017-01-16',
        duration: 10,
        expanded: true,
        children: [{
          id: 11,
          name: 'Investigate',
          percentDone: 70,
          startDate: '2017-01-16',
          duration: 10,
          durationUnit: 'day'
        }]
      }]
    });
    gantt = t.getGantt({
      appendTo: document.body,
      height: 300,
      project: project,
      columns: [{
        type: NameColumn.type,
        width: 150
      }, {
        type: DurationColumn.type,
        width: 150
      }]
    });
    t.chain({
      waitForPropagate: project
    }, {
      dblClick: '.b-tree-parent-row [data-column=fullDuration]'
    }, function (next) {
      t.selectorNotExists('.b-editor', 'No editor shown parent');
      next();
    }, {
      dblClick: '.b-grid-row:not(.b-tree-parent-row) [data-column=fullDuration]'
    }, {
      waitForSelector: '.b-editor',
      desc: 'Editor shown for child'
    });
  });
  t.it('Should not try to instantly update invalid values', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 11,
          duration: 10
        }]
      },
      columns: [{
        type: DurationColumn.type,
        width: 150
      }]
    });
    t.wontFire(gantt.taskStore, 'update');
    t.chain({
      dblClick: '.b-grid-cell[data-column=fullDuration]'
    }, {
      type: '-1',
      clearExisting: true
    });
  }); // https://github.com/bryntum/support/issues/1135

  t.it('Should sort duration values correctly', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 11,
          name: 'Planning',
          percentDone: 60,
          startDate: '2017-01-16',
          duration: 10,
          expanded: true,
          children: [{
            id: 1,
            name: 'One',
            percentDone: 70,
            startDate: '2017-01-16',
            duration: 1,
            durationUnit: 'day'
          }, {
            id: 2,
            name: 'Ten',
            percentDone: 70,
            startDate: '2017-01-16',
            duration: 10,
            durationUnit: 'day'
          }, {
            id: 3,
            name: 'Five',
            percentDone: 70,
            startDate: '2017-01-16',
            duration: 5,
            durationUnit: 'day'
          }, {
            id: 5,
            name: 'Thousand',
            percentDone: 70,
            startDate: '2017-01-16',
            duration: 1000,
            durationUnit: 'second'
          }]
        }]
      },
      columns: [{
        type: DurationColumn.type
      }]
    });
    var tasks = gantt.taskStore.rootNode.firstChild.children;
    t.chain({
      click: '.b-grid-header[data-column=fullDuration]'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", t.isDeeply(tasks.map(function (task) {
                return task.duration;
              }), [1000, 1, 5, 10]));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      click: '.b-grid-header[data-column=fullDuration]'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", t.isDeeply(tasks.map(function (task) {
                return task.duration;
              }), [10, 5, 1, 1000]));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  t.it('Should show error tooltip when finalizeCellEditor returns false', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 1,
          name: 'Task',
          startDate: '2017-01-16',
          duration: 1,
          durationUnit: 'day'
        }]
      },
      columns: [{
        type: DurationColumn.type,
        finalizeCellEdit: function () {
          var _finalizeCellEdit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref3) {
            var value;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    value = _ref3.value;

                    if (!(value.magnitude > 10)) {
                      _context3.next = 3;
                      break;
                    }

                    return _context3.abrupt("return", 'foo');

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          function finalizeCellEdit(_x) {
            return _finalizeCellEdit.apply(this, arguments);
          }

          return finalizeCellEdit;
        }()
      }]
    });
    t.wontFire(gantt.taskStore, 'add', 'Tabbing out of invalid cell did not create a new row');
    t.chain({
      dblclick: '.b-grid-cell[data-column=fullDuration]'
    }, {
      type: '11d',
      clearExisting: true
    }, {
      type: '[TAB]'
    }, {
      waitForSelector: '#bryntum-field-errortip:contains(foo)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", t.selectorExists('.b-durationfield.b-invalid'));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  t.it('Should hide error tooltip when finalizeCellEditor returns true after first returning false', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 1,
          name: 'Task',
          startDate: '2017-01-16',
          duration: 1,
          durationUnit: 'day'
        }]
      },
      columns: [{
        type: DurationColumn.type,
        finalizeCellEdit: function () {
          var _finalizeCellEdit2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref5) {
            var value;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    value = _ref5.value;

                    if (!(value.magnitude > 10)) {
                      _context5.next = 3;
                      break;
                    }

                    return _context5.abrupt("return", 'foo');

                  case 3:
                    return _context5.abrupt("return", true);

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          function finalizeCellEdit(_x2) {
            return _finalizeCellEdit2.apply(this, arguments);
          }

          return finalizeCellEdit;
        }()
      }]
    });
    t.firesOnce(gantt.taskStore, 'add', 'Tabbing out of valid cell did create a new row');
    t.chain({
      dblclick: '.b-grid-cell[data-column=fullDuration]'
    }, {
      type: '11d',
      clearExisting: true
    }, {
      type: '[TAB]'
    }, {
      waitForSelector: '#bryntum-field-errortip:contains(foo)'
    }, {
      type: '9d',
      clearExisting: true
    }, {
      type: '[TAB]'
    }, {
      waitForSelectorNotfound: '.b-durationfield.b-invalid'
    }, {
      waitForSelector: '.b-textfield [name=name]:focus'
    }, {
      type: 'Hello[ENTER]',
      clearExisting: true
    }, function () {
      return t.is(gantt.taskStore.rootNode.lastChild.name, 'Hello');
    });
  });
});