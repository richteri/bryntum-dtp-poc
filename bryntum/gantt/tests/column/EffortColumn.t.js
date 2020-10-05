import DurationColumn from '../../lib/Gantt/column/DurationColumn.js';
import EffortColumn from '../../lib/Gantt/column/EffortColumn.js';
import DateHelper from '../../lib/Core/helper/DateHelper.js';

StartTest((t) => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    // Here we check that effort column shows the same value which is showed in its editor #950
    t.it('Should use the same value for column rendering and editor', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : DurationColumn.type, width : 150 },
                { type : EffortColumn.type, width : 150 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            (next) => {
                const task = gantt.taskStore.getAt(2),
                    [durationCellEl] = t.query('[data-index=2] [data-column=fullDuration]'),
                    fullDurationRendered = durationCellEl.innerHTML,
                    fullDurationTask = task.fullDuration,
                    [effortCellEl] = t.query('[data-index=2] [data-column=fullEffort]'),
                    fullEffortRendered = effortCellEl.innerHTML,
                    fullEffortTask = task.fullEffort;

                fullDurationTask.unit = DateHelper.parseTimeUnit(fullDurationTask.unit);
                fullEffortTask.unit = DateHelper.parseTimeUnit(fullEffortTask.unit);

                t.ok(durationCellEl, 'Duration cell rendered');
                t.isDeeply(DateHelper.parseDuration(fullDurationRendered), fullDurationTask, 'Duration is rendered properly');
                t.ok(effortCellEl, 'Effort cell rendered');
                t.isDeeply(DateHelper.parseDuration(fullEffortRendered), fullEffortTask, 'Effort is rendered properly');

                next(fullEffortRendered);
            },

            { dblClick : '[data-index=2] [data-column=fullEffort]' },

            (next, clickedCellEl) => {
                const [editorInputEl] = t.query('.b-cell-editor input');

                t.is(editorInputEl.value, clickedCellEl.textContent, 'Editor value is correct');
            }
        );
    });

    t.it('Should changed effort value using editor', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : EffortColumn.type, width : 150 }
            ]
        });

        t.chain(

            { dblClick : '[data-index=2] [data-column=fullEffort]' },

            { type : '100 m' },

            next => {
                const task = gantt.taskStore.getAt(2);

                t.is(task.effort, 100, 'Effort has been changed correctly');
                t.is(task.effortUnit, 'minute', 'Effort unit has been changed correctly');

                next();
            },

            // Cannot edit parent
            { dblClick : '.b-tree-parent-row [data-column=fullEffort]' },

            () => {
                t.selectorNotExists('.b-editor', 'Editor not shown for parent task');
            }
        );
    });
});
