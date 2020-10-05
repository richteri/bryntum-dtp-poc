
StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    // copied from tests/features/ColumnLines.t.js
    function assertColumnLines(t) {
        t.is(document.querySelector('.b-sch-background-canvas').offsetWidth,
            // In IE11 rows width does not match timeaxis width, but because it does not seem to affect functionality
            // I will not dig deeper into it at this point. Instead checking cells width here
            document.querySelector('.b-sch-timeaxis-cell').offsetWidth, 'Background canvas width is ok');
    }

    // https://app.assembla.com/spaces/bryntum/tickets/9027
    t.it('ColumnLines feature should work in Gantt', t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            height    : 400,
            startDate : new Date(2017, 0, 1),
            endDate   : new Date(2017, 5, 1),
            features  : {
                columnLines : true
            }
        });

        t.chain(
            { waitForSelector : '.b-gantt-task' },

            () => {
                assertColumnLines(t);
            }
        );
    });
});
