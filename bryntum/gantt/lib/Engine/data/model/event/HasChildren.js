var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate } from "../../../../ChronoGraph/replica/Entity.js";
import { bucket, reference } from "../../../../ChronoGraph/replica/Reference.js";
import { MAX_DATE, MIN_DATE } from "../../../util/Constants.js";
export const HasChildren = (base) => {
    class HasChildren extends base {
        *hasSubEvents() {
            const childEvents = yield this.$.childEvents;
            return childEvents.size > 0;
        }
        *subEventsIterable() {
            return yield this.$.childEvents;
        }
        *calculateStartDatePure() {
            const hasSubEvents = yield* this.hasSubEvents();
            if (hasSubEvents) {
                return yield* this.calculateMinChildrenStartDate();
            }
            else {
                return yield* super.calculateStartDatePure();
            }
        }
        *calculateEndDatePure() {
            const hasSubEvents = yield* this.hasSubEvents();
            if (hasSubEvents) {
                return yield* this.calculateMaxChildrenEndDate();
            }
            else {
                return yield* super.calculateEndDatePure();
            }
        }
        *calculateStartDateProposed() {
            const hasSubEvents = yield* this.hasSubEvents();
            if (hasSubEvents) {
                return yield* this.calculateStartDatePure();
            }
            else {
                return yield* super.calculateStartDateProposed();
            }
        }
        *calculateEndDateProposed() {
            const hasSubEvents = yield* this.hasSubEvents();
            if (hasSubEvents) {
                return yield* this.calculateEndDatePure();
            }
            else {
                return yield* super.calculateEndDateProposed();
            }
        }
        *calculateDurationProposed() {
            const hasSubEvents = yield* this.hasSubEvents();
            if (hasSubEvents) {
                return yield* this.calculateDurationPure();
            }
            else {
                return yield* super.calculateDurationProposed();
            }
        }
        *calculateMinChildrenStartDate() {
            const subEvents = yield* this.subEventsIterable();
            const subStartDates = [];
            for (const subEvent of subEvents) {
                subStartDates.push(yield subEvent.$.startDate);
            }
            let timestamp = subStartDates.reduce((acc, subStartDate) => subStartDate ? Math.min(acc, subStartDate.getTime()) : acc, MAX_DATE.getTime());
            if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime())
                return null;
            return new Date(timestamp);
        }
        *calculateMaxChildrenEndDate() {
            const subEvents = yield* this.subEventsIterable();
            const subEndDates = [];
            for (const subEvent of subEvents) {
                subEndDates.push(yield subEvent.$.endDate);
            }
            let timestamp = subEndDates.reduce((acc, subEndDate) => subEndDate ? Math.max(acc, subEndDate.getTime()) : acc, MIN_DATE.getTime());
            if (timestamp === MIN_DATE.getTime() || timestamp === MAX_DATE.getTime())
                return null;
            return new Date(timestamp);
        }
        get parent() {
            return this._parent;
        }
        set parent(value) {
            this._parent = value;
            this.$.parentEvent.put(value);
        }
        *maybeSkipNonWorkingTime(date, isForward = true) {
            const childEvents = yield this.$.childEvents;
            if (childEvents.size > 0)
                return date;
            return yield* super.maybeSkipNonWorkingTime(date, isForward);
        }
        *calculateStartDateConstraintIntervals() {
            const intervals = yield* super.calculateStartDateConstraintIntervals();
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.startDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateEndDateConstraintIntervals() {
            const intervals = yield* super.calculateEndDateConstraintIntervals();
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.endDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateEarlyStartDateConstraintIntervals() {
            const intervals = yield* super.calculateEarlyStartDateConstraintIntervals();
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.earlyStartDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateEarlyEndDateConstraintIntervals() {
            const intervals = yield* super.calculateEarlyEndDateConstraintIntervals();
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.earlyEndDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateEarlyStartDateRaw() {
            const childEvents = yield this.$.childEvents;
            let result;
            if (childEvents.size) {
                result = MAX_DATE;
                for (let childEvent of childEvents) {
                    const childDate = yield childEvent.$.earlyStartDateRaw;
                    if (childDate && childDate < result)
                        result = childDate;
                }
                result = result.getTime() !== MAX_DATE.getTime() ? result : null;
            }
            else {
                result = yield* super.calculateEarlyStartDateRaw();
            }
            return result;
        }
        *calculateEarlyEndDateRaw() {
            const childEvents = yield this.$.childEvents;
            let result;
            if (childEvents.size) {
                result = MIN_DATE;
                for (let childEvent of childEvents) {
                    const childDate = yield childEvent.$.earlyEndDateRaw;
                    if (childDate && childDate > result)
                        result = childDate;
                }
                result = result.getTime() !== MIN_DATE.getTime() ? result : null;
            }
            else {
                result = yield* super.calculateEarlyEndDateRaw();
            }
            return result;
        }
    }
    __decorate([
        reference({ bucket: 'childEvents' })
    ], HasChildren.prototype, "parentEvent", void 0);
    __decorate([
        bucket()
    ], HasChildren.prototype, "childEvents", void 0);
    __decorate([
        calculate('startDateConstraintIntervals')
    ], HasChildren.prototype, "calculateStartDateConstraintIntervals", null);
    __decorate([
        calculate('endDateConstraintIntervals')
    ], HasChildren.prototype, "calculateEndDateConstraintIntervals", null);
    __decorate([
        calculate('earlyStartDateConstraintIntervals')
    ], HasChildren.prototype, "calculateEarlyStartDateConstraintIntervals", null);
    __decorate([
        calculate('earlyEndDateConstraintIntervals')
    ], HasChildren.prototype, "calculateEarlyEndDateConstraintIntervals", null);
    __decorate([
        calculate('earlyStartDateRaw')
    ], HasChildren.prototype, "calculateEarlyStartDateRaw", null);
    __decorate([
        calculate('earlyEndDateRaw')
    ], HasChildren.prototype, "calculateEarlyEndDateRaw", null);
    return HasChildren;
};
//# sourceMappingURL=HasChildren.js.map