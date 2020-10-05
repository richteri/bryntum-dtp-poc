import { stripDuplicates } from "../util/StripDuplicates.js";
export class CalendarCacheIntervalMultiple {
    constructor(config) {
        this.intervalGroups = [];
        config && Object.assign(this, config);
    }
    combineWith(interval) {
        const copy = this.intervalGroups.slice();
        copy.push([interval.calendar, interval]);
        return new CalendarCacheIntervalMultiple({ intervalGroups: copy });
    }
    getIsWorkingForEvery() {
        if (this.isWorkingForEvery != null)
            return this.isWorkingForEvery;
        for (let [_calendar, intervals] of this.getGroups()) {
            if (!intervals[0].isWorking)
                return this.isWorkingForEvery = false;
        }
        return this.isWorkingForEvery = true;
    }
    getIsWorkingForSome() {
        if (this.isWorkingForSome != null)
            return this.isWorkingForSome;
        for (let [_calendar, intervals] of this.getGroups()) {
            if (intervals[0].isWorking)
                return this.isWorkingForSome = true;
        }
        return this.isWorkingForSome = false;
    }
    getCalendars() {
        this.getGroups();
        return this.calendars;
    }
    isCalendarWorking(calendar) {
        return this.getCalendarsWorkStatus().get(calendar);
    }
    getCalendarsWorkStatus() {
        if (this.calendarsWorkStatus)
            return this.calendarsWorkStatus;
        const res = new Map();
        for (let [calendar, intervals] of this.getGroups()) {
            res.set(calendar, intervals[0].isWorking);
        }
        return this.calendarsWorkStatus = res;
    }
    getCalendarsWorking() {
        if (this.calendarsWorking)
            return this.calendarsWorking;
        const calendars = [];
        for (let [calendar, intervals] of this.getGroups()) {
            if (intervals[0].isWorking)
                calendars.push(calendar);
        }
        return this.calendarsWorking = calendars;
    }
    getCalendarsNonWorking() {
        if (this.calendarsNonWorking)
            return this.calendarsNonWorking;
        const calendars = [];
        for (let [calendar, intervals] of this.getGroups()) {
            if (!intervals[0].isWorking)
                calendars.push(calendar);
        }
        return this.calendarsNonWorking = calendars;
    }
    getGroups() {
        if (this.intervalsByCalendar)
            return this.intervalsByCalendar;
        const calendars = this.calendars = [];
        const intervalsByCalendar = new Map();
        this.intervalGroups.forEach(([calendar, interval]) => {
            let data = intervalsByCalendar.get(calendar);
            if (!data) {
                calendars.push(calendar);
                data = [];
                intervalsByCalendar.set(calendar, data);
            }
            data.push.apply(data, interval.intervals);
        });
        intervalsByCalendar.forEach((intervals, calendar) => {
            const unique = stripDuplicates(intervals);
            unique.sort((interval1, interval2) => interval2.getPriorityField() - interval1.getPriorityField());
            intervalsByCalendar.set(calendar, unique);
        });
        return this.intervalsByCalendar = intervalsByCalendar;
    }
}
//# sourceMappingURL=CalendarCacheIntervalMultiple.js.map