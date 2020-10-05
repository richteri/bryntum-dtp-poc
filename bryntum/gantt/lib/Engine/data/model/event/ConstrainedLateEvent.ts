import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js"
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js"
import { DateInterval } from "../../../scheduling/DateInterval.js"
import { Direction, Duration, TimeUnit } from "../../../scheduling/Types.js"
import { isDateFinite, MAX_DATE, MIN_DATE } from "../../../util/Constants.js"
import { ConstrainedEvent } from "./ConstrainedEvent.js"
import { EventMixin } from "./EventMixin.js"
import { HasChildren } from "./HasChildren.js"
import DateHelper from "../../../../Core/helper/DateHelper.js"

//---------------------------------------------------------------------------------------------------------------------
export const ConstrainedLateEvent = <T extends AnyConstructor<ConstrainedEvent & HasChildren>>(base : T) => {

    class ConstrainedLateEvent extends base {
        //--------------------------
        @field()
        lateStartDateRaw : Date

        @model_field(
            { type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ', persist : false },
            { converter : dateConverter, persistent : false }
        )
        lateStartDate : Date


        //--------------------------
        @field()
        lateEndDateRaw : Date

        @model_field(
            { type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ', persist : false },
            { converter : dateConverter, persistent : false }
        )
        lateEndDate : Date


        //--------------------------
        /**
         * An array of intervals, constraining the start date (as point in time) of this event
         * in case the event is scheduled ALAP (as late as possible). It is calculated with [[calculateLateStartDateConstraintIntervals]]
         */
        @field()
        lateStartDateConstraintIntervals  : DateInterval[]

        /**
         * An array of intervals, constraining the end date (as point in time) of this event
         * in case the event is scheduled ALAP (as late as possible). It is calculated with [[calculateLateEndDateConstraintIntervals]]
         */
        @field()
        lateEndDateConstraintIntervals  : DateInterval[]

        /**
         * A field storing the _total slack_ (or _total float_) of the event.
         * The _total slack_ is the amount of time that this event can be delayed without causing a delay
         * to the project end.
         * The value is calculated in [[slackUnit]] units.
         */
        @model_field(
            { type : 'number', persist : false },
            { persistent : false }
        )
        totalSlack : Duration

        /**
         * A field storing unit for the [[totalSlack]] value.
         */
        @model_field(
            { type : 'string', defaultValue : TimeUnit.Day, persist : false },
            { converter : DateHelper.normalizeUnit, persistent : false }
        )
        slackUnit : TimeUnit

        /**
         * A boolean field, indicating whether the event is critical or not.
         * The event is __critical__ if its [[totalSlack|total slack]] is zero (or less than zero).
         * This means that if the event is delayed, its successor tasks and the project finish date are delayed as well.
         */
        @model_field(
            { type : 'boolean', defaultValue : false, persist : false },
            { persistent : false }
        )
        critical                        : boolean


        /**
         * Calculation method for the [[lateStartDateConstraintIntervals]]. Returns empty array by default.
         * Override this method to return some extra constraints for the start date during the ALAP scheduling.
         */
        @calculate('lateStartDateConstraintIntervals')
        * calculateLateStartDateConstraintIntervals () : ChronoIterator<this[ 'lateStartDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = []

            const parentEvent : HasChildren & ConstrainedLateEvent = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.lateStartDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        /**
         * Calculation method for the [[lateEndDateConstraintIntervals]]. Returns empty array by default.
         * Override this method to return some extra constraints for the end date during the ALAP scheduling.
         */
        @calculate('lateEndDateConstraintIntervals')
        * calculateLateEndDateConstraintIntervals () : ChronoIterator<this[ 'lateEndDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = []

            const parentEvent : HasChildren & ConstrainedLateEvent = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.lateEndDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        @calculate('lateStartDateRaw')
        * calculateLateStartDateRaw () : ChronoIterator<Date | boolean> {
            const childEvents : Set<HasChildren & ConstrainedLateEvent> = yield this.$.childEvents

            let result : Date

            if (childEvents.size) {
                result = MAX_DATE

                for (let childEvent of childEvents) {
                    const childDate : Date = yield childEvent.$.lateStartDateRaw

                    if (childDate && childDate < result) result = childDate
                }

                result = result.getTime() - MAX_DATE.getTime() ? result : null

            } else {
                if (!(yield* this.isConstrainedLate())) {
                    return yield this.$.startDate
                }

                const startDateConstraintIntervals : DateInterval[] = yield this.$.lateStartDateConstraintIntervals
                const endDateConstraintIntervals : DateInterval[]   = yield this.$.lateEndDateConstraintIntervals

                const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(
                    true,
                    // need to use concat instead of directly mutating the `startDateConstraintIntervals` since that is
                    // used as storage for `this.$.lateStartDateConstraintIntervals`
                    startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals),
                    endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals),
                ))

                if (!effectiveInterval || !isDateFinite(effectiveInterval.endDate)) return null

                result = effectiveInterval.endDate
            }

            return result
        }


        @calculate('lateStartDate')
        * calculateLateStartDate () : ChronoIterator<Date | boolean> {
            const date : Date = yield this.$.lateStartDateRaw

            return yield* this.maybeSkipNonWorkingTime(date, true)
        }


        @calculate('lateEndDateRaw')
        * calculateLateEndDateRaw () : ChronoIterator<Date> {
            const childEvents : Set<HasChildren & ConstrainedLateEvent> = yield this.$.childEvents

            let result : Date

            if (childEvents.size) {
                result = MIN_DATE

                for (let childEvent of childEvents) {
                    const childDate : Date = yield childEvent.$.lateEndDateRaw

                    if (childDate && childDate > result) result = childDate
                }

                result = result.getTime() - MIN_DATE.getTime() ? result : null

            } else {
                if (!(yield* this.isConstrainedLate() as any)) {
                    return yield this.$.endDate
                }

                const startDateConstraintIntervals : DateInterval[] = yield this.$.lateStartDateConstraintIntervals
                const endDateConstraintIntervals : DateInterval[]   = yield this.$.lateEndDateConstraintIntervals

                const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(
                    false,
                    // need to use concat instead of directly mutating the `startDateConstraintIntervals` since that is
                    // used as storage for `this.$.lateStartDateConstraintIntervals`
                    startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals),
                    endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals),
                ))

                if (!effectiveInterval || !isDateFinite(effectiveInterval.endDate)) return null

                result = effectiveInterval.endDate
            }

            return result
        }


        @calculate('lateEndDate')
        * calculateLateEndDate () : ChronoIterator<Date | boolean> {
            const date : Date = yield this.$.lateEndDateRaw

            return yield* this.maybeSkipNonWorkingTime(date, false)
        }


        @calculate('totalSlack')
        * calculateTotalSlack () : ChronoIterator<Duration> {
            const earlyStartDate = yield this.$.earlyStartDateRaw
            const lateStartDate  = yield this.$.lateStartDateRaw
            const earlyEndDate   = yield this.$.earlyEndDateRaw
            const lateEndDate    = yield this.$.lateEndDateRaw
            const slackUnit      = yield this.$.slackUnit

            let endSlack : Duration, result : Duration

            const isByEarly     = earlyStartDate && lateStartDate && isDateFinite(earlyStartDate) && isDateFinite(lateStartDate)
            const isByLate      = earlyEndDate && lateEndDate && isDateFinite(earlyEndDate) && isDateFinite(lateEndDate)

            if (isByEarly || isByLate) {
                if (isByEarly) {
                    result = yield* this.calculateProjectedDuration(earlyStartDate, lateStartDate, slackUnit)

                    if (isByLate) {
                        endSlack = yield* this.calculateProjectedDuration(earlyEndDate, lateEndDate, slackUnit)
                        if (endSlack < result) result = endSlack
                    }
                }
                else if (isByLate) {
                    result = yield* this.calculateProjectedDuration(earlyEndDate, lateEndDate, slackUnit)
                }
            }

            return result
        }


        @calculate('critical')
        * calculateCritical () : ChronoIterator<boolean> {
            const totalSlack = yield this.$.totalSlack
            return totalSlack <= 0
        }


        * isConstrainedLate () : ChronoIterator<boolean> {
            const startDateIntervals : DateInterval[]                   = yield this.$.startDateConstraintIntervals
            const endDateIntervals : DateInterval[]                     = yield this.$.endDateConstraintIntervals
            const lateStartDateConstraintIntervals : DateInterval[]     = yield this.$.lateStartDateConstraintIntervals
            const lateEndDateConstraintIntervals : DateInterval[]       = yield this.$.lateEndDateConstraintIntervals

            return Boolean(startDateIntervals.length || endDateIntervals.length || lateStartDateConstraintIntervals.length || lateEndDateConstraintIntervals.length)
        }


        * calculateStartDatePure () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Backward) {
                // early exit if this mixin is not applicable, but only after(!) the direction check
                // this is because the `isConstrainedLate` yield early constraint intervals, which are generally lazy,
                // depending from the direction
                if (!(yield* this.isConstrainedLate() as any) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateStartDatePure()
                }

                return yield this.$.lateStartDate
            } else {
                return yield* super.calculateStartDatePure()
            }
        }


        * calculateStartDateProposed () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            switch (direction) {
                case Direction.Backward:
                    // early exit if this mixin is not applicable, but only after(!) the direction check
                    // this is because the `isConstrainedLate` yield early constraint intervals, which are generally lazy,
                    // depending from the direction
                    if (!(yield* this.isConstrainedLate() as any) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateStartDateProposed()
                    }

                    return yield* this.calculateStartDatePure()
                default:
                    return yield* super.calculateStartDateProposed()
            }
        }


        * calculateEndDatePure () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Backward) {
                // early exit if this mixin is not applicable, but only after(!) the direction check
                // this is because the `isConstrainedLate` yield early constraint intervals, which are generally lazy,
                // depending from the direction
                if (!(yield* this.isConstrainedLate() as any) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateEndDatePure()
                }

                return yield this.$.lateEndDate
            } else {
                return yield* super.calculateEndDatePure()
            }
        }


        * calculateEndDateProposed () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            switch (direction) {
                case Direction.Backward:
                    // early exit if this mixin is not applicable, but only after(!) the direction check
                    // this is because the `isConstrainedLate` yield early constraint intervals, which are generally lazy,
                    // depending from the direction
                    if (!(yield* this.isConstrainedLate() as any) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateEndDateProposed()
                    }

                    return yield* this.calculateEndDatePure()
                default:
                    return yield* super.calculateEndDateProposed()
            }
        }

    }

    return ConstrainedLateEvent
}

/**
 * This is a "constrained event" mixin.
 *
 * It provides both a generic functionality of constraining the start/end dates of the event using constraint intervals
 * and _critical path method_ related API ([[earlyStartDate]], [[earlyEndDate]], [[lateStartDate]], [[lateEndDate]], [[totalSlack]], [[critical]]).
 *
 * It does not implement any constraining logic itself though, leaving this task to other mixins.
 */
export interface ConstrainedLateEvent extends Mixin<typeof ConstrainedLateEvent> {}
