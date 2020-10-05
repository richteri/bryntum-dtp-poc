(function () {
  var targetElement = document.querySelector('div[data-file="guides/features/ColumnResize.js"]');
  if (!targetElement) return; //START

  var grid = new Grid({
    appendTo: targetElement,
    autoHeight: true,
    features: {
      // this feature is actually enabled by default,
      // so no need for this unless you have changed defaults
      columnResize: true
    },
    data: DataGenerator.generateData(2),
    columns: [{
      field: 'firstName',
      text: 'First name',
      headerRenderer: function headerRenderer(_ref) {
        var column = _ref.column;
        return "".concat(column.text, " <span style=\"position: absolute; right: 0; font-size: .6em; z-index: 1\">Drag <i class=\"b-fa b-fa-arrow-right\"></i></span>");
      },
      width: 150
    }, {
      field: 'surName',
      text: 'Surname',
      width: 150
    }, {
      field: 'city',
      text: 'City',
      flex: 1
    }]
  }); //END
})();