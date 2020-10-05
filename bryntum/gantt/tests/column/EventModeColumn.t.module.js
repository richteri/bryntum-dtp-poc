import { EventModeColumn } from '../../build/gantt.module.js';

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
                { type : EventModeColumn.type, width : 80 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            { click : '[data-index=2] [data-column=manuallyScheduled] .b-checkbox' },

            (next) => {
                t.is(gantt.taskStore.getAt(2).manuallyScheduled, true, 'Event mode changed');
                next();
            },

            { click : '[data-index=2] [data-column=manuallyScheduled] .b-checkbox' },

            () => {
                t.is(gantt.taskStore.getAt(2).manuallyScheduled, false, 'Event mode changed back');
            }
        );
    });
});
