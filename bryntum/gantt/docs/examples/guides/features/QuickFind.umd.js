(function () {
  var targetElement = document.querySelector('div[data-file="guides/features/QuickFind.js"]');
  if (!targetElement) return; //START

  var grid = new Grid({
    appendTo: targetElement,
    autoHeight: true,
    features: {
      // enable quickfind
      quickFind: true
    },
    data: DataGenerator.generateData(5),
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      field: 'city',
      text: 'City',
      flex: 1
    }]
  }); //END
})();