function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global ProjectModel */
var getProject = function getProject() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new ProjectModel(Object.assign({
    eventsData: [{
      id: 1,
      startDate: new Date(2011, 6, 1),
      endDate: new Date(2011, 6, 5),
      baselines: [{}]
    }, {
      id: 123,
      startDate: new Date(2011, 6, 15),
      endDate: new Date(2011, 6, 23),
      baselines: [{}],
      children: [{
        id: 2,
        startDate: new Date(2011, 6, 16),
        endDate: new Date(2011, 6, 20),
        baselines: [{}]
      }, {
        id: 3,
        startDate: new Date(2011, 6, 18),
        endDate: new Date(2011, 6, 22),
        baselines: [{
          // Task id 3 has slipped by one day from its baseline end date of
          // 21 Jul and 16 days. It ends on 22nd with 17 days.
          endDate: new Date(2011, 6, 21),
          duration: 16
        }]
      }]
    }, {
      id: 4,
      startDate: new Date(2011, 6, 25),
      endDate: new Date(2011, 6, 28),
      baselines: [{}]
    }, {
      id: 5,
      startDate: new Date(2011, 6, 28),
      endDate: new Date(2011, 6, 28),
      baselines: [{}]
    }, {
      id: 6,
      startDate: new Date(2011, 6, 28),
      duration: 0,
      baselines: [{}]
    }],
    dependenciesData: [{
      fromEvent: 1,
      toEvent: 2
    }, {
      fromEvent: 1,
      toEvent: 3
    }, {
      fromEvent: 2,
      toEvent: 4
    }, {
      fromEvent: 3,
      toEvent: 4
    }, {
      fromEvent: 4,
      toEvent: 5
    }]
  }, config));
};

StartTest(function (t) {
  //https://github.com/bryntum/support/issues/142
  t.it('Should be possible to add a copy of an unscheduled task', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var project, original, copy;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = new ProjectModel();
              original = project.taskStore.rootNode.appendChild({
                name: 'New'
              }), copy = project.taskStore.rootNode.appendChild(original.copy()); // Should not throw Graph cycle exception

              _context.next = 4;
              return project.propagate();

            case 4:
              t.is(project.taskStore.rootNode.children.length, 2);
              t.is(copy.originalInternalId, original.internalId);

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
  t.it('getById should work even when root is collapsed', function (t) {
    var project = new ProjectModel();
    var eventStore = project.eventStore;
    eventStore.add([{
      id: 'parent',
      expanded: false,
      children: [{
        id: 'child'
      }]
    }]);
    t.ok(eventStore.getById('child'), 'Record found');
  });
  t.it('Phantom checks', function (t) {
    var project = new ProjectModel();
    var eventStore = project.eventStore;

    var _eventStore$add = eventStore.add([{
      id: 1
    }]),
        _eventStore$add2 = _slicedToArray(_eventStore$add, 1),
        event1 = _eventStore$add2[0];

    t.notOk(event1.hasGeneratedId, 'Newly added task with an Id should not be a phantom');
    t.ok(event1.appendChild({}).hasGeneratedId, 'Newly added task should be a phantom');
  }); // region Milestone

  t.it('Milestones', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var project, eventStore, event5, event6;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              project = getProject();
              _context2.next = 3;
              return project.propagate();

            case 3:
              eventStore = project.eventStore;
              event5 = eventStore.getById(5);
              event6 = eventStore.getById(6);
              t.ok(event5.milestone, 'Same start and end date is a milestone');
              t.ok(event6.milestone, 'A milestone can be a task with a startdate and 0 duration');

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
  }()); // t.it('Does not set end date of milestone less than its start date', t => {
  //     const task6 = getDataSet().taskStore.getById(6);
  //
  //     t.is(task6.startDate, new Date(2011, 6, 28), 'Correct start date');
  //     t.is(task6.endDate, new Date(2011, 6, 28), 'Correct end date');
  //
  //     t.throwsOk(() => {
  //         task6.setEndDate(new Date(2011, 6, 26), false);
  //     }, 'Negative duration', 'Trying to set end date before start date throws');
  //
  //     // Ext Gantt expected unmodified date, but vanilla throws
  //     //t.is(task6.startDate, new Date(2011, 6, 28), 'Start date is the same');
  //     //t.is(task6.endDate, new Date(2011, 6, 28), 'End date is the same');
  // });

  t.it('Should be possible to convert a task to be a milestone', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var project, eventStore, _eventStore$add3, _eventStore$add4, event1;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add3 = eventStore.add([{
                startDate: new Date(2013, 6, 24),
                duration: 2
              }]), _eventStore$add4 = _slicedToArray(_eventStore$add3, 1), event1 = _eventStore$add4[0];
              _context3.next = 5;
              return project.propagate();

            case 5:
              t.notOk(event1.milestone, 'Not a milestone');
              _context3.next = 8;
              return event1.convertToMilestone();

            case 8:
              t.ok(event1.milestone, 'Now a milestone');
              t.is(event1.startDate, new Date(2013, 6, 24), 'Milestone at the original task end date');

            case 10:
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
  t.it('Should not produce any side effects to convert a milestone to be a milestone', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      var project, eventStore, _eventStore$add5, _eventStore$add6, event1;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add5 = eventStore.add([{
                startDate: new Date(2013, 6, 26),
                duration: 0
              }]), _eventStore$add6 = _slicedToArray(_eventStore$add5, 1), event1 = _eventStore$add6[0];
              _context4.next = 5;
              return project.propagate();

            case 5:
              t.ok(event1.milestone, 'Originally a milestone');
              _context4.next = 8;
              return event1.convertToMilestone();

            case 8:
              t.ok(event1.milestone, 'Still a milestone');
              t.is(event1.startDate, new Date(2013, 6, 26), 'Milestone at the original task end date');

            case 10:
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
  t.it('Should not crash if converting a blank task to a milestone', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var project, eventStore, _eventStore$add7, _eventStore$add8, event1, done;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              project = new ProjectModel({
                startDate: new Date(2019, 5, 4)
              });
              eventStore = project.eventStore;
              _eventStore$add7 = eventStore.add([{}]), _eventStore$add8 = _slicedToArray(_eventStore$add7, 1), event1 = _eventStore$add8[0];
              done = t.livesOkAsync('No exception thrown');
              _context5.next = 6;
              return event1.convertToMilestone();

            case 6:
              done();

            case 7:
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
  t.it('Should be able to convert milestone to regular task', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var project, eventStore, _eventStore$add9, _eventStore$add10, event1;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              project = new ProjectModel();
              eventStore = project.eventStore;
              _eventStore$add9 = eventStore.add([{
                startDate: new Date(2013, 6, 24),
                duration: 0
              }]), _eventStore$add10 = _slicedToArray(_eventStore$add9, 1), event1 = _eventStore$add10[0];
              _context6.next = 5;
              return project.propagate();

            case 5:
              t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
              t.is(event1.endDate, new Date(2013, 6, 24), 'End ok');
              _context6.next = 9;
              return event1.convertToRegular();

            case 9:
              t.is(event1.duration, 1, 'duration 1');
              t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
              t.is(event1.endDate, new Date(2013, 6, 25), 'End ok');

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }()); //endregion

  t.it('Task baselines', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var project, eventStore, _iterator, _step, task, b0;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              project = getProject();
              _context7.next = 3;
              return project.propagate();

            case 3:
              eventStore = project.eventStore;
              _iterator = _createForOfIteratorHelper(eventStore);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  task = _step.value;
                  b0 = task.baselines.first; // Task id 3 has slipped by one day from its baseline end date of
                  // 21 Jul and 16 days.

                  if (task.id === 3) {
                    t.is(b0.startDate, task.startDate);
                    t.is(b0.endDate, new Date(2011, 6, 21));
                    t.is(b0.duration, 16);
                  } else {
                    t.is(b0.startDate, task.startDate);
                    t.is(b0.endDate, task.endDate);
                    t.is(b0.duration, task.duration);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should clean idmap when store is cleared', function (t) {
    var project = getProject();
    var eventStore = project.eventStore;
    eventStore.removeAll();
    eventStore.add({
      id: 1,
      name: 'test'
    });
    t.is(eventStore.getById(1).name, 'test', 'Event name is ok');
  });
  t.it('should expose fields from data', function (t) {
    var project = new ProjectModel({
      tasksData: [{
        id: 1,
        startDate: new Date(2020, 0, 10),
        duration: 5,
        name: 'Task 1',
        status: 'custom'
      }, {
        id: 2,
        startDate: new Date(2020, 0, 10),
        duration: 5,
        name: 'Task 2',
        status: 'none'
      }]
    });
    t.is(project.taskStore.first.status, 'custom', 'Exposed for first record');
    t.is(project.taskStore.last.status, 'none', 'Exposed for last record');
  });
  t.it('should send all fields if writeAllFields is true', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      var project, pack, taskDataToBeSent;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              project = new ProjectModel({
                writeAllFields: true,
                tasksData: [{
                  id: 1,
                  startDate: new Date(2020, 0, 10),
                  duration: 5,
                  name: 'Task 1'
                }]
              });
              _context8.next = 3;
              return project.propagate();

            case 3:
              project.firstChild.clearChanges();
              project.firstChild.name = 'boo';
              pack = project.getChangeSetPackage(), taskDataToBeSent = pack.tasks.updated[0];
              t.is(pack.tasks.updated.length, 1, 'One task changed');
              t.isDeeply(taskDataToBeSent.startDate, new Date(2020, 0, 10), 'non-changed startDate field included');
              t.isDeeply(taskDataToBeSent.duration, 5, 'non-changed duration field included');

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Should clear cached startDateMS + endDateMS values on project commit', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var project, task;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              project = new ProjectModel({
                calendarsData: [{
                  id: 'business',
                  name: 'Business',
                  hoursPerDay: 8,
                  daysPerWeek: 5,
                  daysPerMonth: 20,
                  intervals: [{
                    recurrentStartDate: 'every weekday at 17:00',
                    recurrentEndDate: 'every weekday at 08:00',
                    isWorking: false
                  }]
                }],
                tasksData: [{
                  id: 1,
                  startDate: new Date(2020, 3, 15),
                  duration: 3,
                  name: 'Task 1'
                }]
              }), task = project.firstChild;
              _context9.next = 3;
              return project.propagate();

            case 3:
              task.clearChanges();
              project.on({
                commit: function commit() {
                  t.ok(task.startDate.getHours(), 8, 'Start date now on business time');
                  t.ok(task.endDate.getHours(), 17, 'End date now on business time');
                  t.is(task.startDate.getTime(), task.startDateMS, 'equal start');
                  t.is(task.endDate.getTime(), task.endDateMS, 'equal end');
                }
              });
              t.is(task.startDate, new Date(2020, 3, 15), 'correct initial start');
              t.is(task.endDate, new Date(2020, 3, 18), 'correct initial end');
              t.is(task.startDate.getTime(), task.startDateMS, 'correct cache start value initially');
              t.is(task.endDate.getTime(), task.endDateMS, 'correct cache end value initially');
              task.calendar = 'business';
              _context9.next = 12;
              return project.propagate();

            case 12:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }());
});