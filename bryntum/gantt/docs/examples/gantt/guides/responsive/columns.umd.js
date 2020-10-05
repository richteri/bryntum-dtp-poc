(function () {
  var targetElement = document.querySelector('div[data-file="gantt/guides/responsive/columns.js"]');
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
      small: 600,
      normal: '*'
    },
    columns: [{
      type: 'startdate',
      responsiveLevels: {
        small: {
          hidden: true
        },
        '*': {
          hidden: false
        }
      }
    }]
  }); //END
})();