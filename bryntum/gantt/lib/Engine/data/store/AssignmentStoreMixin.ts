import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import Store from "../../../Core/data/Store.js"
import { MinimalAssignment } from "../model/AssignmentMixin.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js"
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js"


export const AssignmentStoreMixin = <T extends AnyConstructor<PartOfProjectStoreMixin & ChronoStoreMixin>>(base : T) => {

    class AssignmentStoreMixin extends base {
        modelClass          : AnyConstructor<MinimalAssignment>

        static get defaultConfig () {
            return {
                modelClass : MinimalAssignment
            }
        }
    }

    return AssignmentStoreMixin
}


export interface AssignmentStoreMixin extends Mixin<typeof AssignmentStoreMixin> {}


export const BuildMinimalAssignmentStore = (base : typeof Store = Store) : MixinConstructor<typeof AssignmentStoreMixin> =>
    (AssignmentStoreMixin as any)(
    PartOfProjectStoreMixin(
    PartOfProjectGenericMixin(
    ChronoStoreMixin(
        base
    ))))


export class MinimalAssignmentStore extends BuildMinimalAssignmentStore() {}
