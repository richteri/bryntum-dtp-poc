/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="scheduler/HeaderContextMenu.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Right click the timeline header to display its context menu:</p>'; //START

  var scheduler = new Scheduler({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      headerContextMenu: {
        extraItems: [{
          text: 'Zoom to fit',
          weight: 200,
          icon: 'b-fa b-fa-fw b-fa-arrows-alt',
          cls: 'b-separator',
          onItem: function onItem(_ref) {
            var item = _ref.item;
            scheduler.zoomToFit();
          }
        }, {
          text: 'Custom item',
          weight: 201,
          icon: 'b-fa b-fa-fw b-fa-cog',
          onItem: function onItem(_ref2) {
            var item = _ref2.item;
            Toast.show('You clicked a Custom item');
          }
        }]
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
      startDate: '2018-05-07',
      endDate: '2018-05-10'
    }, {
      id: 2,
      resourceId: 2,
      name: 'Meeting',
      startDate: '2018-05-10',
      endDate: '2018-05-12'
    }, {
      id: 3,
      resourceId: 2,
      name: 'Future task',
      startDate: '2018-06-10',
      endDate: '2018-06-12'
    }]
  }); //END
})();