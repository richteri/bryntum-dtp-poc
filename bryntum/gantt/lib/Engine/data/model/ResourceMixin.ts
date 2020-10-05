import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import { Entity, generic_field } from "../../../ChronoGraph/replica/Entity.js"
import Model from "../../../Core/data/Model.js"
import { model_field, ModelBucketField } from "../../chrono/ModelFieldAtom.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { PartOfProjectStoreMixin } from "../store/mixin/PartOfProjectMixin.js"
import { AssignmentMixin } from "./AssignmentMixin.js"
import { HasCalendarMixin } from "./HasCalendarMixin.js"
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js"


const hasMixin = Symbol('ResourceMixin')


export const ResourceMixin = <T extends AnyConstructor<HasCalendarMixin>>(base : T) => {

    class ResourceMixin extends base {
        [hasMixin] () {}

        /**
         * Resource's name
         */
        @model_field({ type : 'string' })
        name                : string

        /**
         * The `Set` of [[AssignmentMixin]] instances, related to this resource
         */
        @generic_field({}, ModelBucketField)
        assigned         : Set<AssignmentMixin>


        /**
         * The `Array` of [[AssignmentMixin]] instances, related to this resource
         */
        get assignments () {
            return [ ...this.assigned ]
        }


        leaveProject () {
            const assignmentStore = this.getAssignmentStore()

            this.assigned.forEach(assignment => assignmentStore.remove(assignment))

            super.leaveProject()
        }
    }

    return ResourceMixin
}

/**
 * Resource mixin type
 *
 * This type represents a single "resource" in the gantt chart.
 */
export interface ResourceMixin extends Mixin<typeof ResourceMixin> {}


/**
 * A function to build a constructor of minimal possible [[ResourceMixin]] class.
 */
export const BuildMinimalResource = (base : typeof Model = Model) : MixinConstructor<typeof ResourceMixin> =>
    (ResourceMixin as any)(
    HasCalendarMixin(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    ChronoModelMixin(
    Entity(
        base
    ))))))


/**
 * A minimal possible [[ResourceMixin]] class.
 */
export class MinimalResource extends BuildMinimalResource() {}


/**
 * [[ResourceMixin]] type guard
 */
export const hasResourceMixin = (model : any) : model is ResourceMixin => Boolean(model && model[hasMixin])
