function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var timeline,
      project = t.getProject();
  t.beforeEach(function (t) {
    timeline && timeline.destroy();
    timeline = null;
    project = t.getProject({
      eventsData: [{
        'id': 11,
        'cls': 'id11',
        'name': 'Investigate',
        'percentDone': 70,
        'startDate': '2017-01-16',
        'duration': 10,
        'schedulingMode': 'FixedDuration'
      }, {
        'id': 12,
        'cls': 'id12',
        'name': 'Assign resources',
        'percentDone': 60,
        'startDate': '2017-01-16',
        'duration': 8,
        'schedulingMode': 'FixedUnits'
      }, {
        'id': 13,
        'name': 'Future',
        'percentDone': 50,
        'startDate': '2019-02-03T00:00:00',
        'duration': 1,
        'manuallyScheduled': true,
        'schedulingMode': 'FixedEffort'
      }]
    });
  });

  function createTimeLine(_x) {
    return _createTimeLine.apply(this, arguments);
  }

  function _createTimeLine() {
    _createTimeLine = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(config) {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              timeline = window.timeline = new Timeline(Object.assign({
                appendTo: document.body,
                width: 700,
                enableEventAnimations: false,
                project: project
              }, config));
              _context16.next = 3;
              return project.waitForPropagateCompleted();

            case 3:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));
    return _createTimeLine.apply(this, arguments);
  }

  t.it('Should size row height based on available subGrid body height', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return createTimeLine();

            case 2:
              t.chain({
                waitFor: function waitFor() {
                  return timeline.rowHeight === timeline.bodyContainer.offsetHeight;
                },
                desc: 'Correct row height'
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
  t.it('Should show timeline start / end even if no tasks are marked showInTimeline', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createTimeLine();

            case 2:
              t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
              t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');

            case 4:
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
  t.it('Should refresh on new task added', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.rootNode.appendChild({
                'name': 'Foo',
                'startDate': '2017-01-16',
                'endDate': '2017-01-26',
                'duration': 10,
                'showInTimeline': true
              });
              _context3.next = 5;
              return project.propagate();

            case 5:
              t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
              t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
              t.chain({
                waitForSelector: '.b-sch-event:contains(Foo)'
              });

            case 8:
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
  t.it('Should refresh on task removed', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.getById(11).showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event:contains(Investigate)'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                        t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                        project.taskStore.getById(11).remove();

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                waitForSelectorNotFound: '.b-sch-event:contains(Investigate)'
              });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  t.it('Should refresh on task showInTimeline updated', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.getById(11).showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event:contains(Investigate)'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                        t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                        project.taskStore.getById(11).showInTimeline = false;

                      case 3:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              })), {
                waitForSelectorNotFound: '.b-sch-event:contains(Investigate)'
              });

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());
  t.it('Should refresh on task start/duration/ updated', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var task;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return createTimeLine();

            case 2:
              task = project.taskStore.getById(11);
              task.showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event:contains(Investigate)'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        return _context8.abrupt("return", task.setDuration(1));

                      case 1:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              })), {
                waitFor: function waitFor() {
                  return timeline.eventStore.getById(task.id).duration === 1;
                }
              });

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x7) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Should extend timeline if new task appears outside current range', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.getById(13).showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event:contains(Future)'
              }, function () {
                t.contentLike('.b-timeline-startdate', timeline.getFormattedDate(timeline.startDate), 'Start date label has correct value');
                t.contentLike('.b-timeline-enddate', timeline.getFormattedDate(timeline.endDate), 'End date label has correct value');
                t.is(timeline.endDate.getFullYear(), 2019, 'Time axis extended');
              });

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x8) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Should refresh timeline if removing all tasks from taskStore', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.getById(11).showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event'
              }, function (next) {
                project.taskStore.removeAll();
                next();
              }, {
                waitForSelectorNotFound: '.b-sch-event'
              });

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x9) {
      return _ref11.apply(this, arguments);
    };
  }());
  t.it('Should refresh timeline if loading setting ´data´on the taskStore', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.getById(11).showInTimeline = true;
              t.chain({
                waitForSelector: '.b-sch-event'
              }, function (next) {
                project.taskStore.data = [];
                next();
              }, {
                waitForSelectorNotFound: '.b-sch-event'
              });

            case 4:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x10) {
      return _ref12.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/9148-crash-after-resizing-task-progress-bar-in-timeline-demo/details#

  t.it('Should not crash if modifying a task percentDone inside a parent that has showInTimeline set to true', /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.removeAll();
              _context14.next = 5;
              return project.waitForPropagateCompleted();

            case 5:
              project.taskStore.rootNode.appendChild({
                'id': 1,
                'name': 'Parent',
                'startDate': '2017-01-16',
                'duration': 1,
                'leaf': false,
                'showInTimeline': true,
                'expanded': true,
                'children': [{
                  'id': 2,
                  'name': 'Child',
                  'percentDone': 0,
                  'startDate': '2017-01-16',
                  'duration': 1,
                  'leaf': true
                }]
              });
              _context14.next = 8;
              return project.waitForPropagateCompleted();

            case 8:
              t.chain({
                waitForSelector: '.b-sch-event:contains(Parent)'
              }, /*#__PURE__*/function () {
                var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(next) {
                  return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                      switch (_context13.prev = _context13.next) {
                        case 0:
                          project.taskStore.getById(2).setPercentDone(100);
                          _context13.next = 3;
                          return project.waitForPropagateCompleted();

                        case 3:
                        case "end":
                          return _context13.stop();
                      }
                    }
                  }, _callee13);
                }));

                return function (_x12) {
                  return _ref14.apply(this, arguments);
                };
              }());

            case 9:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x11) {
      return _ref13.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/149

  t.it('Should not remove events from timeline if taskStore parent node is collapsed', /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return createTimeLine();

            case 2:
              project.taskStore.rootNode.firstChild.appendChild({
                id: 2,
                name: 'Foo',
                startDate: new Date(2017, 0, 16),
                duration: 1,
                leaf: true,
                showInTimeline: true
              });
              project.taskStore.toggleCollapse(project.taskStore.rootNode.firstChild, false);
              _context15.next = 6;
              return project.propagate();

            case 6:
              t.chain({
                waitForSelector: '.b-sch-event:contains(Foo)'
              }, function () {
                t.wontFire(timeline.eventStore, 'remove');
                project.taskStore.toggleCollapse(project.taskStore.rootNode.firstChild, true);
                t.selectorExists('.b-sch-event:contains(Foo)', 'Event still present after collapse');
              });

            case 7:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x13) {
      return _ref15.apply(this, arguments);
    };
  }());
});