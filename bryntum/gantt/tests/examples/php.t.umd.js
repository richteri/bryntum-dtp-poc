StartTest(function (t) {
  // get test descriptor (it has backend sync/load/reset URLs used in the test)
  var testConfig = t.harness.getScriptDescriptor(t.url),
      configFile = testConfig.configFile;

  if (configFile === 'FAILURE') {
    t.exit('Configuration file not found');
  } // Use unique cookie session ID per test


  t.setRandomPHPSession();
  var gantt = bryntum.query('gantt'),
      project = gantt.project,
      toolBar = bryntum.fromElement(document.querySelector('.b-top-toolbar')),
      tools = toolBar.widgetMap; // Disable tooltips

  !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();
  var clickSaveButton = {
    waitForEvent: [project, 'sync'],
    trigger: {
      click: '.b-button[data-ref="saveButton"]'
    }
  };
  var clickLoadButton = {
    waitForEvent: [project, 'load'],
    trigger: {
      click: '.b-button[data-ref="loadButton"]'
    }
  };
  var clickResetButton = {
    waitForEvent: [project, 'load'],
    trigger: {
      click: '.b-button[data-ref="resetButton"]'
    }
  };
  var wasLoaded = false; // drop the database after the test finishes

  t.onTearDown(function (callback) {
    fetch("php/drop.php?config=".concat(configFile)).then(callback);
  }); // Each test starts with clean data

  t.beforeEach(function (t, next) {
    // we don't trigger data reset for the very 1st sub-test
    if (!wasLoaded) {
      t.waitFor(function () {
        return project.crudLoaded;
      }, function () {
        wasLoaded = true;
        next();
      });
    } else {
      project.load({
        reset: true
      }).then(function () {
        return next();
      });
    }
  });
  t.it('Undo/Redo should be clear clear after load', function (t) {
    t.chain({
      click: '.b-button[data-ref="addTaskButton"]'
    }, {
      waitForSelector: '.b-badge[data-ref="undoBtn"][data-badge="1"]',
      desc: 'Undo badge is 1'
    }, {
      click: tools.addTaskButton.element
    }, {
      waitForSelector: '.b-badge[data-ref="undoBtn"][data-badge="2"]',
      desc: 'Undo badge is 2'
    }, {
      click: tools.undoBtn.element
    }, {
      waitForSelector: '.b-badge[data-ref="undoBtn"][data-badge="1"]',
      desc: 'Undo badge is 1'
    }, {
      waitForSelector: '.b-badge[data-ref="redoBtn"][data-badge="1"]',
      desc: 'Redo badge is 1'
    }, clickLoadButton, {
      waitForSelectorNotFound: '.b-badge[data-ref="undoBtn"]',
      desc: 'Undo  badge is hidden'
    }, {
      waitForSelectorNotFound: '.b-badge[data-ref="redoBtn"]',
      desc: 'Redo badge is hidden'
    });
  }); // #8966 - PHP demo: task sort order is not stored

  t.it('Task sort order should be stored on server', function (t) {
    var task;
    t.chain( // Drag and don't save
    {
      waitFor: function waitFor() {
        return task = gantt.taskStore.getById('12');
      },
      desc: 'Task #12 is found'
    }, {
      waitFor: function waitFor() {
        return task.parentIndex === 1;
      },
      desc: 'Correct parent index after data reset'
    }, {
      drag: '.b-grid-row:contains(Configure firewall)',
      offset: [150, '50%'],
      by: [0, -60]
    }, {
      waitFor: function waitFor() {
        return task.parentIndex === 0;
      },
      desc: 'Correct parent index after dragging'
    }, // Drag and save
    clickLoadButton, {
      waitFor: function waitFor() {
        return task = gantt.taskStore.getById('12');
      },
      desc: 'Task #12 is found..'
    }, {
      waitFor: function waitFor() {
        return task.parentIndex === 1;
      },
      desc: 'Correct parent index after data loading'
    }, {
      drag: '.b-grid-row:contains(Configure firewall)',
      offset: [150, '50%'],
      by: [0, -60]
    }, {
      waitFor: function waitFor() {
        return task.parentIndex === 0;
      },
      desc: 'Correct parent index after dragging'
    }, clickSaveButton, clickLoadButton, {
      waitFor: function waitFor() {
        return task.parentIndex === 0;
      },
      desc: 'Correct parent index after save & load'
    });
  });
  t.it('Should reset data', function (t) {
    t.chain({
      click: tools.addTaskButton.element
    }, clickSaveButton, clickLoadButton, {
      waitFor: function waitFor() {
        return gantt.taskStore.getById(4037);
      },
      desc: 'New task exists'
    }, clickResetButton, {
      waitFor: function waitFor() {
        return !gantt.taskStore.getById(4037);
      },
      desc: 'New task doesn\'t exist'
    });
  }); // #8844 - PHP demo: dragging and tooltip are broken after a newly created task is saved

  t.it('Should be able to drag newly created task', function (t) {
    t.chain({
      click: tools.addTaskButton.element
    }, {
      type: 'Drag task',
      target: '.b-cell-editor input',
      options: {
        clearExisting: true
      }
    }, clickSaveButton, {
      drag: '.b-grid-row:contains(Drag task)',
      offset: [150, '50%'],
      by: [0, -60],
      desc: 'Task dragged'
    });
  }); // #8712 - PHP demo: after creating a new task and saving it, when try to interact with the task demo fails with exceptions

  t.it('Should be able to edit newly created task', function (t) {
    t.chain({
      click: tools.addTaskButton.element
    }, {
      type: 'My new task',
      target: '.b-cell-editor input',
      options: {
        clearExisting: true
      }
    }, clickSaveButton, {
      dblClick: '.b-grid-cell :contains(My new task)'
    }, {
      type: 'Edited task[ENTER]',
      target: '.b-cell-editor input',
      options: {
        clearExisting: true
      }
    }, {
      waitForSelector: '.b-grid-cell :contains(Edited task)',
      desc: 'Edited task row exists'
    });
  }); // #8715 - PHP demo: after creating a new task and saving it selection is broken

  t.it('Selecting single tasks after creating new one should work', function (t) {
    t.chain({
      click: tools.addTaskButton.element
    }, {
      type: 'First one',
      target: '.b-cell-editor input',
      options: {
        clearExisting: true
      }
    }, clickSaveButton, {
      click: '.b-tree-cell :textEquals(Celebrate launch)'
    }, {
      waitForSelector: '.b-tree-cell.b-selected :textEquals(Celebrate launch)',
      desc: 'Celebrate launch row is selected'
    }, function (next) {
      t.selectorCountIs('.b-tree-cell.b-selected', 1, 'One row is selected');
      next();
    }, {
      click: tools.addTaskButton.element
    }, {
      type: 'Next one',
      target: '.b-cell-editor input',
      options: {
        clearExisting: true
      }
    }, {
      click: '.b-tree-cell :textEquals(Celebrate launch)'
    }, clickSaveButton, {
      waitForSelector: '.b-tree-cell.b-selected :textEquals(Celebrate launch)',
      desc: '"Celebrate launch" row is selected'
    }, function (next) {
      t.selectorCountIs('.b-tree-cell.b-selected', 1, 'One row is selected');
      next();
    }, {
      click: '.b-tree-cell :contains(Next one)'
    }, {
      waitForSelector: '.b-tree-cell.b-selected :contains(Next one)',
      desc: '"Next one" row is selected'
    }, function (next) {
      t.selectorCountIs('.b-tree-cell.b-selected', 1, 'One row is selected');
      next();
    });
  }); // #9045 - PHP demo: Scheduling conflict on Data reset after open task editor.

  t.it('Reset data after TaskEditor is shown should work', function (t) {
    t.chain( // Reset data when Task Editor is open
    {
      rightClick: '[data-task-id=11]',
      desc: 'Right clicked the task'
    }, {
      click: '.b-menuitem[data-ref="editTask"]',
      desc: 'Clicked task editor menu entry'
    }, {
      type: '[ESCAPE]'
    }, clickResetButton, // Reset data after Cancel in Task Editor
    {
      rightClick: '[data-task-id=11]',
      desc: 'Right clicked the task'
    }, {
      click: '.b-menuitem[data-ref="editTask"]',
      desc: 'Clicked task editor menu entry'
    }, {
      click: '.b-popup .b-button[data-ref="cancelButton"]',
      desc: 'Clicked "Cancel"'
    }, clickResetButton, // Reset data after Save in Task Editor
    {
      rightClick: '[data-task-id=11]'
    }, {
      click: '.b-menuitem[data-ref="editTask"]'
    }, {
      click: '.b-popup .b-button[data-ref="saveButton"]'
    }, clickResetButton);
  }); // #8844 - PHP demo: dragging and tooltip are broken after a newly created task is saved

  t.it('Should not duplicate newly created and saved task', function (t) {
    t.chain({
      click: tools.addTaskButton.element
    }, clickSaveButton, function () {
      return t.selectorCountIs('.b-sch-label:contains(New task)', 1, 'Only one new task is rendered');
    });
  }); // #8967 - PHP demo: error when removing tasks with children

  t.it('Should not throw error on task node removal', function (t) {
    t.chain({
      rightClick: '.b-grid-cell:contains(Setup web server)'
    }, {
      click: '.b-menuitem :textEquals(Delete task)'
    }, clickSaveButton);
  });
  t.it('Should not throw exception when opening features menu', function (t) {
    t.chain({
      click: '.b-gantttoolbar [data-ref="featuresButton"]'
    }, {
      waitForElementVisible: '.b-menuitem :contains(Show rollups)',
      desc: 'Menu has showed up'
    }, function () {
      return t.elementIsNotVisible('.b-menuitem :contains(Show baselines)', 'No baselines entry');
    });
  });
});