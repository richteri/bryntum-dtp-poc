StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should be able to tab through all cells while editing', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: Object.values(AllColumns).map(function (ColumnClass) {
        return {
          type: ColumnClass.type
        };
      })
    });
    t.chain({
      dblClick: '.b-grid-cell:nth-child(2)'
    }, {
      type: '[TAB]'.repeat(gantt.columns.count * 3)
    }, // All cells in three rows (+ some extra since some are not editable)
    function () {
      t.pass('Tabbed through without exception');
    });
  });
  t.it('Should be able to tab through all cells for new record', function (t) {
    gantt = t.getGantt({
      tasks: [{}],
      appendTo: document.body,
      columns: Object.values(AllColumns).map(function (ColumnClass) {
        return {
          type: ColumnClass.type
        };
      })
    });
    t.chain({
      dblClick: ".b-grid-cell:nth-child(2)"
    }, {
      type: '[TAB]'.repeat(gantt.columns.count * 2)
    }, // All cells in three rows (+ some extra since some are not editable)
    function () {
      t.pass('Tabbed through without exception');
    });
  });
  t.it('Should validate dependencies', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'predecessor',
        width: 100
      }, {
        type: 'successor',
        width: 100
      }],
      startDate: '2019-05-20',
      endDate: '2019-05-26',
      tasks: [{
        id: 1,
        cls: 'task1',
        name: 'Task 1',
        startDate: '2019-05-20',
        duration: 1
      }, {
        id: 2,
        cls: 'task2',
        name: 'Task 2',
        startDate: '2019-05-20',
        duration: 1,
        expanded: true,
        children: [{
          id: 21,
          cls: 'task21',
          name: 'Task 21',
          startDate: '2019-05-20',
          duration: 1
        }, {
          id: 22,
          cls: 'task22',
          name: 'Task 22',
          startDate: '2019-05-21',
          duration: 1
        }]
      }, {
        id: 3,
        cls: 'task3',
        name: 'Task 3',
        startDate: '2019-05-20',
        duration: 1
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 21
      }, {
        id: 2,
        fromEvent: 21,
        toEvent: 22
      }]
    });
    var task1 = gantt.taskStore.getById(1),
        task3 = gantt.taskStore.getById(3);
    var dependencyField, predecessorsCell;
    t.chain({
      waitForPropagate: gantt
    }, // Type invalid predecessor ID
    {
      dblclick: function dblclick() {
        return predecessorsCell = document.querySelector('.task1 [data-column=predecessors]');
      }
    }, {
      waitFor: function waitFor() {
        if (gantt.features.cellEdit.editorContext && gantt.features.cellEdit.editorContext.editor.containsFocus) {
          dependencyField = gantt.features.cellEdit.editorContext.editor.inputField;
          return true;
        }
      }
    }, // Enter an invalid predecessor
    {
      type: '2[ENTER]',
      target: function target() {
        return dependencyField.input;
      }
    }, {
      waitForSelector: '.b-toast'
    }, function (next) {
      t.selectorCountIs('.b-toast', 1, 'Only 1 toast appears');
      next();
    }, {
      waitForSelectorNotFound: '.b-toast'
    }, // After the toast has been and gone, task1 should have no predecessors
    function (next) {
      t.is(task1.predecessors.length, 0, 'No predecessors added');
      next();
    }, // Open the predecessors dropdown
    {
      type: '[DOWN]',
      target: function target() {
        return dependencyField.input;
      }
    }, // Pick predecessor from dropdown
    {
      click: '.b-list-item.task3 .b-to'
    }, // TAB off to trigger update
    {
      type: '[TAB]',
      target: function target() {
        return dependencyField.input;
      }
    }, // Dependency should be there
    function (next) {
      t.is(task1.predecessors.length, 1, 'Predecessor added');
      t.is(task1.predecessors[0].fromEvent, task3, 'Predecessor is ok');
      t.is(predecessorsCell.textContent, '3', 'Cell content is ok');
      next();
    }, // Go back
    {
      dblclick: '.task1 [data-column=predecessors]'
    }, // Open the predecessors dropdown
    {
      type: '[DOWN]',
      target: function target() {
        return dependencyField.input;
      }
    }, // Change to 3FF by toggling the "to side"
    {
      click: '.b-list-item.task3 .b-to'
    }, // TAB off to trigger update
    {
      type: '[TAB]',
      target: function target() {
        return dependencyField.input;
      }
    }, // Dependency should have changed
    function (next) {
      var task = gantt.taskStore.getById(1);
      t.is(task.predecessors.length, 1, 'Predecessor added');
      t.is(task.predecessors[0].fromEvent, gantt.taskStore.getById(3), 'Predecessor is ok');
      t.is(predecessorsCell.textContent, '3FF', 'Cell content is ok');
      next();
    });
  }); // https://github.com/bryntum/support/issues/53

  t.it('should be possible to edit values for an auto added field', function (t) {
    gantt = t.getGantt({
      columns: {
        autoAddField: true,
        data: [{
          text: 'Foo',
          field: 'foo',
          width: 250
        }, // `foo` is missing on the model
        {
          type: 'name',
          width: 200
        }]
      }
    });
    var cellEdit = gantt.features.cellEdit;
    t.chain({
      dblClick: '.b-grid-cell'
    }, {
      type: 'qwe[ENTER]',
      target: '.b-editor input'
    }, {
      waitForSelector: '.b-grid-cell:textEquals(qwe)'
    }, // cell value correct
    function (next) {
      t.is(gantt.taskStore.first.foo, 'qwe', 'Record updated correctly');
      next();
    }, {
      dblClick: '.b-grid-cell'
    }, {
      waitFor: function waitFor() {
        return cellEdit.editor.inputField.value === 'qwe';
      }
    }, // editor value correct
    {
      type: 'asd[ENTER]',
      target: '.b-editor input',
      clearExisting: true
    }, function (next) {
      t.is(gantt.taskStore.first.foo, 'asd', 'Record updated correctly');
      next();
    }, {
      waitForSelector: '.b-grid-cell:textEquals(asd)'
    }, // cell value correct
    {
      dblClick: '.b-grid-cell'
    }, {
      waitFor: function waitFor() {
        return cellEdit.editor.inputField.value === 'asd';
      }
    } // editor value correct
    );
  }); // https://github.com/bryntum/support/issues/53

  t.it('should be possible to edit values for a auto exposed field', function (t) {
    gantt = t.getGantt({
      tasks: [{
        id: 1,
        name: 'Task 1',
        foo: ''
      }],
      columns: [{
        text: 'Foo',
        field: 'foo',
        width: 250
      }, // `foo` is missing on the model
      {
        type: 'name',
        width: 200
      }]
    });
    var cellEdit = gantt.features.cellEdit;
    t.chain({
      dblClick: '.b-grid-cell'
    }, {
      type: 'qwe[ENTER]',
      target: '.b-editor input'
    }, {
      waitForSelector: '.b-grid-cell:textEquals(qwe)'
    }, // cell value correct
    function (next) {
      t.is(gantt.taskStore.first.foo, 'qwe', 'Record updated correctly');
      next();
    }, {
      dblClick: '.b-grid-cell'
    }, {
      waitFor: function waitFor() {
        return cellEdit.editor.inputField.value === 'qwe';
      }
    }, // editor value correct
    {
      type: 'asd[ENTER]',
      target: '.b-editor input',
      clearExisting: true
    }, function (next) {
      t.is(gantt.taskStore.first.foo, 'asd', 'Record updated correctly');
      next();
    }, {
      waitForSelector: '.b-grid-cell:textEquals(asd)'
    }, // cell value correct
    {
      dblClick: '.b-grid-cell'
    }, {
      waitFor: function waitFor() {
        return cellEdit.editor.inputField.value === 'asd';
      }
    } // editor value correct
    );
  }); // https://github.com/bryntum/support/issues/95

  t.it('Start date result should match what is selected in the picker when default 24/7 calendar is used', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'startdate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }, {
        type: 'enddate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }]
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-16 00:00)'
    }, {
      dblClick: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]'
    }, function (next) {
      dateField = gantt.features.cellEdit.editorContext.editor.inputField;
      t.is(dateField.input.value, '2017-01-16 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 16));
      next();
    }, {
      click: '.b-icon-calendar'
    }, {
      click: '[aria-label="January 17, 2017"]'
    }, function (next) {
      t.is(dateField.input.value, '2017-01-17 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 17));
      next();
    }, {
      type: '[ENTER]'
    }, {
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-17 00:00)'
    });
  });
  t.it('Start date result should match what is selected in the picker when business 8/5 calendar is used', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'startdate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }, {
        type: 'enddate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }],
      project: {
        calendar: 'business',
        calendarsData: [{
          id: 'business',
          name: 'Business',
          hoursPerDay: 8,
          daysPerWeek: 5,
          daysPerMonth: 20,
          intervals: [{
            recurrentStartDate: 'on Sat at 0:00',
            recurrentEndDate: 'on Mon at 0:00',
            isWorking: false
          }, {
            recurrentStartDate: 'every weekday at 12:00',
            recurrentEndDate: 'every weekday at 13:00',
            isWorking: false
          }, {
            recurrentStartDate: 'every weekday at 17:00',
            recurrentEndDate: 'every weekday at 08:00',
            isWorking: false
          }]
        }]
      }
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-16 08:00)'
    }, {
      dblClick: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]'
    }, function (next) {
      dateField = gantt.features.cellEdit.editorContext.editor.inputField;
      t.is(dateField.input.value, '2017-01-16 08:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 16, 8));
      next();
    }, {
      click: '.b-icon-calendar'
    }, {
      click: '[aria-label="January 17, 2017"]'
    }, function (next) {
      t.is(dateField.input.value, '2017-01-17 08:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 17, 8));
      next();
    }, {
      type: '[ENTER]'
    }, {
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-17 08:00)'
    });
  });
  t.it('End date result should match what is selected in the picker when default 24/7 calendar is used', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'startdate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }, {
        type: 'enddate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }]
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-26 00:00)'
    }, {
      dblClick: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]'
    }, function (next) {
      dateField = gantt.features.cellEdit.editorContext.editor.inputField;
      t.is(dateField.input.value, '2017-01-26 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 26));
      next();
    }, {
      click: '.b-icon-calendar'
    }, {
      click: '[aria-label="January 25, 2017"]'
    }, function (next) {
      t.is(dateField.input.value, '2017-01-25 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 25));
      next();
    }, {
      type: '[ENTER]'
    }, {
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-25 00:00)'
    });
  });
  t.it('End date result should match what is selected in the picker when business 8/5 calendar is used', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'startdate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }, {
        type: 'enddate',
        width: 250,
        format: 'YYYY-MM-DD HH:mm'
      }],
      project: {
        calendar: 'business',
        calendarsData: [{
          id: 'business',
          name: 'Business',
          hoursPerDay: 8,
          daysPerWeek: 5,
          daysPerMonth: 20,
          intervals: [{
            recurrentStartDate: 'on Sat at 0:00',
            recurrentEndDate: 'on Mon at 0:00',
            isWorking: false
          }, {
            recurrentStartDate: 'every weekday at 12:00',
            recurrentEndDate: 'every weekday at 13:00',
            isWorking: false
          }, {
            recurrentStartDate: 'every weekday at 17:00',
            recurrentEndDate: 'every weekday at 08:00',
            isWorking: false
          }]
        }]
      }
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-27 17:00)'
    }, {
      dblClick: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]'
    }, function (next) {
      dateField = gantt.features.cellEdit.editorContext.editor.inputField;
      t.is(dateField.input.value, '2017-01-27 17:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 27, 17));
      next();
    }, {
      click: '.b-icon-calendar'
    }, {
      click: '[aria-label="January 26, 2017"]'
    }, function (next) {
      t.is(dateField.input.value, '2017-01-26 17:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 26, 17));
      next();
    }, {
      type: '[ENTER]'
    }, {
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-26 17:00)'
    });
  }); // https://github.com/bryntum/support/issues/1093

  t.it('Cell date editor should respect weekStartDay config', function (t) {
    gantt = t.getGantt({
      columns: [{
        type: 'startdate'
      }, {
        type: 'enddate'
      }],
      weekStartDay: 1
    });
    t.chain({
      doubleClick: '.b-grid-row[data-id="11"] .b-grid-cell[data-column="startDate"]'
    }, {
      click: '.b-pickerfield .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'Week starts with correct day'
    }, {
      doubleClick: '.b-grid-row[data-id="11"] .b-grid-cell[data-column="endDate"]'
    }, {
      click: '.b-pickerfield .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'Week starts with correct day'
    });
  });
  t.it('Cell date editor should respect DateHelper.weekStartDay config', function (t) {
    gantt = t.getGantt({
      columns: [{
        type: 'startdate'
      }, {
        type: 'enddate'
      }]
    });
    t.chain({
      doubleClick: '.b-grid-row[data-id="11"] .b-grid-cell[data-column="startDate"]'
    }, {
      click: '.b-pickerfield .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'Week starts with correct day'
    }, {
      doubleClick: '.b-grid-row[data-id="11"] .b-grid-cell[data-column="endDate"]'
    }, {
      click: '.b-pickerfield .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'Week starts with correct day'
    });
  });
});