import '../../lib/Scheduler/feature/TimeRanges.js';
import '../../lib/Gantt/feature/ProjectLines.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show time ranges from the project timeRangeStore', t => {
        const project = t.getProject({ calendar : 'general' });

        project.timeRangeStore.add({
            startDate : '2017-01-18',
            name      : 'Cool line'
        });

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : new Date(2017, 0, 15),
            endDate   : new Date(2017, 1, 10),
            features  : {
                timeRanges     : true,
                projectLines   : true,
                nonWorkingTime : true
            },
            project
        });

        t.chain(
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Cool line)', desc : 'Cool line has appeared' },
            { diag : 'Make sure project lines are also visible' },
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project start)', desc : 'Project start line has appeared' },
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project end)', desc : 'Project end line has appeared' },

            (next) => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 8, '8 weekends in header');
                t.selectorCountIs('.b-grid-headers .b-sch-timerange.b-sch-range', 8, '8 weekend range elements in header');
                t.selectorCountIs('.b-grid-headers .b-sch-timerange.b-sch-line', 3, '3 lines in header, Cool line + project start/end');

                project.timeRangeStore.add({
                    startDate : '2017-01-22',
                    name      : 'Awesome line'
                });

                next();
            },
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Awesome line)', desc : 'Awesome line has appeared' },
            () => {
                t.selectorExists('.b-grid-headers .b-sch-line label:contains(Cool line)', 'Cool line also visible');
            }

        );
    });
});
