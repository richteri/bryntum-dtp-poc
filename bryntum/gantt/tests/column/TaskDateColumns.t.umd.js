StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && !gantt.isDestroyed && gantt.destroy();
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: 'startdate'
      }, {
        type: 'enddate'
      }]
    });
  });
  t.it('Should use Gantt#displayDateFormat by default', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      var start = DateHelper.format(gantt.taskStore.first.startDate, gantt.columns.getAt(1).format),
          end = DateHelper.format(gantt.taskStore.first.endDate, gantt.columns.getAt(1).format);
      t.selectorExists(".id1000 [data-column=startDate]:textEquals(".concat(start, ")"), 'Start date rendered correctly');
      t.selectorExists(".id1000 [data-column=endDate]:textEquals(".concat(end, ")"), 'End date rendered correctly');
    });
  });
  t.it('Should update when Gantt#displayDateFormat changes', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      gantt.displayDateFormat = 'L';
      var start = DateHelper.format(gantt.taskStore.first.startDate, gantt.columns.getAt(1).format),
          end = DateHelper.format(gantt.taskStore.first.endDate, gantt.columns.getAt(1).format);
      t.selectorExists(".id1000 [data-column=startDate]:textEquals(".concat(start, ")"), 'Start date rendered correctly');
      t.selectorExists(".id1000 [data-column=endDate]:textEquals(".concat(end, ")"), 'End date rendered correctly');
    });
  });
  t.it('Should be able to specify explicit format', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      gantt.columns.get('startDate').format = 'YYYY';
      var start = gantt.taskStore.first.startDate.getFullYear(),
          end = gantt.getFormattedDate(gantt.taskStore.first.endDate);
      t.selectorExists(".id1000 [data-column=startDate]:textEquals(".concat(start, ")"), 'Start date rendered correctly');
      t.selectorExists(".id1000 [data-column=endDate]:textEquals(".concat(end, ")"), 'End date rendered correctly');
    });
  });
});