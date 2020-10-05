var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { generic_field, calculate } from "../../../../ChronoGraph/replica/Entity.js";
import { isAtomicValue } from "../../../../ChronoGraph/util/Helper.js";
import { model_field, ModelBucketField } from '../../../chrono/ModelFieldAtom.js';
import { DependencyType } from "../../../scheduling/Types.js";
import { ConstraintInterval } from "./ConstrainedEvent.js";
export const HasDependencies = (base) => {
    class HasDependencies extends base {
        *calculateEarlyStartDateConstraintIntervals() {
            const intervals = yield* super.calculateEarlyStartDateConstraintIntervals();
            let dependency;
            for (dependency of (yield this.$.incomingDeps)) {
                const fromEvent = yield dependency.$.fromEvent;
                if (fromEvent == null || isAtomicValue(fromEvent))
                    continue;
                let interval;
                switch (dependency.type) {
                    case DependencyType.EndToStart:
                        const fromEventEndDate = yield fromEvent.$.earlyEndDateRaw;
                        if (fromEventEndDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: calendar.calculateEndDate(fromEventEndDate, lag, lagUnit),
                                endDate: null,
                                originDescription: `"end to start" dependency from task ${fromEvent}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                    case DependencyType.StartToStart:
                        const fromEventStartDate = yield fromEvent.$.earlyStartDateRaw;
                        if (fromEventStartDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: calendar.calculateEndDate(fromEventStartDate, lag, lagUnit),
                                endDate: null,
                                originDescription: `"start to start" dependency from task ${fromEvent}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                }
                interval && intervals.unshift(interval);
            }
            return intervals;
        }
        *calculateEarlyEndDateConstraintIntervals() {
            const intervals = yield* super.calculateEarlyEndDateConstraintIntervals();
            let dependency;
            for (dependency of (yield this.$.incomingDeps)) {
                const fromEvent = yield dependency.$.fromEvent;
                if (fromEvent == null || isAtomicValue(fromEvent))
                    continue;
                let interval;
                switch (dependency.type) {
                    case DependencyType.EndToEnd:
                        const fromEventEndDate = yield fromEvent.$.earlyEndDateRaw;
                        if (fromEventEndDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: calendar.calculateEndDate(fromEventEndDate, lag, lagUnit),
                                endDate: null,
                                originDescription: `"end to end" dependency from task ${fromEvent}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                    case DependencyType.StartToEnd:
                        const fromEventStartDate = yield fromEvent.$.earlyStartDateRaw;
                        if (fromEventStartDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: calendar.calculateEndDate(fromEventStartDate, lag, lagUnit),
                                endDate: null,
                                originDescription: `"start to end" dependency from task ${fromEvent}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                }
                interval && intervals.unshift(interval);
            }
            return intervals;
        }
        *calculateLateStartDateConstraintIntervals() {
            const intervals = yield* super.calculateLateStartDateConstraintIntervals();
            let dependency;
            for (dependency of (yield this.$.outgoingDeps)) {
                const successor = yield dependency.$.toEvent;
                if (successor == null || isAtomicValue(successor))
                    continue;
                let interval;
                switch (dependency.type) {
                    case DependencyType.StartToStart:
                        const successorStartDate = yield successor.$.lateStartDateRaw;
                        if (successorStartDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: null,
                                endDate: calendar.calculateStartDate(successorStartDate, lag, lagUnit),
                                originDescription: `"start to start" dependency to task ${successor}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                    case DependencyType.StartToEnd:
                        const successorEndDate = yield successor.$.lateEndDateRaw;
                        if (successorEndDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: null,
                                endDate: calendar.calculateStartDate(successorEndDate, lag, lagUnit),
                                originDescription: `"start to end" dependency to task ${successor}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                }
                interval && intervals.unshift(interval);
            }
            return intervals;
        }
        *calculateLateEndDateConstraintIntervals() {
            const intervals = yield* super.calculateLateEndDateConstraintIntervals();
            let dependency;
            for (dependency of (yield this.$.outgoingDeps)) {
                const successor = yield dependency.$.toEvent;
                if (successor == null || isAtomicValue(successor))
                    continue;
                let interval;
                switch (dependency.type) {
                    case DependencyType.EndToEnd:
                        const successorEndDate = yield successor.$.lateEndDateRaw;
                        if (successorEndDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: null,
                                endDate: calendar.calculateStartDate(successorEndDate, lag, lagUnit),
                                originDescription: `"end to end" dependency to task ${successor}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                    case DependencyType.EndToStart:
                        const successorStartDate = yield successor.$.lateStartDateRaw;
                        if (successorStartDate) {
                            const lag = yield dependency.$.lag;
                            const lagUnit = yield dependency.$.lagUnit;
                            const calendar = yield dependency.$.calendar;
                            interval = ConstraintInterval.new({
                                startDate: null,
                                endDate: calendar.calculateStartDate(successorStartDate, lag, lagUnit),
                                originDescription: `"end to start" dependency to task ${successor}`,
                                onRemoveAction: this.getOnRemoveAction(dependency)
                            });
                        }
                        break;
                }
                interval && intervals.unshift(interval);
            }
            return intervals;
        }
        getOnRemoveAction(dependency) {
            return () => {
                this.getDependencyStore().remove(dependency);
            };
        }
        async setIncomingDeps(deps) {
            const dependencyStore = this.getDependencyStore();
            this.incomingDeps.forEach(dependency => dependencyStore.remove(dependency));
            deps.forEach(dependency => {
                dependency.toEvent = this;
                dependencyStore.add(dependency);
            });
            return this.propagate();
        }
        async setOutgoingDeps(deps) {
            const dependencyStore = this.getDependencyStore();
            this.outgoingDeps.forEach(dependency => dependencyStore.remove(dependency));
            deps.forEach(dependency => {
                dependency.fromEvent = this;
                dependencyStore.add(dependency);
            });
            return this.propagate();
        }
        leaveProject() {
            const dependencyStore = this.getDependencyStore();
            this.incomingDeps.forEach(dependency => dependencyStore.remove(dependency));
            this.outgoingDeps.forEach(dependency => dependencyStore.remove(dependency));
            super.leaveProject();
        }
    }
    __decorate([
        model_field()
    ], HasDependencies.prototype, "dontRemoveMe", void 0);
    __decorate([
        generic_field({}, ModelBucketField)
    ], HasDependencies.prototype, "outgoingDeps", void 0);
    __decorate([
        generic_field({}, ModelBucketField)
    ], HasDependencies.prototype, "incomingDeps", void 0);
    __decorate([
        calculate('earlyStartDateConstraintIntervals')
    ], HasDependencies.prototype, "calculateEarlyStartDateConstraintIntervals", null);
    __decorate([
        calculate('earlyEndDateConstraintIntervals')
    ], HasDependencies.prototype, "calculateEarlyEndDateConstraintIntervals", null);
    __decorate([
        calculate('lateStartDateConstraintIntervals')
    ], HasDependencies.prototype, "calculateLateStartDateConstraintIntervals", null);
    __decorate([
        calculate('lateEndDateConstraintIntervals')
    ], HasDependencies.prototype, "calculateLateEndDateConstraintIntervals", null);
    return HasDependencies;
};
//# sourceMappingURL=HasDependencies.js.map