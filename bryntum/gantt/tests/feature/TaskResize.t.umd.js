function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Basic resizing should work', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task = gantt.taskStore.getById(11),
        initialWidth = gantt.getElementFromTaskRecord(task).offsetWidth,
        initialStart = task.startDate,
        initialEnd = task.endDate,
        initialDuration = task.duration,
        deltaX = gantt.tickSize * 2;
    t.chain({
      drag: '[data-task-id=11]',
      offset: ['100%-3', '50%'],
      by: [deltaX, 0]
    }, function (next, el) {
      t.is(task.startDate, initialStart, 'startDate unaffected');
      t.is(task.duration, initialDuration + 2, 'Correct duration after resize');
      t.is(task.endDate, DateHelper.add(initialEnd, 2, 'days'), 'Correct endDate after resize');
      t.isApprox(el.offsetWidth, initialWidth + deltaX, 'Correct element width after resize');
      next();
    });
  });
  t.it('Resize on the weekend should redraw the event in case of non-working time adjustment', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var project, _project$taskStore$ad, _project$taskStore$ad2, task, initialStart, initialEnd, initialDuration, taskBoxRect;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              gantt = t.getGantt({
                startDate: new Date(2019, 3, 8),
                project: {
                  eventsData: [],
                  startDate: new Date(2019, 3, 8)
                },
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              project = gantt.project; // TODO: Remove this line after merge of #9033

              project.calendarManagerStore.getById('general').remove();
              project.calendarManagerStore.add({
                id: 'general',
                intervals: [{
                  recurrentStartDate: 'on Sat at 0:00',
                  recurrentEndDate: 'on Mon at 0:00',
                  isWorking: false
                }]
              });
              _project$taskStore$ad = project.taskStore.add({
                id: 1,
                calendar: 'general',
                startDate: new Date(2019, 3, 15),
                endDate: new Date(2019, 3, 20)
              }), _project$taskStore$ad2 = _slicedToArray(_project$taskStore$ad, 1), task = _project$taskStore$ad2[0];
              _context3.next = 7;
              return project.propagate();

            case 7:
              initialStart = task.startDate, initialEnd = task.endDate, initialDuration = task.duration;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        taskBoxRect = t.$('[data-task-id=1]')[0].getBoundingClientRect();

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })), {
                drag: '[data-task-id=1]',
                offset: ['100%-3', '50%'],
                by: [gantt.tickSize * 1, 0]
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var newRect;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        t.is(task.startDate, initialStart, 'startDate unaffected');
                        t.is(task.endDate, initialEnd, 'endDate unaffected');
                        t.is(task.duration, initialDuration, 'Correct duration after resize');
                        newRect = t.$('[data-task-id=1]')[0].getBoundingClientRect();
                        t.is(newRect.left, taskBoxRect.left, 'Task element did not change position');
                        t.is(newRect.right, taskBoxRect.right, 'Task element did not change position');

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should support resizing small elements without dragging them', function (t) {
    gantt = t.getGantt({
      startDate: new Date(2019, 3, 8),
      project: {
        eventsData: [{
          id: 1,
          startDate: new Date(2019, 3, 15),
          endDate: new Date(2019, 3, 16)
        }],
        startDate: new Date(2019, 3, 8)
      },
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.wontFire(gantt, 'taskdragstart');
    t.chain({
      drag: '[data-task-id=1]',
      offset: ['100%-5', '50%'],
      by: [20, 0]
    });
  });
  t.it('Should revert drop that does not cause a data change', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 1,
          startDate: new Date(2019, 3, 15),
          endDate: new Date(2019, 3, 16)
        }],
        startDate: new Date(2019, 3, 8)
      },
      startDate: new Date(2019, 3, 8),
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      drag: '[data-task-id=1]',
      offset: ['100%-5', '50%'],
      by: [-10, 0]
    }, function () {
      t.isApproxPx(document.querySelector('[data-task-id="1"]').offsetWidth, 20, 1, 'Original width reapplied');
    });
  });
  t.it('TOUCH: Should show tooltip contents when resizing', function (t) {
    gantt = t.getGantt({
      project: {
        eventsData: [{
          id: 1,
          startDate: new Date(2019, 3, 15),
          endDate: new Date(2019, 3, 19)
        }],
        startDate: new Date(2019, 3, 8)
      },
      startDate: new Date(2019, 3, 8),
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    t.firesOnce(gantt, 'taskclick');
    t.chain({
      tap: '[data-task-id=1]'
    }, {
      touchDrag: '[data-task-id=1]',
      offset: ['100%-5', '50%'],
      by: [100, 0],
      dragOnly: true
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", t.selectorExists('.b-sch-tooltip-enddate:contains(Apr 17, 2019)'));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});