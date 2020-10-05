var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CalculateProposed } from "../../../../ChronoGraph/cycle_resolver/CycleResolver.js";
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js";
import { model_field } from "../../../chrono/ModelFieldAtom.js";
import { SchedulingMode } from "../../../scheduling/Types.js";
import { durationFormula, DurationVar, EndDateVar, StartDateVar } from "./BaseEventDispatcher.js";
import { effortFormula, EffortVar, endDateByEffortFormula, SEDWUDispatcher, SEDWUDispatcherIdentifier, startDateByEffortFormula, unitsFormula, UnitsVar } from "./HasEffortDispatcher.js";
export const HasSchedulingMode = (base) => {
    class HasSchedulingMode extends base {
        *prepareDispatcher() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                const cycleDispatcher = yield* super.prepareDispatcher();
                cycleDispatcher.collectInfo(this.$.effort, EffortVar);
                if (yield* this.hasProposedValueForUnits())
                    cycleDispatcher.addProposedValueFlag(UnitsVar);
                cycleDispatcher.addPreviousValueFlag(UnitsVar);
                return cycleDispatcher;
            }
            else {
                return yield* super.prepareDispatcher();
            }
        }
        *dispatcherClass() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                return SEDWUDispatcher;
            }
            else {
                return yield* super.dispatcherClass();
            }
        }
        buildProposedDispatcher() {
            const dispatcher = super.buildProposedDispatcher();
            dispatcher.addPreviousValueFlag(EffortVar);
            dispatcher.addPreviousValueFlag(UnitsVar);
            return dispatcher;
        }
        *calculateAssignmentUnits(assignment) {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch = yield this.$.dispatcher;
                const formulaId = dispatch.resolution.get(UnitsVar);
                if (formulaId === CalculateProposed) {
                    return yield* this.calculateAssignmentUnitsProposed(assignment);
                }
                else if (formulaId === unitsFormula.formulaId) {
                    return yield* this.calculateAssignmentUnitsPure(assignment);
                }
                else {
                    throw new Error("Unknown formula for `units`");
                }
            }
            else {
                return yield* super.calculateAssignmentUnits(assignment);
            }
        }
        putEffort(effort, unit) {
            const isVeryFirstAssignment = this.$.effort.getProposedOrPreviousValue() === undefined;
            if (effort == null && isVeryFirstAssignment)
                return super.putEffort(effort, unit);
            if (this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.endDate);
                this.markAsNeedRecalculation(this.$.duration);
                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units));
            }
            super.putEffort(effort, unit);
        }
        putStartDate(date, keepDuration = true) {
            const isVeryFirstAssignment = this.$.startDate.getProposedOrPreviousValue() === undefined;
            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.endDate);
                this.markAsNeedRecalculation(this.$.duration);
                this.markAsNeedRecalculation(this.$.effort);
                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units));
            }
            super.putStartDate(date, keepDuration);
        }
        putEndDate(date, keepDuration = false) {
            const isVeryFirstAssignment = this.$.endDate.getProposedOrPreviousValue() === undefined;
            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.endDate);
                this.markAsNeedRecalculation(this.$.duration);
                this.markAsNeedRecalculation(this.$.effort);
                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units));
            }
            super.putEndDate(date, keepDuration);
        }
        putDuration(duration, unit, keepStartDate = true) {
            const isVeryFirstAssignment = this.$.duration.getProposedOrPreviousValue() === undefined;
            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.endDate);
                this.markAsNeedRecalculation(this.$.duration);
                this.markAsNeedRecalculation(this.$.effort);
                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units));
            }
            super.putDuration(duration, unit, keepStartDate);
        }
        *calculateEffort() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch = yield this.$.dispatcher;
                const formulaId = dispatch.resolution.get(EffortVar);
                if (formulaId === CalculateProposed) {
                    return yield* this.calculateEffortProposed();
                }
                else if (formulaId === effortFormula.formulaId) {
                    return yield* this.calculateEffortPure();
                }
                else {
                    throw new Error("Unknown formula for `effort`");
                }
            }
            else {
                return yield* super.calculateEffort();
            }
        }
        *calculateStartDate() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch = yield this.$.dispatcher;
                const formulaId = dispatch.resolution.get(StartDateVar);
                if (formulaId === startDateByEffortFormula.formulaId) {
                    return yield* this.calculateProjectedXDateByEffort(yield this.$.endDate, false);
                }
                else {
                    return yield* super.calculateStartDate();
                }
            }
            else {
                return yield* super.calculateStartDate();
            }
        }
        *calculateEndDate() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch = yield this.$.dispatcher;
                const formulaId = dispatch.resolution.get(EndDateVar);
                if (formulaId === endDateByEffortFormula.formulaId) {
                    return yield* this.calculateProjectedXDateByEffort(yield this.$.startDate, true);
                }
                else {
                    return yield* super.calculateEndDate();
                }
            }
            else {
                return yield* super.calculateEndDate();
            }
        }
        *calculateEffectiveDuration() {
            const dispatch = yield this.$.dispatcher;
            const schedulingMode = yield this.$.schedulingMode;
            const durationResolution = dispatch.resolution.get(DurationVar);
            const effortResolution = dispatch.resolution.get(EffortVar);
            let effectiveDurationToUse;
            if (durationResolution === durationFormula.formulaId && schedulingMode != SchedulingMode.Normal) {
                const proposedOrPreviousStartDate = this.$.startDate.getProposedOrPreviousValue();
                const proposedOrPreviousEndDate = this.$.endDate.getProposedOrPreviousValue();
                const startDateResolution = dispatch.resolution.get(StartDateVar);
                const endDateResolution = dispatch.resolution.get(EndDateVar);
                const effortDriven = yield this.$.effortDriven;
                if (effortDriven || schedulingMode === SchedulingMode.FixedEffort) {
                    if (proposedOrPreviousEndDate && startDateResolution === startDateByEffortFormula.formulaId) {
                        effectiveDurationToUse = yield* this.calculateProjectedDuration(yield* this.calculateProjectedXDateByEffort(proposedOrPreviousEndDate, false), proposedOrPreviousEndDate);
                    }
                    else if (proposedOrPreviousStartDate && endDateResolution === endDateByEffortFormula.formulaId) {
                        effectiveDurationToUse = yield* this.calculateProjectedDuration(proposedOrPreviousStartDate, yield* this.calculateProjectedXDateByEffort(proposedOrPreviousStartDate, true));
                    }
                }
                else if (proposedOrPreviousStartDate && proposedOrPreviousEndDate
                    || !proposedOrPreviousStartDate && !proposedOrPreviousEndDate) {
                    effectiveDurationToUse = yield* super.calculateEffectiveDuration();
                }
            }
            else
                effectiveDurationToUse = yield* super.calculateEffectiveDuration();
            return effectiveDurationToUse;
        }
        *calculateSchedulingMode() {
            return this.$.schedulingMode.getProposedOrPreviousValue() || SchedulingMode.Normal;
        }
    }
    __decorate([
        model_field({ 'type': 'boolean', defaultValue: false })
    ], HasSchedulingMode.prototype, "effortDriven", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: SchedulingMode.Normal })
    ], HasSchedulingMode.prototype, "schedulingMode", void 0);
    __decorate([
        field({ atomCls: SEDWUDispatcherIdentifier })
    ], HasSchedulingMode.prototype, "dispatcher", void 0);
    __decorate([
        calculate('effort')
    ], HasSchedulingMode.prototype, "calculateEffort", null);
    __decorate([
        calculate('startDate')
    ], HasSchedulingMode.prototype, "calculateStartDate", null);
    __decorate([
        calculate('endDate')
    ], HasSchedulingMode.prototype, "calculateEndDate", null);
    __decorate([
        calculate('schedulingMode')
    ], HasSchedulingMode.prototype, "calculateSchedulingMode", null);
    return HasSchedulingMode;
};
//# sourceMappingURL=HasSchedulingMode.js.map