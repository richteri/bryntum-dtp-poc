import SchedulerPdfExport from '../../../Scheduler/feature/export/PdfExport.js';
import SinglePageExporter from './exporter/SinglePageExporter.js';
import MultiPageExporter from './exporter/MultiPageExporter.js';
import MultiPageVerticalExporter from './exporter/MultiPageVerticalExporter.js';
import GridFeatureManager from '../../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/export/PdfExport
 */

/**
 * Generates PDF/PNG files from the Gantt component.
 *
 * <img src="resources/images/gantt-export-dialog.png" style="max-width : 300px" alt="Gantt Export dialog">
 *
 * **NOTE:** This feature will make a fetch request to the server, posting
 * the HTML fragments to be exported. The {@link #config-exportServer} URL must be configured.
 *
 * ## Usage
 *
 * ```javascript
 * let gantt = new Gantt({
 *     features : {
 *         pdfExport : {
 *             exportServer : 'http://localhost:8080' // Required
 *         }
 *     }
 * })
 *
 * // Opens popup allowing to customize export settings
 * gantt.features.pdfExport.showExportDialog();
 *
 * // Simple export
 * gantt.features.pdfExport.export({
 *     columns : gantt.columns.map(c => c.id) // Required, set list of column ids to export
 * }).then(result => {
 *     // Response instance and response content in JSON
 *     let { response, responseJSON } = result;
 * });
 * ```
 * @extends Scheduler/feature/export/PdfExport
 * @typings Scheduler/feature/export/PdfExport -> Scheduler/feature/export/SchedulerPdfExport
 */
export default class PdfExport extends SchedulerPdfExport {
    static get $name() {
        return 'PdfExport';
    }

    static get defaultConfig() {
        return {
            exporters : [SinglePageExporter, MultiPageExporter, MultiPageVerticalExporter]
        };
    }
}

GridFeatureManager.registerFeature(PdfExport, false, 'Gantt');
