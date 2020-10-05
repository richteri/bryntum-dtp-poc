function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  Object.assign(window, {
    // The test harness needs this so that it can mock URLs for testing purposes.
    AjaxHelper: AjaxHelper
  });
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should show task editor when double clicking task', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    var investigate = gantt.taskStore.getAt(2);
    var oldWidth;
    t.chain({
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-taskeditor'
    }, function (next) {
      var oldEl = gantt.getElementFromTaskRecord(investigate);
      oldWidth = oldEl.offsetWidth;
      t.is(document.querySelector('.b-name input').value, gantt.taskStore.getById(11).name, 'Correct name');
      next();
    }, {
      click: function click() {
        return gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton;
      }
    }, {
      click: function click() {
        return gantt.features.taskEdit.editor.widgetMap.saveButton.element;
      }
    }, {
      waitFor: function waitFor() {
        return gantt.getElementFromTaskRecord(investigate).offsetWidth > oldWidth;
      }
    }, {
      waitForSelectorNotFound: '.b-taskeditor'
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/9416-adding-a-resource-in-the-taskeditor--then-clicking-save-throws-an-error-/

  t.it('Should not throw error when adding resource to "from" side of new dependency.', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      resources: t.getResourceStoreData()
    });
    t.livesOk(function () {
      t.chain({
        moveMouseTo: '[data-task-id="231"]'
      }, {
        moveMouseTo: '.b-sch-terminal-right'
      }, {
        drag: '[data-task-id="231"] .b-sch-terminal-right',
        to: '[data-task-id="232"]',
        dragOnly: true
      }, {
        moveMouseTo: '[data-task-id="232"] .b-sch-terminal-left'
      }, {
        mouseup: null
      }, {
        dblclick: '[data-task-id="232"]'
      }, {
        waitForSelector: '.b-taskeditor'
      }, {
        click: '.b-tabpanel-tab-title:contains(Resources)'
      }, {
        click: '.b-resourcestab .b-add-button'
      }, {
        click: '.b-grid .b-cell-editor'
      }, {
        click: '.b-list-item[data-index="0"]'
      }, {
        click: '.b-button:contains(Save)'
      }, {
        waitForPropagate: gantt.project
      }, {
        dblclick: '[data-task-id="231"]'
      }, {
        waitForSelector: '.b-taskeditor'
      }, {
        click: '.b-tabpanel-tab-title:contains(Resources)'
      }, {
        click: '.b-resourcestab .b-add-button'
      }, {
        click: '.b-grid .b-cell-editor'
      }, {
        click: '.b-list-item[data-index="0"]'
      }, {
        click: '.b-button:contains(Save)'
      }, {
        waitForPropagate: gantt.project
      });
    });
  });
  t.describe('Advanced form works ok', function (t) {
    t.it('Should be able to modify rollup field', function (t) {
      gantt = t.getGantt({
        features: {
          taskTooltip: false
        }
      });
      t.chain({
        dblClick: '[data-task-id="11"]'
      }, {
        click: '.b-tabpanel-tab-title:contains(Advanced)'
      }, function (next) {
        var rollupField = gantt.features.taskEdit.editor.widgetMap.rollupField;
        t.notOk(rollupField.checked, 'Field not checked');
        t.notOk(gantt.taskStore.getById(11).rollup, 'Data field false');
        next();
      }, {
        click: '[data-ref=rollupField] label'
      }, function () {
        t.ok(gantt.taskStore.getById(11).rollup, 'Data field true');
      });
    });
    t.it('Should set constraints', function (t) {
      gantt = t.getGantt({
        columns: [{
          type: 'name',
          width: 200
        }, {
          type: 'constrainttype',
          width: 100
        }, {
          type: 'constraintdate',
          width: 100
        }],
        subGridConfigs: {
          locked: {
            width: 400
          }
        },
        features: {
          taskTooltip: false
        }
      });
      var project = gantt.project;
      var task = gantt.taskStore.getById(13);
      t.chain({
        waitForPropagate: project
      }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                task.constraintType = 'muststarton';
                task.constraintDate = task.startDate;
                return _context.abrupt("return", project.propagate());

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })), {
        dblclick: '.id13.b-gantt-task',
        desc: 'Edit task with constraint'
      }, {
        click: '.b-tabpanel-tab-title:contains(Advanced)'
      }, function (next) {
        t.hasValue('[name=constraintType]', 'Must start on', 'Constraint type value is ok');
        t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');
        next();
      }, {
        click: '[name=constraintDate]'
      }, {
        type: '[DOWN][LEFT][ENTER]'
      }, function (next) {
        document.querySelector('[name=constraintType]').value = '';
        next();
      }, {
        click: '[name=constraintType]'
      }, {
        type: 's[ENTER]'
      }, {
        click: 'button:contains(Save)'
      }, {
        waitForPropagate: gantt.project
      }, function (next) {
        t.is(task.constraintType, 'startnoearlierthan', 'Constraint type is ok');
        t.is(task.constraintDate, task.startDate, 'Constraint date is ok');
        next();
      }, {
        dblclick: '.id13.b-gantt-task',
        desc: 'Edit task with constraint'
      }, {
        click: '.b-tabpanel-tab-title:contains(Advanced)'
      }, {
        click: '[name=constraintType]'
      }, function (next) {
        t.hasValue('[name=constraintType]', 'Start no earlier than', 'Constraint type value is ok');
        t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');
        next();
      }, {
        click: '.b-constrainttypepicker .b-icon-remove'
      }, {
        click: 'button:contains(Save)'
      }, {
        waitForPropagate: gantt.project
      }, function (next) {
        t.is(task.constraintType, null, 'Constraint type is ok'); // t.is(task.constraintDate, new Date(2017, 0, 15), 'Constraint date is ok');

        next();
      });
    });
    t.it('Should set calendars', function (t) {
      gantt = t.getGantt({
        columns: [{
          type: 'name',
          width: 200
        }, {
          type: 'calendar',
          width: 100
        }],
        subGridConfigs: {
          locked: {
            width: 300
          }
        },
        features: {
          taskTooltip: false
        }
      });
      var project = gantt.project,
          task = gantt.taskStore.getById(13),
          originalEnd = task.endDate;
      task.setCalendar('night');
      t.chain({
        waitForPropagate: project
      }, {
        dblclick: '.id13.b-gantt-task',
        desc: 'Edit task'
      }, {
        click: '.b-tabpanel-tab-title:contains(Advanced)'
      }, {
        waitForSelector: 'input[name=calendar]'
      }, function (next) {
        t.hasValue('input[name=calendar]', 'Night shift', 'Calendar value is ok');
        next();
      }, {
        click: '[name=calendar]'
      }, {
        type: '[DOWN][UP][ENTER][ENTER]'
      }, {
        waitForPropagate: project
      }, function () {
        t.is(task.calendar.id, 'business', 'Calendar id is ok');
        t.notOk(task.endDate.getTime() === originalEnd.getTime(), 'Task is updated');
        t.contentLike('.id13 [data-column=calendar]', 'Business', 'Column cell value is ok');
      });
    });
  });
  t.it('Should disable certain fields for parent tasks', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      }
    });
    t.chain({
      dblClick: '[data-task-id="1"]'
    }, {
      waitForSelector: '.b-taskeditor'
    }, function () {
      var _gantt$features$taskE = gantt.features.taskEdit.editor.widgetMap,
          fullDurationField = _gantt$features$taskE.fullDurationField,
          effortField = _gantt$features$taskE.effortField,
          endDateField = _gantt$features$taskE.endDateField,
          percentDoneField = _gantt$features$taskE.percentDoneField;
      t.ok(fullDurationField.disabled, 'Duration disabled');
      t.ok(effortField.disabled, 'Effort disabled');
      t.ok(endDateField.disabled, 'Finish disabled');
      t.ok(percentDoneField.disabled, 'Percent done disabled');
    });
  });
  t.it('Should preserve scroll when cancelling changes', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var config, project, task, scroll;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return ProjectGenerator.generateAsync(100, 30, function () {});

            case 2:
              config = _context3.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              task = gantt.taskStore.getAt(gantt.taskStore.count - 1);
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-task'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        return _context2.abrupt("return", gantt.scrollTaskIntoView(task));

                      case 1:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              })), {
                dblclick: function dblclick() {
                  return gantt.getElementFromTaskRecord(task);
                }
              }, {
                waitForSelector: '.b-taskeditor'
              }, {
                click: function click() {
                  return gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton;
                }
              }, function (next) {
                scroll = gantt.scrollTop;
                var detacher = gantt.on({
                  renderTask: function renderTask(_ref4) {
                    var taskRecord = _ref4.taskRecord;

                    if (taskRecord === task) {
                      detacher();
                      next();
                    }
                  }
                });
                t.click('.b-popup-close');
              }, function () {
                t.is(gantt.scrollTop, scroll, 'Scroll is intact');
              });

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should be able to show editor programmatically', /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context5.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              t.chain({
                waitForPropagate: gantt
              }, {
                waitForSelector: '.b-gantt-task'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        return _context4.abrupt("return", gantt.editTask(gantt.taskStore.rootNode.firstChild));

                      case 1:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              })), {
                waitForSelector: '.b-gantt-taskeditor'
              });

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x2) {
      return _ref5.apply(this, arguments);
    };
  }());
  t.it('Should fire events upon show', /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context6.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context6.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskEdit');
              t.firesOnce(gantt, 'beforeTaskEditShow');
              _context6.next = 11;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x3) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should be possible to cancel show', /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context7.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context7.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskEdit');
              t.wontFire(gantt, 'beforeTaskEditShow');
              gantt.on('beforeTaskEdit', function () {
                return false;
              });
              _context7.next = 12;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 12:
              t.selectorNotExists('.b-gantt-taskeditor', 'No editor in DOM');

            case 13:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x4) {
      return _ref8.apply(this, arguments);
    };
  }());
  t.it('Should fire events upon save', /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context8.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context8.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskSave');
              _context8.next = 10;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 10:
              _context8.next = 12;
              return gantt.features.taskEdit.save();

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x5) {
      return _ref9.apply(this, arguments);
    };
  }());
  t.it('Should be possible to cancel save', /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context9.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context9.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskSave');
              t.wontFire(gantt.taskEdit.getEditor(), 'hide');
              gantt.on('beforeTaskSave', function () {
                return false;
              });
              _context9.next = 12;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 12:
              _context9.next = 14;
              return gantt.features.taskEdit.save();

            case 14:
              t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');

            case 15:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x6) {
      return _ref10.apply(this, arguments);
    };
  }());
  t.it('Should fire events upon delete', /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context10.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context10.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskDelete');
              _context10.next = 10;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 10:
              _context10.next = 12;
              return gantt.features.taskEdit.delete();

            case 12:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x7) {
      return _ref11.apply(this, arguments);
    };
  }());
  t.it('Should be possible to cancel delete', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return ProjectGenerator.generateAsync(1, 30, function () {});

            case 2:
              config = _context11.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context11.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              t.firesOnce(gantt, 'beforeTaskDelete');
              t.wontFire(gantt.taskEdit.getEditor(), 'hide');
              gantt.on('beforeTaskDelete', function () {
                return false;
              });
              _context11.next = 12;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 12:
              _context11.next = 14;
              return gantt.features.taskEdit.delete();

            case 14:
              t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');

            case 15:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x8) {
      return _ref12.apply(this, arguments);
    };
  }());
  t.it('Should fire events with correct params', /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(t) {
      var config, project, task;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return ProjectGenerator.generateAsync(1, 1, function () {});

            case 2:
              config = _context12.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project
              });
              _context12.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              task = gantt.taskStore.getById(3);
              t.firesOnce(gantt, 'beforeTaskEdit');
              gantt.on('beforeTaskEdit', function (event) {
                t.is(event.source, gantt, 'gantt');
                t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
                t.is(event.taskRecord, task, 'taskRecord');
                t.isInstanceOf(event.taskElement, HTMLElement, 'element');
              });
              t.firesOnce(gantt, 'beforeTaskEditShow');
              gantt.on('beforeTaskEditShow', function (event) {
                t.is(event.source, gantt, 'gantt');
                t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
                t.is(event.taskRecord, task, 'taskRecord');
                t.isInstanceOf(event.taskElement, HTMLElement, 'element');
                t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
              });
              t.firesOnce(gantt, 'beforeTaskSave');
              gantt.on('beforeTaskSave', function (event) {
                t.is(event.source, gantt, 'gantt');
                t.is(event.taskRecord, task, 'taskRecord');
                t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
              });
              t.firesOnce(gantt, 'beforeTaskDelete');
              gantt.on('beforeTaskDelete', function (event) {
                t.is(event.source, gantt, 'gantt');
                t.is(event.taskRecord, task, 'taskRecord');
                t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
              });
              gantt.on('beforeTaskSave', function () {
                return false;
              });
              gantt.on('beforeTaskDelete', function () {
                return false;
              });
              _context12.next = 20;
              return gantt.editTask(task);

            case 20:
              _context12.next = 22;
              return gantt.features.taskEdit.save();

            case 22:
              _context12.next = 24;
              return gantt.features.taskEdit.delete();

            case 24:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x9) {
      return _ref13.apply(this, arguments);
    };
  }());
  t.it('Should be possible to hide delete button', /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(t) {
      var config, project;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return ProjectGenerator.generateAsync(1, 1, function () {});

            case 2:
              config = _context13.sent;
              project = t.getProject(config);
              gantt = t.getGantt({
                startDate: config.startDate,
                endDate: config.endDate,
                project: project,
                features: {
                  taskEdit: {
                    showDeleteButton: false
                  }
                }
              });
              _context13.next = 7;
              return project.waitForPropagateCompleted();

            case 7:
              _context13.next = 9;
              return gantt.editTask(gantt.taskStore.getById(3));

            case 9:
              t.selectorExists('.b-gantt-taskeditor button', 'Some button found');
              t.selectorNotExists('.b-gantt-taskeditor button:textEquals(Delete)', 'No delete button');

            case 11:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x10) {
      return _ref14.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/9108

  t.it('Should not report isEditing if a listener cancels the editing', /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(t) {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              gantt = t.getGantt();
              _context14.next = 3;
              return gantt.project.waitForPropagateCompleted();

            case 3:
              t.notOk(gantt.features.taskEdit.isEditing, 'Task edit not editing initially');
              gantt.on('beforeTaskEdit', function () {
                return false;
              });
              _context14.next = 7;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 7:
              t.notOk(gantt.features.taskEdit.isEditing, 'Task edit not editing');

            case 8:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x11) {
      return _ref15.apply(this, arguments);
    };
  }()); // https://app.assembla.com/spaces/bryntum/tickets/8276

  t.it('Should support editing an unscheduled task', /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(t) {
      var added;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              gantt = t.getGantt();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New task'
              }); // run propagation to calculate new task fields

              _context15.next = 4;
              return gantt.project.propagate();

            case 4:
              _context15.next = 6;
              return gantt.editTask(added);

            case 6:
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              });

            case 7:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x12) {
      return _ref16.apply(this, arguments);
    };
  }());
  t.it('Should not allow to set end before start date', function (t) {
    gantt = t.getGantt({
      project: t.getProject({
        calendar: 'general'
      })
    });
    var task = gantt.taskStore.getById(234);
    t.chain({
      dblclick: '.b-gantt-task.id234'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date changed, duration is 0'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date intact, duration is 0'
    }, {
      type: '[DOWN][TOP][ENTER]'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date intact, duration is 0'
    }, {
      click: '.b-end-date .b-icon-angle-right'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 10).getTime() && task.duration === 1;
      },
      desc: 'End date chaged, duration is 1'
    });
  }); // https://github.com/bryntum/support/issues/95

  t.it('Start date result should match what is selected in the picker when default 24/7 calendar is used', function (t) {
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
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
      listeners: {
        beforeTaskEditShow: function beforeTaskEditShow(_ref17) {
          var editor = _ref17.editor;
          editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
          editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
        }
      }
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-16 00:00)'
    }, {
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-gantt-taskeditor .b-start-date'
    }, function (next) {
      dateField = gantt.features.taskEdit.editor.widgetMap.startDateField;
      t.is(dateField.input.value, '2017-01-16 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 16));
      next();
    }, {
      click: '.b-gantt-taskeditor .b-start-date .b-icon-calendar'
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
      features: {
        taskTooltip: false
      },
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
      listeners: {
        beforeTaskEditShow: function beforeTaskEditShow(_ref18) {
          var editor = _ref18.editor;
          editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
          editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
        }
      },
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
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-gantt-taskeditor .b-start-date'
    }, function (next) {
      dateField = gantt.features.taskEdit.editor.widgetMap.startDateField;
      t.is(dateField.input.value, '2017-01-16 08:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 16, 8));
      next();
    }, {
      click: '.b-gantt-taskeditor .b-start-date .b-icon-calendar'
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
      features: {
        taskTooltip: false
      },
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
      listeners: {
        beforeTaskEditShow: function beforeTaskEditShow(_ref19) {
          var editor = _ref19.editor;
          editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
          editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
        }
      }
    });
    var dateField;
    t.chain({
      waitForSelector: '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-26 00:00)'
    }, {
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-gantt-taskeditor .b-end-date'
    }, function (next) {
      dateField = gantt.features.taskEdit.editor.widgetMap.endDateField;
      t.is(dateField.input.value, '2017-01-26 00:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 26));
      next();
    }, {
      click: '.b-gantt-taskeditor .b-end-date .b-icon-calendar'
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
      features: {
        taskTooltip: false
      },
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
      listeners: {
        beforeTaskEditShow: function beforeTaskEditShow(_ref20) {
          var editor = _ref20.editor;
          editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
          editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
        }
      },
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
      dblClick: '.b-gantt-task.id11'
    }, {
      waitForSelector: '.b-gantt-taskeditor .b-end-date'
    }, function (next) {
      dateField = gantt.features.taskEdit.editor.widgetMap.endDateField;
      t.is(dateField.input.value, '2017-01-27 17:00');
      t.isDateEqual(dateField.value, new Date(2017, 0, 27, 17));
      next();
    }, {
      click: '.b-gantt-taskeditor .b-end-date .b-icon-calendar'
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
  });
  t.it('Should not close on Save click if any field is invalid', /*#__PURE__*/function () {
    var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(t) {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              gantt = t.getGantt();
              _context16.next = 3;
              return gantt.project.waitForPropagateCompleted();

            case 3:
              gantt.taskStore.rootNode.firstChild.name = ''; // invalid

              _context16.next = 6;
              return gantt.editTask(gantt.taskStore.rootNode.firstChild);

            case 6:
              gantt.features.taskEdit.save();
              t.ok(gantt.features.taskEdit.isEditing, 'Task edit still editing');

            case 8:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x13) {
      return _ref21.apply(this, arguments);
    };
  }());
  t.it('Should support disabling', function (t) {
    gantt = t.getGantt();
    gantt.features.taskEdit.disabled = true;
    t.chain({
      dblClick: '.b-gantt-task'
    }, function (next) {
      t.selectorNotExists('.b-popup', 'Editor not shown');
      gantt.features.taskEdit.disabled = false;
      next();
    }, {
      dblClick: '.b-gantt-task'
    }, function () {
      t.selectorExists('.b-popup', 'Editor shown');
    });
  });
  t.it('autoSync', function (t) {
    var syncCallCount = 0;
    t.mockUrl('test-autosync-load', function (url, params, options) {
      var body = options.body,
          requestId = body.requestId;
      return {
        responseText: JSON.stringify({
          success: true,
          revision: 1,
          requestId: requestId,
          tasks: {
            rows: t.getProjectTaskData()
          },
          calendars: {
            rows: t.getProjectCalendarsData()
          },
          dependencies: {
            rows: t.getProjectDependenciesData()
          }
        })
      };
    });
    t.mockUrl('test-autosync-update', function (url, params, options) {
      var body = options.body,
          _JSON$parse = JSON.parse(body),
          requestId = _JSON$parse.requestId,
          revision = _JSON$parse.revision,
          tasks = _JSON$parse.tasks,
          updated = tasks.updated;

      syncCallCount++;
      return {
        responseText: JSON.stringify({
          success: true,
          revision: revision + tasks.length,
          requestId: requestId,
          tasks: {
            rows: updated.map(function (t) {
              return {
                id: t.id
              };
            })
          }
        })
      };
    });
    gantt = t.getGantt({
      features: {
        taskTooltip: false
      },
      project: {
        autoSync: true,
        transport: {
          load: {
            url: 'test-autosync-load',
            paramName: 'q'
          },
          sync: {
            url: 'test-autosync-update'
          }
        }
      }
    });
    t.chain({
      drag: '[data-task-id="11"]',
      offset: ['100%-5', '50%'],
      by: [gantt.tickSize + 1, 0]
    }, // The autoSync setting worked
    {
      waitFor: function waitFor() {
        return syncCallCount === 1;
      }
    }, {
      dblClick: '[data-task-id="11"]'
    }, function (next) {
      t.selectorExists('.b-popup', 'Editor shown');
      next();
    }, function (next) {
      t.click(gantt.features.taskEdit.editor.widgetMap.endDateField.triggers.forward.element, next);
    }, // Syncing is on a timer, so wait for it to cycle
    {
      waitFor: gantt.project.autoSyncTimeout * 2
    }, function (next) {
      // That must not have synced.
      t.is(syncCallCount, 1); // Cancel editing

      t.click(gantt.features.taskEdit.editor.widgetMap.cancelButton.element, next);
    }, // Syncing is on a timer, so wait for it to cycle
    {
      waitFor: gantt.project.autoSyncTimeout * 2
    }, function (next) {
      // That must not have synced.
      t.is(syncCallCount, 1);
      next();
    }, // Try again, but clicking the Save button
    {
      dblClick: '[data-task-id="11"]'
    }, function (next) {
      t.selectorExists('.b-popup', 'Editor shown');
      next();
    }, function (next) {
      t.click(gantt.features.taskEdit.editor.widgetMap.endDateField.triggers.forward.element, next);
    }, // Syncing is on a timer, so wait for it to cycle
    {
      waitFor: gantt.project.autoSyncTimeout * 2
    }, function (next) {
      // That must not have synced.
      t.is(syncCallCount, 1); // Cancel editing

      t.click(gantt.features.taskEdit.editor.widgetMap.saveButton.element, next);
    }, // Syncing is on a timer, so wait for it to cycle
    {
      waitFor: gantt.project.autoSyncTimeout * 2
    }, function () {
      // That must have synced.
      t.is(syncCallCount, 2);
    });
  }); // https://github.com/bryntum/support/issues/132

  t.it('Should open editor for new task if double clicking other task while editor is already open', /*#__PURE__*/function () {
    var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(t) {
      var added, added2;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              gantt = t.getGantt();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New task'
              }), added2 = gantt.taskStore.rootNode.appendChild({
                name: 'Foo'
              }); // run propagation to calculate new task fields

              _context19.next = 4;
              return gantt.project.propagate();

            case 4:
              _context19.next = 6;
              return gantt.editTask(added);

            case 6:
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        return _context17.abrupt("return", gantt.editTask(added2));

                      case 1:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17);
              })), {
                waitFor: function waitFor() {
                  return document.querySelector('.b-gantt-taskeditor input[name=name]').value === 'Foo';
                }
              },
              /*#__PURE__*/
              // Also should detach from project and not listen to propagation events if hidden
              // https://github.com/bryntum/support/issues/446
              _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return gantt.features.taskEdit.save();

                      case 2:
                        added2.remove();

                      case 3:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18);
              })));

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x14) {
      return _ref22.apply(this, arguments);
    };
  }());
  t.it('Should close editor task if the edited task is removed while open', /*#__PURE__*/function () {
    var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(t) {
      var added;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              gantt = t.getGantt();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New task'
              }); // run propagation to calculate new task fields

              _context21.next = 4;
              return gantt.project.propagate();

            case 4:
              _context21.next = 6;
              return gantt.editTask(added);

            case 6:
              t.chain( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        return _context20.abrupt("return", added.remove());

                      case 1:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              })), {
                waitForSelectorNotFound: '.b-gantt-taskeditor'
              });

            case 7:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    }));

    return function (_x15) {
      return _ref25.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/156

  t.it('Should be able to edit name of unscheduled task with Save button', /*#__PURE__*/function () {
    var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(t) {
      var added;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              gantt = t.getGantt();
              gantt.taskStore.removeAll();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New'
              }); // run propagation to calculate new task fields and scroll it into view

              _context22.next = 5;
              return gantt.project.propagate();

            case 5:
              _context22.next = 7;
              return gantt.scrollTaskIntoView(added);

            case 7:
              _context22.next = 9;
              return gantt.editTask(added);

            case 9:
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              }, {
                click: 'input[name=name]'
              }, {
                type: 'foo'
              }, {
                click: '.b-button:textEquals(Save)'
              }, {
                waitForSelectorNotFound: '.b-gantt-taskeditor'
              }, function () {
                return t.is(added.name, 'Newfoo');
              });

            case 10:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    }));

    return function (_x16) {
      return _ref27.apply(this, arguments);
    };
  }()); // test for fix of https://github.com/bryntum/support/issues/166 Cannot save unscheduled task with ENTER key #166

  t.it('Should be able to edit name of unscheduled task using ENTER', /*#__PURE__*/function () {
    var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(t) {
      var added;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              gantt = t.getGantt();
              gantt.taskStore.removeAll();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New'
              }); // run propagation to calculate new task fields and scroll it into view

              _context23.next = 5;
              return gantt.project.propagate();

            case 5:
              _context23.next = 7;
              return gantt.scrollTaskIntoView(added);

            case 7:
              _context23.next = 9;
              return gantt.editTask(added);

            case 9:
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              }, {
                click: 'input[name=name]'
              }, {
                type: 'foo[ENTER]'
              }, {
                waitForSelectorNotFound: '.b-gantt-taskeditor'
              }, function () {
                return t.is(added.name, 'Newfoo');
              });

            case 10:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23);
    }));

    return function (_x17) {
      return _ref28.apply(this, arguments);
    };
  }()); // fix for https://github.com/bryntum/support/issues/155

  t.it('Task editor should be placed correctly for unscheduled task', /*#__PURE__*/function () {
    var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(t) {
      var addedTask;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              gantt = t.getGantt();
              _context26.next = 3;
              return gantt.project.propagate();

            case 3:
              t.chain({
                dblClick: '.b-gantt-task.id1000'
              }, {
                waitForSelector: '.b-taskeditor'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
                var editRect, taskRect;
                return regeneratorRuntime.wrap(function _callee24$(_context24) {
                  while (1) {
                    switch (_context24.prev = _context24.next) {
                      case 0:
                        // TaskEditor should be centered and aligned to task bottom
                        editRect = t.rect('.b-gantt-taskeditor'), taskRect = t.rect('.b-gantt-task');
                        t.isApprox(editRect.left, taskRect.left - (editRect.width - taskRect.width) / 2, 1, 'Correct left position');
                        t.isApprox(editRect.top, taskRect.bottom, 3, 'Correct left position');

                      case 3:
                      case "end":
                        return _context24.stop();
                    }
                  }
                }, _callee24);
              })), {
                type: '[ESC]'
              }, {
                waitForSelectorNotFound: '.b-gantt-taskeditor'
              }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
                return regeneratorRuntime.wrap(function _callee25$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        gantt.taskStore.removeAll();
                        addedTask = gantt.taskStore.rootNode.appendChild({
                          name: 'New 1'
                        });
                        _context25.next = 4;
                        return gantt.project.propagate();

                      case 4:
                        _context25.next = 6;
                        return gantt.editTask(addedTask);

                      case 6:
                      case "end":
                        return _context25.stop();
                    }
                  }
                }, _callee25);
              })), {
                waitForSelector: '.b-gantt-taskeditor'
              }, function () {
                // TaskEditor should be centered to gantt
                var editRect = t.rect('.b-gantt-taskeditor'),
                    ganttRect = t.rect('.b-ganttbase');
                t.isApprox(editRect.left, (ganttRect.width - editRect.width) / 2, 1, 'Correct left position');
                t.isApprox(editRect.top, (ganttRect.height - editRect.height) / 2, 1, 'Correct top position');
              });

            case 4:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26);
    }));

    return function (_x18) {
      return _ref29.apply(this, arguments);
    };
  }()); // fix for https://github.com/bryntum/support/issues/154

  t.it('Task editor should allow to type in Duration for unscheduled task', /*#__PURE__*/function () {
    var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(t) {
      var added, widgetMap;
      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              gantt = t.getGantt();
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New'
              }); // run propagation to calculate new task fields and scroll it into view

              _context27.next = 4;
              return gantt.project.propagate();

            case 4:
              _context27.next = 6;
              return gantt.scrollTaskIntoView(added);

            case 6:
              _context27.next = 8;
              return gantt.editTask(added);

            case 8:
              widgetMap = gantt.features.taskEdit.editor.widgetMap;
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              }, {
                click: '.b-tabpanel-tab-title:contains(Advanced)'
              }, {
                click: widgetMap.constraintTypeField.triggers.expand.element,
                desc: 'Click expand constraints combo'
              }, {
                click: '.b-list-item:contains(Must start on)',
                desc: 'Clicking Must start on item'
              }, {
                click: '.b-tabpanel-tab-title:contains(General)'
              }, {
                click: widgetMap.fullDurationField.input
              }, {
                type: '1',
                clearExisting: true
              }, function () {
                return t.isDeeply(widgetMap.fullDurationField.value, new Duration(1, 'day'), 'Correct value for duration field "1 day"');
              });

            case 10:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27);
    }));

    return function (_x19) {
      return _ref32.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/429

  t.it('Should hide task editor if project is reloaded while open', /*#__PURE__*/function () {
    var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(t) {
      return regeneratorRuntime.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              t.mockUrl('load', function (url, params, options) {
                return {
                  responseText: JSON.stringify({
                    success: true,
                    revision: 1,
                    tasks: {
                      rows: t.getProjectTaskData()
                    },
                    calendars: {
                      rows: t.getProjectCalendarsData()
                    },
                    dependencies: {
                      rows: t.getProjectDependenciesData()
                    }
                  })
                };
              });
              gantt = t.getGantt({
                project: {
                  transport: {
                    load: {
                      url: 'load'
                    }
                  }
                }
              });
              _context28.next = 4;
              return gantt.editTask(gantt.project.firstChild);

            case 4:
              _context28.next = 6;
              return gantt.project.load();

            case 6:
              t.selectorNotExists('.b-taskeditor');

            case 7:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28);
    }));

    return function (_x20) {
      return _ref33.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/649

  t.it('Should trigger sync upon task deletion if autoSync is true', /*#__PURE__*/function () {
    var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(t) {
      var spy;
      return regeneratorRuntime.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              t.mockUrl('sync', function () {
                return {
                  responseText: JSON.stringify({
                    success: true
                  })
                };
              });
              gantt = t.getGantt({
                project: {
                  autoSync: true,
                  transport: {
                    sync: {
                      url: 'sync'
                    }
                  }
                }
              });
              spy = t.spyOn(gantt.project, 'sync');
              _context29.next = 5;
              return gantt.editTask(gantt.project.firstChild.firstChild);

            case 5:
              _context29.next = 7;
              return t.click('.b-button:contains(Delete)');

            case 7:
              t.expect(spy).toHaveBeenCalled();

            case 8:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee29);
    }));

    return function (_x21) {
      return _ref34.apply(this, arguments);
    };
  }()); // https://www.bryntum.com/forum/viewtopic.php?f=52&t=13770&p=72720#p72720

  t.it('Should not create new stores after changing value which causes propagation', /*#__PURE__*/function () {
    var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(t) {
      var project, task, editor, resourceGrid, resourceComboStore;
      return regeneratorRuntime.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              gantt = t.getGantt();
              project = gantt.project, task = project.firstChild.firstChild.firstChild;
              _context30.next = 4;
              return gantt.editTask(task);

            case 4:
              editor = gantt.features.taskEdit.getEditor(), resourceGrid = editor.widgetMap.resourcestab.widgetMap['resourcestab-grid'], resourceComboStore = resourceGrid.columns.get('resource').editor.store;
              _context30.next = 7;
              return t.click('[data-ref=fullDurationField] .b-spin-up');

            case 7:
              _context30.next = 9;
              return project.waitForPropagateCompleted();

            case 9:
              t.is(resourceGrid.columns.get('resource').editor.store, resourceComboStore);

            case 10:
            case "end":
              return _context30.stop();
          }
        }
      }, _callee30);
    }));

    return function (_x22) {
      return _ref35.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/1093

  t.it('Event editor start and end date fields should respect weekStartDay config', function (t) {
    gantt = t.getGantt({
      weekStartDay: 1
    });
    t.chain({
      doubleClick: '[data-task-id="11"]'
    }, {
      click: '[data-ref="startDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'Start date picker week starts with correct day'
    }, {
      click: '[data-ref="endDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
      desc: 'End date picker week starts with correct day'
    });
  });
  t.it('Event editor start and end date fields should respect DateHelper.weekStartDay config', function (t) {
    gantt = t.getGantt();
    t.chain({
      doubleClick: '[data-task-id="11"]'
    }, {
      click: '[data-ref="startDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'Start date picker week starts with correct day'
    }, {
      click: '[data-ref="endDateField"] .b-icon-calendar'
    }, {
      waitForSelector: '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
      desc: 'End date picker week starts with correct day'
    });
  });
});