var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Model from "../../Core/data/Model.js";
import DateHelper from "../../Core/helper/DateHelper.js";
import { Entity, field } from "../../ChronoGraph/replica/Entity.js";
import { model_field } from "../chrono/ModelFieldAtom.js";
import { PartOfProjectMixin } from "../data/model/mixin/PartOfProjectMixin.js";
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js";
import { TimeUnit } from "../scheduling/Types.js";
import { CalendarCacheSingle } from "./CalendarCacheSingle.js";
import { MinimalCalendarInterval } from "./CalendarIntervalMixin.js";
import { CalendarIntervalStore } from "./CalendarIntervalStore.js";
import { UnspecifiedTimeIntervalModel } from "./UnspecifiedTimeIntervalModel.js";
const hasMixin = Symbol('CalendarMixin');
export const CalendarMixin = (base) => {
    class CalendarMixin extends base {
        constructor() {
            super(...arguments);
            this.version = 1;
        }
        [hasMixin]() { }
        *calculateSelf() {
            yield this.$.version;
            return this;
        }
        afterConstruct() {
            super.afterConstruct();
            const hoursPerDay = this.hoursPerDay;
            const daysPerWeek = this.daysPerWeek;
            const daysPerMonth = this.daysPerMonth;
            this.unitsInMs = {
                millisecond: 1,
                second: 1000,
                minute: 60 * 1000,
                hour: 60 * 60 * 1000,
                day: hoursPerDay * 60 * 60 * 1000,
                week: daysPerWeek * hoursPerDay * 60 * 60 * 1000,
                month: daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                quarter: 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000,
                year: 4 * 3 * daysPerMonth * hoursPerDay * 60 * 60 * 1000
            };
            this.intervalStore = new CalendarIntervalStore({
                calendar: this,
                modelClass: this.constructor.defaultConfig.calendarIntervalModelClass || MinimalCalendarInterval
            });
            if (this.intervals && this.intervals.length) {
                this.addIntervals(this.intervals);
            }
        }
        isDefault() {
            const project = this.getProject();
            if (project) {
                return this === project.defaultCalendar;
            }
            return false;
        }
        getDepth() {
            return this.childLevel + 1;
        }
        forEachAvailabilityInterval(options, func, scope) {
            return this.calendarCache.forEachAvailabilityInterval(options, func, scope);
        }
        accumulateWorkingTime(date, duration, unit, isForward) {
            if (duration === 0)
                return { finalDate: new Date(date), remainingDurationInMs: 0 };
            if (isNaN(duration))
                throw new Error("Invalid duration");
            let remainingDurationInMs = this.convertDuration(duration, unit, TimeUnit.Millisecond);
            let finalDate = date;
            this.forEachAvailabilityInterval(isForward ? { startDate: date, isForward: true } : { endDate: date, isForward: false }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                let result = true;
                if (calendarCacheInterval.getIsWorking()) {
                    const dstDiff = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset();
                    const diff = intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000;
                    if (remainingDurationInMs <= diff) {
                        finalDate = isForward
                            ?
                                new Date(intervalStartDate.getTime() + remainingDurationInMs)
                            :
                                new Date(intervalEndDate.getTime() - remainingDurationInMs);
                        remainingDurationInMs = 0;
                        result = false;
                    }
                    else {
                        finalDate = isForward ? intervalEndDate : intervalStartDate;
                        remainingDurationInMs -= diff;
                    }
                }
                return result;
            });
            return { finalDate: new Date(finalDate), remainingDurationInMs: remainingDurationInMs };
        }
        calculateDuration(startDate, endDate, unit) {
            let duration = 0;
            this.forEachAvailabilityInterval({ startDate: startDate, endDate: endDate }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                if (calendarCacheInterval.getIsWorking()) {
                    const dstDiff = intervalStartDate.getTimezoneOffset() - intervalEndDate.getTimezoneOffset();
                    duration += intervalEndDate.getTime() - intervalStartDate.getTime() + dstDiff * 60 * 1000;
                }
            });
            return this.convertDuration(duration, TimeUnit.Millisecond, unit);
        }
        calculateEndDate(startDate, duration, unit) {
            const res = this.accumulateWorkingTime(startDate, duration, unit, true);
            return res.remainingDurationInMs === 0 ? res.finalDate : null;
        }
        calculateStartDate(endDate, duration, unit) {
            const res = this.accumulateWorkingTime(endDate, duration, unit, false);
            return res.remainingDurationInMs === 0 ? res.finalDate : null;
        }
        skipNonWorkingTime(date, isForward = true) {
            let workingDate;
            this.forEachAvailabilityInterval(isForward ? { startDate: date, isForward: true } : { endDate: date, isForward: false }, (intervalStartDate, intervalEndDate, calendarCacheInterval) => {
                if (calendarCacheInterval.getIsWorking()) {
                    workingDate = isForward ? intervalStartDate : intervalEndDate;
                    return false;
                }
            });
            return workingDate ? new Date(workingDate) : new Date(date);
        }
        convertDuration(duration, fromUnit, toUnit) {
            let result = duration;
            if (fromUnit !== toUnit) {
                result = duration * this.unitsInMs[fromUnit] / this.unitsInMs[toUnit];
            }
            return result;
        }
        addInterval(interval) {
            return this.addIntervals([interval]);
        }
        addIntervals(intervals) {
            this.bumpVersion();
            return this.intervalStore.add(intervals);
        }
        bumpVersion() {
            this.clearCache();
            this.version++;
        }
        get calendarCache() {
            if (this.$calendarCache !== undefined)
                return this.$calendarCache;
            const unspecifiedTimeInterval = new UnspecifiedTimeIntervalModel({
                isWorking: this.unspecifiedTimeIsWorking
            });
            unspecifiedTimeInterval.calendar = this;
            return this.$calendarCache = new CalendarCacheSingle({
                calendar: this,
                unspecifiedTimeInterval: unspecifiedTimeInterval,
                intervalStore: this.intervalStore,
                parentCache: this.parent && !this.parent.isRoot ? this.parent.calendarCache : null
            });
        }
        clearCache() {
            this.$calendarCache && this.$calendarCache.clear();
            this.$calendarCache = undefined;
        }
        resetPriorityOfAllIntervals() {
            this.traverse((calendar) => {
                calendar.intervalStore.forEach((interval) => interval.resetPriority());
            });
        }
        appendChild(child) {
            let res = super.appendChild(child);
            if (!Array.isArray(res)) {
                res = [res];
            }
            res.forEach((r) => {
                r.bumpVersion();
                r.resetPriorityOfAllIntervals();
            });
            return res;
        }
        insertChild(child, before) {
            let res = super.insertChild(child, before);
            if (!Array.isArray(res)) {
                res = [res];
            }
            res.forEach((r) => {
                r.bumpVersion();
                r.resetPriorityOfAllIntervals();
            });
            return res;
        }
        joinProject() {
            super.joinProject();
            this.intervalStore.setProject(this.getProject());
        }
        leaveProject() {
            super.leaveProject();
            this.intervalStore.setProject(null);
        }
        isDayHoliday(day) {
            const startDate = DateHelper.clearTime(day), endDate = DateHelper.getNext(day, TimeUnit.Day);
            let hasWorkingTime = false;
            this.forEachAvailabilityInterval({ startDate, endDate, isForward: true }, (_intervalStartDate, _intervalEndDate, calendarCacheInterval) => {
                hasWorkingTime = calendarCacheInterval.getIsWorking();
                return !hasWorkingTime;
            });
            return !hasWorkingTime;
        }
        getDailyHolidaysRanges(startDate, endDate) {
            let result = [];
            startDate = DateHelper.clearTime(startDate);
            while (startDate < endDate) {
                if (this.isDayHoliday(startDate)) {
                    result.push({
                        startDate,
                        endDate: DateHelper.getStartOfNextDay(startDate, true, true)
                    });
                }
                startDate = DateHelper.getNext(startDate, TimeUnit.Day);
            }
            return result;
        }
    }
    __decorate([
        field({ persistent: false })
    ], CalendarMixin.prototype, "version", void 0);
    __decorate([
        model_field({ type: 'string' })
    ], CalendarMixin.prototype, "name", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 24 })
    ], CalendarMixin.prototype, "hoursPerDay", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 7 })
    ], CalendarMixin.prototype, "daysPerWeek", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 30 })
    ], CalendarMixin.prototype, "daysPerMonth", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: true })
    ], CalendarMixin.prototype, "unspecifiedTimeIsWorking", void 0);
    __decorate([
        model_field()
    ], CalendarMixin.prototype, "intervals", void 0);
    return CalendarMixin;
};
export const BuildMinimalCalendar = (base = Model) => CalendarMixin(PartOfProjectMixin(PartOfProjectGenericMixin(Entity(base))));
export class MinimalCalendar extends BuildMinimalCalendar() {
}
export const hasCalendarMixin = (record) => Boolean(record && record[hasMixin]);
//# sourceMappingURL=CalendarMixin.js.map