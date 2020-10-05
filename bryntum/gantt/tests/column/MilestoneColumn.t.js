import MilestoneColumn from '../../lib/Gantt/column/MilestoneColumn.js';

StartTest((t) => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.describe('Milestone column based on checkbox', (t) => {
        t.it('Should render properly', (t) => {
            gantt = t.getGantt({
                appendTo : document.body,
                id       : 'gantt',
                columns  : [
                    { type : MilestoneColumn.type, width : 80 }
                ]
            });

            t.chain(
                { waitForRowsVisible : gantt },

                next => {
                    t.selectorExists('[data-index=2] [data-column=milestone] .b-checkbox', 'Cell rendered correctly');
                    t.selectorExists('[data-index=5] [data-column=milestone] .b-checkbox input:checked', 'Cell rendered correctly');
                    next();
                }
            );
        });

        t.it('Should change milestone property', (t) => {
            gantt = t.getGantt({
                appendTo : document.body,
                id       : 'gantt',
                columns  : [
                    { type : MilestoneColumn.type, width : 80 }
                ]
            });

            t.chain(
                { waitForRowsVisible : gantt },

                { click : '[data-index=2] [data-column=milestone] .b-checkbox' },

                async() => gantt.project.waitForPropagateCompleted(),

                next => {
                    t.ok(gantt.taskStore.getAt(2).milestone, 'Milestone status changed');
                    next();
                },

                { click : '[data-index=2] [data-column=milestone] .b-checkbox' },

                async() => gantt.project.waitForPropagateCompleted(),

                next => {
                    t.notOk(gantt.taskStore.getAt(2).milestone, 'Milestone status changed back');
                    next();
                }
            );
        });
    });
});
