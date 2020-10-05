/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="scheduler/viewpresets/monthAndYear.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  var scheduler = new Scheduler({
    appendTo: targetElement,
    autoHeight: true,
    startDate: new Date(2018, 4, 1),
    endDate: new Date(2018, 12, 31),
    viewPreset: 'monthAndYear',
    columns: [{
      field: 'name',
      text: 'Name',
      width: 100
    }]
  }); //END
})();