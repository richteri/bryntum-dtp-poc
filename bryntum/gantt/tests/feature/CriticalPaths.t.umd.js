function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should render critical paths', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                project: {
                  tasksData: [{
                    id: 1,
                    startDate: '2016-02-01',
                    duration: 5
                  }, {
                    id: 2,
                    startDate: '2016-02-01',
                    duration: 10
                  }, {
                    id: 3,
                    startDate: '2016-02-12',
                    duration: 1
                  }, {
                    id: 4,
                    startDate: '2016-02-01',
                    duration: 1
                  }, {
                    id: 5,
                    startDate: '2016-02-02',
                    duration: 1
                  }, {
                    id: 6,
                    startDate: '2016-02-03',
                    duration: 1
                  }],
                  dependenciesData: [
                  /* DependencyType.EndToEnd */
                  {
                    id: 23,
                    fromEvent: 2,
                    toEvent: 3,
                    type: 3
                  }, {
                    id: 45,
                    fromEvent: 4,
                    toEvent: 5
                  }, {
                    id: 56,
                    fromEvent: 5,
                    toEvent: 6
                  }]
                }
              });
              _context.next = 3;
              return gantt.project.waitForPropagateCompleted();

            case 3:
              t.chain(function (next) {
                t.ok(gantt.features.criticalPaths.disabled, 'the feature is disabled by default');
                t.selectorCountIs('.b-gantt-task.b-critical', 2, 'two critical tasks are there');
                next();
              }, {
                diag: 'Enabling the feature'
              }, function (next) {
                t.waitForEvent(gantt, 'criticalPathsHighlighted', next);
                gantt.features.criticalPaths.disabled = false;
              }, {
                waitForSelector: '.b-gantt.b-gantt-critical-paths',
                desc: 'Critical path feature CSS class is added'
              }, function (next) {
                t.selectorCountIs('.b-sch-dependency.b-critical', 1, 'one dependency is highlighted');
                next();
              }, {
                diag: 'Disabling the feature'
              }, function (next) {
                t.waitForEvent(gantt, 'criticalPathsUnhighlighted', next);
                gantt.features.criticalPaths.disabled = true;
              }, {
                waitForSelectorNotFound: '.b-gantt.b-gantt-critical-paths',
                desc: 'Critical path feature CSS class is removed'
              }, function (next) {
                t.selectorCountIs('.b-sch-dependency.b-critical', 0, 'no highlighted dependency');
                next();
              });

            case 4:
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