function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, lineFeature;
  var statusDate = new Date(2019, 1, 4); // In some tests we do live updates of the view and try to use common assertion methods which rely on data.
  // Since data is not always updated we use this dates cache to let test know of the desired data state.
  // e.g. when we drag task over status date and do not release mouse button

  var dateOverrides;
  t.beforeEach(function () {
    gantt && gantt.destroy();
    dateOverrides = {};
  });

  function id(id) {
    return gantt.taskStore.getById(id);
  }

  function processLineBox(el) {
    var currentLineBox = t.getSVGBox(el),
        result = {
      y1: currentLineBox.top,
      y2: currentLineBox.bottom
    },
        currentAttrs = {
      x1: parseInt(el.getAttribute('x1'), 10),
      y1: parseInt(el.getAttribute('y1'), 10),
      x2: parseInt(el.getAttribute('x2'), 10),
      y2: parseInt(el.getAttribute('y2'), 10)
    };

    if (currentAttrs.x2 < currentAttrs.x1) {
      result.x1 = currentLineBox.right;
      result.x2 = currentLineBox.left;
    } else {
      result.x1 = currentLineBox.left;
      result.x2 = currentLineBox.right;
    }

    return result;
  }

  function assertLine(t, box1, box2) {
    var result = Object.keys(box1).every(function (key) {
      return Math.abs(Math.round(box1[key]) - Math.round(box2[key])) <= 1;
    });

    if (result) {
      t.ok('Line segment is ok');
    } else {
      t.isDeeply(box1, box2);
    }
  }

  function assertTaskLines(t, task) {
    t.diag('Asserting lines for task ' + task.name);
    var scrollLeft = gantt.scrollLeft,
        rowEl = gantt.getRowFor(task).elements.normal,
        rowBox = rowEl.getBoundingClientRect(),
        maxX = rowEl.querySelector('.b-sch-timeaxis-cell').getBoundingClientRect().right,
        statusDateX = gantt.getCoordinateFromDate(lineFeature.statusDate),
        statusLineX = (statusDateX === -1 ? gantt.timeAxisViewModel.totalSize : statusDateX) - scrollLeft + gantt.subGrids.normal.element.getBoundingClientRect().left,
        lines = document.querySelectorAll(".b-gantt-progress-line[data-task-id=\"".concat(task.id, "\"]")); // if the task should be rendered as a vertical Status line

    if (lineFeature.isStatusLineTask(task, dateOverrides[task.id])) {
      var element = gantt.getElementFromTaskRecord(task),
          progressBarEl = element.querySelector('.b-gantt-task-percent'),
          barBox = progressBarEl.getBoundingClientRect(),
          linePoint = {
        x: Math.min(barBox.right, maxX),
        y: barBox.top + barBox.height / 2
      },
          lineBox1 = processLineBox(lines[0]),
          lineBox2 = processLineBox(lines[1]),
          expectedBox1 = {
        x1: statusLineX,
        y1: rowBox.top,
        x2: linePoint.x,
        y2: linePoint.y
      },
          expectedBox2 = {
        x1: linePoint.x,
        y1: linePoint.y,
        x2: statusLineX,
        y2: rowBox.bottom
      };
      assertLine(t, lineBox1, expectedBox1);
      assertLine(t, lineBox2, expectedBox2);
      t.is(lines.length, 2, 'Correct amount of lines for task');
    } else {
      // x2 - status date x, y2 - row bottom
      assertLine(t, processLineBox(lines[0]), {
        x1: statusLineX,
        y1: rowBox.top,
        x2: statusLineX,
        y2: rowBox.bottom
      });
      t.is(lines.length, 1, 'Correct amount of lines for task');
    }
  }

  function assertLines(t) {
    t.subTest('Asserting all the lines', function (t) {
      var tasks = gantt.taskStore.getRange(),
          lines = document.querySelectorAll('.b-gantt-progress-line'),
          count = 0;
      tasks.forEach(function (task) {
        if (gantt.getRowFor(task)) {
          assertTaskLines(t, task);
          count += lineFeature.isStatusLineTask(task, dateOverrides[task.id]) ? 2 : 1;
        }
      });
      t.is(count, lines.length, 'All lines are checked');
    });
  }

  function setup(_x) {
    return _setup.apply(this, arguments);
  }

  function _setup() {
    _setup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(config) {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              config = config || {};
              gantt = t.getGantt(Object.assign({
                appendTo: document.body,
                features: {
                  progressLine: {
                    statusDate: statusDate
                  }
                },
                startDate: '2019-01-12',
                endDate: '2019-03-24',
                project: new ProjectModel({
                  transport: {
                    load: {
                      url: '../examples/_datasets/launch-saas.json'
                    }
                  }
                }),
                taskRenderer: function taskRenderer(_ref15) {
                  var taskRecord = _ref15.taskRecord,
                      tplData = _ref15.tplData;
                  tplData.cls.add("id".concat(taskRecord.id));
                }
              }, config));
              lineFeature = gantt.features.progressLine;
              _context15.next = 5;
              return gantt.project.load();

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));
    return _setup.apply(this, arguments);
  }

  t.it('Should draw project line', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return setup();

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line'
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.collapse(id(2));
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.expand(id(2));
              }, function (next) {
                assertLines(t);
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Tasks are reachable under progress line', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return setup();

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line',
                desc: 'Progress line found'
              }, function (next) {
                assertLines(t);
                next();
              }, {
                drag: '.id12 .b-gantt-task-percent',
                fromOffset: ['100%', '50%'],
                by: [25, 0],
                desc: 'Drag task by the progress line'
              }, function () {
                t.is(id(12).startDate, new Date(2019, 0, 15), 'Task dragged correctly');
              });

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Progress line should react on task store events', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var task, linesCount;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return setup();

            case 2:
              task = id(21);
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line',
                desc: 'Progress line found'
              }, function (next) {
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(50);
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(0);
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setStartDate(new Date(2019, 0, 24));
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setEndDate(new Date(2019, 0, 30));
              }, function (next) {
                assertLines(t);
                linesCount = document.querySelectorAll('.b-gantt-progress-line').length;
                t.waitForEvent(gantt, 'progressLineDrawn', next); // make sure the event still ends on the same date, by increasing the incoming dependency lag
                // this in turn ensures that only directly related progress lines will change

                id(22).duration = 0;
                Array.from(id(22).incomingDeps)[0].setLag(1);
              }, function (next) {
                t.is(document.querySelectorAll('.b-gantt-progress-line').length, linesCount - 1, 'One line is removed');
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(100);
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                id(2).appendChild([{
                  id: 26,
                  startDate: '2019-06-17',
                  duration: 5,
                  percentDone: 40
                }, {
                  id: 27,
                  startDate: '2019-06-18',
                  duration: 0,
                  percentDone: 0
                }, {
                  id: 28,
                  startDate: '2019-06-17',
                  duration: 5,
                  percentDone: 40
                }]);
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.taskStore.remove(id(26));
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.taskStore.remove([id(27), id(28)]);
              }, function (next) {
                assertLines(t);
              });

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Progress line should react to view changes', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return setup({
                height: 300
              });

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line',
                desc: 'Progress line found'
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.shiftPrevious();
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollEnd', next);
                gantt.zoomOut();
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollEnd', next);
                gantt.setViewPreset('weekAndDayLetter', new Date(2019, 0, 13), new Date(2019, 0, 27));
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollend', next);
                gantt.zoomOut();
              }, function (next) {
                assertLines(t);
                t.waitFor(function () {
                  return gantt.scrollTop === 100;
                }, function () {
                  t.waitForEvent(gantt, 'progresslinedrawn', next);
                  id(12).setStartDate(new Date(2019, 0, 17));
                });
                gantt.scrollTop = 100;
              }, function () {
                assertLines(t);
              });

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should draw line correctly on vertical scroll', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return setup();

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line'
              }, {
                waitFor: 1000
              }, function (next) {
                assertLines(t);
                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.scrollTop = 800;
              }, function (next) {
                assertLines(t);
              });

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x6) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Progress line is updated on drag', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var lineEl, assertLineIsTop;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              assertLineIsTop = function _assertLineIsTop() {
                var box = t.getSVGBox(lineEl);
                t.is(document.elementFromPoint(Math.round(box.left), Math.round(box.top)), lineEl, 'Line is on top');
              };

              _context6.next = 3;
              return setup({
                features: {
                  progressLine: {
                    statusDate: statusDate
                  },
                  taskTooltip: false
                }
              });

            case 3:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line'
              }, // TODO: Remvove when FF release version 68 with fixed canelAnimationFrame
              {
                waitFor: 100
              }, function (next) {
                lineEl = document.querySelectorAll('.b-gantt-progress-line[data-task-id="11"]')[1];
                lineEl.style.pointerEvents = 'all';
                assertLineIsTop();
                next();
              }, {
                moveMouseTo: '.b-gantt-task.id11',
                offset: [10, '50%']
              }, function (next) {
                assertLineIsTop();
                next();
              }, {
                click: '.b-gantt-task.id11',
                offset: [10, '50%']
              }, function (next) {
                assertLineIsTop();
                next();
              }, {
                drag: '.b-gantt-task.id11',
                offset: [20, '50%'],
                by: [100, 0],
                dragOnly: true
              }, function (next) {
                assertLines(t);
                next();
              }, {
                mouseUp: null
              }, {
                drag: '.b-gantt-task.id15',
                by: [gantt.tickSize * 7, 0],
                dragOnly: true
              }, function (next) {
                dateOverrides[15] = new Date(2019, 1, 4);
                assertLines(t);
                next();
              }, {
                moveMouseBy: [gantt.tickSize, 0]
              }, function (next) {
                dateOverrides[15] = new Date(2019, 1, 5);
                assertLines(t);
                next();
              }, {
                mouseUp: null
              });

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x7) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Progress line works properly on a large time axis', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return setup();

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, function (next) {
                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollend', next);
                gantt.viewPreset = 'weekAndDay';
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        t.diag('Scroll task 11 to view');
                        _context7.next = 3;
                        return gantt.scrollTaskIntoView(id(11));

                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })), // Rendering in response to scroll is async
              {
                waitForAnimationFrame: null
              }, function (next) {
                assertLines(t);
                next();
              }, function (next) {
                t.diag('Scroll task 4015 to view');
                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.scrollTaskIntoView(id(4015));
              }, // Rendering in response to scroll is async
              {
                waitForAnimationFrame: null
              }, function () {
                assertLines(t);
              });

            case 3:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x8) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Progress line could be changed', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var date;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return setup();

            case 2:
              date = new Date(2019, 1, 6);
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line'
              }, function (next) {
                t.waitForEvent(gantt, 'progresslinedrawn', next);
                lineFeature.statusDate = date;
              }, function (next) {
                t.is(lineFeature.statusDate, date, 'Status date changed');
                assertLines(t);
              });

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return setup();

            case 2:
              gantt.features.progressLine.disabled = true;
              t.selectorNotExists('.b-gantt-progress-line', 'No progress line');
              gantt.features.progressLine.disabled = false;
              t.chain({
                waitForSelector: '.b-gantt-progress-line',
                desc: 'Progress line found'
              });

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x10) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Should redraw progress line after cancelled drag drop', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return setup();

            case 2:
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-progress-line',
                desc: 'Progress line found'
              }, {
                drag: '.id11.b-gantt-task',
                by: [100, 0],
                dragOnly: true
              }, {
                type: '[ESC]'
              }, function () {
                assertLines(t);
              });

            case 3:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x11) {
      return _ref11.apply(this, arguments);
    };
  }());
  t.it('Should not crash if schedule subgrid is collapsed', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              console.log = function () {};

              gantt = t.getGantt({
                features: {
                  progressLine: true
                },
                subGridConfigs: {
                  locked: {
                    flex: 1
                  },
                  normal: {
                    collapsed: true
                  }
                }
              });
              t.chain({
                waitForPropagate: gantt
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        return _context12.abrupt("return", t.pass('no crash'));

                      case 1:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              })), /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        return _context13.abrupt("return", gantt.subGrids.normal.expand());

                      case 1:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              })), {
                waitForSelector: '.b-gantt-progress-line'
              });

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x12) {
      return _ref12.apply(this, arguments);
    };
  }());
});