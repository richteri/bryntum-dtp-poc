import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import DomSync from '../../Core/helper/DomSync.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';

/**
 * @module Gantt/feature/Baselines
 */

const baselineSelector = '.b-task-baseline';

/**
 * Displays a {@link Gantt.model.TaskModel task}'s {@link Gantt.model.TaskModel#field-baselines baselines}
 * below the tasks in the timeline.
 *
 * This feature also optionally shows a tooltip when hovering any of the task's baseline elements. The
 * tooltip's content may be customized
 *
 * This feature is **disabled** by default
 *
 * @extends Scheduler/feature/base/TooltipBase
 * @externalexample gantt/feature/Baselines.js
 * @demo Gantt/baselines
 */
export default class Baselines extends TooltipBase {
    //region Config

    static get $name() {
        return 'Baselines';
    }

    // Default configuration.
    static get defaultConfig() {
        return {
            cls         : 'b-gantt-task-tooltip',
            align       : 't-b',
            forSelector : baselineSelector,
            recordType  : 'baseline'
        };
    }

    static get pluginConfig() {
        return {
            chain : [
                // onTaskDataGenerated for populating task with baselines
                'onTaskDataGenerated',
                // render for creating tooltip (in TooltipBase)
                'render'
            ]
        };
    }

    //endregion

    //region Init & destroy

    construct(gantt, config) {
        const me = this;

        me.tipId = `${gantt.id}-baselines-tip`;
        me.gantt = gantt;

        super.construct(gantt, config);

        me.ganttDetatcher = gantt.on({
            taskDrag      : 'onTaskDrag',
            afterTaskDrop : 'onAfterTaskDrop',
            thisObj       : me
        });

        me.storeDetacher = gantt.taskStore.on({
            update : {
                fn      : 'onStoreUpdateRecord',
                thisObj : me,
                prio    : 1000
            }
        });
    }

    doDestroy() {
        this.ganttDetatcher && this.ganttDetatcher();
        this.storeDetacher && this.storeDetacher();
        super.doDestroy();
    }

    doDisable(disable) {
        const
            me               = this,
            { dependencies } = me.client.features;

        // Hide or show the baseline elements
        me.client.refresh();

        // Redraw dependencies *after* elements have animated to new position,
        // and we must clear cache because of position changes.
        if (dependencies) {
            me.client.setTimeout(() => dependencies.scheduleDraw(true), 300);
        }

        super.doDisable(disable);
    }

    //endregion

    //region Events

    /**
     * This responds to *unsuccessful* drags of tasks.
     *
     * The task element will be animated back to its original position. This method
     * begins a continuous correction of baseline element position to cover any transitioned
     * movement of the wrapper to its new position. The monitoring persists for 300ms
     * @param {Object} event The afterTaskDrop event
     * @private
     */
    onAfterTaskDrop({ valid }) {
        if (!valid && !this.disabled) {
            this.monitorBaselineSync(300);
        }
    }

    /**
     * This responds to task timeline position changes for rendered tasks.
     *
     * If the position has changed, it begins a continuous correction of baseline
     * element position to cover any transitioned movement of the wrapper to its new position.
     * The monitoring persists for 300ms
     * @param {Object} event The update event
     * @private
     */
    onStoreUpdateRecord({ record, changes }) {
        if (!this.disabled && (changes.startDate || changes.endDate) && this.gantt.getElementFromTaskRecord(record)) {
            this.monitorBaselineSync(300);
        }
    }

    onTaskDrag({ taskRecords, dragData }) {
        !this.disabled && this.updateTaskBaselines(taskRecords[0], dragData.context.newX);
    }

    updateTaskBaselines(taskRecord, left) {
        const { gantt } = this;

        // If there are no baselines, there's nothing to update
        if (taskRecord.baselines.count) {
            const taskElement = gantt.getElementFromTaskRecord(taskRecord, false);

            // Might be outside of view
            if (taskElement) {
                // On drag left is supplied, for other cases get it from DOM
                if (left == null) {
                    // Cannot use translateX, since position is transitioned
                    left = DomHelper.getOffsetX(taskElement, gantt.timeAxisSubGridElement) + gantt.scrollLeft;
                }

                // Update only the specific tasks baselines, instead of doing a full sync which costs more
                DomSync.sync({
                    domConfig     : this.getTaskDOMConfig(taskRecord, left),
                    targetElement : taskElement.syncIdMap.baselines
                });
            }
        }
    }

    //endregion

    //region Element & template

    monitorBaselineSync(duration) {
        if (this.baselineMonitor) {
            this.baselineMonitor.cancel();
        }
        this.baselineMonitor = FunctionHelper.animate(duration, this.syncAllBaselines, this);
    }

    syncAllBaselines() {
        !this.isDestroyed && this.gantt.taskStore.forEach(t => this.updateTaskBaselines(t));
    }

    resolveTimeSpanRecord(forElement) {
        const
            task            = this.client.resolveTimeSpanRecord(forElement),
            baselineElement = forElement.closest(baselineSelector);

        if (task && baselineElement) {
            return task.baselines.getAt(parseInt(baselineElement.dataset.index));
        }
    }

    /**
     * Template (a function accepting event data and returning a string) used to display info in the tooltip.
     * The template will be called with an object as with fields as detailed below
     * @config {Function}
     * @param {Object} data A data block containing the information needed to create tooltip content.
     * @param {Gantt.model.Baseline} data.baseline The Baseline record to display
     * @param {Gantt.model.TaskModel} data.baseline.task The owning task of the baseline.
     * @param {string} data.startClockHtml Predefined HTML to show the start time.
     * @param {string} data.endClockHtml Predefined HTML to show the end time.
     */
    template(data) {
        const
            me           = this,
            { baseline } = data,
            { task }     = baseline;

        let { decimalPrecision } = me;

        if (decimalPrecision == null) {
            decimalPrecision = me.client.durationDisplayPrecision;
        }

        const
            multiplier      = Math.pow(10, decimalPrecision),
            displayDuration = Math.round(baseline.duration * multiplier) / multiplier;

        return `
            <div class="b-gantt-task-title">${task.name} (baseline ${baseline.parentIndex + 1})</div>
            <table>
            <tr><td>${me.L('L{TaskTooltip.Start}')}:</td><td>${data.startClockHtml}</td></tr>
            ${baseline.milestone ? '' : `
                <tr><td>${me.L('L{TaskTooltip.End}')}:</td><td>${data.endClockHtml}</td></tr>
                <tr><td>${me.L('L{TaskTooltip.Duration}')}:</td><td class="b-right">${displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(baseline.durationUnit, baseline.duration !== 1)}</td></tr>
            `}
            </table>
            `;
    }

    getTaskDOMConfig(taskRecord, left) {
        const baselines = taskRecord.baselines.allRecords;

        return {
            className : `b-baseline-wrap`,
            style     : {
                flex : baselines.length * 0.5
            },
            dataset : {
                // Each feature putting contents in the task wrap should have this to simplify syncing and element
                // retrieval after sync
                taskFeature : 'baselines'
            },
            children : baselines.map((baseline, i) => {
                const baselineBox = this.gantt.taskRendering.getTaskBox(baseline);

                return baselineBox ? {
                    className : baseline.cls + 'b-task-baseline',
                    style     : {
                        width : baselineBox.width,
                        left  : baselineBox.left - left + 1
                    },
                    dataset : {
                        index : i
                    }
                } : null;
            }),
            syncOptions : {
                syncIdField : 'index'
            }
        };
    }

    onTaskDataGenerated({ taskRecord, left, wrapperChildren }) {
        if (!this.disabled && taskRecord.hasBaselines) {
            wrapperChildren.push(this.getTaskDOMConfig(taskRecord, left));
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(Baselines, false, 'Gantt');
