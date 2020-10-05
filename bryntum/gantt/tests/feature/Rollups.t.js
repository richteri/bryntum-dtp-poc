import '../../lib/Gantt/feature/Rollups.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => {
        gantt && !gantt.isDestroyed && gantt.destroy();
    });

    t.it('Rollups should render child tasks under parent task bar', async t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-07-07',
            endDate   : '2019-07-29',
            features  : {
                rollups : true
            },
            rowHeight : 70,
            project   : {
                startDate  : '2019-07-07',
                duration   : 30,
                eventsData : [
                    {
                        id       : 1,
                        name     : 'Project A',
                        duration : 30,
                        expanded : true,
                        children : [
                            {
                                id       : 11,
                                name     : 'Child 1',
                                duration : 1,
                                leaf     : true,
                                rollup   : true,
                                cls      : 'child1'
                            },
                            {
                                id       : 12,
                                name     : 'Child 2',
                                duration : 5,
                                leaf     : true,
                                rollup   : true,
                                cls      : 'child1'
                            },
                            {
                                id       : 13,
                                name     : 'Child 3',
                                duration : 0,
                                leaf     : true,
                                rollup   : true,
                                cls      : 'child1'
                            }
                        ]
                    }
                ],
                dependenciesData : [{
                    id        : 1,
                    fromEvent : 12,
                    toEvent   : 13
                }]
            }
        });
        const
            taskStore = gantt.taskStore,
            projectA = taskStore.first,
            child1 = projectA.children[0];

        t.chain(
            // Move in from the right, not diagonally from 0, 0 which would be the default.
            { moveMouseTo : '.b-task-rollup[data-index="2"]', offset : ['100%+60', '50%'] },

            { moveMouseTo : '.b-task-rollup[data-index="2"]' },

            // Only over the Child 3 milestone
            { waitForSelector : '.b-tooltip:contains(Child 3):not(:contains(Child 1)):not(:contains(Child 2))' },

            { moveMouseTo : '.b-task-rollup[data-index="1"]' },

            // Only over Child 2
            { waitForSelector : '.b-tooltip:contains(Child 2):not(:contains(Child 1)):not(:contains(Child 3))' },

            { moveMouseTo : '.b-task-rollup[data-index="0"]' },

            // We're over child 1 *and* child 2 now, not child 3
            { waitForSelector : '.b-tooltip:contains(Child 1):contains(Child 2):not(:contains(Child 3))' },

            { moveMouseTo : [0, 0] },

            next => {
                projectA.removeChild(child1);
                next();
            },

            // Rollups must be trimmed on child remove
            { waitForSelectorNotFound : '.b-task-rollup[data-index="2"]' },

            next => {
                projectA.insertChild(child1, projectA.children[0]);
                next();
            },

            // Rollups must be added to oo child add
            { waitForSelector : '.b-task-rollup[data-index="2"]' }
        );
    });

    t.it('Rollups should render child tasks when parent is collapsed', async t => {
        gantt = t.getGantt({
            startDate : '2019-07-07',
            endDate   : '2019-07-29',
            features  : {
                rollups : true
            },
            project : {
                startDate  : '2019-07-07',
                duration   : 30,
                eventsData : [
                    {
                        id       : 1,
                        name     : 'Project A',
                        duration : 30,
                        expanded : false,
                        children : [
                            {
                                id       : 11,
                                name     : 'Child 1',
                                duration : 1,
                                leaf     : true,
                                rollup   : true
                            }
                        ]
                    }
                ]
            }
        });

        t.chain(
            { waitForSelector : '[data-rollup-task-id="11"]' }
        );
    });

    t.it('Should not render rollup for tasks starting after timeaxis end date', async t => {
        gantt = t.getGantt({
            startDate : '2017-01-15',
            endDate   : '2017-02-26',
            features  : {
                rollups : true
            },
            project : {
                startDate  : '2017-01-08',
                duration   : 80,
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2017-01-08',
                        duration  : 80,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                startDate : '2017-01-15',
                                name      : 'Starts before timeaxis, ends inside',
                                duration  : 10,
                                rollup    : true,
                                leaf      : true
                            },
                            {
                                id                : 12,
                                startDate         : '2017-03-17',
                                name              : 'Starts after time axis end',
                                duration          : 80,
                                rollup            : true,
                                manuallyScheduled : true,
                                leaf              : true
                            }
                        ]
                    }
                ]
            }
        });

        t.chain(
            { waitForSelector : '.b-gantt-task-wrap' },

            async() => t.selectorExists('.b-task-rollup[data-rollup-task-id="11"]'),

            async() => t.selectorNotExists('.b-task-rollup[data-rollup-task-id="12"]')
        );
    });
});
