import { stripDuplicates } from "../util/StripDuplicates.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { CalendarMixin } from "./CalendarMixin.js"


export class CalendarCacheInterval {
    intervals                       : CalendarIntervalMixin[] = []

    calendar                        : CalendarMixin

    private isWorking               : boolean


    constructor (config? : Partial<CalendarCacheInterval>) {
        config && Object.assign(this, config)

        if (!this.calendar) throw new Error("Required attribute `calendar` is missing")
    }


    includeInterval (interval : CalendarIntervalMixin) : CalendarCacheInterval {
        if (this.intervals.indexOf(interval) == -1) {
            const copy  = this.intervals.slice()

            copy.push(interval)

            return new CalendarCacheInterval({ intervals : copy, calendar : this.calendar })
        } else
            return this
    }


    combineWith (interval : CalendarCacheInterval) : CalendarCacheInterval {
        return new CalendarCacheInterval({ intervals : this.intervals.concat(interval.intervals), calendar : this.calendar })
    }


    // only valid for single calendar (possibly with parent calendars)
    getIsWorking () : boolean {
        if (this.isWorking != null) return this.isWorking

        const intervals = this.intervals = this.normalizeIntervals(this.intervals)

        // return the value of the interval with the highest priority
        return this.isWorking = intervals[ 0 ].isWorking
    }


    normalizeIntervals (intervals : CalendarIntervalMixin[]) : CalendarIntervalMixin[] {
        const filtered  = stripDuplicates(intervals)

        // sort in decreasing order
        filtered.sort((interval1, interval2) => interval2.getPriorityField() - interval1.getPriorityField())

        return filtered
    }
}
