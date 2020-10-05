/**
 * Filtering Angular demo test
 */
describe('Test Taskeditor demo', function (t) {
  var gantt = bryntum.query('gantt'),
      taskSelector = '[data-task-id="11"]';
  !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();
  t.it('Check task editor tabs', function (t) {
    t.chain({
      waitForSelector: taskSelector,
      desc: 'Task appears'
    }, {
      dblClick: taskSelector
    }, {
      waitForSelector: '.b-gantt-taskeditor',
      desc: 'Task editor opens'
    }, {
      click: ':textEquals(Common)'
    }, {
      waitForSelector: '.b-active span:textEquals(Common)',
      desc: 'Can activate Common tab'
    }, {
      click: ':textEquals(Successors)'
    }, {
      waitForSelector: '.b-active span:textEquals(Successors)',
      desc: 'Can activate Successors tab'
    }, {
      click: ':textEquals(Predecessors)'
    }, {
      waitForSelector: '.b-active span:textEquals(Predecessors)',
      desc: 'Can activate Predecessors tab'
    }, {
      click: ':textEquals(Resources)'
    }, {
      waitForSelector: '.b-active span:textEquals(Resources)',
      desc: 'Can activate Resources tab'
    }, {
      click: ':textEquals(Advanced)'
    }, {
      waitForSelector: '.b-active span:textEquals(Advanced)',
      desc: 'Can activate Advanced tab'
    }, {
      click: ':textEquals(Files)'
    }, {
      waitForSelector: '.b-active span:textEquals(Files)',
      desc: 'Can activate Files tab'
    }, {
      click: ':textEquals(Common)'
    }, {
      waitForSelector: '.b-active span:textEquals(Common)'
    }, {
      type: '[BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE][BACKSPACE]',
      target: '[name="name"]'
    }, {
      type: 'N',
      target: '[name="name"]',
      options: {
        shiftKey: true
      }
    }, {
      type: 'gnix',
      target: '[name="name"]'
    }, {
      click: ':textEquals(Save)'
    }, {
      waitForSelector: '.b-tree-cell-value:textEquals(Install Ngnix)',
      desc: 'Can edit and save task name'
    });
  });
}); // eo describe Test buttons
// eof