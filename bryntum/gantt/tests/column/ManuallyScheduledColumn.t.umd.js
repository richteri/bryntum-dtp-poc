StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && gantt.destroy();
  });
  t.it('Should be possible to edit event mode', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: ManuallyScheduledColumn.type,
        width: 80
      }]
    });
    var task = gantt.taskStore.getAt(5);
    t.chain({
      waitForRowsVisible: gantt
    }, {
      click: '[data-index=5] [data-column=manuallyScheduled] .b-checkbox'
    }, function (next) {
      t.is(task.manuallyScheduled, true, 'Manually scheduled mode changed'); // remove dependency to make sure the task won't fallback

      gantt.dependencyStore.remove(task.predecessors[0]);
      task.propagate().then(function () {
        t.is(task.startDate, new Date(2017, 0, 26), 'start date is correct');
        next();
      });
    }, {
      click: '[data-index=5] [data-column=manuallyScheduled] .b-checkbox'
    }, {
      waitForPropagate: task
    }, function () {
      t.is(task.manuallyScheduled, false, 'Manually scheduled mode changed back');
      t.is(task.startDate, new Date(2017, 0, 24), 'Start date is correct');
    });
  });
});