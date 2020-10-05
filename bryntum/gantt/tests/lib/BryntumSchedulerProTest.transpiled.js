function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

Class('BryntumSchedulerProTest', {
  // eslint-disable-next-line no-undef
  isa: BryntumSchedulerTest,
  // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)
  methods: {
    waitForPropagate: function () {
      var _waitForPropagate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(partOfProject, next) {
        var async;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                async = this.beginAsync();
                partOfProject = partOfProject.project || partOfProject;
                _context.next = 4;
                return partOfProject.waitForPropagateCompleted();

              case 4:
                this.endAsync(async);
                next();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function waitForPropagate(_x, _x2) {
        return _waitForPropagate.apply(this, arguments);
      }

      return waitForPropagate;
    }()
  }
});