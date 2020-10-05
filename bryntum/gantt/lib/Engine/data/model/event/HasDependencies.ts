import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { generic_field, calculate } from "../../../../ChronoGraph/replica/Entity.js"
import { isAtomicValue } from "../../../../ChronoGraph/util/Helper.js"
import { CalendarMixin } from "../../../calendar/CalendarMixin.js"
import { model_field, ModelBucketField } from '../../../chrono/ModelFieldAtom.js'
import { DependencyType, TimeUnit } from "../../../scheduling/Types.js"
import { DependencyMixin } from "../DependencyMixin.js"
import { ConstrainedEvent, ConstraintInterval } from "./ConstrainedEvent.js"
import { intersectIntervals, DateInterval } from "../../../scheduling/DateInterval.js"
import { ConstrainedLateEvent } from "./ConstrainedLateEvent.js"


//---------------------------------------------------------------------------------------------------------------------
export const HasDependencies = <T extends AnyConstructor<ConstrainedLateEvent>>(base : T) => {

    class HasDependencies extends base {

        // TODO - fix this
        // currently the prototype must have at least one field declared with @model_field decorator,
        // for the `injectStaticFieldsProperty` function to be called
        // otherwise, the "common" fields won't be created on the model
        // this behavior should be contained in the `ModelField` itself somehow
        @model_field()
        dontRemoveMe    : any

        /**
         * A set of outgoing dependencies from this task
         */
        @generic_field({}, ModelBucketField)
        outgoingDeps    : Set<DependencyMixin>

        /**
         * A set of incoming dependencies for this task
         */
        @generic_field({}, ModelBucketField)
        incomingDeps    : Set<DependencyMixin>

        @calculate('earlyStartDateConstraintIntervals')
        * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<DateInterval[]> {
            // if (window.DEBUG) debugger

            const intervals : ConstraintInterval[] = yield* super.calculateEarlyStartDateConstraintIntervals()

            let dependency : DependencyMixin

            for (dependency of (yield this.$.incomingDeps)) {
                const fromEvent : HasDependencies = yield dependency.$.fromEvent

                // ignore missing from events
                if (fromEvent == null || isAtomicValue(fromEvent)) continue

                let interval : ConstraintInterval

                switch (dependency.type) {
                    case DependencyType.EndToStart:
                        const fromEventEndDate : Date = yield fromEvent.$.earlyEndDateRaw

                        if (fromEventEndDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : calendar.calculateEndDate(fromEventEndDate, lag, lagUnit),
                                endDate             : null,

                                originDescription   : `"end to start" dependency from task ${fromEvent}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break

                    case DependencyType.StartToStart:
                        const fromEventStartDate : Date = yield fromEvent.$.earlyStartDateRaw

                        if (fromEventStartDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : calendar.calculateEndDate(fromEventStartDate, lag, lagUnit),
                                endDate             : null,

                                originDescription   : `"start to start" dependency from task ${fromEvent}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break
                }

                interval && intervals.unshift(interval)
            }

            return intervals
        }


        @calculate('earlyEndDateConstraintIntervals')
        * calculateEarlyEndDateConstraintIntervals () : ChronoIterator<DateInterval[]> {
            // if (window.DEBUG) debugger

            const intervals : ConstraintInterval[] = yield* super.calculateEarlyEndDateConstraintIntervals()

            let dependency : DependencyMixin

            for (dependency of (yield this.$.incomingDeps)) {
                const fromEvent : HasDependencies = yield dependency.$.fromEvent

                // ignore missing from events
                if (fromEvent == null || isAtomicValue(fromEvent)) continue

                let interval : ConstraintInterval

                switch (dependency.type) {
                    case DependencyType.EndToEnd:
                        const fromEventEndDate : Date = yield fromEvent.$.earlyEndDateRaw

                        if (fromEventEndDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : calendar.calculateEndDate(fromEventEndDate, lag, lagUnit),
                                endDate             : null,

                                originDescription   : `"end to end" dependency from task ${fromEvent}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break

                    case DependencyType.StartToEnd:
                        const fromEventStartDate : Date = yield fromEvent.$.earlyStartDateRaw

                        if (fromEventStartDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : calendar.calculateEndDate(fromEventStartDate, lag, lagUnit),
                                endDate             : null,

                                originDescription   : `"start to end" dependency from task ${fromEvent}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break
                }

                interval && intervals.unshift(interval)
            }

            return intervals
        }


        @calculate('lateStartDateConstraintIntervals')
        * calculateLateStartDateConstraintIntervals () : ChronoIterator<ConstraintInterval[]> {
            // if (window.DEBUG) debugger

            const intervals : ConstraintInterval[] = yield* super.calculateLateStartDateConstraintIntervals() as any

            let dependency : DependencyMixin

            for (dependency of (yield this.$.outgoingDeps)) {
                const successor : HasDependencies = yield dependency.$.toEvent

                // ignore missing from events
                if (successor == null || isAtomicValue(successor)) continue

                let interval : ConstraintInterval

                switch (dependency.type) {
                    case DependencyType.StartToStart:
                        const successorStartDate : Date = yield successor.$.lateStartDateRaw

                        if (successorStartDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : null,
                                endDate             : calendar.calculateStartDate(successorStartDate, lag, lagUnit),

                                originDescription   : `"start to start" dependency to task ${successor}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break

                    case DependencyType.StartToEnd :
                        const successorEndDate : Date = yield successor.$.lateEndDateRaw

                        if (successorEndDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : null,
                                endDate             : calendar.calculateStartDate(successorEndDate, lag, lagUnit),

                                originDescription   : `"start to end" dependency to task ${successor}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break
                }

                interval && intervals.unshift(interval)
            }

            return intervals
        }


        @calculate('lateEndDateConstraintIntervals')
        * calculateLateEndDateConstraintIntervals () : ChronoIterator<ConstraintInterval[]> {
            // if (window.DEBUG) debugger

            const intervals : ConstraintInterval[] = yield* super.calculateLateEndDateConstraintIntervals() as any

            let dependency : DependencyMixin

            for (dependency of (yield this.$.outgoingDeps)) {
                const successor : HasDependencies = yield dependency.$.toEvent

                // ignore missing from events
                if (successor == null || isAtomicValue(successor)) continue

                let interval : ConstraintInterval

                switch (dependency.type) {
                    case DependencyType.EndToEnd:
                        const successorEndDate : Date = yield successor.$.lateEndDateRaw

                        if (successorEndDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : null,
                                endDate             : calendar.calculateStartDate(successorEndDate, lag, lagUnit),

                                originDescription   : `"end to end" dependency to task ${successor}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break

                    case DependencyType.EndToStart:
                        const successorStartDate : Date = yield successor.$.lateStartDateRaw

                        if (successorStartDate) {
                            const lag : number             = yield dependency.$.lag
                            const lagUnit : TimeUnit       = yield dependency.$.lagUnit
                            const calendar : CalendarMixin = yield dependency.$.calendar

                            interval = ConstraintInterval.new({
                                startDate           : null,
                                endDate             : calendar.calculateStartDate(successorStartDate, lag, lagUnit),

                                originDescription   : `"end to start" dependency to task ${successor}`,

                                onRemoveAction      : this.getOnRemoveAction(dependency)
                            })
                        }
                        break
                }

                interval && intervals.unshift(interval)
            }

            return intervals
        }


        // This is for conflict resolution
        getOnRemoveAction (dependency : DependencyMixin) : () => any {
            return () => {
                this.getDependencyStore().remove(dependency)
            }
        }


        async setIncomingDeps (deps : Array<DependencyMixin> | Set<DependencyMixin>) : Promise<PropagationResult>  {
            // predecessors
            const dependencyStore = this.getDependencyStore()

            this.incomingDeps.forEach(dependency => dependencyStore.remove(dependency))

            deps.forEach(dependency => {
                dependency.toEvent = this
                dependencyStore.add(dependency)
            })

            return this.propagate()
        }


        async setOutgoingDeps (deps : Array<DependencyMixin> | Set<DependencyMixin>) : Promise<PropagationResult> {
            // successors
            const dependencyStore = this.getDependencyStore()

            this.outgoingDeps.forEach(dependency => dependencyStore.remove(dependency))

            deps.forEach(dependency => {
                dependency.fromEvent = this
                dependencyStore.add(dependency)
            })

            return this.propagate()
        }


        // * calculateLateStartDateRaw () : ChronoIterator<Date | any> {
        //     let result : Date = yield* super.calculateLateStartDateRaw()
        //
        //     const startDateInterval : DateInterval = intersectIntervals(yield this.$.lateStartDateConstraintIntervals)
        //     const endDateInterval : DateInterval   = intersectIntervals(yield this.$.lateEndDateConstraintIntervals)
        //
        //     const effectiveInterval = intersectIntervals([
        //         startDateInterval,
        //         DateInterval.new({
        //             startDate : endDateInterval.startDateIsFinite() ? yield* this.calculateProjectedStartDate(endDateInterval.startDate) : null,
        //             endDate   : endDateInterval.endDateIsFinite() ? yield* this.calculateProjectedStartDate(endDateInterval.endDate) : null,
        //         })
        //     ])
        //
        //     if (effectiveInterval.endDateIsFinite() && effectiveInterval.endDate && (!result || result > effectiveInterval.endDate)) {
        //         result = effectiveInterval.endDate
        //     }
        //
        //     return result
        // }
        //
        //
        // * calculateLateEndDateRaw () : ChronoIterator<Date | any> {
        //     let result : Date = yield* super.calculateLateEndDateRaw()
        //
        //     const endDateInterval : DateInterval = intersectIntervals(yield this.$.lateEndDateConstraintIntervals)
        //     const startDateInterval : DateInterval = intersectIntervals(yield this.$.lateStartDateConstraintIntervals)
        //
        //     const effectiveInterval = intersectIntervals([
        //         endDateInterval,
        //         DateInterval.new({
        //             startDate : startDateInterval.startDateIsFinite() ? yield* this.calculateProjectedEndDate(startDateInterval.startDate) : null,
        //             endDate   : startDateInterval.endDateIsFinite() ? yield* this.calculateProjectedEndDate(startDateInterval.endDate) : null,
        //         })
        //     ])
        //
        //     if (effectiveInterval.endDateIsFinite() && effectiveInterval.endDate && (!result || result > effectiveInterval.endDate)) {
        //         result = effectiveInterval.endDate
        //     }
        //
        //     return result
        // }


        leaveProject () {
            const dependencyStore = this.getDependencyStore()

            this.incomingDeps.forEach(dependency => dependencyStore.remove(dependency))
            this.outgoingDeps.forEach(dependency => dependencyStore.remove(dependency))

            super.leaveProject()
        }
    }

    return HasDependencies
}


/**
 * This mixin adds support for scheduling event by dependencies.
 *
 * The supported dependency types are listed in this enum: [[DependencyType]]
 */
export interface HasDependencies extends Mixin<typeof HasDependencies> {}
