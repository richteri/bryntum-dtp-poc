(function () {
  var targetElement = document.querySelector('div[data-file="gantt/feature/IndicatorsCustom.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) {
    return;
  }

  targetElement.innerHTML = '<p>This demo shows a custom indicator:</p>'; //START
  // Project contains all the data and is responsible for correct scheduling

  var project = new bryntum.gantt.ProjectModel({
    startDate: '2020-02-20',
    tasksData: [{
      id: 1,
      name: 'Write docs',
      expanded: true,
      children: [{
        id: 2,
        name: 'Proof-read docs',
        startDate: '2020-02-24',
        duration: 4,
        percentDone: 60
      }, {
        id: 3,
        name: 'Release docs',
        startDate: '2020-02-24',
        duration: 4
      }]
    }],
    dependenciesData: [{
      fromTask: 2,
      toTask: 3
    }]
  });
  var gantt = new bryntum.gantt.Gantt({
    features: {
      indicators: {
        items: {
          earlyDates: false,
          lateDates: false,
          // A custom indicator
          myCustomIndicator: function myCustomIndicator(taskRecord) {
            return taskRecord.percentDone > 50 ? {
              startDate: DateHelper.add(taskRecord.endDate, 2, 'days'),
              name: 'Custom indicator',
              iconCls: 'b-fa b-fa-book'
            } : null;
          }
        }
      },
      projectLines: false
    },
    appendTo: targetElement,
    project: project,
    // Gantt needs project to get schedule data from
    startDate: '2020-02-16',
    endDate: '2020-03-07',
    height: 240,
    rowHeight: 50,
    barMargin: 15,
    columns: [{
      type: 'name',
      field: 'name',
      text: 'Name'
    }]
  }); //END
})();