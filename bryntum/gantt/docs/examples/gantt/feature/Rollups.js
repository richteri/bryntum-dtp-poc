(function() {

    const targetElement = document.querySelector('div[data-file="gantt/feature/Rollups.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>This demo shows the rollups feature, hover the rollup to see task information:</p>';

    //START
    const gantt = new bryntum.gantt.Gantt({
        appendTo  : targetElement,
        height    : 350,
        startDate : '2019-07-07',
        endDate   : '2019-07-29',
        features  : {
            rollups : true
        },
        rowHeight : 60,
        project   : new bryntum.gantt.ProjectModel({
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
                            duration : 3,
                            leaf     : true,
                            rollup   : true,
                            cls      : 'child1'
                        },
                        {
                            id       : 13,
                            name     : 'Child 3',
                            duration : 0,
                            rollup   : true,
                            leaf     : true,
                            cls      : 'child1'
                        }
                    ]
                }
            ],
            dependenciesData : [{
                id        : 1,
                lag       : 1,
                fromEvent : 11,
                toEvent   : 12
            },
            {
                id        : 2,
                lag       : 1,
                fromEvent : 12,
                toEvent   : 13
            }]
        })
    });
    //END
})();
