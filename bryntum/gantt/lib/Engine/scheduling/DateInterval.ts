import { Base } from '../../ChronoGraph/class/Mixin.js'
import { MAX_DATE, MIN_DATE } from '../util/Constants.js'
import { EdgeInclusion } from "../util/Types.js"


export class DateInterval extends Base {

    startDate       : Date
    endDate         : Date


    initialize (...args) {
        super.initialize(...args)

        if (!this.startDate) this.startDate = MIN_DATE
        if (!this.endDate) this.endDate = MAX_DATE
    }


    startDateIsFinite () : boolean {
        return !this.isIntervalEmpty() && this.startDate.getTime() !== MIN_DATE.getTime()
    }


    endDateIsFinite () : boolean {
        return !this.isIntervalEmpty() && this.endDate.getTime() !== MAX_DATE.getTime()
    }


    containsDate (date : Date, edgeInclusion : EdgeInclusion = EdgeInclusion.Left) {
        return (
            (
                edgeInclusion === EdgeInclusion.Left && (date >= this.startDate && date < this.endDate)
            )
            ||
            (
                edgeInclusion === EdgeInclusion.Right && (date > this.startDate && date <= this.endDate)
            )
        )
    }


    isIntervalEmpty () : boolean {
        return this.startDate > this.endDate
    }


    intersect (another : DateInterval) : DateInterval {
        const anotherStart      = another.startDate
        const anotherEnd        = another.endDate
        const start             = this.startDate
        const end               = this.endDate

        // No intersection found
        if ((end < anotherStart) || (start > anotherEnd)) {
            // return an empty interval
            return EMPTY_INTERVAL
        }

        const newStart = new Date(Math.max(start.getTime(), anotherStart.getTime()))
        const newEnd   = new Date(Math.min(end.getTime(), anotherEnd.getTime()))

        return (this.constructor as typeof DateInterval).new({ startDate : newStart, endDate : newEnd })
    }
}

export const EMPTY_INTERVAL  = DateInterval.new({ startDate : MAX_DATE, endDate : MIN_DATE })


export const intersectIntervals = (dateIntervals : DateInterval[]) : DateInterval => {
    return dateIntervals.reduce((acc, currentInterval) => acc.intersect(currentInterval), DateInterval.new())
}
