(function () {
  var targetElement = document.querySelector('div[data-file="feature/Group.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Group by a column by pressing shift + clicking its header or by using the context menu</p>'; //START
  // grid with grouping

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      // group by food
      group: 'food'
    },
    data: DataGenerator.generateData(5),
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      field: 'food',
      text: 'Favorite food',
      flex: 1
    }, {
      field: 'city',
      text: 'City',
      flex: 1
    }]
  }); //END
})();