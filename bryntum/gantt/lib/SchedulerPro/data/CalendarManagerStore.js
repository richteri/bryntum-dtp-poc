import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from './mixin/PartOfProject.js';
import ProCalendarModel from '../model/ProCalendarModel.js';
import { BuildMinimalCalendarManagerStore } from '../../Engine/calendar/CalendarManagerStoreMixin.js';

/**
 * @module SchedulerPro/data/CalendarManagerStore
 */

/**
 * A class representing the tree of calendars in the SchedulerPro chart. An individual calendar is represented as an instance of the
 * {@link SchedulerPro.model.ProCalendarModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * Please refer to the [calendars guide](#guides/calendars.md) for details
 *
 * @extends Core/data/AjaxStore
 * @mixes SchedulerPro/data/mixin/PartOfProject
 */
export default class CalendarManagerStore extends PartOfProject(BuildMinimalCalendarManagerStore(AjaxStore)) {
    static get defaultConfig() {
        return {
            tree         : true,
            modelClass   : ProCalendarModel,
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 100,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 100,
            storeId      : 'calendars'
        };
    }
};
