import Model from "../../Core/data/Model.js"
import DateHelper from "../../Core/helper/DateHelper.js"
import { ChronoIterator } from "../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin, MixinConstructor } from "../../ChronoGraph/class/Mixin.js"
import { Entity, field } from "../../ChronoGraph/replica/Entity.js"
import { model_field } from "../chrono/ModelFieldAtom.js"
import { PartOfProjectMixin } from "../data/model/mixin/PartOfProjectMixin.js"
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js"
import { Duration, TimeUnit } from "../scheduling/Types.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarCacheSingle } from "./CalendarCacheSingle.js"
import { CalendarIntervalMixin, MinimalCalendarInterval } from "./CalendarIntervalMixin.js"
import { CalendarIntervalStore } from "./CalendarIntervalStore.js"
import { CalendarIteratorResult } from "./CalendarIteratorResult.js"
import { UnspecifiedTimeIntervalModel } from "./UnspecifiedTimeIntervalModel.js"

const hasMixin = Symbol('CalendarMixin')

export type AccumulateWorkingTimeResult = { finalDate : Date, remainingDurationInMs : number }


export const CalendarMixin = <T extends AnyConstructor<PartOfProjectMixin>>(base : T) => {

    class CalendarMixin extends base {

        [hasMixin] () {}

        intervalStore           : CalendarIntervalStore

        @field({ persistent : false })
        version                 : number    = 1

        unitsInMs               : { [ key : string ] : number }

        /**
         * The calendar name
         */
        @model_field({ type : 'string' })
        name                    : string

        /**
         * The number of hours per day (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 24 })
        hoursPerDay             : number

        /**
         * The number of days per week (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 7 })
        daysPerWeek             : number

        /**
         * The number of days per month (is used when converting the duration from one unit to another).
         */
        @model_field({ type : 'number', defaultValue : 30 })
        daysPerMonth            : number

        /**
         * The flag, indicating, whether the "unspecified" time (time that does not belong to any [[CalendarIntervalMixin interval]])
         * is working (`true`) or not (`false`). Default value is `true`
         */
        @model_field({ type : 'boolean', defaultValue : true })
        unspecifiedTimeIsWorking : boolean

        @model_field()
        intervals                : Partial<CalendarIntervalMixin>[]


        // this makes the calendar's self-atom to change (and trigger calculation on outgoing edges) on every `version` change
        * calculateSelf () : ChronoIterator<this> {
            yield this.$.version

            return this
        }


        afterConstruct () {
            super.afterConstruct()

            const hoursPerDay   = this.hoursPerDay
            const daysPerWeek   = this.daysPerWeek
            const daysPerMonth  = this.daysPerMonth

            this.unitsInMs      = {
                millisecond : 1,
                second      : 1000,
                minute      : 60 * 1000,
                hour        : 60 * 60 * 1000,
                day         : hoursPerDay * 60 * 60 * 1000,
                week        : daysPerWeek * hoursPerDay * 60 * 60 * 1000,
                month       : daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                quarter     : 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                year        : 4 * 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000
            }

            this.intervalStore  = new CalendarIntervalStore({
                calendar   : this,
                modelClass : (this.constructor as any).defaultConfig.calendarIntervalModelClass || MinimalCalendarInterval
            })

            // if intervals are provided add them to the this.intervalStore
            if (this.intervals && this.intervals.length) {
                this.addIntervals(this.intervals)
            }
        }


        isDefault () : boolean {
            const project = this.getProject()

            if (project) {
                return this === project.defaultCalendar
            }

            return false
        }


        // TODO: move to Model?
        getDepth () : number {
            return this.childLevel + 1
        }


        forEachAvailabilityInterval (
            options     : { startDate? : Date, endDate? : Date, isForward? : boolean },
            func        : (startDate : Date, endDate : Date, calendarCacheInterval : CalendarCacheInterval) => any,
            scope?      : object
        ) : CalendarIteratorResult {
            return this.calendarCache.forEachAvailabilityInterval(options, func, scope)
        }


        accumulateWorkingTime (date : Date, duration : Duration, unit : TimeUnit, isForward : boolean) : AccumulateWorkingTimeResult {
            // if duration is 0 - return the same date
            if (duration === 0) return { finalDate : new Date(date), remainingDurationInMs : 0 }

            if (isNaN(duration)) throw new Error("Invalid duration")

            let remainingDurationInMs   = this.convertDuration(duration, unit, TimeUnit.Millisecond)

            let finalDate               = date

            this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    let result = true

                    if (calendarCacheInterval.getIsWorking()) {
                        const dstDiff               = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset()
                        const diff                  = intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000

                        if (remainingDurationInMs <= diff) {
                            finalDate               = isForward
                                ?
                                new Date(intervalStartDate.getTime() + remainingDurationInMs)
                                :
                                new Date(intervalEndDate.getTime() - remainingDurationInMs)

                            remainingDurationInMs   = 0

                            result = false
                        } else {
                            finalDate                = isForward ? intervalEndDate : intervalStartDate
                            remainingDurationInMs   -= diff
                        }
                    }

                    return result
                }
            )

            return { finalDate : new Date(finalDate), remainingDurationInMs : remainingDurationInMs }
        }


        calculateDuration (startDate : Date, endDate : Date, unit : TimeUnit) : Duration {
            let duration        = 0

            this.forEachAvailabilityInterval(
                { startDate : startDate, endDate : endDate },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {

                    if (calendarCacheInterval.getIsWorking()) {
                        const dstDiff   = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset()

                        duration        += intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000
                    }
                }
            )

            return this.convertDuration(duration, TimeUnit.Millisecond, unit)
        }


        calculateEndDate (startDate : Date, duration : Duration, unit : TimeUnit) : Date | null {
            const res   = this.accumulateWorkingTime(startDate, duration, unit, true)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        calculateStartDate (endDate : Date, duration : Duration, unit : TimeUnit) : Date | null {
            const res   = this.accumulateWorkingTime(endDate, duration, unit, false)

            return res.remainingDurationInMs === 0 ? res.finalDate : null
        }


        skipNonWorkingTime (date : Date, isForward : boolean = true) : Date | null {
            let workingDate : Date

            this.forEachAvailabilityInterval(
                isForward ? { startDate : date, isForward : true } : { endDate : date, isForward : false },

                (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                    if (calendarCacheInterval.getIsWorking()) {
                        workingDate = isForward ? intervalStartDate : intervalEndDate

                        return false
                    }
                }
            )

            return workingDate ? new Date(workingDate) : new Date(date)
        }


        convertDuration (duration : Duration, fromUnit : TimeUnit, toUnit : TimeUnit) : Duration {
            let result  = duration

            if (fromUnit !== toUnit) {
                result  = duration * this.unitsInMs[ fromUnit ] / this.unitsInMs[ toUnit ]
            }

            return result
        }


        /**
         * This method adds a single [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addInterval (interval : Partial<CalendarIntervalMixin>) {
            return this.addIntervals([ interval ])
        }


        /**
         * This method adds an array of [[CalendarIntervalMixin]] to the internal collection of the calendar
         */
        addIntervals (intervals : Partial<CalendarIntervalMixin>[]) {
            this.bumpVersion()

            return this.intervalStore.add(intervals)
        }


        bumpVersion () {
            this.clearCache()
            this.version++
        }


        $calendarCache           : CalendarCacheSingle

        get calendarCache () : CalendarCacheSingle {
            if (this.$calendarCache !== undefined) return this.$calendarCache

            const unspecifiedTimeInterval       = new UnspecifiedTimeIntervalModel({
                isWorking       : this.unspecifiedTimeIsWorking
            })

            unspecifiedTimeInterval.calendar    = this

            return this.$calendarCache = new CalendarCacheSingle({
                calendar                : this,
                unspecifiedTimeInterval : unspecifiedTimeInterval,
                intervalStore           : this.intervalStore,
                parentCache             : this.parent && !this.parent.isRoot ? this.parent.calendarCache : null
            })
        }


        clearCache () {
            // not strictly needed, we just help garbage collector
            this.$calendarCache && this.$calendarCache.clear()
            this.$calendarCache = undefined
        }


        resetPriorityOfAllIntervals () {
            this.traverse((calendar : CalendarMixin) => {
                calendar.intervalStore.forEach((interval : CalendarIntervalMixin) => interval.resetPriority())
            })
        }


        appendChild (child) {
            let res = super.appendChild(child)

            if (!Array.isArray(res)) {
                res = [res]
            }

            // invalidate cache of the child record, since now it should take parent into account
            res.forEach((r : CalendarMixin) => {
                r.bumpVersion()
                r.resetPriorityOfAllIntervals()
            })

            return res
        }


        insertChild (child, before?) {
            let res = super.insertChild(child, before)

            if (!Array.isArray(res)) {
                res = [res]
            }

            // invalidate cache of the child record, since now it should take parent into account
            res.forEach((r : CalendarMixin) => {
                r.bumpVersion()
                r.resetPriorityOfAllIntervals()
            })

            return res
        }


        joinProject () {
            super.joinProject()

            this.intervalStore.setProject(this.getProject())
        }


        leaveProject () {
            super.leaveProject()

            this.intervalStore.setProject(null)
        }


        isDayHoliday (day : Date) : boolean {
            const startDate = DateHelper.clearTime(day),
                  endDate = DateHelper.getNext(day, TimeUnit.Day)

            let hasWorkingTime = false

            this.forEachAvailabilityInterval(
                { startDate, endDate, isForward : true },
                (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => {
                    hasWorkingTime = calendarCacheInterval.getIsWorking()
                    return !hasWorkingTime
                }
            )

            return !hasWorkingTime
        }

        // TODO: tests
        getDailyHolidaysRanges (startDate : Date, endDate : Date) : { startDate : Date, endDate : Date }[] {
            let result = []

            startDate = DateHelper.clearTime(startDate)

            while (startDate < endDate) {
                if (this.isDayHoliday(startDate)) {
                    result.push({
                        startDate,
                        endDate : DateHelper.getStartOfNextDay(startDate, true, true)
                    })
                }
                startDate = DateHelper.getNext(startDate, TimeUnit.Day)
            }

            return result
        }
    }

    return CalendarMixin
}

/**
 * Calendar mixin type
 *
 * This mixin represent a calendar in the Gantt chart
 */
export interface CalendarMixin extends Mixin<typeof CalendarMixin> {}


/**
 * Function to build a minimal possible [[CalendarMixin]] class
 */
export const BuildMinimalCalendar = (base : typeof Model = Model) : MixinConstructor<typeof CalendarMixin> =>
    (CalendarMixin as any)(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    Entity(
        base
    ))))


/**
 * Minimal possible `CalendarMixin` class
 */
export class MinimalCalendar extends BuildMinimalCalendar() {}

/**
 * The typeguard for the [[CalendarMixin]]
 */
export const hasCalendarMixin = (record : any) : record is CalendarMixin => Boolean(record && record[hasMixin])
