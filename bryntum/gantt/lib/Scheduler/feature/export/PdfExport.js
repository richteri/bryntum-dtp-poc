import GridPdfExport from '../../../Grid/feature/export/PdfExport.js';
import GridFeatureManager from '../../../Grid/feature/GridFeatureManager.js';
import SchedulerExportDialog from '../../view/export/SchedulerExportDialog.js';
import SinglePageExporter from './exporter/SinglePageExporter.js';
import MultiPageExporter from './exporter/MultiPageExporter.js';
import MultiPageVerticalExporter from './exporter/MultiPageVerticalExporter.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/feature/export/PdfExport
 */

/**
 * Generates PDF/PNG files from the Scheduler component.
 *
 * <img src="resources/images/export-dialog.png" style="max-width : 300px" alt="Scheduler Export dialog">
 *
 * **NOTE:** This feature makes a fetch request to the server, posting
 * the HTML fragments to be exported. The {@link #config-exportServer} URL must be configured.
 *
 * ## Usage
 *
 * ```javascript
 * let scheduler = new Scheduler({
 *     features : {
 *         pdfExport : {
 *             exportServer : 'http://localhost:8080' // Required
 *         }
 *     }
 * })
 *
 * // Opens popup allowing to customize export settings
 * scheduler.features.pdfExport.showExportDialog();
 *
 * // Simple export
 * scheduler.features.pdfExport.export({
 *     columns : scheduler.columns.map(c => c.id) // Required, set list of column ids to export
 * }).then(result => {
 *     // Response instance and response content in JSON
 *     let { response, responseJSON } = result;
 * });
 * ```
 *
 * Appends configs related to exporting time axis: {@link #config-scheduleRange}, {@link #config-rangeStart},
 * {@link #config-rangeEnd}
 *
 * @extends Grid/feature/export/PdfExport
 * @typings Grid/feature/export/PdfExport -> Grid/feature/export/GridPdfExport
 */
export default class PdfExport extends GridPdfExport {
    static get $name() {
        return 'PdfExport';
    }

    static get defaultConfig() {
        return {
            exporters : [SinglePageExporter, MultiPageExporter, MultiPageVerticalExporter],

            /**
             * Specifies how to export time span.
             *  * completeview - Complete configured time span, from scheduler start date to end date
             *  * currentview  - Currently visible time span
             *  * daterange    - Use specific date range, provided additionally in config. See {@link #config-rangeStart}/
             *  {@link #config-rangeEnd}
             * @config {String}
             * @default
             * @group Export file config
             */
            scheduleRange : 'completeview',

            /**
             * Exported time span range start. Used with `daterange` config of the {@link #config-scheduleRange}
             * @config {Date}
             * @group Export file config
             */
            rangeStart : null,

            /**
             * Exported time span range end. Used with `daterange` config of the {@link #config-scheduleRange}
             * @config {Date}
             * @group Export file config
             */
            rangeEnd : null
        };
    }

    get defaultExportDialogConfig() {
        return ObjectHelper.copyProperties(super.defaultExportDialogConfig, this, ['scheduleRange']);
    }

    showExportDialog() {
        const me = this;

        if (!me.exportDialog) {
            me.exportDialog = new SchedulerExportDialog(Object.assign({}, me.defaultExportDialogConfig, {
                listeners : {
                    export  : me.onExportDialogExport,
                    thisObj : me
                }
            }));
        }

        me.exportDialog.show();
    }

    buildExportConfig(config) {
        config = super.buildExportConfig(config);

        const {
            scheduleRange,
            rangeStart,
            rangeEnd
        } = this;

        // Time axis is filtered from UI, need to append it
        if (config.columns && !config.columns.find(col => col.type === 'timeAxis')) {
            config.columns.push(config.client.timeAxisColumn.id);
        }

        return ObjectHelper.assign({
            scheduleRange,
            rangeStart,
            rangeEnd
        }, config);
    }
}

GridFeatureManager.registerFeature(PdfExport, false, 'Scheduler');
