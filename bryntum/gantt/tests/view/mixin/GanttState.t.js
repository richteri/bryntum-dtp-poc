StartTest(t => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should restore state', t => {
        gantt = t.getGantt({
            startDate : null,
            endDate   : null
        });

        const { startDate, endDate } = gantt;

        // eslint-disable-next-line no-self-assign
        gantt.state = gantt.state;

        t.is(gantt.startDate, startDate, 'Gantt start is ok');
        t.is(gantt.endDate, endDate, 'Gantt end is ok');
    });

    t.it('Should restore zoom level', async t => {
        gantt = t.getGantt();

        // change tick size
        gantt.tickSize *= 2;

        const {
            state,
            tickSize,
            startDate,
            endDate,
            viewportCenterDate
        } = gantt;

        gantt.tickSize += 50;

        // eslint-disable-next-line no-self-assign
        gantt.state = state;

        t.is(gantt.tickSize, tickSize, 'Tick size is ok');
        t.is(gantt.startDate, startDate, 'Start is ok');
        t.is(gantt.endDate, endDate, 'End is ok');
        t.is(gantt.viewportCenterDate, viewportCenterDate, 'Center date is ok');
    });
});
