import { Base } from '../../ChronoGraph/class/Mixin.js';
import { MAX_DATE, MIN_DATE } from '../util/Constants.js';
import { EdgeInclusion } from "../util/Types.js";
export class DateInterval extends Base {
    initialize(...args) {
        super.initialize(...args);
        if (!this.startDate)
            this.startDate = MIN_DATE;
        if (!this.endDate)
            this.endDate = MAX_DATE;
    }
    startDateIsFinite() {
        return !this.isIntervalEmpty() && this.startDate.getTime() !== MIN_DATE.getTime();
    }
    endDateIsFinite() {
        return !this.isIntervalEmpty() && this.endDate.getTime() !== MAX_DATE.getTime();
    }
    containsDate(date, edgeInclusion = EdgeInclusion.Left) {
        return ((edgeInclusion === EdgeInclusion.Left && (date >= this.startDate && date < this.endDate))
            ||
                (edgeInclusion === EdgeInclusion.Right && (date > this.startDate && date <= this.endDate)));
    }
    isIntervalEmpty() {
        return this.startDate > this.endDate;
    }
    intersect(another) {
        const anotherStart = another.startDate;
        const anotherEnd = another.endDate;
        const start = this.startDate;
        const end = this.endDate;
        if ((end < anotherStart) || (start > anotherEnd)) {
            return EMPTY_INTERVAL;
        }
        const newStart = new Date(Math.max(start.getTime(), anotherStart.getTime()));
        const newEnd = new Date(Math.min(end.getTime(), anotherEnd.getTime()));
        return this.constructor.new({ startDate: newStart, endDate: newEnd });
    }
}
export const EMPTY_INTERVAL = DateInterval.new({ startDate: MAX_DATE, endDate: MIN_DATE });
export const intersectIntervals = (dateIntervals) => {
    return dateIntervals.reduce((acc, currentInterval) => acc.intersect(currentInterval), DateInterval.new());
};
//# sourceMappingURL=DateInterval.js.map