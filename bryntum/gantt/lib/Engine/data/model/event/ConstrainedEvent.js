var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PromiseEffect } from "../../../../ChronoGraph/chrono/Effect.js";
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js";
import { Conflict, ConflictResolution } from "../../../chrono/Conflict.js";
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js";
import { DateInterval, EMPTY_INTERVAL, intersectIntervals } from "../../../scheduling/DateInterval.js";
import { isDateFinite } from "../../../util/Constants.js";
import { Direction } from "../../../scheduling/Types.js";
export class ConstraintInterval extends DateInterval {
    toString() {
        return `from ${this.startDate} till ${this.endDate}`;
    }
}
export class RemoveConstrainingInterval extends ConflictResolution {
    get originDescription() {
        return this.interval.originDescription;
    }
    resolve() {
        if (!this.interval)
            throw new Error("Can't use this resolution option - no constraint interval available");
        if (!this.interval.onRemoveAction)
            throw new Error("Can't use this resolution option - no `onRemoveAction` available");
        this.interval.onRemoveAction();
    }
}
export class IntervalConflict extends Conflict {
    get description() {
        return `The change causes scheduling conflict with the constraining interval ${this.conflictingInterval},
which is created by the ${this.conflictingInterval.originDescription}`;
    }
    get resolutions() {
        const resolutions = [];
        if (this.conflictingInterval.onRemoveAction)
            resolutions.push(RemoveConstrainingInterval.new({ interval: this.conflictingInterval }));
        Object.defineProperty(this, 'resolutions', { value: resolutions });
        return resolutions;
    }
}
export class ProposedDateOutsideOfConstraint extends IntervalConflict {
    get description() {
        return `The date ${this.proposedDate} is outside of the constraining interval ${this.conflictingInterval},
which is created by the ${this.conflictingInterval.originDescription}`;
    }
}
export const calculateEffectiveStartDateConstraintInterval = function* (event, startDateIntervalIntersection, endDateIntervalIntersection, duration) {
    if (endDateIntervalIntersection.isIntervalEmpty())
        return EMPTY_INTERVAL;
    const startDate = endDateIntervalIntersection.startDateIsFinite()
        ?
            yield* event.calculateProjectedXDateWithDuration(endDateIntervalIntersection.startDate, false, duration)
        :
            null;
    const endDate = endDateIntervalIntersection.endDateIsFinite()
        ?
            yield* event.calculateProjectedXDateWithDuration(endDateIntervalIntersection.endDate, false, duration)
        :
            null;
    return intersectIntervals([startDateIntervalIntersection, DateInterval.new({ startDate, endDate })]);
};
export const calculateEffectiveEndDateConstraintInterval = function* (event, startDateIntervalIntersection, endDateIntervalIntersection, duration) {
    if (startDateIntervalIntersection.isIntervalEmpty())
        return EMPTY_INTERVAL;
    const startDate = startDateIntervalIntersection.startDateIsFinite()
        ?
            yield* event.calculateProjectedXDateWithDuration(startDateIntervalIntersection.startDate, true, duration)
        :
            null;
    const endDate = startDateIntervalIntersection.endDateIsFinite()
        ?
            yield* event.calculateProjectedXDateWithDuration(startDateIntervalIntersection.endDate, true, duration)
        :
            null;
    return intersectIntervals([endDateIntervalIntersection, DateInterval.new({ startDate, endDate })]);
};
export const ConstrainedEvent = (base) => {
    class ConstrainedEvent extends base {
        async setManuallyScheduled(mode) {
            this.$.manuallyScheduled.put(mode);
            return this.propagate();
        }
        *maybeSkipNonWorkingTime(date, isForward = true) {
            let duration = yield* this.calculateEffectiveDuration();
            return date && duration > 0 ? yield* this.skipNonWorkingTime(date, isForward) : date;
        }
        *calculateEffectiveConstraintInterval(isStartDate, startDateConstraintIntervals, endDateConstraintIntervals) {
            const effectiveDurationToUse = yield* this.calculateEffectiveDuration();
            if (effectiveDurationToUse === null) {
                return null;
            }
            const calculateIntervalFn = (isStartDate ? calculateEffectiveStartDateConstraintInterval : calculateEffectiveEndDateConstraintInterval);
            const effectiveInterval = yield* calculateIntervalFn(this, intersectIntervals(startDateConstraintIntervals), intersectIntervals(endDateConstraintIntervals), effectiveDurationToUse);
            return effectiveInterval;
        }
        *calculateStartDateConstraintIntervals() {
            return [];
        }
        *calculateEndDateConstraintIntervals() {
            return [];
        }
        *calculateEarlyStartDateConstraintIntervals() {
            return [];
        }
        *calculateEarlyEndDateConstraintIntervals() {
            return [];
        }
        *calculateEarlyStartDateRaw() {
            if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                return yield this.$.startDate;
            }
            const startDateConstraintIntervals = yield this.$.earlyStartDateConstraintIntervals;
            const endDateConstraintIntervals = yield this.$.earlyEndDateConstraintIntervals;
            const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(true, startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals), endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals)));
            if (!effectiveInterval)
                return null;
            if (effectiveInterval.isIntervalEmpty()) {
                if (this.$.startDate.value === undefined) {
                    yield PromiseEffect.new({ promise: Promise.resolve() });
                    return null;
                }
                yield Conflict.new();
            }
            if (!isDateFinite(effectiveInterval.startDate))
                return null;
            return effectiveInterval.startDate;
        }
        *calculateEarlyStartDate() {
            const date = yield this.$.earlyStartDateRaw;
            return yield* this.maybeSkipNonWorkingTime(date, true);
        }
        *calculateEarlyEndDateRaw() {
            if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                return yield this.$.endDate;
            }
            const startDateConstraintIntervals = yield this.$.earlyStartDateConstraintIntervals;
            const endDateConstraintIntervals = yield this.$.earlyEndDateConstraintIntervals;
            const effectiveInterval = (yield* this.calculateEffectiveConstraintInterval(false, startDateConstraintIntervals.concat(yield this.$.startDateConstraintIntervals), endDateConstraintIntervals.concat(yield this.$.endDateConstraintIntervals)));
            if (!effectiveInterval)
                return null;
            if (effectiveInterval.isIntervalEmpty()) {
                if (this.$.endDate.value === undefined) {
                    yield PromiseEffect.new({ promise: Promise.resolve() });
                    return null;
                }
                yield Conflict.new();
            }
            if (!isDateFinite(effectiveInterval.startDate))
                return null;
            return effectiveInterval.startDate;
        }
        *calculateEarlyEndDate() {
            const date = yield this.$.earlyEndDateRaw;
            return yield* this.maybeSkipNonWorkingTime(date, false);
        }
        *isConstrainedEarly() {
            const startDateIntervals = yield this.$.startDateConstraintIntervals;
            const endDateIntervals = yield this.$.endDateConstraintIntervals;
            const earlyStartDateConstraintIntervals = yield this.$.earlyStartDateConstraintIntervals;
            const earlyEndDateConstraintIntervals = yield this.$.earlyEndDateConstraintIntervals;
            return Boolean(startDateIntervals.length || endDateIntervals.length || earlyStartDateConstraintIntervals.length || earlyEndDateConstraintIntervals.length);
        }
        *calculateStartDatePure() {
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateStartDatePure();
                }
                return (yield this.$.earlyStartDate) || (yield* super.calculateStartDatePure());
            }
            else {
                return yield* super.calculateStartDatePure();
            }
        }
        *calculateStartDateProposed() {
            const direction = yield this.$.direction;
            switch (direction) {
                case Direction.Forward:
                    if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateStartDateProposed();
                    }
                    return (yield this.$.earlyStartDate) || (yield* super.calculateStartDateProposed());
                default:
                    return yield* super.calculateStartDateProposed();
            }
        }
        *calculateEndDatePure() {
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                    return yield* super.calculateEndDatePure();
                }
                return (yield this.$.earlyEndDate) || (yield* super.calculateEndDatePure());
            }
            else {
                return yield* super.calculateEndDatePure();
            }
        }
        *calculateEndDateProposed() {
            const direction = yield this.$.direction;
            switch (direction) {
                case Direction.Forward:
                    if (!(yield* this.isConstrainedEarly()) || (yield this.$.manuallyScheduled)) {
                        return yield* super.calculateEndDateProposed();
                    }
                    return (yield this.$.earlyEndDate) || (yield* super.calculateEndDateProposed());
                default:
                    return yield* super.calculateEndDateProposed();
            }
        }
    }
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "earlyStartDateRaw", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ', persist: false }, { converter: dateConverter, persistent: false })
    ], ConstrainedEvent.prototype, "earlyStartDate", void 0);
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "earlyEndDateRaw", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ', persist: false }, { converter: dateConverter, persistent: false })
    ], ConstrainedEvent.prototype, "earlyEndDate", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: false })
    ], ConstrainedEvent.prototype, "manuallyScheduled", void 0);
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "startDateConstraintIntervals", void 0);
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "earlyStartDateConstraintIntervals", void 0);
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "endDateConstraintIntervals", void 0);
    __decorate([
        field()
    ], ConstrainedEvent.prototype, "earlyEndDateConstraintIntervals", void 0);
    __decorate([
        calculate('startDateConstraintIntervals')
    ], ConstrainedEvent.prototype, "calculateStartDateConstraintIntervals", null);
    __decorate([
        calculate('endDateConstraintIntervals')
    ], ConstrainedEvent.prototype, "calculateEndDateConstraintIntervals", null);
    __decorate([
        calculate('earlyStartDateConstraintIntervals')
    ], ConstrainedEvent.prototype, "calculateEarlyStartDateConstraintIntervals", null);
    __decorate([
        calculate('earlyEndDateConstraintIntervals')
    ], ConstrainedEvent.prototype, "calculateEarlyEndDateConstraintIntervals", null);
    __decorate([
        calculate('earlyStartDateRaw')
    ], ConstrainedEvent.prototype, "calculateEarlyStartDateRaw", null);
    __decorate([
        calculate('earlyStartDate')
    ], ConstrainedEvent.prototype, "calculateEarlyStartDate", null);
    __decorate([
        calculate('earlyEndDateRaw')
    ], ConstrainedEvent.prototype, "calculateEarlyEndDateRaw", null);
    __decorate([
        calculate('earlyEndDate')
    ], ConstrainedEvent.prototype, "calculateEarlyEndDate", null);
    return ConstrainedEvent;
};
//# sourceMappingURL=ConstrainedEvent.js.map