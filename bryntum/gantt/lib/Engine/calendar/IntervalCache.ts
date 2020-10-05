import { MAX_DATE, MIN_DATE } from "../util/Constants.js"
import { IndexPosition, SortedMap } from "./SortedMap.js"

export interface CacheInterval<T> {
    startDateIndex  : number

    startDate       : Date
    endDate         : Date,

    cacheInterval   : T
}

export enum EdgeInclusion {
    Left,
    Right
}

export class IntervalCache<IntervalT, CombineWithIntervalT = IntervalT> {
    points                  : SortedMap<Date, IntervalT> = new SortedMap((a, b) => a.getTime() - b.getTime())

    leftInfinityKey         : Date = MIN_DATE
    rightInfinityKey        : Date = MAX_DATE

    emptyInterval           : IntervalT

    combineIntervalsFn      : (interval1 : IntervalT, interval2 : CombineWithIntervalT) => IntervalT


    constructor (config : Partial<IntervalCache<IntervalT, CombineWithIntervalT>>) {
        Object.assign(this, config)

        if (this.emptyInterval === undefined || !this.combineIntervalsFn)
            throw new Error("All of `emptyPoint`, `combineIntervalsFn` are required")

        this.points.set(this.leftInfinityKey, this.emptyInterval)
    }


    size () : number {
        return this.points.size()
    }


    indexOf (date : Date) {
        return this.points.indexOfKey(date)
    }


    getDateAt (index : number) : Date {
        return this.points.getKeyAt(index)
    }


    getPointAt (index : number) {
        return this.points.getValueAt(index)
    }


    getIntervalOf (date : Date, edgeInclusion : EdgeInclusion = EdgeInclusion.Left) : CacheInterval<IntervalT> {
        // the `index` here is guaranteed to be > 0, because at index 0 there's a `emptyPoint`
        let { found, index }    = this.indexOf(date)

        let startDateIndex : number

        if (edgeInclusion === EdgeInclusion.Left) {
            startDateIndex      = found === IndexPosition.Exact ? index : index - 1
        } else {
            startDateIndex      = index - 1
        }

        return this.getIntervalWithStartDateIndex(startDateIndex)
    }


    getPrevInterval (interval : CacheInterval<IntervalT>) : CacheInterval<IntervalT> | null {
        if (interval.startDateIndex === 0) return null

        return this.getIntervalWithStartDateIndex(interval.startDateIndex - 1)
    }


    getNextInterval (interval : CacheInterval<IntervalT>) : CacheInterval<IntervalT> | null {
        if (interval.startDateIndex >= this.size() - 1) return null

        return this.getIntervalWithStartDateIndex(interval.startDateIndex + 1)
    }


    getIntervalWithStartDateIndex (startDateIndex : number) : CacheInterval<IntervalT> {
        return {
            startDateIndex  : startDateIndex,

            startDate       : this.getDateAt(startDateIndex),
            endDate         : startDateIndex + 1 < this.size() ? this.getDateAt(startDateIndex + 1) : this.rightInfinityKey,

            cacheInterval   : this.getPointAt(startDateIndex)
        }
    }


    addInterval (startDate : Date, endDate : Date, extendInterval : (existingInterval : IntervalT) => IntervalT) {
        const points        = this.points

        // there is always "leftInfinityKey" empty point, so `index >= 0`
        const { found, index } = points.indexOfKey(startDate)

        let curIndex : number
        let lastUpdatedPoint : IntervalT

        if (found == IndexPosition.Exact) {
            const inclusion     = extendInterval(lastUpdatedPoint = points.getValueAt(index))

            points.setValueAt(index, inclusion)

            curIndex            = index + 1

        } else {
            const inclusion     = extendInterval(lastUpdatedPoint = points.getValueAt(index - 1))

            points.insertAt(index, startDate, inclusion)

            curIndex            = index + 1
        }

        while (curIndex < points.size()) {
            const curDate       = points.getKeyAt(curIndex)

            if (curDate.getTime() >= endDate.getTime()) break

            const inclusion     = extendInterval(lastUpdatedPoint = points.getValueAt(curIndex))

            points.setValueAt(curIndex, inclusion)

            curIndex++
        }

        if (curIndex === points.size()) {
            points.insertAt(points.size(), endDate, this.emptyInterval)
        } else {
            const curDate       = points.getKeyAt(curIndex)

            if (curDate.getTime() === endDate.getTime()) {
                // we advanced till some point, which matches `endDate` config
                // this point will setup a new label, no need to add an explicit end date point,
                // we are done, do nothing
            } else {
                points.insertAt(curIndex, endDate, lastUpdatedPoint)
            }
        }
    }


    includeWrappingRange (intervalCache : IntervalCache<CombineWithIntervalT, any>, startDate : Date, endDate : Date) {
        let interval    = intervalCache.getIntervalOf(startDate)

        while (interval) {
            this.addInterval(
                interval.startDate,
                interval.endDate,
                existingInterval => this.combineIntervalsFn(existingInterval, interval.cacheInterval)
            )

            if (interval.endDate.getTime() > endDate.getTime()) break

            interval    = intervalCache.getNextInterval(interval)
        }
    }


    getSummary () {
        return this.points.map((label, date) => { return { label, date } })
    }


    clear () {
        this.points.clear()

        this.points.set(this.leftInfinityKey, this.emptyInterval)
    }
}
