StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && gantt.destroy();
  });
  t.it('Should render properly', function (t) {
    gantt = t.getGantt({
      id: 'gantt',
      columns: [{
        type: RollupColumn.type
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function (next) {
      t.selectorExists('[data-id=21] [data-column=rollup] input[type=checkbox]:not(:checked)', 'Preparation not checked');
      t.selectorExists('[data-id=22] [data-column=rollup] input[type=checkbox]:checked', 'Choose technology checked');
    });
  });
  t.it('Should change rollup property', function (t) {
    gantt = t.getGantt({
      id: 'gantt',
      columns: [{
        type: RollupColumn.type
      }]
    });
    t.chain({
      click: '[data-index=2] [data-column=rollup]'
    }, function (next) {
      t.is(gantt.taskStore.getAt(2).rollup, true, 'Switched to true');
    });
  });
});