/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="scheduler/viewpresets/weekDateAndMonth.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;
//START
let scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018,4,15),
    endDate   : new Date(2018,5,14),

    viewPreset : 'weekDateAndMonth',

    columns : [
        { field : 'name', text : 'Name', width: 100 }
    ]
});
//END
})();
