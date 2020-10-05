import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { CancelPropagationEffect } from "../../../../ChronoGraph/chrono/Effect.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate, field, generic_field } from "../../../../ChronoGraph/replica/Entity.js"
import { ReferenceBucketAtom } from "../../../../ChronoGraph/replica/Reference.js"
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
import { HasChildren } from "./HasChildren.js"


const hasMixin = Symbol('HasAssignments')


export const HasAssignments = <T extends AnyConstructor<HasChildren>>(base : T) => {

    class HasAssignments extends base {
        [hasMixin] () {}

        // @model_field({ 'type' : 'number', allowNull : true })
        // effort          : Duration
        //
        // @model_field({ 'type' : 'string', defaultValue : TimeUnit.Hour }, { converter : DateHelper.normalizeUnit })
        // effortUnit      : TimeUnit

        // @model_field({ 'type' : 'boolean', defaultValue : false })
        // effortDriven    : boolean

        // need to have at least one `model_field()` in the mixin for the "model" fields to work
        // we need this to apply default value for buckets
        @model_field()
        dontRemoveMe    : any

        @generic_field({}, ModelBucketField)
        assigned     : Set<AssignmentMixin>

        @field()
        effectiveCalendarsCombination       : CalendarCacheMultiple

        @field()
        assignmentsByCalendar               : Map<CalendarMixin, AssignmentMixin[]>     = new Map()


        get assignments () {
            return [ ...this.assigned ]
        }


        // * hasFirstAssignment () : ChronoIterator<boolean> {
        //     const assignments : this[ 'assigned' ] = yield this.$.assigned
        //
        //     const hasAssignments    = assignments.size > 0
        //     const hadAssignments    = this.$.assigned.value.size > 0
        //
        //     // console.log("hasFirstAssignment, ", hasAssignments && !hadAssignments)
        //
        //     return hasAssignments && !hadAssignments
        // }
        //
        //
        // @calculate('effortDriven')
        // * calculateEffortDriven (proposedValue : boolean) : ChronoIterator<boolean> {
        //     const schedulingMode = yield this.$.schedulingMode
        //
        //     // Normal scheduling mode doesn't support effort driven flag
        //     if (schedulingMode == SchedulingMode.Normal) return false
        //
        //     return proposedValue !== undefined ? proposedValue : this.$.effortDriven.getConsistentValue()
        // }
        //
        // // pure calculation methods
        // * calculateTotalUnits () : ChronoIterator<number> {
        //     let result          = 0
        //
        //     const assignments : this[ 'assigned' ] = yield this.$.assigned
        //
        //     for (let assignment of assignments) {
        //         result          += yield assignment.$.units
        //     }
        //
        //     return result
        // }
        //
        //
        // * calculateEffortByAssignments (startDate : Date, endDate : Date) : ChronoIterator<Duration | { ignoreResourceCalendars : boolean }> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     const schedulingMode                                            = yield this.$.schedulingMode
        //
        //     if (schedulingMode === SchedulingMode.Normal || assignmentsByCalendar.size === 0) {
        //         return yield* this.calculateProjectedDuration(startDate, endDate)
        //     }
        //
        //     let resultN : number                    = 0
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
        //         yield* this.getBaseOptionsForEffortCalculations(),
        //         { startDate, endDate }
        //     )
        //
        //     yield* this.forEachAvailabilityInterval(
        //         options,
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
        //             resultN                         += intervalUnits * intervalDuration * 0.01
        //         }
        //     )
        //
        //     return yield* this.$convertDuration(resultN, TimeUnit.Millisecond, yield this.$.effortUnit)
        // }
        //
        //
        // * calculateUnitsByDurationAndEffort (_assignment : AssignmentMixin, proposedValue : number)
        //     : ChronoIterator<number | { ignoreResourceCalendars : boolean }>
        // {
        //     const effort : Duration                 = yield this.$.effort,
        //         effortUnit : TimeUnit               = yield this.$.effortUnit,
        //         effortMS                            = yield* this.$convertDuration(effort, effortUnit, TimeUnit.Millisecond)
        //
        //     let collectedEffort                     = 0
        //
        //     const options   = Object.assign(
        //         yield* this.getBaseOptionsForEffortCalculations(),
        //         { startDate : yield this.$.startDate, endDate : yield this.$.endDate}
        //     )
        //
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //
        //     yield* this.forEachAvailabilityInterval(
        //         options,
        //         (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
        //             const workCalendars             = calendarCacheIntervalMultiple.getCalendarsWorking()
        //
        //             const intervalStartN : number   = intervalStart.getTime(),
        //                 intervalEndN : number       = intervalEnd.getTime(),
        //                 intervalDuration : Duration = intervalEndN - intervalStartN
        //
        //             for (const workingCalendar of workCalendars) {
        //                 collectedEffort             +=
        //                     (assignmentsByCalendar.has(workingCalendar) ? assignmentsByCalendar.get(workingCalendar).length : 0) * intervalDuration
        //             }
        //         }
        //     )
        //
        //     return collectedEffort ? 100 * effortMS / collectedEffort : 100
        // }
        // // EOF pure calculation methods
        //
        //
        // getEffort (unit? : TimeUnit) {
        //     const effort        = this.effort
        //
        //     return unit !== undefined ? this.calendar.convertDuration(effort, this.effortUnit, unit) : effort
        // }
        //
        //
        // async setEffort (effort : Duration, unit? : TimeUnit) : Promise<PropagationResult> {
        //     if (unit != null && unit !== this.effortUnit) {
        //         this.$.effortUnit.put(unit)
        //     }
        //
        //     this.$.effort.put(effort)
        //
        //     return this.propagate()
        // }
        //
        //
        // getEffortUnit () : TimeUnit {
        //     return this.effortUnit
        // }
        //
        //
        // setEffortUnit (_value : TimeUnit) {
        //     throw new Error("Use `setEffort` instead")
        // }
        //
        //
        // async setAssignmentUnits (assignment : AssignmentMixin, units : number) : Promise<PropagationResult> {
        //     assignment.$.units.put(units)
        //
        //     return assignment.propagate()
        // }
        //
        //
        // * calculateAssignmentUnits (assignment : AssignmentMixin, proposedValue : number) : ChronoIterator<boolean | number | { ignoreResourceCalendars : boolean }> {
        //     if (proposedValue !== undefined) return proposedValue
        //
        //     // const shouldRecalculateAssignmentUnits  = yield* this.shouldRecalculateAssignmentUnits(assignment)
        //     //
        //     // if (shouldRecalculateAssignmentUnits) {
        //     //     return yield* this.calculateUnitsByDurationAndEffort(assignment, proposedValue)
        //     // } else {
        //     //     // otherwise keep stable value
        //     //     return assignment.$.units.value
        //     // }
        // }
        //
        //
        // // this is just a monkey-patch for #173, ideally need to remove this override completely and fix it properly,
        // // but this engine version is obsolete for such effort
        // * calculateValidInitialIntervals () : ChronoIterator<boolean | Duration | Date | this[ 'validInitialIntervals' ] | ConstraintInterval[]> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     const schedulingMode                                            = yield this.$.schedulingMode
        //
        //     if (schedulingMode !== SchedulingMode.Normal || assignmentsByCalendar.size > 0) {
        //         const startDateIntervals : ConstraintInterval[] = yield this.$.combinedStartDateConstraintIntervals
        //         const endDateIntervals : ConstraintInterval[]   = yield this.$.combinedEndDateConstraintIntervals
        //
        //         // calculate effective start date constraining interval
        //         let startDateInterval : DateInterval = intersectIntervals(startDateIntervals)
        //         // calculate effective end date constraining interval
        //         let endDateInterval : DateInterval   = intersectIntervals(endDateIntervals)
        //
        //         const canCalculateProjectedXDate = yield* this.canCalculateProjectedXDate()
        //
        //         // if we can't use calculateProjectedStartDate/calculateProjectedEndDate methods then we cannot do anything else -> return
        //         if (!canCalculateProjectedXDate && !startDateInterval.isIntervalEmpty() && !endDateInterval.isIntervalEmpty()) {
        //             return {
        //                 startDateInterval,
        //                 endDateInterval
        //             }
        //         }
        //     }
        //
        //     return yield* super.calculateValidInitialIntervals()
        // }
        //
        //
        //
        // @calculate('effort')
        // * calculateEffort (proposedValue : Duration) : ChronoIterator<Date | boolean | Duration | { ignoreResourceCalendars : boolean }> {
        //     const childEvents : Set<HasAssignments> = yield this.$.childEvents
        //
        //     if (childEvents.size) {
        //         return yield* this.calculateTotalEffort()
        //     }
        //     else {
        //         if (proposedValue !== undefined) return proposedValue
        //
        //         const shouldRecalculateEffort       = yield* this.shouldRecalculateEffort()
        //
        //         if (shouldRecalculateEffort) {
        //             // TODO can be smarter here, at least should handle the normalization of effort to duration case
        //             const startDate : Date      = yield this.$.startDate
        //
        //             if (startDate) {
        //                 const endDate : Date        = yield* this.calculateProjectedEndDate(startDate)
        //
        //                 return yield* this.calculateEffortByAssignments(startDate, endDate)
        //             } else {
        //                 return null
        //             }
        //         } else {
        //             // otherwise keep stable value
        //             return this.$.effort.value
        //         }
        //     }
        // }
        //
        //
        // * canRecalculateDuration () : ChronoIterator<boolean> {
        //     const schedulingMode    = yield this.$.schedulingMode
        //
        //     if (schedulingMode === SchedulingMode.Normal) {
        //         return yield* super.canRecalculateDuration()
        //     } else {
        //         return this.$.effort.hasProposedValue() || this.$.effort.hasConsistentValue()
        //     }
        // }
        //
        //
        // * shouldRecalculateEffort () : ChronoIterator<boolean> {
        //     const childEvents = yield this.$.childEvents
        //
        //     // Parent case
        //     if (childEvents.size > 0) {
        //         return true
        //     }
        //     // Child case
        //     else {
        //         return !this.$.effort.hasConsistentValue() && (yield* this.canRecalculateEffort())
        //     }
        // }
        //
        //
        // * canRecalculateEffort () : ChronoIterator<boolean> {
        //     const childEvents = yield this.$.childEvents
        //
        //     let result : boolean = true
        //
        //     if (childEvents.size) {
        //         result = true
        //         // each child should be able to recalculate its effort
        //         // for (const child of childEvents) {
        //         //     result = result && (yield* child.canRecalculateEffort())
        //         // }
        //     } else {
        //         // even if event has no assignments (and thus no assignment units are available)
        //         // we still normalize effort to duration, so thats the only data required for effort calculation
        //         result = this.$.duration.hasValue()
        //     }
        //
        //     return result
        // }
        //
        //
        // * shouldRecalculateAssignmentUnits (_assignment : AssignmentMixin) : ChronoIterator<boolean> {
        //     return false
        // }
        //
        //
        // * calculateTotalEffort () : ChronoIterator<number> {
        //     const childEvents   = yield this.$.childEvents
        //
        //     let result          = 0
        //
        //     for (const child of childEvents) {
        //         result          += yield child.$.effort
        //     }
        //
        //     return result
        // }
        //
        //
        // * forEachAvailabilityInterval (
        //     options     : {
        //         startDate?                          : Date,
        //         endDate?                            : Date,
        //         isForward?                          : boolean,
        //         ignoreResourceCalendars?            : boolean
        //     },
        //     func        : (
        //         startDate                           : Date,
        //         endDate                             : Date,
        //         calendarCacheIntervalMultiple       : CalendarCacheIntervalMultiple
        //     ) => false | void
        // ) : ChronoIterator<CalendarIteratorResult>
        // {
        //     const calendar : CalendarMixin                                  = yield this.$.calendar
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     const effectiveCalendarsCombination                             = yield this.$.effectiveCalendarsCombination
        //
        //     effectiveCalendarsCombination.forEachAvailabilityInterval(
        //         options,
        //         (startDate : Date, endDate : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //             const calendarsStatus   = calendarCacheIntervalMultiple.getCalendarsWorkStatus()
        //             const workCalendars     = calendarCacheIntervalMultiple.getCalendarsWorking()
        //
        //             if (
        //                 calendarsStatus.get(calendar)
        //                 &&
        //                 (options.ignoreResourceCalendars || workCalendars.some((calendar : CalendarMixin) => assignmentsByCalendar.has(calendar)))
        //             ) {
        //                 return func(startDate, endDate, calendarCacheIntervalMultiple)
        //             }
        //         }
        //     )
        // }
        //
        //
        // * getBaseOptionsForEffortCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
        //     return { ignoreResourceCalendars : false }
        // }
        //
        //
        // * getBaseOptionsForDurationCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
        //     return { ignoreResourceCalendars : false }
        // }
        //
        //
        // * skipNonWorkingTime (date : Date, isForward : boolean = true) : ChronoIterator<Date | any> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //
        //     if (assignmentsByCalendar.size > 0) {
        //         const options   = Object.assign(
        //             yield* this.getBaseOptionsForDurationCalculations(),
        //             isForward ? { startDate : date, isForward } : { endDate : date, isForward }
        //         )
        //
        //         let workingDate : Date
        //
        //         yield* this.forEachAvailabilityInterval(
        //             options,
        //             (startDate : Date, endDate : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //                 workingDate         = isForward ? startDate : endDate
        //
        //                 return false
        //             }
        //         )
        //
        //         return new Date(workingDate)
        //     } else {
        //         return yield* super.skipNonWorkingTime(date, isForward)
        //     }
        // }
        //
        //
        // * calculateDurationBetweenDates (startDate : Date, endDate : Date, unit : TimeUnit) : ChronoIterator<Duration | any> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //
        //     if (assignmentsByCalendar.size > 0) {
        //         const options   = Object.assign(
        //             yield* this.getBaseOptionsForDurationCalculations(),
        //             { startDate, endDate, isForward : true }
        //         )
        //
        //         let result : Duration = 0
        //
        //         yield* this.forEachAvailabilityInterval(
        //             options,
        //             (startDate : Date, endDate : Date) => {
        //                 result += endDate.getTime() - startDate.getTime()
        //             }
        //         )
        //
        //         return yield* this.$convertDuration(result, TimeUnit.Millisecond, unit)
        //     } else {
        //         return yield* super.calculateDurationBetweenDates(startDate, endDate, unit)
        //     }
        // }
        //
        //
        // @calculate('effectiveCalendarsCombination')
        // * calculateEffectiveCalendarsCombination () : ChronoIterator<this[ 'effectiveCalendarsCombination' ]> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]       = yield this.$.assignmentsByCalendar
        //
        //     const calendars : CalendarMixin[]    = [ ...assignmentsByCalendar.keys(), yield this.$.calendar ]
        //
        //     return combineCalendars(calendars)
        // }
        //
        //
        // @calculate('assignmentsByCalendar')
        // * calculateAssignmentsByCalendar  () : ChronoIterator<this[ 'assignmentsByCalendar' ]> {
        //     const assignments : this[ 'assigned' ]          = yield this.$.assigned
        //
        //     const result : Map<CalendarMixin, AssignmentMixin[]> = new Map()
        //
        //     for (const assignment of assignments) {
        //         const resource : ResourceMixin                  = yield assignment.$.resource
        //
        //         if (resource) {
        //             const resourceCalendar : CalendarMixin      = yield resource.$.calendar
        //
        //             let assignments                             = result.get(resourceCalendar)
        //
        //             if (!assignments) {
        //                 assignments                             = []
        //
        //                 result.set(resourceCalendar, assignments)
        //             }
        //
        //             assignments.push(assignment)
        //         }
        //     }
        //
        //     return result
        // }
        //
        //
        // // helper method for `Normal` scheduling mode
        // * calculateProjectedXDateByDuration (baseDate : Date, isForward : boolean = true, givenDuration? : Duration) : ChronoIterator<Date | any> {
        //     const duration : Duration               = givenDuration !== undefined ? givenDuration : yield this.$.duration
        //
        //     // temp fix, we might default to 1d duration
        //     if (duration == null || isNaN(duration)) return null
        //
        //     if (duration == 0) return baseDate
        //
        //     const durationUnit : TimeUnit           = yield this.$.durationUnit
        //     const durationMS : number               = yield* this.$convertDuration(duration, durationUnit, TimeUnit.Millisecond)
        //
        //     let resultN : number                    = baseDate.getTime()
        //     let leftDuration : number               = durationMS
        //
        //     const calendar : CalendarMixin          = yield this.$.calendar
        //
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //
        //     if (assignmentsByCalendar.size > 0) {
        //         const options   = Object.assign(
        //             yield* this.getBaseOptionsForDurationCalculations(),
        //             isForward ? { startDate : baseDate, isForward } : { endDate : baseDate, isForward }
        //         )
        //
        //         yield* this.forEachAvailabilityInterval(
        //             options,
        //
        //             (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //                 const intervalStartN : number   = intervalStart.getTime(),
        //                     intervalEndN : number       = intervalEnd.getTime(),
        //                     intervalDuration : Duration = intervalEndN - intervalStartN
        //
        //                 if (intervalDuration >= leftDuration) {
        //                     resultN                     = isForward ? intervalStartN + leftDuration : intervalEndN - leftDuration
        //
        //                     return false
        //                 } else {
        //                     const dstDiff               = intervalStart.getTimezoneOffset() - intervalEnd.getTimezoneOffset()
        //
        //                     leftDuration                -= intervalDuration + dstDiff * 60 * 1000
        //                 }
        //             }
        //         )
        //
        //         return new Date(resultN)
        //     }
        //     else {
        //         return calendar.accumulateWorkingTime(baseDate, durationMS, TimeUnit.Millisecond, isForward).finalDate
        //     }
        // }
        //
        //
        // * calculateProjectedXDateByEffort (baseDate : Date, isForward : boolean = true) : ChronoIterator<Date | any> {
        //     const effort : Duration                 = yield this.$.effort,
        //         effortUnit : TimeUnit               = yield this.$.effortUnit,
        //         effortMS : number                   = yield* this.$convertDuration(effort, effortUnit, TimeUnit.Millisecond)
        //
        //     let resultN : number                    = baseDate.getTime()
        //     let leftEffort : number                 = effortMS
        //
        //     const calendar : CalendarMixin          = yield this.$.calendar
        //
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
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
        //
        //     if (assignmentsByCalendar.size > 0) {
        //         const options   = Object.assign(
        //             yield* this.getBaseOptionsForDurationCalculations(),
        //             isForward ? { startDate : baseDate, isForward } : { endDate : baseDate, isForward }
        //         )
        //
        //         yield* this.forEachAvailabilityInterval(
        //             options,
        //
        //             (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //                 const workCalendars             = calendarCacheIntervalMultiple.getCalendarsWorking()
        //
        //                 const intervalStartN : number   = intervalStart.getTime(),
        //                     intervalEndN : number       = intervalEnd.getTime(),
        //                     intervalDuration : Duration = intervalEndN - intervalStartN
        //
        //                 let intervalUnits               = 0
        //
        //                 for (const workingCalendar of workCalendars) {
        //                     // the calendar of the event itself will be in the `workCalendars`, but it
        //                     // will be missing in the `totalUnitsByCalendar` map, which is fine
        //                     intervalUnits               += totalUnitsByCalendar.get(workingCalendar) || 0
        //                 }
        //
        //                 // Effort = Units * Duration
        //                 const intervalEffort            = intervalUnits * intervalDuration * 0.01
        //
        //                 if (intervalEffort >= leftEffort) {
        //                     // resulting date is interval start plus left duration (Duration = Effort / Units)
        //                     resultN                     =
        //                         isForward
        //                         ?
        //                             intervalStartN + leftEffort / (0.01 * intervalUnits)
        //                         :
        //                             intervalEndN - leftEffort / (0.01 * intervalUnits)
        //
        //                     return false
        //
        //                 } else {
        //                     leftEffort                  -= intervalEffort
        //                 }
        //             }
        //         )
        //
        //         return new Date(resultN)
        //     }
        //     else {
        //         return calendar.accumulateWorkingTime(baseDate, effortMS, TimeUnit.Millisecond, isForward).finalDate
        //     }
        // }
        //
        //
        // * doCalculateDuration () : ChronoIterator<Duration> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     const schedulingMode : SchedulingMode                           = yield this.$.schedulingMode
        //     const childEvents : Set<HasAssignments>                         = yield this.$.childEvents
        //
        //     if (
        //         childEvents.size === 0
        //         && (schedulingMode === SchedulingMode.Normal || (assignmentsByCalendar.size === 0))
        //         && !this.$.duration.hasValue() && this.$.effort.hasValue()
        //         // possibly also: && !this.$.startDate.hasValue() || !this.$.endDate.hasValue()
        //         // meaning - we only normalize duration to effort if there's no start/end date
        //         // otherwise duration should be normalized by start/end date
        //     ) {
        //         return yield* this.$convertDuration(yield this.$.effort, yield this.$.effortUnit, yield this.$.durationUnit)
        //     } else {
        //         return yield* super.doCalculateDuration()
        //     }
        // }
        //
        //
        // * calculateProjectedDuration (startDate : Date, endDate : Date) : ChronoIterator<Duration | any> {
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //     const schedulingMode                                            = yield this.$.schedulingMode
        //
        //     if (schedulingMode === SchedulingMode.Normal || assignmentsByCalendar.size === 0) {
        //         return yield* super.calculateProjectedDuration(startDate, endDate)
        //     }
        //
        //     return yield* this.calculateDurationBetweenDates(startDate, endDate, yield this.$.durationUnit)
        //
        //     // // const effort : Duration                 = yield this.$.effort,
        //     // //     effortUnit : TimeUnit               = yield this.$.effortUnit,
        //     // //     effortMS : number                   = yield* this.$convertDuration(effort, effortUnit, TimeUnit.Millisecond)
        //     //
        //     // let resultN : number                    = 0
        //     // // let leftEffort : number                 = effortMS
        //     //
        //     // // const totalUnitsByCalendar : Map<CalendarMixin, number>         = new Map()
        //     // //
        //     // // for (const [ calendar, assignments ] of assignmentsByCalendar) {
        //     // //     let intervalUnits = 0
        //     // //
        //     // //     for (const assignment of assignments) {
        //     // //         intervalUnits           += (yield assignment.$.units)
        //     // //     }
        //     // //
        //     // //     totalUnitsByCalendar.set(calendar, intervalUnits)
        //     // // }
        //     //
        //     // const options   = Object.assign(
        //     //     yield* this.getBaseOptionsForDurationCalculations(),
        //     //     { startDate, endDate }
        //     // )
        //     //
        //     // yield* this.forEachAvailabilityInterval(
        //     //     { startDate, endDate },
        //     //
        //     //     (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
        //     //         const workCalendars     = calendarCacheIntervalMultiple.getCalendarsWorking()
        //     //
        //     //         const intervalStartN : number   = intervalStart.getTime(),
        //     //             intervalEndN : number       = intervalEnd.getTime(),
        //     //             intervalDuration : Duration = intervalEndN - intervalStartN
        //     //
        //     //         let intervalUnits               = 0
        //     //
        //     //         for (const workingCalendar of workCalendars) {
        //     //             // the calendar of the event itself will be in the `workCalendars`, but it
        //     //             // will be missing in the `totalUnitsByCalendar` map, which is fine
        //     //             intervalUnits               += totalUnitsByCalendar.get(workingCalendar) || 0
        //     //         }
        //     //
        //     //         // Effort = Units * Duration
        //     //         const intervalEffort            = intervalUnits * intervalDuration * 0.01
        //     //
        //     //         if (intervalEffort >= leftEffort) {
        //     //             // increment result by left duration (Duration = Effort / Units)
        //     //             resultN                     += leftEffort / (0.01 * intervalUnits)
        //     //
        //     //             return false
        //     //
        //     //         } else {
        //     //             leftEffort                  -= intervalEffort
        //     //             resultN                     += intervalDuration
        //     //         }
        //     //     }
        //     // )
        //     //
        //     // return yield* this.$convertDuration(resultN, TimeUnit.Millisecond, yield this.$.durationUnit)
        // }
        //
        //
        // * canCalculateProjectedXDate () : ChronoIterator<boolean> {
        //     const useDuration : boolean      = yield* this.useDurationForProjectedXDateCalculation(),
        //         durationIsMutating : boolean = this.$.duration.hasProposedValue()//yield* this.shouldRecalculateDuration()
        //
        //     // TODO: need to add support of cases when we can calculate projected dates using Effort
        //     return useDuration && !durationIsMutating && (this.$.duration.hasProposedValue() || this.$.duration.hasConsistentValue())
        // }
        //
        //
        // * useDurationForProjectedXDateCalculation () : ChronoIterator<boolean> {
        //     const schedulingMode : SchedulingMode                           = yield this.$.schedulingMode
        //     const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
        //
        //     return (schedulingMode === SchedulingMode.Normal || assignmentsByCalendar.size === 0)
        //         // this means:
        //         // 1) this is not a initial data calculation (hasConsistentValue)
        //         // 2) there's a user input for duration (hasProposedValue)
        //         || (this.$.duration.hasProposedValue() && this.$.duration.hasConsistentValue())
        // }
        //
        //
        // * useDurationForProjectedStartDateCalculation () : ChronoIterator<boolean> {
        //     return (yield* this.useDurationForProjectedXDateCalculation())
        // }
        //
        //
        // * useDurationForProjectedEndDateCalculation () : ChronoIterator<boolean> {
        //     return (yield* this.useDurationForProjectedXDateCalculation())
        // }
        //
        //
        // * calculateProjectedStartDate (endDate : Date, givenDuration? : Duration) : ChronoIterator<Date | any> {
        //     if (/*givenDuration !== undefined ||*/ (yield* this.useDurationForProjectedStartDateCalculation())) {
        //         return yield* this.calculateProjectedXDateByDuration(endDate, false, givenDuration)
        //     } else {
        //         return yield* this.calculateProjectedXDateByEffort(endDate, false)
        //     }
        // }
        //
        //
        // * calculateProjectedEndDate (startDate : Date, givenDuration? : Duration) : ChronoIterator<Date | any> {
        //     if (/*givenDuration !== undefined ||*/ (yield* this.useDurationForProjectedEndDateCalculation())) {
        //         return yield* this.calculateProjectedXDateByDuration(startDate, true, givenDuration)
        //     } else {
        //         return yield* this.calculateProjectedXDateByEffort(startDate, true)
        //     }
        // }


        /**
         * If a given resource is assigned to this task, returns a [[AssignmentMixin]] instance for it.
         * Otherwise returns `null`
         */
        getAssignmentFor (resource : ResourceMixin) : AssignmentMixin | null {
            let result      : AssignmentMixin

            this.assigned.forEach(assignment => {
                if (assignment.resource === resource) result = assignment
            })

            return result
        }


        isAssignedTo (resource : ResourceMixin) : boolean {
            return Boolean(this.getAssignmentFor(resource))
        }


        reassign (oldResource : ResourceMixin, newResource : ResourceMixin) : Promise<PropagationResult> {
            const assignment        = this.getAssignmentFor(oldResource)

            //<debug>
            if (!assignment) throw new Error(`Can't unassign resource \`${oldResource}\` from task \`${this}\` - resource is not assigned to the task!`)
            //</debug>

            this.removeAssignment(assignment)

            //<debug>
            // Preconditions:
            if (this.getAssignmentFor(newResource)) throw new Error('Resource can\'t be assigned twice to the same task')
            //</debug>

            const assignmentCls = this.getProject().assignmentStore.modelClass

            this.addAssignment(new assignmentCls({
                event           : this,
                resource        : newResource
            }))

            return this.propagate()
        }


        /**
         * A method which assigns a resource to the current event
         */
        async assign (resource : ResourceMixin, units : number = 100) : Promise<PropagationResult> {
            //<debug>
            // Preconditions:
            if (this.getAssignmentFor(resource)) throw new Error('Resource can\'t be assigned twice to the same task')
            //</debug>

            const assignmentCls = this.getProject().assignmentStore.modelClass

            this.addAssignment(new assignmentCls({
                event           : this,
                resource        : resource,
                units           : units
            }))

            return this.propagate()
        }


        /**
         * A method which unassigns a resource from the current event
         */
        async unassign (resource : ResourceMixin) : Promise<PropagationResult> {
            const assignment        = this.getAssignmentFor(resource)

            //<debug>
            if (!assignment) throw new Error(`Can't unassign resource \`${resource}\` from task \`${this}\` - resource is not assigned to the task!`)
            //</debug>

            this.removeAssignment(assignment)

            return this.propagate()
        }


        // template methods, overridden in scheduling modes mixins
        // should probably be named something like "onEventAssignmentAdded"
        // should be a listener for the `add` event of the assignment store instead
        addAssignment (assignment : AssignmentMixin) : AssignmentMixin {
            this.getProject().assignmentStore.add(assignment)

            return assignment
        }


        // should be a listener for the `remove` event of the assignment store instead
        removeAssignment (assignment : AssignmentMixin) : AssignmentMixin {
            this.getProject().assignmentStore.remove(assignment)

            return assignment
        }


        leaveProject () {
            const assignmentStore = this.getAssignmentStore()

            this.assigned.forEach(assignment => assignmentStore.remove(assignment))

            super.leaveProject()
        }


        setEffortDriven : (value : boolean) => Promise<PropagationResult>


        * forEachAvailabilityInterval (
            options     : {
                startDate?                          : Date,
                endDate?                            : Date,
                isForward?                          : boolean,
                ignoreResourceCalendars?            : boolean
            },
            func        : (
                startDate                           : Date,
                endDate                             : Date,
                calendarCacheIntervalMultiple       : CalendarCacheIntervalMultiple
            ) => false | void
        ) : ChronoIterator<CalendarIteratorResult>
        {
            const calendar : CalendarMixin                              = yield this.$.calendar
            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
            const effectiveCalendarsCombination                             = yield this.$.effectiveCalendarsCombination

            return effectiveCalendarsCombination.forEachAvailabilityInterval(
                options,
                (startDate : Date, endDate : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
                    const calendarsStatus   = calendarCacheIntervalMultiple.getCalendarsWorkStatus()
                    const workCalendars     = calendarCacheIntervalMultiple.getCalendarsWorking()

                    if (
                        calendarsStatus.get(calendar)
                        &&
                        (options.ignoreResourceCalendars || workCalendars.some((calendar : CalendarMixin) => assignmentsByCalendar.has(calendar)))
                    ) {
                        return func(startDate, endDate, calendarCacheIntervalMultiple)
                    }
                }
            )
        }


        // TODO seems this atom is used in single place only - can be merged there
        @calculate('effectiveCalendarsCombination')
        * calculateEffectiveCalendarsCombination () : ChronoIterator<this[ 'effectiveCalendarsCombination' ]> {
            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]       = yield this.$.assignmentsByCalendar

            const calendars : CalendarMixin[]    = [ ...assignmentsByCalendar.keys(), yield this.$.calendar ]

            return combineCalendars(calendars)
        }


        @calculate('assignmentsByCalendar')
        * calculateAssignmentsByCalendar  () : ChronoIterator<this[ 'assignmentsByCalendar' ]> {
            const assignments : Set<AssignmentMixin>              = yield this.$.assigned

            const result : Map<CalendarMixin, AssignmentMixin[]> = new Map()

            for (const assignment of assignments) {
                const resource : ResourceMixin              = yield assignment.$.resource

                if (resource) {
                    const resourceCalendar : CalendarMixin  = yield resource.$.calendar

                    let assignments                             = result.get(resourceCalendar)

                    if (!assignments) {
                        assignments                             = []

                        result.set(resourceCalendar, assignments)
                    }

                    assignments.push(assignment)
                }
            }

            return result
        }


        * getBaseOptionsForDurationCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
            return { ignoreResourceCalendars : false }
        }


        * skipNonWorkingTime (date : Date, isForward : boolean = true) : ChronoIterator<Date> {
            if (!date) return null

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            if (assignmentsByCalendar.size > 0) {
                const options   = Object.assign(
                    yield* this.getBaseOptionsForDurationCalculations() as any,
                    isForward ? { startDate : date, isForward } : { endDate : date, isForward }
                )

                let workingDate : Date

                const skipRes = yield* this.forEachAvailabilityInterval(
                    options,
                    (startDate : Date, endDate : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
                        workingDate         = isForward ? startDate : endDate

                        return false
                    }
                ) as any

                if (/*skipRes === CalendarIteratorResult.MaxRangeReached || */skipRes === CalendarIteratorResult.FullRangeIterated) {
                    // yield Reject("Empty calendar")
                    yield CancelPropagationEffect.new()
                }

                return new Date(workingDate)
            } else {
                return yield* super.skipNonWorkingTime(date, isForward)
            }
        }


        * calculateProjectedDuration (startDate : Date, endDate : Date, durationUnit? : TimeUnit) : ChronoIterator<Duration> {
            if (!startDate || !endDate) {
                return null
            }

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            if (assignmentsByCalendar.size > 0) {
                const options   = Object.assign(
                    yield* this.getBaseOptionsForDurationCalculations() as any,
                    { startDate, endDate, isForward : true }
                )

                let result : Duration = 0

                yield* this.forEachAvailabilityInterval(
                    options,
                    (startDate : Date, endDate : Date) => {
                        result += endDate.getTime() - startDate.getTime()
                    }
                )

                if (!durationUnit) durationUnit = yield this.$.durationUnit

                return yield* this.getProject().$convertDuration(result, TimeUnit.Millisecond, durationUnit)
            } else {
                return yield* super.calculateProjectedDuration(startDate, endDate, durationUnit)
            }
        }


        * calculateProjectedXDateWithDuration (baseDate : Date, isForward : boolean = true, duration : Duration) : ChronoIterator<Date> {
            if (baseDate == null || duration == null || isNaN(duration)) return null

            if (duration == 0) return baseDate

            const durationUnit : TimeUnit           = yield this.$.durationUnit
            const durationMS : number               = yield* this.getProject().$convertDuration(duration, durationUnit, TimeUnit.Millisecond)

            let resultN : number                    = baseDate.getTime()
            let leftDuration : number               = durationMS

            const calendar : CalendarMixin          = yield this.$.calendar

            const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar

            if (assignmentsByCalendar.size > 0) {
                const options   = Object.assign(
                    yield* this.getBaseOptionsForDurationCalculations() as any,
                    isForward ? { startDate : baseDate, isForward } : { endDate : baseDate, isForward }
                )

                yield* this.forEachAvailabilityInterval(
                    options,

                    (intervalStart : Date, intervalEnd : Date, calendarCacheIntervalMultiple : CalendarCacheIntervalMultiple) => {
                        const intervalStartN : number   = intervalStart.getTime(),
                            intervalEndN : number       = intervalEnd.getTime(),
                            intervalDuration : Duration = intervalEndN - intervalStartN

                        if (intervalDuration >= leftDuration) {
                            resultN                     = isForward ? intervalStartN + leftDuration : intervalEndN - leftDuration

                            return false
                        } else {
                            const dstDiff               = intervalStart.getTimezoneOffset() - intervalEnd.getTimezoneOffset()

                            leftDuration                -= intervalDuration + dstDiff * 60 * 1000
                        }
                    }
                ) as any

                return new Date(resultN)
            }
            else {
                return calendar.accumulateWorkingTime(baseDate, durationMS, TimeUnit.Millisecond, isForward).finalDate
            }
        }


        * hasProposedValueForUnits () : ChronoIterator<boolean> {
            const assignments : Set<AssignmentMixin>        = yield this.$.assigned

            for (const assignment of assignments) {
                const resource : ResourceMixin              = yield assignment.$.resource

                if (resource && assignment.$.units.hasProposedValue()) return true
            }

            return false
        }


        hasAssignmentChanges () : boolean {
            return (this.$.assigned as ReferenceBucketAtom).newRefs.size > 0 || (this.$.assigned as ReferenceBucketAtom).oldRefs.size > 0
        }
    }

    return HasAssignments
}

/**
 * This is a mixin, providing the generic assignments handling functionality.
 *
 * It adds methods for assiging/unassigning a resource and makes sure this event's assignments are removed
 * when the event itself is removed.
 *
 * It does implement any other scheduling logic - that is done by the scheduling modes mixins.
 */
export interface HasAssignments extends Mixin<typeof HasAssignments> {}


/**
 * Event mixin type guard
 */
export const hasHasAssignments = (model : any) : model is HasAssignments => Boolean(model && model[hasMixin])
