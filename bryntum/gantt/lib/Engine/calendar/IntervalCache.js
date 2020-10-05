import { MAX_DATE, MIN_DATE } from "../util/Constants.js";
import { IndexPosition, SortedMap } from "./SortedMap.js";
export var EdgeInclusion;
(function (EdgeInclusion) {
    EdgeInclusion[EdgeInclusion["Left"] = 0] = "Left";
    EdgeInclusion[EdgeInclusion["Right"] = 1] = "Right";
})(EdgeInclusion || (EdgeInclusion = {}));
export class IntervalCache {
    constructor(config) {
        this.points = new SortedMap((a, b) => a.getTime() - b.getTime());
        this.leftInfinityKey = MIN_DATE;
        this.rightInfinityKey = MAX_DATE;
        Object.assign(this, config);
        if (this.emptyInterval === undefined || !this.combineIntervalsFn)
            throw new Error("All of `emptyPoint`, `combineIntervalsFn` are required");
        this.points.set(this.leftInfinityKey, this.emptyInterval);
    }
    size() {
        return this.points.size();
    }
    indexOf(date) {
        return this.points.indexOfKey(date);
    }
    getDateAt(index) {
        return this.points.getKeyAt(index);
    }
    getPointAt(index) {
        return this.points.getValueAt(index);
    }
    getIntervalOf(date, edgeInclusion = EdgeInclusion.Left) {
        let { found, index } = this.indexOf(date);
        let startDateIndex;
        if (edgeInclusion === EdgeInclusion.Left) {
            startDateIndex = found === IndexPosition.Exact ? index : index - 1;
        }
        else {
            startDateIndex = index - 1;
        }
        return this.getIntervalWithStartDateIndex(startDateIndex);
    }
    getPrevInterval(interval) {
        if (interval.startDateIndex === 0)
            return null;
        return this.getIntervalWithStartDateIndex(interval.startDateIndex - 1);
    }
    getNextInterval(interval) {
        if (interval.startDateIndex >= this.size() - 1)
            return null;
        return this.getIntervalWithStartDateIndex(interval.startDateIndex + 1);
    }
    getIntervalWithStartDateIndex(startDateIndex) {
        return {
            startDateIndex: startDateIndex,
            startDate: this.getDateAt(startDateIndex),
            endDate: startDateIndex + 1 < this.size() ? this.getDateAt(startDateIndex + 1) : this.rightInfinityKey,
            cacheInterval: this.getPointAt(startDateIndex)
        };
    }
    addInterval(startDate, endDate, extendInterval) {
        const points = this.points;
        const { found, index } = points.indexOfKey(startDate);
        let curIndex;
        let lastUpdatedPoint;
        if (found == IndexPosition.Exact) {
            const inclusion = extendInterval(lastUpdatedPoint = points.getValueAt(index));
            points.setValueAt(index, inclusion);
            curIndex = index + 1;
        }
        else {
            const inclusion = extendInterval(lastUpdatedPoint = points.getValueAt(index - 1));
            points.insertAt(index, startDate, inclusion);
            curIndex = index + 1;
        }
        while (curIndex < points.size()) {
            const curDate = points.getKeyAt(curIndex);
            if (curDate.getTime() >= endDate.getTime())
                break;
            const inclusion = extendInterval(lastUpdatedPoint = points.getValueAt(curIndex));
            points.setValueAt(curIndex, inclusion);
            curIndex++;
        }
        if (curIndex === points.size()) {
            points.insertAt(points.size(), endDate, this.emptyInterval);
        }
        else {
            const curDate = points.getKeyAt(curIndex);
            if (curDate.getTime() === endDate.getTime()) {
            }
            else {
                points.insertAt(curIndex, endDate, lastUpdatedPoint);
            }
        }
    }
    includeWrappingRange(intervalCache, startDate, endDate) {
        let interval = intervalCache.getIntervalOf(startDate);
        while (interval) {
            this.addInterval(interval.startDate, interval.endDate, existingInterval => this.combineIntervalsFn(existingInterval, interval.cacheInterval));
            if (interval.endDate.getTime() > endDate.getTime())
                break;
            interval = intervalCache.getNextInterval(interval);
        }
    }
    getSummary() {
        return this.points.map((label, date) => { return { label, date }; });
    }
    clear() {
        this.points.clear();
        this.points.set(this.leftInfinityKey, this.emptyInterval);
    }
}
//# sourceMappingURL=IntervalCache.js.map