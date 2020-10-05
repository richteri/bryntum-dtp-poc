function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should render dependencies regardless of barMargin size', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      tasks: [{
        id: 1,
        name: 'Task 1',
        startDate: '2017-01-23',
        manuallyScheduled: true,
        duration: 1
      }, {
        id: 2,
        name: 'Task 2',
        startDate: '2017-01-24',
        manuallyScheduled: true,
        duration: 1
      }, {
        id: 3,
        name: 'Task 3',
        cls: 'task3',
        startDate: '2017-01-26',
        manuallyScheduled: true,
        duration: 0
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 2
      }, {
        id: 2,
        fromEvent: 1,
        toEvent: 3
      }]
    });
    var dependencies = gantt.dependencies;
    t.chain({
      waitForPropagate: gantt
    }, {
      waitForSelector: '.b-sch-dependency'
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      gantt.barMargin = 13;
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      gantt.barMargin = 17;
    }, function (next) {
      dependencies.forEach(function (dep) {
        return t.assertDependency(gantt, dep);
      });
    });
  });
  t.it('Should not throw for invalid assignments', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      features: {
        dependencies: true
      },
      resources: [{
        id: 1,
        name: 'Albert'
      }],
      tasks: [{
        id: 1,
        startDate: '2017-01-16',
        duration: 2
      }],
      assignments: [{
        id: 1,
        resourceId: 1,
        eventId: 1
      }]
    });
    t.livesOk(function () {
      gantt.project.getAssignmentStore().add([{
        id: 2,
        resourceId: 1,
        eventId: 2
      }, {
        id: 3,
        resourceId: 2,
        eventId: 1
      }, {
        id: 4,
        resourceId: 2,
        eventId: 2
      }]);
    }, 'Lives ok when adding assignment to non existent dependency');
  });
  t.it('Should correctly draw dependencies on task add/remove', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false
    });
    var stm = gantt.project.stm,
        taskStore = gantt.taskStore;
    t.chain({
      waitForPropagate: gantt
    }, function (next) {
      stm.enable();
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.startTransaction('remove');
      taskStore.getById(12).remove();
      stm.stopTransaction('remove');
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.subTest('Dependencies are ok after removing task', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.undo();
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.subTest('Dependencies are ok after undo', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.startTransaction();
      taskStore.beginBatch();
      taskStore.getById(12).remove();
      taskStore.getById(1).appendChild({
        name: 'test'
      });
      taskStore.endBatch();
      stm.stopTransaction();
    }, function (next) {
      t.subTest('Dependencies are ok after batching', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
      stm.undo();
    }, function () {
      t.subTest('Dependencies are ok after undo', function (t) {
        gantt.dependencies.forEach(function (dep) {
          return t.assertDependency(gantt, dep);
        });
      });
    });
  }); // TODO: Going to refactor dependency rendering to use DomSync

  t.snooze('2020-09-01'
  /*'Should avoid forced reflow during refresh'*/
  , function (t) {
    gantt = t.getGantt({
      enableEventAnimations: false,
      tasks: [{
        id: 1,
        startDate: '2017-01-16',
        duration: 1
      }, {
        id: 2,
        startDate: '2017-01-16',
        duration: 1
      }, {
        id: 3,
        startDate: '2017-01-16',
        duration: 1
      }, {
        id: 4,
        startDate: '2017-01-17',
        duration: 1
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 4
      }, {
        id: 2,
        fromEvent: 2,
        toEvent: 4
      }, {
        id: 3,
        fromEvent: 3,
        toEvent: 4
      }]
    });

    function setupOverrides() {
      var feature = gantt.features.dependencies,
          oldGetBox = feature.getBox,
          oldDrawDependency = feature.drawDependency,
          oldReleaseDependency = feature.releaseDependency;
      var drawCounter = 0,
          getBoxCounter = 0;

      feature.getBox = function () {
        if (drawCounter !== 0) {
          t.fail('Referring to getBox after drawing dependency forces reflow');
        }

        ++getBoxCounter;
        return oldGetBox.apply(feature, arguments);
      };

      feature.drawDependency = function () {
        ++drawCounter;
        return oldDrawDependency.apply(feature, arguments);
      };

      feature.releaseDependency = function () {
        if (getBoxCounter !== 0) {
          t.fail('Releasing dependency after filling cache forces reflow');
        }

        return oldReleaseDependency.apply(feature, arguments);
      };
    }

    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt.project.on({
                commit: function commit() {
                  setupOverrides();
                },
                once: true
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      drag: '.b-gantt-task',
      by: [50, 0]
    }, {
      waitFor: 1000
    });
  });
  t.it('Should avoid forced reflow during scroll', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var config, project, setupOverrides;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              setupOverrides = function _setupOverrides() {
                var feature = gantt.features.dependencies,
                    oldGetBox = feature.getBox,
                    oldDrawDependency = feature.drawDependency;
                var drawCounter = 0;

                feature.getBox = function () {
                  if (drawCounter !== 0) {
                    t.fail('Referring to getBox after drawing dependency forces reflow');
                  }

                  return oldGetBox.apply(feature, arguments);
                };

                feature.drawDependency = function () {
                  ++drawCounter;
                  return oldDrawDependency.apply(feature, arguments);
                };
              };

              _context2.next = 3;
              return ProjectGenerator.generateAsync(100, 30, function () {});

            case 3:
              config = _context2.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                appendTo: document.body,
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              t.chain({
                waitForPropagate: gantt
              }, gantt.depsAlreadyDrawn ? null : {
                waitForEvent: [gantt, BrowserHelper.isIE11 ? 'dependenciesdrawn' : 'transitionend']
              }, {
                waitForAnimationFrame: null
              }, function (next) {
                setupOverrides();
                gantt.scrollTaskIntoView(gantt.taskStore.last).then(function () {
                  t.waitForEvent(gantt, 'dependenciesdrawn', next);
                });
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should clear dependencies cache when clearing task store', function (t) {
    gantt = t.getGantt({
      appendTo: document.body
    });
    t.chain({
      waitForPropagate: gantt
    }, function (next) {
      gantt.taskStore.removeAll();
      gantt.taskStore.add({});
      gantt.features.dependencies.draw();
      t.waitForEvent(gantt, 'dependenciesdrawn', next);
    }, function (next) {
      t.selectorCountIs('.b-sch-dependency', 0, 'No dependencies are rendered');
    });
  }); // https://github.com/bryntum/bryntum-suite/issues/122

  t.it('should not draw dependencies for removed task', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      useEventAnimations: false
    });
    t.chain({
      waitForPropagate: gantt
    }, function (next) {
      window.brk = true;
      gantt.taskStore.getById(11).remove();
      next();
    }, {
      waitForPropagate: gantt
    }, {
      waitForAnimationFrame: null
    }, function () {
      t.selectorNotExists('polyline[depId="1"]', 'Dependency line gone');
    });
  }); // https://github.com/bryntum/support/issues/139

  t.it('Dependency line between milestones shouldn\'t disappear', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      startDate: '2020-02-03',
      endDate: '2020-02-09',
      project: {
        // set to `undefined` to overwrite the default '2017-01-16' value in `t.getProject`
        startDate: undefined,
        eventsData: [{
          id: 1,
          name: 'Milestone 1',
          startDate: '2020-02-06',
          endDate: '2020-02-06'
        }, {
          id: 2,
          name: 'Milestone 2',
          startDate: '2020-02-06',
          endDate: '2020-02-06'
        }],
        dependenciesData: [{
          id: 1,
          fromEvent: 1,
          toEvent: 2
        }]
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, {
      waitForSelector: '.b-sch-dependency',
      desc: 'Should have dependency line'
    });
  });
  t.it('Should update dependencies when task is partially outside the view', function (t) {
    gantt = t.getGantt({
      enableEventAnimations: false,
      startDate: '2020-02-02',
      endDate: '2020-02-09',
      project: {
        startDate: '2020-02-08',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2020-02-08',
          endDate: '2020-02-09'
        }, {
          id: 2,
          name: 'Task 2',
          startDate: '2020-02-09',
          endDate: '2020-02-10'
        }],
        dependenciesData: [{
          id: 1,
          fromEvent: 1,
          toEvent: 2
        }]
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, {
      drag: '[data-task-id="1"]',
      by: [-100, 0],
      dragOnly: true,
      desc: 'Should be draggable'
    }, {
      waitForSelector: '.b-sch-dependency',
      desc: 'Should have dependency line'
    }, {
      mouseup: null
    });
  }); // https://github.com/bryntum/support/issues/577

  t.it('Clean up Dependencies.updateDependenciesForTimeSpan', function (t) {
    if (VersionHelper.checkVersion('Scheduler', '4.0.0', '>=')) {
      t.fail('Time to clean up!');
    }
  });
});