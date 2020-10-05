/**
 * Angular Rollups demo test
 */
StartTest(function (t) {
  t.it('Rendering', function (t) {
    t.chain({
      waitForSelector: '.b-gantt'
    }, {
      waitForSelector: '.b-gantt-task'
    });
  });
  t.it('Context Menu', function (t) {
    t.chain({
      contextmenu: '.b-sch-header-timeaxis-cell:textEquals(Mar 2017)'
    }, {
      waitForSelector: '.b-menu-text:textEquals(Filter tasks)'
    }, {
      waitForSelector: '.b-menu-text:textEquals(Zoom)'
    }, {
      waitForSelector: '.b-menu-text:textEquals(Date range)'
    });
  });
  t.it('Task Editor', function (t) {
    t.chain({
      dblclick: '[data-task-id="11"]'
    }, {
      waitForSelector: '.b-gantt-taskeditor'
    }, {
      click: '[name="name"]'
    }, {
      type: ' to do[ENTER]'
    }, {
      waitForSelector: '.b-grid-cell :textEquals(Important task to do)'
    });
  });
  t.it('Tooltips', function (t) {
    t.chain({
      moveMouseTo: '[data-task-id="14"]'
    }, {
      waitForSelector: '.b-gantt-task-title:textEquals(Email customer)'
    }, {
      moveMouseTo: '.b-checkbox-label'
    }, {
      waitForSelector: '.b-tooltip-content:contains(Toggle rollups)'
    });
  });
  t.it('Interaction', function (t) {
    t.chain({
      waitForSelector: '.b-task-rollup',
      desc: 'Should have rollups'
    }, {
      click: '.b-checkbox-label'
    }, {
      waitForSelectorNotFound: '.b-task-rollup',
      desc: 'Shouldn\'t have rollups'
    });
  });
}); // eof