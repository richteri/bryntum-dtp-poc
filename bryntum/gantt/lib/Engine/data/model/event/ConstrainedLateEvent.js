var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js";
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js";
import { Direction, TimeUnit } from "../../../scheduling/Types.js";
import { isDateFinite, MAX_DATE, MIN_DATE } from "../../../util/Constants.js";
import DateHelper from "../../../../Core/helper/DateHelper.js";
export const ConstrainedLateEvent = (base) => {
    class ConstrainedLateEvent extends base {
        *calculateLateStartDateConstraintIntervals() {
            const intervals = [];
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.lateStartDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateLateEndDateConstraintIntervals() {
            const intervals = [];
            const parentEvent = yield this.$.parentEvent;
            if (parentEvent) {
                const parentIntervals = yield parentEvent.$.lateEndDateConstraintIntervals;
                intervals.push.apply(intervals, parentIntervals);
            }
            return intervals;
        }
        *calculateLateStartDateRaw() {
            const childEvents = yield this.$.childEvents;
            let result;
            if (childEvents.size) {
                result = MAX_DATE;
                for (let childEvent of childEvents) {
                    const childDate = yield childEvent.$.lateStartDateRaw;
                    if (childDate && childDate < result)
                        result = childDate;
                }
                result = result.getTime() - MAX_DATE.getTime() ? result : null;
            }
            else {
                if (!(yield* this.isConstrainedLate())) {
                    return yield this.$.startDate;
                }
                const startDateConstraintIntervals = yield this.$.lateStartDateConstraintIntervals;
                const endDateConstraintIntervals = yield this.$.lateEndDateConstraintIntervals;
                const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(true, startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals), endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals)));
                if (!effectiveInterval || !isDateFinite(effectiveInterval.endDate))
                    return null;
                result = effectiveInterval.endDate;
            }
            return result;
        }
        *calculateLateStartDate() {
            const date = yield this.$.lateStartDateRaw;
            return yield* this.maybeSkipNonWorkingTime(date, true);
        }
        *calculateLateEndDateRaw() {
            const childEvents = yield this.$.childEvents;
            let result;
            if (childEvents.size) {
                result = MIN_DATE;
                for (let childEvent of childEvents) {
                    const childDate = yield childEvent.$.lateEndDateRaw;
                    if (childDate && childDate > result)
                        result = childDate;
                }
                result = result.getTime() - MIN_DATE.getTime() ? result : null;
            }
            else {
                if (!(yield* this.isConstrainedLate())) {
                    return yield this.$.endDate;
                }
                const startDateConstraintIntervals = yield this.$.lateStartDateConstraintIntervals;
                const endDateConstraintIntervals = yield this.$.lateEndDateConstraintIntervals;
                const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(false, startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals), endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals)));
                if (!effectiveInterval || !isDateFinite(effectiveInterval.endDate))
                    return null;
                result = effectiveInterval.endDate;
            }
            return result;
        }
        *calculateLateEndDate() {
            const date = yield this.$.lateEndDateRaw;
            return yield* this.maybeSkipNonWorkingTime(date, false);
        }
        *calculateTotalSlack() {
            const earlyStartDate = yield this.$.earlyStartDateRaw;
            const lateStartDate = yield this.$.lateStartDateRaw;
            const earlyEndDate = yield this.$.earlyEndDateRaw;
            const lateEndDate = yield this.$.lateEndDateRaw;
            const slackUnit = yield this.$.slackUnit;
            let endSlack, result;
            const isByEarly = earlyStartDate && lateStartDate && isDateFinite(earlyStartDate) && isDateFinite(lateStartDate);
            const isByLate = earlyEndDate && lateEndDate && isDateFinite(earlyEndDate) && isDateFinite(lateEndDate);
            if (isByEarly || isByLate) {
                if (isByEarly) {
                    result = yield* this.calculateProjectedDuration(earlyStartDate, lateStartDate, slackUnit);
                    if (isByLate) {
                        endSlack = yield* this.calculateProjectedDuration(earlyEndDate, lateEndDate, slackUnit);
                        if (endSlack < result)
                            result = endSlack;
                    }
                }
                else if (isByLate) {
                    result = yield* this.calculateProjectedDuration(earlyEndDate, lateEndDate, slackUnit);
                }
            }
            return result;
        }
        *calculateCritical() {
            const totalSlack = yield this.$.totalSlack;
            return totalSlack <= 0;
        }
        *isConstrainedLate() {
            const startDateIntervals = yield this.$.startDateConstraintIntervals;
            const endDateIntervals = yield this.$.endDateConstraintIntervals;
            const lateStartDateConstraintIntervals = yield this.$.lateStartDateConstraintIntervals;
            const lateEndDateConstraintIntervals = yield this.$.lateEndDateConstraintIntervals;
            return Boolean(startDateIntervals.length || endDateIntervals.length || lateStartDateConstraintIntervals.length || lateEndDateConstraintIntervals.length);
        }
        *calculateStartDatePure() {
            const direction = yield this.$.direction;
            if (direction === Direction.Backward) {
                if (!(yield* this.isConstrainedLate()) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateStartDatePure();
                }
                return yield this.$.lateStartDate;
            }
            else {
                return yield* super.calculateStartDatePure();
            }
        }
        *calculateStartDateProposed() {
            const direction = yield this.$.direction;
            switch (direction) {
                case Direction.Backward:
                    if (!(yield* this.isConstrainedLate()) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateStartDateProposed();
                    }
                    return yield* this.calculateStartDatePure();
                default:
                    return yield* super.calculateStartDateProposed();
            }
        }
        *calculateEndDatePure() {
            const direction = yield this.$.direction;
            if (direction === Direction.Backward) {
                if (!(yield* this.isConstrainedLate()) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateEndDatePure();
                }
                return yield this.$.lateEndDate;
            }
            else {
                return yield* super.calculateEndDatePure();
            }
        }
        *calculateEndDateProposed() {
            const direction = yield this.$.direction;
            switch (direction) {
                case Direction.Backward:
                    if (!(yield* this.isConstrainedLate()) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateEndDateProposed();
                    }
                    return yield* this.calculateEndDatePure();
                default:
                    return yield* super.calculateEndDateProposed();
            }
        }
    }
    __decorate([
        field()
    ], ConstrainedLateEvent.prototype, "lateStartDateRaw", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ', persist: false }, { converter: dateConverter, persistent: false })
    ], ConstrainedLateEvent.prototype, "lateStartDate", void 0);
    __decorate([
        field()
    ], ConstrainedLateEvent.prototype, "lateEndDateRaw", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ', persist: false }, { converter: dateConverter, persistent: false })
    ], ConstrainedLateEvent.prototype, "lateEndDate", void 0);
    __decorate([
        field()
    ], ConstrainedLateEvent.prototype, "lateStartDateConstraintIntervals", void 0);
    __decorate([
        field()
    ], ConstrainedLateEvent.prototype, "lateEndDateConstraintIntervals", void 0);
    __decorate([
        model_field({ type: 'number', persist: false }, { persistent: false })
    ], ConstrainedLateEvent.prototype, "totalSlack", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: TimeUnit.Day, persist: false }, { converter: DateHelper.normalizeUnit, persistent: false })
    ], ConstrainedLateEvent.prototype, "slackUnit", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: false, persist: false }, { persistent: false })
    ], ConstrainedLateEvent.prototype, "critical", void 0);
    __decorate([
        calculate('lateStartDateConstraintIntervals')
    ], ConstrainedLateEvent.prototype, "calculateLateStartDateConstraintIntervals", null);
    __decorate([
        calculate('lateEndDateConstraintIntervals')
    ], ConstrainedLateEvent.prototype, "calculateLateEndDateConstraintIntervals", null);
    __decorate([
        calculate('lateStartDateRaw')
    ], ConstrainedLateEvent.prototype, "calculateLateStartDateRaw", null);
    __decorate([
        calculate('lateStartDate')
    ], ConstrainedLateEvent.prototype, "calculateLateStartDate", null);
    __decorate([
        calculate('lateEndDateRaw')
    ], ConstrainedLateEvent.prototype, "calculateLateEndDateRaw", null);
    __decorate([
        calculate('lateEndDate')
    ], ConstrainedLateEvent.prototype, "calculateLateEndDate", null);
    __decorate([
        calculate('totalSlack')
    ], ConstrainedLateEvent.prototype, "calculateTotalSlack", null);
    __decorate([
        calculate('critical')
    ], ConstrainedLateEvent.prototype, "calculateCritical", null);
    return ConstrainedLateEvent;
};
//# sourceMappingURL=ConstrainedLateEvent.js.map