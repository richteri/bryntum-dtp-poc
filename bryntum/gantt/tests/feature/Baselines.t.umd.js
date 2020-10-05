StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && !gantt.isDestroyed && gantt.destroy();
  });
  t.it('Baseline  tooltip', function (t) {
    gantt = t.getGantt({
      height: 700,
      appendTo: document.body,
      startDate: new Date(2011, 6, 1),
      endDate: new Date(2011, 6, 30),
      features: {
        baselines: true,
        taskTooltip: false
      },
      rowHeight: 60,
      project: {
        // set to `undefined` to overwrite the default '2017-01-16' value in `t.getProject`
        startDate: undefined,
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: new Date(2011, 6, 1),
          endDate: new Date(2011, 6, 5),
          baselines: [{}]
        }, {
          id: 123,
          name: 'Task 123',
          startDate: new Date(2011, 6, 15),
          endDate: new Date(2011, 6, 23),
          baselines: [{}],
          children: [{
            id: 2,
            name: 'Task 2',
            startDate: new Date(2011, 6, 16),
            endDate: new Date(2011, 6, 20),
            baselines: [{}]
          }, {
            id: 3,
            name: 'Task 3',
            startDate: new Date(2011, 6, 18),
            endDate: new Date(2011, 6, 22),
            baselines: [{
              // Task id 3 has slipped by one day from its baseline end date of
              // 21 Jul and 16 days. It ends on 22nd with 17 days.
              endDate: new Date(2011, 6, 21),
              duration: 16
            }]
          }]
        }, {
          id: 4,
          name: 'Task 4',
          startDate: new Date(2011, 6, 25),
          endDate: new Date(2011, 6, 28),
          baselines: [{}]
        }, {
          id: 5,
          name: 'Task 5',
          startDate: new Date(2011, 6, 28),
          endDate: new Date(2011, 6, 28),
          baselines: [{}]
        }, {
          id: 6,
          name: 'Task 6',
          startDate: new Date(2011, 6, 28),
          duration: 0,
          baselines: [{}]
        }]
      }
    });
    t.chain({
      waitForPropagate: gantt
    }, // Hover the baseline element of the first task
    {
      moveMouseTo: '[data-task-id="1"] .b-task-baseline'
    }, // And we should get a tip for that baseline
    {
      waitForSelector: '.b-tooltip-content:contains("Task 1 (baseline 1)")'
    });
  });
  t.it('Baseline elements restored from cache upon element recycle', function (t) {
    gantt = t.getGantt({
      height: 300,
      appendTo: document.body,
      startDate: new Date(2011, 6, 1),
      endDate: new Date(2011, 6, 30),
      features: {
        baselines: true,
        taskTooltip: false
      },
      rowHeight: 60,
      tasks: [{
        id: 1,
        name: 'Task 1',
        startDate: new Date(2011, 6, 1),
        endDate: new Date(2011, 6, 5),
        baselines: [{}]
      }, {
        id: 123,
        name: 'Task 123',
        startDate: new Date(2011, 6, 15),
        endDate: new Date(2011, 6, 23),
        baselines: [{}],
        children: [{
          id: 2,
          name: 'Task 2',
          startDate: new Date(2011, 6, 16),
          endDate: new Date(2011, 6, 20),
          baselines: [{}]
        }, {
          id: 3,
          name: 'Task 3',
          startDate: new Date(2011, 6, 18),
          endDate: new Date(2011, 6, 22),
          baselines: [{
            // Task id 3 has slipped by one day from its baseline end date of
            // 21 Jul and 16 days. It ends on 22nd with 17 days.
            endDate: new Date(2011, 6, 21),
            duration: 16
          }]
        }]
      }, {
        id: 4,
        name: 'Task 4',
        startDate: new Date(2011, 6, 25),
        endDate: new Date(2011, 6, 28),
        baselines: [{}]
      }, {
        id: 5,
        name: 'Task 5',
        startDate: new Date(2011, 6, 28),
        endDate: new Date(2011, 6, 28),
        baselines: [{}]
      }, {
        id: 6,
        name: 'Task 6',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 7,
        name: 'Task 7',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 8,
        name: 'Task 8',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 9,
        name: 'Task 9',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 10,
        name: 'Task 10',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 11,
        name: 'Task 11',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 12,
        name: 'Task 12',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 13,
        name: 'Task 13',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 14,
        name: 'Task 14',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 15,
        name: 'Task 15',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }, {
        id: 16,
        name: 'Task 16',
        startDate: new Date(2011, 6, 28),
        duration: 0,
        baselines: [{}]
      }]
    });
    t.chain({
      waitForPropagate: gantt.project
    }, function (next) {
      gantt.scrollTaskIntoView(gantt.taskStore.last).then(next);
    }, function (next) {
      gantt.scrollTaskIntoView(gantt.taskStore.first).then(next);
    }, {
      waitForSelector: '.b-gantt-task-wrap[data-task-id="1"] .b-task-baseline',
      desc: 'Baselines for Task 1 restored'
    });
  });
  t.it('Some tasks lack baseline', function (t) {
    gantt = t.getGantt({
      height: 700,
      appendTo: document.body,
      startDate: new Date(2011, 6, 1),
      endDate: new Date(2011, 6, 30),
      features: {
        baselines: true,
        taskTooltip: false
      },
      rowHeight: 60,
      tasks: [{
        id: 1,
        name: 'Task 1',
        startDate: new Date(2011, 6, 1),
        endDate: new Date(2011, 6, 5)
      }, {
        id: 123,
        name: 'Task 123',
        startDate: new Date(2011, 6, 15),
        endDate: new Date(2011, 6, 23),
        children: [{
          id: 2,
          name: 'Task 2',
          startDate: new Date(2011, 6, 16),
          endDate: new Date(2011, 6, 20)
        }, {
          id: 3,
          name: 'Task 3',
          startDate: new Date(2011, 6, 18),
          endDate: new Date(2011, 6, 22),
          baselines: [{
            // Task id 3 has slipped by one day from its baseline end date of
            // 21 Jul and 16 days. It ends on 22nd with 17 days.
            endDate: new Date(2011, 6, 21),
            duration: 16
          }]
        }]
      }, {
        id: 4,
        name: 'Task 4',
        startDate: new Date(2011, 6, 25),
        endDate: new Date(2011, 6, 28)
      }, {
        id: 5,
        name: 'Task 5',
        startDate: new Date(2011, 6, 28),
        endDate: new Date(2011, 6, 28)
      }, {
        id: 6,
        name: 'Task 6',
        startDate: new Date(2011, 6, 28),
        duration: 0
      }]
    }); // Updating threw an error.

    t.livesOk(function () {
      gantt.taskStore.getById(1).startDate = new Date(2011, 6, 2);
    });
  });
});