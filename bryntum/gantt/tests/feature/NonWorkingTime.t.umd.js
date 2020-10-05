function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  window.AjaxHelper = AjaxHelper;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should show non-working time ranges from project calendar', function (t) {
    var project = t.getProject({
      calendar: 'general'
    });
    gantt = t.getGantt({
      startDate: new Date(2017, 0, 14),
      endDate: new Date(2017, 0, 30),
      features: {
        nonWorkingTime: true // Enabled by default

      },
      project: project
    });
    t.chain({
      waitForPropagate: project
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 8, '8 non-working days');
              project.calendarManagerStore.add({
                id: 'custom',
                intervals: [{
                  recurrentStartDate: 'on Fri at 0:00',
                  recurrentEndDate: 'on Tue at 0:00',
                  isWorking: false
                }]
              });
              project.calendar = project.calendarManagerStore.getById('custom');
              project.propagate();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      waitForPropagate: project
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 16, '16 non-working days');
              project.calendar = null;
              project.propagate();

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), {
      waitForPropagate: project
    }, function () {
      t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 0, 'non-working days are not visible');
    });
  }); // https://github.com/bryntum/support/issues/827

  t.it('Should show non-working time ranges from project calendar when data is loaded later and there are more than 500 events', function (t) {
    t.mockUrl('loadurl', {
      delay: 10,
      responseText: JSON.stringify({
        success: true,
        project: {
          calendar: 'general'
        },
        calendars: {
          rows: t.getProjectCalendarsData()
        },
        tasks: {
          rows: function () {
            var result = []; // 500 is here because EngineReplica declares projectRefreshThreshold as 500,
            // which means that 'update' event will not be fired, assuming it is enough to have 'refresh' event fired

            for (var id = 1; id <= 500; id++) {
              result.push({
                id: id,
                name: id,
                startDate: new Date(2017, 0, 9),
                endDate: new Date(2017, 0, 11)
              });
            }

            return result;
          }()
        }
      })
    });
    var project = new ProjectModel({
      autoLoad: false,
      transport: {
        load: {
          url: 'loadurl'
        }
      }
    });
    gantt = t.getGantt({
      startDate: new Date(2017, 0, 14),
      endDate: new Date(2017, 0, 30),
      features: {
        nonWorkingTime: true // Enabled by default

      },
      project: project
    });
    t.chain({
      waitForPropagate: project
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 0, 'non-working days are not visible');
              _context3.next = 3;
              return project.load();

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), {
      waitForPropagate: project
    }, function () {
      t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 8, '8 non-working days');
    });
  });
});