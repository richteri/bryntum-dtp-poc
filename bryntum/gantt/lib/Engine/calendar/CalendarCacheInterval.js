import { stripDuplicates } from "../util/StripDuplicates.js";
export class CalendarCacheInterval {
    constructor(config) {
        this.intervals = [];
        config && Object.assign(this, config);
        if (!this.calendar)
            throw new Error("Required attribute `calendar` is missing");
    }
    includeInterval(interval) {
        if (this.intervals.indexOf(interval) == -1) {
            const copy = this.intervals.slice();
            copy.push(interval);
            return new CalendarCacheInterval({ intervals: copy, calendar: this.calendar });
        }
        else
            return this;
    }
    combineWith(interval) {
        return new CalendarCacheInterval({ intervals: this.intervals.concat(interval.intervals), calendar: this.calendar });
    }
    getIsWorking() {
        if (this.isWorking != null)
            return this.isWorking;
        const intervals = this.intervals = this.normalizeIntervals(this.intervals);
        return this.isWorking = intervals[0].isWorking;
    }
    normalizeIntervals(intervals) {
        const filtered = stripDuplicates(intervals);
        filtered.sort((interval1, interval2) => interval2.getPriorityField() - interval1.getPriorityField());
        return filtered;
    }
}
//# sourceMappingURL=CalendarCacheInterval.js.map