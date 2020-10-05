import DragCreateBase from '../../Scheduler/feature/base/DragCreateBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/TaskDragCreate
 */

/**
 * Feature that allows the user to schedule a new task by dragging in empty parts of the gantt rows.
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/base/DragCreateBase
 * @demo Gantt/advanced
 */
export default class TaskDragCreate extends DragCreateBase {
    //region Config

    static get $name() {
        return 'TaskDragCreate';
    }

    static get defaultConfig() {
        return {
            // used by gantt to only allow one task per row
            preventMultiple : true,

            /**
             * An empty function by default, but provided so that you can perform custom validation on the event being created.
             * Return true if the new event is valid, false to prevent an event being created.
             * @param {Object} context A drag create context, containing at least{ start, end, taskRecord }
             * @param {Event} event The event object
             * @return {Boolean} isValid
             * @config {function}
             */
            validatorFn : () => {}
        };
    }

    //endregion

    //region Events

    /**
     * Fires on the owning Gantt after the task has been scheduled.
     * @event dragCreateEnd
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {MouseEvent} event The ending mouseup event.
     * @param {HTMLElement} proxyElement The proxy element showing the drag creation zone.
     */

    /**
     * Fires on the owning Gantt at the beginning of the drag gesture
     * @event beforeDragCreate
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Date} date The datetime associated with the drag start point.
     */

    /**
     * Fires on the owning Gantt after the drag start has created a proxy element.
     * @event dragCreateStart
     * @param {Gantt.view.Gantt} source
     * @param {HTMLElement} proxyElement The proxy representing the new event.
     */

    /**
     * Fired on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  scheduler.on('beforedragcreatefinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * @event beforeDragCreateFinalize
     * @param {Gantt.view.Gantt} source Scheduler instance
     * @param {HTMLElement} proxyElement Proxy element, representing future event
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle drag create asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize drag create. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fires on the owning Gantt at the end of the drag create gesture whether or not
     * a task was scheduled by the gesture.
     * @event afterDragCreate
     * @param {Gantt.view.Gantt} source
     * @param {HTMLElement} proxyElement The proxy element showing the drag creation zone.
     */

    //endregion

    //region Init

    construct(gantt, config) {
        const me = this;

        me.gantt = gantt;
        me.store = gantt.taskStore;

        super.construct(gantt, config);
    }

    //endregion

    //region Scheduler specific implementation

    async finalizeDragCreate(context) {
        const { taskRecord } = context;

        taskRecord.beginBatch();
        taskRecord.setStartDate(context.startDate);
        taskRecord.setEndDate(context.endDate);
        taskRecord.endBatch();

        await this.gantt.project.propagate();

        this.gantt.trigger('dragCreateEnd', {
            taskRecord,
            event        : context.event,
            proxyElement : this.proxy
        });
    }

    handleBeforeDragCreate(dateTime, event) {
        const
            me     = this,
            result = me.gantt.trigger('beforeDragCreate', {
                taskRecord : me.createContext.taskRecord,
                date       : dateTime,
                event
            });

        if (result) {
            // Tooltip will not be activated while drag is in progress,
            // but we need to hide it deliberately on drag start
            const tipFeature = me.gantt.features.scheduleTooltip;
            if (tipFeature) {
                tipFeature.hoverTip && tipFeature.hoverTip.hide();
            }
        }

        // Save date constraints
        me.dateConstraints = me.gantt.getDateConstraints(me.createContext.rowRecord, dateTime);

        return result;
    }

    checkValidity(context, event) {
        const me = this;

        context.taskRecord = context.rowRecord;

        return me.validatorFn.call(me.validatorFnThisObj || me, context, event);
    }

    // Row is not empty if task is scheduled
    isRowEmpty(taskRecord) {
        return !taskRecord.startDate || !taskRecord.endDate;
    }

    //endregion
}

GridFeatureManager.registerFeature(TaskDragCreate, true, 'Gantt');
