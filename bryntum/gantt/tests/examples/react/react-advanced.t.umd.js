/**
 * @author Saki
 * @date 2019-05-20 20:28:38
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-30 13:52:09
 *
 * Advanced React demo test
 *
 * cSpell: ignore zoomchange, timeaxischange, nonworkingtime
 */
describe('Test buttons', function (t) {
  var panel = bryntum.query(function (i) {
    return i.myPanel;
  }),
      gantt = bryntum.query(function (w) {
    return w.$name === 'Gantt';
  }),
      buttons = panel.tbar.widgetMap;
  !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();
  t.it('Rendering', function (t) {
    t.chain({
      waitForSelector: '.b-gantt'
    }, {
      waitForSelector: '.b-gantt-task'
    });
  });
  t.it('Check toolbar buttons', function (t) {
    t.ok(gantt.element.classList.contains('b-gantt'), 'Gantt is found');
    t.willFireNTimes(gantt, 'presetchange', 3);
    t.willFireNTimes(gantt, 'timeaxischange', 5);

    var checkToolTip = function checkToolTip(t, button, text, x, y, width, height) {
      return [{
        moveMouseTo: button.element
      }, {
        waitForSelector: ".b-tooltip:contains(".concat(text, ")"),
        desc: 'Correct tooltip shown'
      }, function (next) {
        var bounds = document.querySelector('.b-tooltip').getBoundingClientRect();
        t.isApprox(bounds.left, x, 6, 'Correct tooltip x');
        t.isApprox(bounds.top, y, 3, 'Correct tooltip y');
        t.isApprox(bounds.width, width, 3, 'Correct tooltip width');
        t.isApprox(bounds.height, height, 3, 'Correct tooltip height');
        next();
      }];
    };

    t.chain(checkToolTip(t, buttons.addTaskButton, 'Create new task', 0, 55, 127, 47), checkToolTip(t, buttons.editTaskButton, 'Edit selected task', 87, 55, 135, 47), {
      click: buttons.addTaskButton.element
    }, {
      waitForSelector: 'input:focus'
    }, // Create task with name foo
    {
      type: 'foo[ENTER]'
    }, // Open task editor
    {
      click: buttons.editTaskButton.element
    }, // rename task to bar
    {
      type: '[BACKSPACE][BACKSPACE][BACKSPACE]bar',
      target: '[name=\'name\']'
    }, {
      click: ':textEquals(Save)'
    }, function (next) {
      t.selectorNotExists('.b-grid-cell:textEquals(foo)');
      t.selectorExists('.b-grid-cell:textEquals(bar)');
      next();
    }, {
      click: buttons.collapseAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && task.isExpanded(gantt.taskStore);
      }), null, 'No expanded nodes found');
      next();
    }, {
      click: buttons.expandAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && !task.isExpanded(gantt.taskStore);
      }), null, 'No collapsed nodes found');
      next();
    }, // These should trigger 1 timeaxischange each
    {
      click: buttons.zoomInButton.element
    }, {
      click: buttons.zoomOutButton.element
    }, {
      click: buttons.zoomToFitButton.element
    }, {
      click: buttons.previousButton.element
    }, {
      click: buttons.nextButton.element
    }); // eo chain
  }); // eo it('Check toolbar buttons')

  t.it('Should support turning features on and off', function (t) {
    t.chain({
      click: buttons.featuresButton.element
    }, // dependencies
    {
      click: '.b-menu-text:textEquals(Draw dependencies)'
    }, {
      waitForSelectorNotFound: '.b-sch-dependency'
    }, {
      click: '.b-menu-text:textEquals(Draw dependencies)'
    }, {
      waitForSelector: '.b-sch-dependency'
    }, // eof dependencies
    // labels
    {
      click: '.b-menu-text:textEquals(Task labels)'
    }, {
      waitForSelectorNotFound: '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label'
    }, {
      click: '.b-menu-text:textEquals(Task labels)'
    }, {
      waitForSelector: '.b-gantt-task-wrap .b-sch-label'
    }, // eo labels
    // project lines
    {
      click: '.b-menu-text:textEquals(Project lines)'
    }, function (next) {
      t.selectorNotExists('.b-gantt-project-line:textEquals(Project start)');
      next();
    }, {
      click: '.b-menu-text:textEquals(Project lines)'
    }, function (next) {
      t.selectorExists('.b-gantt-project-line:textEquals(Project start)');
      next();
    }, // eo project lines
    // non-working time
    {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, function (next) {
      t.selectorNotExists('.b-sch-nonworkingtime');
      next();
    }, {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, function (next) {
      t.selectorExists('.b-sch-nonworkingtime');
      next();
    }, // eo non-working time
    // schedule collapsing
    {
      click: '.b-menu-text:textEquals(Hide schedule)'
    }, function (next) {
      t.ok(gantt.subGrids.normal.collapsed, 'Schedule collapsed');
      next();
    }, {
      click: '.b-menu-text:textEquals(Hide schedule)'
    }, function () {
      t.notOk(gantt.subGrids.normal.isCollapsed, 'Schedule expanded');
    } // eo schedule collapsing
    ); // eo chain
  }); // eo it('should support turning features on and off')
}); // eo describe Test buttons
// eof