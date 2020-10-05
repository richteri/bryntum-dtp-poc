// This is a copy of grid-and-scheduler-umd.t.js for running on TC
StartTest(function (t) {
  var gridClass = bryntum.grid.Grid,
      schedulerClass = bryntum.scheduler.Scheduler,
      ganttClass = bryntum.gantt.Gantt;
  t.ok(gridClass, 'bryntum.grid.Grid available');
  t.ok(schedulerClass, 'bryntum.scheduler.Scheduler available');
  t.ok(ganttClass, 'bryntum.gantt.Gantt available');
  new gridClass({
    appendTo: 'grid-container',
    id: 'grid',
    columns: [{
      field: 'name',
      text: 'Name'
    }],
    data: [{
      name: 'Mr Fantastic'
    }],
    width: 1024,
    height: 300
  });
  new schedulerClass({
    appendTo: 'scheduler-container',
    id: 'scheduler',
    width: 1024,
    height: 300
  });
  new ganttClass({
    appendTo: 'gantt-container',
    id: 'gantt',
    width: 1024,
    height: 300
  });
  t.chain({
    waitForSelector: '.b-grid#grid',
    desc: 'Grid element found'
  }, {
    waitForSelector: '.b-scheduler#scheduler',
    desc: 'Scheduler element found'
  }, {
    waitForSelector: '.b-gantt#gantt',
    desc: 'Gantt element found'
  }, {
    rightClick: '#grid .b-grid-cell',
    desc: 'grid: trigger element added to float root'
  }, {
    rightClick: '#scheduler .b-timeline-subgrid',
    desc: 'scheduler: trigger element added to float root'
  }, {
    rightClick: '#gantt .b-grid-header-text',
    desc: 'gantt: trigger element added to float root'
  }, {
    waitForSelector: '.b-float-root'
  }, function () {
    t.selectorCountIs('.b-float-root', 1, 'Single float root');
    t.notOk('BUNDLE_EXCEPTION' in window, 'No exception from including both');
  });
});