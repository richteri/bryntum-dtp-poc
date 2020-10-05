import DateHelper from "../../Core/helper/DateHelper.js"
import { Duration, TimeUnit } from "../scheduling/Types.js"
import { MAX_DATE, MIN_DATE } from "../util/Constants.js"
import { EdgeInclusion } from "../util/Types.js"
import { CalendarIteratorResult } from "./CalendarIteratorResult.js"
import { IntervalCache } from "./IntervalCache.js"

export class CalendarCache<IntervalT, CombineWithIntervalT> {

    cacheFilledStartDate            : Date = MAX_DATE
    cacheFilledEndDate              : Date = MIN_DATE

    intervalCache                   : IntervalCache<IntervalT, CombineWithIntervalT>

    intervalsCachingChunkDuration   : Duration  = 30
    intervalsCachingChunkUnit       : TimeUnit  = TimeUnit.Day

    maxCacheExtendCycles            : number    = 1000


    constructor (config? : Partial<CalendarCache<IntervalT, CombineWithIntervalT>>) {
        config && Object.assign(this, config)
    }


    includeWrappingRangeFrom (cache : CalendarCache<CombineWithIntervalT, any>, startDate : Date, endDate : Date) {
        cache.ensureCacheFilledForInterval(startDate, endDate)

        this.intervalCache.includeWrappingRange(cache.intervalCache, startDate, endDate)
    }


    // after this method, we guarantee, that for every point between `startDate` and `endDate` (_inclusive_)
    // we'll have a final representation of the cache, that is, we'll be able to get an interval to which this point belongs
    // _both_ for forward and backward directions
    ensureCacheFilledForInterval (startDate : Date, endDate : Date) {
        const cacheFilledStartDateN = this.cacheFilledStartDate.getTime()
        const cacheFilledEndDateN   = this.cacheFilledEndDate.getTime()

        if (cacheFilledStartDateN !== MAX_DATE.getTime()) {
            const startDateN        = startDate.getTime()
            const endDateN          = endDate.getTime()

            if (cacheFilledStartDateN <= startDateN && endDateN <= cacheFilledEndDateN) return

            // asked to cache an interval which is to the left from the cached area - extend to the right
            if (endDateN <= cacheFilledStartDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else if (startDateN >= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN + 1)

            } else if (cacheFilledStartDateN <= startDateN && startDateN <= cacheFilledEndDateN) {

                startDate           = new Date(cacheFilledEndDateN + 1)

            } else if (cacheFilledStartDateN <= endDateN && endDateN <= cacheFilledEndDateN) {

                endDate             = new Date(cacheFilledStartDateN - 1)

            } else {
                this.ensureCacheFilledForInterval(startDate, new Date(cacheFilledStartDateN - 1))
                this.ensureCacheFilledForInterval(new Date(cacheFilledEndDateN + 1), endDate)

                return
            }
        }

        if (cacheFilledStartDateN === MAX_DATE.getTime() || startDate.getTime() < cacheFilledEndDateN) {
            this.cacheFilledStartDate   = startDate
        }

        if (cacheFilledEndDateN === MIN_DATE.getTime() || cacheFilledEndDateN < endDate.getTime()) {
            this.cacheFilledEndDate     = endDate
        }

        this.fillCache(startDate, endDate)
    }


    fillCache (_1/* startDate */ : Date, _2/* endDate */ : Date) {
        throw new Error("Abstract method")
    }


    clear () {
        this.cacheFilledStartDate   = MAX_DATE
        this.cacheFilledEndDate     = MIN_DATE

        this.intervalCache.clear()
    }


    forEachAvailabilityInterval (
        options     : { startDate? : Date, endDate? : Date, isForward? : boolean },
        func        : (startDate : Date, endDate : Date, calendarCacheInterval : IntervalT) => false | void,
        scope?      : object
    ) : CalendarIteratorResult {
        scope                       = scope || this

        const startDate             = options.startDate
        const endDate               = options.endDate
        const startDateN            = startDate && startDate.getTime()
        const endDateN              = endDate && endDate.getTime()

        // `isForward = true` by default
        const isForward             = options.isForward !== false

        if (isForward ? !startDate : !endDate) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
        }

        const intervalCache         = this.intervalCache

        let cacheCursorDate         = isForward ? startDate : endDate
        let cursorDate              = isForward ? startDate : endDate

        // this is generally an endless loop, but we artificially limit it to `maxCacheExtendCycles` iterations
        // to avoid freezing in unforeseen edge cases
        for (let cycle = 1; cycle < this.maxCacheExtendCycles; cycle++) {
            if (isForward) {
                this.ensureCacheFilledForInterval(
                    cacheCursorDate,
                    endDate || DateHelper.add(cacheCursorDate, this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit)
                )
            } else {
                this.ensureCacheFilledForInterval(
                    startDate || DateHelper.add(cacheCursorDate, -this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit),
                    cacheCursorDate
                )
            }

            let interval        = intervalCache.getIntervalOf(cursorDate, isForward ? EdgeInclusion.Left : EdgeInclusion.Right)

            while (interval) {
                const intervalStartDate = interval.startDate
                const intervalEndDate   = interval.endDate

                // out of requested range - all done
                if (
                    (isForward && endDateN && intervalStartDate.getTime() >= endDateN)
                    ||
                    (!isForward && startDateN && intervalEndDate.getTime() <= startDateN)
                ) {
                    return CalendarIteratorResult.FullRangeIterated
                }

                // we are out of cached area, need to extend the cache
                if (
                    (isForward && intervalStartDate.getTime() > this.cacheFilledEndDate.getTime())
                    ||
                    (!isForward && intervalEndDate.getTime() < this.cacheFilledStartDate.getTime())
                ) {
                    break
                }

                // save the last processed point, from which we should start after cache will be extended
                cursorDate              = isForward ? intervalEndDate : intervalStartDate

                // adjust to start / end date limits in iterator
                const countFrom         = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate
                const countTill         = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate

                if (func.call(scope, countFrom, countTill, interval.cacheInterval) === false) {
                    // indicates premature exit if iterator returns `false`
                    return CalendarIteratorResult.StoppedByIterator
                }

                interval                = isForward ? intervalCache.getNextInterval(interval) : intervalCache.getPrevInterval(interval)
            }

            if (isForward && cursorDate.getTime() === MAX_DATE.getTime() || !isForward && cursorDate.getTime() === MIN_DATE.getTime()) {
                return CalendarIteratorResult.FullRangeIterated
            }

            cacheCursorDate             = isForward ? this.cacheFilledEndDate : this.cacheFilledStartDate
        }

        return CalendarIteratorResult.MaxCacheExtendCyclesReached
    }
}
