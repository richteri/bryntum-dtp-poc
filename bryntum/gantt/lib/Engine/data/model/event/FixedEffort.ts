// import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom"
// import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
// import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
// import { ReferenceBucketAtom } from "../../../../ChronoGraph/replica/Reference.js"
// import { Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
// import { AssignmentMixin, MinimalAssignment } from "../AssignmentMixin.js"
// import { HasAssignments } from "./HasAssignments.js"
//
//
// export const FixedEffort = <T extends AnyConstructor<HasAssignments>>(base : T) => {
//
//     class FixedEffort extends base {
//
//         // FixedEffort scheduling mode forces the task to be effort driven
//         * calculateEffortDriven (proposedValue : boolean) : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//
//             return (schedulingMode === SchedulingMode.FixedEffort) || (yield* super.calculateEffortDriven(proposedValue))
//         }
//
//
//         hasAssignmentChanges () : boolean {
//             return (this.$.assigned as ReferenceBucketAtom).newRefs.size > 0 || (this.$.assigned as ReferenceBucketAtom).oldRefs.size > 0
//         }
//
//
//         * shouldRecalculateDuration () : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//             const assignments       = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedEffort && assignments.size > 0) {
//                 const res = (yield* super.shouldRecalculateDuration()) || this.hasAssignmentChanges() || this.$.effort.hasProposedValue()
//
//                 return res
//             } else
//                 return yield* super.shouldRecalculateDuration()
//         }
//
//
//         * shouldIgnoreProposedEndDate () : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//             const assignments       = yield this.$.assigned
//
//             if (schedulingMode === SchedulingMode.FixedEffort && assignments.size > 0) {
//                 const shouldIgnore = (this.$.startDate.hasProposedValue() && this.$.endDate.hasProposedValue() && this.$.duration.hasProposedValue() && this.$.effort.hasProposedValue())
//
//                 return shouldIgnore
//             } else
//                 return yield* super.shouldIgnoreProposedEndDate()
//         }
//
//
//         * shouldRecalculateEffort () : ChronoIterator<boolean> {
//             const schedulingMode    = yield this.$.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedEffort) {
//                 return this.$.effort.value == null && this.$.effort.proposedValue == null
//             } else
//                 return yield* super.shouldRecalculateEffort()
//         }
//
//
//         async setAssignmentUnits (assignment : MinimalAssignment, units : number) : Promise<PropagationResult> {
//             if (this.schedulingMode === SchedulingMode.FixedEffort) {
//                 assignment.$.units.put(units)
//
//                 assignment.markAsNeedRecalculation(assignment.event.$.duration)
//
//                 return assignment.propagate()
//             } else
//                 return super.setAssignmentUnits(assignment, units)
//         }
//
//
//         * shouldRecalculateAssignmentUnits (assignment : MinimalAssignment) : ChronoIterator<boolean> {
//             const schedulingMode    = this.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedEffort) {
//                 if (
//                     this.$.duration.hasProposedValue()
//                     && this.$.effort.hasProposedValue()
//                     && ((this.$.endDate.hasProposedValue() || this.$.endDate.hasConsistentValue()) && !(yield* this.shouldIgnoreProposedEndDate()))
//                 )
//                     return true
//                 else
//                     return false
//             }
//             else {
//                 return yield* super.shouldRecalculateAssignmentUnits(assignment)
//             }
//         }
//
//
//         * useDurationForProjectedXDateCalculation () : ChronoIterator<boolean> {
//             const schedulingMode : SchedulingMode                           = yield this.$.schedulingMode
//             const assignmentsByCalendar : this[ 'assignmentsByCalendar' ]   = yield this.$.assignmentsByCalendar
//
//             if (schedulingMode === SchedulingMode.FixedEffort && assignmentsByCalendar.size > 0) {
//                 if ((yield* this.shouldIgnoreProposedEndDate()) /*&& !this.hasAssignmentChanges()*/) {
//                     // if (this.hasAssignmentChanges())
//                     //     return false
//
//                     return true
//                 }
//
//                 if (this.hasAssignmentChanges())
//                     return false
//
//                 return yield* super.useDurationForProjectedXDateCalculation()
//             } else
//                 return yield* super.useDurationForProjectedXDateCalculation()
//         }
//
//
//         async setDuration (duration : Duration, unit? : TimeUnit, ...args) : Promise<PropagationResult> {
//             const schedulingMode    = this.schedulingMode
//
//             if (schedulingMode === SchedulingMode.FixedEffort) {
//                 this.assigned.forEach((assignment : AssignmentMixin) => {
//                     this.markAsNeedRecalculation(assignment.$.units)
//
//                     assignment.$.units.clearUserInput()
//                 })
//             }
//
//             return super.setDuration(duration, unit, ...args)
//         }
//
//
//         addAssignment (assignment : AssignmentMixin) {
//             if (this.schedulingMode === SchedulingMode.FixedEffort) {
//                 this.markAsNeedRecalculation(this.$.duration)
//             }
//
//             return super.addAssignment(assignment)
//         }
//
//
//         removeAssignment (assignment : AssignmentMixin) : AssignmentMixin {
//             if (this.schedulingMode === SchedulingMode.FixedEffort) {
//                 if (this.assigned.size > 1) this.markAsNeedRecalculation(this.$.duration)
//             }
//
//             return super.removeAssignment(assignment)
//         }
//     }
//
//     return FixedEffort
// }
//
//
// /**
//  * This mixin provides the support for the "fixed effort" scheduling mode.
//  *
//  * In this mode, the duration of the event is based on its effort.
//  * The effort of the task is considered "fixed", and is kept intact,
//  * when some of the other free variables changes - duration or assignment units.
//  */
// export interface FixedEffort extends Mixin<typeof FixedEffort> {}
