var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate } from "../../../../ChronoGraph/replica/Entity.js";
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js";
import { DateInterval } from "../../../scheduling/DateInterval.js";
import { ConstraintType, Direction } from "../../../scheduling/Types.js";
export const HasDateConstraint = (base) => {
    class HasDateConstraint extends base {
        putStartDate(date, keepDuration = true) {
            const isVeryInitialAssignment = this.$.startDate.getProposedOrPreviousValue() === undefined;
            const project = this.getProject();
            if (!isVeryInitialAssignment && !(project && project.getStm().isRestoring)) {
                const constrainType = this.getStartDatePinConstraintType();
                if (constrainType) {
                    this.constraintType = constrainType;
                    this.constraintDate = date;
                }
            }
            return super.putStartDate(date, keepDuration);
        }
        putEndDate(date, keepDuration = false) {
            const isVeryInitialAssignment = this.$.endDate.getProposedOrPreviousValue() === undefined;
            const project = this.getProject();
            if (!isVeryInitialAssignment && keepDuration && !(project && project.getStm().isRestoring)) {
                const constrainType = this.getEndDatePinConstraintType();
                if (constrainType) {
                    this.constraintType = constrainType;
                    this.constraintDate = date;
                }
            }
            return super.putEndDate(date, keepDuration);
        }
        *calculateConstraintType() {
            let constraintType = this.$.constraintType.getProposedOrPreviousValue();
            if (!(yield* this.isConstraintTypeApplicable(constraintType))) {
                constraintType = null;
            }
            return constraintType;
        }
        *calculateConstraintDate(Y) {
            let constraintDate = this.$.constraintDate.getProposedOrPreviousValue();
            const constraintType = yield this.$.constraintType;
            if (!constraintType) {
                constraintDate = null;
            }
            else if (!constraintDate) {
                constraintDate = this.getConstraintTypeDefaultDate(Y, constraintType);
            }
            return constraintDate;
        }
        getStartDatePinConstraintType() {
            const { direction } = this;
            if (!this.isTaskPinnableWithConstraint())
                return null;
            switch (direction) {
                case Direction.Forward: return ConstraintType.StartNoEarlierThan;
                case Direction.Backward: return ConstraintType.FinishNoLaterThan;
            }
        }
        getEndDatePinConstraintType() {
            const { direction } = this;
            if (!this.isTaskPinnableWithConstraint())
                return null;
            switch (direction) {
                case Direction.Forward: return ConstraintType.FinishNoEarlierThan;
                case Direction.Backward: return ConstraintType.FinishNoLaterThan;
            }
        }
        isTaskPinnableWithConstraint() {
            const { manuallyScheduled, constraintType } = this;
            let result = false;
            if (!manuallyScheduled) {
                if (constraintType) {
                    switch (constraintType) {
                        case ConstraintType.StartNoEarlierThan:
                        case ConstraintType.FinishNoEarlierThan:
                            result = true;
                    }
                }
                else {
                    result = true;
                }
            }
            return result;
        }
        getConstraintTypeDefaultDate(Y, constraintType) {
            switch (constraintType) {
                case ConstraintType.StartNoEarlierThan:
                case ConstraintType.StartNoLaterThan:
                case ConstraintType.MustStartOn:
                    return this.$.startDate.getProposedOrPreviousValue();
                case ConstraintType.FinishNoEarlierThan:
                case ConstraintType.FinishNoLaterThan:
                case ConstraintType.MustFinishOn:
                    return this.$.endDate.getProposedOrPreviousValue();
            }
            return null;
        }
        *isConstraintTypeApplicable(constraintType) {
            const childEvents = yield this.$.childEvents;
            const isSummary = childEvents.size > 0;
            switch (constraintType) {
                case ConstraintType.FinishNoEarlierThan:
                case ConstraintType.StartNoLaterThan:
                case ConstraintType.MustFinishOn:
                case ConstraintType.MustStartOn:
                    return !isSummary;
            }
            return true;
        }
        async setConstraint(constraintType, constraintDate) {
            this.constraintType = constraintType;
            if (constraintDate !== undefined) {
                this.constraintDate = constraintDate;
            }
            return this.propagate();
        }
        *calculateEndDateConstraintIntervals() {
            const intervals = yield* super.calculateEndDateConstraintIntervals();
            const constraintType = yield this.$.constraintType;
            const constraintDate = yield this.$.constraintDate;
            if (constraintType && constraintDate) {
                switch (constraintType) {
                    case ConstraintType.MustFinishOn:
                        intervals.unshift(DateInterval.new({
                            startDate: constraintDate,
                            endDate: constraintDate
                        }));
                        break;
                    case ConstraintType.FinishNoEarlierThan:
                        intervals.unshift(DateInterval.new({
                            startDate: constraintDate
                        }));
                        break;
                    case ConstraintType.FinishNoLaterThan:
                        intervals.unshift(DateInterval.new({
                            endDate: constraintDate
                        }));
                        break;
                }
            }
            return intervals;
        }
        *calculateStartDateConstraintIntervals() {
            const intervals = yield* super.calculateStartDateConstraintIntervals();
            const constraintType = yield this.$.constraintType;
            const constraintDate = yield this.$.constraintDate;
            if (constraintType && constraintDate) {
                switch (constraintType) {
                    case ConstraintType.MustStartOn:
                        intervals.unshift(DateInterval.new({
                            startDate: constraintDate,
                            endDate: constraintDate
                        }));
                        break;
                    case ConstraintType.StartNoEarlierThan:
                        intervals.unshift(DateInterval.new({
                            startDate: constraintDate
                        }));
                        break;
                    case ConstraintType.StartNoLaterThan:
                        intervals.unshift(DateInterval.new({
                            endDate: constraintDate
                        }));
                        break;
                }
            }
            return intervals;
        }
    }
    __decorate([
        model_field({ type: 'string' })
    ], HasDateConstraint.prototype, "constraintType", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ' }, { converter: dateConverter })
    ], HasDateConstraint.prototype, "constraintDate", void 0);
    __decorate([
        calculate('constraintType')
    ], HasDateConstraint.prototype, "calculateConstraintType", null);
    __decorate([
        calculate('constraintDate')
    ], HasDateConstraint.prototype, "calculateConstraintDate", null);
    return HasDateConstraint;
};
//# sourceMappingURL=HasDateConstraint.js.map