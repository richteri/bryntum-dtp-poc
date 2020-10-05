import { AnyConstructor, Mixin, MixinConstructor } from "../../ChronoGraph/class/Mixin.js"
import Store from "../../Core/data/Store.js"
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js"
import { ChronoStoreMixin } from "../data/store/mixin/ChronoStoreMixin.js"
import { PartOfProjectStoreMixin } from "../data/store/mixin/PartOfProjectMixin.js"
import { CalendarMixin, MinimalCalendar } from "./CalendarMixin.js"


export const CalendarManagerStoreMixin = <T extends AnyConstructor<PartOfProjectStoreMixin & ChronoStoreMixin>>(base : T) => {

    return class CalendarManagerStoreMixin extends base {

        modelClass          : AnyConstructor<CalendarMixin>

        static get defaultConfig () {
            return {
                tree            : true,
                modelClass      : MinimalCalendar
            }
        }
    }
}

/**
 * This is a collection of all calendars in the [[ProjectMixin]], organized as tree store.
 */
export interface CalendarManagerStoreMixin extends Mixin<typeof CalendarManagerStoreMixin> {}

/**
 * Function to a build a minimal possible [[CalendarManagerStoreMixin]] class.
 */
export const BuildMinimalCalendarManagerStore = (base : typeof Store = Store) : MixinConstructor<typeof CalendarManagerStoreMixin> =>
    (CalendarManagerStoreMixin as any)(
    PartOfProjectStoreMixin(
    PartOfProjectGenericMixin(
    ChronoStoreMixin(
        base
    ))))


/**
 * Minimal possible [[CalendarManagerStoreMixin]] class
 */
export class MinimalCalendarManagerStore extends BuildMinimalCalendarManagerStore() {}
