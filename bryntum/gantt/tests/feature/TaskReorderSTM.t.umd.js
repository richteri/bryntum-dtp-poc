function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  }); // https://github.com/bryntum/support/issues/379

  t.it('Task reorder should be undoable', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var project, taskStore, investigateTask, reportTask, parentTask, stm;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt = t.getGantt({
                features: {
                  taskTooltip: false
                }
              });
              project = gantt.project, taskStore = project.taskStore, investigateTask = taskStore.getById(11), reportTask = taskStore.getById(14), parentTask = taskStore.getById(1), stm = project.getStm();
              stm.disabled = false;
              stm.autoRecord = true;
              parentTask.insertChild(investigateTask, reportTask);
              t.chain({
                waitFor: function waitFor() {
                  return stm.canUndo;
                }
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        stm.undo();
                        _context.next = 3;
                        return gantt.project.await('stateRestoringDone');

                      case 3:
                        t.is(parentTask.children.findIndex(function (task) {
                          return task.id === 11;
                        }), 0, 'Task moved back correctly');
                        stm.redo();
                        _context.next = 7;
                        return gantt.project.await('stateRestoringDone');

                      case 7:
                        t.is(parentTask.children.findIndex(function (task) {
                          return task.id === 11;
                        }), 2, 'Redo moved task correctly');

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});