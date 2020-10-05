/**
 * @author Saki
 * @date 2019-06-29 19:29:27
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-15 23:30:37
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
      waitForSelector: '.b-tabpanel-tab-title:textEquals(Common)',
      desc: 'Should have Common tab'
    }, {
      waitForSelector: '.b-tabpanel-tab-title:textEquals(Files)',
      desc: 'Should have Files tab'
    }, {
      waitForSelector: '.b-textfield label:textEquals(Deadline)',
      desc: 'Should have Deadline field'
    }, {
      waitForSelector: '.b-textfield label:textEquals(Color)',
      desc: 'Should have Color field'
    }, {
      waitForSelectorNotFound: 'b-tabpanel-tab-title:textEquals(Notes)',
      desc: 'Shouldn\'t have Notes tab'
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
}); // eof