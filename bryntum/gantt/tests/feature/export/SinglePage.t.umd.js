function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, paperHeight;
  Object.assign(window, {
    AjaxHelper: AjaxHelper,
    DateHelper: DateHelper,
    Override: Override,
    ProjectGenerator: ProjectGenerator,
    RandomGenerator: RandomGenerator,
    Gantt: Gantt,
    PresetManager: PresetManager,
    PaperFormat: PaperFormat,
    Rectangle: Rectangle
  });
  t.overrideAjaxHelper();
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should export to single page', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var _yield$t$createGanttF;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return t.createGanttForExport({
                verticalPages: 4,
                horizontalPages: 2
              });

            case 2:
              _yield$t$createGanttF = _context2.sent;
              gantt = _yield$t$createGanttF.gantt;
              paperHeight = _yield$t$createGanttF.paperHeight;
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-dependency'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var result, html;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          range: 'completeview'
                        });

                      case 2:
                        result = _context.sent;
                        html = result.response.request.body.html;
                        t.is(html.length, 1, '1 page is exported');
                        _context.next = 7;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[0].html,
                            onload: function onload(doc, frame) {
                              t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');
                              t.ok(t.assertFooterPosition(doc), 'Footer is exported ok');
                              t.assertRowsExportedWithoutGaps(doc, false, true);
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                              t.isExportedTickCount(doc, gantt.timeAxis.count);
                              t.ok(t.assertExportedTasksList(doc, gantt.tasks), 'Tasks are exported ok');
                              t.ok(t.assertExportedGanttDependenciesList(doc, gantt.dependencies), 'Dependencies are exported ok');
                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 7:
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