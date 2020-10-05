import { ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import { calculate, Entity, field, generic_field } from "../../../ChronoGraph/replica/Entity.js"
import { isAtomicValue } from "../../../ChronoGraph/util/Helper.js"
import Model from "../../../Core/data/Model.js"
import DateHelper from "../../../Core/helper/DateHelper.js"
import { CalendarMixin } from "../../calendar/CalendarMixin.js"
import { model_field, ModelReferenceField } from "../../chrono/ModelFieldAtom.js"
import { DependenciesCalendar, DependencyType, Duration, TimeUnit } from "../../scheduling/Types.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { ModelId } from "../Types.js"
import { HasDependencies } from "./event/HasDependencies.js"
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js"


const hasMixin = Symbol('hasMixin')


export const DependencyMixin = <T extends AnyConstructor<PartOfProjectMixin>>(base : T) => {

    class DependencyMixin extends base {
        [hasMixin] () {}

        @generic_field(
            {
                bucket : 'outgoingDeps',
                resolver : function (id : ModelId) { return this.getEventById(id) },
                modelFieldConfig : {
                    persist   : true,
                    serialize : event => event.id
                },
            },
            ModelReferenceField
        )
        fromEvent           : HasDependencies

        @generic_field(
            {
                bucket : 'incomingDeps',
                resolver : function (id : ModelId) { return this.getEventById(id) },
                modelFieldConfig : {
                    persist   : true,
                    serialize : event => event.id
                },
            },
            ModelReferenceField
        )
        toEvent             : HasDependencies

        @model_field({ type : 'number', defaultValue : 0 })
        lag                 : Duration

        @model_field({ type : 'string', defaultValue : TimeUnit.Day }, { converter : DateHelper.normalizeUnit })
        lagUnit             : TimeUnit

        @model_field({ type : 'string', defaultValue : DependencyType.EndToStart})
        type                : DependencyType

        @field()
        calendar            : CalendarMixin


        // this makes the dependency's self-atom to change
        // (and trigger calculation of the `incomingDeps / outgoingDeps` on the related events)
        // on every change of the `lag / lagUnit / type` fields
        * calculateSelf () : ChronoIterator<this> {
            yield this.$.lag
            yield this.$.lagUnit
            yield this.$.type

            return this
        }


        @calculate('calendar')
        * calculateCalendar () : ChronoIterator<CalendarMixin> {
            const dependenciesCalendar = yield this.getProject().$.dependenciesCalendar

            let calendar : CalendarMixin

            switch (dependenciesCalendar) {
                case DependenciesCalendar.Project:
                    calendar            = yield this.getProject().$.calendar
                    break
                case DependenciesCalendar.FromEvent:
                    const fromEvent     = yield this.$.fromEvent
                    calendar            = fromEvent && !isAtomicValue(fromEvent) ? yield fromEvent.$.calendar : null
                    break
                case DependenciesCalendar.ToEvent:
                    const toEvent       = yield this.$.toEvent
                    calendar            = toEvent && !isAtomicValue(toEvent) ? yield toEvent.$.calendar : null
                    break
            }

            // the only case when there will be no calendar is when there's no either from/to event
            // what to return in such case? use project calendar as "defensive" approach
            if (!calendar) calendar     = yield this.getProject().$.calendar

            // this will create an incoming edge from the calendar self-atom, which changes on calendar's data update
            yield calendar.$$

            return calendar
        }

        async setLag (lag : Number, lagUnit : TimeUnit = this.lagUnit) : Promise<PropagationResult> {
            this.$.lag.put(lag)
            this.$.lagUnit.put(lagUnit)

            return this.propagate()
        }
    }

    return DependencyMixin
}

/**
 * Dependency mixin type
 */
export interface DependencyMixin extends Mixin<typeof DependencyMixin> {}


export const BuildMinimalDependency = (base : typeof Model = Model) : MixinConstructor<typeof DependencyMixin> =>
    (DependencyMixin as any)(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    ChronoModelMixin(
    Entity(
        base
    )))))


export class MinimalDependency extends BuildMinimalDependency() {}


/**
 * [[DependencyMixin]] type guard
 */
export const hasDependencyMixin = (model : any) : model is DependencyMixin => Boolean(model && model[hasMixin])
