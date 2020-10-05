/* global ProjectModel */
StartTest(function (t) {
  t.it('Crud manager keeps gantt specific stores in the proper order', function (t) {
    var async = t.beginAsync();
    var eventStore = t.getTaskStore();
    var dependencyStore = t.getDependencyStore();
    var resourceStore = t.getResourceStore();
    var assignmentStore = t.getAssignmentStore();
    var someStore1 = new Store();
    var someStore2 = new Store();
    var project;
    project = new ProjectModel({
      autoLoad: true,
      eventStore: eventStore,
      dependencyStore: dependencyStore,
      resourceStore: resourceStore,
      assignmentStore: assignmentStore,
      crudStores: [{
        store: someStore1,
        storeId: 'smth1'
      }, {
        store: someStore2,
        storeId: 'smth2'
      }],
      listeners: {
        'beforeLoad': function beforeLoad() {
          t.endAsync(async);
          return false;
        }
      }
    });
    t.is(project.crudStores.length, 8, 'correct stores list length');
    t.is(project.crudStores[0].storeId, 'smth1', 'correct 0 store');
    t.is(project.crudStores[1].storeId, 'smth2', 'correct 1 store');
    t.is(project.crudStores[2].storeId, 'timeRanges', 'correct 2 store');
    t.is(project.crudStores[3].storeId, 'calendars', 'correct 3 store');
    t.is(project.crudStores[4].storeId, 'tasks', 'correct 4 store');
    t.is(project.crudStores[5].storeId, 'dependencies', 'correct 5 store');
    t.is(project.crudStores[6].storeId, 'resources', 'correct 6 store');
    t.is(project.crudStores[7].storeId, 'assignments', 'correct 7 store');
  });
});