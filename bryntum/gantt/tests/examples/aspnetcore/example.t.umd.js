function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(t) {
    var gantt, IdHelper;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return t.waitForSelector('.b-gantt-task');

          case 2:
            gantt = window.gantt, IdHelper = window.bryntum.IdHelper;
            gantt.enableEventAnimations = false;
            t.it('Should add/update/remove new tasks/resource/assignments', /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
                var project, newResourceName, updatedResourceName, parent, child, _gantt$resourceStore$, _gantt$resourceStore$2, resource, _gantt$assignmentStor, _gantt$assignmentStor2, assignment, resources;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        project = gantt.project;
                        _context.next = 4;
                        return project.waitForPropagateCompleted();

                      case 4:
                        // region Add
                        t.diag('Add');
                        newResourceName = IdHelper.generateId('resource'), updatedResourceName = IdHelper.generateId('resource'), parent = gantt.taskStore.rootNode.appendChild({
                          Name: 'New parent',
                          expanded: true,
                          children: [{
                            Name: 'Child 1',
                            Duration: 5,
                            leaf: true
                          }]
                        }), child = parent.children[0], _gantt$resourceStore$ = gantt.resourceStore.add({
                          Name: newResourceName
                        }), _gantt$resourceStore$2 = _slicedToArray(_gantt$resourceStore$, 1), resource = _gantt$resourceStore$2[0], _gantt$assignmentStor = gantt.assignmentStore.add({
                          TaskId: child.id,
                          ResourceId: resource.id
                        }), _gantt$assignmentStor2 = _slicedToArray(_gantt$assignmentStor, 1), assignment = _gantt$assignmentStor2[0];
                        _context.next = 8;
                        return project.propagate();

                      case 8:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref3) {
                            var pack = _ref3.pack;
                            t.isDeeplySubset([{
                              $PhantomId: parent.id,
                              Name: 'New parent',
                              StartDate: new Date('2012-09-03 08:00'),
                              EndDate: new Date('2012-09-07 17:00'),
                              Duration: 5
                            }, {
                              $PhantomId: child.id,
                              $PhantomParentId: parent.id,
                              Name: 'Child 1',
                              StartDate: new Date('2012-09-03 08:00'),
                              EndDate: new Date('2012-09-07 17:00'),
                              Duration: 5
                            }], pack.tasks.added, 'Tasks add request is ok');
                            t.isDeeply(pack.resources.added, [{
                              $PhantomId: resource.id,
                              Name: newResourceName,
                              CalendarId: 1
                            }], 'Resource sync pack is ok');
                            t.isDeeply(pack.assignments.added, [{
                              $PhantomId: assignment.id,
                              TaskId: child.id,
                              ResourceId: resource.id,
                              Units: 100
                            }], 'Assignment sync pack is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref4) {
                            var response = _ref4.response;
                            var parentId = response.tasks.rows[0].Id,
                                childId = response.tasks.rows[1].Id,
                                resourceId = response.resources.rows[0].Id,
                                assignmentId = response.assignments.rows[0].Id,
                                ids = [parentId, childId, resourceId, assignmentId];

                            if (ids.some(function (id) {
                              return id === 0;
                            })) {
                              t.fail(ids, 'Ids are valid');
                            }

                            t.isDeeply(response.tasks.rows, [{
                              Id: parentId,
                              $PhantomId: parent.id
                            }, {
                              Id: childId,
                              $PhantomId: child.id
                            }], 'Parent/child added');
                            t.isDeeply(response.resources.rows, [{
                              Id: resourceId,
                              $PhantomId: resource.id
                            }], 'Resource added');
                            t.isDeeply(response.assignments.rows, [{
                              Id: assignmentId,
                              $PhantomId: assignment.id,
                              TaskId: childId,
                              ResourceId: resourceId
                            }], 'Assignment added');
                          },
                          once: true
                        });
                        _context.next = 11;
                        return project.sync();

                      case 11:
                        t.is(resource.tasks.length, 1, '1 task assigned');
                        t.is(resource.tasks[0], child, 'Correct task is assigned');
                        resources = project.taskStore.getResourcesForEvent(child);
                        t.is(resources.length, 1, '1 resource is assigned');
                        t.is(resources[0], resource, 'Correct resource is assigned'); // endregion
                        // region Update

                        t.diag('Update');
                        resource.name = updatedResourceName;
                        assignment.units = 50;
                        _context.next = 21;
                        return child.setConstraint('startnoearlierthan', new Date(2012, 8, 5));

                      case 21:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref5) {
                            var pack = _ref5.pack;
                            t.isDeeplySubset({
                              StartDate: new Date(2012, 8, 5, 8),
                              EndDate: new Date(2012, 8, 11, 17)
                            }, pack.tasks.updated.find(function (r) {
                              return r.Id === parent.id;
                            }), 'Parent update request is ok');
                            t.isDeeplySubset({
                              StartDate: new Date(2012, 8, 5, 8),
                              EndDate: new Date(2012, 8, 11, 17),
                              ConstraintDate: new Date(2012, 8, 5),
                              ConstraintType: 'startnoearlierthan'
                            }, pack.tasks.updated.find(function (r) {
                              return r.Id === child.id;
                            }), 'Child update request is ok');
                            t.isDeeply(pack.resources.updated, [{
                              Id: resource.id,
                              Name: updatedResourceName
                            }], 'Resource update request is ok');
                            t.isDeeply(pack.assignments.updated, [{
                              Id: assignment.id,
                              Units: 50
                            }], 'Assignment update request is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref6) {
                            var response = _ref6.response;
                            t.isDeeply(response.tasks.rows.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child.id
                            }], 'Parent/child updated ok');
                            t.isDeeply(response.resources.rows, [{
                              Id: resource.id
                            }], 'Resource updated ok');
                            t.isDeeply(response.assignments.rows, [{
                              Id: assignment.id
                            }], 'Assignment updated ok');
                          },
                          once: true
                        });
                        _context.next = 24;
                        return project.sync();

                      case 24:
                        t.is(parent.startDate, new Date(2012, 8, 5, 8), 'Parent start date is ok');
                        t.is(parent.endDate, new Date(2012, 8, 11, 17), 'Parent end date is ok');
                        t.is(child.startDate, new Date(2012, 8, 5, 8), 'Child start date is ok');
                        t.is(child.endDate, new Date(2012, 8, 11, 17), 'Child end date is ok');
                        t.is(resource.name, updatedResourceName, 'Resource name is ok');
                        t.is(assignment.units, 50, 'Units are updated'); // endregion
                        // region Remove

                        t.diag('Remove');
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref7) {
                            var pack = _ref7.pack;
                            t.isDeeply(pack.tasks.removed.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child.id
                            }], 'Tasks remove request is ok');
                            t.isDeeply(pack.resources.removed, [{
                              Id: resource.id
                            }], 'Resource remove request is ok');
                            t.isDeeply(pack.assignments.removed, [{
                              Id: assignment.id
                            }], 'Assignment remove request is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref8) {
                            var response = _ref8.response;
                            t.isDeeply(response.tasks.removed.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child.id
                            }], 'Tasks are removed');
                            t.isDeeply(response.resources.removed, [{
                              Id: resource.id
                            }], 'Resource is removed');
                            t.isDeeply(response.assignments.removed, [{
                              Id: assignment.id
                            }], 'Assignment is removed');
                          },
                          once: true
                        });
                        gantt.assignmentStore.remove(assignment);
                        gantt.resourceStore.remove(resource);
                        gantt.taskStore.remove(parent);
                        _context.next = 37;
                        return project.sync();

                      case 37:
                        t.notOk(gantt.resourceStore.find(function (r) {
                          return r.name === updatedResourceName;
                        }), 'Resource is not in the store'); // endregion

                        _context.next = 43;
                        break;

                      case 40:
                        _context.prev = 40;
                        _context.t0 = _context["catch"](0);
                        t.fail(_context.t0.stack);

                      case 43:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 40]]);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());
            t.it('Should add/update/remove new tasks/resource/assignments', /*#__PURE__*/function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
                var project, parent1Name, parent2Name, child11Name, child21Name, parent1, _parent1$children, child11, parent2, _parent2$children, child21;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        project = gantt.project;
                        _context2.next = 4;
                        return project.waitForPropagateCompleted();

                      case 4:
                        // region Add
                        t.diag('Add');
                        parent1Name = IdHelper.generateId('record'), parent2Name = IdHelper.generateId('record'), child11Name = IdHelper.generateId('record'), child21Name = IdHelper.generateId('record');
                        parent1 = gantt.taskStore.rootNode.appendChild({
                          Name: parent1Name,
                          expanded: true,
                          children: [{
                            Name: child11Name,
                            Duration: 5,
                            leaf: true
                          }]
                        }), _parent1$children = _slicedToArray(parent1.children, 1), child11 = _parent1$children[0];
                        _context2.next = 9;
                        return project.propagate();

                      case 9:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref10) {
                            var pack = _ref10.pack;
                            t.isDeeplySubset([{
                              $PhantomId: parent1.id,
                              Name: parent1Name
                            }, {
                              $PhantomId: child11.id,
                              $PhantomParentId: parent1.id,
                              Name: child11Name
                            }], pack.tasks.added, 'Tasks add request is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref11) {
                            var response = _ref11.response;
                            var parentId = response.tasks.rows[0].Id,
                                childId = response.tasks.rows[1].Id,
                                ids = [parentId, childId];

                            if (ids.some(function (id) {
                              return id === 0;
                            })) {
                              t.fail(ids, 'Ids are valid');
                            }

                            t.isDeeplySubset([{
                              $PhantomId: parent1.id
                            }, {
                              $PhantomId: child11.id
                            }], response.tasks.rows, 'Parent/child added');
                          },
                          once: true
                        });
                        _context2.next = 12;
                        return project.sync();

                      case 12:
                        // endregion
                        // region Add new, update existing
                        t.diag('Add new, update existing');
                        parent2 = gantt.taskStore.rootNode.appendChild({
                          name: parent2Name,
                          children: [{
                            name: child21Name,
                            duration: 1
                          }]
                        }), _parent2$children = _slicedToArray(parent2.children, 1), child21 = _parent2$children[0];
                        parent2.appendChild(child11);
                        parent1.appendChild(child21);
                        _context2.next = 18;
                        return project.propagate();

                      case 18:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref12) {
                            var pack = _ref12.pack;
                            t.isDeeplySubset({
                              $PhantomParentId: parent2.id
                            }, pack.tasks.updated.find(function (r) {
                              return r.Id === child11.id;
                            }), 'Parent update request is ok');
                            t.isDeeplySubset({
                              parentId: parent1.id,
                              $PhantomId: child21.id,
                              $PhantomParentId: undefined
                            }, pack.tasks.added.find(function (r) {
                              return r.$PhantomId === child21.id;
                            }), 'Task add request is ok');
                          },
                          once: true
                        });
                        _context2.next = 21;
                        return project.sync();

                      case 21:
                        // endregion
                        // region Reload project
                        t.diag('Reload');
                        _context2.next = 24;
                        return project.load();

                      case 24:
                        parent1 = gantt.taskStore.findRecord('name', parent1Name);
                        parent2 = gantt.taskStore.findRecord('name', parent2Name);
                        child11 = gantt.taskStore.findRecord('name', child11Name);
                        child21 = gantt.taskStore.findRecord('name', child21Name);
                        t.is(child11.parent.id, parent2.id, 'Parent 2 has Child 1-1');
                        t.is(child21.parent.id, parent1.id, 'Parent 1 has Child 2-1');
                        gantt.taskStore.remove([parent1, parent2]);
                        _context2.next = 33;
                        return gantt.project.sync();

                      case 33:
                        _context2.next = 38;
                        break;

                      case 35:
                        _context2.prev = 35;
                        _context2.t0 = _context2["catch"](0);
                        t.fail(_context2.t0.stack);

                      case 38:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[0, 35]]);
              }));

              return function (_x3) {
                return _ref9.apply(this, arguments);
              };
            }());
            t.it('Should add/update/remove new tasks/dependencies', /*#__PURE__*/function () {
              var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
                var project, parent, _parent$children, child1, child2, _gantt$dependencyStor, _gantt$dependencyStor2, dependency;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;
                        project = gantt.project;
                        _context3.next = 4;
                        return project.waitForPropagateCompleted();

                      case 4:
                        // region Add
                        t.diag('Add');
                        parent = gantt.taskStore.rootNode.appendChild({
                          Name: 'New parent',
                          expanded: true,
                          children: [{
                            Name: 'Child 1',
                            Duration: 5,
                            leaf: true
                          }, {
                            Name: 'Child 2',
                            Duration: 3,
                            leaf: true
                          }]
                        }), _parent$children = _slicedToArray(parent.children, 2), child1 = _parent$children[0], child2 = _parent$children[1], _gantt$dependencyStor = gantt.dependencyStore.add({
                          From: child1.id,
                          To: child2.id,
                          Lag: 1
                        }), _gantt$dependencyStor2 = _slicedToArray(_gantt$dependencyStor, 1), dependency = _gantt$dependencyStor2[0];
                        _context3.next = 8;
                        return project.propagate();

                      case 8:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref14) {
                            var pack = _ref14.pack;
                            t.isDeeply(pack.dependencies.added, [{
                              $PhantomId: dependency.id,
                              From: child1.id,
                              To: child2.id,
                              Lag: 1,
                              LagUnit: 'day',
                              Cls: '',
                              Type: 2
                            }], 'Dependency sync pack is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref15) {
                            var response = _ref15.response;
                            var child1Id = response.tasks.rows[1].Id,
                                child2Id = response.tasks.rows[2].Id,
                                dependencyId = response.dependencies.rows[0].Id,
                                ids = [child1Id, child2Id, dependencyId];

                            if (ids.some(function (id) {
                              return id === 0;
                            })) {
                              t.fail(ids, 'Ids are valid');
                            }

                            t.isDeeply(response.dependencies.rows, [{
                              Id: dependencyId,
                              $PhantomId: dependency.id,
                              From: child1Id,
                              To: child2Id
                            }], 'Dependency added');
                          },
                          once: true
                        });
                        _context3.next = 11;
                        return project.sync();

                      case 11:
                        t.is(dependency.fromEvent, child1, 'Source task is ok');
                        t.is(dependency.toEvent, child2, 'Target task is ok'); // endregion
                        // region Update

                        t.diag('Update');
                        _context3.next = 16;
                        return dependency.setLag(2);

                      case 16:
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref16) {
                            var pack = _ref16.pack;
                            t.isDeeplySubset({
                              EndDate: new Date(2012, 8, 14, 17)
                            }, pack.tasks.updated.find(function (r) {
                              return r.Id === parent.id;
                            }), 'Parent update request is ok');
                            t.isDeeplySubset({
                              EndDate: new Date(2012, 8, 14, 17)
                            }, pack.tasks.updated.find(function (r) {
                              return r.Id === child2.id;
                            }), 'Child update request is ok');
                            t.isDeeply(pack.dependencies.updated, [{
                              Id: dependency.id,
                              Lag: 2
                            }], 'Dependency update request is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref17) {
                            var response = _ref17.response;
                            t.isDeeply(response.tasks.rows.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child2.id
                            }], 'Parent/child updated ok');
                            t.isDeeply(response.dependencies.rows, [{
                              Id: dependency.id
                            }], 'Dependency updated ok');
                          },
                          once: true
                        });
                        _context3.next = 19;
                        return project.sync();

                      case 19:
                        t.is(parent.endDate, new Date(2012, 8, 14, 17), 'Parent end date is ok');
                        t.is(child2.endDate, new Date(2012, 8, 14, 17), 'Child end date is ok');
                        t.is(dependency.lag, 2, 'Lag is updated'); // endregion
                        // region Remove

                        t.diag('Remove');
                        gantt.crudManager.on({
                          beforeSync: function beforeSync(_ref18) {
                            var pack = _ref18.pack;
                            t.isDeeply(pack.tasks.removed.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child1.id
                            }, {
                              Id: child2.id
                            }], 'Tasks remove request is ok');
                            t.isDeeply(pack.dependencies.removed, [{
                              Id: dependency.id
                            }], 'Dependency remove request is ok');
                          },
                          beforeSyncApply: function beforeSyncApply(_ref19) {
                            var response = _ref19.response;
                            t.isDeeply(response.tasks.removed.sort(function (a, b) {
                              return a.Id - b.Id;
                            }), [{
                              Id: parent.id
                            }, {
                              Id: child1.id
                            }, {
                              Id: child2.id
                            }], 'Tasks are removed');
                            t.isDeeply(response.dependencies.removed, [{
                              Id: dependency.id
                            }], 'Dependency is removed');
                          },
                          once: true
                        });
                        gantt.taskStore.remove(parent);
                        _context3.next = 27;
                        return project.sync();

                      case 27:
                        _context3.next = 32;
                        break;

                      case 29:
                        _context3.prev = 29;
                        _context3.t0 = _context3["catch"](0);
                        t.fail(_context3.t0.stack);

                      case 32:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 29]]);
              }));

              return function (_x4) {
                return _ref13.apply(this, arguments);
              };
            }());
            t.it('Should load non-working time', /*#__PURE__*/function () {
              var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
                var project;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.prev = 0;
                        project = gantt.project;
                        _context4.next = 4;
                        return project.waitForPropagateCompleted();

                      case 4:
                        t.notOk(gantt.project.calendar.isDayHoliday(new Date(2012, 9, 20)), 'Day override is loaded properly');
                        t.ok(gantt.project.calendar.isDayHoliday(new Date(2012, 9, 21)), 'Weekend is non-working');
                        _context4.next = 11;
                        break;

                      case 8:
                        _context4.prev = 8;
                        _context4.t0 = _context4["catch"](0);
                        t.fail(_context4.t0.stack);

                      case 11:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, null, [[0, 8]]);
              }));

              return function (_x5) {
                return _ref20.apply(this, arguments);
              };
            }());

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());