import '../../lib/Scheduler/feature/Pan.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    // https://app.assembla.com/spaces/bryntum/tickets/9006
    t.it('Pan feature should work in Gantt', t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            height    : 400,
            startDate : new Date(2017, 0, 1),
            endDate   : new Date(2017, 5, 1),
            features  : {
                pan            : true,
                taskDragCreate : false
            }
        });

        t.firesAtLeastNTimes(gantt.subGrids.normal.scrollable, 'scroll', 1);

        t.chain(
            { drag : '.b-sch-timeaxis-cell', fromOffset : [50, 20], by : [-10, -10] },

            () => {
                t.is(gantt.subGrids.normal.scrollable.x, 10, 'scrolled horizontally to 10');
                t.is(gantt.scrollable.y, 10, 'scrolled vertically to 10');
            }
        );
    });
});
