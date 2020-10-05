(function () {
  var targetElement = document.querySelector('div[data-file="guides/columns/Renderer.js"]');
  if (!targetElement) return; //START

  var grid = new Grid({
    appendTo: targetElement,
    autoHeight: true,
    data: DataGenerator.generateData(3),
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1,
      renderer: function renderer(_ref) {
        var cellElement = _ref.cellElement,
            record = _ref.record;
        cellElement.style.backgroundColor = record.color;
        cellElement.style.color = '#fff';
        return record.name;
      }
    }, {
      field: 'color',
      text: 'Color',
      flex: 1,
      htmlEncode: false,
      renderer: function renderer(_ref2) {
        var value = _ref2.value;
        return "\n                        <div style=\"\n                            width: 1em;\n                            height: 1em;\n                            border-radius: 3px;\n                            background-color: ".concat(value, ";\n                            margin-right: .5em\"></div>\n                        ").concat(value, "\n                    ");
      }
    }]
  }); //END
})();