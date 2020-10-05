StartTest(function (t) {
  var gantt;
  Object.assign(window, {
    Gantt: Gantt
  });
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should show task tooltip when hovering task', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      durationDisplayPrecision: 0
    });
    var task;
    t.chain(function (next) {
      return t.waitForPropagate(gantt.project, next);
    }, function (next) {
      task = gantt.taskStore.getById(11);
      task.duration = 2.5;
      t.waitForPropagate(gantt.project, next);
    }, // First down to the row
    {
      moveMouseTo: '.id11'
    }, // Then out to the task, to not get any other tooltip in the way
    {
      moveMouseTo: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-gantt-task-tooltip'
    }, function () {
      t.is(document.querySelector('.b-gantt-task-title').innerText, task.name, 'Correct title');
      t.is(document.querySelector('.b-tooltip .b-right').innerText, '3 days', 'Respected durationDisplayPrecision');
    });
  });
});