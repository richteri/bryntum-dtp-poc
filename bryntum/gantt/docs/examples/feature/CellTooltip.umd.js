/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="feature/CellTooltip.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Hover a cell to show the cell tooltip, note the Score loads async content</p>'; //START
  // grid with cell editing

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      // enable CellTooltip and configure a default renderer
      cellTooltip: {
        tooltipRenderer: function tooltipRenderer(_ref) {
          var record = _ref.record,
              column = _ref.column;
          return record[column.field];
        },
        hoverDelay: 200
      }
    },
    data: DataGenerator.generateData(5),
    columns: [// basic columns has a TextField as editor by default
    {
      field: 'name',
      text: 'Name',
      flex: 1
    }, // a custom editor can be specified
    {
      field: 'city',
      text: 'City',
      flex: 1,
      editor: {
        type: 'combo',
        items: ['Stockholm', 'New York', 'Moscow']
      }
    }, // tooltipRenderer can return a Promise for async tooltip content
    {
      field: 'score',
      text: 'Score (Async tooltip)',
      flex: 1,
      tooltipRenderer: function tooltipRenderer(_ref2) {
        var record = _ref2.record;
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(record.name + ': Some remote content');
          }, 2000);
        });
      }
    }, // Or use the async notation in the tooltipRenderer
    {
      type: 'number',
      field: 'age',
      text: 'Age (readonly)',
      flex: 1,
      editor: false //,
      // tooltipRenderer : async ({ record }) => {
      //     const result = await AjaxHelper.load('myPath');
      //
      //     return result.text();
      // }

    }]
  }); //END
})();