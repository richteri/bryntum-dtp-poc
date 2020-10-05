import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { CancelPropagationEffect } from "../../../../ChronoGraph/chrono/Effect.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate, field, generic_field } from "../../../../ChronoGraph/replica/Entity.js"
import DateHelper from "../../../../Core/helper/DateHelper.js"
import { CalendarCacheIntervalMultiple } from "../../../calendar/CalendarCacheIntervalMultiple.js"
import { CalendarCacheMultiple, combineCalendars } from "../../../calendar/CalendarCacheMultiple.js"
import { CalendarIteratorResult } from "../../../calendar/CalendarIteratorResult.js"
import { CalendarMixin } from "../../../calendar/CalendarMixin.js"
import { model_field, ModelBucketField } from "../../../chrono/ModelFieldAtom.js"
import { DateInterval, intersectIntervals } from "../../../scheduling/DateInterval.js"
import { Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
import { AssignmentMixin } from "../AssignmentMixin.js"
import { ResourceMixin } from "../ResourceMixin.js"
import { ConstraintInterval } from "./ConstrainedEvent.js"
import { HasAssignments } from "./HasAssignments.js"
import { HasChildren } from "./HasChildren.js"


export const HasEffort = <T extends AnyConstructor<HasAssignments>>(base : T) => {

    class HasEffort extends base {
        // default value breaks normalization of effort to duration, need to decide what we want,
        // current behavior is to normalize effort to duration
        /**
         * The effort of this event. See also [[effortUnit]].
         */
        @model_field({ 'type' : 'number'/*, defaultValue : 0*/ })
        effort          : Duration

        /**
         * The time unit of the [[effort]] field.
         */
        @model_field({ 'type' : 'string', defaultValue : TimeUnit.Hour }, { converter : DateHelper.normalizeUnit })
        effortUnit      : TimeUnit

        /**
         * Generated setter for the effort
         */
        setEffort (effort : Duration, unit? : TimeUnit) : Promise<PropagationResult> {
            this.putEffort(effort, unit)

            return this.propagate()
        }

        /**
         * Getter for the effort. Can return return effort in given unit, or will use [[effortUnit]].
         *
         * @param unit
         */
        getEffort (unit? : TimeUnit) : Duration {
            const effort        = this.effort

            return unit !== undefined ? this.getProject().convertDuration(effort, this.effortUnit, unit) : effort
        }


        putEffort (effort : Duration, unit? : TimeUnit) {
            if (effort < 0) effort = 0

            const isVeryFirstAssignment             = this.$.effort.getProposedOrPreviousValue() === undefined

            // ignore null/undefined for very 1st assignment, to not count it as proposed value
            if (effort == null && isVeryFirstAssignment) return

            if (unit != null && unit !== this.effortUnit) {
                this.effortUnit = unit
            }

            this.$.effort.put(effort)
        }


        /**
         * Generated getter for the [[effortUnit]]
         */
        getEffortUnit : () => TimeUnit

        setEffortUnit (_value : TimeUnit) {
            throw new Error("Use `setEffort` instead")
        }


        /**
         * Helper method to calculate the total effort of all child events.
         */
        * calculateTotalChildrenEffort () : ChronoIterator<Duration> {
            const childEvents : Set<HasEffort> = yield this.$.childEvents

            const project                       = this.getProject()

            let totalEffortMs : Duration        = 0

            for (const childEvent of childEvents) {
                const childEventEffortUnit : TimeUnit     = yield childEvent.$.effortUnit

                totalEffortMs += yield* project.$convertDuration(yield childEvent.$.effort, childEventEffortUnit, TimeUnit.Millisecond)
            }

            return yield* project.$convertDuration(totalEffortMs, TimeUnit.Millisecond, yield this.$.effortUnit)
        }


        @calculate('effort')
        * calculateEffort () : ChronoIterator<Duration> {
            const childEvents : Set<HasEffort> = yield this.$.childEvents

            if (childEvents.size > 0)
                return yield* this.calculateTotalChildrenEffort()
            else {
                const proposed      = this.$.effort.getProposedOrPreviousValue()

                return proposed !== undefined ? proposed : yield* this.calculateEffortPure()
            }
        }


        * calculateEffortPure () : ChronoIterator<Duration> {
            const childEvents : Set<HasEffort> = yield this.$.childEvents

            if (childEvents.size > 0)
                return yield* this.calculateTotalChildrenEffort()
            else {
                return yield* this.calculateProjectedEffort(yield this.$.startDate, yield this.$.endDate)
            }
        }


        * calculateEffortProposed () : ChronoIterator<Duration> {
            return this.$.effort.getProposedOrPreviousValue()
        }


        * calculateAssignmentUnits (assignment : AssignmentMixin) : ChronoIterator<number> {
            return yield* this.calculateAssignmentUnitsProposed(assignment)
        }


        * calculateAssignmentUnitsPure (assignment : AssignmentMixin) : ChronoIterator<number> {
            return yield* this.calculateUnitsByStartEndAndEffort(assignment)
        }


        * calculateAssignmentUnitsProposed (assignment : AssignmentMixin) : ChronoIterator<number> {
            return assignment.$.units.getProposedOrPreviousValue()
        }


        * getBaseOptionsForEffortCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
            return { ignoreResourceCalendars : false }
        }


        * calculateProjectedEffort (startDate : Date, endDate : Date) : ChronoIterator<Duration> {
            if (startDate == null || endDate == null || startDate > endDate) return null

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            const totalUnitsByCalendar : Map<CalendarMixin, number>         = new Map()

            for (const [ calendar, assignments ] of assignmentsByCalendar) {
                let intervalUnits = 0

                for (const assignment of assignments) {
                    intervalUnits           += (yield assignment.$.units)
                }

                totalUnitsByCalendar.set(calendar, intervalUnits)
            }

            //----------------------
            let resultN : number                    = 0

            const options   = Object.assign(
                yield* this.getBaseOptionsForEffortCalculations() as any,
                { startDate, endDate }
            )

            // if event has no assignments we treat that as it has a special, "virtual" assignment with 100 units and
            // the calendar matching the calendar of the task
            // we need to ignore resource calendars in this case, since there's no assigned resources
            if (totalUnitsByCalendar.size === 0) {
                totalUnitsByCalendar.set(yield this.$.calendar, 100)
                options.ignoreResourceCalendars = true
            }

            yield* this.forEachAvailabilityInterval(
                options,

                (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
                    const workCalendars     = calendarCacheIntervalMultiple.getCalendarsWorking()

                    const intervalStartN : number   = intervalStart.getTime(),
                        intervalEndN : number       = intervalEnd.getTime(),
                        intervalDuration : Duration = intervalEndN - intervalStartN

                    let intervalUnits               = 0

                    for (const workingCalendar of workCalendars) {
                        // the calendar of the event itself will be in the `workCalendars`, but it
                        // will be missing in the `totalUnitsByCalendar` map, which is fine
                        intervalUnits               += totalUnitsByCalendar.get(workingCalendar) || 0
                    }

                    // Effort = Units * Duration
                    resultN                         += intervalUnits * intervalDuration * 0.01
                }
            )

            return yield* this.getProject().$convertDuration(resultN, TimeUnit.Millisecond, yield this.$.effortUnit)
        }


        * calculateUnitsByStartEndAndEffort (_assignment : AssignmentMixin) : ChronoIterator<number> {
            const effort : Duration                 = yield this.$.effort,
                effortUnit : TimeUnit               = yield this.$.effortUnit,
                effortMS                            = yield* this.getProject().$convertDuration(effort, effortUnit, TimeUnit.Millisecond)

            let collectedEffort : number            = 0

            const options   = Object.assign(
                yield* this.getBaseOptionsForEffortCalculations() as any,
                { startDate : yield this.$.startDate, endDate : yield this.$.endDate}
            )

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            yield* this.forEachAvailabilityInterval(
                options,
                (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
                    const workCalendars             = calendarCacheIntervalMultiple.getCalendarsWorking()

                    const intervalStartN : number   = intervalStart.getTime(),
                        intervalEndN : number       = intervalEnd.getTime(),
                        intervalDuration : Duration = intervalEndN - intervalStartN

                    for (const workingCalendar of workCalendars) {
                        collectedEffort             +=
                            (assignmentsByCalendar.has(workingCalendar) ? assignmentsByCalendar.get(workingCalendar).length : 0) * intervalDuration
                    }
                }
            )

            return collectedEffort ? 100 * effortMS / collectedEffort : 100
        }


        // * calculateProjectedEffortDuration (startDate : Date, endDate : Date) : ChronoIterator<Duration> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     // const schedulingMode                                            = yield this.$.schedulingMode
        //
        //     if (/*schedulingMode === SchedulingMode.Normal || */assignmentsByCalendar.size === 0) {
        //         return yield* super.calculateProjectedDuration(startDate, endDate)
        //     }
        //
        //     const effort : Duration                 = yield this.$.effort,
        //         effortUnit : TimeUnit               = yield this.$.effortUnit,
        //         effortMS : number                   = yield* this.$convertDuration(effort, effortUnit, TimeUnit.Millisecond)
        //
        //     let resultN : number                    = 0
        //     let leftEffort : number                 = effortMS
        //
        //     const totalUnitsByCalendar : Map<CalendarMixin, number>         = new Map()
        //
        //     for (const [ calendar, assignments ] of assignmentsByCalendar) {
        //         let intervalUnits = 0
        //
        //         for (const assignment of assignments) {
        //             intervalUnits           += (yield assignment.$.units)
        //         }
        //
        //         totalUnitsByCalendar.set(calendar, intervalUnits)
        //     }
        //
        //     const options   = Object.assign(
        //         yield* this.getBaseOptionsForDurationCalculations(),
        //         { startDate, endDate }
        //     )
        //
        //     yield* this.forEachAvailabilityInterval(
        //         { startDate, endDate },
        //
        //         (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //             const workCalendars     = calendarCacheIntervalMultiple.getCalendarsWorking()
        //
        //             const intervalStartN : number   = intervalStart.getTime(),
        //                 intervalEndN : number       = intervalEnd.getTime(),
        //                 intervalDuration : Duration = intervalEndN - intervalStartN
        //
        //             let intervalUnits               = 0
        //
        //             for (const workingCalendar of workCalendars) {
        //                 // the calendar of the event itself will be in the `workCalendars`, but it
        //                 // will be missing in the `totalUnitsByCalendar` map, which is fine
        //                 intervalUnits               += totalUnitsByCalendar.get(workingCalendar) || 0
        //             }
        //
        //             // Effort = Units * Duration
        //             const intervalEffort            = intervalUnits * intervalDuration * 0.01
        //
        //             if (intervalEffort >= leftEffort) {
        //                 // increment result by left duration (Duration = Effort / Units)
        //                 resultN                     += leftEffort / (0.01 * intervalUnits)
        //
        //                 return false
        //
        //             } else {
        //                 leftEffort                  -= intervalEffort
        //                 resultN                     += intervalDuration
        //             }
        //         }
        //     )
        //
        //     return yield* this.$convertDuration(resultN, TimeUnit.Millisecond, yield this.$.durationUnit)
        // }


        * calculateProjectedXDateByEffort (baseDate : Date, isForward : boolean = true) : ChronoIterator<Date> {
            const effort : Duration                 = yield this.$.effort,
                effortUnit : TimeUnit               = yield this.$.effortUnit,
                effortMS : number                   = yield* this.getProject().$convertDuration(effort, effortUnit, TimeUnit.Millisecond)

            if (baseDate == null || effort == null) return null

            let resultN : number                    = baseDate.getTime()
            let leftEffort : number                 = effortMS

            const calendar : CalendarMixin          = yield this.$.calendar

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            const totalUnitsByCalendar : Map<CalendarMixin, number>         = new Map()

            for (const [ calendar, assignments ] of assignmentsByCalendar) {
                let intervalUnits = 0

                for (const assignment of assignments) {
                    intervalUnits           += (yield assignment.$.units)
                }

                totalUnitsByCalendar.set(calendar, intervalUnits)
            }


            if (assignmentsByCalendar.size > 0) {
                const options   = Object.assign(
                    yield* this.getBaseOptionsForDurationCalculations() as any,
                    isForward ? { startDate : baseDate, isForward } : { endDate : baseDate, isForward }
                )

                yield* this.forEachAvailabilityInterval(
                    options,

                    (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
                        const workCalendars             = calendarCacheIntervalMultiple.getCalendarsWorking()

                        const intervalStartN : number   = intervalStart.getTime(),
                            intervalEndN : number       = intervalEnd.getTime(),
                            intervalDuration : Duration = intervalEndN - intervalStartN

                        let intervalUnits               = 0

                        for (const workingCalendar of workCalendars) {
                            // the calendar of the event itself will be in the `workCalendars`, but it
                            // will be missing in the `totalUnitsByCalendar` map, which is fine
                            intervalUnits               += totalUnitsByCalendar.get(workingCalendar) || 0
                        }

                        // Effort = Units * Duration
                        const intervalEffort            = intervalUnits * intervalDuration * 0.01

                        if (intervalEffort >= leftEffort) {
                            // resulting date is interval start plus left duration (Duration = Effort / Units)
                            resultN                     =
                                isForward
                                ?
                                    intervalStartN + leftEffort / (0.01 * intervalUnits)
                                :
                                    intervalEndN - leftEffort / (0.01 * intervalUnits)

                            return false

                        } else {
                            leftEffort                  -= intervalEffort
                        }
                    }
                ) as any

                return new Date(resultN)
            }
            else {
                return calendar.accumulateWorkingTime(baseDate, effortMS, TimeUnit.Millisecond, isForward).finalDate
            }
        }
    }

    return HasEffort
}

/**
 * This is a mixin, providing the generic assignments handling functionality.
 *
 * It adds methods for assiging/unassigning a resource and makes sure this event's assignments are removed
 * when the event itself is removed.
 *
 * It does implement any other scheduling logic - that is done by the scheduling modes mixins.
 */
export interface HasEffort extends Mixin<typeof HasEffort> {}

