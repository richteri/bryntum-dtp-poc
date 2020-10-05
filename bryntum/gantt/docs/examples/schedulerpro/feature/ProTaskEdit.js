(function () {

const targetElement = document.querySelector('div[data-file="schedulerpro/feature/ProTaskEdit.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>This demo shows the task edit feature, double-click child task bar to start editing:</p>';

//START
// Project contains all the data and is responsible for correct scheduling
const project = new ProProjectModel({
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

    resourcesData : [
        { id : 1, name : 'Albert' },
        { id : 2, name : 'Bill' }
    ],

    assignmentsData : [
        { event : 2, resource : 1 },
        { event : 3, resource : 2 }
    ]
});

// Panel holding toolbar and ProScheduler
new ProScheduler({
    appendTo  : targetElement,
    flex      : '1 0 100%',
    project   : project, // ProScheduler needs project to get schedule data from
    startDate : new Date(2016, 11, 31),
    endDate   : new Date(2017, 0, 11),
    height    : 250,
    columns   : [
        { field : 'name', text : 'Name' }
    ]
});
//END
})();
