import ProCalendarManagerStore from '../../SchedulerPro/data/CalendarManagerStore.js';
import CalendarModel from '../model/CalendarModel.js';

/**
 * @module Gantt/data/CalendarManagerStore
 */

/**
 * A class representing the tree of calendars in the SchedulerPro chart. An individual calendar is represented as an instance of the
 * {@link Gantt.model.CalendarModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * Please refer to the [calendars guide](#guides/calendars.md) for details
 *
 * @extends SchedulerPro/data/CalendarManagerStore
 * @typings SchedulerPro/data/CalendarManagerStore -> SchedulerPro/data/ProCalendarManagerStore
 */
export default class CalendarManagerStore extends ProCalendarManagerStore {
    static get defaultConfig() {
        return {
            modelClass : CalendarModel
        };
    }
}
