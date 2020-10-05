import { AnyConstructor, Mixin, MixinConstructor } from "../../ChronoGraph/class/Mixin.js"
import { Entity } from "../../ChronoGraph/replica/Entity.js"
import Model from "../../Core/data/Model.js"
import { dateConverter, model_field } from "../chrono/ModelFieldAtom.js"
import { ChronoModelMixin } from "../data/model/mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "../data/model/mixin/PartOfProjectMixin.js"
import { PartOfProjectGenericMixin } from "../data/PartOfProjectGenericMixin.js"
import later from "../vendor/later/later.js"
import { CalendarIntervalStore } from "./CalendarIntervalStore.js"
import { CalendarMixin } from "./CalendarMixin.js"

// TODO: turn it to normal class, no need for it tobe mixin
export const CalendarIntervalMixin = <T extends AnyConstructor<PartOfProjectMixin>>(base : T) => {

    class CalendarIntervalMixin extends base {
        stores                          : CalendarIntervalStore[]

        protected priorityField         : number
        private startDateSchedule       : any
        private endDateSchedule         : any

        /**
         * The start date of the fixed (not recurrent) time interval.
         */
        @model_field({ type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ' }, { converter : dateConverter })
        startDate                       : Date

        /**
         * The end date of the fixed (not recurrent) time interval.
         */
        @model_field({ type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ' }, { converter : dateConverter })
        endDate                         : Date

        /**
         * The start date of the recurrent time interval. Should be specified as any expression, recognized
         * by the excellent [later](http://bunkat.github.io/later/) library.
         */
        @model_field({ type : 'string' })
        recurrentStartDate              : string

        /**
         * The end date of the recurrent time interval. Should be specified as any expression, recognized
         * by the excellent [later](http://bunkat.github.io/later/) library.
         */
        @model_field({ type : 'string' })
        recurrentEndDate                : string

        /**
         * The "is working" flag, which defines what kind of interval this is - either working or non-working. Default value is `false`,
         * denoting non-working intervals.
         */
        @model_field({ type : 'boolean', defaultValue : false })
        isWorking                       : boolean

        @model_field({ type : 'number' }) // number in [ 1, 9 ] range
        priority                        : number


        getCalendar () : CalendarMixin {
            return this.stores[ 0 ].calendar
        }


        resetPriority () {
            this.priorityField       = null
        }


        // not just `getPriority` to avoid clash with auto-generated getter in the subclasses
        getPriorityField () {
            if (this.priorityField != null) return this.priorityField

            // 0 - 10000 interval is reserved for "unspecified time" intervals
            // then 10000 - 10100, 10100-10200, ... etc intervals are for the calendars at depth 0, 1, ... etc
            let base        = 10000 + this.getCalendar().getDepth() * 100

            let priority    = this.priority

            if (priority == null) {
                // recurrent intervals are considered "base" and have lower priority
                // static intervals are considered special case overrides and have higher priority
                priority    = this.isRecurrent() ? 20 : 30
            }

            // intervals from parent calendars will have lower priority
            return this.priorityField = base + priority
        }


        /**
         * Whether this interval is recurrent (both `recurrentStartDate` and `recurrentEndDate` are present and parsed correctly
         * by the `later` library)
         */
        isRecurrent () : boolean {
            return Boolean(this.recurrentStartDate && this.recurrentEndDate && this.getStartDateSchedule() && this.getEndDateSchedule())
        }


        /**
         * Whether this interval is static - both `startDate` and `endDate` are present.
         */
        isStatic () : boolean {
            return Boolean(this.startDate && this.endDate)
        }

        /**
         * Helper method to parse recurrentStartDate and recurrentEndDate field values.
         * @param {Object|string} schedule Recurrence schedule
         * @returns {Object} Processed schedule ready to be used by later.schedule() method.
         * @private
         */
        parseDateSchedule (schedule) {
            if (schedule && schedule !== Object(schedule)) {
                schedule        = later.parse.text(schedule)

                if (schedule !== Object(schedule) || schedule.error > 0) {
                    // can be provided as JSON text
                    try {
                        schedule    = JSON.parse(schedule)
                    } catch (e) {
                        return null
                    }
                }
            }

            return schedule
        }

        getStartDateSchedule () {
            if (this.startDateSchedule) return this.startDateSchedule

            const schedule = this.parseDateSchedule(this.recurrentStartDate)

            return this.startDateSchedule = later.schedule(schedule)
        }


        getEndDateSchedule () {
            if (this.endDateSchedule) return this.endDateSchedule

            const schedule = this.parseDateSchedule(this.recurrentEndDate)

            return this.endDateSchedule = later.schedule(schedule)
        }
    }

    return CalendarIntervalMixin
}

/**
 * This is a calendar interval mixin.
 *
 * Can be either a specific time interval (if [[startDate]]/[[endDate]] are specified) or recurrent time interval
 * ([[recurrentStartDate]]/[[recurrentEndDate]]).
 *
 * By default it defines a non-working period ("isWorking" field has default value `false`),
 * but can also define an explicit working time, for example to override some previous period.
 *
 * You probably don't need to create instances of this mixin directly, instead you pass its configuration object to the [[CalendarMixin.addInterval]]
 *
 *
 */
export interface CalendarIntervalMixin extends Mixin<typeof CalendarIntervalMixin> {}


/**
 * Function to build a minimal possible `CalendarIntervalMixin` class
 */
export const BuildMinimalCalendarInterval = (base : typeof Model = Model) : MixinConstructor<typeof CalendarIntervalMixin> =>
    (CalendarIntervalMixin as any)(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    ChronoModelMixin(
    Entity(
        base
    )))))


/**
 * Minimal calendar interval model class
 */
export class MinimalCalendarInterval extends BuildMinimalCalendarInterval() {}
