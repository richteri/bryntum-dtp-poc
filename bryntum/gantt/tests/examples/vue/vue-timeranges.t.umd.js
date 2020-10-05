/**
 * @author Saki
 * @date 2019-06-29 19:29:27
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-21 17:26:35
 */
StartTest(function (t) {
  t.it('Rendering', function (t) {
    t.chain({
      waitForSelector: '.b-gantt',
      desc: 'Should have gantt'
    }, {
      waitForSelector: '.b-gantt-task',
      desc: 'Should have task'
    }, {
      waitForSelector: '.b-panel .b-grid',
      desc: 'Should have grid in panel'
    });
  });
  t.it('Context Menu', function (t) {
    t.chain({
      contextmenu: '.b-sch-header-timeaxis-cell:textEquals(Sun 20 Jan 2019)'
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
      dblclick: '[data-task-id="15"]'
    }, {
      waitForSelector: '.b-gantt-taskeditor'
    }, {
      click: '[name="name"]'
    }, {
      type: '[BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE]all tests[ENTER]'
    }, {
      waitForSelector: '.b-grid-cell :textEquals(Run all tests)'
    });
  });
  t.it('Tooltips', function (t) {
    t.chain({
      moveMouseTo: '[data-task-id="1"]'
    }, {
      waitForSelector: '.b-gantt-task-title:textEquals(Setup web server)'
    });
  });
  t.it('Interaction', function (t) {
    t.chain({
      waitForSelector: '.b-sch-timerange label:textEquals(Critical milestone)',
      desc: 'Should have time range'
    }, {
      click: '.b-button:contains(Show header elements)'
    }, {
      waitForSelectorNotFound: 'b-sch-timerange label:textEquals(Critical milestone)',
      desc: 'Shouldn\'t have time range'
    }, {
      click: '.b-button:contains(Show header elements)'
    }, {
      dblclick: '.b-grid-cell:textEquals(Critical milestone)'
    }, {
      type: 'My milestone[ENTER]'
    }, {
      waitForSelector: '.b-sch-timerange label:textEquals(My milestone)',
      desc: 'Can edit time range'
    }, {
      click: 'button:contains(Add)'
    }, {
      waitForSelector: '.b-sch-timerange label:textEquals(New range)',
      desc: 'Can create time range'
    });
  });
}); // eof