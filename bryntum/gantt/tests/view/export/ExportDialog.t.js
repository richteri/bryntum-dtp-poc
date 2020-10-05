import '../../../lib/Gantt/feature/export/PdfExport.js';
import ObjectHelper from '../../../lib/Core/helper/ObjectHelper.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy && gantt.destroy();
    });

    const exportProperties = [
        'scheduleRange',
        'exporterType',
        'orientation',
        'paperFormat',
        'fileFormat',
        'rowsRange',
        'alignRows'
    ];

    t.it('Export dialog should be configured with default PdfExport feature configs', t => {
        const exportCfg = {
            scheduleRange : 'completeview',
            exporterType  : 'singlepage',
            orientation   : 'portrait',
            paperFormat   : 'A4',
            fileFormat    : 'pdf',
            rowsRange     : 'all',
            alignRows     : false
        };

        gantt = t.getGantt({
            features : {
                pdfExport : true
            }
        });

        gantt.features.pdfExport.showExportDialog();

        const
            dialog = gantt.features.pdfExport.exportDialog,
            values = ObjectHelper.copyProperties({}, dialog.values, exportProperties);

        t.isDeeply(values, exportCfg, 'Fields are configured right');
        t.ok(dialog.widgetMap.alignRowsField.hidden, 'alignRows hidden');
    });

    t.it('Export dialog should be configured with PdfExport feature configs', t => {
        const exportCfg = {
            scheduleRange : 'currentview',
            exporterType  : 'multipage',
            orientation   : 'landscape',
            paperFormat   : 'A3',
            fileFormat    : 'png',
            rowsRange     : 'visible',
            alignRows     : true
        };

        gantt = t.getGantt({
            features : {
                pdfExport : { ...exportCfg }
            }
        });

        gantt.features.pdfExport.showExportDialog();

        const
            dialog = gantt.features.pdfExport.exportDialog,
            values = ObjectHelper.copyProperties({}, dialog.values, exportProperties);

        t.isDeeply(values, exportCfg, 'Fields are configured right');
        t.notOk(dialog.widgetMap.alignRowsField.hidden, 'alignRows visible');
    });
});
