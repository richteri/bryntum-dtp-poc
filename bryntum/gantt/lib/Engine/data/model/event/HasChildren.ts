import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate } from "../../../../ChronoGraph/replica/Entity.js"
import { bucket, reference } from "../../../../ChronoGraph/replica/Reference.js"
import { DateInterval } from "../../../scheduling/DateInterval.js"
import { Duration } from "../../../scheduling/Types.js"
import { MAX_DATE, MIN_DATE } from "../../../util/Constants.js"
import { ConstrainedEvent, ConstraintInterval } from "./ConstrainedEvent.js"
import { EventMixin } from "./EventMixin.js"


export const HasChildren = <T extends AnyConstructor<ConstrainedEvent>>(base : T) => {

    class HasChildren extends base {

        /**
         * A reference to the parent event
         */
        @reference({ bucket : 'childEvents' })
        parentEvent     : HasChildren

        /**
         * A set of references to child events
         */
        @bucket()
        childEvents     : Set<HasChildren>

        // our override for the `parent` property, which is needed to update the `parentEvent` property
        private _parent : this


        /**
         * The abstract method which should indicate whether this event has sub events
         */
        * hasSubEvents () : ChronoIterator<boolean> {
            const childEvents   = yield this.$.childEvents

            return childEvents.size > 0
        }


        /**
         * The abstract method which should return an Iterable of [[EventMixin]]
         */
        * subEventsIterable () : ChronoIterator<Iterable<EventMixin>> {
            return yield this.$.childEvents
        }


        * calculateStartDatePure () : ChronoIterator<Date> {
            const hasSubEvents : boolean   = yield* this.hasSubEvents() as any

            if (hasSubEvents) {
                return yield* this.calculateMinChildrenStartDate()
            } else {
                return yield* super.calculateStartDatePure()
            }
        }


        * calculateEndDatePure () : ChronoIterator<Date> {
            const hasSubEvents : boolean   = yield* this.hasSubEvents() as any

            if (hasSubEvents) {
                return yield* this.calculateMaxChildrenEndDate()
            } else {
                return yield* super.calculateEndDatePure()
            }
        }


        * calculateStartDateProposed () : ChronoIterator<Date> {
            const hasSubEvents : boolean   = yield* this.hasSubEvents() as any

            if (hasSubEvents) {
                return yield* this.calculateStartDatePure()
            } else {
                return yield* super.calculateStartDateProposed()
            }
        }


        * calculateEndDateProposed () : ChronoIterator<Date> {
            const hasSubEvents : boolean   = yield* this.hasSubEvents() as any

            if (hasSubEvents) {
                return yield* this.calculateEndDatePure()
            } else {
                return yield* super.calculateEndDateProposed()
            }
        }


        * calculateDurationProposed () : ChronoIterator<Duration> {
            const hasSubEvents : boolean   = yield* this.hasSubEvents() as any

            if (hasSubEvents) {
                return yield* this.calculateDurationPure()
            } else {
                return yield* super.calculateDurationProposed()
            }
        }


        * calculateMinChildrenStartDate () : ChronoIterator<Date> {
            const subEvents : Iterable<EventMixin>      = yield* this.subEventsIterable() as any

            const subStartDates : Date[]          = []

            for (const subEvent of subEvents) {
                subStartDates.push(yield subEvent.$.startDate)
            }

            let timestamp = subStartDates.reduce(
                (acc, subStartDate) => subStartDate ? Math.min(acc, subStartDate.getTime()) : acc,
                MAX_DATE.getTime()
            )

            if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime()) return null

            return new Date(timestamp)
        }


        * calculateMaxChildrenEndDate () : ChronoIterator<Date> {
            const subEvents : Iterable<EventMixin>      = yield* this.subEventsIterable() as any

            const subEndDates : Date[]            = []

            for (const subEvent of subEvents) {
                subEndDates.push(yield subEvent.$.endDate)
            }

            let timestamp = subEndDates.reduce(
                (acc, subEndDate) => subEndDate ? Math.max(acc, subEndDate.getTime()) : acc,
                MIN_DATE.getTime()
            )

            if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime()) return null

            return new Date(timestamp)
        }


        // * shouldRecalculateStartDate () : ChronoIterator<boolean> {
        //     const childEvents : Set<HasChildren>   = yield this.$.childEvents
        //
        //     if (childEvents.size === 0) {
        //         return yield* super.shouldRecalculateStartDate()
        //     } else {
        //         return false
        //     }
        // }
        //
        //
        // * shouldRecalculateEndDate () : ChronoIterator<boolean> {
        //     const childEvents : Set<HasChildren>   = yield this.$.childEvents
        //
        //     if (childEvents.size === 0) {
        //         return yield* super.shouldRecalculateEndDate()
        //     } else {
        //         return false
        //     }
        // }
        //
        //
        // * shouldRecalculateDuration () : ChronoIterator<boolean> {
        //     const childEvents : Set<HasChildren>        = yield this.$.childEvents
        //
        //     if (childEvents.size === 0) {
        //         return yield* super.shouldRecalculateDuration()
        //     } else {
        //         return true
        //     }
        // }
        //
        //
        // * calculateEarlyStartDateRaw () : ChronoIterator<Date | any> {
        //     const childEvents : Set<HasChildren> = yield this.$.childEvents
        //
        //     let result : Date
        //
        //     if (childEvents.size) {
        //         result = MAX_DATE
        //
        //         for (let childEvent of childEvents) {
        //             const childDate = yield childEvent.$.earlyStartDateRaw
        //             if (childDate && childDate < result) result = childDate
        //         }
        //
        //         result = result.getTime() - MAX_DATE.getTime() ? result : null
        //
        //     } else {
        //         result = yield* super.calculateEarlyStartDateRaw()
        //     }
        //
        //     return result
        // }
        //
        //
        // * calculateEarlyEndDateRaw () : ChronoIterator<Date | any> {
        //     const childEvents : Set<HasChildren> = yield this.$.childEvents
        //
        //     let result : Date
        //
        //     if (childEvents.size) {
        //         result = MIN_DATE
        //
        //         for (let childEvent of childEvents) {
        //             const childDate = yield childEvent.$.earlyEndDateRaw
        //             if (childDate && childDate > result) result = childDate
        //         }
        //
        //         result = result.getTime() - MIN_DATE.getTime() ? result : null
        //
        //     } else {
        //         result = yield* super.calculateEarlyEndDateRaw()
        //     }
        //
        //     return result
        // }
        //
        //
        // * calculateLateStartDateRaw () : ChronoIterator<Date | any> {
        //     const childEvents : Set<HasChildren> = yield this.$.childEvents
        //
        //     let result : Date
        //
        //     if (childEvents.size) {
        //         result = MAX_DATE
        //
        //         for (let childEvent of childEvents) {
        //             const childDate = yield childEvent.$.lateStartDateRaw
        //             if (childDate && childDate < result) result = childDate
        //         }
        //
        //         result = result.getTime() - MAX_DATE.getTime() ? result : null
        //
        //     } else {
        //         result = yield* super.calculateLateStartDateRaw()
        //     }
        //
        //     return result
        // }
        //
        //
        // * calculateLateEndDateRaw () : ChronoIterator<Date | any> {
        //     const childEvents : Set<HasChildren> = yield this.$.childEvents
        //
        //     let result : Date
        //
        //     if (childEvents.size) {
        //         result = MIN_DATE
        //
        //         for (let childEvent of childEvents) {
        //             const childDate = yield childEvent.$.lateEndDateRaw
        //             if (childDate && childDate > result) result = childDate
        //         }
        //
        //         result = result.getTime() - MIN_DATE.getTime() ? result : null
        //
        //     } else {
        //         result = yield* super.calculateLateEndDateRaw()
        //     }
        //
        //     return result
        // }
        //
        //
        // protected * calculateStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {
        //     // if (window.DEBUG) debugger
        //
        //     const intervals : ConstraintInterval[] = yield* super.calculateStartDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.startDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     // if (window.DEBUG) debugger
        //
        //     const intervals : ConstraintInterval[] = yield* super.calculateEndDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.endDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<this[ 'earlyStartDateConstraintIntervals' ]> {
        //     // if (window.DEBUG) debugger
        //
        //     const intervals : ConstraintInterval[] = yield* super.calculateEarlyStartDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.earlyStartDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateEarlyEndDateConstraintIntervals () : ChronoIterator<this[ 'earlyEndDateConstraintIntervals' ]> {
        //     // if (window.DEBUG) debugger
        //
        //     const intervals : ConstraintInterval[] = yield* super.calculateEarlyEndDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.earlyEndDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateLateStartDateConstraintIntervals () : ChronoIterator<this[ 'lateStartDateConstraintIntervals' ]> {
        //     // if (window.DEBUG) debugger
        //
        //     const intervals : ConstraintInterval[] = yield* super.calculateLateStartDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.lateStartDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateLateEndDateConstraintIntervals () : ChronoIterator<this[ 'lateEndDateConstraintIntervals' ]> {
        //     const intervals : ConstraintInterval[] = yield* super.calculateLateEndDateConstraintIntervals()
        //
        //     const parentEvent : HasChildren = yield this.$.parentEvent
        //
        //     if (parentEvent) {
        //         // Child inherits its parent task constraints
        //         const parentIntervals = yield parentEvent.$.lateEndDateConstraintIntervals
        //
        //         intervals.push.apply(intervals, parentIntervals)
        //     }
        //
        //     return intervals
        // }
        //
        //
        // * calculateStartDate (proposedValue : Date) : ChronoIterator<Date | boolean> {
        //     const childEvents : Set<HasChildren>   = yield this.$.childEvents
        //
        //     if (childEvents.size === 0) {
        //         return yield* super.calculateStartDate(proposedValue)
        //     } else {
        //         return yield* this.calculateMinChildrenStartDate()
        //     }
        // }
        //
        //
        // * calculateEndDate (proposedValue : Date) : ChronoIterator<Date | boolean> {
        //     const childEvents : Set<HasChildren>   = yield this.$.childEvents
        //
        //     if (childEvents.size === 0) {
        //         return yield* super.calculateEndDate(proposedValue)
        //     } else {
        //         return yield* this.calculateMaxChildrenEndDate()
        //     }
        // }
        //
        //
        // * calculateDuration (proposedValue : Duration) : ChronoIterator<Duration> {
        //     const childEvents : Set<HasChildren>   = yield this.$.childEvents
        //
        //     // for the "parent" case, ignore the proposed value
        //     return yield* super.calculateDuration(childEvents.size === 0 ? proposedValue : undefined)
        // }
        //
        //
        // * calculateMinChildrenStartDate () : ChronoIterator<Date> {
        //     const childEvents : Set<HasChildren>    = yield this.$.childEvents
        //
        //     const childStartDates : Date[]          = []
        //
        //     for (let childEvent of childEvents) {
        //         childStartDates.push(yield childEvent.$.startDate)
        //     }
        //
        //     let timestamp = childStartDates.reduce(
        //         (acc, childStartDate) => childStartDate ? Math.min(acc, childStartDate.getTime()) : acc,
        //         MAX_DATE.getTime()
        //     )
        //
        //     if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime()) return null
        //
        //     return new Date(timestamp)
        // }
        //
        //
        // * calculateMaxChildrenEndDate () : ChronoIterator<Date> {
        //     const childEvents : Set<HasChildren>    = yield this.$.childEvents
        //
        //     const childEndDates : Date[]            = []
        //
        //     for (let childEvent of childEvents) {
        //         childEndDates.push(yield childEvent.$.endDate)
        //     }
        //
        //     let timestamp = childEndDates.reduce(
        //         (acc, childEndDate) => childEndDate ? Math.max(acc, childEndDate.getTime()) : acc,
        //         MIN_DATE.getTime()
        //     )
        //
        //     if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime()) return null
        //
        //     return new Date(timestamp)
        // }
        //
        //
        // // this method is only used to calculated "initial" project start date only
        // * calculateInitialMinChildrenStartDateDeep () : ChronoIterator<Date> {
        //     const childEvents : Set<HasChildren>    = yield this.$.childEvents
        //
        //     // note, that we does not yield here, as we want to calculate "initial" project start date
        //     // which will be used only if there's no user input or explicit setting for it
        //     // such project date should be calculated as earliest date of all tasks, based on the
        //     // "initial" data (which includes proposed)
        //     if (!childEvents.size) return this.startDate
        //
        //     const childStartDates : Date[]          = []
        //
        //     for (let childEvent of childEvents) {
        //         const childInitialDate              = yield* childEvent.calculateInitialMinChildrenStartDateDeep()
        //
        //         childInitialDate && childStartDates.push(childInitialDate)
        //     }
        //
        //     let timestamp = childStartDates.reduce(
        //         (acc, childStartDate) => Math.min(acc, childStartDate.getTime()),
        //         MAX_DATE.getTime()
        //     )
        //
        //     if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime()) return null
        //
        //     return new Date(timestamp)
        // }


        get parent () : this {
            return this._parent
        }


        set parent (value : this) {
            this._parent = value

            this.$.parentEvent.put(value)
        }

        * maybeSkipNonWorkingTime (date : Date, isForward : boolean = true) : ChronoIterator<Date> {
            const childEvents : Set<HasChildren>   = yield this.$.childEvents

            // summary tasks are simply aligned by their children so they should not skip non-working time at all
            if (childEvents.size > 0) return date

            return yield* super.maybeSkipNonWorkingTime(date, isForward)
        }


        @calculate('startDateConstraintIntervals')
        * calculateStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = yield* super.calculateStartDateConstraintIntervals()

            const parentEvent : HasChildren = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.startDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        @calculate('endDateConstraintIntervals')
        * calculateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = yield* super.calculateEndDateConstraintIntervals()

            const parentEvent : HasChildren = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.endDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        @calculate('earlyStartDateConstraintIntervals')
        * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<this[ 'earlyStartDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = yield* super.calculateEarlyStartDateConstraintIntervals()

            const parentEvent : HasChildren = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.earlyStartDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        @calculate('earlyEndDateConstraintIntervals')
        * calculateEarlyEndDateConstraintIntervals () : ChronoIterator<this[ 'earlyEndDateConstraintIntervals' ]> {
            const intervals : DateInterval[] = yield* super.calculateEarlyEndDateConstraintIntervals()

            const parentEvent : HasChildren = yield this.$.parentEvent

            if (parentEvent) {
                // Child inherits its parent task constraints
                const parentIntervals = yield parentEvent.$.earlyEndDateConstraintIntervals

                intervals.push.apply(intervals, parentIntervals)
            }

            return intervals
        }


        @calculate('earlyStartDateRaw')
        * calculateEarlyStartDateRaw () : ChronoIterator<Date> {
            const childEvents : Set<HasChildren> = yield this.$.childEvents

            let result : Date

            if (childEvents.size) {
                result = MAX_DATE

                for (let childEvent of childEvents) {
                    const childDate : Date = yield childEvent.$.earlyStartDateRaw

                    if (childDate && childDate < result) result = childDate
                }

                result = result.getTime() !== MAX_DATE.getTime() ? result : null

            } else {
                result = yield* super.calculateEarlyStartDateRaw()
            }

            return result
        }


        @calculate('earlyEndDateRaw')
        * calculateEarlyEndDateRaw () : ChronoIterator<Date> {
            const childEvents : Set<HasChildren> = yield this.$.childEvents

            let result : Date

            if (childEvents.size) {
                result = MIN_DATE

                for (let childEvent of childEvents) {
                    const childDate : Date = yield childEvent.$.earlyEndDateRaw

                    if (childDate && childDate > result) result = childDate
                }

                result = result.getTime() !== MIN_DATE.getTime() ? result : null

            } else {
                result = yield* super.calculateEarlyEndDateRaw()
            }

            return result
        }

    }

    return HasChildren
}

/**
 * This is a mixin, providing parent/child "awareness" for the event.
 *
 * Scheduling-wise it implements "aligning" parent events by their child events.
 */
export interface HasChildren extends Mixin<typeof HasChildren> {}
