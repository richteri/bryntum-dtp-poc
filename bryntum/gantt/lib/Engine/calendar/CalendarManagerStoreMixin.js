import Store from "../../Core/data/Store.js";
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js";
import { ChronoStoreMixin } from "../data/store/mixin/ChronoStoreMixin.js";
import { PartOfProjectStoreMixin } from "../data/store/mixin/PartOfProjectMixin.js";
import { MinimalCalendar } from "./CalendarMixin.js";
export const CalendarManagerStoreMixin = (base) => {
    return class CalendarManagerStoreMixin extends base {
        static get defaultConfig() {
            return {
                tree: true,
                modelClass: MinimalCalendar
            };
        }
    };
};
export const BuildMinimalCalendarManagerStore = (base = Store) => CalendarManagerStoreMixin(PartOfProjectStoreMixin(PartOfProjectGenericMixin(ChronoStoreMixin(base))));
export class MinimalCalendarManagerStore extends BuildMinimalCalendarManagerStore() {
}
//# sourceMappingURL=CalendarManagerStoreMixin.js.map