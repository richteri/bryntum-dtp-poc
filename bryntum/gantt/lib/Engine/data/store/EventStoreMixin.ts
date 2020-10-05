import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import Store from "../../../Core/data/Store.js"
import { GanttEvent } from "../model/event/GanttEvent.js"
import { ProjectMixin } from "../model/ProjectMixin.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js"
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js"


export const EventStoreMixin = <T extends AnyConstructor<PartOfProjectStoreMixin & ChronoStoreMixin>>(base : T) => {

    class EventStoreMixin extends base {
        rootNode            : ProjectMixin

        modelClass          : AnyConstructor<GanttEvent>

        static get defaultConfig () {
            return {
                tree        : true,
                modelClass  : GanttEvent
            }
        }

        buildRootNode () : object {
            return this.getProject() || {}
        }
    }

    return EventStoreMixin
}

export interface EventStoreMixin extends Mixin<typeof EventStoreMixin> {}
//export type EventStoreMixin = Mixin<typeof EventStoreMixin>


export const BuildMinimalEventStore = (base : typeof Store = Store) : MixinConstructor<typeof EventStoreMixin> =>
    (EventStoreMixin as any)(
    PartOfProjectStoreMixin(
    PartOfProjectGenericMixin(
    ChronoStoreMixin(
        base
    ))))


export class MinimalEventStore extends BuildMinimalEventStore() {}
