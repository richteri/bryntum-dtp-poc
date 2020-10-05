import { ConstraintType } from '../../lib/Engine/scheduling/Types.js';
import { EffectResolutionResult } from '../../lib/ChronoGraph/chrono/Effect.js';
import Toast from '../../lib/Core/widget/Toast.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should properly schedule tasks after undo', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id        : 1,
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 2,
                    startDate : '2017-01-17',
                    duration  : 1
                },
                {
                    id        : 3,
                    startDate : '2017-01-18',
                    duration  : 1
                },
                {
                    id        : 4,
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 5,
                    startDate : '2017-01-17',
                    duration  : 1
                },
                {
                    id       : 6,
                    expanded : true,
                    children : [
                        {
                            id        : 61,
                            startDate : '2017-01-18',
                            duration  : 1
                        }
                    ]
                }
            ],
            dependencies : [
                { fromEvent : 1, toEvent : 2 },
                { fromEvent : 2, toEvent : 3 },
                { fromEvent : 4, toEvent : 5 },
                { fromEvent : 5, toEvent : 61 }
            ]
        });

        const stm = gantt.project.getStm();

        // let's track scheduling conflicts happened
        gantt.project.on('schedulingconflict', context => {
            Toast.show('Scheduling conflict has happened ..recent changes were reverted');
            // as the conflict resolution approach let's simply cancel the changes
            context.continueWithResolutionResult(EffectResolutionResult.Cancel);

            t.fail('Scheduling conflict');
        });

        const
            event1 = gantt.taskStore.getById(1),
            event2 = gantt.taskStore.getById(2),
            event5 = gantt.taskStore.getById(5),
            event61 = gantt.taskStore.getById(61);

        t.chain(
            { waitForPropagate : gantt },

            async() => {
                stm.disabled = false;
                stm.autoRecord = true;

                await event2.setConstraint(ConstraintType.StartNoEarlierThan, new Date(2017, 1, 6));
            },

            { waitForEvent : [stm, 'recordingstop'] },

            async() => {
                stm.undo();

                await gantt.project.await('stateRestoringDone');

                t.is(event1.startDate, new Date(2017, 0, 16), 'Event 1 start is ok');
                t.is(event2.startDate, new Date(2017, 0, 17), 'Event 2 start is ok');

                await event1.setConstraint(ConstraintType.StartNoEarlierThan, new Date(2017, 0, 18));
            },

            { waitForEvent : [stm, 'recordingstop'] },

            async() => {
                t.is(event1.startDate, new Date(2017, 0, 18), 'Event 1 start is ok');
                t.is(event2.startDate, new Date(2017, 0, 19), 'Event 2 start is ok');

                await event61.setConstraint(ConstraintType.StartNoEarlierThan, new Date(2017, 1, 6));
            },

            { waitForEvent : [stm, 'recordingstop'] },

            async() => {
                stm.undo();

                await gantt.project.await('stateRestoringDone');

                t.is(event5.startDate, new Date(2017, 0, 17), 'Event 4 start is ok');
                t.is(event61.startDate, new Date(2017, 0, 18), 'Event 51 start is ok');

                await event5.setConstraint(ConstraintType.StartNoEarlierThan, new Date(2017, 0, 20));
            },

            { waitForEvent : [stm, 'recordingstop'] },

            async() => {
                t.is(event5.startDate, new Date(2017, 0, 20), 'Event 4 start is ok');
                t.is(event61.startDate, new Date(2017, 0, 21), 'Event 51 start is ok');
            }
        );
    });

    // https://github.com/bryntum/support/issues/975
    t.it('Should properly update store changes when REMOVE, undo, redo a SUBTASK', t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 2,
                    startDate : '2017-01-16',
                    duration  : 1,
                    expanded  : true,
                    children  : [
                        {
                            id        : 3,
                            startDate : '2017-01-16',
                            duration  : 1
                        }
                    ]
                }
            ]
        });

        const
            { project }   = gantt,
            { taskStore } = project,
            task          = taskStore.getById(3),
            stm           = project.getStm();

        t.chain(
            { waitForPropagate : project },
            next => {
                project.commitCrudStores();

                t.diag('Initial state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.disabled = false;
                stm.startTransaction();

                t.waitForPropagate(project, next);
                taskStore.remove(task);
            },
            next => {
                stm.stopTransaction();

                t.diag('After remove state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 0, 'No modified records found');
                t.is(taskStore.changes.removed.length, 1, '1 removed record found');
                t.is(taskStore.changes.removed[0], task, 'Correct task is removed');

                next();
            },
            async() => {
                stm.undo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After undo state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.redo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After redo state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 0, 'No modified records found');
                t.is(taskStore.changes.removed.length, 1, '1 removed record found');
                t.is(taskStore.changes.removed[0], task, 'Correct task is removed');
            }
        );
    });

    t.it('Should properly update store changes when REMOVE, undo, redo a first level TASK', t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 2,
                    startDate : '2017-01-16',
                    duration  : 1
                }
            ]
        });

        const
            { project }   = gantt,
            { taskStore } = project,
            task          = taskStore.getById(2),
            stm           = project.getStm();

        t.chain(
            { waitForPropagate : project },
            next => {
                project.commitCrudStores();

                t.diag('Initial state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.disabled = false;
                stm.startTransaction();

                t.waitForPropagate(project, next);
                taskStore.remove(task);
            },
            next => {
                stm.stopTransaction();

                t.diag('After remove state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 1, '1 modified record found');
                t.is(taskStore.changes.removed.length, 1, '1 removed record found');
                t.is(taskStore.changes.modified[0], project, 'Project record is modified due to propagation');
                t.is(taskStore.changes.removed[0], task, 'Correct task is removed');

                next();
            },
            async() => {
                stm.undo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After undo state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.redo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After redo state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 1, '1 modified record found');
                t.is(taskStore.changes.removed.length, 1, '1 removed record found');
                t.is(taskStore.changes.modified[0], project, 'Project record is modified due to propagation');
                t.is(taskStore.changes.removed[0], task, 'Correct task is removed');
            }
        );
    });

    t.it('Should properly update store changes when MOVE, undo, redo a first level TASK', t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 2,
                    startDate : '2017-01-16',
                    duration  : 1
                }
            ]
        });

        const
            { project }   = gantt,
            { taskStore } = project,
            task          = taskStore.getById(2),
            stm           = project.getStm();

        t.chain(
            { waitForPropagate : project },
            next => {
                project.commitCrudStores();

                t.diag('Initial state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.disabled = false;
                stm.startTransaction();

                t.waitForPropagate(project, next);
                taskStore.insert(0, task);
            },
            next => {
                stm.stopTransaction();

                t.diag('After remove state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 2, '2 modified records found');
                t.is(taskStore.changes.removed.length, 0, 'No removed records found');
                t.is(taskStore.changes.modified[0], task, 'Task record is modified');
                t.is(taskStore.changes.modified[1], taskStore.getById(1), 'Another task is modified');

                next();
            },
            async() => {
                stm.undo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After undo state');
                t.notOk(taskStore.changes, 'No changes found');

                stm.redo();
                await gantt.project.await('stateRestoringDone');

                t.diag('After redo state');
                t.ok(taskStore.changes, 'Changes found');
                t.is(taskStore.changes.added.length, 0, 'No added records found');
                t.is(taskStore.changes.modified.length, 2, '2 modified records found');
                t.is(taskStore.changes.removed.length, 0, 'No removed records found');
                t.is(taskStore.changes.modified[0], task, 'Task record is modified');
                t.is(taskStore.changes.modified[1], taskStore.getById(1), 'Another task is modified');
            }
        );
    });
});
