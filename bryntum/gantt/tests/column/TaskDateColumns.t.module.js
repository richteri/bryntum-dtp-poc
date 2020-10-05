import { DateHelper } from '../../build/gantt.module.js';

StartTest(t => {

    let gantt;

    t.beforeEach(t => {
        gantt && !gantt.isDestroyed && gantt.destroy();

        gantt = t.getGantt({
            appendTo : document.body,

            id : 'gantt',

            columns : [
                { type : 'startdate' },
                { type : 'enddate' }
            ]
        });

    });

    t.it('Should use Gantt#displayDateFormat by default', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                const
                    start = DateHelper.format(gantt.taskStore.first.startDate, gantt.columns.getAt(1).format),
                    end   = DateHelper.format(gantt.taskStore.first.endDate, gantt.columns.getAt(1).format);

                t.selectorExists(`.id1000 [data-column=startDate]:textEquals(${start})`, 'Start date rendered correctly');
                t.selectorExists(`.id1000 [data-column=endDate]:textEquals(${end})`, 'End date rendered correctly');
            }
        );
    });

    t.it('Should update when Gantt#displayDateFormat changes', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.displayDateFormat = 'L';

                const
                    start = DateHelper.format(gantt.taskStore.first.startDate, gantt.columns.getAt(1).format),
                    end   = DateHelper.format(gantt.taskStore.first.endDate, gantt.columns.getAt(1).format);

                t.selectorExists(`.id1000 [data-column=startDate]:textEquals(${start})`, 'Start date rendered correctly');
                t.selectorExists(`.id1000 [data-column=endDate]:textEquals(${end})`, 'End date rendered correctly');
            }
        );
    });

    t.it('Should be able to specify explicit format', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.columns.get('startDate').format = 'YYYY';

                const
                    start = gantt.taskStore.first.startDate.getFullYear(),
                    end   = gantt.getFormattedDate(gantt.taskStore.first.endDate);

                t.selectorExists(`.id1000 [data-column=startDate]:textEquals(${start})`, 'Start date rendered correctly');
                t.selectorExists(`.id1000 [data-column=endDate]:textEquals(${end})`, 'End date rendered correctly');
            }
        );
    });
});
