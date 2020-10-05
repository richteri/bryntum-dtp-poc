/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="scheduler/EventFilter.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>Right click the timeline header to open context menu and type in the "Filter tasks" menu item to filter tasks in the Scheduler:</p>';
    //START
    const scheduler = new Scheduler({
        appendTo : targetElement,

        // makes grid as high as it needs to be to fit rows
        autoHeight : true,

        features : {
            eventFilter : true // true by default
        },

        startDate : new Date(2021, 4, 3),
        endDate   : new Date(2021, 4, 10),

        columns : [
            { field : 'name', text : 'Name', width : 100 }
        ],

        resources : [
            { id : 1, name : 'Bernard' },
            { id : 2, name : 'Bianca' }
        ],

        events : [
            { id : 1, name : 'Golf', resourceId : 1, startDate : '2021-05-04', endDate : '2021-05-05' },
            { id : 2, name : 'Fitness', resourceId : 2, startDate : '2021-05-05', endDate : '2021-05-06' }
        ]
    });

//END
})();
