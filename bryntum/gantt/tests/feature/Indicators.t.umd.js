function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, project;
  t.beforeEach(function (t) {
    project && project.destroy();
    gantt && gantt.destroy();
  });

  function createGantt() {
    return _createGantt.apply(this, arguments);
  }

  function _createGantt() {
    _createGantt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var config,
          _args6 = arguments;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              config = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
              project = new ProjectModel({
                tasksData: [{
                  id: 1,
                  name: 'Task 1',
                  expanded: true,
                  startDate: '2020-02-24',
                  children: [{
                    id: 11,
                    name: 'Task 11',
                    startDate: '2020-02-24',
                    duration: 2,
                    constraintDate: '2020-02-24',
                    constraintType: 'muststarton'
                  }, {
                    id: 12,
                    name: 'Task 12',
                    startDate: '2020-02-24',
                    duration: 2,
                    deadlineDate: '2020-03-05'
                  }, {
                    id: 13,
                    name: 'Task 13',
                    startDate: '2020-02-24',
                    duration: 2
                  }, {
                    id: 14,
                    name: 'Task 14',
                    startDate: '2020-02-24',
                    duration: 2
                  }]
                }],
                dependenciesData: [{
                  fromEvent: 11,
                  toEvent: 12
                }, {
                  fromEvent: 12,
                  toEvent: 13
                }, {
                  fromEvent: 13,
                  toEvent: 14
                }]
              });
              gantt = t.getGantt(Object.assign({
                features: {
                  indicators: true
                },
                rowHeight: 50,
                barMargin: 15,
                enableEventAnimations: false,
                startDate: '2020-02-24',
                project: project
              }, config));
              _context6.next = 5;
              return project.waitForPropagateCompleted();

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _createGantt.apply(this, arguments);
  }

  t.it('Should render default indicators', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return createGantt();

            case 2:
              t.selectorExists('.b-indicator.b-early-dates', 'Early start/end date indicator rendered');
              t.selectorExists('.b-indicator.b-late-dates', 'Late start/end date indicator renderred');
              t.selectorExists('.b-indicator.b-constraint-date', 'Constraint date indicator rendered');
              t.selectorExists('.b-indicator.b-deadline-date', 'Deadline indicator rendered');

            case 6:
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
  t.it('Should render custom indicators', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createGantt({
                features: {
                  indicators: {
                    items: {
                      beer: function beer(taskRecord) {
                        return {
                          startDate: taskRecord.startDate,
                          name: 'Beer',
                          iconCls: 'b-fa b-fa-beer'
                        };
                      }
                    }
                  }
                }
              });

            case 2:
              t.selectorCountIs('.b-indicator .b-fa-beer', gantt.taskStore.count, 'Custom indicators rendered');

            case 3:
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
  t.it('Should allow toggling indicators', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return createGantt({
                features: {
                  indicators: {
                    items: {
                      earlyDates: false,
                      beer: function beer(taskRecord) {
                        return {
                          startDate: taskRecord.startDate,
                          name: 'Dog',
                          iconCls: 'b-fa b-fa-dog'
                        };
                      }
                    }
                  }
                }
              });

            case 2:
              t.selectorNotExists('.b-early-dates', 'Early dates not rendered');
              gantt.features.indicators.items.earlyDates = true;
              gantt.features.indicators.items.beer = false;
              t.selectorExists('.b-early-dates', 'Early dates rendered');
              t.selectorNotExists('.b-indicator .b-fa-dog', 'Custom not rendered');

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should update UI on data changes', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      var constraintElement, deadlineElement, constraintBox, deadlineBox, deltaConstraint, deltaDeadline;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return createGantt();

            case 2:
              constraintElement = document.querySelector('.b-indicator.b-constraint-date'), deadlineElement = document.querySelector('.b-indicator.b-deadline-date'), constraintBox = Rectangle.from(constraintElement), deadlineBox = Rectangle.from(deadlineElement);
              t.diag('Changing constraint and deadline dates');
              gantt.taskStore.getById(11).constraintDate = '2020-02-25';
              gantt.taskStore.getById(12).deadlineDate = '2020-03-06';
              _context4.next = 8;
              return project.propagate();

            case 8:
              deltaConstraint = constraintBox.getDelta(Rectangle.from(constraintElement)), deltaDeadline = deadlineBox.getDelta(Rectangle.from(deadlineElement));
              t.selectorCountIs('.b-indicator.b-constraint-date', 1, 'Single constraint indicator');
              t.selectorCountIs('.b-indicator.b-deadline-date', 1, 'Single deadline indicator');
              t.is(document.querySelector('.b-indicator.b-constraint-date'), constraintElement, 'Constraint element reused');
              t.is(document.querySelector('.b-indicator.b-deadline-date'), deadlineElement, 'Deadline element reused');
              t.is(deltaConstraint[0], gantt.tickWidth, 'Constraint did move correct distance horizontally');
              t.is(deltaConstraint[1], 0, 'Constraint did not move vertically');
              t.is(deltaDeadline[0], gantt.tickWidth, 'Deadline did move correct distance horizontally');
              t.is(deltaDeadline[1], 0, 'Deadline did not move vertically');
              t.diag('Nulling deadline date');
              gantt.taskStore.getById(12).deadlineDate = null;
              t.selectorNotExists('.b-indicator.b-deadline-date', 'No deadline indicator');

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should not show point-in-time indicators that are outside time axis', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return createGantt({
                project: {
                  tasksData: [{
                    id: 11,
                    name: 'Task 11',
                    startDate: '2020-03-01',
                    duration: 2,
                    constraintDate: '2020-03-01',
                    constraintType: 'muststarton'
                  }]
                },
                features: {
                  indicators: {
                    items: {
                      earlyDates: false,
                      beer: function beer(taskRecord) {
                        return {
                          startDate: new Date(2020, 1, 22),
                          name: 'Dog',
                          iconCls: 'b-fa b-fa-dog'
                        };
                      }
                    }
                  }
                }
              });

            case 2:
              t.selectorNotExists('.b-indicator .b-fa-dog', 'Indicators outside axis not rendered');

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());
});