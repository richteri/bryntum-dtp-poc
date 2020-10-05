/* global ProjectModel */
StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should be able to drag create on an unscheduled tasks row', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      // task will acquire a start date from the project start, but
      // still will be unscheduled, since there's no end date
      project: new ProjectModel({
        startDate: new Date(2017, 0, 16),
        eventsData: [{
          id: 1,
          name: 'Steve'
        }]
      }),
      features: {
        taskTooltip: false,
        taskEdit: false
      }
    });
    t.chain({
      drag: '.b-sch-timeaxis-cell',
      by: [100, 0],
      dragOnly: true
    }, function (next) {
      t.selectorExists('.b-sch-dragcreator-proxy', 'Drag create proxy shown');
      next();
    }, {
      mouseUp: null
    }, function () {
      t.selectorCountIs('.b-gantt-task', 1, 'One task element found');
      t.is(gantt.taskStore.count, 1, 'No new task record created');
      t.ok(gantt.taskStore.first.isScheduled);
      t.isGreater(gantt.taskStore.first.duration, 0);
    });
  });
  t.it('Should not be allowed to drag create on a scheduled tasks row', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      tasks: [{
        id: 1,
        name: 'Steve',
        startDate: '2017-01-16',
        duration: 2
      }],
      features: {
        taskTooltip: false,
        taskEdit: false
      }
    });
    t.chain({
      drag: '.b-sch-timeaxis-cell',
      by: [100, 0],
      dragOnly: true
    }, function (next) {
      t.selectorNotExists('.b-sch-dragcreator-proxy', 'No drag create proxy shown');
      next();
    }, {
      mouseUp: null
    }, function () {
      t.selectorCountIs('.b-gantt-task', 1, 'Only a single task element found');
      t.is(gantt.taskStore.count, 1, 'No new task record created');
    });
  });
});