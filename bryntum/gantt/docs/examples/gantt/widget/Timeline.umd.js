(function () {
  var targetElement = document.querySelector('div[data-file="gantt/widget/Timeline.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>This demo shows how to use the Timeline widget</p>'; //START

  var project = new bryntum.gantt.ProjectModel({
    startDate: new Date(2020, 0, 1),
    eventsData: [{
      id: 1,
      name: 'Project X',
      children: [{
        id: 2,
        name: 'Important task',
        startDate: '2020-01-02',
        manuallyScheduled: true,
        duration: 20,
        showInTimeline: true
      }, {
        id: 3,
        name: 'Critical milestone',
        startDate: '2020-02-09',
        manuallyScheduled: true,
        duration: 0,
        showInTimeline: true
      }, {
        id: 4,
        name: 'Deploy',
        startDate: '2020-02-22',
        duration: 15,
        manuallyScheduled: true,
        showInTimeline: true
      }, {
        id: 5,
        name: 'Customer meeting',
        startDate: '2020-03-22',
        duration: 22,
        manuallyScheduled: true,
        showInTimeline: true
      }]
    }]
  });
  var timeline = new bryntum.gantt.Timeline({
    appendTo: targetElement,
    project: project
  }); //END
})();