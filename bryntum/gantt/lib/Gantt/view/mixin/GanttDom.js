import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DomDataStore from '../../../Core/data/DomDataStore.js';

/**
 * @module Gantt/view/mixin/GanttDom
 */

const hyphenRe = /-/g;

/**
 * Mixin with TaskModel <-> HTMLElement mapping functions
 *
 * @mixin
 */
export default Target => class GanttDom extends (Target || Base) {
    // Alias for resolveTaskRecord method to satisfy the scheduler naming requirements.
    resolveEventRecord(element) {
        return this.resolveTaskRecord(element);
    }

    /**
     * Returns the task record for a DOM element
     * @param {HTMLElement} element The DOM node to lookup
     * @return {Gantt.model.TaskModel} The task record
     */
    resolveTaskRecord(element) {
        element = DomHelper.up(element, this.eventSelector);

        if (!element) {
            return null;
        }

        return this.taskStore.getById(element.dataset.taskId);
    }

    /**
     * Returns the HTMLElement representing a task record.
     *
     * @param {Gantt.model.TaskModel} taskRecord A task record
     * @param {Boolean} [inner] Specify `false` to return the task wrapper element
     *
     * @return {HTMLElement} The element representing the task record
     */
    getElementFromTaskRecord(taskRecord, inner = true) {
        return this.taskRendering.getElementFromTaskRecord(taskRecord, inner);
    }

    // alias to make scheduler features applied to Gantt happy
    // TODO: since we have decided to call tasks events then the method
    //       being aliased should be renamed
    getElementFromEventRecord(eventRecord) {
        return this.getElementFromTaskRecord(eventRecord);
    }

    /**
     * Generates the element `id` for an event element. This is used when
     * recycling an event div which has been moved from one resource to
     * another. The event is assigned its new render id *before* being
     * returned to the free pool, so that when the render engine requests
     * a div from the free pool, the same div will be returned and it will
     * smoothly transition to its new position.
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @private
     */
    getEventRenderId(taskRecord) {
        // TODO: use DomHelper.makeValidId or StringHelper.createId. Cannot currently since they strip out ids that only contains numbers
        return `${this.id.toString().replace(hyphenRe, '_')}-${taskRecord.id}`;
    }

    /**
     * In Gantt, the task is the row, so it's valid to resolve a mouse event on a task to the TimeAxisColumn's cell.
     *
     * This method find the cell location of the passed event. It returns an object describing the cell.
     * @param {Event} event A Mouse, Pointer or Touch event targeted at part of the grid.
     * @returns {Object} An object containing the following properties:
     * - `cellElement` - The cell element clicked on.
     * - `columnId` - The `id` of the column clicked under.
     * - `record` - The {@link Core.data.Model record} clicked on.
     * - `id` - The `id` of the {@link Core.data.Model record} clicked on.
     * @private
     * @category Events
     */
    getEventData(event) {
        const
            me     = this,
            record = me.resolveTimeSpanRecord(event.target);

        // If the event was on a task, then we're in one of the the TimeAxisColumn's cells.
        if (record) {
            const
                cellElement = me.getCell({
                    record,
                    column : me.timeAxisColumn
                }),
                cellData = DomDataStore.get(cellElement),
                id       = cellData.id,
                columnId = cellData.columnId;

            return {
                cellElement,
                cellData,
                columnId,
                id,
                record,
                cellSelector : { id, columnId }
            };
        }
        else {
            return super.getEventData(event);
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
