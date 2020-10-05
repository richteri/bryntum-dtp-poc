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
  t.it('Should export to multiple pages', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var verticalPages, horizontalPages, totalPages, rowsPerPage, _yield$t$createGanttF, result, html;

      return regeneratorRuntime.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              verticalPages = 3, horizontalPages = 2, totalPages = horizontalPages * verticalPages, rowsPerPage = 11;
              _context3.next = 3;
              return t.createGanttForExport({
                horizontalPages: horizontalPages,
                verticalPages: verticalPages,
                rowsPerPage: rowsPerPage
              });

            case 3:
              _yield$t$createGanttF = _context3.sent;
              gantt = _yield$t$createGanttF.gantt;
              paperHeight = _yield$t$createGanttF.paperHeight;
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-sch-dependency'
              }, {
                waitFor: 500
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _loop, i;

                return regeneratorRuntime.wrap(function _callee$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'multipage',
                          range: 'completeview'
                        });

                      case 2:
                        result = _context2.sent;
                        html = result.response.request.body.html;
                        t.is(html.length, totalPages, "".concat(totalPages, " pages exported"));
                        _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                          return regeneratorRuntime.wrap(function _loop$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  _context.next = 2;
                                  return new Promise(function (resolve) {
                                    t.setIframe({
                                      height: paperHeight,
                                      html: html[i].html,
                                      onload: function onload(doc, frame) {
                                        t.ok(t.assertHeaderPosition(doc), "Header exported ok on page ".concat(i));
                                        t.ok(t.assertFooterPosition(doc), "Footer exported ok on page ".concat(i));
                                        t.assertRowsExportedWithoutGaps(doc, false, (i + 1) % verticalPages !== 0);

                                        if (i % verticalPages === 0) {
                                          t.ok(t.assertTicksExportedWithoutGaps(doc), "Ticks exported without gaps on page ".concat(i));
                                        }

                                        var _gantt = gantt,
                                            taskStore = _gantt.taskStore,
                                            tasks = taskStore.query(function (record) {
                                          return taskStore.indexOf(record) > rowsPerPage * (i % verticalPages) - 1 && taskStore.indexOf(record) < rowsPerPage * (i % verticalPages + 1) - 1;
                                        }),
                                            dependencies = gantt.dependencyStore.query(function (record) {
                                          return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                        });
                                        t.ok(tasks.length, 'Some tasks found');
                                        t.ok(dependencies.length, 'Some dependencies found');
                                        t.ok(t.assertExportedTasksList(doc, tasks), "Tasks are exported ok on page ".concat(i));
                                        t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), "Dependncies are exported ok on page ".concat(i));
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

                      case 7:
                        if (!(i < html.length)) {
                          _context2.next = 12;
                          break;
                        }

                        return _context2.delegateYield(_loop(i), "t0", 9);

                      case 9:
                        i++;
                        _context2.next = 7;
                        break;

                      case 12:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee);
              })));

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should export large gantt to multiple pages', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      var verticalPages, rowsPerPage, startDate, endDate, _yield$ProjectGenerat, tasksData, dependenciesData, html, _loop2, i;

      return regeneratorRuntime.wrap(function _callee4$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              verticalPages = 5;
              rowsPerPage = 24;
              startDate = new Date(2020, 6, 13);
              endDate = new Date(2020, 6, 20);
              _context6.next = 6;
              return ProjectGenerator.generateAsync(100, 10, null, startDate);

            case 6:
              _yield$ProjectGenerat = _context6.sent;
              tasksData = _yield$ProjectGenerat.tasksData;
              dependenciesData = _yield$ProjectGenerat.dependenciesData;
              gantt = t.getGantt({
                height: 900,
                width: 600,
                viewPreset: 'weekAndDayLetter',
                project: {
                  eventsData: tasksData,
                  dependenciesData: dependenciesData,
                  startDate: startDate
                },
                features: {
                  pdfExport: {
                    exportServer: '/export',
                    headerTpl: function headerTpl(_ref4) {
                      var currentPage = _ref4.currentPage;
                      return "<div style=\"height:9px;background-color: grey\">\n                    ".concat(currentPage != null ? "Page ".concat(currentPage) : 'HEAD', "</div>");
                    },
                    footerTpl: function footerTpl() {
                      return "<div style=\"height:9px;background-color: grey\">FOOT</div>";
                    }
                  }
                },
                startDate: startDate,
                endDate: endDate,
                columns: [{
                  type: 'wbs',
                  width: 50,
                  minWidth: 50
                }, {
                  type: 'name',
                  width: 200
                }]
              });
              _context6.next = 12;
              return Promise.all([gantt.project.waitForPropagateCompleted(), t.waitForSelector('.b-sch-dependency')]);

            case 12:
              _context6.next = 14;
              return t.getExportHtml(gantt, {
                exporterType: 'multipage'
              });

            case 14:
              html = _context6.sent;
              t.is(html.length, verticalPages, 'Correct amount of exported pages');
              _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(i) {
                return regeneratorRuntime.wrap(function _loop2$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return new Promise(function (resolve) {
                          t.setIframe({
                            height: paperHeight,
                            html: html[i].html,
                            onload: function onload(doc, frame) {
                              t.subTest("Checking exported page ".concat(i), /*#__PURE__*/function () {
                                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
                                  var _gantt2, taskStore, tasks, dependencies;

                                  return regeneratorRuntime.wrap(function _callee3$(_context4) {
                                    while (1) {
                                      switch (_context4.prev = _context4.next) {
                                        case 0:
                                          t.ok(t.assertHeaderPosition(doc), "Header exported ok on page ".concat(i));
                                          t.ok(t.assertFooterPosition(doc), "Footer exported ok on page ".concat(i));
                                          t.assertRowsExportedWithoutGaps(doc, false, (i + 1) % verticalPages !== 0);

                                          if (i % verticalPages === 0) {
                                            t.ok(t.assertTicksExportedWithoutGaps(doc), "Ticks exported without gaps on page ".concat(i));
                                          }

                                          _gantt2 = gantt, taskStore = _gantt2.taskStore, tasks = taskStore.query(function (record) {
                                            return taskStore.indexOf(record) > rowsPerPage * (i % html.length) - 1 && taskStore.indexOf(record) < rowsPerPage * (i % html.length + 1) - 1 && gantt.timeAxis.isTimeSpanInAxis(record);
                                          }), dependencies = gantt.dependencyStore.query(function (record) {
                                            return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                          });

                                          if (i === html.length) {
                                            t.ok(tasks.length, 'Some tasks found');
                                            t.ok(dependencies.length, 'Some dependencies found');
                                          }

                                          t.ok(t.assertExportedTasksList(doc, tasks), "Tasks are exported ok on page ".concat(i));
                                          t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), "Dependencies are exported ok on page ".concat(i));
                                          frame.remove();
                                          resolve();

                                        case 10:
                                        case "end":
                                          return _context4.stop();
                                      }
                                    }
                                  }, _callee3);
                                }));

                                return function (_x3) {
                                  return _ref5.apply(this, arguments);
                                };
                              }());
                            }
                          });
                        });

                      case 2:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _loop2);
              });
              i = 0;

            case 18:
              if (!(i < html.length)) {
                _context6.next = 23;
                break;
              }

              return _context6.delegateYield(_loop2(i), "t0", 20);

            case 20:
              i++;
              _context6.next = 18;
              break;

            case 23:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
});