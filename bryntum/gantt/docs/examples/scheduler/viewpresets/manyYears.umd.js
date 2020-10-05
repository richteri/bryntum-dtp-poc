/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="scheduler/viewpresets/manyYears.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  var scheduler = new Scheduler({
    appendTo: targetElement,
    autoHeight: true,
    startDate: new Date(2018, 0, 1),
    endDate: new Date(2020, 11, 31),
    viewPreset: 'manyYears',
    columns: [{
      field: 'name',
      text: 'Name',
      width: 100
    }]
  }); //END
})();