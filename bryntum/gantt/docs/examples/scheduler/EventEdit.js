/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="scheduler/EventEdit.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>Double click an event to show the event editor, or click + drag empty area to create a new one with the editor:</p>';
//START
let scheduler = new Scheduler({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018,4,6),
    endDate   : new Date(2018,4,13),

    columns : [
        { field : 'name', text : 'Name', width: 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Double click me', startDate : '2018-05-08', endDate : '2018-05-11' }
    ]
});

//END
})();
