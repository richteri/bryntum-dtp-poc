import '../../lib/Gantt/feature/ProjectLines.js';
import '../../lib/Gantt/column/AllColumns.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import Gantt from '../../lib/Gantt/view/Gantt.js';

StartTest(t => {
    let gantt;

    window.AjaxHelper = AjaxHelper;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show project lines by default', t => {
        gantt = t.getGantt({
            columns : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ]
        });

        t.chain(
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project start)' },
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project end)' }
        );
    });

    t.it('Should not show project lines initially if disabled', t => {
        gantt = t.getGantt({
            features : {
                projectLines : false
            },

            columns : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');
            }
        );
    });

    t.it('Should not render project lines if disabled',  t => {
        gantt = t.getGantt({
            features : {
                projectLines : true
            },

            columns : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ]
        });

        t.chain(
            { waitForSelector : '.b-grid-headers .b-sch-line label:contains(Project start)' },

            async() => {
                gantt.features.projectLines.disabled = true;
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project start)');
                t.selectorNotExists('.b-grid-headers .b-sch-line label:contains(Project end)');

                await gantt.taskStore.getById(3).shift('days', 10);
                t.selectorNotExists('.b-gantt-project-line');
            }
        );
    });

    t.it('Should update project lines correctly', t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 10
                }
            ],
            features : {
                projectLines : true
            }
        });

        const
            task    = gantt.taskStore.getById(1),
            project = gantt.project;

        function checkDates(startDate, endDate) {
            const
                [start, end] = gantt.features.projectLines.store.getRange();
            t.is(start.startDate, startDate, 'Line start is ok');
            t.is(project.startDate, startDate, 'Project start is ok');
            t.is(end.startDate, endDate, 'Line end is ok');
            t.is(project.endDate, endDate, 'Project end is ok');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-timerange' },
            async() => checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26)),
            async() => {
                await task.setConstraintType('muststarton');
                await task.setConstraintDate('2017-01-17');
                checkDates(new Date(2017, 0, 16), new Date(2017, 0, 27));
            },
            { dblclick : '.b-gantt-task' },
            { click : 'input[name=fullDuration]' },
            { type : '[UP][UP]' },
            async() => checkDates(new Date(2017, 0, 16),  new Date(2017, 0, 29)),
            { click : '.b-popup-close' },
            { waitForSelectorNotFound : '.b-taskeditor-editing' },
            () => checkDates(new Date(2017, 0, 16),  new Date(2017, 0, 27))
        );
    });

    // #8390 https://app.assembla.com/spaces/bryntum/tickets/8390
    t.it('Should update project lines correctly after undo', async t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 10
                }
            ],
            features : {
                projectLines : true
            }
        });

        const
            project = gantt.project,
            stm     = project.getStm();

        let originalProjectStartDate,
            originalProjectEndDate;

        function checkDates(startDate, endDate) {
            const
                [start, end] = gantt.features.projectLines.store.getRange();
            t.is(start.startDate, startDate, 'Line start is ok');
            t.is(project.startDate, startDate, 'Project start is ok');
            t.is(end.startDate, endDate, 'Line end is ok');
            t.is(project.endDate, endDate, 'Project end is ok');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-timerange' },
            { waitFor : 1000 },

            async()  => {
                checkDates(new Date(2017, 0, 16), new Date(2017, 0, 26));
                originalProjectStartDate = project.getStartDate();
                originalProjectEndDate   = project.getEndDate();
            },

            async() => {
                stm.enable();
                stm.startTransaction();
                await project.setStartDate(new Date(2017, 0, 17));
                stm.stopTransaction();
                checkDates(new Date(2017, 0, 17), new Date(2017, 0, 27));
            },

            () => {
                stm.undo();
                checkDates(originalProjectStartDate, originalProjectEndDate);
            }
        );
    });

    t.it('Should support disabling', t => {
        gantt = t.getGantt();

        gantt.features.projectLines.disabled = true;

        t.selectorNotExists('.b-gantt-project-line', 'No project lines');

        gantt.features.projectLines.disabled = false;

        t.selectorExists('.b-gantt-project-line', 'Project line found');
    });

    // https://github.com/bryntum/support/issues/237
    t.it('Should show project lines correctly after initial load', async t => {
        t.mockUrl('data.json', {
            responseText : JSON.stringify({
                success : true,
                tasks   : {
                    rows : [
                        {
                            percentDone  : 0,
                            leaf         : true,
                            duration     : 1,
                            name         : 'New task',
                            id           : 1,
                            durationUnit : 'day',
                            cls          : 'first',
                            startDate    : '2017-01-15T23:00:00.000Z'
                        },
                        {
                            percentDone  : 0,
                            leaf         : true,
                            duration     : 1,
                            name         : 'New task',
                            id           : 2,
                            durationUnit : 'day',
                            cls          : 'last',
                            startDate    : '2017-01-15T23:00:00.000Z'
                        }
                    ]
                },
                dependencies : {
                    rows : [
                        {
                            fromEvent : 1,
                            id        : 1,
                            type      : 2,
                            toEvent   : 2
                        }
                    ]
                },
                resources : {
                    rows : []
                },
                assignments : {
                    rows : []
                },
                project : {
                    calendar  : 'general',
                    startDate : '2020-01-22T20:10:55.000Z'
                }
            }
            )
        });

        gantt = new Gantt({
            appendTo : document.body,
            project  : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : 'data.json'
                    }
                }
            },
            features : {
                projectLines : true
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : 'label:contains(Project start)' },
            { waitForSelector : 'label:contains(Project end)' },

            () => {
                const
                    startLine = t.$('.b-gantt-project-line:contains(start)')[0],
                    endLine   = t.$('.b-gantt-project-line:contains(end)')[0];

                t.is(startLine.getBoundingClientRect().left, document.querySelector('.b-gantt-task.first').getBoundingClientRect().left, 'Start line aligned correctly');
                t.is(endLine.getBoundingClientRect().left, document.querySelector('.b-gantt-task.last').getBoundingClientRect().right, 'End line aligned correctly');
            }
        );
    });
});
