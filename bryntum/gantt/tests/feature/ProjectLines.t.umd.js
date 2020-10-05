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
  window.AjaxHelper = AjaxHelper;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should show project lines by default', function (t) {
    gantt = t.getGantt({
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name',
        width: 250
      }]
    });
    t.chain({
      waitForSelector: '.b-grid-headers .b-sch-line label:contains(Project start)'
    }, {
      waitForSelector: '.b-grid-headers .b-sch-line label:contains(Project end)'
    });
  });
  t.it('Should not show project lines initially if disabled', function (t) {
    gantt = t.getGantt({
      features: {
        projectLines: false
      },
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name',
        width: 250
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
      t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');
    });
  });
  t.it('Should not render project lines if disabled', function (t) {
    gantt = t.getGantt({
      features: {
        projectLines: true
      },
      columns: [{
        type: 'name',
        field: 'name',
        text: 'Name',
        width: 250
      }]
    });
    t.chain({
      waitForSelector: '.b-grid-headers .b-sch-line label:contains(Project start)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt.features.projectLines.disabled = true;
              t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
              t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');
              _context.next = 5;
              return gantt.taskStore.getById(3).shift('days', 10);

            case 5:
              t.selectorNotExists('.b-gantt-project-line');

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
  t.it('Should update project lines correctly', function (t) {
    gantt = t.getGantt({
      tasks: [{
        id: 1,
        name: 'task 1',
        startDate: '2017-01-16',
        duration: 10
      }],
      features: {
        projectLines: true
      }
    });
    var task = gantt.taskStore.getById(1),
        project = gantt.project;

    function checkDates(startDate, endDate) {
      var _gantt$features$proje = gantt.features.projectLines.store.getRange(),
          _gantt$features$proje2 = _slicedToArray(_gantt$features$proje, 2),
          start = _gantt$features$proje2[0],
          end = _gantt$features$proje2[1];

      t.is(start.startDate, startDate, 'Line start is ok');
      t.is(project.startDate, startDate, 'Project start is ok');
      t.is(end.startDate, endDate, 'Line end is ok');
      t.is(project.endDate, endDate, 'Project end is ok');
    }

    t.chain({
      waitForPropagate: gantt
    }, {
      waitForSelector: '.b-sch-timerange'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26)));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return task.setConstraintType('muststarton');

            case 2:
              _context3.next = 4;
              return task.setConstraintDate('2017-01-17');

            case 4:
              checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), {
      dblclick: '.b-gantt-task'
    }, {
      click: 'input[name=fullDuration]'
    }, {
      type: '[UP][UP]'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", checkDates(new Date(2017, 0, 16), new Date(2017, 0, 29)));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })), {
      click: '.b-popup-close'
    }, {
      waitForSelectorNotFound: '.b-taskeditor-editing'
    }, function () {
      return checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));
    });
  }); // #8390 https://app.assembla.com/spaces/bryntum/tickets/8390

  t.it('Should update project lines correctly after undo', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var project, stm, originalProjectStartDate, originalProjectEndDate, checkDates;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              checkDates = function _checkDates(startDate, endDate) {
                var _gantt$features$proje3 = gantt.features.projectLines.store.getRange(),
                    _gantt$features$proje4 = _slicedToArray(_gantt$features$proje3, 2),
                    start = _gantt$features$proje4[0],
                    end = _gantt$features$proje4[1];

                t.is(start.startDate, startDate, 'Line start is ok');
                t.is(project.startDate, startDate, 'Project start is ok');
                t.is(end.startDate, endDate, 'Line end is ok');
                t.is(project.endDate, endDate, 'Project end is ok');
              };

              gantt = t.getGantt({
                tasks: [{
                  id: 1,
                  name: 'task 1',
                  startDate: '2017-01-16',
                  duration: 10
                }],
                features: {
                  projectLines: true
                }
              });
              project = gantt.project, stm = project.getStm();
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-timerange'
              }, {
                waitFor: 1000
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26));
                        originalProjectStartDate = project.getStartDate();
                        originalProjectEndDate = project.getEndDate();

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        stm.enable();
                        stm.startTransaction();
                        _context6.next = 4;
                        return project.setStartDate(new Date(2017, 0, 17));

                      case 4:
                        stm.stopTransaction();
                        checkDates(new Date(2017, 0, 17), new Date(2017, 0, 27));

                      case 6:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })), function () {
                stm.undo();
                checkDates(originalProjectStartDate, originalProjectEndDate);
              });

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', function (t) {
    gantt = t.getGantt();
    gantt.features.projectLines.disabled = true;
    t.selectorNotExists('.b-gantt-project-line', 'No project lines');
    gantt.features.projectLines.disabled = false;
    t.selectorExists('.b-gantt-project-line', 'Project line found');
  }); // https://github.com/bryntum/support/issues/237

  t.it('Should show project lines correctly after initial load', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              t.mockUrl('data.json', {
                responseText: JSON.stringify({
                  success: true,
                  tasks: {
                    rows: [{
                      percentDone: 0,
                      leaf: true,
                      duration: 1,
                      name: 'New task',
                      id: 1,
                      durationUnit: 'day',
                      cls: 'first',
                      startDate: '2017-01-15T23:00:00.000Z'
                    }, {
                      percentDone: 0,
                      leaf: true,
                      duration: 1,
                      name: 'New task',
                      id: 2,
                      durationUnit: 'day',
                      cls: 'last',
                      startDate: '2017-01-15T23:00:00.000Z'
                    }]
                  },
                  dependencies: {
                    rows: [{
                      fromEvent: 1,
                      id: 1,
                      type: 2,
                      toEvent: 2
                    }]
                  },
                  resources: {
                    rows: []
                  },
                  assignments: {
                    rows: []
                  },
                  project: {
                    calendar: 'general',
                    startDate: '2020-01-22T20:10:55.000Z'
                  }
                })
              });
              gantt = new Gantt({
                appendTo: document.body,
                project: {
                  autoLoad: true,
                  transport: {
                    load: {
                      url: 'data.json'
                    }
                  }
                },
                features: {
                  projectLines: true
                }
              });
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: 'label:contains(Project start)'
              }, {
                waitForSelector: 'label:contains(Project end)'
              }, function () {
                var startLine = t.$('.b-gantt-project-line:contains(start)')[0],
                    endLine = t.$('.b-gantt-project-line:contains(end)')[0];
                t.is(startLine.getBoundingClientRect().left, document.querySelector('.b-gantt-task.first').getBoundingClientRect().left, 'Start line aligned correctly');
                t.is(endLine.getBoundingClientRect().left, document.querySelector('.b-gantt-task.last').getBoundingClientRect().right, 'End line aligned correctly');
              });

            case 3:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x2) {
      return _ref8.apply(this, arguments);
    };
  }());
});