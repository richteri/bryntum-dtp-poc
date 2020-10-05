import { AjaxHelper, TimeUnit, SchedulingMode, ConstraintType } from '../../build/gantt.module.js';

/* global ProjectModel */
StartTest(function(t) {

    const
        // get test descriptor (it has backend sync/load/reset URLs used in the test)
        testConfig     = t.harness.getScriptDescriptor(t.url),
        // the demo configuration file targeting proper database
        { configFile } = testConfig;

    if (configFile === 'FAILURE') {
        t.exit('Configuration file not found');
    }

    let calendarManager, resourceStore, assignmentStore, dependencyStore, taskStore;

    function findByName(store, name) {
        let result = null;

        store.forEach((record) => {
            if (record.name === name) {
                result = record;
                return false;
            }
        });

        return result;
    }

    const
        task     = name => findByName(taskStore, name),
        calendar = name => findByName(calendarManager, name),
        resource = name => findByName(resourceStore, name);

    let project;

    // drop the database after the test finishes
    t.onTearDown(callback => {
        fetch(`../examples/php/php/drop.php?config=${configFile}`).then(callback);
    });

    t.beforeEach((t, next) => {

        project = new ProjectModel({
            startDate : '2019-01-14',
            transport : {
                load : {
                    url       : testConfig.loadUrl,
                    method    : 'GET',
                    paramName : 'q',
                    params    : {
                        config : configFile
                    }
                },
                sync : {
                    url    : testConfig.syncUrl,
                    method : 'POST',
                    params : {
                        config : configFile
                    }
                }
            },
            listeners : {
                loadfail : ({ responseText }) => t.fail(`Loading failed (listener). responseText=${responseText}`)
            }
        });

        calendarManager = project.calendarManagerStore;
        taskStore       = project.eventStore;
        resourceStore   = project.resourceStore;
        assignmentStore = project.assignmentStore;
        dependencyStore = project.dependencyStore;

        AjaxHelper.get(`${testConfig.resetUrl}?config=${configFile}`)
            .then(next)
            .catch(() => t.fail('Reset failed'));

    }, true);

    function noChangesAssertions(t) {
        t.notOk(project.crudStoreHasChanges(), 'project has no changes');

        t.notOk(calendarManager.removed.count, 'No removed calendars');
        t.notOk(calendarManager.modified.count, 'No modified calendars');

        t.notOk(resourceStore.removed.count, 'No removed resources');
        t.notOk(resourceStore.modified.count, 'No modified resources');

        t.notOk(assignmentStore.removed.count, 'No removed assignments');
        t.notOk(assignmentStore.modified.count, 'No modified assignments');

        t.notOk(dependencyStore.removed.count, 'No removed dependencies');
        t.notOk(dependencyStore.modified.count, 'No modified dependencies');

        t.notOk(taskStore.removed.count, 'No removed tasks');
        t.notOk(taskStore.modified.count, 'No modified tasks');
    }

    t.it('Should be possible to save some resources, assignments, dependencies and tasks', function(t) {

        function checkProperties(obj, pattern, desc) {
            for (var key in Object.keys(pattern)) {
                if (!t.compareObjects(obj[key], pattern[key], false, true)) {
                    t.is(obj[key], pattern[key], `${desc} [${key} field]`);
                }
            }
        }

        const taskConfig = {
            effort            : 1,
            effortUnit        : TimeUnit.Day,
            note              : 'Test note',
            constraintType    : ConstraintType.FinishNoEarlierThan,
            constraintDate    : new Date(2019, 0, 8),
            manuallyScheduled : true
        };

        let general, subGeneral;

        t.chain(
            async() => {
                t.diag('Adding records');

                general = calendarManager.add({
                    name         : 'General',
                    daysPerMonth : 30,
                    daysPerWeek  : 7,
                    hoursPerDay  : 24
                })[0];

                subGeneral = general.appendChild({
                    name         : 'Sub General',
                    daysPerMonth : 30,
                    daysPerWeek  : 7,
                    hoursPerDay  : 24
                })[0];

                // TODO: calendar intervals persisting is not implemented yet
                // general.addInterval({ 'Date' : new Date(2019, 0, 1) });
                // subGeneral.addIntervals([{ 'Date' : new Date(2019, 0, 2) }, { 'Date' : new Date(2019, 0, 3) }]);

                await project.setCalendar(general);

                const [resource1, resource2] = resourceStore.add([
                    { name : 'resource1', calendar : subGeneral.id },
                    { name : 'resource2' },
                    { name : 'resource3' }
                ]);

                const [task1, task2, task3] = taskStore.add([
                    Object.assign({
                        name      : 'task1',
                        startDate : new Date(2019, 0, 8),
                        duration  : 2
                    }, taskConfig),
                    {
                        name      : 'task2',
                        startDate : new Date(2019, 0, 5, 8),
                        duration  : 2
                    },
                    {
                        name      : 'task3',
                        startDate : new Date(2019, 0, 7, 8),
                        duration  : 2,
                        calendar  : subGeneral.id
                    }
                ]);

                await task1.assign(resource1, 50);
                await task1.assign(resource2, 100);
                await task2.assign(resource1, 50);

                dependencyStore.add([
                    { fromEvent : task1, toEvent : task2 },
                    { fromEvent : task2, toEvent : task3 }
                ]);

                await project.propagate().catch(() => t.fail('Propagate failed'));
            },

            { diag : 'Calling sync' },

            async() => {
                general.idBeforeSync    = general.id;
                subGeneral.idBeforeSync = subGeneral.id;
                await project.sync().catch(({ responseText }) => t.fail(`Sync failed ${responseText}`));
            },

            { diag : 'Checking records' },

            async() => {
                noChangesAssertions(t);

                const resource1 = resource('resource1'),
                    resource2   = resource('resource2'),
                    resource3   = resource('resource3'),
                    task1       = task('task1'),
                    task2       = task('task2'),
                    task3       = task('task3');

                checkProperties(task1, taskConfig, 'task1 fields are correct after sync');

                t.ok(general.id, 'general calendar has Id filled');
                t.ok(subGeneral.id, 'subGeneral calendar has Id filled');
                t.isnt(general.id, general.idBeforeSync, 'general calendar Id was updated');
                t.isnt(subGeneral.id, subGeneral.idBeforeSync, 'subGeneral calendar Id was updated');

                t.is(resource1.calendar, subGeneral, 'Resource resource1 has proper calendar');
                t.is(task3.calendar, subGeneral, 'task3 has proper calendar');

                t.ok(resource1.id, 'Resource resource1 has Id filled');
                t.ok(resource2.id, 'Resource resource2 has Id filled');
                t.ok(resource3.id, 'Resource resource3 has Id filled');

                t.isDeeplyUnordered(resource1.assignments.map(a => a.event), [task1, task2], 'Correct resource1 assignments');
                t.isDeeplyUnordered(resource2.assignments.map(a => a.event), [task1], 'Correct resource2 assignments');
                t.ok(task1.getAssignmentFor(resource1), 'task1 getAssignmentFor(resource1) returns an assignment');
                t.ok(task2.getAssignmentFor(resource1), 'task2 getAssignmentFor(resource1) returns an assignment');
                t.ok(task1.getAssignmentFor(resource2), 'task1 getAssignmentFor(resource2) returns an assignment');

                t.is(task2.predecessors.length, 1, 'Correct number of task2 predecessors');
                t.ok(task2.predecessors[0].id, 'Dependency to task2 has Id filled');
                t.is(task2.predecessors[0].fromEvent, task1, 'task2 has task1 predecessor');

                t.is(task3.predecessors.length, 1, 'Correct number of task3 predecessors');
                t.ok(task3.predecessors[0].id, 'Dependency to task3 has Id filled');
                t.is(task3.predecessors[0].fromEvent, task2, 'task3 has task2 predecessor');

                general.idBeforeLoad    = general.id;
                subGeneral.idBeforeLoad = subGeneral.id;

                t.diag('Calling load');

                await project.load().catch(({ responseText }) => t.fail(`Load failed ${responseText}`));
            },

            { diag : 'Checking records' },

            async() => {
                noChangesAssertions(t);
                t.is(project.calendar, calendar('General'), 'project calendar is correct');

                t.is(resourceStore.getCount(), 3, 'Correct number of resources loaded');
                t.is(assignmentStore.getCount(), 3, 'Correct number of assignments loaded');
                t.is(dependencyStore.getCount(), 2, 'Correct number of dependencies loaded');
                t.is(taskStore.getCount(), 3, 'Correct number of tasks loaded');

                const resource1 = resource('resource1'),
                    resource2   = resource('resource2'),
                    resource3   = resource('resource3'),
                    task1       = task('task1'),
                    task2       = task('task2'),
                    task3       = task('task3');

                checkProperties(task1, taskConfig, 'task1 fields are correct after load');

                t.is(general.id, general.idBeforeLoad, 'general calendar Id is correct');
                t.is(subGeneral.id, subGeneral.idBeforeLoad, 'subGeneral calendar Id is correct');

                t.is(resource1.calendar, calendar('Sub General'), 'Resource resource1 has proper calendar');
                t.is(task3.calendar, calendar('Sub General'), 'task3 has proper calendar');

                t.ok(resource1.id, 'Resource resource1 has Id filled');
                t.ok(resource2.id, 'Resource resource2 has Id filled');
                t.ok(resource3.id, 'Resource resource3 has Id filled');

                t.isDeeplyUnordered(resource1.assignments.map(a => a.event), [task1, task2], 'Correct resource1 assignments');
                t.isDeeplyUnordered(resource2.assignments.map(a => a.event), [task1], 'Correct resource2 assignments');
                t.ok(task1.getAssignmentFor(resource1), 'task1 getAssignmentFor(resource1) returns an assignment');
                t.ok(task2.getAssignmentFor(resource1), 'task2 getAssignmentFor(resource1) returns an assignment');
                t.ok(task1.getAssignmentFor(resource2), 'task1 getAssignmentFor(resource2) returns an assignment');

                t.is(task2.predecessors.length, 1, 'Correct number of task2 predecessors');
                t.ok(task2.predecessors[0].id, 'Dependency to task2 has Id filled');
                t.is(task2.predecessors[0].fromEvent, task1, 'task2 has task1 predecessor');

                t.is(task3.predecessors.length, 1, 'Correct number of task3 predecessors');
                t.ok(task3.predecessors[0].id, 'Dependency to task3 has Id filled');
                t.is(task3.predecessors[0].fromEvent, task2, 'task3 has task2 predecessor');
            },

            async() => {
                t.diag('Modifying data');

                const task1   = task('task1'),
                    task2     = task('task2'),
                    task3     = task('task3'),
                    resource1 = resource('resource1'),
                    // resource2 = resource('resource2'),
                    resource3 = resource('resource3');

                // add + edit + remove resources
                resourceStore.add([{ name : 'resource4' }]);
                resource1.name = 'RESOURCE-1';
                resourceStore.remove(resource3);

                // remove + edit assignments
                await task1.unassign(resource1);
                task2.getAssignmentFor(resource1).units = 30;

                // edit 1 dependency and drop another one
                task2.predecessors[0].setLag(1);
                dependencyStore.remove(task('task3').predecessors[0]);

                // edit 1 task and drop another one
                task1.name              = 'TASK-1';
                task1.schedulingMode    = SchedulingMode.FixedDuration;
                task1.effort            = 2;
                task1.effortUnit        = TimeUnit.Hour;
                task1.note              = 'test';
                task1.constraintType    = ConstraintType.StartNoLaterThan;
                task1.constraintDate    = new Date(2019, 0, 11);
                task1.manuallyScheduled = false;
                taskStore.remove(task3);

                await project.propagate().catch(() => t.fail('Propagate failed'));
            },

            async() => {
                t.diag('Calling sync');
                await project.sync().catch(({ responseText }) => t.fail(`Sync failed ${responseText}`));
            },

            async() => {
                t.diag('Checking records');

                noChangesAssertions(t);

                const resource1 = resource('RESOURCE-1'),
                    resource2   = resource('resource2'),
                    resource3   = resource('resource3'),
                    resource4   = resource('resource4'),
                    task1       = task('TASK-1'),
                    task2       = task('task2'),
                    task3       = task('task3');

                t.ok(resource1, 'RESOURCE-1 found');

                t.isDeeply(resource1.assignments.map(a => [a.event, a.units]), [[task2, 30]], 'Correct resource1 assignments');
                t.is(task2.getAssignmentFor(resource1).units, 30, 'task1 getAssignmentFor(resource1) returns an assignment');

                t.is(task2.predecessors[0].lag, 1, 'Correct Lag of dependency');

                t.ok(resource2, 'resource2 found');
                t.notOk(resource3, 'resource3 NOT found');
                t.ok(resource4, 'resource4 found');
                t.ok(resource4.id, 'Resource resource4 has Id filled');

                t.ok(task1, 'TASK-1 found');
                t.notOk(task3, 'task3 not found');

                t.diag('Calling load');

                await project.load().catch(({ responseText }) => t.fail(`Load failed ${responseText}`));
            },

            async() => {
                t.diag('Checking records');
                t.is(resourceStore.getCount(), 3, 'Correct number of resources loaded');
                t.is(assignmentStore.getCount(), 2, 'Correct number of assignments loaded');
                t.is(dependencyStore.getCount(), 1, 'Correct number of dependencies loaded');
                t.is(taskStore.getCount(), 2, 'Correct number of tasks loaded');

                const resource1 = resource('RESOURCE-1'),
                    resource2   = resource('resource2'),
                    resource3   = resource('resource3'),
                    resource4   = resource('resource4'),
                    task1       = task('TASK-1'),
                    task2       = task('task2'),
                    task3       = task('task3');

                checkProperties(task1, {
                    effort            : 2,
                    effortUnit        : TimeUnit.Hour,
                    note              : 'test',
                    constraintType    : ConstraintType.StartNoLaterThan,
                    constraintDate    : new Date(2019, 0, 11),
                    manuallyScheduled : false,
                    schedulingMode    : SchedulingMode.FixedDuration
                }, 'task1 fields are correct after load');

                t.ok(resource1, 'RESOURCE-1 found');
                t.isDeeply(resource1.assignments.map(a => [a.event, a.units]), [[task2, 30]], 'Correct resource1 assignments');
                t.is(task2.predecessors[0].lag, 1, 'Correct Lag of dependency');

                t.ok(resource2, 'resource2 found');
                t.notOk(resource3, 'resource3 NOT found');
                t.ok(resource4, 'resource4 found');
                t.ok(resource4.id, 'Resource resource4 has Id filled');

                t.ok(task1, 'TASK-1 found');
                t.notOk(task3, 'task3 not found');
            }
        );
    });
/*
    t.it('Prevents from persisiting outdated data', function (t) {

        var resourceStore2  = t.getResourceStore({
            data        : []
        });

        var assignmentStore2    = t.getAssignmentStore({
            resourceStore   : resourceStore,
            data            : []
        });

        var dependencyStore2    = t.getDependencyStore({
            data            : []
        });

        var taskStore2          = t.getTaskStore({
            resourceStore   : resourceStore2,
            assignmentStore : assignmentStore2,
            dependencyStore : dependencyStore2,
            data            : []
        });

        var crud2 = Ext.create('Gnt.data.CrudManager', {
            crud2       : true,
            taskStore   : taskStore2,
            transport   : {
                load    : Ext.apply({ method : 'GET', paramName : 'q' }, testConfig.load),
                sync    : Ext.apply({ method : 'POST' }, testConfig.sync)
            },
            listeners   : {
                loadfail    : function () { t.fail('Loading failed'); }
            }
        });

        t.chain(
            setup,

            function (next) {
                crud.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                crud2.load(next, function () { t.fail('Load failed'); });
            },

            function (next) {
                resourceStore.add([{ Name : 'resource1' }, { Name : 'resource2' }]);

                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                resourceStore2.add([{ Name : 'resource3' }, { Name : 'resource4' }]);

                crud2.sync(function(){ t.fail('This sync should be failed'); next(); }, function() { t.pass('Sync successfuly failed'); next(); });
            },

            function () {}
        );
    });

    t.it('Should be possible to save some calendars + resources, assignments, dependencies and tasks', function (t) {
        var crud2;

        t.chain(
            setup,

            function (next) {
                t.diag('Add calendars');

                var general         = calendarManager.getRoot().appendChild({
                    Name                : 'General',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendsAreWorkdays : true,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                var subGeneral       = general.appendChild({
                    Name                : 'Sub General',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendsAreWorkdays : true,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                var subSubGeneral  = subGeneral.appendChild({
                    Name                : 'Sub Sub General',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendsAreWorkdays : true,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                general.getCalendar().add({ 'Date' : new Date(2019, 0, 1) });
                subGeneral.getCalendar().add({ 'Date' : new Date(2019, 0, 2) });
                subGeneral.getCalendar().add({ 'Date' : new Date(2019, 0, 3) });
                subSubGeneral.getCalendar().add({ 'Date' : new Date(2019, 1, 1) });
                subSubGeneral.getCalendar().add({ 'Date' : new Date(2019, 1, 2) });

                t.diag('Call sync');
                crud.sync(
                    function () { next(general, subGeneral, subSubGeneral); },
                    function () { t.fail('Sync failed'); }
                );
            },

            function (next, general, subGeneral, subSubGeneral) {
                t.diag('Check data');
                //check if calendar Id was updated in calendar manager record
                t.ok(general.getId() != general.getPhantomId(), 'general record Id was updated');
                t.ok(subGeneral.getId() != subGeneral.getPhantomId(), 'subGeneral record Id was updated');
                t.ok(subSubGeneral.getId() != subSubGeneral.getPhantomId(), 'general record Id was updated');

                //check if calendar Id was updated in calendar instance
                t.is(general.getCalendar().calendarId, general.getId(), 'general calendarId was updated');
                t.is(subGeneral.getCalendar().calendarId, subGeneral.getId(), 'subGeneral calendarId was updated');
                t.is(subSubGeneral.getCalendar().calendarId, subSubGeneral.getId(), 'subSubGeneral calendarId was updated');

                //check if calendar Id was updated in StoreManager
                t.is(general.getCalendar(), Gnt.data.Calendar.getCalendar(general.getId()), 'general calendar re-registered in StoreManager');
                t.is(subGeneral.getCalendar(), Gnt.data.Calendar.getCalendar(subGeneral.getId()), 'subGeneral calendar re-registered in StoreManager');
                t.is(subSubGeneral.getCalendar(), Gnt.data.Calendar.getCalendar(subSubGeneral.getId()), 'subSubGeneral calendar re-registered in StoreManager');

                //check if days were added to calendar instance
                t.ok(general.getCalendar().getAt(0).getId(), 'general calendar days has filled Id');
                t.ok(subGeneral.getCalendar().getAt(0).getId(), 'subGeneral calendar days has filled Id');
                t.ok(subGeneral.getCalendar().getAt(1).getId(), 'subGeneral calendar days has filled Id');
                t.ok(subSubGeneral.getCalendar().getAt(0).getId(), 'subSubGeneral calendar days has filled Id');
                t.ok(subSubGeneral.getCalendar().getAt(1).getId(), 'subSubGeneral calendar days has filled Id');

                next(general);
            },

            function (next, general) {
                t.diag('Check taskStore with calendarId');

                var generalId   = general.getId();

                //destroy calendar instance
                calendarManager.getRoot().removeChild(general);

                var calendarManager2    = Ext.create('Gnt.data.CalendarManager');

                var taskStore2          = t.getTaskStore({
                    calendarManager : calendarManager2,
                    data            : []
                });

                crud2               = Ext.create('Gnt.data.CrudManager', {
                    calendarManager : calendarManager2,
                    taskStore       : taskStore2,
                    transport   : {
                        load    : Ext.apply({ method : 'GET', paramName : 'q' }, testConfig.load),
                        sync    : Ext.apply({ method : 'POST' }, testConfig.sync)
                    },
                    listeners   : {
                        loadfail    : function () { t.fail('Loading failed'); },
                        syncfail    : function () { t.fail('Persisting failed'); }
                    }
                });

                t.diag('Call load');

                crud2.load(
                    function () { next(generalId, calendarManager2, taskStore2); },
                    function () { t.fail('Load failed'); }
                );
            },

            function (next, generalId, calendarManager2, taskStore2) {
                t.diag('Check records');

                var calendar    = Gnt.data.Calendar.getCalendar(generalId);
                //make sure that calendar created with a proper Id
                t.ok(calendar, 'general calendar registered back');
                t.is(calendar.getCount(), 1, 'calendar has proper number of days');
                t.is(calendarManager2.getNodeById(generalId).getCalendar(), calendar, 'calendar manager has proper record');
                t.is(calendarManager2.getCalendar(generalId), calendar, 'calendar manager has proper record');

                //make sure that task store has it as a calendar
                t.is(taskStore2.calendar, calendar, 'task store has proper calendar');
            }
        );
    });

    t.it('Should be possible to reorder tasks', function (t) {

        t.chain(
            setup,

            {
                desc   : 'Added tasks & sync invoked',
                action : function (next) {
                    taskStore.append({ leaf : true, Name : 'task1', StartDate : new Date(2019, 0, 1), Duration : 2 });
                    taskStore.append({ leaf : true, Name : 'task2', StartDate : new Date(2019, 0, 5), Duration : 2 });
                    taskStore.append({ leaf : true, Name : 'task3', StartDate : new Date(2019, 0, 7), Duration : 2 });

                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },

            {
                desc   : 'Added tasks4 & sync invoked',
                action : function (next) {
                    taskStore.getRoot().insertBefore({ leaf : true, Name : 'task4', StartDate : new Date(2019, 0, 7), Duration : 2 }, task('task2'));
                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },

            function (next) {
                crud.load(next, function () { t.fail('Load failed'); });
            },

            function () {
                t.isDeeply(taskStore.getRoot().childNodes, [ task('task1'), task('task4'), task('task2'), task('task3') ]);
            }
        );
    });

    t.it('Should be possible to change calendar parent', function (t) {
        var root;

        t.chain(
            setup,
            {
                desc   : 'Prepared 2 root calendars',
                action : function (next) {
                    root = calendarManager.getRoot();
                    root.appendChild({ Name : 'cal0' });
                    root.appendChild({ Name : 'cal1' });

                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },
            {
                desc   : 'Changed records & sync invoked',
                action : function (next) {
                    t.notOk(calendarManager.getModifiedRecords().length, 'no non-persisted calendars');

                    var node = root.appendChild({ Name : 'cal2' });
                    node.appendChild(calendar('cal1'));
                    node.insertBefore(calendar('cal0'), calendar('cal1'));
                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },
            {
                desc   : 'load invoked',
                action : function (next) {
                    crud.load(next, function () { t.fail('Load failed'); });
                }
            },
            function () {
                root = calendarManager.getRoot();

                t.is(root.childNodes.length, 1, 'root has proper number of children');
                t.is(root.childNodes[0], calendar('cal2'), 'root has cal2 child');

                // check there is no difference between "cal2.childNodes" and set of calendars: [ cal0, cal1 ]
                // we do not use isDeeply since server side does not guarantee the order of nodes
                t.notOk( Ext.Array.difference(calendar('cal2').childNodes, [ calendar('cal0'), calendar('cal1') ]).length, 'cal2 has proper children');
            }
        );
    });

    t.it('Should be possible to change task parent', function (t) {

        t.chain(
            setup,

            function (next) {
                t.diag('Add tasks');

                var node    = root.appendChild({ Name : 'task1', StartDate : new Date(2019, 0, 1), Duration : 2 });

                node.appendChild({ leaf : true, Name : 'task11', StartDate : new Date(2019, 0, 1), Duration : 2 });
                node.appendChild({ leaf : true, Name : 'task12', StartDate : new Date(2019, 0, 5), Duration : 2 });

                root.appendChild({ Name : 'task2', StartDate : new Date(2019, 0, 5), Duration : 2 })
                    .appendChild([
                        { leaf : true, Name : 'task21', StartDate : new Date(2019, 0, 5), Duration : 2 },
                        { leaf : true, Name : 'task22', StartDate : new Date(2019, 0, 6), Duration : 2 }
                    ]);

                root.appendChild({ leaf : true, Name : 'task3', StartDate : new Date(2019, 0, 7), Duration : 2 })
                    .appendChild({ Name : 'task00', StartDate : new Date(2019, 0, 1), Duration : 2 });

                t.diag('Call sync');
                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                noChangesAssertions(t);

                t.notOk(taskStore.getModifiedRecords().length, 'no non-persisted tasks');

                root.insertBefore({ Name : 'task0', StartDate : new Date(2019, 0, 1), Duration : 2 }, task('task1'));

                taskStore.indent(task('task1'));

                task('task0').insertBefore(task('task00'), task('task1'));

                task('task2').appendChild(task('task11'));

                task('task1').insertBefore(task('task22'), task('task12'));

                task('task1').appendChild(task('task3'));

                t.diag('Call sync');
                crud.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                t.diag('Call load');
                crud.load(next, function () { t.fail('Load failed'); });
            },

            function () {
                t.isDeeply(taskStore.getRoot().childNodes, [ task('task0'), task('task2') ], 'root has proper children');
                t.isDeeply(task('task0').childNodes, [ task('task00'), task('task1') ], 'task0 has proper children');
                t.isDeeply(task('task1').childNodes, [ task('task22'), task('task12'), task('task3') ], 'task1 has proper children');
                t.isDeeply(task('task2').childNodes, [ task('task21'), task('task11') ], 'task2 has proper children');
            }
        );
    });

    t.it('Prevents from removing referenced resources, tasks and calendars', function (t) {

        var crud2;

        t.chain(
            setup,

            function (next) {
                crud2           = Ext.create('Gnt.data.CrudManager', {
                    taskStore   : taskStore,
                    transport   : {
                        load    : Ext.apply({ method : 'GET', paramName : 'q' }, testConfig.load),
                        sync    : Ext.apply({ method : 'POST' }, testConfig.sync)
                    }
                });

                next();
            },

            function (next) {
                t.diag('Add records');

                var mainCalendar        = calendarManager.getRoot().appendChild({
                    Name                : 'calendar',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                var subCalendar1        = mainCalendar.appendChild({
                    Name                : 'subcalendar1',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                var subCalendar2        = mainCalendar.appendChild({
                    Name                : 'subcalendar2',
                    DaysPerMonth        : 30,
                    DaysPerWeek         : 7,
                    HoursPerDay         : 24,
                    WeekendFirstDay     : 6,
                    WeekendSecondDay    : 0,
                    DefaultAvailability : [ '00:00-24:00' ]
                });

                var addedResources  = resourceStore.add({ Name : 'resource', CalendarId : subCalendar1.getId() });

                var task        = new Gnt.model.Task({ leaf : true, Name : 'task', StartDate : new Date(2019, 0, 1, 8), Duration : 2 });
                var subTask     = task.addSubtask(new Gnt.model.Task({ leaf : true, Name : 'subtask', StartDate : new Date(2019, 0, 1, 8), Duration : 2, CalendarId : subCalendar2.getId() }));
                var task2       = new Gnt.model.Task({ leaf : true, Name : 'task2', StartDate : new Date(2019, 0, 1, 8), Duration : 2 });

                taskStore.append(task);
                taskStore.append(task2);

                dependencyStore.add({ From : subTask.getId(), To : task2.getId() });

                addedResources[0].assignTo(subTask, 50);

                t.diag('Call sync');

                crud2.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                t.diag('Prevents removing a calendar having a sub-calendar');

                calendarManager.getRoot().removeChild(calendar('calendar'));

                crud2.sync(function () { t.fail('Sync should fail'); }, function (resp) {
                    t.is(resp.code, 125, 'proper error code returned');

                    t.diag('Load stores');
                    crud2.load(next, function () { t.fail('Load failed'); });
                });
            },

            function (next) {
                t.diag('Prevents removing a calendar referenced by a resource');

                calendar('calendar').removeChild(calendar('subcalendar1'));

                crud2.sync(function () { t.fail('Sync should fail'); }, function (resp) {
                    t.is(resp.code, 126, 'proper error code returned');

                    t.diag('Load stores');
                    crud2.load(next, function () { t.fail('Load failed'); });
                });
            },

            function (next) {
                t.diag('Prevents removing a calendar referenced by a task');

                calendar('calendar').removeChild(calendar('subcalendar2'));

                crud2.sync(function () { t.fail('Sync should fail'); }, function (resp) {
                    t.is(resp.code, 127, 'proper error code returned');

                    t.diag('Load stores');
                    crud2.load(next, function () { t.fail('Load failed'); });
                });
            },

            function (next) {
                t.diag('Doesn`t prevent removing an assigned resource');

                resourceStore.remove(resource('resource'));

                crud2.sync(next, function () { t.fail('Sync failed'); });
            },

            function (next) {
                t.diag('Task removal causes removing of its assignments and dependencies');

                task('task').removeChild(task('subtask'));

                crud2.sync(function (resp) {
                    t.ok(resp.success, 'request succeeded');
                    t.notOk(assignmentStore.getCount(), 'assignment has been removed');
                    t.notOk(dependencyStore.getCount(), 'dependencies has been removed');
                    next();
                }, function () { t.fail('Sync failed'); });
            },

            function () {}
        );

    });

    t.it('Saves nulled task fields', function (t) {

        var checkRecord = function () {
            var task    = taskStore.getRoot().firstChild;

            t.is(task.getId(), 1, 'task: proper id');
            t.is(task.getName(), '', 'task: proper name');
            t.is(task.getStartDate(), null, 'task: proper start date');
            t.is(task.getEndDate(), null, 'task: proper start date');
            t.is(task.getDuration(), null, 'task: proper duration');
        };

        t.chain(
            setup,

            {
                desc   : 'Record added & sync called',
                action : function (next) {
                    taskStore.append({ leaf : true });
                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },

            {
                desc   : 'Record checked & load called',
                action : function (next) {
                    checkRecord();
                    crud.load(next, function () { t.fail('Load failed'); });
                }
            },

            {
                desc   : 'Record checked',
                action : checkRecord
            }
        );
    });

    t.it('Float duration and effort are supported', function (t) {

        var checkRecords = function (duration, effort) {
            t.is(task('foo').getDuration(), duration, 'task "foo" duration is correct');
            t.is(task('bar').getEffort(), effort, 'task "bar" effort is correct');
        };

        t.chain(
            setup,

            {
                desc    : 'Records added & sync invoked',
                action  : function (next) {
                    taskStore.append({ Name : 'foo', Duration : 0.15, leaf : true });
                    taskStore.append({ Name : 'bar', Effort : 0.25, leaf : true });
                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },

            {
                desc    : 'Records checked after sync & load invoked',
                action  : function (next) {
                    checkRecords(0.15, 0.25);
                    crud.load(next, function () { t.fail('Load failed'); });
                }
            },

            {
                desc    : 'Records checked after load',
                action  : function (next) {
                    checkRecords(0.15, 0.25);
                    next();
                }
            },

            {
                desc    : 'Records updated & sync invoked',
                action  : function (next) {
                    task('foo').setDuration(0.55);
                    task('bar').setEffort(0.65);
                    crud.sync(next, function () { t.fail('Sync failed'); });
                }
            },

            {
                desc    : 'Records checked after sync & load invoked',
                action  : function (next) {
                    checkRecords(0.55, 0.65);
                    crud.load(next, function () { t.fail('Load failed'); });
                }
            },

            {
                desc    : 'Records checked after load',
                action  : function () {
                    checkRecords(0.55, 0.65);
                }
            }
        );
    }); */
});
