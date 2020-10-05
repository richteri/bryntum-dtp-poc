function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy && gantt.destroy();
  });
  var exportProperties = ['scheduleRange', 'exporterType', 'orientation', 'paperFormat', 'fileFormat', 'rowsRange', 'alignRows'];
  t.it('Export dialog should be configured with default PdfExport feature configs', function (t) {
    var exportCfg = {
      scheduleRange: 'completeview',
      exporterType: 'singlepage',
      orientation: 'portrait',
      paperFormat: 'A4',
      fileFormat: 'pdf',
      rowsRange: 'all',
      alignRows: false
    };
    gantt = t.getGantt({
      features: {
        pdfExport: true
      }
    });
    gantt.features.pdfExport.showExportDialog();
    var dialog = gantt.features.pdfExport.exportDialog,
        values = ObjectHelper.copyProperties({}, dialog.values, exportProperties);
    t.isDeeply(values, exportCfg, 'Fields are configured right');
    t.ok(dialog.widgetMap.alignRowsField.hidden, 'alignRows hidden');
  });
  t.it('Export dialog should be configured with PdfExport feature configs', function (t) {
    var exportCfg = {
      scheduleRange: 'currentview',
      exporterType: 'multipage',
      orientation: 'landscape',
      paperFormat: 'A3',
      fileFormat: 'png',
      rowsRange: 'visible',
      alignRows: true
    };
    gantt = t.getGantt({
      features: {
        pdfExport: _objectSpread({}, exportCfg)
      }
    });
    gantt.features.pdfExport.showExportDialog();
    var dialog = gantt.features.pdfExport.exportDialog,
        values = ObjectHelper.copyProperties({}, dialog.values, exportProperties);
    t.isDeeply(values, exportCfg, 'Fields are configured right');
    t.notOk(dialog.widgetMap.alignRowsField.hidden, 'alignRows visible');
  });
});