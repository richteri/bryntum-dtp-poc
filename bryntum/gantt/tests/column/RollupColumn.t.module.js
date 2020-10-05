import { RollupColumn } from '../../build/gantt.module.js';

StartTest((t) => {
    let gantt;

    t.beforeEach((t) => {
        gantt && gantt.destroy();
    });

    t.it('Should render properly', (t) => {
        gantt = t.getGantt({
            id       : 'gantt',
            columns  : [
                { type : RollupColumn.type }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            next => {
                t.selectorExists('[data-id=21] [data-column=rollup] input[type=checkbox]:not(:checked)', 'Preparation not checked');
                t.selectorExists('[data-id=22] [data-column=rollup] input[type=checkbox]:checked', 'Choose technology checked');
            }
        );
    });

    t.it('Should change rollup property', (t) => {
        gantt = t.getGantt({
            id       : 'gantt',
            columns  : [
                { type : RollupColumn.type }
            ]
        });

        t.chain(
            { click : '[data-index=2] [data-column=rollup]' },

            (next) => {
                t.is(gantt.taskStore.getAt(2).rollup, true, 'Switched to true');
            }
        );
    });
});
