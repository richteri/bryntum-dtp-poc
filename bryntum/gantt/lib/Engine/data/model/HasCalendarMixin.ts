import { ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { calculate } from "../../../ChronoGraph/replica/Entity.js"
import { isAtomicValue } from '../../../ChronoGraph/util/Helper.js'
import { CalendarMixin } from "../../calendar/CalendarMixin.js"
import { model_field } from '../../chrono/ModelFieldAtom.js'
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js"
import { ProjectMixin } from "./ProjectMixin.js"

const hasMixin = Symbol('HasCalendarMixin')

export const HasCalendarMixin = <T extends AnyConstructor<PartOfProjectMixin>>(base : T) => {

    class HasCalendarMixin extends base {
        [hasMixin] () {}

        // this atom is impure - can not be cached
        @model_field({ serialize : calendar => calendar && calendar.id })
        calendar            : CalendarMixin

        calendarInherited   : boolean       = true


        async setCalendar (calendar : CalendarMixin) : Promise<PropagationResult> {
            this.calendar   = calendar

            return this.propagate()
        }


        getCalendar () : CalendarMixin {
            return this.calendar
        }


        @calculate('calendar')
        * calculateCalendar (proposedValue? : CalendarMixin) : ChronoIterator<this[ 'calendar' ]> {
            const calendarManager = this.getCalendarManagerStore()
            let resolved, calendar

            // `proposedValue` can be `null`, with semantic - "remove own calendar"
            if (proposedValue != null) {
                if (isAtomicValue(proposedValue)) {
                    resolved  = calendarManager.getById(proposedValue) || null

                    proposedValue = resolved
                }

                this.calendarInherited  = false

                calendar = proposedValue

                // keep own, not inherited calendar, in the absence of proposed value
            } else if (proposedValue === undefined && this.$.calendar.hasConsistentValue() && !this.calendarInherited) {

                calendar                = this.$.calendar.getConsistentValue()

            // let's use the project calendar
            }

            if (calendar == null) {
                const project = this.getProject() as ProjectMixin
                // unless 'this' represents the project itself
                // @ts-ignore
                if (project !== this) {
                    calendar                = yield project.$.calendar

                    this.calendarInherited  = true
                }
            }

            // yield self-atom of the calendar - subscribe on the "version" change of the given calendar instance
            !isAtomicValue(calendar) && (yield calendar.$$)

            return calendar
        }
    }

    return HasCalendarMixin
}

export interface HasCalendarMixin extends Mixin<typeof HasCalendarMixin> {}
//export type HasCalendarMixin = Mixin<typeof HasCalendarMixin>

/**
 * HasCalendarMixin type guard
 */
export const hasHasCalendarMixin = (model : any) : model is HasCalendarMixin => Boolean(model && model[hasMixin])
