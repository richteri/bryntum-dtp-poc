(function () {
  var targetElement = document.querySelector('div[data-file="column/PercentColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with PercentColumn

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    data: DataGenerator.generateData(5),
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      type: 'percent',
      field: 'percent',
      text: 'PercentColumn',
      flex: 1
    }]
  }); //END
})();