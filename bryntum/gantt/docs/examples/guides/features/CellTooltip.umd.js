/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="guides/features/CellTooltip.js"]');
  if (!targetElement) return; //START

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
          return 'Value: ' + record[column.field];
        },
        hoverDelay: 200
      }
    },
    data: DataGenerator.generateData(2),
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      field: 'score',
      text: 'Score',
      flex: 1
    }, {
      type: 'number',
      field: 'age',
      text: 'Age',
      flex: 1
    }]
  }); //END
})();