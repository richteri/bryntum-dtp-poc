function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('Test buttons', function (t) {
  var gantt = bryntum.query('gantt'),
      tbar = bryntum.fromElement(document.querySelector('.b-top-toolbar')),
      tools = tbar.widgetMap;
  !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy(); // https://github.com/bryntum/support/issues/244

  t.it('Deleted dependency line should not re-appear', function (t) {
    t.chain({
      waitForPropagate: gantt.project
    }, {
      waitForSelector: 'polyline[depId=4]'
    }, function (next) {
      gantt.dependencyStore.remove([3, 4]);
      next();
    }, {
      waitForSelectorNotFound: 'polyline[depId=3]'
    }, {
      waitForSelectorNotFound: 'polyline[depId=4]'
    }, function (next) {
      gantt.dependencyStore.add({
        fromEvent: 13,
        toEvent: 15
      });
      next();
    }, // give the offending dependency line time to re-appear
    {
      waitFor: 10
    }, {
      waitForSelectorNotFound: 'polyline[depId=4]'
    });
  });
  t.it('Check toolbar buttons', function (t) {
    t.willFireNTimes(gantt, 'presetchange', 3);
    t.willFireNTimes(gantt, 'timeaxischange', 5);
    t.chain({
      click: tools.addTaskButton.element
    }, {
      waitForSelector: 'input:focus'
    }, // Create task with name foo
    {
      type: 'foo[ENTER]'
    }, // Open task editor
    {
      click: tools.editTaskButton.element
    }, // rename task to bar
    {
      type: '[BACKSPACE][BACKSPACE][BACKSPACE]bar',
      target: '[name=\'name\']'
    }, {
      click: '.b-gantt-taskeditor :textEquals(Save)'
    }, function (next) {
      t.selectorNotExists('.b-grid-cell:textEquals(foo)');
      t.selectorExists('.b-grid-cell:textEquals(bar)');
      next();
    }, {
      click: tools.collapseAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && task.isExpanded(gantt.taskStore);
      }), null, 'No expanded nodes found');
      next();
    }, {
      click: tools.expandAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && !task.isExpanded(gantt.taskStore);
      }), null, 'No collapsed nodes found');
      next();
    }, // These should trigger 1 timeaxischange each
    {
      click: tools.zoomInButton.element
    }, {
      click: tools.zoomOutButton.element
    }, {
      click: tools.zoomToFitButton.element
    }, {
      click: tools.previousButton.element
    }, {
      click: tools.nextButton.element
    }, {
      click: tools.settingsButton.element
    });
  });
  t.it('Should support turning features on and off', function (t) {
    t.chain({
      click: tools.featuresButton.element
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
    }, // eof labels
    // project lines
    {
      click: '.b-menu-text:textEquals(Project lines)'
    }, {
      waitForSelectorNotFound: '.b-gantt-project-line:textEquals(Project start)'
    }, {
      click: '.b-menu-text:textEquals(Project lines)'
    }, {
      waitForSelector: '.b-gantt-project-line:textEquals(Project start)'
    }, // eof project lines
    // non-working time
    {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, {
      waitForSelectorNotFound: '.b-sch-nonworkingtime'
    }, {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, {
      waitForSelector: '.b-sch-nonworkingtime'
    }, // eof non-working time
    // Enable cell editing
    {
      click: '.b-menu-text:textEquals(Enable cell editing)'
    }, {
      waitForSelectorNotFound: '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label'
    }, {
      click: '.b-menu-text:textEquals(Enable cell editing)'
    }, {
      waitForSelector: '.b-gantt-task-wrap .b-sch-label'
    }, // eof cell editing
    // Show baselines
    {
      waitForSelectorNotFound: '.b-has-baselines'
    }, // shouldn't be there if baselines are disabled
    {
      click: '.b-menu-text:textEquals(Show baselines)'
    }, {
      waitForSelector: '.b-task-baseline'
    }, {
      waitForSelector: '.b-has-baselines'
    }, // should be there if baselines are enabled
    {
      click: '.b-menu-text:textEquals(Show baselines)'
    }, {
      waitForSelectorNotFound: '.b-task-baseline'
    }, {
      waitForSelectorNotFound: '.b-has-baselines'
    }, // shouldn't be there if baselines are disabled
    // eof Show baselines
    // schedule collapsing
    {
      click: '.b-menu-text:textEquals(Hide schedule)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", t.ok(gantt.subGrids.normal.collapsed, 'Schedule collapsed'));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), {
      click: '.b-menu-text:textEquals(Hide schedule)'
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", t.notOk(gantt.subGrids.normal.isCollapsed, 'Schedule expanded'));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })) // eof schedule collapsing
    );
  });
  t.it('Should support turning critical paths on and off', function (t) {
    t.chain({
      click: tools.criticalPathsButton.element
    }, {
      waitForSelector: '.b-gantt-critical-paths'
    }, {
      click: tools.criticalPathsButton.element
    }, {
      waitForSelectorNotFound: '.b-gantt-critical-paths'
    });
  }); // Can't interact with native slider elements so calling listeners manually

  t.it('Should support changing settings', function (t) {
    tbar.onSettingsMarginChange({
      value: 10
    });
    tbar.onSettingsDurationChange({
      value: 1000
    });
    tbar.onSettingsRowHeightChange({
      value: 40
    });
    t.is(gantt.barMargin, 10, 'Bar margin changed');
    t.is(gantt.rowHeight, 40, 'Row height changed');
    t.is(gantt.transitionDuration, 1000, 'Transition duration changed');
  });
  t.it('Should not reload images in avatar column on task changes', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var _gantt$taskStore$add, _gantt$taskStore$add2, task, loadedCount, onLoad;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              onLoad = function _onLoad(event) {
                // in Firefox previous test appends style tag which triggers load event
                // filter out style tag loads
                if (event.target && event.target.tagName !== 'STYLE') {
                  loadedCount++;
                }
              };

              gantt.taskStore.getById(1000).remove();
              _gantt$taskStore$add = gantt.taskStore.add({
                name: 'New'
              }), _gantt$taskStore$add2 = _slicedToArray(_gantt$taskStore$add, 1), task = _gantt$taskStore$add2[0];
              loadedCount = 0;
              document.addEventListener('load', onLoad, true);
              task.assign(gantt.resourceStore.first);
              t.chain({
                waitFor: function waitFor() {
                  return loadedCount === 1;
                }
              }, function (next) {
                task.name = 'Changed';
                next();
              }, {
                waitFor: 2000,
                desc: 'Waiting for no images to load :)'
              }, function () {
                t.is(loadedCount, 1, 'No additional load');
                document.removeEventListener('load', onLoad, true);
              });

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());
});