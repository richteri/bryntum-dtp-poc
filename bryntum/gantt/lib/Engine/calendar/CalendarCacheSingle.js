import later from "../vendor/later/later.js";
import { CalendarCache } from "./CalendarCache.js";
import { CalendarCacheInterval } from "./CalendarCacheInterval.js";
import { IntervalCache } from "./IntervalCache.js";
export class CalendarCacheSingle extends CalendarCache {
    constructor(config) {
        super(config);
        this.staticIntervalsCached = false;
        if (!this.unspecifiedTimeInterval)
            throw new Error("Required attribute `unspecifiedTimeInterval` is missing");
        this.intervalCache = new IntervalCache({
            emptyInterval: new CalendarCacheInterval({
                intervals: [this.unspecifiedTimeInterval],
                calendar: this.calendar
            }),
            combineIntervalsFn: (interval1, interval2) => {
                return interval1.combineWith(interval2);
            }
        });
    }
    fillCache(startDate, endDate) {
        if (!this.staticIntervalsCached) {
            this.cacheStaticIntervals();
            this.staticIntervalsCached = true;
        }
        if (this.parentCache)
            this.includeWrappingRangeFrom(this.parentCache, startDate, endDate);
        const startDateN = startDate.getTime();
        const endDateN = endDate.getTime();
        if (startDateN > endDateN)
            throw new Error("Invalid cache fill interval");
        this.forEachRecurrentInterval(interval => {
            const startSchedule = interval.getStartDateSchedule();
            const endSchedule = interval.getEndDateSchedule();
            let wrappingStartDate = startSchedule.prev(1, startDate);
            let wrappingEndDate = endSchedule.next(1, endDate);
            if (wrappingStartDate !== later.NEVER && wrappingStartDate.getTime() === startDateN) {
                const wrappingStartDates = startSchedule.prev(2, startDate);
                if (wrappingStartDates !== later.NEVER && wrappingStartDates.length === 2)
                    wrappingStartDate = wrappingStartDates[1];
            }
            if (wrappingEndDate !== later.NEVER && wrappingEndDate.getTime() === endDateN) {
                const wrappingEndDates = endSchedule.next(2, endDate);
                if (wrappingEndDates !== later.NEVER && wrappingEndDates.length === 2)
                    wrappingEndDate = wrappingEndDates[1];
            }
            const startDates = startSchedule.next(Infinity, wrappingStartDate !== later.NEVER ? wrappingStartDate : startDate, wrappingEndDate !== later.NEVER ? new Date(wrappingEndDate.getTime() - 1) : endDate);
            if (startDates === later.NEVER)
                return;
            const endDates = endSchedule.next(Infinity, new Date(startDates[0].getTime() + 1), wrappingEndDate !== later.NEVER ? wrappingEndDate : endDate);
            if (endDates.length > startDates.length) {
                endDates.length = startDates.length;
            }
            else if (endDates.length < startDates.length) {
                startDates.length = endDates.length;
            }
            startDates.forEach((startDate, index) => {
                const recStartDate = startDate;
                const recEndDate = endDates[index];
                this.intervalCache.addInterval(recStartDate, recEndDate, existingCacheInterval => existingCacheInterval.includeInterval(interval));
            });
        });
    }
    clear() {
        this.staticIntervalsCached = false;
        super.clear();
    }
    cacheStaticIntervals() {
        this.forEachStaticInterval(interval => {
            this.intervalCache.addInterval(interval.startDate, interval.endDate, existingCacheInterval => existingCacheInterval.includeInterval(interval));
        });
    }
    forEachStaticInterval(func) {
        this.intervalStore.forEach((interval) => {
            if (interval.isStatic())
                func(interval);
        });
    }
    forEachRecurrentInterval(func) {
        this.intervalStore.forEach((interval) => {
            if (interval.isRecurrent())
                func(interval);
        });
    }
}
//# sourceMappingURL=CalendarCacheSingle.js.map