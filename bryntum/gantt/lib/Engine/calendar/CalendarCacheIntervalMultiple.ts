import { stripDuplicates } from "../util/StripDuplicates.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarIntervalMixin } from "./CalendarIntervalMixin.js"
import { CalendarMixin } from "./CalendarMixin.js"


export class CalendarCacheIntervalMultiple {
    intervalGroups                  : Array<[ CalendarMixin, CalendarCacheInterval ]> = []

    intervalsByCalendar             : Map<CalendarMixin, CalendarIntervalMixin[]>

    private calendarsWorkStatus     : Map<CalendarMixin, boolean>
    private calendars               : CalendarMixin[]
    private calendarsWorking        : CalendarMixin[]
    private calendarsNonWorking     : CalendarMixin[]

    private isWorkingForSome        : boolean
    private isWorkingForEvery       : boolean


    constructor (config? : Partial<CalendarCacheIntervalMultiple>) {
        config && Object.assign(this, config)
    }


    combineWith (interval : CalendarCacheInterval) : CalendarCacheIntervalMultiple {
        const copy      = this.intervalGroups.slice()

        copy.push([ interval.calendar, interval ])

        return new CalendarCacheIntervalMultiple({ intervalGroups : copy })
    }


    getIsWorkingForEvery () {
        if (this.isWorkingForEvery != null) return this.isWorkingForEvery

        for (let [ _calendar, intervals ] of this.getGroups()) {
            if (!intervals[ 0 ].isWorking) return this.isWorkingForEvery = false
        }

        return this.isWorkingForEvery = true
    }


    getIsWorkingForSome () {
        if (this.isWorkingForSome != null) return this.isWorkingForSome

        for (let [ _calendar, intervals ] of this.getGroups()) {
            if (intervals[ 0 ].isWorking) return this.isWorkingForSome = true
        }

        return this.isWorkingForSome = false
    }


    getCalendars () : CalendarMixin[] {
        this.getGroups()

        return this.calendars
    }


    isCalendarWorking (calendar : CalendarMixin) : boolean {
        return this.getCalendarsWorkStatus().get(calendar)
    }


    getCalendarsWorkStatus () : Map<CalendarMixin, boolean> {
        if (this.calendarsWorkStatus) return this.calendarsWorkStatus

        const res   = new Map()

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            res.set(calendar, intervals[ 0 ].isWorking)
        }

        return this.calendarsWorkStatus = res
    }


    getCalendarsWorking () : CalendarMixin[] {
        if (this.calendarsWorking) return this.calendarsWorking

        const calendars     = []

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            if (intervals[ 0 ].isWorking) calendars.push(calendar)
        }

        return this.calendarsWorking = calendars
    }


    getCalendarsNonWorking () : CalendarMixin[] {
        if (this.calendarsNonWorking) return this.calendarsNonWorking

        const calendars     = []

        for (let [ calendar, intervals ] of this.getGroups()) {
            // TODO: fix types
            if (!intervals[ 0 ].isWorking) calendars.push(calendar)
        }

        return this.calendarsNonWorking = calendars
    }


    getGroups () : Map<CalendarMixin, CalendarIntervalMixin[]> {
        if (this.intervalsByCalendar) return this.intervalsByCalendar

        const calendars = this.calendars = []

        const intervalsByCalendar = new Map<CalendarMixin, CalendarIntervalMixin[]>()

        this.intervalGroups.forEach(([ calendar, interval ]) => {

            let data            = intervalsByCalendar.get(calendar)

            if (!data) {
                calendars.push(calendar)

                data            = []

                intervalsByCalendar.set(calendar, data)
            }

            data.push.apply(data, interval.intervals)
        })

        intervalsByCalendar.forEach((intervals, calendar) => {
            const unique    = stripDuplicates(intervals)

            unique.sort(
                // sort in decreasing order
                (interval1, interval2) => interval2.getPriorityField() - interval1.getPriorityField()
            )

            intervalsByCalendar.set(calendar, unique)
        })

        return this.intervalsByCalendar = intervalsByCalendar
    }
}
