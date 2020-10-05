import DragBase from '../../Scheduler/feature/base/DragBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Rectangle from '../../Core/helper/util/Rectangle.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';

/**
 * @module Gantt/feature/TaskDrag
 */

/**
 * Allows user to drag and drop tasks within Gantt, to change their start date.
 *
 * One can use a custom validator function to decide if drop is allowed:
 *
 * ```javascript
 * let gantt = new Gantt({
 *   features: {
 *     taskDrag: {
 *       validatorFn(taskRecord, startDate) {
 *           return startDate < new Date();
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/base/DragBase
 * @demo Gantt/basic
 */
export default class TaskDrag extends DragBase {
    //region Config

    static get $name() {
        return 'TaskDrag';
    }

    static get defaultConfig() {
        return {
            /**
             * An empty function by default, but provided so that you can perform custom validation on
             * the item being dragged. This function is called during the drag and drop process and also after the drop is made.
             * Return true if the new position is valid, false to prevent the drag.
             * @param {Gantt.model.TaskModel[]} taskRecords an array containing the records for the tasks being dragged
             * @param {Date} date The date corresponding to the current mouse position
             * @param {Number} duration The duration of the item being dragged
             * @param {Event} e The event object
             * @return {Boolean}
             * @config {Function}
             */
            validatorFn : (taskRecords, date, duration, e) => true,

            /**
             * `this` reference for the validatorFn
             * @config {Object}
             */
            validatorFnThisObj : null,

            tooltipCls : 'b-gantt-taskdrag-tooltip'
        };
    }

    /**
     * Template used to generate drag tooltip contents.
     * ```
     * const gantt = new Gantt({
     *   features : {
     *     taskDrag : {
     *       dragTipTemplate({taskRecord, startText}) {
     *         return `${taskRecord.name}: ${startText}`
     *       }
     *     }
     *   }
     * });
     * ```
     * @config {Function} dragTipTemplate
     * @param {Object} data Tooltip data
     * @param {Gantt.model.TaskModel} data.taskRecord
     * @param {Boolean} data.valid Currently over a valid drop target or not
     * @param {Date} data.startDate New start date
     * @param {Date} data.endDate New end date
     * @param {String} data.startText Formatted new start date
     * @param {String} data.endText Formatted new end date
     * @param {String} data.startClockHtml Pre-generated HTML to display startDate as clock/calendar
     * @param {String} data.endClockHtml Pre-generated HTML to display endDate as clock/calendar
     * @param {Object} data.dragData Detailed drag context
     * @returns {String}
     */

    //endregion

    //region Events

    /**
     * Fired on the owning Gantt to allow implementer to prevent immediate finalization by setting `data.context.async = true`
     * in the listener, to show a confirmation popup etc
     * ```
     *  scheduler.on('beforetaskdropfinalize', ({context}) => {
     *      context.async = true;
     *      setTimeout(() => {
     *          // async code don't forget to call finalize
     *          context.finalize();
     *      }, 1000);
     *  })
     * ```
     * @event beforeTaskDropFinalize
     * @param {Gantt.view.Gantt} source Gantt instance
     * @param {Object} context
     * @param {Boolean} context.async Set true to handle dragdrop asynchronously (e.g. to wait for user
     * confirmation)
     * @param {Function} context.finalize Call this method to finalize dragdrop. This method accepts one
     * argument: pass true to update records, or false, to ignore changes
     */

    /**
     * Fired on the owning Gantt after task drop
     * @event afterTaskDrop
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {Boolean} valid
     */

    /**
     * Fired on the owning Gantt when a task is dropped
     * @event taskDrop
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {Boolean} isCopy
     */

    /**
     * Fired on the owning Gantt before task dragging starts. Return false to prevent the action
     * @event beforeTaskDrag
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel} taskRecord
     */

    /**
     * Fired on the owning Gantt when task dragging starts
     * @event taskDragStart
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     */

    /**
     * Fired on the owning Gantt when event is dragged
     * @event taskDrag
     * @param {Gantt.view.Gantt} source
     * @param {Gantt.model.TaskModel[]} taskRecords
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Object} dragData
     * @param {Boolean} changed `true` if startDate has changed.
     */

    //endregion

    //region Init

    construct(gantt, config) {
        this.gantt = gantt;
        this.store = gantt.taskStore;

        super.construct(gantt, config);
    }

    //endregion

    //region Drag events

    isElementDraggable(el, event) {

        const
            { gantt }       = this,
            taskElement     = DomHelper.up(el, gantt.eventSelector),
            { taskResize } = gantt.features;

        if (!taskElement) {
            return false;
        }

        // displaying something resizable within the event?
        // if (DomHelper.up(el, gantt.eventSelector).matches('[class$="-handle"]')) {
        if (el.matches('[class$="-handle"]')) {
            return false;
        }

        const taskRecord = gantt.resolveTaskRecord(taskElement);

        if (!taskRecord || !taskRecord.isDraggable) {
            return false;
        }

        // using TaskResize and over a virtual handle?
        // Milestones cannot be resized
        if (taskResize && !taskRecord.isMilestone && taskResize.resize.overAnyHandle(event, taskElement)) {
            return false;
        }

        return gantt.trigger('beforeTaskDrag', {
            taskRecord
        }) !== false;
    }

    triggerEventDrag(dd, start) {
        // Trigger the event on every mousemove so that features which need to adjust
        // Such as dependencies and baselines can keep adjusted.
        this.gantt.trigger('taskDrag', {
            taskRecords : dd.draggedRecords,
            startDate   : dd.startDate,
            endDate     : dd.endDate,
            dragData    : dd,
            changed     : dd.startDate - start !== 0
        });
    }

    //endregion

    //region Drag data

    getProductDragContext(dd) {
        return {
            valid : true
        };
    }

    setupProductDragData(info) {
        const
            me  = this,
            gantt = me.gantt,
            element = info.element,
            taskRecord = gantt.resolveTaskRecord(element),
            taskRegion = Rectangle.from(element),
            relatedRecords = me.getRelatedRecords(taskRecord) || [],
            dateConstraints = gantt.getDateConstraints(taskRecord);

        let eventBarEls = [element];

        me.setupConstraints(
            gantt.getScheduleRegion(taskRecord),
            taskRegion,
            gantt.timeAxisViewModel.snapPixelAmount,
            Boolean(dateConstraints)
        );

        // Collecting additional elements to drag
        relatedRecords.forEach(r => {
            ArrayHelper.include(eventBarEls, gantt.getElementFromTaskRecord(r, false));
        });

        const draggedRecords = [taskRecord, ...relatedRecords];

        return { record : taskRecord, dateConstraints, eventBarEls, draggedRecords };
    }

    /**
     * Get correct axis coordinate.
     * @private
     * @param {Gantt.model.TaskModel} taskRecord Record being dragged
     * @param {HTMLElement} element Element being dragged
     * @param {Number[]} coord XY coordinates
     * @returns {Number|Number[]} X,Y or XY
     */
    getCoordinate(taskRecord, element, coord) {
        return coord[0];
    }

    //endregion

    //region Finalize & validation

    // Called from EventDragBase to assert if a drag is valid or not
    checkDragValidity(dragData, event) {
        return this.validatorFn.call(this.validatorFnThisObj || this,
            dragData.draggedRecords,
            dragData.startDate,
            dragData.duration,
            event
        );
    }

    /**
     * Checks if a task can be dropped on the specified location
     * @private
     * @returns {Boolean} Valid (true) or invalid (false)
     */
    isValidDrop(dragData) {
        return true;
    }

    /**
     * Update tasks being dragged.
     * @private
     * @param {Object} context Drag data.
     */
    async updateRecords(context) {
        const
            taskRecord       = context.draggedRecords[0],
            oldStartDate     = taskRecord.startDate,
            startDate        = context.startDate,
            propagatePromise = taskRecord.setStartDate(startDate, true);

        // Process original dragged record
        await propagatePromise;

        // If not rejected (the startDate has changed), tell the world there was a successful drop.
        if (taskRecord.startDate - oldStartDate) {
            this.gantt.trigger('taskDrop', {
                taskRecords : context.draggedRecords
            });
        }
        else {
            this.dragData.valid = false;
        }

        return propagatePromise;
    }

    //endregion
}

GridFeatureManager.registerFeature(TaskDrag, true, 'Gantt');
