(function () {
    const targetElement = document.querySelector('div[data-file="gantt/GanttColumns.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>This demo shows the gantt with with a couple of extra columns defined:</p>';

//START
const project = new bryntum.gantt.ProjectModel({
    startDate  : new Date(2020, 0, 14),

    eventsData : [
        {
            id          : 1,
            name        : 'Setup Web Server',
            startDate   : '2020-01-14',
            expanded    : true,
            duration    : 10,
            percentDone : 50,
            children : [
                { 
                    id : 2,
                    name : 'Install Apache', 
                    startDate : '2020-01-14', 
                    endDate : '2020-01-17',
                    duration : 3,
                    percentDone : 70 
                },
                { 
                    id : 3, 
                    name : 'Configure firewall', 
                    startDate : '2020-01-17', 
                    endDate : '2020-01-18',
                    duration : 1,
                    percentDone : 18
                }
            ]
        }
    ],

    dependenciesData : [
        { fromEvent : 2, toEvent : 3 }
    ]
});


const gantt = new bryntum.gantt.Gantt({
    project     : project,

    startDate   : new Date(2020, 0, 14),
    endDate     : new Date(2020, 0, 19),
    
    columns     : [
        { type : 'wbs'},
        { type : 'name', text : 'Name'},
        { type : 'startdate', text : 'Start date' },
        { type : 'duration', text : 'Duration' },
        { type : 'percentdone', text : 'Perc. done' }
    ],

    height  : 254,

    // width of the left side
    subGridConfigs : {
        locked : {
            width : 280
        }
    },
    appendTo    : targetElement
});
//END
})();
