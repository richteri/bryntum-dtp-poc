(function () {
  var targetElement = document.querySelector('div[data-file="column/RowNumberColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with RowNumberColumn

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    width: 300,
    data: DataGenerator.generateData(5),
    columns: [{
      type: 'rownumber'
    }, {
      field: 'name',
      text: 'Name',
      flex: 1
    }]
  }); //END
})();