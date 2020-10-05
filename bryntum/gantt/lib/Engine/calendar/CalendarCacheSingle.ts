import later from "../vendor/later/later.js"
import { CalendarCache } from "./CalendarCache.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { CalendarIntervalStore } from "./CalendarIntervalStore.js"
import { CalendarMixin } from "./CalendarMixin.js"
import { IntervalCache } from "./IntervalCache.js"
import { UnspecifiedTimeIntervalModel } from "./UnspecifiedTimeIntervalModel.js"


export class CalendarCacheSingle extends CalendarCache<CalendarCacheInterval, CalendarCacheInterval> {
    parentCache                     : CalendarCacheSingle

    unspecifiedTimeInterval         : UnspecifiedTimeIntervalModel

    calendar                        : CalendarMixin

    intervalStore                   : CalendarIntervalStore

    staticIntervalsCached           : boolean   = false


    constructor (config? : Partial<CalendarCacheSingle>) {
        super(config)

        if (!this.unspecifiedTimeInterval) throw new Error("Required attribute `unspecifiedTimeInterval` is missing")

        this.intervalCache = new IntervalCache({

            emptyInterval   : new CalendarCacheInterval({
                intervals       : [  this.unspecifiedTimeInterval ],

                calendar        : this.calendar
            }),

            combineIntervalsFn  : (interval1, interval2) => {
                return interval1.combineWith(interval2)
            }
        })
    }


    fillCache (startDate : Date, endDate : Date) {
        if (!this.staticIntervalsCached) {
            this.cacheStaticIntervals()

            this.staticIntervalsCached  = true
        }

        if (this.parentCache) this.includeWrappingRangeFrom(this.parentCache, startDate, endDate)

        const startDateN        = startDate.getTime()
        const endDateN          = endDate.getTime()

        if (startDateN > endDateN) throw new Error("Invalid cache fill interval")

        this.forEachRecurrentInterval(interval => {
            const startSchedule             = interval.getStartDateSchedule()
            const endSchedule               = interval.getEndDateSchedule()

            let wrappingStartDate           = startSchedule.prev(1, startDate)
            let wrappingEndDate             = endSchedule.next(1, endDate)

            // if the `startDate` is an occurrence in the interval's schedule, we need to advance one point prior
            // this is to provide the backward-scheduling information for the `startDate` point
            if (wrappingStartDate !== later.NEVER && wrappingStartDate.getTime() === startDateN) {
                const wrappingStartDates    = startSchedule.prev(2, startDate)

                if (wrappingStartDates !== later.NEVER && wrappingStartDates.length === 2) wrappingStartDate = wrappingStartDates[ 1 ]
            }

            if (wrappingEndDate !== later.NEVER && wrappingEndDate.getTime() === endDateN) {
                const wrappingEndDates      = endSchedule.next(2, endDate)

                if (wrappingEndDates !== later.NEVER && wrappingEndDates.length === 2) wrappingEndDate = wrappingEndDates[ 1 ]
            }

            const startDates : Date[]       = startSchedule.next(
                Infinity,
                wrappingStartDate !== later.NEVER ? wrappingStartDate : startDate,
                wrappingEndDate !== later.NEVER ? new Date(wrappingEndDate.getTime() - 1) : endDate
            )

            // schedule is empty for the interval of interest, do nothing
            if (startDates === later.NEVER) return

            // at this point `startDates` is a non-empty array

            const endDates : Date[]         = endSchedule.next(
                Infinity,
                new Date(startDates[ 0 ].getTime() + 1),
                wrappingEndDate !== later.NEVER ? wrappingEndDate : endDate
            )

            if (endDates.length > startDates.length) {
                // safe to ignore "extra" end dates
                endDates.length = startDates.length
            }
            else if (endDates.length < startDates.length) {
                // monkey patch
                startDates.length = endDates.length
                // throw new Error("Recurrent interval inconsistency: " + interval + ", caching startDate: " + startDate + ", caching endDate: " + endDate)
            }

            startDates.forEach((startDate, index) => {
                const recStartDate  = startDate
                const recEndDate    = endDates[ index ]

                // if (recStartDate.getTime() > recEndDate.getTime())
                //     throw new Error("Recurrent interval inconsistency: " + interval + ", startDate: " + startDate + ", endDate: " + endDates[ index ])

                this.intervalCache.addInterval(recStartDate, recEndDate, existingCacheInterval => existingCacheInterval.includeInterval(interval))
            })
        })
    }


    clear () {
        this.staticIntervalsCached = false

        super.clear()
    }


    cacheStaticIntervals () {
        this.forEachStaticInterval(interval => {
            this.intervalCache.addInterval(
                interval.startDate,
                interval.endDate,
                existingCacheInterval => existingCacheInterval.includeInterval(interval)
            )
        })
    }


    forEachStaticInterval (func : (interval : CalendarIntervalMixin) => any) {
        this.intervalStore.forEach((interval : CalendarIntervalMixin) => {
            if (interval.isStatic()) func(interval)
        })
    }


    forEachRecurrentInterval (func : (interval : any) => any) {
        this.intervalStore.forEach((interval : CalendarIntervalMixin) => {
            if (interval.isRecurrent()) func(interval)
        })
    }

}
