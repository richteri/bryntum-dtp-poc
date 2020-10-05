import Model from "../../../Core/data/Model.js"
import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import { DateInterval } from "../../scheduling/DateInterval.js"
import { MAX_DATE, MIN_DATE } from "../../util/Constants.js"
import { ConstrainedLateEvent } from "./event/ConstrainedLateEvent.js"
import { HasChildren } from "./event/HasChildren.js"
import { HasEffort } from "./event/HasEffort.js"
import { ProjectMixin, BuildMinimalProject } from "./ProjectMixin.js"
import { GanttEvent } from "./event/GanttEvent.js"
import { ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js"
import { ConstraintInterval } from "./event/ConstrainedEvent.js"
import { CanCriticalPath } from "./event/CanCriticalPath.js"
import { Direction, ProjectType } from "../../scheduling/Types.js"

export const GanttProjectMixin = <T extends AnyConstructor<ProjectMixin & HasEffort & ConstrainedLateEvent>>(base : T) => {

    class GanttProjectMixin extends base {

        eventModelClass     : AnyConstructor<GanttEvent>

        getType () {
            return ProjectType.Gantt
        }

        // // the value of this atom is used for the project's constraint interval
        // * calculateStartDateInitial () : ChronoIterator<Date> {
        //     const proposedValue = this.$.startDate.proposedValue
        //
        //     if (proposedValue !== undefined) return proposedValue
        //
        //     return this.$.startDate.getConsistentValue() ? this.startDate : yield* this.calculateInitialMinChildrenStartDateDeep()
        // }
        //
        //
        // * calculateEndDateInitial () : ChronoIterator<Date> {
        //     const proposedValue = this.$.endDate.proposedValue
        //
        //     if (proposedValue !== undefined) return proposedValue
        //
        //     return this.$.endDate.getConsistentValue()
        // }
        //
        //
        // // TODO: This one - no intervals
        // protected * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {
        //     const intervals         = []
        //
        //     const startDate : Date = yield this.$.startDate
        //
        //     // TODO: need to think about resolution options
        //     startDate && intervals.push(ConstraintInterval.new({
        //         originDescription : 'the project start date',
        //         startDate
        //     }))
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateEarlyEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     // TODO for backward scheduling behavior is the opposite - `startDateConstraintIntervals` should
        //     // be empty and end date constrained by the project end date
        //     return []
        // }
        //
        //
        // protected * calculateLateStartDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     return []
        // }
        //
        //
        // // TODO: This one - no intervals
        // protected * calculateLateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     const intervals = []
        //
        //     const endDate : Date = yield this.$.endDateInitial
        //
        //     // TODO: need to think about resolution options
        //     endDate && intervals.push(ConstraintInterval.new({
        //         originDescription : 'the project end date',
        //         endDate
        //     }))
        //
        //     return intervals
        // }
        //
        // // Prevents start date calculation
        // // TODO: this should be done for forward scheduled projects only
        // * calculateStartDate (proposedValue : Date) : ChronoIterator<Date | boolean> {
        //     return proposedValue || this.$.startDate.getConsistentValue() || (yield this.$.startDateInitial)
        // }


        getDefaultEventModelClass () : this['eventModelClass'] {
            return GanttEvent
        }


        * calculateStartDate () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Forward) {
                let result : Date   =  this.$.startDate.proposedValue

                return result || this.$.startDate.getConsistentValue() || (yield* this.unsafeCalculateInitialMinChildrenStartDateDeep())
            }
            else if (direction === Direction.Backward) {
                return yield* this.calculateMinChildrenStartDate()
            }
        }


        * calculateEndDate () : ChronoIterator<Date> {
            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Forward) {
                return yield* this.calculateMaxChildrenEndDate()
            }
            else if (direction === Direction.Backward) {
                let result : Date   =  this.$.endDate.proposedValue

                return result || this.$.endDate.getConsistentValue() || (yield* this.unsafeCalculateInitialMaxChildrenEndDateDeep())
            }
        }


        * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<this[ 'earlyStartDateConstraintIntervals' ]> {
            const intervals : DateInterval[]    = yield* super.calculateEarlyStartDateConstraintIntervals()

            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Forward) {
                const startDate : Date              = yield this.$.startDate

                startDate && intervals.push(DateInterval.new({ startDate }))
            }
            else if (direction === Direction.Backward) {
                const startDate : Date              = yield this.$.lateStartDate

                startDate && intervals.push(DateInterval.new({ startDate }))
            }

            return intervals
        }


        * calculateLateEndDateConstraintIntervals () : ChronoIterator<this[ 'lateEndDateConstraintIntervals' ]> {
            const intervals : DateInterval[]    = yield* super.calculateLateEndDateConstraintIntervals()

            const direction : Direction     = yield this.$.direction

            if (direction === Direction.Forward) {
                const endDate : Date                = yield this.$.earlyEndDate

                endDate && intervals.push(DateInterval.new({ endDate }))
            }
            else if (direction === Direction.Backward) {
                const endDate : Date              = yield this.$.endDate

                endDate && intervals.push(DateInterval.new({ endDate }))
            }

            return intervals
        }


        // this method is only used to calculated "initial" project start date only
        * unsafeCalculateInitialMinChildrenStartDateDeep () : ChronoIterator<Date> {
            const childEvents : Set<HasChildren>    = yield this.$.childEvents

            // note, that we does not yield here, as we want to calculate "initial" project start date
            // which will be used only if there's no user input or explicit setting for it
            // such project date should be calculated as earliest date of all tasks, based on the
            // "initial" data (which includes proposed)
            if (!childEvents.size) return this.startDate

            let result : Date       = MAX_DATE,
                child : HasChildren

            const toProcess : HasChildren[]        = [...childEvents]

            while ((child = toProcess.shift())) {
                const childDate     = child.startDate

                if (childDate && childDate < result) result = childDate

                toProcess.push(...yield child.$.childEvents)
            }

            return (result.getTime() !== MIN_DATE.getTime() && result.getTime() !== MAX_DATE.getTime()) ? result : null
        }


        * unsafeCalculateInitialMaxChildrenEndDateDeep () : ChronoIterator<Date> {
            const childEvents : Set<HasChildren>    = yield this.$.childEvents

            // note, that we use "unsafe" ProposedOrPrevios effect here, because we only get into this method
            // if there's no user input for the project end date
            if (!childEvents.size) return this.endDate

            let result : Date       = MIN_DATE,
                child : HasChildren

            const toProcess : HasChildren[]        = [...childEvents]

            while ((child = toProcess.shift())) {
                const childDate     = child.endDate

                if (childDate && childDate > result) result = childDate

                toProcess.push(...yield child.$.childEvents)
            }

            return (result.getTime() !== MIN_DATE.getTime() && result.getTime() !== MAX_DATE.getTime()) ? result : null
        }

    }

    return GanttProjectMixin
}


/**
 * Gantt project mixin type
 *
 * Contains logic specific to Gantt projects. Restricts tasks to be inside project timespan.
 */
export interface GanttProjectMixin extends Mixin<typeof GanttProjectMixin> {}


/**
 * Function to build a minimal possible [[GanttProjectMixin]] class
 */
export const BuildMinimalGanttProject = (base : typeof Model = Model) : MixinConstructor<typeof GanttProjectMixin> =>
    (GanttProjectMixin as any)(
    CanCriticalPath(
    ConstrainedLateEvent(
    BuildMinimalProject(
        base
    ))))


/**
 * Minimal possible [[GanttProjectMixin]] class.
 */
export class MinimalGanttProject extends BuildMinimalGanttProject() {
    // Needed to separate configs from data, for tests to pass. Normally handled in ProjectModel outside of engine
    static get defaultConfig () {
        return {
            assignmentsData  : null,
            calendarsData    : null,
            dependenciesData : null,
            eventsData       : null,
            resourcesData    : null,
        }
    }

    static applyConfigs = true
}
