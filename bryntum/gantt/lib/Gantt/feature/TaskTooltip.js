import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Gantt/feature/TaskTooltip
 */

/**
 * This feature displays a task tooltip on mouse hover. The template of the tooltip is customizable
 * with the {@link #config-template} function.
 *
 *```javascript
 * new Gantt({
 *   features : {
 *     taskTooltip : {
 *         // Tooltip configs can be used here
 *         align : 'l-r' // Align left to right
 *     }
 *   }
 * });
 * ```
 *
 * This feature is **enabled** by default.
 *
 * @extends Scheduler/feature/base/TooltipBase
 * @demo Gantt/tooltips
 */
export default class TaskTooltip extends TooltipBase {

    static get $name() {
        return 'TaskTooltip';
    }

    static get defaultConfig() {
        return {
            /**
             * Template (a function accepting task data and returning a string) used to display info in the tooltip.
             * The template will be called with an object as with fields as detailed below
             * @param {Object} data
             * @param {Gantt.model.TaskModel} data.taskRecord
             * @param {string} data.startClockHtml
             * @param {string} data.endClockHtml
             * @config {function} template
             */
            template(data) {
                const
                    me             = this,
                    { taskRecord } = data;

                let { decimalPrecision } = me;

                if (decimalPrecision == null) {
                    decimalPrecision = me.client.durationDisplayPrecision;
                }

                const
                    multiplier      = Math.pow(10, decimalPrecision),
                    displayDuration = Math.round(taskRecord.duration * multiplier) / multiplier;

                return `
                    ${taskRecord.name ? `<div class="b-gantt-task-title">${taskRecord.name}</div>` : ''}
                    <table border="0" cellspacing="0" cellpadding="0">
                    <tr><td>${me.L('L{Start}')}:</td><td>${data.startClockHtml}</td></tr>
                    ${taskRecord.milestone ? '' : `
                        <tr><td>${me.L('L{End}')}:</td><td>${data.endClockHtml}</td></tr>
                        <tr><td>${me.L('L{Duration}')}:</td><td class="b-right">${displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(taskRecord.durationUnit, taskRecord.duration !== 1)}</td></tr>
                        <tr><td>${me.L('L{Complete}')}:</td><td class="b-right">${taskRecord.renderedPercentDone}%</td></tr>
                    `}
                    </table>
                `;
            },

            /**
             * Precision of displayed duration, defaults to use {@link Gantt.view.Gantt#config-durationDisplayPrecision}.
             * Specify a integer value to override that setting, or `false` to use raw value
             * @config {Number|Boolean}
             */
            decimalPrecision : null,

            cls : 'b-gantt-task-tooltip'
        };
    }
}

GridFeatureManager.registerFeature(TaskTooltip, true, 'Gantt');
