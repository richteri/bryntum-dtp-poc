import '../../lib/Gantt/column/NameColumn.js';
import '../../lib/Gantt/column/PercentDoneColumn.js';

StartTest(t => {

    const gantt = t.getGantt({
        appendTo : document.body,

        id : 'gantt',

        columns : [
            { type : 'name' },
            // IMPORTANT TODO: Remove width from this to check the scrollbar appearing/disappearing
            // feedback loop. With that, the insistence by Mats that we always *round* the
            // calculated tick width results in an infinite feedback loop.
            // It calculates tick width 20, which narrows the timeAxis, which shows no
            // scrollbars which results in a resize, and then the mistake is made, it calculates
            // the tickSize as 21 which causes a horizontal scrollbar which causes a vertical
            // scrollbar, so the width shrinks, and a resize fires and the tick with drops back to 20
            // and round we go forever.
            { type : 'percentdone', width : 80 }
        ]
    });

    t.chain(
        { waitForRowsVisible : gantt },

        next => {
            t.selectorExists('[data-index=2] [data-column=percentDone]:textEquals(70%)', 'Cell rendered correctly');
            next();
        },

        { dblClick : '[data-index=2] [data-column=percentDone]' },

        { type : '60[ENTER]', clearExisting : true },

        next => {
            const bar = document.querySelector('.id11 .b-gantt-task-percent');
            t.is(bar.style.width, '60%', 'Percent bar updated');
            next();
        },

        // Cannot edit parent
        { dblClick : '.b-tree-parent-row [data-column=percentDone]' },

        () => {
            t.selectorNotExists('.b-editor', 'Editor not shown for parent task');
        }
    );
});
