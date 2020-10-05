(function () {
  var targetElement = document.querySelector('div[data-file="feature/Sort.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Sorted by Name from start, click a header to sort by it. Click again to sort in opposite direction</p>'; //START
  // grid with default sort

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      // sorting by name
      sort: 'name'
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
    }, {
      type: 'number',
      field: 'score',
      text: 'Score',
      flex: 1
    }, {
      type: 'number',
      field: 'age',
      text: 'Age (no sort)',
      flex: 1,
      sortable: false
    }]
  }); //END
})();