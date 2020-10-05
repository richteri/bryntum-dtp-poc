import { model_field } from "../chrono/ModelFieldAtom.js"
import { MinimalCalendarInterval } from "./CalendarIntervalMixin.js"
import { CalendarMixin } from "./CalendarMixin.js"


// Calendar interval model denoting unspecified interval
export class UnspecifiedTimeIntervalModel extends MinimalCalendarInterval {
    calendar        : CalendarMixin

    @model_field({ type : 'number', defaultValue : 10 })
    priority        : number

    // TODO: why it overrides the method, is it configured with calendar instance directly?
    getCalendar () : CalendarMixin {
        return this.calendar
    }

    // NOTE: See parent class implementation for further comments
    getPriorityField () {
        if (this.priorityField != null) return this.priorityField

        return this.priorityField = this.getCalendar().getDepth()
    }
}
