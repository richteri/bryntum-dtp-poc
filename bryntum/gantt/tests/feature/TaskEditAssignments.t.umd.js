StartTest(function (t) {
  Object.assign(window, {
    // The test harness needs this so that it can mock URLs for testing purposes.
    AjaxHelper: AjaxHelper
  });
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should save assignments after task edit save button click', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var investigate = gantt.project.eventStore.getAt(2),
        Arcady = gantt.project.resourceStore.getById(1);
    t.chain({
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-taskeditor'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-grid .b-cell-editor'
    }, {
      wheel: '.b-list',
      deltaY: '-100'
    }, {
      click: '.b-list-item[data-index="0"]'
    }, {
      click: '.b-button:contains(Save)'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      t.is(investigate.assignments.length, 1, 'Investigate task now has one assignment');
      t.is(investigate.assignments[0].resource, Arcady, 'Arcady is assigned to the task');
    });
  });
  t.it('Should not change assignments after task edit cancel button click', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var investigate = gantt.project.eventStore.getAt(2);
    t.chain({
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-taskeditor'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-grid .b-cell-editor'
    }, {
      wheel: '.b-list',
      deltaY: '-100'
    }, {
      click: '.b-list-item[data-index="0"]'
    }, {
      click: '.b-button:contains(Cancel)'
    }, {
      waitForSelectorNotFound: '.b-taskeditor-editing'
    }, function () {
      t.is(investigate.assignments.length, 0, 'Investigate task now has no assignments');
    });
  });
  t.it('Should not cancel edit when editing a new resource assignment', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var editorContext;
    t.chain({
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-taskeditor'
    }, function (next) {
      gantt.features.taskEdit.editor.widgetMap.tabs.layout.animateCardChange = false;
      next();
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      waitFor: function waitFor() {
        editorContext = gantt.features.taskEdit.editor.widgetMap['resourcestab-grid'].features.cellEdit.editorContext;
        return editorContext && editorContext.editor.containsFocus;
      }
    }, {
      click: function click() {
        return editorContext.editor.inputField.triggers.expand.element;
      }
    }, {
      click: function click() {
        return editorContext.editor.inputField.picker.getItem(1);
      }
    }, {
      type: '[TAB]'
    }, // Nothing should happen. The test is that editing does not finish
    // so there's no event to wait for.
    {
      waitFor: 500
    }, function () {
      editorContext = gantt.features.taskEdit.editor.widgetMap['resourcestab-grid'].features.cellEdit.editorContext;
      t.ok(editorContext && editorContext.editor.containsFocus);
    });
  });
  t.it('Should not show already assigned resources in the resource combo picker', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var investigate = gantt.project.eventStore.getAt(2),
        Arcady = gantt.project.resourceStore.getById(1);
    investigate.assign(Arcady);
    t.chain({
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-taskeditor'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      dblclick: '.b-grid .b-grid-cell'
    }, {
      click: '.b-grid .b-cell-editor'
    }, function (next) {
      t.selectorExists('.b-list-item:textEquals(Arcady)', 'Arcady not filtered out since he is the resource of the assignment being edited');
      next();
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-grid .b-cell-editor'
    }, function (next) {
      t.selectorNotExists('.b-list-item:textEquals(Arcady)', 'Arcady filtered out since he is already assigned');
    });
  });
  t.it('Should mark newly added assignments as added records', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    t.chain({
      dblClick: '.b-gantt-task.id12'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger'
    }, {
      click: '.b-list-item[data-id="1"]'
    }, {
      click: '[data-ref="saveButton"]'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      t.is(gantt.assignmentStore.added.count, 1, 'Should have one record added');
      t.is(gantt.assignmentStore.modified.count, 0, 'Should have no records modified');
    });
  }); // https://github.com/bryntum/support/issues/858

  t.it('Should not send removed dummy assignment record to server', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    t.chain({
      diag: 'Add dummy assignment record and cancel changes'
    }, {
      dblClick: '.b-gantt-task.id12'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '[data-ref="cancelButton"]'
    }, {
      diag: 'Add assignment record and save changes'
    }, {
      dblClick: '.b-gantt-task.id13'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger'
    }, {
      click: '.b-list-item[data-id="1"]'
    }, {
      click: '[data-ref="saveButton"]'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      t.is(gantt.assignmentStore.added.count, 1, 'Should have one record added');
      t.is(gantt.assignmentStore.modified.count, 0, 'Should have no records modified');
      t.is(gantt.assignmentStore.removed.count, 0, 'Should have no records removed');
    });
  }); // https://github.com/bryntum/support/issues/968

  t.it('Should not crash when edit a task after saving new resources', function (t) {
    var phantomId, resourcesTab;
    t.mockUrl('/syncUrl', function () {
      return {
        responseText: JSON.stringify({
          success: true,
          assignments: {
            rows: [{
              id: 9000,
              $PhantomId: phantomId
            }]
          }
        })
      };
    });
    gantt = t.getGantt({
      project: {
        transport: {
          sync: {
            url: '/syncUrl'
          }
        },
        resourcesData: t.getResourceStoreData()
      },
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      dblClick: '.b-gantt-task.id11',
      desc: 'Edit task'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger',
      desc: 'Add assignment record'
    }, {
      click: '.b-list-item[data-id="1"]'
    }, function (next) {
      resourcesTab = gantt.features.taskEdit.editor.widgetMap.resourcestab;
      phantomId = resourcesTab.grid.store.last.id;
      next();
    }, {
      click: '[data-ref="saveButton"]',
      desc: 'Save changes'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      return gantt.project.sync();
    }, {
      dblClick: '.b-gantt-task.id11',
      desc: 'Edit task again'
    }, function (next) {
      t.waitForRowsVisible(resourcesTab.grid, next);
    }, function () {
      t.is(resourcesTab.grid.selectedRecord.id, 9000, 'Record is selected');
      t.isDeeply(resourcesTab.grid.selectedRecordCollection.indices.id, {
        9000: 0
      }, 'Indices updated');
    });
  }); // https://github.com/bryntum/support/issues/1131

  t.it('Should not crash when edit a task after canceling new resources', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      tasks: [{
        id: 1,
        startDate: '2020-02-03T00:00:00',
        duration: 1,
        durationUnit: 'd'
      }, {
        id: 2,
        startDate: '2020-02-03T00:00:00',
        duration: 1,
        durationUnit: 'd'
      }],
      resources: [{
        id: 1,
        name: 'Celia'
      }],
      assignments: [{
        id: 1,
        event: 1,
        resource: 1
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 2
      }]
    });
    t.chain({
      dblClick: '[data-task-id="2"]',
      desc: 'Edit task'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger',
      desc: 'Add assignment record'
    }, {
      click: '.b-list-item[data-id="1"]'
    }, {
      click: '[data-ref="cancelButton"]',
      desc: 'Cancel changes'
    }, {
      dblClick: '[data-task-id="2"]',
      desc: 'Edit task again'
    }, {
      click: '.b-tabpanel-tab-title:contains(Resources)'
    }, {
      click: '.b-resourcestab .b-add-button'
    }, {
      click: '.b-cell-editor .b-fieldtrigger',
      desc: 'Add assignment record'
    }, {
      click: '.b-list-item[data-id="1"]'
    }, {
      click: '[data-ref="saveButton"]',
      desc: 'Save changes, no errors'
    });
  });
});