function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var grid;
  t.beforeEach(function (t) {
    grid && grid.destroy();
  });

  var getProject = function getProject() {
    return new MinimalGanttProject(t.getProjectData());
  };

  t.it('Should render properly', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var project, eventStore, resourceStore, event, Arcady, arcadyAssignment, _t$query, _t$query2, arcadyInput, _t$query3, _t$query4, arcadyNameCell, _t$query5, _t$query6, arcadyUnitCell, Nick, nickAssignment, _t$query7, _t$query8, nickInput, _t$query9, _t$query10, nickNameCell, _t$query11, _t$query12, nickUnitCell, Don, donAssignment, _t$query13, _t$query14, donInput, _t$query15, _t$query16, donNameCell, _t$query17, _t$query18, donUnitCell;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore();
              _context.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              grid = new AssignmentGrid({
                projectEvent: event,
                appendTo: document.body,
                width: 350,
                store: {
                  floatAssignedResources: false
                }
              }); // Task 115 has two resources assigned
              // - Arcady(1) 100%
              // - Nick(8) 10%

              Arcady = resourceStore.getById(1), arcadyAssignment = grid.store.getResourceAssignment(Arcady), _t$query = t.query('div[data-index=0] input[type=checkbox]'), _t$query2 = _slicedToArray(_t$query, 1), arcadyInput = _t$query2[0], _t$query3 = t.query('div[data-index=0] div[data-column=resourceId]'), _t$query4 = _slicedToArray(_t$query3, 1), arcadyNameCell = _t$query4[0], _t$query5 = t.query('div[data-index=0] div[data-column=units]'), _t$query6 = _slicedToArray(_t$query5, 1), arcadyUnitCell = _t$query6[0];
              t.ok(arcadyInput, 'Checkbox for Arcady is rendered');
              t.ok(arcadyInput.checked, 'Checkbox for Arcady is checked');
              t.ok(arcadyNameCell, 'Arcady name cell is rendered');
              t.is(arcadyNameCell.innerHTML, arcadyAssignment.name, 'Arcady name is rendered ok');
              t.ok(arcadyUnitCell, 'Aracady units cell is rendered');
              t.is(arcadyUnitCell.innerHTML, "".concat(arcadyAssignment.units, "%"), 'Arcady units are rendered ok');
              Nick = resourceStore.getById(8), nickAssignment = grid.store.getResourceAssignment(Nick), _t$query7 = t.query('div[data-index=7] input[type=checkbox]'), _t$query8 = _slicedToArray(_t$query7, 1), nickInput = _t$query8[0], _t$query9 = t.query('div[data-index=7] div[data-column=resourceId]'), _t$query10 = _slicedToArray(_t$query9, 1), nickNameCell = _t$query10[0], _t$query11 = t.query('div[data-index=7] div[data-column=units]'), _t$query12 = _slicedToArray(_t$query11, 1), nickUnitCell = _t$query12[0];
              t.ok(nickInput, 'Checkbox for Nick is rendered');
              t.ok(nickInput.checked, 'Checkbox for Nick is checked');
              t.ok(nickNameCell, 'Nick name cell is rendered');
              t.is(nickNameCell.innerHTML, nickAssignment.name, 'Nick name is rendered ok');
              t.ok(nickUnitCell, 'Nick units cell is rendered');
              t.is(nickUnitCell.innerHTML, "".concat(nickAssignment.units, "%"), 'Nick units are rendered ok'); // Now checking an unassigned resource Don

              Don = resourceStore.getById(2), donAssignment = grid.store.getResourceAssignment(Don), _t$query13 = t.query('div[data-index=1] input[type=checkbox]'), _t$query14 = _slicedToArray(_t$query13, 1), donInput = _t$query14[0], _t$query15 = t.query('div[data-index=1] div[data-column=resourceId]'), _t$query16 = _slicedToArray(_t$query15, 1), donNameCell = _t$query16[0], _t$query17 = t.query('div[data-index=1] div[data-column=units]'), _t$query18 = _slicedToArray(_t$query17, 1), donUnitCell = _t$query18[0];
              t.ok(donInput, 'Checkbox for Don is rendered');
              t.notOk(donInput.checked, 'Checkbox for Don is not checked');
              t.ok(donNameCell, 'Don name cell is rendered');
              t.is(donNameCell.innerHTML, donAssignment.name, 'Don name is rendered ok');
              t.ok(donUnitCell, 'Don units cell is rendered');
              t.is(donUnitCell.innerHTML, '', 'Don units are rendered ok');

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should be possible to bulk assign/unassign resources', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var project, eventStore, resourceCheckboxes, event, _t$query19, _t$query20, assignAllCb, allUncheked, allChecked;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore();
              _context2.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              grid = new AssignmentGrid({
                projectEvent: event,
                appendTo: document.body,
                width: 350,
                store: {
                  floatAssignedResources: false
                }
              }); // Task 115 has two resources assigned
              // - Arcady(1) 100%
              // - Nick(8) 10%
              // At the initial state assign all checkbox shouldn't be checked
              // since not all resources are assigned

              _t$query19 = t.query('.b-check-header-with-checkbox .b-checkbox input'), _t$query20 = _slicedToArray(_t$query19, 1), assignAllCb = _t$query20[0];
              t.ok(assignAllCb, 'Assign all checkbox found');
              t.notOk(assignAllCb.checked, 'Assign all checkbox is not checked initially'); // Assigning all the resources by sequentially checking all their checkboxes

              resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');
              _context2.next = 11;
              return new Promise(function (resolve) {
                t.chain.apply(t, _toConsumableArray(resourceCheckboxes.filter(function (cbEl) {
                  return !cbEl.checked;
                }).map(function (cbEl) {
                  return {
                    click: cbEl
                  };
                })).concat([function () {
                  resolve();
                }]));
              });

            case 11:
              // Now assign all checkbox should be checked
              t.ok(assignAllCb.checked, 'Assign all checkbox is checked now'); // Store should report all assigned

              t.is(grid.store.query(function (r) {
                return r.assigned;
              }).length, grid.store.count, 'All resources are assigned'); // Now let's unassign all by bulk assignment/unassignment checkbox

              _context2.next = 15;
              return new Promise(function (resolve) {
                t.chain({
                  click: assignAllCb
                }, resolve);
              });

            case 15:
              // All resource checkboxes should be unchecked
              resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');
              allUncheked = resourceCheckboxes.every(function (cbEl) {
                return !cbEl.checked;
              });
              t.ok(allUncheked, 'All checkboxes are unchecked');
              t.is(grid.store.query(function (r) {
                return r.assigned;
              }).length, 0, 'All resources are unassigned'); // Now let's assugn all by bulk assignment/unassignment checkbox

              _context2.next = 21;
              return new Promise(function (resolve) {
                t.chain({
                  click: assignAllCb
                }, resolve);
              });

            case 21:
              // All resource checkboxes should be checked
              resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');
              allChecked = resourceCheckboxes.every(function (cbEl) {
                return cbEl.checked;
              });
              t.ok(allChecked, 'All checkboxes are checked');
              t.is(grid.store.query(function (r) {
                return r.assigned;
              }).length, grid.store.count, 'All resources are assigned');

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should be possible to edit assignment units', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var project, eventStore, resourceStore, event, Arcady, arcadyAssignment, _t$query21, _t$query22, arcadyUnitCell;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore();
              _context3.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              grid = new AssignmentGrid({
                projectEvent: event,
                appendTo: document.body,
                width: 350,
                store: {
                  floatAssignedResources: false
                }
              }); // Task 115 has two resources assigned
              // - Arcady(1) 100%
              // - Nick(8) 10%

              Arcady = resourceStore.getById(1), arcadyAssignment = grid.store.getResourceAssignment(Arcady), _t$query21 = t.query('div[data-index=0] div[data-column=units]'), _t$query22 = _slicedToArray(_t$query21, 1), arcadyUnitCell = _t$query22[0];
              _context3.next = 8;
              return new Promise(function (resolve) {
                t.chain([{
                  dblclick: arcadyUnitCell
                }, {
                  type: '[Backspace][Backspace][Backspace]75[Enter]'
                }, resolve]);
              });

            case 8:
              // Now Arcady assignment should have 75% units
              t.is(arcadyAssignment.units, 75, 'Assignment units are changed correctly');

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});