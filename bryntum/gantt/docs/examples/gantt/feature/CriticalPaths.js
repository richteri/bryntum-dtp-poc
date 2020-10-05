(function () {

const targetElement = document.querySelector('div[data-file="gantt/feature/CriticalPaths.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>This demo shows the critical paths visualizing feature:</p>';

//START
// Project contains all the data and is responsible for correct scheduling
const project = new bryntum.gantt.ProjectModel({
    startDate  : '2016-02-01', // project start date

    tasksData : [
        { id : 1, name : 'Making ETA', startDate : '2016-02-01', duration : 5 },
        { id : 2, name : 'Composing docs chapter 1', startDate : '2016-02-01', duration : 10 },
        { id : 3, name : 'Composing docs chapter 2', startDate : '2016-02-12', duration : 1 }
    ],
    dependenciesData : [
        { id : 23, fromEvent : 2, toEvent : 3, type : 3 }
    ]
});

// Gantt view
const gantt = new bryntum.gantt.Gantt({
    appendTo    : targetElement,
    flex        : '1 0 100%',
    // Gantt needs project to get schedule data from
    project     : project,
    startDate   : new Date(2016, 1, 1),
    endDate     : new Date(2016, 2, 1),
    height      : 300
});

// let's visualize the project critical paths
gantt.features.criticalPaths.disabled = false;

//END
})();
