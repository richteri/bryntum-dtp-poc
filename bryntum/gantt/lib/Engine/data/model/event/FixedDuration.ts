// import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
// import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
// import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
// import { ReferenceBucketAtom } from "../../../../ChronoGraph/replica/Reference.js"
// import { Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
// import { AssignmentMixin, MinimalAssignment } from "../AssignmentMixin.js"
// import { HasAssignments } from "./HasAssignments.js"
//
//
// export const FixedDuration = <T extends AnyConstructor<HasAssignments>>(base : T) => {
//
//     class FixedDuration extends base {
//
//         * shouldRecalculateDuration () : ChronoIterator<boolean> {
//             const schedulingMode = yield this.$.schedulingMode
//             const assignments    = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedDuration && assignments.size) {
//                 if (this.$.duration.value == null) return true
//                 return false
//             }
//
//             return yield* super.shouldRecalculateDuration()
//         }
//
//
//         * shouldRecalculateEffort () : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//             const assignments       = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedDuration && assignments.size) {
//                 if (this.$.effort.value == null) return true
//
//                 return !(yield* this.shouldRecalculateDuration()) && !(yield* this.shouldRecalculateAssignmentUnits(null))
//             }
//
//             return yield* super.shouldRecalculateEffort()
//         }
//
//
//         * shouldRecalculateAssignmentUnits (assignment : MinimalAssignment) : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedDuration) {
//                 if (yield this.$.effortDriven) {
//                     if (this.$.effort.hasProposedValue() || this.$.duration.hasProposedValue()) {
//                         return true
//                     }
//
//                     if (
//                         ((this.$.assigned as ReferenceBucketAtom).newRefs.size > 0 || (this.$.assigned as ReferenceBucketAtom).oldRefs.size > 0)
//                         &&
//                         this.$.effort.value != null
//                     ) {
//                         return true
//                     }
//
//                     return false
//                 } else {
//                     return this.$.effort.hasProposedValue() && !this.$.duration.hasProposedValue()
//                 }
//             }
//
//             return yield* super.shouldRecalculateAssignmentUnits(assignment)
//         }
//
//
//         async setEffort (effort : Duration, unit? : TimeUnit) : Promise<PropagationResult> {
//             const schedulingMode    = this.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedDuration) {
//                 this.assigned.forEach((assignment : AssignmentMixin) => {
//                     this.markAsNeedRecalculation(assignment.$.units)
//                 })
//             }
//
//             return super.setEffort(effort, unit)
//         }
//
//
//         async setDuration (duration : Duration, unit? : TimeUnit) : Promise<PropagationResult> {
//             const schedulingMode    = this.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedDuration && this.effortDriven) {
//                 this.assigned.forEach((assignment : AssignmentMixin) => {
//                     this.markAsNeedRecalculation(assignment.$.units)
//                 })
//             }
//
//             return super.setDuration(duration, unit)
//         }
//
//
//         async setAssignmentUnits (assignment : AssignmentMixin, units : number) : Promise<PropagationResult> {
//             if (this.schedulingMode === SchedulingMode.FixedDuration) {
//                 assignment.$.units.put(units)
//
//                 assignment.markAsNeedRecalculation(assignment.event.$.effort)
//
//                 return assignment.propagate()
//             } else
//                 return super.setAssignmentUnits(assignment, units)
//         }
//
//
//         addAssignment (assignment : AssignmentMixin) {
//             if (this.schedulingMode === SchedulingMode.FixedDuration && this.effortDriven) {
//                 // `clearUserInput` basically means we need to ignore the user-provided value for the assignment unit
//                 // and calculate it, based on other information
//                 // (currently `calculateAssignmentUnits` in the HasAssignments always uses user-provided value if it exists)
//                 // ideally, we need to detect this case in the `calculateAssignmentUnits` and ignore the `proposedValue`
//                 assignment.$.units.clearUserInput()
//
//                 this.assigned.forEach((assignment : AssignmentMixin) => {
//                     this.markAsNeedRecalculation(assignment.$.units)
//
//                     assignment.$.units.clearUserInput()
//                 })
//             }
//
//             return super.addAssignment(assignment)
//         }
//
//
//         removeAssignment (assignment : AssignmentMixin) {
//             if (this.schedulingMode === SchedulingMode.FixedDuration && this.effortDriven) {
//                 // `clearUserInput` basically means we need to ignore the user-provided value for the assignment unit
//                 // and calculate it, based on other information
//                 // (currently `calculateAssignmentUnits` in the HasAssignments always uses user-provided value if it exists)
//                 // ideally, we need to detect this case in the `calculateAssignmentUnits` and ignore the `proposedValue`
//                 assignment.$.units.clearUserInput()
//
//                 this.assigned.forEach((assignment : AssignmentMixin) => {
//                     this.markAsNeedRecalculation(assignment.$.units)
//
//                     assignment.$.units.clearUserInput()
//                 })
//             }
//
//             return super.removeAssignment(assignment)
//         }
//
//
//         * useDurationForProjectedXDateCalculation () : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//
//             return (schedulingMode === SchedulingMode.FixedDuration) || (yield* super.useDurationForProjectedXDateCalculation())
//         }
//
//
//         * getBaseOptionsForDurationCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
//             const schedulingMode    = yield this.$.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedDuration) {
//                 return { ignoreResourceCalendars : true }
//             }
//             else {
//                 return yield* super.getBaseOptionsForDurationCalculations()
//             }
//         }
//     }
//
//     return FixedDuration
// }
//
// /**
//  * This mixin provides the support for the "fixed duration" scheduling mode.
//  *
//  * In this mode, the duration of the event is based on its effort.
//  * The duration of the task is considered "fixed", and is kept intact,
//  * when some of the other free variables changes - effort or assignment units.
//  */
// export interface FixedDuration extends Mixin<typeof FixedDuration> {}
