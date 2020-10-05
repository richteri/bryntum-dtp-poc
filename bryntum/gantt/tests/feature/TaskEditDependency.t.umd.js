StartTest(function (t) {
  var gantt;
  Object.assign(window, {
    Gantt: Gantt,
    ResourceStore: ResourceStore
  });
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should allow setting negative lag', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      width: 400,
      subGridConfigs: {
        locked: {
          width: 1
        }
      },
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      dblClick: '[data-task-id="14"]'
    }, {
      click: '.b-tabpanel-tab-title:textEquals(Predecessors)'
    }, {
      dblClick: '.b-grid-row[data-index=0] .b-grid-cell:textEquals(0 days)'
    }, {
      type: '[ARROWDOWN][ENTER]'
    }, {
      waitForSelector: '.b-grid-row[data-index=0] .b-grid-cell:textEquals(-1 days)'
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/8015

  t.it('Rejecting dependency removing and removing again should work', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var investigate = gantt.project.eventStore.getById(11);
    var assignResources = gantt.project.eventStore.getById(12);
    var iaDep;
    t.chain({
      waitForPropagate: gantt.project
    }, {
      dblclick: '.b-gantt-task.id11'
    }, {
      click: '.b-tabpanel-tab-title:contains(Successors)'
    }, {
      click: '.b-successorstab .b-add-button'
    }, {
      click: '.b-grid .b-cell-editor'
    }, {
      wheel: '.b-list',
      deltaY: '-100'
    }, {
      click: '.b-list-item:contains(Assign resources)'
    }, {
      waitForPropagate: gantt.project
    }, {
      click: '.b-button:contains(Save)'
    }, {
      waitForSelectorNotFound: '.b-gantt-taskeditor'
    }, function (next) {
      // Checking for new dependency
      iaDep = gantt.project.dependencyStore.find(function (d) {
        return d.fromEvent === investigate && d.toEvent === assignResources;
      });
      t.ok(iaDep, 'Dependency is found');
      next();
    }, {
      dblclick: '.b-gantt-task.id11'
    }, {
      click: '.b-tabpanel-tab-title:contains(Successors)'
    }, {
      click: '.b-gantt-taskeditor .b-grid-row:contains(Assign resources)'
    }, {
      click: '.b-successorstab .b-remove-button'
    }, {
      waitForPropagate: gantt.project
    }, {
      click: '.b-button:contains(Cancel)'
    }, {
      waitForSelectorNotFound: '.b-taskeditor-editing'
    }, function (next) {
      // Checking for new dependency
      iaDep = gantt.project.dependencyStore.find(function (d) {
        return d.fromEvent === investigate && d.toEvent === assignResources;
      });
      t.ok(iaDep, 'Dependency is found');
      next();
    }, {
      waitForPropagate: gantt.project
    }, {
      dblclick: '.b-gantt-task.id11'
    }, {
      click: '.b-tabpanel-tab-title:contains(Successors)'
    }, {
      click: '.b-gantt-taskeditor .b-grid-row:contains(Assign resources)'
    }, {
      click: '.b-successorstab .b-remove-button',
      desc: 'Here'
    }, {
      waitForPropagate: gantt.project
    }, {
      click: '.b-button:contains(Save)'
    }, {
      waitForSelectorNotFound: '.b-taskeditor-editing'
    }, function () {
      // Checking for dependency absence
      t.notOk(gantt.project.dependencyStore.includes(iaDep), 'Dependency has been removed');
      t.is(investigate.startDate, assignResources.startDate, 'Assign resources shifted back to project start');
    });
  }); // https://github.com/bryntum/support/issues/123

  t.it('Should show full list of tasks in dependency tab in TaskEditor when task store is filtered', function (t) {
    gantt = t.getGantt();
    var count = gantt.taskStore.count; // 15

    gantt.taskStore.filter('name', 'Investigate');
    t.chain({
      dblclick: '[data-task-id="11"]'
    }, {
      click: '.b-successors-tab'
    }, {
      dblclick: '.b-successors-tab .b-grid-cell[data-column="toEvent"]'
    }, {
      click: '.b-cell-editor .b-fieldtrigger'
    }, {
      waitForSelector: '.b-list-item'
    }, function () {
      // -1 because task cannot depend on itself
      // -1 because task is already in the dependencies
      t.selectorCountIs('.b-list-item', count - 2, 'Full list of tasks shown');
    });
  });
  t.it('Should show full list of tasks in dependency tab in TaskEditor when some of task nodes are collapsed', function (t) {
    gantt = t.getGantt();
    var count = gantt.taskStore.count; // 15

    t.chain({
      waitForPropagate: gantt.project
    }, function () {
      return gantt.collapse(gantt.taskStore.getById(2));
    }, {
      dblclick: '[data-task-id="11"]'
    }, {
      click: '.b-successors-tab'
    }, {
      dblclick: '.b-successors-tab .b-grid-cell[data-column="toEvent"]'
    }, {
      click: '.b-cell-editor .b-fieldtrigger'
    }, {
      waitForSelector: '.b-list-item'
    }, function () {
      // -1 because task cannot depend on itself
      // -1 because task is already in the dependencies
      t.selectorCountIs('.b-list-item', count - 2, 'Full list of tasks shown');
    });
  });
  t.it('Should mark newly added dependencies as added records', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      waitForPropagate: gantt.project
    }, function (next) {
      gantt.project.commitCrudStores();
      next();
    }, {
      dblClick: '.b-gantt-task.id232'
    }, {
      click: '.b-tabpanel-tab-title:contains(Predecessors)'
    }, {
      click: '.b-predecessorstab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger'
    }, {
      click: '.b-list-item[data-id="231"]'
    }, {
      click: '[data-ref="saveButton"]'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      t.is(gantt.dependencyStore.added.count, 1, 'Should have one record added');
      t.is(gantt.dependencyStore.modified.count, 0, 'Should have no records modified');
    });
  });
});