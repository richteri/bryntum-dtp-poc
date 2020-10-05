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
  t.it('Sanity', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var _yield$t$createGanttF, expectedName, result, html, fileName, assertContent, _assertContent;

      return regeneratorRuntime.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _assertContent = function _assertContent3() {
                _assertContent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  var _loop, i;

                  return regeneratorRuntime.wrap(function _callee2$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                            return regeneratorRuntime.wrap(function _loop$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return new Promise(function (resolve) {
                                      t.setIframe({
                                        height: paperHeight + 50,
                                        html: html[i].html,
                                        onload: function onload(doc, frame) {
                                          t.ok(t.assertHeaderPosition(doc), "Header is exported ok on page ".concat(i));
                                          t.ok(t.assertFooterPosition(doc), "Footer is exported ok on page ".concat(i));
                                          t.assertRowsExportedWithoutGaps(doc, false, true);
                                          t.ok(t.assertTicksExportedWithoutGaps(doc), "Ticks exported without gaps on page ".concat(i));
                                          t.isExportedTickCount(doc, gantt.timeAxis.count);
                                          t.ok(t.assertExportedGanttDependenciesList(doc, gantt.dependencies), "Dependencies are exported ok on page ".concat(i));
                                          t.is(doc.querySelectorAll('.b-gantt-task-wrap').length, gantt.eventStore.count, 'All tasks exported');
                                          frame.remove();
                                          resolve();
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

                        case 2:
                          if (!(i < html.length)) {
                            _context3.next = 7;
                            break;
                          }

                          return _context3.delegateYield(_loop(i), "t0", 4);

                        case 4:
                          i++;
                          _context3.next = 2;
                          break;

                        case 7:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee2);
                }));
                return _assertContent.apply(this, arguments);
              };

              assertContent = function _assertContent2() {
                return _assertContent.apply(this, arguments);
              };

              _context4.next = 4;
              return t.createGanttForExport();

            case 4:
              _yield$t$createGanttF = _context4.sent;
              gantt = _yield$t$createGanttF.gantt;
              paperHeight = _yield$t$createGanttF.paperHeight;
              expectedName = 'File name';
              gantt.features.pdfExport.fileName = expectedName;
              t.chain({
                waitForPropagate: gantt
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _result$response$requ;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return gantt.await('dependenciesDrawn');

                      case 2:
                        t.diag('Using singlepage export');
                        _context.next = 5;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          range: 'completeview'
                        });

                      case 5:
                        result = _context.sent;
                        _result$response$requ = result.response.request.body;
                        html = _result$response$requ.html;
                        fileName = _result$response$requ.fileName;
                        t.is(html.length, 1, '1 page is exported');
                        t.is(fileName, expectedName, 'File name is ok');
                        _context.next = 13;
                        return assertContent();

                      case 13:
                        t.diag('Using multipage export');
                        _context.next = 16;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'multipage',
                          range: 'completeview'
                        });

                      case 16:
                        result = _context.sent;
                        html = result.response.request.body.html;
                        t.is(html.length, 1, '1 page is exported');
                        _context.next = 21;
                        return assertContent();

                      case 21:
                        gantt.taskStore.first.name = '';
                        _context.next = 24;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          range: 'completeview'
                        });

                      case 24:
                        result = _context.sent;
                        fileName = result.response.request.body.fileName;
                        t.is(fileName, expectedName, 'File name is ok');
                        gantt.taskStore.removeAll();
                        _context.next = 30;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage',
                          range: 'completeview'
                        });

                      case 30:
                        result = _context.sent;
                        fileName = result.response.request.body.fileName;
                        t.is(fileName, expectedName, 'File name is ok');

                      case 33:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

            case 10:
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
  t.it('Should restore gantt properly after export', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var project;
      return regeneratorRuntime.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              project = new ProjectModel({
                transport: {
                  load: {
                    url: '../examples/_datasets/launch-saas.json'
                  }
                }
              });
              gantt = t.getGantt({
                project: project,
                width: 900,
                height: 600,
                features: {
                  pdfExport: {
                    exportServer: '/export'
                  }
                },
                startDate: new Date(2019, 0, 13),
                endDate: new Date(2019, 1, 17),
                subGridConfigs: {
                  locked: {
                    width: 175
                  }
                }
              });
              _context6.next = 4;
              return project.load();

            case 4:
              t.chain({
                waitForSelector: '.b-sch-dependency'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var id;
                return regeneratorRuntime.wrap(function _callee4$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        id = 1;

                      case 1:
                        if (!(id <= 3)) {
                          _context5.next = 7;
                          break;
                        }

                        _context5.next = 4;
                        return project.eventStore.toggleCollapse(id, true);

                      case 4:
                        id++;
                        _context5.next = 1;
                        break;

                      case 7:
                        _context5.next = 9;
                        return gantt.features.pdfExport.export({
                          columns: gantt.columns.visibleColumns.map(function (c) {
                            return c.id;
                          }),
                          exporterType: 'singlepage'
                        });

                      case 9:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee4);
              })), {
                waitFor: function waitFor() {
                  return gantt.getRowFor(1);
                },
                desc: 'First row is restored'
              }, function () {
                t.ok(gantt.getRowFor(1), 'Row found for record #1');
                t.ok(gantt.getRowFor(2), 'Row found for record #2');
                t.ok(gantt.getRowFor(3), 'Row found for record #3');
                t.is(gantt.scrollable.y, 0, 'Scroll restored properly');
              });

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should process config', function (t) {
    gantt = new Gantt({
      appendTo: document.body,
      features: {
        pdfExport: true
      }
    });
    var config = gantt.features.pdfExport.buildExportConfig({});
    t.is(config.fileName, 'Gantt', 'File name is set from class name');
    gantt.taskStore.add({
      name: 'New parent'
    });
    config = gantt.features.pdfExport.buildExportConfig({});
    t.is(config.fileName, 'Gantt', 'File name is set from class name');
    gantt.features.pdfExport.fileName = 'foo';
    config = gantt.features.pdfExport.buildExportConfig({});
    t.is(config.fileName, 'foo', 'File name is set from feature config');
    config = gantt.features.pdfExport.buildExportConfig({
      fileName: 'bar'
    });
    t.is(config.fileName, 'bar', 'File name is set from export options');
  });
  t.it('Should export dependencies not visible on a first page', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var startDate, _yield$ProjectGenerat, tasksData, dependenciesData, pages, _yield$t$setIframeAsy, document, iframe, rows, tasks, dependencies;

      return regeneratorRuntime.wrap(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              startDate = new Date(2020, 6, 19);
              _context7.next = 3;
              return ProjectGenerator.generateAsync(100, 10, null, startDate);

            case 3:
              _yield$ProjectGenerat = _context7.sent;
              tasksData = _yield$ProjectGenerat.tasksData;
              dependenciesData = _yield$ProjectGenerat.dependenciesData;
              dependenciesData = dependenciesData.slice(Math.round(dependenciesData.length / 2));
              gantt = t.getGantt({
                startDate: startDate,
                endDate: DateHelper.add(startDate, 4, 'w'),
                project: {
                  startDate: startDate,
                  dependenciesData: dependenciesData,
                  eventsData: tasksData
                },
                height: 400,
                width: 600,
                features: {
                  pdfExport: {
                    exportServer: '/export',
                    headerTpl: function headerTpl(_ref6) {
                      var currentPage = _ref6.currentPage;
                      return "<div style=\"height:61px;\">Page ".concat(currentPage, "</div>");
                    },
                    footerTpl: function footerTpl() {
                      return '<div style="height:61px;"></div>';
                    }
                  }
                }
              });
              _context7.next = 10;
              return gantt.project.waitForPropagateCompleted();

            case 10:
              _context7.next = 12;
              return t.getExportHtml(gantt, {
                exporterType: 'multipagevertical'
              });

            case 12:
              pages = _context7.sent;
              _context7.next = 15;
              return t.setIframeAsync({
                height: 1123,
                html: pages[pages.length - 1].html
              });

            case 15:
              _yield$t$setIframeAsy = _context7.sent;
              document = _yield$t$setIframeAsy.document;
              iframe = _yield$t$setIframeAsy.iframe;
              rows = document.querySelectorAll('.b-timeline-subgrid .b-grid-row'), tasks = Array.from(rows).map(function (row) {
                return Number(row.dataset.id);
              }), dependencies = gantt.dependencyStore.query(function (d) {
                return tasks.includes(d.fromTask.id) && tasks.includes(d.toTask.id);
              });
              t.ok(t.assertExportedGanttDependenciesList(document, dependencies), 'Dependencies exported ok on last page');
              iframe.remove();

            case 21:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should export with narrow time axis subgrid', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var _yield$t$createGanttF2, pages, _yield$t$setIframeAsy2, document, iframe;

      return regeneratorRuntime.wrap(function _callee7$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return t.createGanttForExport();

            case 2:
              _yield$t$createGanttF2 = _context8.sent;
              gantt = _yield$t$createGanttF2.gantt;
              paperHeight = _yield$t$createGanttF2.paperHeight;
              gantt.timeAxisSubGrid.width = 3;
              _context8.next = 8;
              return t.getExportHtml(gantt, {
                exporterType: 'singlepage',
                keepRegionSizes: {
                  normal: true
                }
              });

            case 8:
              pages = _context8.sent;
              _context8.next = 11;
              return t.setIframeAsync({
                height: paperHeight,
                html: pages[0].html
              });

            case 11:
              _yield$t$setIframeAsy2 = _context8.sent;
              document = _yield$t$setIframeAsy2.document;
              iframe = _yield$t$setIframeAsy2.iframe;
              t.ok(t.assertRowsExportedWithoutGaps(document, false, true), 'Rows exported without gaps');
              t.ok(t.assertTicksExportedWithoutGaps(document), 'Ticks exported without gaps');
              t.is(document.querySelectorAll('.b-grid-row').length, gantt.taskStore.count * 2, 'All resources exported');
              t.isExportedTickCount(document, gantt.timeAxis.count);
              t.is(document.querySelectorAll(gantt.unreleasedEventSelector).length, gantt.taskStore.count, 'All tasks are exported');
              t.is(document.querySelector('.b-grid-subgrid-normal').offsetWidth, 3, 'Normal grid width is ok');
              iframe.remove();

            case 21:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x4) {
      return _ref7.apply(this, arguments);
    };
  }());
});