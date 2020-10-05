StartTest(function (t) {
  var gantt, addNewColumn;
  t.beforeEach(function () {
    gantt && gantt.destroy();
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      subGridConfigs: {
        locked: {
          width: 200
        }
      },
      columns: [{
        type: 'name'
      }, {
        text: 'foo'
      }, {
        text: 'bar'
      }, {
        text: 'baz'
      }, {
        type: 'addnew',
        width: 80
      }]
    });
    addNewColumn = gantt.columns.getAt(4);
  });
  t.it('Check all extra available columns', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, {
      click: addNewColumn.columnCombo.input
    }, function () {
      t.isDeeply(addNewColumn.columnCombo.picker.store.records.map(function (r) {
        return {
          id: r.id,
          text: r.text
        };
      }), [{
        id: 'percentdone',
        text: '% Done'
      }, {
        id: 'resourceassignment',
        text: 'Assigned Resources'
      }, {
        id: 'calendar',
        text: 'Calendar'
      }, {
        id: 'constraintdate',
        text: 'Constraint Date'
      }, {
        id: 'constrainttype',
        text: 'Constraint Type'
      }, {
        id: 'deadlinedate',
        text: 'Deadline'
      }, {
        id: 'duration',
        text: 'Duration'
      }, {
        id: 'earlyenddate',
        text: 'Early End'
      }, {
        id: 'earlystartdate',
        text: 'Early Start'
      }, {
        id: 'effort',
        text: 'Effort'
      }, {
        id: 'eventmode',
        text: 'Event mode'
      }, {
        id: 'enddate',
        text: 'Finish'
      }, {
        id: 'lateenddate',
        text: 'Late End'
      }, {
        id: 'latestartdate',
        text: 'Late Start'
      }, {
        id: 'manuallyscheduled',
        text: 'Manually scheduled'
      }, {
        id: 'milestone',
        text: 'Milestone'
      }, {
        id: 'note',
        text: 'Note'
      }, {
        id: 'predecessor',
        text: 'Predecessors'
      }, {
        id: 'rollup',
        text: 'Rollup'
      }, {
        id: 'schedulingmodecolumn',
        text: 'Scheduling Mode'
      }, {
        id: 'sequence',
        text: 'Sequence'
      }, {
        id: 'showintimeline',
        text: 'Show in timeline'
      }, {
        id: 'startdate',
        text: 'Start'
      }, {
        id: 'successor',
        text: 'Successors'
      }, {
        id: 'totalslack',
        text: 'Total Slack'
      }, {
        id: 'wbs',
        text: 'WBS'
      }], 'Correct available columns');
    });
  });
  t.it('Create new column', function (t) {
    var newColumnsStore = addNewColumn.columnCombo.store,
        firstColumnClass = newColumnsStore.getAt(0).value,
        secondColumnClass = newColumnsStore.getAt(1).value;
    t.chain({
      waitForRowsVisible: gantt
    }, {
      click: addNewColumn.columnCombo.input
    }, function (next) {
      t.click(addNewColumn.columnCombo.picker.getItem(0)).then(next);
    }, {
      waitFor: function waitFor() {
        return !addNewColumn.columnCombo.picker.isVisible;
      }
    }, // The first column class must now be present
    function (next) {
      t.ok(gantt.columns.some(function (c) {
        return c.constructor === firstColumnClass;
      }));
      next();
    }, {
      click: addNewColumn.columnCombo.input
    }, function (next) {
      t.click(addNewColumn.columnCombo.picker.getItem(0)).then(next);
    }, {
      waitFor: function waitFor() {
        return !addNewColumn.columnCombo.picker.isVisible;
      }
    }, // The second column class must now be present
    function () {
      t.ok(gantt.columns.some(function (c) {
        return c.constructor === secondColumnClass;
      }));
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/8133/details

  t.it('should not cause scroll to be reset when hiding a column', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function (next) {
      gantt.subGrids.locked.scrollable.x = 100;
      next();
    }, {
      rightClick: '.b-grid-header-text:contains(foo)'
    }, {
      click: '.b-menu-text:contains(Hide)'
    }, function () {
      gantt.columns.getAt(2).hidden = true;
      t.is(gantt.subGrids.locked.scrollable.x, 100, 'Scroll intact');
    });
  });
});