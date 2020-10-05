import DateHelper from "../../Core/helper/DateHelper.js";
import { TimeUnit } from "../scheduling/Types.js";
import { MAX_DATE, MIN_DATE } from "../util/Constants.js";
import { EdgeInclusion } from "../util/Types.js";
import { CalendarIteratorResult } from "./CalendarIteratorResult.js";
export class CalendarCache {
    constructor(config) {
        this.cacheFilledStartDate = MAX_DATE;
        this.cacheFilledEndDate = MIN_DATE;
        this.intervalsCachingChunkDuration = 30;
        this.intervalsCachingChunkUnit = TimeUnit.Day;
        this.maxCacheExtendCycles = 1000;
        config && Object.assign(this, config);
    }
    includeWrappingRangeFrom(cache, startDate, endDate) {
        cache.ensureCacheFilledForInterval(startDate, endDate);
        this.intervalCache.includeWrappingRange(cache.intervalCache, startDate, endDate);
    }
    ensureCacheFilledForInterval(startDate, endDate) {
        const cacheFilledStartDateN = this.cacheFilledStartDate.getTime();
        const cacheFilledEndDateN = this.cacheFilledEndDate.getTime();
        if (cacheFilledStartDateN !== MAX_DATE.getTime()) {
            const startDateN = startDate.getTime();
            const endDateN = endDate.getTime();
            if (cacheFilledStartDateN <= startDateN && endDateN <= cacheFilledEndDateN)
                return;
            if (endDateN <= cacheFilledStartDateN) {
                endDate = new Date(cacheFilledStartDateN - 1);
            }
            else if (startDateN >= cacheFilledEndDateN) {
                startDate = new Date(cacheFilledEndDateN + 1);
            }
            else if (cacheFilledStartDateN <= startDateN && startDateN <= cacheFilledEndDateN) {
                startDate = new Date(cacheFilledEndDateN + 1);
            }
            else if (cacheFilledStartDateN <= endDateN && endDateN <= cacheFilledEndDateN) {
                endDate = new Date(cacheFilledStartDateN - 1);
            }
            else {
                this.ensureCacheFilledForInterval(startDate, new Date(cacheFilledStartDateN - 1));
                this.ensureCacheFilledForInterval(new Date(cacheFilledEndDateN + 1), endDate);
                return;
            }
        }
        if (cacheFilledStartDateN === MAX_DATE.getTime() || startDate.getTime() < cacheFilledEndDateN) {
            this.cacheFilledStartDate = startDate;
        }
        if (cacheFilledEndDateN === MIN_DATE.getTime() || cacheFilledEndDateN < endDate.getTime()) {
            this.cacheFilledEndDate = endDate;
        }
        this.fillCache(startDate, endDate);
    }
    fillCache(_1, _2) {
        throw new Error("Abstract method");
    }
    clear() {
        this.cacheFilledStartDate = MAX_DATE;
        this.cacheFilledEndDate = MIN_DATE;
        this.intervalCache.clear();
    }
    forEachAvailabilityInterval(options, func, scope) {
        scope = scope || this;
        const startDate = options.startDate;
        const endDate = options.endDate;
        const startDateN = startDate && startDate.getTime();
        const endDateN = endDate && endDate.getTime();
        const isForward = options.isForward !== false;
        if (isForward ? !startDate : !endDate) {
            throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option");
        }
        const intervalCache = this.intervalCache;
        let cacheCursorDate = isForward ? startDate : endDate;
        let cursorDate = isForward ? startDate : endDate;
        for (let cycle = 1; cycle < this.maxCacheExtendCycles; cycle++) {
            if (isForward) {
                this.ensureCacheFilledForInterval(cacheCursorDate, endDate || DateHelper.add(cacheCursorDate, this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit));
            }
            else {
                this.ensureCacheFilledForInterval(startDate || DateHelper.add(cacheCursorDate, -this.intervalsCachingChunkDuration, this.intervalsCachingChunkUnit), cacheCursorDate);
            }
            let interval = intervalCache.getIntervalOf(cursorDate, isForward ? EdgeInclusion.Left : EdgeInclusion.Right);
            while (interval) {
                const intervalStartDate = interval.startDate;
                const intervalEndDate = interval.endDate;
                if ((isForward && endDateN && intervalStartDate.getTime() >= endDateN)
                    ||
                        (!isForward && startDateN && intervalEndDate.getTime() <= startDateN)) {
                    return CalendarIteratorResult.FullRangeIterated;
                }
                if ((isForward && intervalStartDate.getTime() > this.cacheFilledEndDate.getTime())
                    ||
                        (!isForward && intervalEndDate.getTime() < this.cacheFilledStartDate.getTime())) {
                    break;
                }
                cursorDate = isForward ? intervalEndDate : intervalStartDate;
                const countFrom = startDateN && intervalStartDate.getTime() < startDateN ? startDate : intervalStartDate;
                const countTill = endDateN && intervalEndDate.getTime() > endDateN ? endDate : intervalEndDate;
                if (func.call(scope, countFrom, countTill, interval.cacheInterval) === false) {
                    return CalendarIteratorResult.StoppedByIterator;
                }
                interval = isForward ? intervalCache.getNextInterval(interval) : intervalCache.getPrevInterval(interval);
            }
            if (isForward && cursorDate.getTime() === MAX_DATE.getTime() || !isForward && cursorDate.getTime() === MIN_DATE.getTime()) {
                return CalendarIteratorResult.FullRangeIterated;
            }
            cacheCursorDate = isForward ? this.cacheFilledEndDate : this.cacheFilledStartDate;
        }
        return CalendarIteratorResult.MaxCacheExtendCyclesReached;
    }
}
//# sourceMappingURL=CalendarCache.js.map