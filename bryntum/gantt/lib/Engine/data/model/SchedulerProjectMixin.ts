import Model from "../../../Core/data/Model.js";
import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js";
import { ProjectMixin, BuildMinimalProject } from "./ProjectMixin.js";
import { ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js";
import { SchedulerEvent } from "./event/SchedulerEvent.js";
import { ProjectType } from "../../scheduling/Types.js";

export const SchedulerProjectMixin = <T extends AnyConstructor<ProjectMixin>>(base : T) => {

    class SchedulerProjectMixin extends base {

        // eventModelClass : AnyConstructor<SchedulerEvent>
        //
        // getType() {
        //     return ProjectType.Scheduler
        // }
        //
        // * calculateStartDateInitial () : ChronoIterator<Date> {
        //     return this.startDate
        // }
        //
        //
        // * calculateEndDateInitial () : ChronoIterator<Date> {
        //     return this.endDate
        // }
        //
        //
        // * calculateStartDate () : ChronoIterator<Date | boolean> {
        //     return yield* this.calculateMinChildrenStartDate()
        // }
        //
        //
        // * calculateEndDate () : ChronoIterator<Date | boolean> {
        //     return yield* this.calculateMaxChildrenEndDate()
        // }
        //
        //
        // protected * calculateEarlyStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {
        //     return []
        // }
        //
        //
        // protected * calculateEarlyEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     return []
        // }
        //
        //
        // protected * calculateLateStartDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     return []
        // }
        //
        //
        // protected * calculateLateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //     return []
        // }
        //
        // getDefaultEventModelClass() : this['eventModelClass'] {
        //     return SchedulerEvent
        // }
    }

    return SchedulerProjectMixin
}


/**
 * Scheduler project mixin type
 *
 * Contains logic specific to Scheduler projects.
 */
export interface SchedulerProjectMixin extends Mixin<typeof SchedulerProjectMixin> {}


/**
 * Function to build a minimal possible [[SchedulerProjectMixin]] class
 */
export const BuildMinimalSchedulerProject = (base : typeof Model = Model) : MixinConstructor<typeof SchedulerProjectMixin> =>
    SchedulerProjectMixin(
    BuildMinimalProject(
        base
    ))


/**
 * Minimal possible [[SchedulerProjectMixin]] class.
 */
export class MinimalSchedulerProject extends BuildMinimalSchedulerProject() {}
