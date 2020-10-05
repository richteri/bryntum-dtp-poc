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
  }); // https://app.assembla.com/spaces/bryntum/tickets/8247

  t.it('TaskEditor cancel should not leave undoable transaction in the STM', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var investigateTask, _gantt$project$resour, _gantt$project$resour2, maximResource, stm;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              investigateTask = gantt.project.taskStore.getById(11);
              _gantt$project$resour = gantt.project.resourceStore.add({
                name: 'Maxim'
              }), _gantt$project$resour2 = _slicedToArray(_gantt$project$resour, 1), maximResource = _gantt$project$resour2[0];
              _context.next = 5;
              return investigateTask.assign(maximResource);

            case 5:
              stm = gantt.project.getStm();
              stm.disabled = false;
              stm.autoRecord = true;
              t.chain(function (next) {
                gantt.editTask(investigateTask);
                next();
              }, {
                waitForSelector: '.b-popup.b-taskeditor'
              }, {
                click: '.b-tabpanel-tab-title:contains(Resources)'
              }, {
                click: '.b-resourcestab .b-grid-cell:contains(Maxim)'
              }, {
                click: '.b-resourcestab .b-remove-button'
              }, {
                click: '.b-button:contains(Cancel)'
              }, {
                waitForPropagate: gantt
              }, function (next) {
                t.notOk(stm.canUndo, 'Canceling haven\'t created any unneeded undo actions');
                t.notOk(stm.canRedo, 'Canceling haven\'t created any unneeded redo actions');
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/8247

  t.it('TaskEditor cancel should not change undo/redo queue', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var investigateTask, _gantt$project$resour3, _gantt$project$resour4, maximResource, stm;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                features: {
                  taskTooltip: false
                }
              });
              investigateTask = gantt.project.taskStore.getById(11);
              _gantt$project$resour3 = gantt.project.resourceStore.add({
                name: 'Maxim'
              }), _gantt$project$resour4 = _slicedToArray(_gantt$project$resour3, 1), maximResource = _gantt$project$resour4[0];
              _context6.next = 5;
              return investigateTask.assign(maximResource);

            case 5:
              stm = gantt.project.getStm();
              stm.disabled = false;
              stm.autoRecord = true;
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })), // STM is async, need to wait a bit for action to get into queue
              {
                waitFor: 200
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              })), {
                waitFor: 200
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));

                      case 2:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                waitFor: 200
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        stm.undo(2);
                        _context5.next = 3;
                        return gantt.project.await('stateRestoringDone');

                      case 3:
                        gantt.editTask(investigateTask);

                      case 4:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              })), {
                waitForSelector: '.b-popup.b-taskeditor'
              }, {
                click: '.b-tabpanel-tab-title:contains(Resources)'
              }, {
                click: '.b-resourcestab .b-grid-cell:contains(Maxim)'
              }, {
                click: '.b-resourcestab .b-remove-button'
              }, {
                click: '.b-button:contains(Cancel)'
              }, {
                waitForSelectorNotFound: 'b-taskeditor-editing'
              }, {
                waitFor: function waitFor() {
                  return stm.canUndo;
                }
              }, function (next) {
                t.ok(stm.canUndo, 'Canceling haven\'t changed undo availability');
                t.ok(stm.canRedo, 'Canceling haven\'t changed redo availability');
                t.is(stm.position, 1, 'Canceling haven\'t changed STM position');
                t.is(stm.length, 3, 'Canceling haven\'t changed STM queue length');
              });

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/8231

  t.it('TaskEditor cancel should not lead to just added record removal', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task;
    var stm = gantt.project.getStm();
    stm.disabled = false;
    stm.autoRecord = true;
    t.chain(function (next) {
      task = gantt.addTaskBelow(gantt.taskStore.last).then(function (t) {
        task = t;
        next();
      });
    }, function (next) {
      gantt.startEditing({
        field: 'name',
        record: task
      });
      next();
    }, function (next) {
      gantt.editTask(task);
      next();
    }, {
      waitForSelector: '.b-popup.b-taskeditor'
    }, {
      click: '.b-button:contains(Cancel)'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      // Task.id here to avoid #8238
      t.ok(gantt.taskStore.includes(task.id), 'The task is in the store after the Task Editor Cancel');
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/8632

  t.it('Should continue editing after cancel/undo', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      project: t.getProject({
        calendar: 'general'
      }),
      features: {
        taskTooltip: false
      }
    });
    var task = gantt.taskStore.getById(13);
    t.chain({
      dblclick: '.b-gantt-task.id13'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7;
      },
      desc: 'End date changed, duration is 7'
    }, {
      click: '.b-gantt-task.id12'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 26).getTime() && task.duration === 8;
      },
      desc: 'End date restored, duration is 8'
    }, {
      dblclick: '.b-gantt-task.id13'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7;
      },
      desc: 'End date changed, duration is 7'
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/8225

  t.it('Exception when opening task editor right during new task name inputing with STM autorecording on', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task;
    var stm = gantt.project.getStm();
    stm.disabled = false;
    stm.autoRecord = true;
    t.chain(function (next) {
      task = gantt.addTaskBelow(gantt.taskStore.last).then(function (t) {
        task = t;
        next();
      });
    }, function (next) {
      gantt.startEditing({
        field: 'name',
        record: task
      });
      next();
    }, {
      type: 'zzzz'
    }, function (next) {
      t.livesOk(function () {
        gantt.editTask(task);
      }, 'Editor loaded just created task w/o exception');
    });
  });
});