function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && !gantt.isDestroyed && gantt.destroy();
  });
  var hourMs = 1000 * 60 * 60;
  t.it('should support zoomToFit API', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      project: {
        // set to `undefined` to overwrite the default '2017-01-16' value in `t.getProject`
        startDate: undefined,
        eventsData: [{
          id: 1,
          name: 'Steve',
          startDate: new Date(2018, 11, 1),
          endDate: new Date(2018, 11, 10)
        }]
      }
    });
    gantt.zoomToFit();
    var visibleStartDate = gantt.getDateFromCoordinate(gantt.scrollLeft),
        visibleEndDate = gantt.getDateFromCoordinate(gantt.scrollLeft + gantt.timeAxisViewModel.availableSpace);
    t.isApprox(visibleStartDate.getTime(), new Date(2018, 11, 1).getTime(), hourMs, 'Start date is ok');
    t.isApprox(visibleEndDate.getTime(), new Date(2018, 11, 10).getTime(), hourMs, 'End date is ok');
  }); // https://github.com/bryntum/support/issues/559

  t.it('Should not crash if zooming with schedule collapsed', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt();
              _context.next = 3;
              return gantt.subGrids.normal.collapse();

            case 3:
              gantt.zoomIn();
              gantt.zoomOut();
              gantt.zoomToFit();
              t.pass('No crash');

            case 7:
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