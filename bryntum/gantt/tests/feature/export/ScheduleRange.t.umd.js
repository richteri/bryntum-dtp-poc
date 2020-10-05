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
  window.DEBUG = true;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should export visible schedule', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var horizontalPages, _yield$t$createGanttF;

      return regeneratorRuntime.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              horizontalPages = 3;
              _context4.next = 3;
              return t.createGanttForExport({
                height: 500,
                verticalPages: 2,
                horizontalPages: horizontalPages
              });

            case 3:
              _yield$t$createGanttF = _context4.sent;
              gantt = _yield$t$createGanttF.gantt;
              paperHeight = _yield$t$createGanttF.paperHeight;
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-dependency'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var doExport, _doExport, assertContent;

                return regeneratorRuntime.wrap(function _callee2$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        assertContent = function _assertContent(doc) {
                          var _gantt = gantt,
                              taskStore = _gantt.taskStore,
                              timeAxisSubGrid = _gantt.timeAxisSubGrid,
                              rows = Array.from(doc.querySelectorAll('.b-grid-subgrid-locked .b-grid-row')),
                              bodyContainerEl = doc.querySelector('.b-grid-body-container'),
                              bodyContainerBox = bodyContainerEl.getBoundingClientRect(),
                              gridHeaderEl = doc.querySelector('.b-grid-header-container'),
                              gridHeaderBox = gridHeaderEl.getBoundingClientRect(),
                              ganttEl = doc.querySelector('.b-gantt'),
                              ganttBox = ganttEl.getBoundingClientRect(),
                              _gantt$getVisibleDate = gantt.getVisibleDateRange(),
                              startDate = _gantt$getVisibleDate.startDate,
                              endDate = _gantt$getVisibleDate.endDate,
                              gotVisibleRange = t.getDateRangeFromExportedPage(doc, true),
                              expectedWidth = gantt.columns.getAt(1).width + timeAxisSubGrid.width + gantt.subGrids.locked.splitterElement.offsetWidth;

                          t.isApprox(ganttBox.height, 500, 1, 'Gantt height is ok');
                          t.is(rows.length, 9, '9 rows exported');
                          rows.forEach(function (el, index) {
                            t.is(el.dataset.index, index, "Row ".concat(index, " is exported ok"));
                          });
                          t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');
                          t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');
                          t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');
                          t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported ok');
                          var events = taskStore.query(function (r) {
                            return DateHelper.intersectSpans(r.startDate, r.endDate, startDate, endDate) && taskStore.indexOf(r) < 9;
                          });
                          t.ok(events.length, 'Event list to check not empty');
                          t.assertExportedTasksList(doc, events);
                          t.todo('Investigate getVisibleDateRange inconsistency', function (t) {
                            // This assertion fails because in single page export only, because of incorrect visible end date
                            // returned by gantt.
                            t.isApprox(ganttBox.width, expectedWidth, 1, 'Gantt element width is ok');
                          }); // Use round for start because that date is supposed to be at the beginning

                          t.is(gotVisibleRange.startDate, gantt.timeAxis.roundDate(startDate), 'Exported start date is ok'); // Use floor for end because last tick is partially visible

                          t.is(gotVisibleRange.endDate, gantt.timeAxis.floorDate(endDate), 'Exported end date is ok');
                        };

                        _doExport = function _doExport3() {
                          _doExport = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(scheduleRange, exporterType, totalPages, callback) {
                            var html, _loop, i;

                            return regeneratorRuntime.wrap(function _callee$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return t.getExportHtml(gantt, {
                                      columns: [gantt.columns.getAt(1).id],
                                      rowsRange: RowsRange.visible,
                                      scheduleRange: scheduleRange,
                                      exporterType: exporterType
                                    });

                                  case 2:
                                    html = _context2.sent;
                                    t.is(html.length, totalPages, "".concat(totalPages, " page(s) exported"));
                                    _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                                      return regeneratorRuntime.wrap(function _loop$(_context) {
                                        while (1) {
                                          switch (_context.prev = _context.next) {
                                            case 0:
                                              _context.next = 2;
                                              return new Promise(function (resolve) {
                                                t.setIframe({
                                                  height: paperHeight + 50,
                                                  html: html[i].html,
                                                  onload: function onload(doc, frame) {
                                                    callback(doc, i);
                                                    frame.remove();
                                                    resolve();
                                                  }
                                                });
                                              });

                                            case 2:
                                            case "end":
                                              return _context.stop();
                                          }
                                        }
                                      }, _loop);
                                    });
                                    i = 0;

                                  case 6:
                                    if (!(i < html.length)) {
                                      _context2.next = 11;
                                      break;
                                    }

                                    return _context2.delegateYield(_loop(i), "t0", 8);

                                  case 8:
                                    i++;
                                    _context2.next = 6;
                                    break;

                                  case 11:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee);
                          }));
                          return _doExport.apply(this, arguments);
                        };

                        doExport = function _doExport2(_x2, _x3, _x4, _x5) {
                          return _doExport.apply(this, arguments);
                        };

                        _context3.next = 5;
                        return gantt.scrollToDate(gantt.timeAxis.getAt(6).startDate, {
                          block: 'start'
                        });

                      case 5:
                        _context3.next = 7;
                        return gantt.timeView.await('refresh', {
                          checkLog: false
                        });

                      case 7:
                        t.diag('Exporting visible rows to single page');
                        _context3.next = 10;
                        return doExport(ScheduleRange.currentview, 'singlepage', 1, assertContent);

                      case 10:
                        _context3.next = 12;
                        return new Promise(function (resolve) {
                          return setTimeout(resolve, 100);
                        });

                      case 12:
                        t.diag('Exporting visible rows to multiple pages');
                        _context3.next = 15;
                        return doExport(ScheduleRange.currentview, 'multipage', 1, assertContent);

                      case 15:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee2);
              })));

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});