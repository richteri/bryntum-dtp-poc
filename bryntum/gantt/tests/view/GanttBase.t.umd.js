StartTest(function (t) {
  var ganttBase;
  t.beforeEach(function (t) {
    ganttBase && !ganttBase.isDestroyed && ganttBase.destroy();
  });
  t.it('Sanity', function (t) {
    ganttBase = new GanttBase({
      appendTo: document.body,
      width: 800,
      height: 600,
      startDate: new Date(2019, 8, 18),
      endDate: new Date(2019, 8, 25),
      tasks: [{
        id: 1,
        name: 'Task',
        startDate: new Date(2019, 8, 18),
        duration: 2,
        durationUnit: 'd'
      }]
    });
    t.selectorExists('.b-grid-header:textEquals(Name)', 'Header rendered');
    t.selectorExists('.b-sch-header-timeaxis-cell:textEquals(S)', 'Time axis header rendered');
    t.selectorExists('.b-grid-cell:textEquals(Task)', 'Cell rendered');
    t.selectorExists('.b-gantt-task', 'Task rendered');
    t.isDeeply(Object.keys(ganttBase.features), ['dependencies', 'tree', 'regionResize'], 'Correct features included by default');
  });
});