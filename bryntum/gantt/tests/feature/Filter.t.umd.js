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
    _createGantt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var config,
          _args2 = arguments;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              config = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
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
                    id: 22,
                    name: 'Task 22',
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
                  filter: true
                },
                startDate: '2020-02-24',
                project: project
              }, config));
              _context2.next = 5;
              return project.waitForPropagateCompleted();

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _createGantt.apply(this, arguments);
  }

  t.it('Should not dysplay deleted data after re-apply filter', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return createGantt();

            case 2:
              t.chain({
                waitForSelector: '[data-task-id="22"]'
              }, function (next) {
                gantt.taskStore.filter('name', '1');
                next();
              }, {
                waitForSelectorNotFound: '[data-task-id="22"]'
              }, {
                waitForSelector: '[data-task-id="11"]'
              }, function (next) {
                gantt.taskStore.remove(gantt.taskStore.getById(11));
                next();
              }, {
                waitForSelectorNotFound: '[data-task-id="11"]',
                desc: 'Task 11 has been deleted'
              }, function (next) {
                gantt.on('renderRows', function () {
                  next();
                });
                gantt.taskStore.filter();
              }, {
                waitForSelectorNotFound: '[data-task-id="11"]',
                desc: 'Task 11 has not been showed again after filter re-apply'
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
});