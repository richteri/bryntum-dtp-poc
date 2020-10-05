import { ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import { calculate, Entity, generic_field } from "../../../ChronoGraph/replica/Entity.js"
import Model from "../../../Core/data/Model.js"
import { model_field, ModelReferenceField } from "../../chrono/ModelFieldAtom.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { HasAssignments } from "./event/HasAssignments.js"
import { HasEffort } from "./event/HasEffort.js"
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js"
import { ResourceMixin } from "./ResourceMixin.js"

const hasMixin = Symbol('AssignmentMixin')

export const AssignmentMixin = <T extends AnyConstructor<PartOfProjectMixin>>(base : T) => {

    class AssignmentMixin extends base {
        [hasMixin] () {}

        /**
         * The numeric, percent-like value in the [ 0, 100 ] range, indicating what is the "contribution level"
         * of the resource to the event. Number 100, for example, means that for 8h event,
         * resource contributes 8h of working time. Number 50 means, for the same event, resource contributes
         * only 4h, etc.
         */
        @model_field({ type : 'number', defaultValue : 100 })
        units               : number

        /**
         * The reference to the event, this assignment belongs to.
         */
        @generic_field(
            {
                bucket           : 'assigned',
                resolver         : function (id) { return this.getEventById(id) },
                // NOTE: modelFieldConfig here somehow has effect since there is "event" relation
                // defined on the scheduler Assignment model
                modelFieldConfig : {
                    serialize : event => event.id
                }
            },
            ModelReferenceField
        )
        event               : HasAssignments

        /**
         * The reference to the resource, this assignment belongs to.
         */
        @generic_field(
            {
                bucket : 'assigned',
                resolver : function (id) { return this.getResourceById(id) },
                // NOTE: modelFieldConfig here somehow has effect since there is "resource" relation
                // defined on the scheduler Assignment model
                modelFieldConfig : {
                    serialize : resource => resource.id
                }
            },
            ModelReferenceField
        )
        resource            : ResourceMixin


        getUnits () {
            return this.units
        }


        setUnits (units : number) : Promise<PropagationResult> {
            this.putUnits(units)

            return this.propagate()
        }


        putUnits (units : number) {
            this.$.units.put(units)

            const event = this.event as HasEffort

            if (event && this.getGraph()) {
                event.markAsNeedRecalculation(event.$.dispatcher)
                event.markAsNeedRecalculation(event.$.startDate)
                event.markAsNeedRecalculation(event.$.endDate)
                event.markAsNeedRecalculation(event.$.duration)
                event.markAsNeedRecalculation(event.$.effort)

                event.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units))
            }
        }


        // setUnits (units : number) : Promise<PropagationResult> {
        //     return this.event.setAssignmentUnits(this, units)
        // }

        @calculate('units')
        * calculateUnits (proposedValue : number) : ChronoIterator<number> {
            const event                 = yield this.$.event

            // if event of assignment presents - we always delegate to it
            // (so that various assignment logic can be overridden by single event mixin)
            // if event has no `calculateAssignmentUnits` that probably indicates scheduler pro event
            if (event && event.calculateAssignmentUnits) return yield* event.calculateAssignmentUnits(this, proposedValue)

            // otherwise use proposed or current consistent value
            return proposedValue !== undefined ? proposedValue : this.$.units.getConsistentValue()
        }
    }

    return AssignmentMixin
}

/**
 * Assignment mixin type
 *
 * It contains references to the event and resource, along with numeric value, indicating the "contribution level" for the resource.
 *
 *
 */
export interface AssignmentMixin extends Mixin<typeof AssignmentMixin> {}


/**
 * Function to build a minimal possible [[AssignmentMixin]] class
 */
export const BuildMinimalAssignment = (base : typeof Model = Model) : MixinConstructor<typeof AssignmentMixin> =>
    (AssignmentMixin as any)(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    ChronoModelMixin(
    Entity(
        base
    )))))


export class MinimalAssignment extends BuildMinimalAssignment() {}

/**
 * The typeguard for the [[AssignmentMixin]]
 */
export const hasAssignmentMixin = (model : any) : model is AssignmentMixin => Boolean(model && model[hasMixin])
