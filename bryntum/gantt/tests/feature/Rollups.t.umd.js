function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && !gantt.isDestroyed && gantt.destroy();
  });
  t.it('Rollups should render child tasks under parent task bar', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var taskStore, projectA, child1;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                startDate: '2019-07-07',
                endDate: '2019-07-29',
                features: {
                  rollups: true
                },
                rowHeight: 70,
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
                      duration: 1,
                      leaf: true,
                      rollup: true,
                      cls: 'child1'
                    }, {
                      id: 12,
                      name: 'Child 2',
                      duration: 5,
                      leaf: true,
                      rollup: true,
                      cls: 'child1'
                    }, {
                      id: 13,
                      name: 'Child 3',
                      duration: 0,
                      leaf: true,
                      rollup: true,
                      cls: 'child1'
                    }]
                  }],
                  dependenciesData: [{
                    id: 1,
                    fromEvent: 12,
                    toEvent: 13
                  }]
                }
              });
              taskStore = gantt.taskStore, projectA = taskStore.first, child1 = projectA.children[0];
              t.chain( // Move in from the right, not diagonally from 0, 0 which would be the default.
              {
                moveMouseTo: '.b-task-rollup[data-index="2"]',
                offset: ['100%+60', '50%']
              }, {
                moveMouseTo: '.b-task-rollup[data-index="2"]'
              }, // Only over the Child 3 milestone
              {
                waitForSelector: '.b-tooltip:contains(Child 3):not(:contains(Child 1)):not(:contains(Child 2))'
              }, {
                moveMouseTo: '.b-task-rollup[data-index="1"]'
              }, // Only over Child 2
              {
                waitForSelector: '.b-tooltip:contains(Child 2):not(:contains(Child 1)):not(:contains(Child 3))'
              }, {
                moveMouseTo: '.b-task-rollup[data-index="0"]'
              }, // We're over child 1 *and* child 2 now, not child 3
              {
                waitForSelector: '.b-tooltip:contains(Child 1):contains(Child 2):not(:contains(Child 3))'
              }, {
                moveMouseTo: [0, 0]
              }, function (next) {
                projectA.removeChild(child1);
                next();
              }, // Rollups must be trimmed on child remove
              {
                waitForSelectorNotFound: '.b-task-rollup[data-index="2"]'
              }, function (next) {
                projectA.insertChild(child1, projectA.children[0]);
                next();
              }, // Rollups must be added to oo child add
              {
                waitForSelector: '.b-task-rollup[data-index="2"]'
              });

            case 3:
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
  t.it('Rollups should render child tasks when parent is collapsed', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt = t.getGantt({
                startDate: '2019-07-07',
                endDate: '2019-07-29',
                features: {
                  rollups: true
                },
                project: {
                  startDate: '2019-07-07',
                  duration: 30,
                  eventsData: [{
                    id: 1,
                    name: 'Project A',
                    duration: 30,
                    expanded: false,
                    children: [{
                      id: 11,
                      name: 'Child 1',
                      duration: 1,
                      leaf: true,
                      rollup: true
                    }]
                  }]
                }
              });
              t.chain({
                waitForSelector: '[data-rollup-task-id="11"]'
              });

            case 2:
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
  t.it('Should not render rollup for tasks starting after timeaxis end date', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              gantt = t.getGantt({
                startDate: '2017-01-15',
                endDate: '2017-02-26',
                features: {
                  rollups: true
                },
                project: {
                  startDate: '2017-01-08',
                  duration: 80,
                  eventsData: [{
                    id: 1,
                    name: 'Project A',
                    startDate: '2017-01-08',
                    duration: 80,
                    expanded: true,
                    children: [{
                      id: 11,
                      startDate: '2017-01-15',
                      name: 'Starts before timeaxis, ends inside',
                      duration: 10,
                      rollup: true,
                      leaf: true
                    }, {
                      id: 12,
                      startDate: '2017-03-17',
                      name: 'Starts after time axis end',
                      duration: 80,
                      rollup: true,
                      manuallyScheduled: true,
                      leaf: true
                    }]
                  }]
                }
              });
              t.chain({
                waitForSelector: '.b-gantt-task-wrap'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        return _context3.abrupt("return", t.selectorExists('.b-task-rollup[data-rollup-task-id="11"]'));

                      case 1:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", t.selectorNotExists('.b-task-rollup[data-rollup-task-id="12"]'));

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })));

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
});