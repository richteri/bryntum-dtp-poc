function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, paperHeight;
  var exporterType = 'multipagevertical';
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
  window.DEBUG = true;
  t.overrideAjaxHelper();
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should export to multiple pages', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var verticalPages, horizontalPages, totalPages, rowsPerPage, _yield$t$createGanttF;

      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              verticalPages = 8, horizontalPages = 2, totalPages = Math.ceil(verticalPages / horizontalPages), rowsPerPage = 20;
              _context6.next = 3;
              return t.createGanttForExport({
                horizontalPages: horizontalPages,
                verticalPages: verticalPages,
                rowsPerPage: rowsPerPage
              });

            case 3:
              _yield$t$createGanttF = _context6.sent;
              gantt = _yield$t$createGanttF.gantt;
              paperHeight = _yield$t$createGanttF.paperHeight;
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-dependency'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var assertExport, _assertExport;

                return regeneratorRuntime.wrap(function _callee4$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _assertExport = function _assertExport3() {
                          _assertExport = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(repeatHeader) {
                            return regeneratorRuntime.wrap(function _callee3$(_context4) {
                              while (1) {
                                switch (_context4.prev = _context4.next) {
                                  case 0:
                                    return _context4.abrupt("return", new Promise(function (resolve) {
                                      t.subTest("Checking export (repeatHeader: ".concat(repeatHeader, ")"), /*#__PURE__*/function () {
                                        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
                                          var html, indices, _loop, i;

                                          return regeneratorRuntime.wrap(function _callee2$(_context3) {
                                            while (1) {
                                              switch (_context3.prev = _context3.next) {
                                                case 0:
                                                  _context3.next = 2;
                                                  return t.getExportHtml(gantt, {
                                                    exporterType: exporterType,
                                                    repeatHeader: repeatHeader
                                                  });

                                                case 2:
                                                  html = _context3.sent;
                                                  t.is(html.length, totalPages, "".concat(totalPages, " pages exported"));
                                                  indices = new Set();
                                                  _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                                                    return regeneratorRuntime.wrap(function _loop$(_context2) {
                                                      while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                          case 0:
                                                            _context2.next = 2;
                                                            return new Promise(function (resolve) {
                                                              t.setIframe({
                                                                height: paperHeight,
                                                                html: html[i].html,
                                                                onload: function onload(doc, frame) {
                                                                  t.subTest("Checking page ".concat(i), /*#__PURE__*/function () {
                                                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
                                                                      var rows, exportedTasks, _gantt, taskStore, tasks, dependencies;

                                                                      return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                        while (1) {
                                                                          switch (_context.prev = _context.next) {
                                                                            case 0:
                                                                              t.ok(t.assertHeaderPosition(doc), 'Header exported ok');
                                                                              t.ok(t.assertFooterPosition(doc), 'Footer exported ok');
                                                                              t.assertRowsExportedWithoutGaps(doc, !repeatHeader && i !== 0, !repeatHeader && i !== html.length - 1, false);

                                                                              if (repeatHeader) {
                                                                                t.ok(t.assertGridHeader(doc), 'Grid header is ok');
                                                                              }

                                                                              if (i === html.length - 1) {
                                                                                t.assertGridHeightAlignedWithLastRow(doc);
                                                                              }

                                                                              if (i % verticalPages === 0) {
                                                                                t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                                                                              }

                                                                              rows = doc.querySelectorAll('.b-timeline-subgrid .b-grid-row'), exportedTasks = Array.from(rows).reduce(function (map, row) {
                                                                                var id = parseInt(row.dataset.id);
                                                                                indices.add(id);
                                                                                return map.add(id);
                                                                              }, new Set()), _gantt = gantt, taskStore = _gantt.taskStore, tasks = taskStore.query(function (record) {
                                                                                return exportedTasks.has(record.id) && DateHelper.intersectSpans(gantt.startDate, gantt.endDate, record.startDate, record.endDate);
                                                                              }), dependencies = gantt.dependencyStore.query(function (record) {
                                                                                return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                                                              });
                                                                              t.ok(tasks.length, 'Some tasks found');
                                                                              t.ok(dependencies.length, 'Some dependencies found');
                                                                              t.ok(t.assertExportedTasksList(doc, tasks), 'Tasks are exported ok');
                                                                              t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), 'Dependncies are exported ok');
                                                                              frame.remove();
                                                                              resolve();

                                                                            case 13:
                                                                            case "end":
                                                                              return _context.stop();
                                                                          }
                                                                        }
                                                                      }, _callee);
                                                                    }));

                                                                    return function (_x4) {
                                                                      return _ref4.apply(this, arguments);
                                                                    };
                                                                  }());
                                                                }
                                                              });
                                                            });

                                                          case 2:
                                                          case "end":
                                                            return _context2.stop();
                                                        }
                                                      }
                                                    }, _loop);
                                                  });
                                                  i = 0;

                                                case 7:
                                                  if (!(i < html.length)) {
                                                    _context3.next = 12;
                                                    break;
                                                  }

                                                  return _context3.delegateYield(_loop(i), "t0", 9);

                                                case 9:
                                                  i++;
                                                  _context3.next = 7;
                                                  break;

                                                case 12:
                                                  t.is(indices.size, gantt.taskStore.count, 'All rows are exported');
                                                  resolve();

                                                case 14:
                                                case "end":
                                                  return _context3.stop();
                                              }
                                            }
                                          }, _callee2);
                                        }));

                                        return function (_x3) {
                                          return _ref3.apply(this, arguments);
                                        };
                                      }());
                                    }));

                                  case 1:
                                  case "end":
                                    return _context4.stop();
                                }
                              }
                            }, _callee3);
                          }));
                          return _assertExport.apply(this, arguments);
                        };

                        assertExport = function _assertExport2(_x2) {
                          return _assertExport.apply(this, arguments);
                        };

                        _context5.next = 4;
                        return assertExport(false);

                      case 4:
                        _context5.next = 6;
                        return assertExport(true);

                      case 6:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee4);
              })));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should export visible schedule', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var _yield$t$createGanttF2, centerDate, expectedState, visibleRange, dateToTickDate, expectedRange, html, _loop2, i;

      return regeneratorRuntime.wrap(function _callee6$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return t.createGanttForExport({
                horizontalPages: 2,
                verticalPages: 2,
                rowsPerPage: 20,
                width: 900
              });

            case 2:
              _yield$t$createGanttF2 = _context8.sent;
              gantt = _yield$t$createGanttF2.gantt;
              paperHeight = _yield$t$createGanttF2.paperHeight;
              _context8.next = 7;
              return Promise.all([t.waitForSelector('.b-sch-dependency'), gantt.timeAxisSubGrid.await('resize', {
                checkLog: false
              })]);

            case 7:
              centerDate = new Date(gantt.startDate.getTime() + (gantt.endDate - gantt.startDate) / 2);
              gantt.zoomToSpan({
                startDate: DateHelper.add(gantt.startDate, -4, 'w'),
                endDate: DateHelper.add(gantt.endDate, 4, 'w'),
                centerDate: centerDate
              }); // Scrolling to center date will start scroll sync process, which will end with scrollEnd event on header scrollable

              _context8.next = 11;
              return gantt.timeAxisSubGrid.header.scrollable.await('scrollend', {
                checkLog: false
              });

            case 11:
              expectedState = gantt.state, visibleRange = gantt.getVisibleDateRange(), dateToTickDate = function dateToTickDate(date) {
                return gantt.timeAxis.getAt(Math.floor(gantt.timeAxis.getTickFromDate(date))).startDate;
              }, expectedRange = {
                startDate: dateToTickDate(visibleRange.startDate),
                endDate: dateToTickDate(visibleRange.endDate)
              };
              _context8.next = 14;
              return t.getExportHtml(gantt, {
                exporterType: exporterType,
                scheduleRange: ScheduleRange.currentview,
                rowsRange: RowsRange.visible
              });

            case 14:
              html = _context8.sent;
              t.is(html.length, 1, 'Single page exported');
              _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(i) {
                return regeneratorRuntime.wrap(function _loop2$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[i].html,
                            onload: function onload(doc, frame) {
                              var exportedRange = t.getDateRangeFromExportedPage(doc, true);
                              t.isDeeply(exportedRange, expectedRange, 'Exported date range is ok');
                              t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported ok');

                              if (i === html.length - 1) {
                                t.assertGridHeightAlignedWithLastRow(doc);
                              }

                              frame.remove();
                              resolve();
                            }
                          });
                        });

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _loop2);
              });
              i = 0;

            case 18:
              if (!(i < html.length)) {
                _context8.next = 23;
                break;
              }

              return _context8.delegateYield(_loop2(i), "t0", 20);

            case 20:
              i++;
              _context8.next = 18;
              break;

            case 23:
              t.isDeeply(gantt.state, expectedState, 'State is restored correctly');
              t.is(gantt.subGrids.normal.header.scrollable.x, expectedState.scroll.scrollLeft.normal, 'Scroll position is ok for normal grid/header'); // When viewport center date is resolved from coordinate value could be from the same coordinate but to be actually different.
              // So we lookup coordinate from that again and those should match.
              // 1px approximation is to make test stable in headless mode

              t.isApprox(gantt.getCoordinateFromDate(gantt.viewportCenterDate), gantt.getCoordinateFromDate(centerDate), 1, 'Center date is ok');

            case 26:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should export large view', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      var _yield$ProjectGenerat, tasksData, dependenciesData, startDate, assertExport, _assertExport4;

      return regeneratorRuntime.wrap(function _callee10$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _assertExport4 = function _assertExport6() {
                _assertExport4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                  var repeatHeader,
                      _args12 = arguments;
                  return regeneratorRuntime.wrap(function _callee9$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
                        case 0:
                          repeatHeader = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : false;
                          _context12.next = 3;
                          return new Promise(function (resolve) {
                            t.subTest("Checking export (repeatHeader ".concat(repeatHeader, ")"), /*#__PURE__*/function () {
                              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
                                var html, _loop3, i;

                                return regeneratorRuntime.wrap(function _callee8$(_context11) {
                                  while (1) {
                                    switch (_context11.prev = _context11.next) {
                                      case 0:
                                        _context11.next = 2;
                                        return t.getExportHtml(gantt, {
                                          exporterType: exporterType,
                                          repeatHeader: repeatHeader
                                        });

                                      case 2:
                                        html = _context11.sent;
                                        _loop3 = /*#__PURE__*/regeneratorRuntime.mark(function _loop3(i) {
                                          return regeneratorRuntime.wrap(function _loop3$(_context10) {
                                            while (1) {
                                              switch (_context10.prev = _context10.next) {
                                                case 0:
                                                  _context10.next = 2;
                                                  return new Promise(function (resolve) {
                                                    t.setIframe({
                                                      height: paperHeight,
                                                      html: html[i].html,
                                                      onload: function onload(doc, frame) {
                                                        t.subTest("Checking page ".concat(i), /*#__PURE__*/function () {
                                                          var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
                                                            var rows, exportedTasks, _gantt2, taskStore, tasks, dependencies;

                                                            return regeneratorRuntime.wrap(function _callee7$(_context9) {
                                                              while (1) {
                                                                switch (_context9.prev = _context9.next) {
                                                                  case 0:
                                                                    t.ok(t.assertHeaderPosition(doc), 'Header exported ok');
                                                                    t.ok(t.assertFooterPosition(doc), 'Footer exported ok');
                                                                    t.assertRowsExportedWithoutGaps(doc, !repeatHeader && i !== 0, !repeatHeader && i !== html.length - 1, false);

                                                                    if (repeatHeader) {
                                                                      t.ok(t.assertGridHeader(doc), 'Grid header is ok');
                                                                    }

                                                                    if (i === 0) {
                                                                      t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                                                                    } else if (i === html.length - 1) {
                                                                      t.assertGridHeightAlignedWithLastRow(doc);
                                                                    }

                                                                    rows = doc.querySelectorAll('.b-timeline-subgrid .b-grid-row'), exportedTasks = Array.from(rows).reduce(function (map, row) {
                                                                      var id = parseInt(row.dataset.id);
                                                                      return map.add(id);
                                                                    }, new Set()), _gantt2 = gantt, taskStore = _gantt2.taskStore, tasks = taskStore.query(function (record) {
                                                                      return exportedTasks.has(record.id) && DateHelper.intersectSpans(gantt.startDate, gantt.endDate, record.startDate, record.endDate);
                                                                    }), dependencies = gantt.dependencyStore.query(function (record) {
                                                                      return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                                                    });
                                                                    t.ok(tasks.length, 'Some tasks found');
                                                                    t.ok(dependencies.length, 'Some dependencies found');
                                                                    t.ok(t.assertExportedTasksList(doc, tasks), 'Tasks are exported ok');
                                                                    t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), 'Dependencies are exported ok');
                                                                    frame.remove();
                                                                    resolve();

                                                                  case 12:
                                                                  case "end":
                                                                    return _context9.stop();
                                                                }
                                                              }
                                                            }, _callee7);
                                                          }));

                                                          return function (_x8) {
                                                            return _ref9.apply(this, arguments);
                                                          };
                                                        }());
                                                      }
                                                    });
                                                  });

                                                case 2:
                                                case "end":
                                                  return _context10.stop();
                                              }
                                            }
                                          }, _loop3);
                                        });
                                        i = 0;

                                      case 5:
                                        if (!(i < html.length)) {
                                          _context11.next = 10;
                                          break;
                                        }

                                        return _context11.delegateYield(_loop3(i), "t0", 7);

                                      case 7:
                                        i++;
                                        _context11.next = 5;
                                        break;

                                      case 10:
                                        resolve();

                                      case 11:
                                      case "end":
                                        return _context11.stop();
                                    }
                                  }
                                }, _callee8);
                              }));

                              return function (_x7) {
                                return _ref8.apply(this, arguments);
                              };
                            }());
                          });

                        case 3:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee9);
                }));
                return _assertExport4.apply(this, arguments);
              };

              assertExport = function _assertExport5() {
                return _assertExport4.apply(this, arguments);
              };

              _context13.next = 4;
              return ProjectGenerator.generateAsync(500, 50, null, new Date(2020, 0, 1));

            case 4:
              _yield$ProjectGenerat = _context13.sent;
              tasksData = _yield$ProjectGenerat.tasksData;
              dependenciesData = _yield$ProjectGenerat.dependenciesData;
              startDate = new Date(2019, 11, 29);
              gantt = t.getGantt({
                width: 1322,
                subGridConfigs: {
                  locked: {
                    width: 430,
                    normal: 870
                  }
                },
                features: {
                  pdfExport: {
                    exportServer: '/export',
                    headerTpl: function headerTpl(_ref7) {
                      var currentPage = _ref7.currentPage;
                      return "<div style=\"height:61px;background-color: grey\">\n                    ".concat(currentPage != null ? "Page ".concat(currentPage) : 'HEAD', "</div>");
                    },
                    footerTpl: function footerTpl() {
                      return "<div style=\"height:61px;background-color: grey\">FOOT</div>";
                    }
                  }
                },
                project: {
                  eventsData: tasksData,
                  startDate: startDate,
                  dependenciesData: dependenciesData
                },
                startDate: startDate,
                endDate: new Date(2020, 4, 31)
              });
              _context13.next = 11;
              return Promise.all([t.waitForSelector('.b-sch-dependency'), t.waitForSelector(gantt.unreleasedEventSelector), gantt.timeAxisSubGrid.await('resize', {
                checkLog: false
              })]);

            case 11:
              _context13.next = 13;
              return assertExport(false);

            case 13:
              _context13.next = 15;
              return assertExport(true);

            case 15:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should export with a different combinations of alignRows/repeatHeader configs', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
      var horizontalPages, verticalPages, rowsPerPage, _yield$t$createGanttF3, assertExport, _assertExport7;

      return regeneratorRuntime.wrap(function _callee13$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _assertExport7 = function _assertExport9() {
                _assertExport7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(alignRows, repeatHeader) {
                  return regeneratorRuntime.wrap(function _callee12$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          return _context15.abrupt("return", new Promise(function (resolve) {
                            t.subTest("Align rows: ".concat(alignRows, ", Repeat header: ").concat(repeatHeader), /*#__PURE__*/function () {
                              var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
                                var pages, i, _yield$t$setIframeAsy, document, iframe, isLastPage;

                                return regeneratorRuntime.wrap(function _callee11$(_context14) {
                                  while (1) {
                                    switch (_context14.prev = _context14.next) {
                                      case 0:
                                        _context14.next = 2;
                                        return t.getExportHtml(gantt, {
                                          exporterType: exporterType,
                                          alignRows: alignRows,
                                          repeatHeader: repeatHeader
                                        });

                                      case 2:
                                        pages = _context14.sent;
                                        i = 0;

                                      case 4:
                                        if (!(i < pages.length)) {
                                          _context14.next = 17;
                                          break;
                                        }

                                        _context14.next = 7;
                                        return t.setIframeAsync({
                                          html: pages[i].html,
                                          height: paperHeight
                                        });

                                      case 7:
                                        _yield$t$setIframeAsy = _context14.sent;
                                        document = _yield$t$setIframeAsy.document;
                                        iframe = _yield$t$setIframeAsy.iframe;
                                        isLastPage = i === pages.length - 1;

                                        if (alignRows) {
                                          t.ok(t.assertRowsExportedWithoutGaps(document, false, false, true), "Rows are exported ok on page ".concat(i));
                                        } else {
                                          t.ok(t.assertRowsExportedWithoutGaps(document, false, !isLastPage, false), "Rows are exported ok on page ".concat(i));
                                        }

                                        t.assertGridHeightAlignedWithLastRow(document);
                                        iframe.remove();

                                      case 14:
                                        i++;
                                        _context14.next = 4;
                                        break;

                                      case 17:
                                        resolve();

                                      case 18:
                                      case "end":
                                        return _context14.stop();
                                    }
                                  }
                                }, _callee11);
                              }));

                              return function (_x12) {
                                return _ref11.apply(this, arguments);
                              };
                            }());
                          }));

                        case 1:
                        case "end":
                          return _context15.stop();
                      }
                    }
                  }, _callee12);
                }));
                return _assertExport7.apply(this, arguments);
              };

              assertExport = function _assertExport8(_x10, _x11) {
                return _assertExport7.apply(this, arguments);
              };

              horizontalPages = 1, verticalPages = 2, rowsPerPage = 20;
              _context16.next = 5;
              return t.createGanttForExport({
                verticalPages: verticalPages,
                horizontalPages: horizontalPages,
                rowsPerPage: rowsPerPage
              });

            case 5:
              _yield$t$createGanttF3 = _context16.sent;
              gantt = _yield$t$createGanttF3.gantt;
              paperHeight = _yield$t$createGanttF3.paperHeight;
              _context16.next = 10;
              return assertExport(false, false);

            case 10:
              _context16.next = 12;
              return assertExport(false, true);

            case 12:
              _context16.next = 14;
              return assertExport(true, false);

            case 14:
              _context16.next = 16;
              return assertExport(true, true);

            case 16:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x9) {
      return _ref10.apply(this, arguments);
    };
  }());
});