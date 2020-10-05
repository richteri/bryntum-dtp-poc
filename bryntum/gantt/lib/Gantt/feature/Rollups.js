import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import BrowserHelper from '../../Core/helper/BrowserHelper.js';

/**
 * @module Gantt/feature/Rollups
 */

const
    rollupCls      = 'b-task-rollup',
    rollupSelector = `.${rollupCls}`;

/**
 * If the task's {@link Gantt.model.TaskModel#field-rollup rollup} data field is set to true, it displays a small bar or diamond below its summary task in the timeline.
 * Each of the rollup elements show a tooltip when hovering it with details of the task.
 * The tooltip content is customizable, see {@link #config-template template} config for details.
 *
 * To edit the rollup data field, use {@link Gantt.column.RollupColumn RollupColumn} or a checkbox on Advanced tab of {@link Gantt.widget.TaskEditor TaskEditor}.
 *
 * This feature is **disabled** by default
 *
 * @extends Scheduler/feature/base/TooltipBase
 * @externalexample gantt/feature/Rollups.js
 * @demo Gantt/rollups
 */
export default class Rollups extends TooltipBase {
    //region Config

    static get $name() {
        return 'Rollups';
    }

    // Default configuration.
    static get defaultConfig() {
        return {
            cls         : 'b-gantt-task-tooltip',
            align       : 't-b',
            forSelector : rollupSelector
        };
    }

    static get pluginConfig() {
        return {
            chain : [
                // onTaskDataGenerated for decorating task with rollups
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

        me.tipId = `${gantt.id}-rollups-tip`;

        super.construct(gantt, config);

        me.storeDetacher = gantt.taskStore.on({
            update  : 'onStoreUpdateRecord',
            thisObj : me
        });
    }

    doDestroy() {
        this.storeDetacher && this.storeDetacher();
        super.doDestroy();
    }

    doDisable(disable) {
        const
            me = this,
            { dependencies } = me.client.features;

        if (me.tooltip) {
            me.tooltip.disabled = disable;
        }

        // Hide or show the rollup elements
        me.client.refresh();

        // Redraw dependencies *after* elements have animated to new position,
        // and we must clear cache because of position changes.
        if (dependencies) {
            me.client.setTimeout(() => dependencies.scheduleDraw(true), 300);
        }

        super.doDisable(disable);
    }

    //endregion

    getTipHtml({ activeTarget, event }) {
        const
            { client }              = this,
            task                    = client.resolveTaskRecord(activeTarget),
            isMs                    = BrowserHelper.isEdge || BrowserHelper.isIE11,
            elementsFromPointMethod = isMs ? 'msElementsFromPoint' : 'elementsFromPoint',
            rawElements             = document[elementsFromPointMethod](event.pageX + window.pageXOffset, event.pageY + window.pageYOffset),
            // MS browsers return NodeList instead of array
            rollupElements          = Array.from(rawElements)
                .filter(e => e.classList.contains(rollupCls))
                .sort((lhs, rhs) => parseInt(lhs.dataset.index, 10) - parseInt(rhs.dataset.index, 10)),
            children                = [];

        for (const rollupElement of rollupElements) {
            children.push(task.children[parseInt(rollupElement.dataset.index, 10)]);
        }
        return this.template({
            task,
            children
        });
    }

    /**
     * Template (a function accepting event data and returning a string) used to display info in the tooltip.
     * The template will be called with an object as with fields as detailed below
     * @config {Function}
     * @param {Object} data A data block containing the information needed to create tooltip content.
     * @param {Gantt.model.TaskModel} data.task The summary task to rollup to.
     * @param {Gantt.model.TaskModel[]} data.children The array of rollup tasks.
     */
    template({ children }) {
        const
            me         = this,
            { client } = me,
            pieces     = [];

        children.map((child, index) => {
            const
                { startDate, endDate } = child,
                startText              = client.getFormattedDate(startDate),
                endDateValue           = client.getDisplayEndDate(endDate, startDate),
                endText                = client.getFormattedDate(endDateValue);

            pieces.push(
                `<div class="b-gantt-task-title ${index ? 'b-follow-on' : ''}">${child.name}</div><table>`,
                `<tr><td>${me.L('L{TaskTooltip.Start}')}:</td><td>${me.clockTemplate.template({
                    date : startDate,
                    text : startText,
                    cls  : 'b-sch-tooltip-startdate'
                })}</td></tr>`,
                `<tr><td>${me.L('L{TaskTooltip.End}')}:</td><td>${child.isMilestone ? '' : me.clockTemplate.template({
                    date : endDateValue,
                    text : endText,
                    cls  : 'b-sch-tooltip-enddate'
                })}</td></tr></table>`
            );
        });

        return pieces.join('');
    }

    //region Events

    onStoreUpdateRecord({ record, changes }) {
        // If it's a size or position change, then sync that parent's rollups
        if (record.parent && (changes.rollup || changes.startDate || changes.endDate)) {
            this.client.taskRendering.redraw(record.parent);
        }
    }

    onTaskDataGenerated({ taskRecord, left, wrapperChildren }) {
        if (!this.disabled && taskRecord.isParent) {
            const
                // Shortest last in DOM, so they are on top in the stacking order so that you can hover
                // them if they overlap with longer ones. Otherwise, they might be below and won't trigger
                // their own mouseover events.
                children = taskRecord.children.slice().sort((lhs, rhs) => rhs.durationMS - lhs.durationMS);

            wrapperChildren.push({
                className : `${rollupCls}-wrap`,
                dataset   : {
                    taskFeature : 'rollups'
                },
                children : children.map(child => {
                    if (child.rollup) {
                        const positionData = this.client.getSizeAndPosition(child);

                        if (!positionData) {
                            return null;
                        }

                        const { position, width } = positionData;

                        return {
                            dataset : {
                                index        : child.parentIndex,
                                rollupTaskId : child.id
                            },
                            className : `${rollupCls} ${child.isMilestone ? 'b-milestone' : ''} ${child.cls}`,
                            style     : {
                                width : child.isMilestone ? null : width,
                                left  : position - left
                            }
                        };
                    }
                    return null;
                }),
                syncOptions : {
                    syncIdField : 'rollupTaskId'
                }
            });
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(Rollups, false, 'Gantt');
