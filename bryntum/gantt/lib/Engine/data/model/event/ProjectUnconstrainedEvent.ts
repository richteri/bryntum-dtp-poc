import { ConstrainedEvent } from "./ConstrainedEvent.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js";
import { DateInterval } from "../../../scheduling/DateInterval.js";
import { HasDependencies } from "./HasDependencies.js";
import { HasChildren } from "./HasChildren.js";
import { calculate } from "../../../../ChronoGraph/replica/Entity.js";
import { Duration } from "../../../scheduling/Types.js";

export const ProjectUnconstrainedEvent = <T extends AnyConstructor<HasDependencies & HasChildren>>(base : T) => {

    class ProjectUnconstrainedEvent extends base {

        // @calculate('manuallyScheduled')
        // * calculateManuallyScheduled (proposedValue : boolean) : ChronoIterator<boolean> {
        //     return  proposedValue || (yield this.$.incomingDeps).size === 0
        // }
        //
        // * calculateEarlyStartDateRaw () : ChronoIterator<Date | boolean> {
        //     const validInitialIntervals            = yield this.$.validInitialIntervals,
        //           startDateInterval : DateInterval = validInitialIntervals.startDateInterval
        //
        //     let result : Date = null
        //
        //     if (startDateInterval.startDateIsFinite()) {
        //         result = startDateInterval.startDate
        //     }
        //     else {
        //         const canCalculateProjectedXDate : boolean = yield* this.canCalculateProjectedXDate();
        //
        //         if (canCalculateProjectedXDate) {
        //             result = yield* this.calculateProjectedStartDate(yield this.$.endDateInitial)
        //         }
        //     }
        //
        //     return result
        //     // -----------------
        //     // return startDateInterval.startDateIsFinite() ? startDateInterval.startDate : yield this.$.startDate
        // }
        //
        // * calculateEarlyEndDateRaw () : ChronoIterator<Date | boolean> {
        //     const validInitialIntervals                = yield this.$.validInitialIntervals,
        //           endDateInterval : DateInterval       = validInitialIntervals.endDateInterval
        //
        //     let result : Date = null
        //
        //     if (endDateInterval.startDateIsFinite()) {
        //         result = endDateInterval.startDate
        //     }
        //     else {
        //         const canCalculateProjectedXDate : boolean = yield* this.canCalculateProjectedXDate();
        //
        //         if (canCalculateProjectedXDate) {
        //             result = yield* this.calculateProjectedEndDate(yield this.$.startDateInitial)
        //         }
        //     }
        //
        //     return result;
        //     // ----------------
        //     // return endDateInterval.startDateIsFinite() ? endDateInterval.startDate : yield this.$.endDate
        // }
        //
        // * calculateLateStartDateRaw () : ChronoIterator<Date | boolean> {
        //     const validInitialIntervals                = yield this.$.validInitialIntervals,
        //           startDateInterval : DateInterval     = validInitialIntervals.startDateInterval
        //
        //     let result : Date = null
        //
        //     if (startDateInterval.endDateIsFinite()) {
        //         result = startDateInterval.endDate
        //     }
        //     else {
        //         const canCalculateProjectedXDate : boolean = yield* this.canCalculateProjectedXDate();
        //
        //         if (canCalculateProjectedXDate) {
        //             result = yield* this.calculateProjectedStartDate(yield this.$.endDateInitial)
        //         }
        //     }
        //
        //     return result;
        //     //------------
        //     // return startDateInterval.endDateIsFinite() ? startDateInterval.endDate : yield this.$.startDate
        // }
        //
        // * calculateLateEndDateRaw () : ChronoIterator<Date | boolean> {
        //     const validInitialIntervals          = yield this.$.validInitialIntervals,
        //           endDateInterval : DateInterval = validInitialIntervals.endDateInterval
        //
        //     let result : Date = null;
        //
        //     if (endDateInterval.endDateIsFinite()) {
        //         result = endDateInterval.endDate;
        //     }
        //     else {
        //         const canCalculateProjectedXDate : boolean = yield* this.canCalculateProjectedXDate();
        //
        //         if (canCalculateProjectedXDate) {
        //             result = yield* this.calculateProjectedEndDate(yield this.$.startDateInitial)
        //         }
        //     }
        //
        //     return result;
        //     //------------
        //     // return endDateInterval.endDateIsFinite() ? endDateInterval.endDate : yield this.$.endDate
        // }
        //
        // * doCalculateDuration () : ChronoIterator<Duration> {
        //     let startDate : Date = null,
        //         endDate : Date = null;
        //
        //     if (this.$.startDate.hasProposedValue()) {
        //         startDate = this.$.startDate.proposedValue
        //     }
        //     else if (this.$.startDate.hasConsistentValue()) {
        //         startDate = this.startDate
        //     }
        //     else {
        //         startDate = yield this.$.startDate
        //     }
        //
        //     if (this.$.endDate.hasProposedValue()) {
        //         endDate = this.$.endDate.proposedValue
        //     }
        //     else if (this.$.endDate.hasConsistentValue()) {
        //         endDate = this.endDate
        //     }
        //     else {
        //         endDate = yield this.$.endDate
        //     }
        //
        //     return yield* this.calculateProjectedDuration(startDate, endDate)
        // }
    }

    return ProjectUnconstrainedEvent;
}

/**
 * This is a "project unconstrained event" mixin.
 *
 * It overrides methods in [[ConstrainedEvent]] mixin which takes project start/end dates into account and unties event
 * from constrain intervals defined by project start/end dates.
 */
export interface ProjectUnconstrainedEvent extends Mixin<typeof ProjectUnconstrainedEvent> {}
