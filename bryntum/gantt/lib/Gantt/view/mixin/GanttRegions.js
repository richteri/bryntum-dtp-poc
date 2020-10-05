import Base from '../../../Core/Base.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DH from '../../../Core/helper/DateHelper.js';

/**
 * @module Gantt/view/mixin/GanttRegions
 */

/**
 * Functions to get regions (bounding boxes) for gantt, tasks etc.
 *
 * @mixin
 */
export default Target => class GanttRegions extends (Target || Base) {
    /**
     * Gets the region represented by the timeline and optionally only for a single task
     * @param {Gantt.model.TaskModel} taskRecord (optional) The task record
     * @return {Object} The region of the schedule
     */
    getScheduleRegion(taskRecord, local) {
        const
            me      = this,
            element = me.timeAxisSubGridElement;

        let region;

        if (taskRecord) {
            const taskElement = me.getElementFromTaskRecord(taskRecord);

            region = Rectangle.from(me.getRowById(taskRecord.id).getElement('locked'));

            if (taskElement) {
                const taskRegion = Rectangle.from(taskElement, element);

                region.y = taskRegion.y;
                region.bottom = taskRegion.bottom;
            }
            else {
                region.y = region.y + me.barMargin;
                region.bottom = region.bottom - me.barMargin;
            }
        }
        else {
            // TODO: This is what the bizarre function that was removed here did.
            // The coordinate space needs to be sorted out here!
            region = Rectangle.from(element).moveTo(null, 0);
            region.width = element.scrollWidth;

            region.y = region.y + me.barMargin;
            region.bottom = region.bottom - me.barMargin;
        }

        const
            taStart         = me.timeAxis.startDate,
            taEnd           = me.timeAxis.endDate,
            dateConstraints = me.getDateConstraints(taskRecord) || {
                start : taStart,
                end   : taEnd
            },
            top             = region.y,
            bottom          = region.bottom;

        let startX          = me.getCoordinateFromDate(DH.max(taStart, dateConstraints.start)),
            endX            = me.getCoordinateFromDate(DH.min(taEnd, dateConstraints.end));

        if (!local) {
            startX = me.translateToPageCoordinate(startX);
            endX = me.translateToPageCoordinate(endX);
        }

        return { top, right : Math.max(startX, endX), bottom, left : Math.min(startX, endX) };
    }

    translateToPageCoordinate(x) {
        const element = this.timeAxisSubGridElement;

        return x + element.getBoundingClientRect().left - element.scrollLeft;
    }

    // Decide if a record is inside a collapsed tree node, or inside a collapsed group (using grouping feature)
    isRowVisible(taskRecord) {
        // records in collapsed groups/brances etc are removed from processedRecords
        return this.store.indexOf(taskRecord) >= 0;
    }

    /**
     * Get the region for a specified task
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Boolean} [includeOutside]
     * @param {Boolean} [inner] Specify true to return the box for the task bar within the wrapper.
     * @returns {Core.helper.util.Rectangle}
     */
    getTaskBox(taskRecord, includeOutside = false, inner = false) {
        return this.taskRendering.getTaskBox(...arguments);
    }

    getSizeAndPosition() {
        return this.taskRendering.getSizeAndPosition(...arguments);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
