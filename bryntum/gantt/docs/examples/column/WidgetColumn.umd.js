(function () {
  var targetElement = document.querySelector('div[data-file="column/WidgetColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with WidgetColumn

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
      type: 'widget',
      field: 'city',
      text: 'WidgetColumn',
      width: 140,
      widgets: [{
        type: 'button',
        cls: 'b-raised',
        text: 'Hello',
        onClick: function onClick(_ref) {
          var btn = _ref.source;
          var record = btn.cellInfo.record;
          Toast.show("Hello ".concat(record.name, " from ").concat(record.city));
        }
      }]
    }, {
      type: 'widget',
      text: 'Checkboxes',
      field: 'field',
      width: 140,
      widgets: [{
        type: 'checkbox',
        onChange: function onChange(_ref2) {
          var widget = _ref2.source,
              checked = _ref2.checked;
          widget.cellInfo.record.set('field1', checked, true);
        }
      }, {
        type: 'checkbox',
        onChange: function onChange(_ref3) {
          var widget = _ref3.source,
              checked = _ref3.checked;
          widget.cellInfo.record.set('field2', checked, true);
        }
      }, {
        type: 'checkbox',
        onChange: function onChange(_ref4) {
          var widget = _ref4.source,
              checked = _ref4.checked;
          widget.cellInfo.record.set('field3', checked, true);
        }
      }]
    }]
  }); //END
})();