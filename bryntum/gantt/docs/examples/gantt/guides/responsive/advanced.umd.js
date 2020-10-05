(function () {
  var targetElement = document.querySelector('div[data-file="gantt/guides/responsive/advanced.js"]');
  if (!targetElement) return; //START

  var gantt = new Gantt({
    appendTo: targetElement,
    autoHeight: true,
    tasks: [{
      name: 'Plan',
      startDate: '2019-01-05',
      endDate: '2019-01-12'
    }, {
      name: 'Build',
      startDate: '2019-01-03',
      endDate: '2019-01-09'
    }],
    startDate: new Date(2019, 0, 1),
    endDate: new Date(2019, 0, 10),
    responsiveLevels: {
      small: {
        levelWidth: 600,
        rowHeight: 30,
        barMargin: 0
      },
      normal: {
        levelWidth: '*',
        rowHeight: 50,
        barMargin: 10
      }
    }
  }); //END
})();