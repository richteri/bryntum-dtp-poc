/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="scheduler/Dependencies.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>This demo draws dependencies between some events using the Dependencies feature. Double click to edit a dependency.</p>'; //START

  var scheduler = new Scheduler({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    startDate: new Date(2018, 4, 6),
    endDate: new Date(2018, 4, 13),
    columns: [{
      field: 'name',
      text: 'Name',
      width: 100
    }],
    resources: [{
      id: 1,
      name: 'Bernard'
    }, {
      id: 2,
      name: 'Bianca'
    }],
    events: [{
      id: 1,
      resourceId: 1,
      name: 'Interview',
      startDate: '2018-05-06',
      endDate: '2018-05-07'
    }, {
      id: 2,
      resourceId: 1,
      name: 'Press meeting',
      startDate: '2018-05-08',
      endDate: '2018-05-09'
    }, {
      id: 3,
      resourceId: 2,
      name: 'Audition',
      startDate: '2018-05-07',
      endDate: '2018-05-09'
    }, {
      id: 4,
      resourceId: 2,
      name: 'Script deadline',
      startDate: '2018-05-11',
      endDate: '2018-05-11'
    }],
    features: {
      dependencies: true,
      dependencyEdit: true
    },
    dependencies: [{
      id: 1,
      from: 1,
      to: 2,
      cls: 'dev-path'
    }, {
      id: 2,
      from: 2,
      to: 4
    }]
  }); //END
})();