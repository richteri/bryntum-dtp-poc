/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="scheduler/viewpresets/secondAndMinute.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;
//START
let scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018,4,6,10,0),
    endDate   : new Date(2018,4,6,10,2),

    viewPreset : 'secondAndMinute',

    columns : [
        { field : 'name', text : 'Name', width: 100 }
    ]
});
//END
})();
