import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';

StartTest(t => {
    let gantt;
    window.AjaxHelper = AjaxHelper;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show non-working time ranges from project calendar', t => {
        const project = t.getProject({ calendar : 'general' });

        gantt = t.getGantt({
            startDate : new Date(2017, 0, 14),
            endDate   : new Date(2017, 0, 30),
            features  : {
                nonWorkingTime : true  // Enabled by default
            },
            project
        });

        t.chain(
            { waitForPropagate : project },
            async() => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 8, '8 non-working days');

                project.calendarManagerStore.add({
                    id        : 'custom',
                    intervals : [
                        {
                            recurrentStartDate : 'on Fri at 0:00',
                            recurrentEndDate   : 'on Tue at 0:00',
                            isWorking          : false
                        }
                    ]
                });

                project.calendar = project.calendarManagerStore.getById('custom');
                project.propagate();
            },
            { waitForPropagate : project },
            async() => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 16, '16 non-working days');
                project.calendar = null;
                project.propagate();
            },
            { waitForPropagate : project },
            () => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 0, 'non-working days are not visible');
            }
        );
    });

    // https://github.com/bryntum/support/issues/827
    t.it('Should show non-working time ranges from project calendar when data is loaded later and there are more than 500 events', t => {
        t.mockUrl('loadurl', {
            delay        : 10,
            responseText : JSON.stringify({
                success : true,
                project : {
                    calendar : 'general'
                },
                calendars : {
                    rows : t.getProjectCalendarsData()
                },
                tasks : {
                    rows : (() => {
                        const result = [];

                        // 500 is here because EngineReplica declares projectRefreshThreshold as 500,
                        // which means that 'update' event will not be fired, assuming it is enough to have 'refresh' event fired
                        for (let id = 1; id <= 500; id++) {
                            result.push({
                                id,
                                name      : id,
                                startDate : new Date(2017, 0, 9),
                                endDate   : new Date(2017, 0, 11)
                            });
                        }

                        return result;
                    })()
                }
            })
        });

        const project = new ProjectModel({
            autoLoad  : false,
            transport : {
                load : {
                    url : 'loadurl'
                }
            }
        });

        gantt = t.getGantt({
            startDate : new Date(2017, 0, 14),
            endDate   : new Date(2017, 0, 30),
            features  : {
                nonWorkingTime : true  // Enabled by default
            },
            project
        });

        t.chain(
            { waitForPropagate : project },
            async() => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 0, 'non-working days are not visible');

                await project.load();
            },
            { waitForPropagate : project },
            () => {
                t.selectorCountIs('.b-grid-headers .b-sch-nonworkingtime', 8, '8 non-working days');
            }
        );
    });
});
