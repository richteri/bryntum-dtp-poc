import { stripDuplicates } from "../util/StripDuplicates.js"
import { CalendarCache } from "./CalendarCache.js"
import { CalendarCacheInterval } from "./CalendarCacheInterval.js"
import { CalendarCacheIntervalMultiple } from "./CalendarCacheIntervalMultiple.js"
import { CalendarCacheSingle } from "./CalendarCacheSingle.js"
import { CalendarMixin } from "./CalendarMixin.js"
import { IntervalCache } from "./IntervalCache.js"


export class CalendarCacheMultiple extends CalendarCache<CalendarCacheIntervalMultiple, CalendarCacheInterval> {

    calendarCaches          : CalendarCacheSingle[]


    constructor (config? : Partial<CalendarCacheMultiple>) {
        super(config)

        this.calendarCaches = stripDuplicates(this.calendarCaches)

        this.intervalCache = new IntervalCache({

            emptyInterval       : new CalendarCacheIntervalMultiple(),

            combineIntervalsFn  : (interval1, interval2) => {
                return interval1.combineWith(interval2)
            }
        })
    }


    fillCache (startDate : Date, endDate : Date) {
        this.calendarCaches.forEach(calendarCache => {
            calendarCache.fillCache(startDate, endDate)

            this.includeWrappingRangeFrom(calendarCache, startDate, endDate)
        })
    }
}


const COMBINED_CALENDARS_CACHE : Map<string, { versionsHash : string, cache : CalendarCacheMultiple }> = new Map()

export const combineCalendars = (calendars : CalendarMixin[]) : CalendarCacheMultiple => {
    const uniqueOnly    = stripDuplicates(calendars)

    if (uniqueOnly.length === 0) throw new Error("No calendars to combine")

    uniqueOnly.sort(( calendar1, calendar2 ) => {
        if (calendar1.internalId < calendar2.internalId)
            return -1
        else
            return 1
    })

    const hash          = uniqueOnly.map(calendar => calendar.internalId + '/').join('')
    const versionsHash  = uniqueOnly.map(calendar => calendar.version + '/').join('')

    let cached          = COMBINED_CALENDARS_CACHE.get(hash)

    let res : CalendarCacheMultiple

    if (cached && cached.versionsHash === versionsHash)
        res             = cached.cache
    else {
        res             = new CalendarCacheMultiple({ calendarCaches : uniqueOnly.map(calendar => calendar.calendarCache ) })

        COMBINED_CALENDARS_CACHE.set(hash, {
            versionsHash    : versionsHash,
            cache           : res
        })
    }

    return res
}
