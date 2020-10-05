/* global ProjectModel */
const getProject = (config = {}) => {
    return new ProjectModel(Object.assign({
        eventsData : [
            {
                id        : 1,
                startDate : new Date(2011, 6, 1),
                endDate   : new Date(2011, 6, 5),
                baselines : [{}]
            },
            {
                id        : 123,
                startDate : new Date(2011, 6, 15),
                endDate   : new Date(2011, 6, 23),
                baselines : [{}],

                children : [
                    {
                        id        : 2,
                        startDate : new Date(2011, 6, 16),
                        endDate   : new Date(2011, 6, 20),
                        baselines : [{}]
                    },
                    {
                        id        : 3,
                        startDate : new Date(2011, 6, 18),
                        endDate   : new Date(2011, 6, 22),
                        baselines : [{
                            // Task id 3 has slipped by one day from its baseline end date of
                            // 21 Jul and 16 days. It ends on 22nd with 17 days.
                            endDate  : new Date(2011, 6, 21),
                            duration : 16
                        }]
                    }
                ]
            },
            {
                id        : 4,
                startDate : new Date(2011, 6, 25),
                endDate   : new Date(2011, 6, 28),
                baselines : [{}]
            },
            {
                id        : 5,
                startDate : new Date(2011, 6, 28),
                endDate   : new Date(2011, 6, 28),
                baselines : [{}]
            },
            {
                id        : 6,
                startDate : new Date(2011, 6, 28),
                duration  : 0,
                baselines : [{}]
            }
        ],

        dependenciesData : [
            {
                fromEvent : 1,
                toEvent   : 2
            },
            {
                fromEvent : 1,
                toEvent   : 3
            },
            {
                fromEvent : 2,
                toEvent   : 4
            },
            {
                fromEvent : 3,
                toEvent   : 4
            },
            {
                fromEvent : 4,
                toEvent   : 5
            }
        ]
    }, config));
};

StartTest(t => {

    //https://github.com/bryntum/support/issues/142
    t.it('Should be possible to add a copy of an unscheduled task', async t => {
        const project = new ProjectModel();

        const
            original = project.taskStore.rootNode.appendChild({ name : 'New' }),
            copy     = project.taskStore.rootNode.appendChild(original.copy());

        // Should not throw Graph cycle exception
        await project.propagate();

        t.is(project.taskStore.rootNode.children.length, 2);
        t.is(copy.originalInternalId, original.internalId);
    });

    t.it('getById should work even when root is collapsed', t => {
        const project       = new ProjectModel();

        const eventStore    = project.eventStore;

        eventStore.add([
            {
                id : 'parent',

                expanded : false,

                children : [
                    {
                        id : 'child'
                    }
                ]
            }
        ]);

        t.ok(eventStore.getById('child'), 'Record found');
    });

    t.it('Phantom checks', t => {
        const project       = new ProjectModel();

        const eventStore    = project.eventStore;

        const [event1] = eventStore.add([
            {
                id : 1
            }
        ]);

        t.notOk(event1.hasGeneratedId, 'Newly added task with an Id should not be a phantom');
        t.ok(event1.appendChild({ }).hasGeneratedId, 'Newly added task should be a phantom');
    });

    // region Milestone

    t.it('Milestones', async t => {
        const project       = getProject();

        await project.propagate();

        const eventStore    = project.eventStore;

        const event5        = eventStore.getById(5);
        const event6        = eventStore.getById(6);

        t.ok(event5.milestone, 'Same start and end date is a milestone');
        t.ok(event6.milestone, 'A milestone can be a task with a startdate and 0 duration');
    });

    // t.it('Does not set end date of milestone less than its start date', t => {
    //     const task6 = getDataSet().taskStore.getById(6);
    //
    //     t.is(task6.startDate, new Date(2011, 6, 28), 'Correct start date');
    //     t.is(task6.endDate, new Date(2011, 6, 28), 'Correct end date');
    //
    //     t.throwsOk(() => {
    //         task6.setEndDate(new Date(2011, 6, 26), false);
    //     }, 'Negative duration', 'Trying to set end date before start date throws');
    //
    //     // Ext Gantt expected unmodified date, but vanilla throws
    //     //t.is(task6.startDate, new Date(2011, 6, 28), 'Start date is the same');
    //     //t.is(task6.endDate, new Date(2011, 6, 28), 'End date is the same');
    // });

    t.it('Should be possible to convert a task to be a milestone', async t => {
        const project       = new ProjectModel();

        const eventStore    = project.eventStore;

        const [event1] = eventStore.add([
            {
                startDate : new Date(2013, 6, 24),
                duration  : 2
            }
        ]);

        await project.propagate();

        t.notOk(event1.milestone, 'Not a milestone');

        await event1.convertToMilestone();

        t.ok(event1.milestone, 'Now a milestone');
        t.is(event1.startDate, new Date(2013, 6, 24), 'Milestone at the original task end date');
    });

    t.it('Should not produce any side effects to convert a milestone to be a milestone', async t => {
        const project       = new ProjectModel();

        const eventStore    = project.eventStore;

        const [event1] = eventStore.add([
            {
                startDate : new Date(2013, 6, 26),
                duration  : 0
            }
        ]);

        await project.propagate();

        t.ok(event1.milestone, 'Originally a milestone');

        await event1.convertToMilestone();

        t.ok(event1.milestone, 'Still a milestone');
        t.is(event1.startDate, new Date(2013, 6, 26), 'Milestone at the original task end date');
    });

    t.it('Should not crash if converting a blank task to a milestone', async t => {
        const project       = new ProjectModel({
            startDate : new Date(2019, 5, 4)
        });

        const eventStore    = project.eventStore;

        const [event1] = eventStore.add([
            {
            }
        ]);

        const done          = t.livesOkAsync('No exception thrown');

        await event1.convertToMilestone();

        done();
    });

    t.it('Should be able to convert milestone to regular task', async t => {
        const project       = new ProjectModel();

        const eventStore    = project.eventStore;

        const [event1]        = eventStore.add([
            {
                startDate : new Date(2013, 6, 24),
                duration  : 0
            }
        ]);

        await project.propagate();

        t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
        t.is(event1.endDate, new Date(2013, 6, 24), 'End ok');

        await event1.convertToRegular();

        t.is(event1.duration, 1, 'duration 1');
        t.is(event1.startDate, new Date(2013, 6, 24), 'Start ok');
        t.is(event1.endDate, new Date(2013, 6, 25), 'End ok');
    });

    //endregion

    t.it('Task baselines', async t => {
        const project = getProject();

        await project.propagate();

        const eventStore = project.eventStore;

        for (const task of eventStore) {
            const b0 = task.baselines.first;

            // Task id 3 has slipped by one day from its baseline end date of
            // 21 Jul and 16 days.
            if (task.id === 3) {
                t.is(b0.startDate, task.startDate);
                t.is(b0.endDate,   new Date(2011, 6, 21));
                t.is(b0.duration,  16);
            }
            else {
                t.is(b0.startDate, task.startDate);
                t.is(b0.endDate,   task.endDate);
                t.is(b0.duration,  task.duration);
            }
        }
    });

    t.it('Should clean idmap when store is cleared', t => {
        const project = getProject();

        const { eventStore } = project;

        eventStore.removeAll();

        eventStore.add({ id : 1, name : 'test' });

        t.is(eventStore.getById(1).name, 'test', 'Event name is ok');
    });

    t.it('should expose fields from data', t => {
        const project = new ProjectModel({
            tasksData : [
                { id : 1, startDate : new Date(2020, 0, 10), duration : 5, name : 'Task 1', status : 'custom' },
                { id : 2, startDate : new Date(2020, 0, 10), duration : 5, name : 'Task 2', status : 'none' }
            ]
        });

        t.is(project.taskStore.first.status, 'custom', 'Exposed for first record');
        t.is(project.taskStore.last.status, 'none', 'Exposed for last record');
    });

    t.it('should send all fields if writeAllFields is true', async t => {
        const project = new ProjectModel({
            writeAllFields : true,
            tasksData      : [
                { id : 1, startDate : new Date(2020, 0, 10), duration : 5, name : 'Task 1' }
            ]
        });
        await project.propagate();
        project.firstChild.clearChanges();

        project.firstChild.name = 'boo';

        const
            pack             = project.getChangeSetPackage(),
            taskDataToBeSent = pack.tasks.updated[0];

        t.is(pack.tasks.updated.length, 1, 'One task changed');

        t.isDeeply(taskDataToBeSent.startDate, new Date(2020, 0, 10), 'non-changed startDate field included');
        t.isDeeply(taskDataToBeSent.duration, 5, 'non-changed duration field included');
    });

    t.it('Should clear cached startDateMS + endDateMS values on project commit', async t => {
        const
            project = new ProjectModel({
                calendarsData : [{
                    id           : 'business',
                    name         : 'Business',
                    hoursPerDay  : 8,
                    daysPerWeek  : 5,
                    daysPerMonth : 20,
                    intervals    : [
                        {
                            recurrentStartDate : 'every weekday at 17:00',
                            recurrentEndDate   : 'every weekday at 08:00',
                            isWorking          : false
                        }
                    ]
                }],
                tasksData : [
                    { id : 1, startDate : new Date(2020, 3, 15), duration : 3, name : 'Task 1' }
                ]
            }),
            task    = project.firstChild;

        await project.propagate();
        task.clearChanges();

        project.on({
            commit : () => {
                t.ok(task.startDate.getHours(), 8, 'Start date now on business time');
                t.ok(task.endDate.getHours(), 17, 'End date now on business time');
                t.is(task.startDate.getTime(), task.startDateMS, 'equal start');
                t.is(task.endDate.getTime(), task.endDateMS, 'equal end');
            }
        });

        t.is(task.startDate, new Date(2020, 3, 15), 'correct initial start');
        t.is(task.endDate, new Date(2020, 3, 18), 'correct initial end');

        t.is(task.startDate.getTime(), task.startDateMS, 'correct cache start value initially');
        t.is(task.endDate.getTime(), task.endDateMS, 'correct cache end value initially');

        task.calendar = 'business';
        await project.propagate();
    });
});
