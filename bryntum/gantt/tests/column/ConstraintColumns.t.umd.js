function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function (t) {
    gantt && !gantt.isDestroyed && gantt.destroy();
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: 'constraintdate'
      }, {
        type: 'constrainttype'
      }],
      tasks: [{
        id: 1,
        cls: 'id1',
        name: 'Project Nodlehs',
        expanded: true,
        constraintDate: '2017-01-18',
        constraintType: 'muststarton',
        children: [{
          id: 11,
          cls: 'id11',
          startDate: '2017-01-16',
          endDate: '2017-01-18',
          name: 'Organize manpower',
          constraintDate: '2017-01-16',
          constraintType: 'startnoearlierthan',
          leaf: true
        }, {
          id: 12,
          startDate: '2017-01-16',
          endDate: '2017-01-18',
          name: 'Figure out name',
          constraintDate: '2017-01-16',
          constraintType: 'startnoearlierthan',
          leaf: true
        }]
      }]
    });
  });
  t.it('Should use Gantt#displayDateFormat if configured with `null`', function (t) {
    gantt && gantt.destroy();
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: 'constraintdate',
        format: null
      }, {
        type: 'constrainttype'
      }],
      tasks: [{
        id: 1,
        cls: 'id1',
        name: 'Project Nodlehs',
        expanded: true,
        constraintDate: '2017-01-18',
        constraintType: 'muststarton',
        children: [{
          id: 11,
          cls: 'id11',
          startDate: '2017-01-16',
          endDate: '2017-01-18',
          name: 'Organize manpower',
          constraintDate: '2017-01-16',
          constraintType: 'startnoearlierthan',
          leaf: true
        }, {
          id: 12,
          startDate: '2017-01-16',
          endDate: '2017-01-18',
          name: 'Figure out name',
          constraintDate: '2017-01-16',
          constraintType: 'startnoearlierthan',
          leaf: true
        }]
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      var date = gantt.getFormattedDate(gantt.taskStore.getById(11).constraintDate);
      t.selectorExists(".id11 [data-column=constraintDate]:textEquals(".concat(date, ")"), 'Constraint date rendered correctly');
    });
  });
  t.it('Should use column format', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      var dateStr = DateHelper.format(gantt.taskStore.getById(11).constraintDate, gantt.columns.getAt(1).format);
      t.selectorExists(".id11 [data-column=constraintDate]:textEquals(".concat(dateStr, ")"), 'Constraint date rendered correctly');
    });
  });
  t.it('Should update when Gantt#displayDateFormat changes', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      gantt.columns.getAt(1).format = 'L';
      var dateStr = DateHelper.format(gantt.taskStore.getById(11).constraintDate, gantt.columns.getAt(1).format);
      t.selectorExists(".id11 [data-column=constraintDate]:textEquals(".concat(dateStr, ")"), 'Constraint date rendered correctly');
    });
  });
  t.it('Should be able to specify explicit format', function (t) {
    t.chain({
      waitForRowsVisible: gantt
    }, function () {
      gantt.columns.get('constraintDate').format = 'YYYY';
      var yyyy = gantt.taskStore.getById(11).constraintDate.getFullYear();
      t.selectorExists(".id11 [data-column=constraintDate]:textEquals(".concat(yyyy, ")"), 'Constraint date rendered correctly');
    });
  });
  t.it('Should be able to change constraint type/date', function (t) {
    var firstTask = gantt.taskStore.first,
        lastTask = gantt.taskStore.last;
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      waitForRowsVisible: gantt
    }, function (next) {
      t.notOk(firstTask.constraintType, 'Incorrect constraint type removed');
      next();
    }, {
      diag: 'Change constraint type to SNET'
    }, {
      dblclick: '.id1 [data-column=constraintType]',
      desc: 'Constraint type column dbl-clicked'
    }, {
      type: 's[ENTER][ENTER]',
      desc: 'Typed "s" to pick start no earlier than'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), function (next) {
      t.is(firstTask.constraintDate, new Date(2017, 0, 16), 'First task constraint date is ok');
      t.is(firstTask.startDate, new Date(2017, 0, 16), 'First task start is ok');
      t.is(lastTask.startDate, new Date(2017, 0, 16), 'Last task start is ok');
      next();
    }, {
      diag: 'Move constraint date further'
    }, {
      dblclick: '.id1 [data-column=constraintDate]',
      desc: 'Constraint type column dbl-clicked'
    }, {
      type: 'Jan 19, 2017[ENTER]',
      desc: 'Typed "Jan 19, 2017"'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), function (next) {
      t.is(firstTask.constraintDate, new Date(2017, 0, 19), 'First task constraint date is ok');
      t.is(firstTask.startDate, new Date(2017, 0, 19), 'First task start is ok');
      t.is(lastTask.startDate, new Date(2017, 0, 19), 'Last task start is ok');
      next();
    }, {
      dblclick: '.id1 [data-column=constraintDate]',
      desc: 'Move constraint date back'
    }, {
      type: 'Jan 16, 2017[ENTER]'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })), function (next) {
      t.is(firstTask.constraintDate, firstTask.startDate, 'First task start is ok');
      t.is(firstTask.constraintDate, lastTask.startDate, 'Last task start is ok');
      next();
    });
  });
  t.it('Constraint type column should filter picker values for parents/leafs', function (t) {
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })), {
      dblclick: '.id1 [data-column=constraintType]',
      desc: 'Edit parent'
    }, {
      type: '[DOWN]'
    }, function (next) {
      t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
      next();
    }, {
      type: '[ESC]'
    }, {
      dblclick: '.id11 [data-column=constraintType]',
      desc: 'Edit leaf'
    }, {
      type: '[DOWN]'
    }, function (next) {
      t.selectorCountIs('.b-list-item:textEquals(Must start on)', 1, 'MSO constraint are available');
      next();
    }, {
      type: '[ESC]'
    }, {
      dblclick: '.id1 [data-column=constraintType]',
      desc: 'Edit parent again'
    }, {
      type: '[DOWN]'
    }, function (next) {
      t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
      next();
    }, {
      type: '[ESC]'
    });
  });
  t.it('ConstraintType column should be clearable by selecting the "None" list item', function (t) {
    var cellEditFeature = gantt.features.cellEdit,
        firstTask = gantt.taskStore.first,
        secondTask = gantt.taskStore.getAt(1);
    var constraintTypeCell, constraintTypeField, constraintRecord;
    t.chain({
      waitForRowsVisible: gantt
    }, {
      dblclick: function dblclick() {
        return constraintTypeCell = document.querySelector('.b-grid-cell[data-column=constraintType]');
      }
    }, {
      waitFor: function waitFor() {
        if (cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus) {
          constraintTypeField = cellEditFeature.editorContext.editor.inputField;
          constraintRecord = constraintTypeField.store.getAt(1);
          return true;
        }
      }
    }, // Expand the constraint type picker
    {
      click: function click() {
        return constraintTypeField.triggers.expand.element;
      }
    }, // Select list item 1
    {
      click: function click() {
        return constraintTypeField.picker.getItem(1);
      }
    }, {
      type: '[ENTER]'
    }, // Wait for navigation down
    {
      waitFor: function waitFor() {
        return cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === secondTask;
      }
    }, function (next) {
      // Cell must contain the textual description of the constraint
      t.is(constraintTypeCell.innerText, constraintRecord[constraintTypeField.displayField]);
      next();
    }, // Go back up to the modified cell and clear it by using the "None" dropdown item.
    {
      type: '[ENTER]',
      options: {
        shiftKey: true
      }
    }, // Wait for navigation back up
    {
      waitFor: function waitFor() {
        return cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === firstTask;
      }
    }, {
      click: function click() {
        return constraintTypeField.triggers.expand.element;
      }
    }, // Select the "None" item
    {
      click: function click() {
        return constraintTypeField.picker.getItem(0);
      }
    }, {
      type: '[ENTER]'
    }, function (next) {
      // Cell must be empty when no constraint is applied.
      t.is(constraintTypeCell.innerText, '');
      next();
    });
  });
  t.it('ConstraintType column should be clearable by clicking the field\'s clear trigger', function (t) {
    var cellEditFeature = gantt.features.cellEdit,
        firstTask = gantt.taskStore.first,
        secondTask = gantt.taskStore.getAt(1);
    var constraintTypeCell, constraintTypeField, constraintRecord;
    t.chain({
      waitForRowsVisible: gantt
    }, {
      dblclick: function dblclick() {
        return constraintTypeCell = document.querySelector('.b-grid-cell[data-column=constraintType]');
      }
    }, {
      waitFor: function waitFor() {
        if (cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus) {
          constraintTypeField = cellEditFeature.editorContext.editor.inputField;
          constraintRecord = constraintTypeField.store.getAt(1);
          return true;
        }
      }
    }, // Expand the constraint type picker
    {
      click: function click() {
        return constraintTypeField.triggers.expand.element;
      }
    }, // Select list item 1
    {
      click: function click() {
        return constraintTypeField.picker.getItem(1);
      }
    }, {
      type: '[ENTER]'
    }, // Wait for navigation down
    {
      waitFor: function waitFor() {
        return cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === secondTask;
      }
    }, function (next) {
      // Cell must contain the textual description of the constraint
      t.is(constraintTypeCell.innerText, constraintRecord[constraintTypeField.displayField]);
      next();
    }, // Go back up to the modified cell and clear it by using the "None" dropdown item.
    {
      type: '[ENTER]',
      options: {
        shiftKey: true
      }
    }, // Wait for navigation back up
    {
      waitFor: function waitFor() {
        return cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === firstTask;
      }
    }, // Clear the field using the clear trigger
    {
      click: function click() {
        return constraintTypeField.triggers.clear.element;
      }
    }, {
      type: '[ENTER]'
    }, function (next) {
      // Cell must be empty when no constraint is applied.
      t.is(constraintTypeCell.innerText, '');
      next();
    });
  });
});