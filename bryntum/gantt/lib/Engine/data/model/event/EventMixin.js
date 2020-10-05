var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CalculateProposed } from "../../../../ChronoGraph/cycle_resolver/CycleResolver.js";
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js";
import DateHelper from "../../../../Core/helper/DateHelper.js";
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js";
import { Direction, TimeUnit } from "../../../scheduling/Types.js";
import { isNotNumber } from "../../../util/Functions.js";
import { durationFormula, DurationVar, endDateFormula, EndDateVar, Instruction, SEDDispatcher, SEDDispatcherIdentifier, SEDForwardCycleResolutionContext, startDateFormula, StartDateVar } from "./BaseEventDispatcher.js";
const hasMixin = Symbol('EventMixin');
export const EventMixin = (base) => {
    class EventMixin extends base {
        [hasMixin]() { }
        *calculateDispatcher() {
            const cycleDispatcher = yield* this.prepareDispatcher();
            const startDateProposedArgs = this.$.startDate.proposedArgs;
            const startInstruction = startDateProposedArgs ? (startDateProposedArgs[1] ? Instruction.KeepDuration : Instruction.KeepEndDate) : undefined;
            if (startInstruction)
                cycleDispatcher.addInstruction(startInstruction);
            const endDateProposedArgs = this.$.endDate.proposedArgs;
            const endInstruction = endDateProposedArgs ? (endDateProposedArgs[1] ? Instruction.KeepDuration : Instruction.KeepStartDate) : undefined;
            if (endInstruction)
                cycleDispatcher.addInstruction(endInstruction);
            const durationProposedArgs = this.$.duration.proposedArgs;
            let durationInstruction;
            if (durationProposedArgs) {
                switch (durationProposedArgs[1]) {
                    case true:
                        durationInstruction = Instruction.KeepStartDate;
                        break;
                    case false:
                        durationInstruction = Instruction.KeepEndDate;
                        break;
                }
            }
            if (!durationInstruction && cycleDispatcher.hasProposedValue(DurationVar)) {
                durationInstruction = Instruction.KeepStartDate;
            }
            if (durationInstruction)
                cycleDispatcher.addInstruction(durationInstruction);
            return cycleDispatcher;
        }
        *prepareDispatcher() {
            const dispatcherClass = yield* this.dispatcherClass();
            const cycleDispatcher = dispatcherClass.new({
                context: yield* this.cycleResolutionContext()
            });
            cycleDispatcher.collectInfo(this.$.startDate, StartDateVar);
            cycleDispatcher.collectInfo(this.$.endDate, EndDateVar);
            cycleDispatcher.collectInfo(this.$.duration, DurationVar);
            return cycleDispatcher;
        }
        *cycleResolutionContext() {
            return SEDForwardCycleResolutionContext;
        }
        *dispatcherClass() {
            return SEDDispatcher;
        }
        buildProposedDispatcher() {
            return;
        }
        *skipNonWorkingTime(date, isForward = true) {
            if (!date)
                return null;
            const calendar = yield this.$.calendar;
            return calendar.skipNonWorkingTime(date, isForward);
        }
        convertDuration(duration, fromUnit, toUnit) {
            const projectCalendar = this.getProject().calendar;
            return projectCalendar.convertDuration(duration, fromUnit, toUnit);
        }
        *$convertDuration(duration, fromUnit, toUnit) {
            const project = this.getProject(), projectCalendar = yield project.$.calendar;
            return projectCalendar.convertDuration(duration, fromUnit, toUnit);
        }
        *calculateStartDate() {
            const dispatch = yield this.$.dispatcher;
            const formulaId = dispatch.resolution.get(StartDateVar);
            if (formulaId === CalculateProposed) {
                return yield* this.calculateStartDateProposed();
            }
            else if (formulaId === startDateFormula.formulaId) {
                return yield* this.calculateStartDatePure();
            }
            else {
                throw new Error("Unknown formula for `startDate`");
            }
        }
        *calculateStartDatePure() {
            return yield* this.calculateProjectedXDateWithDuration(yield this.$.endDate, false, yield this.$.duration);
        }
        *calculateProjectedXDateWithDuration(baseDate, isForward = true, duration) {
            const durationUnit = yield this.$.durationUnit;
            const calendar = yield this.$.calendar;
            const project = this.getProject();
            if (!baseDate || isNotNumber(duration))
                return null;
            const durationMs = yield* this.$convertDuration(duration, durationUnit, TimeUnit.Millisecond);
            if (isForward) {
                return calendar.calculateEndDate(baseDate, durationMs, TimeUnit.Millisecond);
            }
            else {
                return calendar.calculateStartDate(baseDate, durationMs, TimeUnit.Millisecond);
            }
        }
        *calculateStartDateProposed() {
            const startDate = this.$.startDate.getProposedOrPreviousValue();
            return yield* this.skipNonWorkingTime(startDate, true);
        }
        *calculateEndDate() {
            const dispatch = yield this.$.dispatcher;
            const formulaId = dispatch.resolution.get(EndDateVar);
            if (formulaId === CalculateProposed) {
                return yield* this.calculateEndDateProposed();
            }
            else if (formulaId === endDateFormula.formulaId) {
                return yield* this.calculateEndDatePure();
            }
            else {
                throw new Error("Unknown formula for `endDate`");
            }
        }
        *calculateEndDatePure() {
            return yield* this.calculateProjectedXDateWithDuration(yield this.$.startDate, true, yield this.$.duration);
        }
        *calculateEndDateProposed() {
            const endDate = this.$.endDate.getProposedOrPreviousValue();
            return yield* this.skipNonWorkingTime(endDate, false);
        }
        *calculateDuration(proposedValue) {
            const dispatch = yield this.$.dispatcher;
            const formulaId = dispatch.resolution.get(DurationVar);
            if (formulaId === CalculateProposed) {
                return yield* this.calculateDurationProposed();
            }
            else if (formulaId === durationFormula.formulaId) {
                return yield* this.calculateDurationPure();
            }
            else {
                throw new Error("Unknown formula for `duration`");
            }
        }
        *calculateDurationPure() {
            const startDate = yield this.$.startDate;
            const endDate = yield this.$.endDate;
            if (!startDate || !endDate)
                return null;
            if (startDate > endDate) {
                throw new Error("debug");
            }
            else {
                return yield* this.calculateProjectedDuration(startDate, endDate);
            }
        }
        *calculateDurationProposed() {
            return this.$.duration.getProposedOrPreviousValue();
        }
        *calculateProjectedDuration(startDate, endDate, durationUnit) {
            if (!startDate || !endDate)
                return null;
            if (!durationUnit)
                durationUnit = yield this.$.durationUnit;
            const calendar = yield this.$.calendar;
            const project = this.getProject();
            return yield* this.$convertDuration(calendar.calculateDuration(startDate, endDate, TimeUnit.Millisecond), TimeUnit.Millisecond, durationUnit);
        }
        *calculateEffectiveDuration() {
            const dispatch = yield this.$.dispatcher;
            let effectiveDurationToUse;
            const durationResolution = dispatch.resolution.get(DurationVar);
            if (durationResolution === CalculateProposed) {
                effectiveDurationToUse = yield this.$.duration;
            }
            else if (durationResolution === durationFormula.formulaId) {
                effectiveDurationToUse = yield* this.calculateProjectedDuration(this.$.startDate.getProposedOrPreviousValue(), this.$.endDate.getProposedOrPreviousValue());
            }
            return effectiveDurationToUse;
        }
        getStartDate() {
            return this.startDate;
        }
        putStartDate(date, keepDuration = true) {
            const isVeryFirstAssignment = this.$.startDate.getProposedOrPreviousValue() === undefined;
            if (date == null && isVeryFirstAssignment)
                return;
            if (date === null && !isVeryFirstAssignment) {
                this.$.endDate.proposedValue = null;
                this.$.endDate.proposedArgs = [null];
                this.$.duration.proposedValue = null;
                this.$.duration.proposedArgs = [null];
            }
            this.$.startDate.put(date, keepDuration);
            if (this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.endDate);
                this.markAsNeedRecalculation(this.$.duration);
            }
        }
        async setStartDate(date, keepDuration = true) {
            this.putStartDate(date, keepDuration);
            return this.propagate();
        }
        getEndDate() {
            return this.endDate;
        }
        putEndDate(date, keepDuration = false) {
            const isVeryFirstAssignment = this.$.startDate.getProposedOrPreviousValue() === undefined;
            if (date == null && isVeryFirstAssignment)
                return;
            if (date === null && !isVeryFirstAssignment) {
                this.$.startDate.proposedValue = null;
                this.$.startDate.proposedArgs = [null];
                this.$.duration.proposedValue = null;
                this.$.duration.proposedArgs = [null];
            }
            const startDate = this.getStartDate();
            if (!keepDuration && date && date.getTime && startDate && date.getTime() < startDate.getTime()) {
                date = startDate;
                this.putDuration(0);
            }
            this.$.endDate.put(date, keepDuration);
            if (this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.duration);
            }
        }
        async setEndDate(date, keepDuration = false) {
            this.putEndDate(date, keepDuration);
            return this.propagate();
        }
        getDuration(unit) {
            let duration = this.duration;
            if (unit) {
                duration = this.convertDuration(duration, this.durationUnit, unit);
            }
            return duration;
        }
        putDuration(duration, unit, keepStartDate = true) {
            const isVeryFirstAssignment = this.$.duration.getProposedOrPreviousValue() === undefined;
            if (duration == null && isVeryFirstAssignment)
                return;
            if (duration === null && !isVeryFirstAssignment) {
                this.$.startDate.proposedValue = null;
                this.$.startDate.proposedArgs = [null];
                this.$.endDate.proposedValue = null;
                this.$.endDate.proposedArgs = [null];
            }
            this.$.duration.put(duration, keepStartDate);
            if (this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher);
                this.markAsNeedRecalculation(this.$.startDate);
                this.markAsNeedRecalculation(this.$.endDate);
            }
            if (unit != null && unit !== this.durationUnit) {
                this.$.durationUnit.put(unit);
            }
        }
        async setDuration(duration, unit, keepStartDate = true) {
            this.putDuration(duration, unit, keepStartDate);
            return this.propagate();
        }
        getDurationUnit() {
            return this.durationUnit;
        }
        setDurationUnit(_value) {
            throw new Error("Use `setDuration` instead");
        }
        toString() {
            return `Event ${this.id}`;
        }
    }
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ' }, { converter: dateConverter })
    ], EventMixin.prototype, "startDate", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ' }, { converter: dateConverter })
    ], EventMixin.prototype, "endDate", void 0);
    __decorate([
        model_field({ type: 'number', allowNull: true })
    ], EventMixin.prototype, "duration", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: TimeUnit.Day }, { converter: DateHelper.normalizeUnit })
    ], EventMixin.prototype, "durationUnit", void 0);
    __decorate([
        field({ atomCls: SEDDispatcherIdentifier })
    ], EventMixin.prototype, "dispatcher", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: Direction.Forward })
    ], EventMixin.prototype, "direction", void 0);
    __decorate([
        calculate('dispatcher')
    ], EventMixin.prototype, "calculateDispatcher", null);
    __decorate([
        calculate('startDate')
    ], EventMixin.prototype, "calculateStartDate", null);
    __decorate([
        calculate('endDate')
    ], EventMixin.prototype, "calculateEndDate", null);
    __decorate([
        calculate('duration')
    ], EventMixin.prototype, "calculateDuration", null);
    return EventMixin;
};
export const hasEventMixin = (model) => Boolean(model && model[hasMixin]);
//# sourceMappingURL=EventMixin.js.map