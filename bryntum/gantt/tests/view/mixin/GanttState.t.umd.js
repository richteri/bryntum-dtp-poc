function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should restore state', function (t) {
    gantt = t.getGantt({
      startDate: null,
      endDate: null
    });
    var _gantt = gantt,
        startDate = _gantt.startDate,
        endDate = _gantt.endDate; // eslint-disable-next-line no-self-assign

    gantt.state = gantt.state;
    t.is(gantt.startDate, startDate, 'Gantt start is ok');
    t.is(gantt.endDate, endDate, 'Gantt end is ok');
  });
  t.it('Should restore zoom level', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var _gantt2, state, tickSize, startDate, endDate, viewportCenterDate;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt(); // change tick size

              gantt.tickSize *= 2;
              _gantt2 = gantt, state = _gantt2.state, tickSize = _gantt2.tickSize, startDate = _gantt2.startDate, endDate = _gantt2.endDate, viewportCenterDate = _gantt2.viewportCenterDate;
              gantt.tickSize += 50; // eslint-disable-next-line no-self-assign

              gantt.state = state;
              t.is(gantt.tickSize, tickSize, 'Tick size is ok');
              t.is(gantt.startDate, startDate, 'Start is ok');
              t.is(gantt.endDate, endDate, 'End is ok');
              t.is(gantt.viewportCenterDate, viewportCenterDate, 'Center date is ok');

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
  }());
});