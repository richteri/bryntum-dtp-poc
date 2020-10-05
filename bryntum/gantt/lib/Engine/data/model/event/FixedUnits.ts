// import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom"
// import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
// import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
// import { Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
// import { AssignmentMixin } from "../AssignmentMixin.js"
// import { HasAssignments } from "./HasAssignments.js"
//
//
// export const FixedUnits = <T extends AnyConstructor<HasAssignments>>(base : T) => {
//
//     class FixedUnits extends base {
//
//         * shouldRecalculateDuration () : ChronoIterator<boolean> {
//             const schedulingMode : SchedulingMode     = yield this.$.schedulingMode
//             const assigned : this[ 'assigned' ]    = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedUnits && assigned.size > 0) {
//                 if (this.$.duration.value == null) return true
//
//                 if (this.$.effort.hasProposedValue()) return true
//
//                 return !(yield* this.shouldRecalculateEffort())
//             }
//
//             return yield* super.shouldRecalculateDuration()
//         }
//
//
//         * shouldRecalculateEffort () : ChronoIterator<boolean> {
//             const schedulingMode : SchedulingMode     = yield this.$.schedulingMode
//             const assigned : this[ 'assigned' ]    = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedUnits && assigned.size > 0) {
//                 if (this.$.effort.value == null && (yield* this.canRecalculateEffort())) return true
//
//                 if (this.$.duration.hasProposedValue()) return true
//
//                 return !(yield this.$.effortDriven)
//             }
//
//             return yield* super.shouldRecalculateEffort()
//         }
//
//
//         addAssignment (assignment : AssignmentMixin) {
//             if (this.schedulingMode === SchedulingMode.FixedUnits) {
//                 this.markAsNeedRecalculation(this.effortDriven ? this.$.duration : this.$.effort)
//             }
//
//             return super.addAssignment(assignment)
//         }
//
//
//         removeAssignment (assignment : AssignmentMixin) {
//             if (this.schedulingMode === SchedulingMode.FixedUnits) {
//                 this.markAsNeedRecalculation(this.effortDriven ? this.$.duration : this.$.effort)
//             }
//
//             return super.removeAssignment(assignment)
//         }
//
//
//         async setEffort (duration : Duration, unit? : TimeUnit) : Promise<PropagationResult> {
//             if (this.schedulingMode === SchedulingMode.FixedUnits) {
//                 this.markAsNeedRecalculation(this.$.duration)
//             }
//
//             return super.setEffort(duration, unit)
//         }
//
//
//         async setDuration (duration : Duration, unit? : TimeUnit, ...args : any[]) : Promise<PropagationResult> {
//             if (this.schedulingMode === SchedulingMode.FixedUnits) {
//                 this.markAsNeedRecalculation(this.$.effort)
//             }
//
//             return super.setDuration(duration, unit, ...args)
//         }
//
//
//         * useDurationForProjectedXDateCalculation () : ChronoIterator<boolean> {
//             const schedulingMode : SchedulingMode = yield this.$.schedulingMode
//             const assigned : this[ 'assigned' ]   = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedUnits && assigned.size > 0) {
//                 const effortDriven : boolean = yield this.$.effortDriven
//
//                 // if user there's a user input for duration - we should calculate based on that
//                 return (!effortDriven || !this.$.effort.hasValue() || this.$.duration.hasProposedValue())
//                     // this means:
//                     // 1) this is not a initial data calculation (hasConsistentValue)
//                     // 2) there's a user input for duration (hasProposedValue)
//                     && (!this.$.effort.hasProposedValue() || !this.$.effort.hasConsistentValue())
//             }
//
//             return yield* super.useDurationForProjectedXDateCalculation()
//         }
//     }
//
//     return FixedUnits
// }
//
//
// /**
//  * This mixin provides the support for the "fixed units" scheduling mode.
//  *
//  * In this mode, the duration of the event is based on its effort.
//  * Also, when the effort is set, the assignment units of the event's assignments
//  * are kept "fixed" and the other free variable - duration is updated instead.
//  */
// export interface FixedUnits extends Mixin<typeof FixedUnits> {}
