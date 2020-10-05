function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global TaskStore, DependencyStore, ProjectModel */
function getDataSet(dependencies, tasks, taskStoreCfg, depStoreCfg) {
  var dependencyStore = new DependencyStore(Object.assign({
    data: dependencies || [{
      id: 123,
      fromEvent: 1,
      toEvent: 2,
      type: DependencyType.EndToStart
    }, {
      id: 124,
      fromEvent: 2,
      toEvent: 3,
      type: DependencyType.EndToStart
    }],
    transitiveDependencyValidation: true
  }, depStoreCfg));
  var taskStore = new TaskStore(Object.assign({
    data: [{
      id: 'root',
      children: tasks || [{
        id: 1,
        leaf: true,
        startDate: new Date(2011, 6, 1),
        endDate: new Date(2011, 6, 2)
      }, {
        id: 2,
        leaf: true,
        startDate: new Date(2011, 6, 2),
        endDate: new Date(2011, 6, 3)
      }, {
        id: 3,
        leaf: true,
        startDate: new Date(2011, 6, 3),
        endDate: new Date(2011, 6, 4)
      }, {
        id: 4,
        leaf: true,
        startDate: new Date(2011, 6, 3),
        endDate: new Date(2011, 6, 4)
      }, {
        id: 5,
        leaf: true,
        startDate: new Date(2011, 6, 3),
        endDate: new Date(2011, 6, 4)
      }, {
        id: 6,
        leaf: true,
        startDate: new Date(2011, 6, 3),
        endDate: new Date(2011, 6, 4)
      }]
    }]
  }, taskStoreCfg));
  dependencyStore.taskStore = taskStore;
  taskStore.dependencyStore = dependencyStore;
  return {
    taskStore: taskStore,
    dependencyStore: dependencyStore
  };
}

;

var getProject = function getProject() {
  var dataSet = getDataSet.apply(void 0, arguments);
  return new ProjectModel({
    eventStore: dataSet.taskStore,
    dependencyStore: dataSet.dependencyStore
  });
};

StartTest(function (t) {
  t.it('Basic functionality', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var project, taskStore, dependencyStore, dep, newTask, root, cacheKey, newDependency;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = getProject();
              _context.next = 3;
              return project.propagate();

            case 3:
              taskStore = project.eventStore;
              dependencyStore = project.dependencyStore;
              t.verifyCachedDependenciesState(taskStore);
              t.ok(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');
              dep = dependencyStore.first;
              t.ok(dep.isPersistable, 'Dep is ok to persist');
              newTask = new TaskModel();
              t.isDeeply(newTask.allDependencies, [], 'getAllDependencies returns empty array');
              root = taskStore.getById('root');
              root.appendChild(newTask);
              _context.next = 15;
              return dep.propagate();

            case 15:
              t.verifyCachedDependenciesState(taskStore);
              dep.toEvent = newTask;
              _context.next = 19;
              return dep.propagate();

            case 19:
              // SHOULD CLEAR THE CACHE SOMEWHERE?
              t.notOk(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');
              t.verifyCachedDependenciesState(taskStore);
              t.notOk(dep.isPersistable, 'Dep is no longer ok to persist');
              t.isDeeply(newTask.allDependencies, [dep], 'allDependencies property ok');
              t.isDeeply(newTask.incomingDeps, new Set([dep]), 'Outgoing deps ok');
              t.isDeeply(newTask.outgoingDeps, new Set([]), 'Incoming deps ok');
              dep.toEvent = taskStore.getById(2);
              _context.next = 28;
              return dep.propagate();

            case 28:
              t.verifyCachedDependenciesState(taskStore); // This passes but seems just because the cache is not cleared

              t.ok(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks'); // checking methodsCache

              cacheKey = dependencyStore.buildCacheKey(1, 2, null, null, {
                visitedTasks: {}
              });
              t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');
              t.ok(dependencyStore.hasTransitiveDependency(1, 3), 'hasTransitiveDependency');
              cacheKey = dependencyStore.buildCacheKey(1, 3, null, null, {
                visitedTasks: {}
              });
              t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');
              t.notOk(dependencyStore.hasTransitiveDependency(3, 1), 'hasTransitiveDependency returns empty');
              cacheKey = dependencyStore.buildCacheKey(3, 1, null, null, {
                visitedTasks: {}
              });
              t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');
              t.ok(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency'); // // Creates circular link
              // dep.fromEvent           = 3;
              //
              // await dep.propagate()
              //
              // t.verifyCachedDependenciesState(taskStore);
              // t.notOk(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency - bad dependency');
              //
              // dep.from = 1; // was dep.reject();
              //
              // t.verifyCachedDependenciesState(taskStore);

              t.notOk(dependencyStore.isValidDependency(3, 1), 'isValidDependency called with ids - bad dependency - cycle');
              t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency called with ids - bad dependency - transitivity');
              t.ok(dependencyStore.areTasksLinked(1, 2), 'areTasksLinked');
              t.notOk(dependencyStore.areTasksLinked(1, 3), 'areTasksLinked falsy');
              t.notOk(dependencyStore.areTasksLinked(4, 1), 'areTasksLinked bad first task');
              t.notOk(dependencyStore.areTasksLinked(1, 4), 'areTasksLinked bad second task');
              newDependency = new DependencyModel({
                fromEvent: 2,
                toEvent: 1
              });
              t.notOk(dependencyStore.isValidDependency(newDependency), 'Dependency is not valid, since its will form a circular structure 1->2->1');
              newDependency = new DependencyModel({
                fromEvent: 1,
                toEvent: 1
              });
              t.notOk(dependencyStore.isValidDependency(newDependency), 'Dependency from itself is not valid');

            case 49:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // assertions for #1159

  t.it('isValidDependency() treats 2->3 dependency as invalid if we have 1->2,1->3 dependencies (transitivity)', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var _getProject, dependencyStore;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _getProject = getProject([{
                id: 1,
                fromEvent: 1,
                toEvent: 2
              }, {
                id: 2,
                fromEvent: 1,
                toEvent: 3
              }]), dependencyStore = _getProject.dependencyStore; // t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
              // t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');

              t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
              t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
              t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid (transitivity)'); // t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', (t) => {
              //     const { dependencyStore } = getDataSet([{ id : 1, from : 1, to : 2 }, { id : 2, from : 1, to : 3 }], null, null, { transitiveDependencyValidation : false });
              //
              //     t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
              //     t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
              //     t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
              //     t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
              //     t.ok(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid (transitivity)');
              // });

            case 4:
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
  t.it('isValidDependency() treats 1->2 dependency as invalid if we have 2->3,1->3 dependencies (transitivity)', function (t) {
    // create stores
    var _getDataSet = getDataSet([{
      id: 1,
      from: 2,
      to: 3
    }, {
      id: 2,
      from: 1,
      to: 3
    }]),
        dependencyStore = _getDataSet.dependencyStore;

    t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
    t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 2->3 valid');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
    t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid (transitivity)');
    t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', function (t) {
      var _getDataSet2 = getDataSet([{
        id: 1,
        from: 2,
        to: 3
      }, {
        id: 2,
        from: 1,
        to: 3
      }], null, null, {
        transitiveDependencyValidation: false
      }),
          dependencyStore = _getDataSet2.dependencyStore;

      t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
      t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 2->3 valid');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
      t.ok(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid (transitivity)');
    });
  });
  t.it('isValidDependency should handle non existing id as input', function (t) {
    var _getDataSet3 = getDataSet(),
        dependencyStore = _getDataSet3.dependencyStore;

    t.notOk(dependencyStore.isValidDependency(22, 'foo'), 'predecessorsHaveTransitiveDependency');
  }); // #1159 end

  t.it('isValidDependency accepts list of extra added/removed dependencies to be taken into account', function (t) {
    var _getDataSet4 = getDataSet([{
      id: 1,
      from: 1,
      to: 2
    }]),
        dependencyStore = _getDataSet4.dependencyStore;

    t.notOk(dependencyStore.isValidDependency(2, 3, 2, [{
      id: 2,
      from: 1,
      to: 3
    }]), 'isValidDependency 2->3 invalid since we plan to add 1->3 dependency');
    t.notOk(dependencyStore.isValidDependency(1, 3, 2, [{
      id: 2,
      from: 2,
      to: 3
    }]), 'isValidDependency 1->3 invalid since we plan to add 2->3 dependency');
    t.ok(dependencyStore.isValidDependency(1, 2, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
    t.ok(dependencyStore.isValidDependency(2, 1, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
    t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', function (t) {
      var _getDataSet5 = getDataSet([{
        id: 1,
        from: 1,
        to: 2
      }], null, null, {
        transitiveDependencyValidation: false
      }),
          dependencyStore = _getDataSet5.dependencyStore;

      t.ok(dependencyStore.isValidDependency(2, 3, 2, [{
        id: 2,
        from: 1,
        to: 3
      }]), 'isValidDependency 2->3 invalid since we plan to add 1->3 dependency');
      t.ok(dependencyStore.isValidDependency(1, 3, 2, [{
        id: 2,
        from: 2,
        to: 3
      }]), 'isValidDependency 1->3 invalid since we plan to add 2->3 dependency');
      t.ok(dependencyStore.isValidDependency(1, 2, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
      t.ok(dependencyStore.isValidDependency(2, 1, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
    });
  });
  t.it('isValidDependency() treats 3->4 dependency as invalid if we have 1->2->3,4->5->6,1->6 dependencies (transitivity)', function (t) {
    // create stores
    var _getDataSet6 = getDataSet([{
      id: 1,
      from: 1,
      to: 2
    }, {
      id: 2,
      from: 2,
      to: 3
    }, {
      id: 3,
      from: 4,
      to: 5
    }, {
      id: 4,
      from: 5,
      to: 6
    }, {
      id: 5,
      from: 1,
      to: 6
    }]),
        dependencyStore = _getDataSet6.dependencyStore;

    t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
    t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
    t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since it`s transitivity (we have 1->2->3)');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 2->3 valid');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(3)), 'isValidDependency existing 4->5 valid');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(4)), 'isValidDependency existing 5->6 valid');
    t.ok(dependencyStore.isValidDependency(dependencyStore.getById(5)), 'isValidDependency existing 1->6 valid');
    t.notOk(dependencyStore.isValidDependency(3, 4), 'isValidDependency 3->4 invalid (transitivity)');
    t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', function (t) {
      // create stores
      var _getDataSet7 = getDataSet([{
        id: 1,
        from: 1,
        to: 2
      }, {
        id: 2,
        from: 2,
        to: 3
      }, {
        id: 3,
        from: 4,
        to: 5
      }, {
        id: 4,
        from: 5,
        to: 6
      }, {
        id: 5,
        from: 1,
        to: 6
      }], null, null, {
        transitiveDependencyValidation: false
      }),
          dependencyStore = _getDataSet7.dependencyStore;

      t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
      t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
      t.ok(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since it`s transitivity (we have 1->2->3)');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 2->3 valid');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(3)), 'isValidDependency existing 4->5 valid');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(4)), 'isValidDependency existing 5->6 valid');
      t.ok(dependencyStore.isValidDependency(dependencyStore.getById(5)), 'isValidDependency existing 1->6 valid');
      t.ok(dependencyStore.isValidDependency(3, 4), 'isValidDependency 3->4 invalid (transitivity)');
    });
  });
  t.it('isValidDependency() should check allowParentTaskDependencies flag', function (t) {
    var dependencyStore = t.getDependencyStore({
      allowParentTaskDependencies: false,
      data: [{
        id: 1,
        from: 1,
        to: 2
      }, {
        id: 2,
        from: 2,
        to: 3
      }]
    });
    var taskStore = new TaskStore({
      dependencyStore: dependencyStore,
      data: [{
        id: 'root',
        children: [{
          id: 1,
          leaf: false,
          children: [{
            id: 4
          }]
        }, {
          id: 2,
          leaf: false,
          children: [{
            id: 5
          }]
        }, {
          id: 3,
          leaf: true
        }]
      }]
    });
    taskStore.dependencyStore = dependencyStore;
    t.notOk(dependencyStore.isValidDependency(dependencyStore.getAt(0)), 'Should not allow parent task dependencies');
    t.notOk(dependencyStore.isValidDependency(dependencyStore.getAt(1)), 'Should not allow parent task dependencies');
  });
  /*
  t.it('Should append dependency for empty tasks', function (t) {
       t.it('Should work w/ cascadeChanges', function (t) {
           var ds = getDataSet(false, false, {
              cascadeChanges  : true
          });
           var taskStore       = ds.taskStore,
              dependencyStore = ds.dependencyStore,
              root            = taskStore.getRoot();
           t.diag('Adding a predecessor');
           var successor   = root.appendChild({ leaf : true });
          var predecessor = new Gnt.model.Task({ leaf : true });
           successor.addPredecessor(predecessor);
           var projectStartDate = taskStore.getProjectStartDate();
           t.is(predecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
          t.is(predecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
          t.is(predecessor.getDuration(), 1, 'Predecessor duration is correct');
           t.is(successor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
          t.is(successor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
          t.is(successor.getDuration(), 1, 'Successor duration is correct');
           t.diag('Modifying a dependency by switching its source & target tasks');
           var newSuccessor = root.appendChild({ leaf : true });
          var newPredecessor = root.appendChild({ leaf : true });
           var dependency = dependencyStore.last();
          dependency.setTargetTask(newSuccessor);
          dependency.setSourceTask(newPredecessor);
           t.is(newPredecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
          t.is(newPredecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
          t.is(newPredecessor.getDuration(), 1, 'Predecessor duration is correct');
           t.is(newSuccessor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
          t.is(newSuccessor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
          t.is(newSuccessor.getDuration(), 1, 'Successor duration is correct');
           t.diag('Adding a successor');
           predecessor = root.appendChild({ leaf : true });
          successor   = new Gnt.model.Task({ leaf : true });
           predecessor.addSuccessor(successor);
           t.is(predecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
          t.is(predecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
          t.is(predecessor.getDuration(), 1, 'Predecessor duration is correct');
           t.is(successor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
          t.is(successor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
          t.is(successor.getDuration(), 1, 'Successor duration is correct');
           t.diag('Modifying a dependency by switching its source & target tasks');
           newSuccessor   = root.appendChild({ leaf : true });
          newPredecessor = root.appendChild({ leaf : true });
           dependency = dependencyStore.last();
          dependency.setTargetTask(newSuccessor);
          dependency.setSourceTask(newPredecessor);
           t.is(newPredecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
          t.is(newPredecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
          t.is(newPredecessor.getDuration(), 1, 'Predecessor duration is correct');
           t.is(newSuccessor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
          t.is(newSuccessor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
          t.is(newSuccessor.getDuration(), 1, 'Successor duration is correct');
      });
   });
   */
});