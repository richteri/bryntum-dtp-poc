import Store from "../../../Core/data/Store.js";
import { GanttEvent } from "../model/event/GanttEvent.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js";
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js";
export const EventStoreMixin = (base) => {
    class EventStoreMixin extends base {
        static get defaultConfig() {
            return {
                tree: true,
                modelClass: GanttEvent
            };
        }
        buildRootNode() {
            return this.getProject() || {};
        }
    }
    return EventStoreMixin;
};
export const BuildMinimalEventStore = (base = Store) => EventStoreMixin(PartOfProjectStoreMixin(PartOfProjectGenericMixin(ChronoStoreMixin(base))));
export class MinimalEventStore extends BuildMinimalEventStore() {
}
//# sourceMappingURL=EventStoreMixin.js.map