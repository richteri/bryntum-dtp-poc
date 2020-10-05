import ProCalendarModel from '../../SchedulerPro/model/ProCalendarModel.js';
import CalendarIntervalModel from './CalendarIntervalModel.js';

/**
 * @module Gantt/model/CalendarModel
 */

/**
 * This class represents a calendar in the Gantt project. It contains a collection of the {@link SchedulerPro.model.ProCalendarIntervalModel}.
 * Every interval can be either recurrent (regularly repeating in time) or static.
 *
 * Please refer to the [calendars guide](#guides/calendars.md) for details
 *
 * @extends SchedulerPro/model/ProCalendarModel
 */
export default class CalendarModel extends ProCalendarModel {
    static get defaultConfig() {
        return {
            calendarIntervalModelClass : CalendarIntervalModel
        };
    }
}
