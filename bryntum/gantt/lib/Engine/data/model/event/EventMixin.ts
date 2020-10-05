import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { CalculateProposed, CycleResolution, FormulaId } from "../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js"
import DateHelper from "../../../../Core/helper/DateHelper.js"
import { CalendarMixin } from "../../../calendar/CalendarMixin.js"
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js"
import { Direction, Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
import { isNotNumber } from "../../../util/Functions.js"
import { HasCalendarMixin } from "../HasCalendarMixin.js"
import {
    durationFormula,
    DurationVar, endDateFormula,
    EndDateVar,
    Instruction,
    SEDBackwardCycleResolutionContext,
    SEDDispatcher,
    SEDDispatcherIdentifier, SEDForwardCycleResolutionContext, startDateFormula, StartDateVar
} from "./BaseEventDispatcher.js"

const hasMixin = Symbol('EventMixin')

//---------------------------------------------------------------------------------------------------------------------
export const EventMixin = <T extends AnyConstructor<HasCalendarMixin>>(base : T) => {

    class EventMixin extends base {

        [hasMixin] () {}

        // @model_field(
        //     { type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ', persist : false },
        //     { converter : dateConverter, persistent : false }
        // )
        // startDateInitial : Date

        @model_field({ type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ' }, { converter : dateConverter })
        startDate       : Date

        // @model_field(
        //     { type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ', persist : false },
        //     { converter : dateConverter, persistent : false }
        // )
        // endDateInitial  : Date

        @model_field({ type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ' }, { converter : dateConverter })
        endDate         : Date

        @model_field({ type : 'number', allowNull : true })
        duration        : Duration

        @model_field({ type : 'string', defaultValue : TimeUnit.Day }, { converter : DateHelper.normalizeUnit })
        durationUnit    : TimeUnit

        // // TODO: do we really need "Normal" scheduling mode?
        // @model_field({ type : 'string', defaultValue : SchedulingMode.Normal })
        // schedulingMode  : SchedulingMode

        @field({ atomCls : SEDDispatcherIdentifier })
        dispatcher      : SEDDispatcher

        @model_field({ type : 'string', defaultValue : Direction.Forward })
        direction       : Direction

        //region dispatcher
        @calculate('dispatcher')
        * calculateDispatcher () : ChronoIterator<SEDDispatcher> {
            // this value is not used directly, but it contains a default cycle resolution
            // if we calculate different resolution, dispatcher will be marked dirty
            // on next revision
            // const proposed                      = yield ProposedOrPrevious

            const cycleDispatcher               = yield* this.prepareDispatcher()

            //--------------
            const startDateProposedArgs         = this.$.startDate.proposedArgs

            const startInstruction : Instruction = startDateProposedArgs ? (startDateProposedArgs[ 1 ] ? Instruction.KeepDuration : Instruction.KeepEndDate) : undefined

            if (startInstruction) cycleDispatcher.addInstruction(startInstruction)

            //--------------
            const endDateProposedArgs           = this.$.endDate.proposedArgs

            const endInstruction : Instruction    = endDateProposedArgs ? (endDateProposedArgs[ 1 ] ? Instruction.KeepDuration : Instruction.KeepStartDate) : undefined

            if (endInstruction) cycleDispatcher.addInstruction(endInstruction)

            //--------------
            const durationProposedArgs          = this.$.duration.proposedArgs

            let durationInstruction : Instruction

            if (durationProposedArgs) {
                switch (durationProposedArgs[ 1 ]) {
                    case true:
                        durationInstruction     = Instruction.KeepStartDate
                        break

                    case false:
                        durationInstruction     = Instruction.KeepEndDate
                        break
                }
            }

            if (!durationInstruction && cycleDispatcher.hasProposedValue(DurationVar)) {
                durationInstruction = Instruction.KeepStartDate
            }

            if (durationInstruction) cycleDispatcher.addInstruction(durationInstruction)

            return cycleDispatcher
        }


        * prepareDispatcher () : ChronoIterator<SEDDispatcher> {
            const dispatcherClass               = yield* this.dispatcherClass() as any

            const cycleDispatcher               = dispatcherClass.new({
                context                     : yield* this.cycleResolutionContext()
            })

            cycleDispatcher.collectInfo(this.$.startDate, StartDateVar)
            cycleDispatcher.collectInfo(this.$.endDate, EndDateVar)
            cycleDispatcher.collectInfo(this.$.duration, DurationVar)

            return cycleDispatcher
        }


        * cycleResolutionContext () : ChronoIterator<CycleResolution> {
            return SEDForwardCycleResolutionContext
        }


        * dispatcherClass () : ChronoIterator<typeof SEDDispatcher> {
            return SEDDispatcher
        }


        buildProposedDispatcher () : SEDDispatcher {
            return
            // const dispatcher = (yield* this.dispatcherClass()).new({
            //     context                     : yield* this.cycleResolutionContext()
            // })
            //
            // dispatcher.addPreviousValueFlag(StartDateVar)
            // dispatcher.addPreviousValueFlag(EndDateVar)
            // dispatcher.addPreviousValueFlag(DurationVar)
            //
            // return dispatcher
        }
        //endregion




        // @calculate('schedulingMode')
        // * calculateSchedulingMode (proposedValue : SchedulingMode) : ChronoIterator<SchedulingMode> {
        //     return (proposedValue !== undefined ? proposedValue : this.$.schedulingMode.getConsistentValue())
        //         // empty scheduling mode always falls back to 'Normal'
        //         || SchedulingMode.Normal
        // }


        // // Skips non-working time if it's needed to the event
        // * maybeSkipNonWorkingTime (date : Date, isForward : boolean = true) : ChronoIterator<Date | boolean> {
        //     let skipNonWorkingTime = true
        //
        //     if (!(yield* this.shouldRecalculateDuration())) {
        //         const duration : Duration   = yield this.$.duration
        //
        //         skipNonWorkingTime          = duration > 0
        //     }
        //
        //     return date && skipNonWorkingTime ? yield* this.skipNonWorkingTime(date, isForward) : date
        // }


        * skipNonWorkingTime (date : Date, isForward : boolean = true) : ChronoIterator<Date> {
            if (!date) return null

            const calendar : CalendarMixin = yield this.$.calendar

            return calendar.skipNonWorkingTime(date, isForward)
        }


        // * calculateDurationBetweenDates (startDate : Date, endDate : Date, unit : TimeUnit) : ChronoIterator<Duration> {
        //     const calendar : CalendarMixin = yield this.$.calendar
        //
        //     return calendar.calculateDuration(startDate, endDate, unit)
        // }


        convertDuration (duration : Duration, fromUnit : TimeUnit, toUnit : TimeUnit) {
            const projectCalendar = this.getProject().calendar

            return projectCalendar.convertDuration(duration, fromUnit, toUnit)
        }


        * $convertDuration (duration : Duration, fromUnit : TimeUnit, toUnit : TimeUnit) : ChronoIterator<Duration> {
            const project : this['project']     = this.getProject(),
                projectCalendar : CalendarMixin = yield project.$.calendar

            return projectCalendar.convertDuration(duration, fromUnit, toUnit)
        }


        //#region StartDate
        // @calculate('startDateInitial')
        // * calculateStartDateInitial () : ChronoIterator<any | Date> {
        //     const proposedValue = this.$.startDate.proposedValue
        //
        //     if (proposedValue !== undefined) return proposedValue
        //
        //     const shouldRecalculateStartDate    = yield* this.shouldRecalculateStartDate()
        //
        //     if (shouldRecalculateStartDate) {
        //         return yield* this.calculateProjectedStartDate(yield this.$.endDate)
        //     } else {
        //         // otherwise keep stable value
        //         return this.$.startDate.getConsistentValue()
        //     }
        // }


        // * canRecalculateStartDate () : ChronoIterator<boolean> {
        //     // we can recalculate start date if end date and duration is given
        //     return (this.$.endDate.hasProposedValue() || this.$.endDate.hasConsistentValue())
        //         && (this.$.duration.hasProposedValue() || this.$.duration.hasConsistentValue())
        // }
        //
        //
        // * shouldRecalculateStartDate () : ChronoIterator<boolean> {
        //     // we should recalculate start date if:
        //     // - no start date is filled yet
        //     // - end date is being changed and keepDuration is true
        //     // - duration is being changed and keepDuration is true
        //     return (!this.$.startDate.value
        //         || (this.$.endDate.proposedArgs && this.$.endDate.proposedArgs[ 1 ] === true)
        //         || (this.$.duration.proposedArgs && this.$.duration.proposedArgs[ 1 ] === false)
        //     ) && (yield* this.canRecalculateStartDate())
        // }


        @calculate('startDate')
        * calculateStartDate () : ChronoIterator<Date | boolean> {
            const dispatch : SEDDispatcher = yield this.$.dispatcher

            const formulaId : FormulaId = dispatch.resolution.get(StartDateVar)

            if (formulaId === CalculateProposed) {
                return yield* this.calculateStartDateProposed()
            }
            else if (formulaId === startDateFormula.formulaId) {
                return yield* this.calculateStartDatePure()
            } else {
                throw new Error("Unknown formula for `startDate`")
            }
        }


        * calculateStartDatePure () : ChronoIterator<Date> {
            return yield* this.calculateProjectedXDateWithDuration(yield this.$.endDate, false, yield this.$.duration)
        }


        * calculateProjectedXDateWithDuration (baseDate : Date, isForward : boolean = true, duration : Duration) : ChronoIterator<Date> {
            const durationUnit : TimeUnit               = yield this.$.durationUnit
            const calendar : CalendarMixin              = yield this.$.calendar
            const project : this[ 'project' ]           = this.getProject()

            if (!baseDate || isNotNumber(duration)) return null

            const durationMs : Duration   = yield* this.$convertDuration(duration, durationUnit, TimeUnit.Millisecond) as any

            if (isForward) {
                return calendar.calculateEndDate(baseDate, durationMs, TimeUnit.Millisecond)
            } else {
                return calendar.calculateStartDate(baseDate, durationMs, TimeUnit.Millisecond)
            }
        }



        /**
         * The "proposed" calculation function of the [[startDate]] field. It should calculate the [[startDate]] as if
         * there's a user input for it or a previous value. It can also use the values of other fields to "validate"
         * the "proposed" value.
         *
         * See also [[calculateStartDatePure]]
         */
        * calculateStartDateProposed () : ChronoIterator<Date> {
            const startDate : Date          = this.$.startDate.getProposedOrPreviousValue()

            return yield* this.skipNonWorkingTime(startDate, true)
        }

        //#endregion


        //#region EndDate

        // @calculate('endDateInitial')
        // * calculateEndDateInitial () : ChronoIterator<any | Date> {
        //     const proposedValue = this.$.endDate.proposedValue
        //
        //     const shouldIgnoreProposedEndDate = yield* this.shouldIgnoreProposedEndDate()
        //
        //     if (proposedValue !== undefined && !shouldIgnoreProposedEndDate) return proposedValue
        //
        //     const shouldRecalculateEndDate  = yield* this.shouldRecalculateEndDate()
        //
        //     if (shouldRecalculateEndDate) {
        //         return yield* this.calculateProjectedEndDate(yield this.$.startDate)
        //     } else {
        //         // otherwise keep stable value
        //         return this.$.endDate.getConsistentValue()
        //     }
        // }
        //
        //
        // // End date can be calculated if there are start and duration values
        // * shouldIgnoreProposedEndDate () : ChronoIterator<boolean> {
        //     return false
        // }
        //
        //
        // // End date can be calculated if there are start and duration values
        // * canRecalculateEndDate () : ChronoIterator<boolean> {
        //     // not just `this.$.startDate.hasValue()` because that includes `nextStableValue` which appears during propagation
        //     return (this.$.startDate.hasProposedValue() || this.$.startDate.hasConsistentValue())
        //         // if duration is provided or we can calculate it
        //         // not just `this.$.duration.hasValue()` because that includes `nextStableValue` which appears during propagation
        //         && (this.$.duration.hasProposedValue() || this.$.duration.hasConsistentValue() || (yield* this.canRecalculateDuration()))
        // }
        //
        //
        // // Signalizes to recalculate end date if:
        // // - end date has not value
        // // - or start date is being changed by setStartDate() call and keepDuration is true
        // // - or duration is being changed by setDuration() call and keepStartDate is true
        // * shouldRecalculateEndDate () : ChronoIterator<boolean> {
        //     return (!this.$.endDate.hasConsistentValue()
        //         || (this.$.startDate.hasProposedValue() && this.$.startDate.proposedArgs[ 1 ] === true)
        //         || (this.$.duration.hasProposedValue() && this.$.duration.proposedArgs[ 1 ] === true)
        //         // "default" case, when data is stable and no user input is given - in this case we recalculate the end date
        //         // note, that in the backward scheduling this will be a start date
        //         || (
        //             !this.$.startDate.hasProposedValue() && !this.$.endDate.hasProposedValue() && !this.$.duration.hasProposedValue()
        //             && this.$.startDate.hasConsistentValue() && this.$.endDate.hasConsistentValue() && this.$.duration.hasConsistentValue()
        //         )
        //     ) && (yield* this.canRecalculateEndDate())
        // }


        @calculate('endDate')
        * calculateEndDate () : ChronoIterator<Date | boolean> {
            const dispatch : SEDDispatcher = yield this.$.dispatcher

            const formulaId : FormulaId = dispatch.resolution.get(EndDateVar)

            if (formulaId === CalculateProposed) {
                return yield* this.calculateEndDateProposed()
            }
            else if (formulaId === endDateFormula.formulaId) {
                return yield* this.calculateEndDatePure()
                // the "new way" would be
                // return yield* this.calculateProjectedEndDateWithDuration(yield this.$.startDate, yield this.$.duration)
            } else {
                throw new Error("Unknown formula for `endDate`")
            }
        }


        * calculateEndDatePure () : ChronoIterator<Date> {
            return yield* this.calculateProjectedXDateWithDuration(yield this.$.startDate, true, yield this.$.duration)
        }


        * calculateEndDateProposed () : ChronoIterator<Date> {
            const endDate : Date            = this.$.endDate.getProposedOrPreviousValue()

            return yield* this.skipNonWorkingTime(endDate, false)
        }


        // // Calculates the end date as start date plus duration
        // // using availability provided by the event calendar
        // * calculateProjectedEndDate (startDate : Date, givenDuration? : Duration) : ChronoIterator<Date | any> {
        //     const calendar : CalendarMixin      = yield this.$.calendar,
        //         duration : Duration             = givenDuration !== undefined ? givenDuration : yield this.$.duration,
        //         durationUnit : TimeUnit         = yield this.$.durationUnit
        //
        //     // Project calendar is used for units conversion
        //     const durationMS : Duration = yield* this.$convertDuration(duration, durationUnit, TimeUnit.Millisecond)
        //
        //     return calendar.calculateEndDate(startDate, durationMS, TimeUnit.Millisecond)
        // }
        //#endregion


        //#region Duration
        @calculate('duration')
        * calculateDuration (proposedValue? : Duration) : ChronoIterator<any | Duration> {
            const dispatch : SEDDispatcher = yield this.$.dispatcher

            const formulaId : FormulaId = dispatch.resolution.get(DurationVar)

            if (formulaId === CalculateProposed) {
                return yield* this.calculateDurationProposed()
            }
            else if (formulaId === durationFormula.formulaId) {
                return yield* this.calculateDurationPure()
                // the "new way" would be
                // return yield* this.calculateProjectedDuration(yield this.$.startDate, yield this.$.endDate)
            } else {
                throw new Error("Unknown formula for `duration`")
            }
        }


        * calculateDurationPure () : ChronoIterator<Duration> {
            const startDate : Date          = yield this.$.startDate
            const endDate : Date            = yield this.$.endDate

            if (!startDate || !endDate) return null

            if (startDate > endDate) {
                throw new Error("debug")
                // yield Write(this.$.duration, 0, null)
            }
            else {
                return yield* this.calculateProjectedDuration(startDate, endDate)
            }
        }


        * calculateDurationProposed () : ChronoIterator<Duration> {
            return this.$.duration.getProposedOrPreviousValue()
        }


        * calculateProjectedDuration (startDate : Date, endDate : Date, durationUnit? : TimeUnit) : ChronoIterator<Duration> {
            if (!startDate || !endDate) return null

            if (!durationUnit) durationUnit             = yield this.$.durationUnit

            const calendar : CalendarMixin              = yield this.$.calendar
            const project : this[ 'project' ]           = this.getProject()

            return yield* this.$convertDuration(calendar.calculateDuration(startDate, endDate, TimeUnit.Millisecond), TimeUnit.Millisecond, durationUnit)
        }


        // effective duration is either a "normal" duration, or, if the duration itself is being calculated
        // (so that yielding it will cause a cycle)
        // an "estimated" duration, calculated based on proposed/previous start/end date values
        * calculateEffectiveDuration () : ChronoIterator<Duration> {
            const dispatch : SEDDispatcher              = yield this.$.dispatcher

            let effectiveDurationToUse : Duration

            const durationResolution : FormulaId        = dispatch.resolution.get(DurationVar)

            if (durationResolution === CalculateProposed) {
                effectiveDurationToUse  = yield this.$.duration
            }
            else if (durationResolution === durationFormula.formulaId) {
                effectiveDurationToUse  = yield* this.calculateProjectedDuration(
                    this.$.startDate.getProposedOrPreviousValue(),
                    this.$.endDate.getProposedOrPreviousValue()
                )
            }

            return effectiveDurationToUse
        }




        // // Calculates the event duration based on the event start/end dates.
        // // The duration is calculated as amount of working time between start and end dates.
        // * doCalculateDuration () : ChronoIterator<Duration> {
        //     const startDate     = yield this.$.startDate
        //     const endDate       = yield this.$.endDate
        //
        //     return yield* this.calculateProjectedDuration(startDate, endDate)
        // }
        //
        //
        // // Calculates the duration in `durationUnit`-s between start and end dates
        // // using availability provided by the event calendar
        // * calculateProjectedDuration (startDate : Date, endDate : Date) : ChronoIterator<Duration | any> {
        //     if (!startDate || !endDate || startDate > endDate) return null
        //
        //     const calendar : CalendarMixin      = yield this.$.calendar,
        //         durationUnit : TimeUnit         = yield this.$.durationUnit
        //
        //     return yield* this.$convertDuration(calendar.calculateDuration(startDate, endDate, TimeUnit.Millisecond), TimeUnit.Millisecond, durationUnit)
        // }
        //
        //
        // // Duration can be calculated if there are both start and end date values
        // * canRecalculateDuration () : ChronoIterator<boolean> {
        //     // not using `atom.hasValue()` method intentionally, because that includes `nextStableValue` check, which
        //     // appears during propagation and may affect this method
        //     return (this.$.startDate.hasProposedValue() || this.$.startDate.hasConsistentValue())
        //         && (this.$.endDate.hasProposedValue() || this.$.endDate.hasConsistentValue())
        // }
        //
        //
        // // Signalizes to recalculate duration if:
        // // - the event has no duration value
        // // - or start date is being changed by setStartDate() call and keepDuration is false
        // // - or end date is being changed by setEndDate() call and keepDuration is false
        // * shouldRecalculateDuration () : ChronoIterator<boolean> {
        //     return !this.$.duration.hasNextStableValue() && (
        //         (
        //             !this.$.duration.hasConsistentValue()
        //             // We don't recalculate duration if all the fields are just provided during initial data loading
        //             && (
        //                 !this.$.startDate.getProposedValue() || !this.$.endDate.getProposedValue() || this.$.duration.getProposedValue() == null
        //                 || this.$.startDate.hasConsistentValue() || this.$.endDate.hasConsistentValue()
        //             )
        //         )
        //         || (this.$.startDate.proposedArgs && this.$.startDate.proposedArgs[ 1 ] === false)
        //         || (this.$.endDate.proposedArgs && this.$.endDate.proposedArgs[ 1 ] === false)
        //     ) && (yield* this.canRecalculateDuration())
        // }

        //#endregion


        getStartDate () : Date {
            return this.startDate
        }


        putStartDate (date : Date, keepDuration : boolean = true) {
            const isVeryFirstAssignment             = this.$.startDate.getProposedOrPreviousValue() === undefined

            // ignore null/undefined for very 1st assignment, to not count it as proposed value
            if (date == null && isVeryFirstAssignment) return

            // if user wants to unschedule the task and this is not the very first assignment
            if (date === null && !isVeryFirstAssignment) {
                // can not use `putStartDate`, `putDuration` to avoid stack overflow
                this.$.endDate.proposedValue        = null
                this.$.endDate.proposedArgs         = [ null ]

                this.$.duration.proposedValue       = null
                this.$.duration.proposedArgs        = [ null ]
            }

            this.$.startDate.put(date, keepDuration)

            if (this.getGraph()) {
                // this is an "artefact" requirement from the past, where the proposed value was going to the "initial" atom
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.endDate)
                this.markAsNeedRecalculation(this.$.duration)
            }
        }


        async setStartDate (date : Date, keepDuration : boolean = true) : Promise<PropagationResult> {
            this.putStartDate(date, keepDuration)

            return this.propagate()
        }


        getEndDate () : Date {
            return this.endDate
        }

        putEndDate (date : Date, keepDuration : boolean = false) {
            const isVeryFirstAssignment             = this.$.startDate.getProposedOrPreviousValue() === undefined

            // ignore null/undefined for very 1st assignment, to not count it as proposed value
            if (date == null && isVeryFirstAssignment) return

            // if user wants to unschedule the task and this is not the very first assignment
            if (date === null && !isVeryFirstAssignment) {
                // can not use `putStartDate`, `putDuration` to avoid stack overflow
                this.$.startDate.proposedValue      = null
                this.$.startDate.proposedArgs       = [ null ]

                this.$.duration.proposedValue       = null
                this.$.duration.proposedArgs        = [ null ]
            }

            // // // when user "unschedules" the event, we always want to drop the duration and keep the opposite date
            // // keepDuration    = date === null ? false : keepDuration

            const startDate = this.getStartDate()

            if (!keepDuration && date && date.getTime && startDate && date.getTime() < startDate.getTime()) {
                date    = startDate
                this.putDuration(0)
            }

            this.$.endDate.put(date, keepDuration)

            if (this.getGraph()) {
                // this is an "artefact" requirement from the past, where the proposed value was going to the "initial" atom
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.duration)
            }


            // if (!keepDuration && !!date && !!startDate && startDate.getTime() === date.getTime()) {
            //     this.putDuration(0)
            // }
            // // Actually change end date if we are:
            // // 1. moving task by end date
            // // 2. trying to null it
            // // 3. there is no start date to validate against
            // // 4. or end date is greater
            // else if (keepDuration || !date || !startDate || startDate <= date) {
            //     this.$.endDate.put(date, keepDuration)
            //
            //     // // this is an "artifact" requirement from the past, where the proposed value was going to the "initial" atom
            //     // this.markAsNeedRecalculation(this.$.endDateInitial)
            //     //
            //     // this.markAsNeedRecalculation(keepDuration ? this.$.startDateInitial : this.$.duration)
            // }
        }

        async setEndDate (date : Date, keepDuration : boolean = false) : Promise<PropagationResult> {
            this.putEndDate(date, keepDuration)

            return this.propagate()
        }


        getDuration (unit? : TimeUnit) : Duration {
            let duration      = this.duration

            if (unit) {
                duration = this.convertDuration(duration, this.durationUnit, unit)
            }

            return duration
        }


        putDuration (duration : Duration, unit? : TimeUnit, keepStartDate : boolean = true) {
            const isVeryFirstAssignment             = this.$.duration.getProposedOrPreviousValue() === undefined

            // ignore null/undefined for very 1st assignment, to not count it as proposed value
            if (duration == null && isVeryFirstAssignment) return

            // if user wants to unschedule the task and this is not the very first assignment
            if (duration === null && !isVeryFirstAssignment) {
                this.$.startDate.proposedValue      = null
                this.$.startDate.proposedArgs       = [ null ]

                this.$.endDate.proposedValue        = null
                this.$.endDate.proposedArgs         = [ null ]
            }

            this.$.duration.put(duration, keepStartDate)

            if (this.getGraph()) {
                // this is an "artefact" requirement from the past, where the proposed value was going to the "initial" atom
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.endDate)
            }


            // const hasNoStartDate    = !this.$.startDate.hasProposedValue() && !this.$.startDate.hasConsistentValue()
            //
            // // never try to keep the start date if its absent
            // // (we might be able to calculate it, instead of keeping)
            // keepStartDate           = hasNoStartDate ? false : keepStartDate

            if (unit != null && unit !== this.durationUnit) {
                this.$.durationUnit.put(unit)
            }

            // this.$.duration.put(duration, keepStartDate)
            //
            // this.markAsNeedRecalculation(keepStartDate ? this.$.endDateInitial : this.$.startDateInitial)
        }

        async setDuration (duration : Duration, unit? : TimeUnit, keepStartDate : boolean = true) : Promise<PropagationResult> {
            this.putDuration(duration, unit, keepStartDate)

            return this.propagate()
        }

        getDurationUnit () : TimeUnit {
            return this.durationUnit
        }


        setDurationUnit (_value : TimeUnit) {
            throw new Error("Use `setDuration` instead")
        }


        // should be overridden in the visualizing code
        toString () : string {
            return `Event ${this.id}`
        }


        setSchedulingMode : (mode : SchedulingMode) => Promise<PropagationResult>
    }

    return EventMixin
}

/**
 * Event entity mixin type
 *
 * At this level event is only aware about its calendar (which is inherited from project, if not provided).
 * The functionality, related to the dependencies, constraints etc is provided in other mixins.
 */
export interface EventMixin extends Mixin<typeof EventMixin> {}


/**
 * Event mixin type guard
 */
export const hasEventMixin = (model : any) : model is EventMixin => Boolean(model && model[hasMixin])
