import Model from '../../Core/data/Model.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { BuildMinimalCalendar } from '../../Engine/calendar/CalendarMixin.js';
import ProCalendarIntervalModel from '../model/ProCalendarIntervalModel.js';

/**
 * @module SchedulerPro/model/ProCalendarModel
 */

/**
 * This class represents a calendar in the Scheduler Pro project. It contains a collection of the {@link SchedulerPro.model.ProCalendarIntervalModel}.
 * Every interval can be either recurrent (regularly repeating in time) or static.
 *
 * Please refer to the [calendars guide](#guides/calendars.md) for details
 *
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @extends Core/data/Model
 */
export default class ProCalendarModel extends PartOfProject(BuildMinimalCalendar(Model)) {
    /**
     * This method adds a single {@link SchedulerPro.model.ProCalendarIntervalModel} to the internal collection of the calendar
     *
     * @param {SchedulerPro.model.ProCalendarIntervalModel} interval
     *
     * @method addInterval
     */

    /**
     * This method adds an array of {@link SchedulerPro.model.ProCalendarIntervalModel} to the internal collection of the calendar
     *
     * @param {SchedulerPro.model.ProCalendarIntervalModel[]} intervals
     *
     * @method addIntervals
     */

    static get fields() {
        return [
            /**
             * The calendar name.
             * @field {String} name
             */

            /**
             * The number of days per a month (is used when converting the duration from one unit to another).
             *
             * @field {Number} daysPerMonth
             * @default 30
             */

            /**
             * The number of days per week (is used when converting the duration from one unit to another).
             *
             * @field {Number} daysPerWeek
             * @default 7
             */

            /**
             * The number of hours per day (is used when converting the duration from one unit to another).
             *
             * @field {Number} hoursPerDay
             * @default 24
             */

            /**
             * The flag, indicating, whether the "unspecified" time (time that does not belong to any interval
             * is working (`true`) or not (`false`).
             *
             * @field {Boolean} unspecifiedTimeIsWorking
             * @default true
             */
        ];
    }
    
    static get defaultConfig() {
        return {
            calendarIntervalModelClass : ProCalendarIntervalModel
        };
    }
}
