import Base from '../../../Core/Base.js';

/**
 * @module Gantt/view/mixin/GanttTimelineDateMapper
 */

export default Target => class GanttTimelineDateMapper extends (Target || Base) {
    /**
     * Method to get a displayed end date value, see {@link Gantt/view/mixin/GanttTimelineDateMapper#function-getFormattedEndDate} for more info.
     * @private
     * @param {Date} endDate The date to format
     * @param {Date} startDate The start date
     * @return {Date} The date value to display
     */
    getDisplayEndDate(endDate, startDate) {
        return endDate;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
