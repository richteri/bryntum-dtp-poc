var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CancelPropagationEffect } from "../../../../ChronoGraph/chrono/Effect.js";
import { calculate, field, generic_field } from "../../../../ChronoGraph/replica/Entity.js";
import { combineCalendars } from "../../../calendar/CalendarCacheMultiple.js";
import { CalendarIteratorResult } from "../../../calendar/CalendarIteratorResult.js";
import { model_field, ModelBucketField } from "../../../chrono/ModelFieldAtom.js";
import { TimeUnit } from "../../../scheduling/Types.js";
const hasMixin = Symbol('HasAssignments');
export const HasAssignments = (base) => {
    class HasAssignments extends base {
        constructor() {
            super(...arguments);
            this.assignmentsByCalendar = new Map();
        }
        [hasMixin]() { }
        get assignments() {
            return [...this.assigned];
        }
        getAssignmentFor(resource) {
            let result;
            this.assigned.forEach(assignment => {
                if (assignment.resource === resource)
                    result = assignment;
            });
            return result;
        }
        isAssignedTo(resource) {
            return Boolean(this.getAssignmentFor(resource));
        }
        reassign(oldResource, newResource) {
            const assignment = this.getAssignmentFor(oldResource);
            if (!assignment)
                throw new Error(`Can't unassign resource \`${oldResource}\` from task \`${this}\` - resource is not assigned to the task!`);
            this.removeAssignment(assignment);
            if (this.getAssignmentFor(newResource))
                throw new Error('Resource can\'t be assigned twice to the same task');
            const assignmentCls = this.getProject().assignmentStore.modelClass;
            this.addAssignment(new assignmentCls({
                event: this,
                resource: newResource
            }));
            return this.propagate();
        }
        async assign(resource, units = 100) {
            if (this.getAssignmentFor(resource))
                throw new Error('Resource can\'t be assigned twice to the same task');
            const assignmentCls = this.getProject().assignmentStore.modelClass;
            this.addAssignment(new assignmentCls({
                event: this,
                resource: resource,
                units: units
            }));
            return this.propagate();
        }
        async unassign(resource) {
            const assignment = this.getAssignmentFor(resource);
            if (!assignment)
                throw new Error(`Can't unassign resource \`${resource}\` from task \`${this}\` - resource is not assigned to the task!`);
            this.removeAssignment(assignment);
            return this.propagate();
        }
        addAssignment(assignment) {
            this.getProject().assignmentStore.add(assignment);
            return assignment;
        }
        removeAssignment(assignment) {
            this.getProject().assignmentStore.remove(assignment);
            return assignment;
        }
        leaveProject() {
            const assignmentStore = this.getAssignmentStore();
            this.assigned.forEach(assignment => assignmentStore.remove(assignment));
            super.leaveProject();
        }
        *forEachAvailabilityInterval(options, func) {
            const calendar = yield this.$.calendar;
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            const effectiveCalendarsCombination = yield this.$.effectiveCalendarsCombination;
            return effectiveCalendarsCombination.forEachAvailabilityInterval(options, (startDate, endDate, calendarCacheIntervalMultiple) => {
                const calendarsStatus = calendarCacheIntervalMultiple.getCalendarsWorkStatus();
                const workCalendars = calendarCacheIntervalMultiple.getCalendarsWorking();
                if (calendarsStatus.get(calendar)
                    &&
                        (options.ignoreResourceCalendars || workCalendars.some((calendar) => assignmentsByCalendar.has(calendar)))) {
                    return func(startDate, endDate, calendarCacheIntervalMultiple);
                }
            });
        }
        *calculateEffectiveCalendarsCombination() {
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            const calendars = [...assignmentsByCalendar.keys(), yield this.$.calendar];
            return combineCalendars(calendars);
        }
        *calculateAssignmentsByCalendar() {
            const assignments = yield this.$.assigned;
            const result = new Map();
            for (const assignment of assignments) {
                const resource = yield assignment.$.resource;
                if (resource) {
                    const resourceCalendar = yield resource.$.calendar;
                    let assignments = result.get(resourceCalendar);
                    if (!assignments) {
                        assignments = [];
                        result.set(resourceCalendar, assignments);
                    }
                    assignments.push(assignment);
                }
            }
            return result;
        }
        *getBaseOptionsForDurationCalculations() {
            return { ignoreResourceCalendars: false };
        }
        *skipNonWorkingTime(date, isForward = true) {
            if (!date)
                return null;
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            if (assignmentsByCalendar.size > 0) {
                const options = Object.assign(yield* this.getBaseOptionsForDurationCalculations(), isForward ? { startDate: date, isForward } : { endDate: date, isForward });
                let workingDate;
                const skipRes = yield* this.forEachAvailabilityInterval(options, (startDate, endDate, calendarCacheIntervalMultiple) => {
                    workingDate = isForward ? startDate : endDate;
                    return false;
                });
                if (skipRes === CalendarIteratorResult.FullRangeIterated) {
                    yield CancelPropagationEffect.new();
                }
                return new Date(workingDate);
            }
            else {
                return yield* super.skipNonWorkingTime(date, isForward);
            }
        }
        *calculateProjectedDuration(startDate, endDate, durationUnit) {
            if (!startDate || !endDate) {
                return null;
            }
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            if (assignmentsByCalendar.size > 0) {
                const options = Object.assign(yield* this.getBaseOptionsForDurationCalculations(), { startDate, endDate, isForward: true });
                let result = 0;
                yield* this.forEachAvailabilityInterval(options, (startDate, endDate) => {
                    result += endDate.getTime() - startDate.getTime();
                });
                if (!durationUnit)
                    durationUnit = yield this.$.durationUnit;
                return yield* this.getProject().$convertDuration(result, TimeUnit.Millisecond, durationUnit);
            }
            else {
                return yield* super.calculateProjectedDuration(startDate, endDate, durationUnit);
            }
        }
        *calculateProjectedXDateWithDuration(baseDate, isForward = true, duration) {
            if (baseDate == null || duration == null || isNaN(duration))
                return null;
            if (duration == 0)
                return baseDate;
            const durationUnit = yield this.$.durationUnit;
            const durationMS = yield* this.getProject().$convertDuration(duration, durationUnit, TimeUnit.Millisecond);
            let resultN = baseDate.getTime();
            let leftDuration = durationMS;
            const calendar = yield this.$.calendar;
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            if (assignmentsByCalendar.size > 0) {
                const options = Object.assign(yield* this.getBaseOptionsForDurationCalculations(), isForward ? { startDate: baseDate, isForward } : { endDate: baseDate, isForward });
                yield* this.forEachAvailabilityInterval(options, (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
                    const intervalStartN = intervalStart.getTime(), intervalEndN = intervalEnd.getTime(), intervalDuration = intervalEndN - intervalStartN;
                    if (intervalDuration >= leftDuration) {
                        resultN = isForward ? intervalStartN + leftDuration : intervalEndN - leftDuration;
                        return false;
                    }
                    else {
                        const dstDiff = intervalStart.getTimezoneOffset() - intervalEnd.getTimezoneOffset();
                        leftDuration -= intervalDuration + dstDiff * 60 * 1000;
                    }
                });
                return new Date(resultN);
            }
            else {
                return calendar.accumulateWorkingTime(baseDate, durationMS, TimeUnit.Millisecond, isForward).finalDate;
            }
        }
        *hasProposedValueForUnits() {
            const assignments = yield this.$.assigned;
            for (const assignment of assignments) {
                const resource = yield assignment.$.resource;
                if (resource && assignment.$.units.hasProposedValue())
                    return true;
            }
            return false;
        }
        hasAssignmentChanges() {
            return this.$.assigned.newRefs.size > 0 || this.$.assigned.oldRefs.size > 0;
        }
    }
    __decorate([
        model_field()
    ], HasAssignments.prototype, "dontRemoveMe", void 0);
    __decorate([
        generic_field({}, ModelBucketField)
    ], HasAssignments.prototype, "assigned", void 0);
    __decorate([
        field()
    ], HasAssignments.prototype, "effectiveCalendarsCombination", void 0);
    __decorate([
        field()
    ], HasAssignments.prototype, "assignmentsByCalendar", void 0);
    __decorate([
        calculate('effectiveCalendarsCombination')
    ], HasAssignments.prototype, "calculateEffectiveCalendarsCombination", null);
    __decorate([
        calculate('assignmentsByCalendar')
    ], HasAssignments.prototype, "calculateAssignmentsByCalendar", null);
    return HasAssignments;
};
export const hasHasAssignments = (model) => Boolean(model && model[hasMixin]);
//# sourceMappingURL=HasAssignments.js.map