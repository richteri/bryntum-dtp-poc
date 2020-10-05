import ResizeBase from '../../Scheduler/feature/base/ResizeBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import ResizeHelper from '../../Core/helper/ResizeHelper.js';

/**
 * @module Gantt/feature/TaskResize
 */

/**
 * Feature that allows resizing a task by dragging its end date. Resizing a task by dragging its start date is not allowed.
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/base/ResizeBase
 * @demo Gantt/basic
 */
export default class TaskResize extends ResizeBase {

    static get $name() {
        return 'TaskResize';
    }

    //region Events

    /**
     * Fired on the owning Gantt before resizing starts. Return false to prevent operation
     * @event beforeTaskResize
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Event} event
     */

    /**
     * Fires on the owning Gantt when task resizing starts
     * @event taskResizeStart
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Event} event
     */

    /**
     * Fires on the owning Gantt on each resize move event
     * @event taskPartialResize
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Date} start
     * @param {Date} end
     * @param {HTMLElement} element
     */

    /**
     * Fired on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  gantt.on('beforetaskresizefinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * @event beforeTaskResizeFinalize
     * @param {Object} data
     * @param {Gantt.view.Gantt} data.source Gantt instance
     * @param {Object} data.context
     * @param {Boolean} data.context.async Set true to handle resize asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} data.context.finalize Call this method to finalize resize. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Gantt after the resizing gesture has finished.
     * @event taskResizeEnd
     * @param {Boolean} wasChanged
     * @param {Gantt.model.TaskModel} taskRecord
     */

    //endregion

    //region Gantt specifics

    // Used by ResizeBase to get a taskRecord from the drag context
    getTimespanRecord(context) {
        return context.taskRecord;
    }

    getRowRecord(context) {
        return context.taskRecord;
    }

    // Injects Gantt specific data into the drag context
    setupProductResizeContext(context, event) {
        const gantt = this.client,
            taskRecord    = gantt.resolveTaskRecord(context.element);

        Object.assign(context, {
            taskRecord,
            dateConstraints : gantt.getDateConstraints(taskRecord)
        });
    }

    // Store used by ResizeBase to detect updates on dropped record
    get store() {
        return this.client.taskStore;
    }

    internalUpdateRecord(context, timespanRecord) {
        const newDuration   = timespanRecord.run('calculateProjectedDuration', context.startDate, context.endDate);

        if (newDuration === timespanRecord.duration) {
            // Invalidate last used width, to force redraw with that width
            context.element.lastDomConfig.style.width = null;
            return false;
        }
        else {
            timespanRecord.setDuration(newDuration);
            return true;
        }
    }

    //endregion

    createResizeHelper() {
        const
            me = this,
            client = me.client;

        return new ResizeHelper({
            name               : me.constructor.name, // for debugging
            isElementResizable : (el, event) => me.isElementResizable(el, event),
            targetSelector     : client.eventSelector,
            resizingCls        : 'b-sch-event-resizing',
            allowResize        : me.isElementResizable.bind(me),
            outerElement       : client.timeAxisSubGridElement, // constrain resize to view
            scrollManager      : client.scrollManager,
            // we do not allow resizing by the start date
            leftHandle         : false,
            dragThreshold      : 0,
            dynamicHandleSize  : true,
            reservedSpace      : 5,
            listeners          : {
                beforeresizestart : me.onBeforeResizeStart,
                resizestart       : me.onResizeStart,
                resizing          : me.onResizing,
                resize            : me.onFinishResize,
                cancel            : me.onCancelResize,
                thisObj           : me
            },
            highlightHandle() {
                const target = DomHelper.up(this.currentElement, this.targetSelector),
                    taskEl = DomHelper.up(this.currentElement, client.eventInnerSelector);

                // over a handle, add cls to change cursor
                if (taskEl) {
                    taskEl.classList.add('b-resize-handle');
                    target.classList.add('b-over-resize-handle');
                }
            },

            unHighlightHandle() {
                const target = DomHelper.up(this.currentElement, this.targetSelector);

                target && target.classList.remove('b-over-resize-handle');

                const currentTarget = DomHelper.up(this.currentElement, client.eventInnerSelector);
                currentTarget && currentTarget.classList.remove('b-resize-handle');
                this.currentElement = null;
            }
        });
    }
}

GridFeatureManager.registerFeature(TaskResize, true, 'Gantt');
