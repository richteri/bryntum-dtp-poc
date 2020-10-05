/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="scheduler/Labels.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Demo displaying top and bottom labels with top label; editable on <code>dblclick</code>:</p>'; //START

  var scheduler = new Scheduler({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    barMargin: 5,
    rowHeight: 70,
    features: {
      labels: {
        top: {
          field: 'location',
          editor: {
            type: 'textfield'
          }
        },
        bottom: {
          renderer: function renderer(_ref) {
            var eventRecord = _ref.eventRecord;
            return "ID: ".concat(eventRecord.id);
          }
        }
      }
    },
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
      location: 'Office',
      startDate: '2018-05-07',
      endDate: '2018-05-10'
    }, {
      id: 2,
      resourceId: 2,
      name: 'Meeting',
      location: 'Client\`s office',
      startDate: '2018-05-10',
      endDate: '2018-05-12'
    }]
  }); //END
})();