(function () {
  var targetElement = document.querySelector('div[data-file="guides/readme/basic.js"]'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>The config above gives this gantt:</p>'; //START
  // gantt with basic configuration

  var gantt = new bryntum.gantt.Gantt({
    appendTo: targetElement,
    autoHeight: true,
    columns: [{
      type: 'name',
      field: 'name',
      text: 'Name'
    }],
    tasks: [{
      name: 'Write docs',
      startDate: '2017-01-01',
      endDate: '2017-01-10',
      expanded: true,
      children: [{
        name: 'Release docs',
        startDate: '2017-01-02',
        endDate: '2017-01-09',
        leaf: true
      }]
    }],
    startDate: new Date(2017, 0, 1),
    endDate: new Date(2017, 0, 10)
  }); //END
})();