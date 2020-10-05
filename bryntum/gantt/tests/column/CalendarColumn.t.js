import DurationColumn from '../../lib/Gantt/column/DurationColumn.js';
import CalendarColumn from '../../lib/Gantt/column/CalendarColumn.js';
import StartDateColumn from '../../lib/Gantt/column/StartDateColumn.js';

StartTest((t) => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should change task calendar', (t) => {

        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : CalendarColumn.type },
                { type : StartDateColumn.type },
                { type : DurationColumn.type }
            ]
        });

        const project = gantt.project;

        let task = project.getEventStore().getById(11),
            originalEnd;

        t.chain(
            { waitForPropagate : project },

            next => {
                originalEnd = task.endDate;
                next();
            },

            { click : '.id11 [data-column=calendar]' },

            { type : '[ENTER]b[ENTER][ENTER]', desc : 'Picked business calendar' },

            { waitForSelector : '.id11 [data-column=calendar]:contains(Business)' },

            (next) => {
                const calendar = task.getCalendarManagerStore().getById('business');

                t.is(task.calendar, calendar, 'Task calendar is ok');
                next();
            },

            { click : '.id11 [data-column=calendar]' },

            next => {
                const input = document.querySelector('input[name=calendar]');
                t.is(input.value, 'Business', 'Calendar value is ok');
                next();
            },

            { click : '.b-icon-remove' },

            { type : '[ENTER]' },

            { waitForPropagate : project },

            next => {
                t.is(task.endDate, originalEnd, 'Task end date is ok');
                t.is(task.calendar.id, project.defaultCalendar.id, 'Task calendar removed');
                next();
            }
        );
    });
});
