function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  t.it('Should update view range correctly on page zoom', function (t) {
    var gantt = t.getGantt({
      width: 400,
      height: 300
    }); // Browser zoom levels

    var levels = ['0.33', '0.5', '0.67', '0.75', '0.8', '0.9', '1', '1.1', '1.25', '1.5', '1.75'];
    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var i, l, scrollable, zoom, promise;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0, l = levels.length;

            case 1:
              if (!(i < l)) {
                _context.next = 14;
                break;
              }

              scrollable = gantt.timeAxisSubGrid.scrollable, zoom = levels[i];
              document.body.style.zoom = zoom;
              _context.next = 6;
              return gantt.timeView.await('refresh');

            case 6:
              promise = scrollable.await('scrollEnd'); // Scroll view to the right, we need to make sure that float value in left scroll still allows
              // to resolve gantt end date in maximum right position

              scrollable.x = scrollable.element.scrollWidth - scrollable.element.clientWidth;
              _context.next = 10;
              return promise;

            case 10:
              t.is(gantt.timeView.endDate, gantt.endDate, "View range end is ok on page zoom ".concat(zoom));

            case 11:
              i++;
              _context.next = 1;
              break;

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
});