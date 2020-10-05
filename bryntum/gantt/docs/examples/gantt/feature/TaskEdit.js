(function () {

const targetElement = document.querySelector('div[data-file="gantt/feature/TaskEdit.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>This demo shows the task edit feature, double-click child task bar to start editing:</p>';

//START
// Project contains all the data and is responsible for correct scheduling
const project = new bryntum.gantt.ProjectModel({
    startDate  : new Date(2017, 0, 1),

    tasksData : [
        {
            id : 1,
            name : 'Write docs',
            expanded : true,
            children : [
                { id : 2, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-05' },
                { id : 3, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10' }
            ]
        }
    ],

    dependenciesData : [
        { fromTask : 2, toTask : 3 }
    ]
});

// Panel holding toolbar and Gantt
const panel = new bryntum.gantt.Gantt({
    appendTo  : targetElement,
    flex      : '1 0 100%',
    project   : project, // Gantt needs project to get schedule data from
    startDate : new Date(2016, 11, 31),
    endDate   : new Date(2017, 0, 11),
    height    : 250,
    columns   : [
        { type : 'name', field : 'name', text : 'Name' }
    ]
});
//END
})();
