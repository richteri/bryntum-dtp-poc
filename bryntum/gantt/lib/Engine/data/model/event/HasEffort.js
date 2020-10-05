var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate } from "../../../../ChronoGraph/replica/Entity.js";
import DateHelper from "../../../../Core/helper/DateHelper.js";
import { model_field } from "../../../chrono/ModelFieldAtom.js";
import { TimeUnit } from "../../../scheduling/Types.js";
export const HasEffort = (base) => {
    class HasEffort extends base {
        setEffort(effort, unit) {
            this.putEffort(effort, unit);
            return this.propagate();
        }
        getEffort(unit) {
            const effort = this.effort;
            return unit !== undefined ? this.getProject().convertDuration(effort, this.effortUnit, unit) : effort;
        }
        putEffort(effort, unit) {
            if (effort < 0)
                effort = 0;
            const isVeryFirstAssignment = this.$.effort.getProposedOrPreviousValue() === undefined;
            if (effort == null && isVeryFirstAssignment)
                return;
            if (unit != null && unit !== this.effortUnit) {
                this.effortUnit = unit;
            }
            this.$.effort.put(effort);
        }
        setEffortUnit(_value) {
            throw new Error("Use `setEffort` instead");
        }
        *calculateTotalChildrenEffort() {
            const childEvents = yield this.$.childEvents;
            const project = this.getProject();
            let totalEffortMs = 0;
            for (const childEvent of childEvents) {
                const childEventEffortUnit = yield childEvent.$.effortUnit;
                totalEffortMs += yield* project.$convertDuration(yield childEvent.$.effort, childEventEffortUnit, TimeUnit.Millisecond);
            }
            return yield* project.$convertDuration(totalEffortMs, TimeUnit.Millisecond, yield this.$.effortUnit);
        }
        *calculateEffort() {
            const childEvents = yield this.$.childEvents;
            if (childEvents.size > 0)
                return yield* this.calculateTotalChildrenEffort();
            else {
                const proposed = this.$.effort.getProposedOrPreviousValue();
                return proposed !== undefined ? proposed : yield* this.calculateEffortPure();
            }
        }
        *calculateEffortPure() {
            const childEvents = yield this.$.childEvents;
            if (childEvents.size > 0)
                return yield* this.calculateTotalChildrenEffort();
            else {
                return yield* this.calculateProjectedEffort(yield this.$.startDate, yield this.$.endDate);
            }
        }
        *calculateEffortProposed() {
            return this.$.effort.getProposedOrPreviousValue();
        }
        *calculateAssignmentUnits(assignment) {
            return yield* this.calculateAssignmentUnitsProposed(assignment);
        }
        *calculateAssignmentUnitsPure(assignment) {
            return yield* this.calculateUnitsByStartEndAndEffort(assignment);
        }
        *calculateAssignmentUnitsProposed(assignment) {
            return assignment.$.units.getProposedOrPreviousValue();
        }
        *getBaseOptionsForEffortCalculations() {
            return { ignoreResourceCalendars: false };
        }
        *calculateProjectedEffort(startDate, endDate) {
            if (startDate == null || endDate == null || startDate > endDate)
                return null;
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            const totalUnitsByCalendar = new Map();
            for (const [calendar, assignments] of assignmentsByCalendar) {
                let intervalUnits = 0;
                for (const assignment of assignments) {
                    intervalUnits += (yield assignment.$.units);
                }
                totalUnitsByCalendar.set(calendar, intervalUnits);
            }
            let resultN = 0;
            const options = Object.assign(yield* this.getBaseOptionsForEffortCalculations(), { startDate, endDate });
            if (totalUnitsByCalendar.size === 0) {
                totalUnitsByCalendar.set(yield this.$.calendar, 100);
                options.ignoreResourceCalendars = true;
            }
            yield* this.forEachAvailabilityInterval(options, (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
                const workCalendars = calendarCacheIntervalMultiple.getCalendarsWorking();
                const intervalStartN = intervalStart.getTime(), intervalEndN = intervalEnd.getTime(), intervalDuration = intervalEndN - intervalStartN;
                let intervalUnits = 0;
                for (const workingCalendar of workCalendars) {
                    intervalUnits += totalUnitsByCalendar.get(workingCalendar) || 0;
                }
                resultN += intervalUnits * intervalDuration * 0.01;
            });
            return yield* this.getProject().$convertDuration(resultN, TimeUnit.Millisecond, yield this.$.effortUnit);
        }
        *calculateUnitsByStartEndAndEffort(_assignment) {
            const effort = yield this.$.effort, effortUnit = yield this.$.effortUnit, effortMS = yield* this.getProject().$convertDuration(effort, effortUnit, TimeUnit.Millisecond);
            let collectedEffort = 0;
            const options = Object.assign(yield* this.getBaseOptionsForEffortCalculations(), { startDate: yield this.$.startDate, endDate: yield this.$.endDate });
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            yield* this.forEachAvailabilityInterval(options, (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
                const workCalendars = calendarCacheIntervalMultiple.getCalendarsWorking();
                const intervalStartN = intervalStart.getTime(), intervalEndN = intervalEnd.getTime(), intervalDuration = intervalEndN - intervalStartN;
                for (const workingCalendar of workCalendars) {
                    collectedEffort +=
                        (assignmentsByCalendar.has(workingCalendar) ? assignmentsByCalendar.get(workingCalendar).length : 0) * intervalDuration;
                }
            });
            return collectedEffort ? 100 * effortMS / collectedEffort : 100;
        }
        *calculateProjectedXDateByEffort(baseDate, isForward = true) {
            const effort = yield this.$.effort, effortUnit = yield this.$.effortUnit, effortMS = yield* this.getProject().$convertDuration(effort, effortUnit, TimeUnit.Millisecond);
            if (baseDate == null || effort == null)
                return null;
            let resultN = baseDate.getTime();
            let leftEffort = effortMS;
            const calendar = yield this.$.calendar;
            const assignmentsByCalendar = yield this.$.assignmentsByCalendar;
            const totalUnitsByCalendar = new Map();
            for (const [calendar, assignments] of assignmentsByCalendar) {
                let intervalUnits = 0;
                for (const assignment of assignments) {
                    intervalUnits += (yield assignment.$.units);
                }
                totalUnitsByCalendar.set(calendar, intervalUnits);
            }
            if (assignmentsByCalendar.size > 0) {
                const options = Object.assign(yield* this.getBaseOptionsForDurationCalculations(), isForward ? { startDate: baseDate, isForward } : { endDate: baseDate, isForward });
                yield* this.forEachAvailabilityInterval(options, (intervalStart, intervalEnd, calendarCacheIntervalMultiple) => {
                    const workCalendars = calendarCacheIntervalMultiple.getCalendarsWorking();
                    const intervalStartN = intervalStart.getTime(), intervalEndN = intervalEnd.getTime(), intervalDuration = intervalEndN - intervalStartN;
                    let intervalUnits = 0;
                    for (const workingCalendar of workCalendars) {
                        intervalUnits += totalUnitsByCalendar.get(workingCalendar) || 0;
                    }
                    const intervalEffort = intervalUnits * intervalDuration * 0.01;
                    if (intervalEffort >= leftEffort) {
                        resultN =
                            isForward
                                ?
                                    intervalStartN + leftEffort / (0.01 * intervalUnits)
                                :
                                    intervalEndN - leftEffort / (0.01 * intervalUnits);
                        return false;
                    }
                    else {
                        leftEffort -= intervalEffort;
                    }
                });
                return new Date(resultN);
            }
            else {
                return calendar.accumulateWorkingTime(baseDate, effortMS, TimeUnit.Millisecond, isForward).finalDate;
            }
        }
    }
    __decorate([
        model_field({ 'type': 'number' })
    ], HasEffort.prototype, "effort", void 0);
    __decorate([
        model_field({ 'type': 'string', defaultValue: TimeUnit.Hour }, { converter: DateHelper.normalizeUnit })
    ], HasEffort.prototype, "effortUnit", void 0);
    __decorate([
        calculate('effort')
    ], HasEffort.prototype, "calculateEffort", null);
    return HasEffort;
};
//# sourceMappingURL=HasEffort.js.map