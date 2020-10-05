(function () {
    const targetElement = document.querySelector('div[data-file="gantt/Gantt.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>This demo shows a basic Gantt chart without any configuration:</p>';

//START
const project = new bryntum.gantt.ProjectModel({
    startDate  : new Date(2020, 0, 1),

    eventsData : [
        {
            id : 1,
            name : 'Write docs',
            expanded : true,
            children : [
                { id : 2, name : 'Proof-read docs', startDate : '2020-01-02', endDate : '2020-01-05' },
                { id : 3, name : 'Release docs', startDate : '2020-01-09', endDate : '2020-01-10' }
            ]
        }
    ],

    dependenciesData : [
        { fromEvent : 2, toEvent : 3 }
    ]
});


const gantt = new bryntum.gantt.Gantt({
    project     : project,

    startDate   : new Date(2019, 11, 31),
    endDate     : new Date(2020, 0, 11),

    height      : 254,

    appendTo    : targetElement
});
//END
})();
