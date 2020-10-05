StartTest(function (t) {
  Object.assign(window, {
    TaskModel: TaskModel,
    TaskStore: TaskStore,
    ProjectModel: SubProjectModel
  });

  function getTaskStore(config) {
    config = config || {};
    return t.getTaskStore(Object.assign({
      DATA: t.getProjectData(config ? config.noOfProjects : 1),
      dependencyStore: new DependencyStore()
    }, config), config.doNotLoad);
  }

  t.it('Assert allowed dependencies', function (t) {
    var taskStore = getTaskStore({
      noOfProjects: 2
    });
    var depStore = taskStore.dependencyStore,
        project1 = taskStore.getById('Project_0'),
        project2 = taskStore.getById('Project_1'),
        task1 = taskStore.getById('Project_0_task_1'),
        task2 = taskStore.getById('Project_1_task_1');
    t.notOk(depStore.isValidDependency(project1.id, project2.id), 'Dependencies between projects are invalid');
    t.notOk(depStore.isValidDependency(task1.id, task2.id), 'Dependencies between tasks from different projects are invalid');
    project1.allowDependencies = true;
    project2.allowDependencies = true;
    t.notOk(depStore.isValidDependency(project1.id, project2.id), 'Dependencies between projects are invalid');
    t.ok(depStore.isValidDependency(task1.id, task2.id), 'Dependencies between tasks from different projects were allowed');
  });
  /*
  t.expectGlobals('Foo');
   class FooTask extends TaskModel {
   }
   Ext.define('Foo.Task', {
      extend  : 'Gnt.model.Task'
  });
   Ext.define('Foo.Project', {
      extend  : 'Gnt.model.Project'
  });
   t.it('Assert Project model fields and properties', function (t) {
       var project = Ext.create('Gnt.model.Project', t.getProject('Foo'));
       t.is(project.getName(), 'Foo', 'Project has correct name');
      t.is(project.getDescription(), 'Foo description', 'Project has correct description');
       t.notOk(project.getReadOnly(), 'Project is editable');
       project.setReadOnly(true);
      t.ok(project.getReadOnly(), 'Project is not editable');
      t.ok(project.isEditable('ReadOnly'), 'Readonly field is editable');
       t.notOk(project.isEditable('ManuallyScheduled'), 'Non project field is not editable');
      t.notOk(project.getAllowDependencies(), 'Project does not allow dependencies');
       t.is(project.getProject(), project, 'Project getProject() points to itself');
   });
   t.it('taskStore loads project models', function (t) {
       t.it('taskStore loads Gnt.model.Project by default', function (t) {
           var store       = getTaskStore({
              model       : 'Foo.Task',
              DATA        : t.getProjectData(1)
          });
           t.is(store.getNodeById('Project_0').self, Gnt.model.Project, 'project class is correct');
          t.isInstanceOf(store.getNodeById('Project_0_task_1'), Foo.Task, 'childtask class is correct');
          t.isInstanceOf(store.getNodeById('Project_0_task_2'), Foo.Task, 'childtask class is correct');
      });
   });
   t.it('Sync heterogenous taskstore', function (t) {
       var store       = getTaskStore({
          listeners   : {
              update : function (store, record, operation) {
                  if (operation === Ext.data.Model.COMMIT) {
                      store.fireEvent('testupdate');
                  }
              },
              write : function (store, operation) {
                  store.fireEvent('testwrite');
                   var records = operation.getRecords();
                  t.is(records.length, 2, 'Operation contains 2 records');
                  t.isInstanceOf(records[0], Gnt.model.Project, 'project task is project');
                  t.isInstanceOf(records[1], Gnt.model.Task, 'childtask is task');
              }
          },
          doNotLoad : true
      });
       t.willFireNTimes(store, 'testupdate', 2, 'Store fires two updates');
      t.firesOnce(store, 'testwrite', 'Store writes data once');
       store.load();
       var project = store.getById('Project_0');
      project.set('Name', 'ChangedProject');
       var task = store.getById('Project_0_task_1');
      task.set('Name', 'ChangedTask');
       store.sync();
   });
   t.it('Assert projects are transformed into tasks when not placed under root', function (t) {
       var store       = getTaskStore({
          model       : 'Foo.Task'
      });
       store.getRoot().appendChild({
          Id          : 'Foo1',
          TaskType    : 'Gnt.model.Project'
      });
       var project = store.getNodeById('Foo1');
      t.isInstanceOf(project, Gnt.model.Project, 'Project is project under root');
       project.appendChild({
          Id          : 'FooChild',
          TaskType    : 'Gnt.model.Project'
      });
       t.notOk(store.getNodeById('FooChild'), 'Cannot append a project under other project');
       project.appendChild(new Gnt.model.Project({
          Id : 'FooChild2'
      }));
       t.notOk(store.getNodeById('FooChild2'), 'Cannot append a project under other project');
       project.appendChild({
          Id          : 'FooTask'
      });
       t.ok(store.getNodeById('FooTask'), 'appends a task under a project');
       store.getNodeById('FooTask').appendChild({
          Id          : 'FooChild',
          TaskType    : 'Gnt.model.Project'
      });
       t.notOk(store.getNodeById('FooChild'), 'Cannot append a project under a task');
  });
   t.it('Assert isEditable', function (t) {
       var store = getTaskStore({
          noOfProjects : 1
      })
       var project = store.getNodeById('Project_0')
       t.ok(project.isEditable('Name'), 'name is editable')
      t.ok(project.isEditable('StartDate'), 'StartDate is editable')
      t.notOk(project.isEditable('EndDate'), 'EndDate is not editable')
      t.ok(project.isEditable('CalendarId'), 'CalendarId is editable')
      t.ok(project.isEditable('ReadOnly'), 'ReadOnly is editable')
      t.ok(project.isEditable('AllowDependencies'), 'AllowDependencies is editable')
      t.ok(project.isEditable('ScheduleBackwards'), 'ScheduleBackwards is editable')
      t.ok(project.isEditable('Note'), 'Note (Description) is editable')
      t.ok(project.isEditable('Cls'), 'Cls is editable')
      t.ok(project.isEditable('ManuallyScheduled'), 'ManuallyScheduled is editable')
      t.notOk(project.isEditable('PercentDone'), 'PercentDone is not editable')
      t.notOk(project.isEditable('Rollup'), 'Rollup is not editable')
      t.ok(project.isEditable('ShowInTimeline'), 'ShowInTimeline is editable')
   })
   t.it('Assert that readonly project makes subtask isEditable to return false', function (t) {
       var store           = getTaskStore({
          noOfProjects    : 2
      });
       store.getNodeById('Project_0').setReadOnly(true);
       t.notOk(store.getNodeById('Project_0_task_1').isEditable('Name'), 'Task field in readonly project is not editable');
      t.ok(store.getNodeById('Project_1_task_1').isEditable('Name'), 'Task field in editable project is editable')
  })
   t.it('Assert that project end date field "editability" depends on the project "ManuallyScheduled" value', function (t) {
       var store = t.getTaskStore({
          DATA : [
              t.getProject({
                  Name              : 'Manual',
                  ManuallyScheduled : true
              }),
              t.getProject('Normal')
          ]
      });
       t.ok(store.getNodeById('Manual').isEditable('StartDate'), 'Manually scheduled project allows to edit its start date');
      t.ok(store.getNodeById('Manual').isEditable('EndDate'), 'Manually scheduled project allows to edit its end date');
      t.ok(store.getNodeById('Normal').isEditable('StartDate'), 'Non-manually scheduled project allows to edit its start date');
      t.notOk(store.getNodeById('Normal').isEditable('EndDate'), 'Non-manually scheduled project doesn`t allow to edit its end date');
  })
   t.it('Assert that project end date field "editability" depends on the project "ManuallyScheduled" value (for backward scheduling)', function (t) {
       var store = t.getTaskStore({
          DATA : [
              t.getProject({
                  Name              : 'Manual',
                  ManuallyScheduled : true,
                  ScheduleBackwards : true
              }),
              t.getProject({
                  Name              : 'Normal',
                  ScheduleBackwards : true
              })
          ]
      });
       t.ok(store.getNodeById('Manual').isEditable('StartDate'), 'Manually scheduled project allows to edit its start date');
      t.ok(store.getNodeById('Manual').isEditable('EndDate'), 'Manually scheduled project allows to edit its end date');
      t.notOk(store.getNodeById('Normal').isEditable('StartDate'), 'Non-manually scheduled project doesn`t allow to edit its start date');
      t.ok(store.getNodeById('Normal').isEditable('EndDate'), 'Non-manually scheduled project allows to edit its end date');
  })
   t.it('Assert project setStartDate(), setStartEndDate() when scheduleByConstraints is enabled', function (t) {
       var store = t.getTaskStore({
          scheduleByConstraints : true,
          projectStartDate      : '2018-02-05',
           DATA : [
              t.getProject({
                  Name      : 'Project',
                  StartDate : '2018-02-08',
                  EndDate   : '2018-02-09',
                  expanded  : true,
                  children  : [
                      {
                          StartDate : '2018-02-08',
                          Duration  : 1,
                          leaf      : true
                      }
                  ]
              })
          ]
      });
       var project = store.getNodeById('Project');
       project.setStartDate(new Date(2018, 1, 7))
       t.is(project.getStartDate(), new Date(2018, 1, 7), 'proper start date');
      t.notOk(project.getConstraintType(), 'no constraint');
      t.notOk(project.getConstraintDate(), 'no constraint date');
       project.setStartEndDate(new Date(2018, 1, 6), new Date(2018, 1, 7))
       t.is(project.getStartDate(), new Date(2018, 1, 6), 'proper start date');
      t.notOk(project.getConstraintType(), 'no constraint');
      t.notOk(project.getConstraintDate(), 'no constraint date');
  })
  */
});