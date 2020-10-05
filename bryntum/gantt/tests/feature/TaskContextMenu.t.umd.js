function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

StartTest(function (t) {
  var gantt;
  Object.assign(window, {
    Gantt: Gantt
  });
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Basic context menu works', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false,
        taskContextMenu: {
          items: {
            moveLeft: {
              text: 'Move left',
              icon: 'b-fa b-fa-fw b-fa-arrow-left',
              cls: 'b-separator b-move-left',
              onItem: function onItem(_ref) {
                var taskRecord = _ref.taskRecord;
                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, -1, 'day'));
              }
            },
            moveRight: {
              text: 'Move right',
              icon: 'b-fa b-fa-fw b-fa-arrow-right',
              cls: 'b-move-right',
              onItem: function onItem(_ref2) {
                var taskRecord = _ref2.taskRecord;
                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, 1, 'day'));
              }
            }
          }
        }
      }
    });
    var targetTask = gantt.taskStore.getById(11);
    t.firesOk({
      observable: gantt,
      events: {
        taskcontextmenubeforeshow: 6,
        taskcontextmenushow: 5,
        taskcontextmenuitem: 5
      }
    });
    gantt.on({
      taskcontextmenubeforeshow: function taskcontextmenubeforeshow() {
        return false;
      },
      once: true
    });
    var listeners = {
      taskcontextmenubeforeshow: function taskcontextmenubeforeshow(_ref3) {
        var source = _ref3.source,
            items = _ref3.items,
            taskRecord = _ref3.taskRecord;
        t.describe('Assert taskcontextmenubeforeshow event', function (t) {
          t.is(source, gantt, 'Source is ok'); // We should see
          // Edit
          // Add...
          // Indent
          // Outdent
          // Delete task
          // Move left
          // Move right

          t.is(ObjectHelper.getTruthyKeys(items).length, 7, '7 menu items');
          t.is(taskRecord, taskRecord, 'Target task is ok');
        });
      },
      taskcontextmenushow: function taskcontextmenushow(_ref4) {
        var source = _ref4.source,
            taskRecord = _ref4.taskRecord,
            taskElement = _ref4.taskElement;
        t.describe('Assert taskcontextmenushow event', function (t) {
          t.is(source, gantt, 'Source is ok');
          t.is(taskRecord, targetTask, 'Target task is ok');
          t.is(taskElement, gantt.getElementFromTaskRecord(targetTask).parentElement, 'Element is ok');
        });
      },
      taskcontextmenuitem: function taskcontextmenuitem(_ref5) {
        var source = _ref5.source,
            item = _ref5.item,
            taskRecord = _ref5.taskRecord;
        t.describe('Assert taskcontextmenuitem event', function (t) {
          t.is(source, gantt, 'Source is ok');
          t.is(item.text, 'Move right', 'Item is ok');
          t.is(taskRecord, targetTask, 'Target task is ok');
        });
      },
      once: true
    };
    var task;
    t.chain({
      contextmenu: '.b-gantt-task.id11',
      desc: 'First menu is cancelled'
    }, function (next) {
      gantt.on(listeners);
      next();
    }, {
      contextmenu: '.b-gantt-task.id11',
      desc: 'Move one day right'
    }, {
      click: '.b-move-right'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.is(targetTask.startDate, new Date(2017, 0, 17), 'Start date moved');
      next();
    }, {
      contextmenu: '.b-gantt-task.id11',
      desc: 'Move one day left'
    }, {
      click: '.b-move-left'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.is(targetTask.startDate, new Date(2017, 0, 16), 'Start date moved');
      next();
    }, {
      contextmenu: '.b-gantt-task.id11'
    }, {
      moveMouseTo: '.b-icon-add',
      offset: [130, 0]
    }, {
      click: '.b-icon-up',
      desc: 'Add task above'
    }, function (next) {
      task = gantt.taskStore.changes.added[0];
      task.cls = 'task1';
      next();
    }, {
      contextmenu: '.b-gantt-task.task1'
    }, {
      moveMouseTo: '.b-icon-add',
      offset: [130, 0]
    }, {
      click: '.b-icon-down'
    }, function (next) {
      var _gantt$taskStore$chan = _slicedToArray(gantt.taskStore.changes.added, 2),
          task1 = _gantt$taskStore$chan[0],
          task2 = _gantt$taskStore$chan[1];

      t.is(task1.startDate, targetTask.startDate, 'New task 1 start date is ok');
      t.is(task2.startDate, targetTask.startDate, 'New task 2 start date is ok');
      next();
    }, {
      contextmenu: '.b-gantt-task.task1'
    }, {
      click: '.b-icon-edit'
    }, {
      waitForSelector: '.b-contains-focus input'
    }, {
      type: 'foo[ENTER]'
    }, function (next) {
      t.is(task.name, 'New task 1foo', 'Task name is ok');
      next();
    });
  });
  t.it('Should be possible to trigger menu using API', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false,
        taskContextMenu: true
      }
    });

    var menu = gantt.features.taskContextMenu,
        getTask = function getTask(id) {
      return gantt.taskStore.getById(id);
    };

    gantt.collapse(getTask(23));
    t.chain({
      waitForSelector: '.b-gantt-task'
    }, function (next) {
      var task = getTask(12);
      menu.showContextMenuFor(task);
      t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
      task = getTask(231);
      menu.showContextMenuFor(task);
      t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
      task = getTask(21);
      t.waitForEvent(gantt, 'taskcontextmenushow', next);
      menu.showContextMenuFor(task);
    }, function (next) {
      t.selectorCountIs('.b-menu', 1, 'Task context menu appears');
      var taskBox = gantt.getElementFromTaskRecord(getTask(21)).getBoundingClientRect(),
          menuBox = document.querySelector('.b-menu').getBoundingClientRect();
      t.ok(taskBox.left < menuBox.left && taskBox.right > menuBox.left, 'Menu is aligned horizontally');
      t.ok(taskBox.top < menuBox.top && taskBox.bottom > menuBox.top, 'Menu is aligned vertically');
      next();
    });
  });
  t.it('Context menu should match for locked and normal region (when context menu features is enabled after)', function (t) {
    function getGantt(features) {
      return new Gantt({
        appendTo: document.body,
        startDate: new Date(2020, 1, 17),
        width: 600,
        height: 400,
        features: Object.assign({
          filter: true
        }, features),
        tasks: [{
          id: 1,
          name: 'Task 1',
          expanded: true,
          children: [{
            id: 11,
            name: 'Task 11',
            startDate: '2020-02-17',
            duration: 5
          }]
        }]
      });
    }

    var expectedItems;
    var steps = [function () {
      return gantt.project.waitForPropagateCompleted();
    }, {
      contextmenu: '.b-gantt-task-wrap[data-task-id="11"]'
    }, {
      waitForSelector: '.b-menu'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              expectedItems = Array.from(document.querySelectorAll('.b-menuitem')).map(function (el) {
                return el.dataset.ref;
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      contextmenu: '.b-grid-row[data-id="11"]'
    }, {
      waitForSelector: '.b-menu'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var items;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              items = Array.from(document.querySelectorAll('.b-menuitem')).map(function (el) {
                return el.dataset.ref;
              });
              t.isDeeply(items.slice(0, items.length - 1), expectedItems, 'Context menu items match');

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))];
    t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              t.diag('Context menu enabled before task context menu');
              gantt = getGantt({
                contextMenu: true,
                taskContextMenu: true
              });

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), steps, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              gantt.destroy();
              t.diag('Context menu enabled after task context menu');
              gantt = getGantt({
                taskContextMenu: true,
                contextMenu: true
              });

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })), steps);
  });
  t.it('Should be possible to disable Task Edit feature and use Task Context menu', function (t) {
    gantt = t.getGantt({
      features: {
        taskEdit: false,
        taskContextMenu: true
      }
    });
    t.chain({
      rightclick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-menu',
      desc: 'Menu is visible'
    }, {
      waitForSelectorNotFound: '.b-menuitem[data-ref="editTask"]',
      desc: 'Edit menu item is not in the menu'
    });
  }); // https://github.com/bryntum/support/issues/1056

  t.it('Should be possible to disable Task Context menu for a specific column', function (t) {
    gantt = t.getGantt({
      features: {
        taskContextMenu: true
      },
      columns: [{
        type: 'name',
        width: 250
      }, {
        type: 'startdate',
        enableCellContextMenu: false
      }]
    });
    t.chain({
      rightclick: '.b-grid-cell[data-column="name"]'
    }, {
      waitForSelector: '.b-menu',
      desc: 'Menu is visible'
    }, {
      rightclick: '.b-grid-cell[data-column="startDate"]'
    }, {
      waitForSelectorNotFound: '.b-menu',
      desc: 'Menu is not visible'
    });
  });
  t.it('Should open context menu on row border', function (t) {
    gantt = t.getGantt({
      features: {
        taskEdit: false,
        taskContextMenu: true
      }
    });
    t.chain({
      rightClick: '.b-grid-row.id11',
      offset: ['50%', '100%']
    }, {
      waitFor: 500,
      desc: 'No exception is thrown during timeout'
    });
  });
});