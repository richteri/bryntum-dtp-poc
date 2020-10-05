StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  });
  t.it('Should change task calendar', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: CalendarColumn.type
      }, {
        type: StartDateColumn.type
      }, {
        type: DurationColumn.type
      }]
    });
    var project = gantt.project;
    var task = project.getEventStore().getById(11),
        originalEnd;
    t.chain({
      waitForPropagate: project
    }, function (next) {
      originalEnd = task.endDate;
      next();
    }, {
      click: '.id11 [data-column=calendar]'
    }, {
      type: '[ENTER]b[ENTER][ENTER]',
      desc: 'Picked business calendar'
    }, {
      waitForSelector: '.id11 [data-column=calendar]:contains(Business)'
    }, function (next) {
      var calendar = task.getCalendarManagerStore().getById('business');
      t.is(task.calendar, calendar, 'Task calendar is ok');
      next();
    }, {
      click: '.id11 [data-column=calendar]'
    }, function (next) {
      var input = document.querySelector('input[name=calendar]');
      t.is(input.value, 'Business', 'Calendar value is ok');
      next();
    }, {
      click: '.b-icon-remove'
    }, {
      type: '[ENTER]'
    }, {
      waitForPropagate: project
    }, function (next) {
      t.is(task.endDate, originalEnd, 'Task end date is ok');
      t.is(task.calendar.id, project.defaultCalendar.id, 'Task calendar removed');
      next();
    });
  });
});