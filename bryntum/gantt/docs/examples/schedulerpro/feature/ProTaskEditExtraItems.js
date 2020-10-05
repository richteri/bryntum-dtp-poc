(function () {

const targetElement = document.querySelector('div[data-file="schedulerpro/feature/ProTaskEditExtraItems.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '';

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
                { id : 2, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-05', effort : 0 },
                { id : 3, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10', effort : 0 }
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
    project   : project, // Gantt needs project to get schedule data from
    startDate : new Date(2016, 11, 31),
    endDate   : new Date(2017, 0, 11),
    height    : 250,
    features  : {
        eventEdit : {
            editorConfig : {
                // Make task editor higher
                height       : '35em',
                extraItems : {
                    // add two widgets to general tab
                    generaltab : [
                        {
                            html : '',
                            flex : '1 0 100%'
                        },
                        {
                            type     : 'text',
                            readOnly : true,
                            editable : false,
                            label    : 'My field',
                            name     : 'milestone',
                            flex     : '1 0 50%'
                        },
                        {
                            type : 'button',
                            text : 'Button',
                            flex : '1 0 50%'
                        }
                    ]
                }
            }
        }
    },
    columns   : [
        { field : 'name', text : 'Name' }
    ]
});
//END
})();
