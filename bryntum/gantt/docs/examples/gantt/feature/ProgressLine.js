/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="gantt/feature/ProgressLine.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = [
        '<p>Drag tasks and see how progress line reacts.</b>'
    ].join('');
//START
// Gantt with basic configuration
    const gantt = new Gantt({
        appendTo : targetElement,
        
        features : {
            progressLine : {
                statusDate : new Date(2019, 1, 11)
            }
        },

        // makes Gantt as high as it needs to be to fit rows
        autoHeight : true,

        columns : [
            { type : 'name', field : 'name', text : 'Name' }
        ],

        startDate : new Date(2019, 1, 4),
        endDate   : new Date(2019, 1, 11),

        tasks : [
            {
                id        : 1,
                name      : 'Project A',
                startDate : '2019-02-04',
                duration  : 5,
                expanded  : true,
                children  : [
                    {
                        id          : 11,
                        name        : 'Preparation work',
                        startDate   : '2019-02-04',
                        percentDone : 100,
                        duration    : 5
                    },
                    {
                        id          : 12,
                        name        : 'Prototype',
                        startDate   : '2019-02-04',
                        percentDone : 50,
                        duration    : 5
                    },
                    {
                        id          : 13,
                        name        : 'Release',
                        startDate   : '2019-02-04',
                        duration    : 0
                    }
                ]
            }
        ]
    });
//END
})();
