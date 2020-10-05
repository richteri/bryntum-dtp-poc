import Store from "../../Core/data/Store.js";
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js";
import { PartOfProjectStoreMixin } from "../data/store/mixin/PartOfProjectMixin.js";
import { MinimalCalendarInterval } from "./CalendarIntervalMixin.js";
export class CalendarIntervalStore extends PartOfProjectStoreMixin(PartOfProjectGenericMixin(Store)) {
    static get defaultConfig() {
        return {
            modelClass: MinimalCalendarInterval
        };
    }
}
//# sourceMappingURL=CalendarIntervalStore.js.map