var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity } from "../../ChronoGraph/replica/Entity.js";
import Model from "../../Core/data/Model.js";
import { dateConverter, model_field } from "../chrono/ModelFieldAtom.js";
import { ChronoModelMixin } from "../data/model/mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "../data/model/mixin/PartOfProjectMixin.js";
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js";
import later from "../vendor/later/later.js";
export const CalendarIntervalMixin = (base) => {
    class CalendarIntervalMixin extends base {
        getCalendar() {
            return this.stores[0].calendar;
        }
        resetPriority() {
            this.priorityField = null;
        }
        getPriorityField() {
            if (this.priorityField != null)
                return this.priorityField;
            let base = 10000 + this.getCalendar().getDepth() * 100;
            let priority = this.priority;
            if (priority == null) {
                priority = this.isRecurrent() ? 20 : 30;
            }
            return this.priorityField = base + priority;
        }
        isRecurrent() {
            return Boolean(this.recurrentStartDate && this.recurrentEndDate && this.getStartDateSchedule() && this.getEndDateSchedule());
        }
        isStatic() {
            return Boolean(this.startDate && this.endDate);
        }
        parseDateSchedule(schedule) {
            if (schedule && schedule !== Object(schedule)) {
                schedule = later.parse.text(schedule);
                if (schedule !== Object(schedule) || schedule.error > 0) {
                    try {
                        schedule = JSON.parse(schedule);
                    }
                    catch (e) {
                        return null;
                    }
                }
            }
            return schedule;
        }
        getStartDateSchedule() {
            if (this.startDateSchedule)
                return this.startDateSchedule;
            const schedule = this.parseDateSchedule(this.recurrentStartDate);
            return this.startDateSchedule = later.schedule(schedule);
        }
        getEndDateSchedule() {
            if (this.endDateSchedule)
                return this.endDateSchedule;
            const schedule = this.parseDateSchedule(this.recurrentEndDate);
            return this.endDateSchedule = later.schedule(schedule);
        }
    }
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ' }, { converter: dateConverter })
    ], CalendarIntervalMixin.prototype, "startDate", void 0);
    __decorate([
        model_field({ type: 'date', dateFormat: 'YYYY-MM-DDTHH:mm:ssZ' }, { converter: dateConverter })
    ], CalendarIntervalMixin.prototype, "endDate", void 0);
    __decorate([
        model_field({ type: 'string' })
    ], CalendarIntervalMixin.prototype, "recurrentStartDate", void 0);
    __decorate([
        model_field({ type: 'string' })
    ], CalendarIntervalMixin.prototype, "recurrentEndDate", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: false })
    ], CalendarIntervalMixin.prototype, "isWorking", void 0);
    __decorate([
        model_field({ type: 'number' })
    ], CalendarIntervalMixin.prototype, "priority", void 0);
    return CalendarIntervalMixin;
};
export const BuildMinimalCalendarInterval = (base = Model) => CalendarIntervalMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(base)))));
export class MinimalCalendarInterval extends BuildMinimalCalendarInterval() {
}
//# sourceMappingURL=CalendarIntervalMixin.js.map