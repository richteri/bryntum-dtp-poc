import { ManuallyScheduledColumn } from '../../build/gantt.module.js';

StartTest((t) => {
    let gantt;

    t.beforeEach((t) => {
        gantt && gantt.destroy();
    });

    t.it('Should be possible to edit event mode', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : ManuallyScheduledColumn.type, width : 80 }
            ]
        });

        const task = gantt.taskStore.getAt(5);

        t.chain(
            { waitForRowsVisible : gantt },

            { click : '[data-index=5] [data-column=manuallyScheduled] .b-checkbox' },

            next => {
                t.is(task.manuallyScheduled, true, 'Manually scheduled mode changed');

                // remove dependency to make sure the task won't fallback
                gantt.dependencyStore.remove(task.predecessors[0]);

                task.propagate().then(() => {
                    t.is(task.startDate, new Date(2017, 0, 26), 'start date is correct');
                    next();
                });
            },

            { click : '[data-index=5] [data-column=manuallyScheduled] .b-checkbox' },

            { waitForPropagate : task },

            () => {
                t.is(task.manuallyScheduled, false, 'Manually scheduled mode changed back');
                t.is(task.startDate, new Date(2017, 0, 24), 'Start date is correct');
            }
        );
    });
});
