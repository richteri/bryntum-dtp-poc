import { AjaxHelper } from '../../build/gantt.module.js';

StartTest(t => {
    let gantt;
    window.AjaxHelper = AjaxHelper;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should reject row reordering if it creates a cyclic graph', async t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : new Date(2020, 1, 1),
            endDate   : new Date(2021, 1, 1),
            project   : {
                startDate  : new Date(2020, 1, 1),
                duration   : 30,
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        expanded  : true,
                        startDate : new Date(2020, 1, 1),
                        children  : [
                            {
                                id        : 11,
                                name      : 'Child 1',
                                startDate : new Date(2020, 1, 1),
                                duration  : 1,
                                leaf      : true
                            }
                        ]
                    },
                    {
                        id        : 2,
                        name      : 'Project B',
                        startDate : new Date(2020, 1, 1),
                        duration  : 1,
                        leaf      : true
                    }
                ],
                dependenciesData : [{
                    id        : 1,
                    fromEvent : 1,
                    toEvent   : 2
                }]
            }
        });

        t.chain(
            { drag : '.b-grid-cell:contains(Project B)', to : '.b-grid-cell:contains(Child 1)', toOffset : [0, 2] },

            { waitForSelectorNotFound : '.b-row-reordering' },

            () => {
                t.is(gantt.taskStore.getById(2).parent, gantt.taskStore.rootNode, 'Parent of task 2 is still root task');
            }
        );
    });

    t.it('Should handle store being cleared during finalization', t => {
        t.mockUrl('loadurl', {
            delay        : 1000,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : []
                },
                assignments : {
                    rows : []
                },
                tasks : {
                    rows : [
                        {
                            id        : 1,
                            name      : 'A',
                            startDate : '2018-02-01',
                            endDate   : '2018-03-01',
                            expanded  : true,
                            children  : [
                                {
                                    id        : 2,
                                    name      : 'B',
                                    startDate : '2018-02-01',
                                    endDate   : '2018-03-01'
                                },
                                {
                                    id        : 3,
                                    name      : 'C',
                                    startDate : '2018-02-01',
                                    endDate   : '2018-03-01'
                                }
                            ]
                        }
                    ]
                }
            })
        });

        gantt = t.getGantt({
            features : {
                rowReorder : {
                    finalizeDelay : 1000
                }
            },

            project : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : 'loadurl'
                    }
                }
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            {
                drag : '.b-grid-cell:contains(B)',
                by   : [0, 50]
            },

            next => {
                gantt.project.taskStore.removeAll();

                t.wontFire(gantt.project.taskStore, 'change');

                next();
            },

            { waitForSelectorNotFound : '.b-row-reordering' }
        );
    });

    t.it('Should handle store being loaded during finalization', t => {
        t.mockUrl('loadurl', {
            delay        : 200,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : []
                },
                assignments : {
                    rows : []
                },
                tasks : {
                    rows : [
                        {
                            id        : 1,
                            name      : 'A',
                            startDate : '2018-02-01',
                            endDate   : '2018-03-01',
                            expanded  : true,
                            children  : [
                                {
                                    id        : 2,
                                    name      : 'B',
                                    startDate : '2018-02-01',
                                    endDate   : '2018-03-01'
                                },
                                {
                                    id        : 3,
                                    name      : 'C',
                                    startDate : '2018-02-01',
                                    endDate   : '2018-03-01'
                                },
                                {
                                    id        : 4,
                                    name      : 'd',
                                    startDate : '2018-02-01',
                                    endDate   : '2018-03-01'
                                }
                            ]
                        }
                    ]
                }
            })
        });

        gantt = t.getGantt({
            features : {
                rowReorder : {
                    finalizeDelay : 500
                }
            },

            project : {
                autoLoad  : false,
                transport : {
                    load : {
                        url : 'loadurl'
                    }
                }
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            {
                drag : '.b-grid-cell:contains(Investigate)',
                by   : [0, 60]
            },

            next => {
                gantt.project.load().then(() => {
                    t.wontFire(gantt.project.taskStore, 'change');
                });

                next();
            },

            { waitForSelectorNotFound : '.b-row-reordering' }
        );
    });
});
