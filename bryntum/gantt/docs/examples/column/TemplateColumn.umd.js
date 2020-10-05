(function () {
  var targetElement = document.querySelector('div[data-file="column/TemplateColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with TemplateColumn

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    rowHeight: 100,
    readOnly: true,
    data: [{
      id: 1,
      name: 'Sweden',
      population: '10M',
      flagImg: 'resources/images/swe.jpeg'
    }, {
      id: 2,
      name: 'Denmark',
      population: '5.6M',
      flagImg: 'resources/images/den.jpeg'
    }, {
      id: 3,
      name: 'Norway',
      population: '5.1M',
      flagImg: 'resources/images/nor.jpeg'
    }, {
      id: 4,
      name: 'Finland',
      population: '5.5M',
      flagImg: 'resources/images/fin.jpeg'
    }, {
      id: 5,
      name: 'Iceland',
      population: '300K',
      flagImg: 'resources/images/ice.jpeg'
    }],
    columns: [{
      type: 'template',
      text: 'Template Column',
      width: 200,
      field: 'name',
      align: 'center',
      template: function template(_ref) {
        var record = _ref.record;
        return "<dl style=\"margin:0\">\n                <dt><img src=\"".concat(record.flagImg, "\" height=\"50\" style=\"border-radius:100%;box-shadow:1px 0px 5px #aaa\"/></dt>\n                <dd style=\"text-align: center;margin-top: 7px;font-style:normal;font-weight:bold\">").concat(record.name, "</dd>\n                </dl>");
      }
    }, {
      field: 'population',
      text: 'Population',
      flex: 1
    }]
  }); //END
})();