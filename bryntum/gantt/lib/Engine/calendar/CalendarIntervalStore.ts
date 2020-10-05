import { AnyConstructor } from "../../ChronoGraph/class/Mixin.js"
import Store from "../../Core/data/Store.js"
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js"
import { PartOfProjectStoreMixin } from "../data/store/mixin/PartOfProjectMixin.js"
import { CalendarIntervalMixin, MinimalCalendarInterval } from "./CalendarIntervalMixin.js"
import { CalendarMixin, MinimalCalendar } from "./CalendarMixin.js"

/**
 * This a collection of {@link #CalendarIntervalMixin} items. Its a dumb collection though, the "real" calendar
 * is a {@link CalendarMixin} model, which is part of the CalendarManager tree.
 *
 * @private
 */
export class CalendarIntervalStore extends PartOfProjectStoreMixin(PartOfProjectGenericMixin(Store)) {

    modelClass      : AnyConstructor<CalendarIntervalMixin> //typeof CalendarIntervalMixin

    calendar        : MinimalCalendar


    static get defaultConfig () {
        return {
            modelClass : MinimalCalendarInterval
        }
    }
}
