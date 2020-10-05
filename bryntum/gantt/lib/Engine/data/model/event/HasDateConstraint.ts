import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate } from "../../../../ChronoGraph/replica/Entity.js"
import { dateConverter, model_field } from "../../../chrono/ModelFieldAtom.js"
import { DateInterval } from "../../../scheduling/DateInterval.js"
import { ConstraintType, Direction } from "../../../scheduling/Types.js"
import { ConstrainedEvent, ConstraintInterval } from "./ConstrainedEvent.js"
import { HasChildren } from "./HasChildren.js"


export const HasDateConstraint = <T extends AnyConstructor<ConstrainedEvent & HasChildren>>(base : T) => {

    class HasDateConstraint extends base {

        /**
         * The type of constraint, applied to this task
         */
        @model_field({ type : 'string' })
        constraintType : ConstraintType

        /**
         * The date of the constraint, applied to this task
         */
        @model_field({ type : 'date', dateFormat : 'YYYY-MM-DDTHH:mm:ssZ' }, { converter : dateConverter })
        constraintDate : Date


        putStartDate (date : Date, keepDuration : boolean = true) {
            // get constraint type that should be used to enforce start date or
            // null if the change cannot be enforced (happens when the task is manually scheduled so no need for enforcement or
            // some constraint is already set)

            const isVeryInitialAssignment : boolean = this.$.startDate.getProposedOrPreviousValue() === undefined

            const project   = this.getProject()

            // if this is not a very initial assignment
            if (!isVeryInitialAssignment && !(project && project.getStm().isRestoring)) {
                const constrainType = this.getStartDatePinConstraintType()

                if (constrainType) {
                    this.constraintType = constrainType
                    this.constraintDate = date
                }
            }

            return super.putStartDate(date, keepDuration)
        }


        putEndDate (date : Date, keepDuration : boolean = false) {
            // get constraint type that should be used to enforce End date or
            // null if the change cannot be enforced (happens when the task is manually scheduled so no need for enforcement or
            // some constraint is already set)

            const isVeryInitialAssignment : boolean = this.$.endDate.getProposedOrPreviousValue() === undefined

            const project   = this.getProject()

            // if this is not a very initial assignment
            if (!isVeryInitialAssignment && keepDuration && !(project && project.getStm().isRestoring)) {
                const constrainType = this.getEndDatePinConstraintType()

                if (constrainType) {
                    this.constraintType = constrainType
                    this.constraintDate = date
                }
            }

            return super.putEndDate(date, keepDuration)
        }


        @calculate('constraintType')
        * calculateConstraintType () : ChronoIterator<ConstraintType> {
            let constraintType : this[ 'constraintType' ]    = this.$.constraintType.getProposedOrPreviousValue()

            // use proposed constraint type if provided and is applicable to the event
            if (!(yield* this.isConstraintTypeApplicable(constraintType) as any)) {
                constraintType   = null
            }

            return constraintType
        }


        @calculate('constraintDate')
        * calculateConstraintDate (Y) : ChronoIterator<Date> {
            let constraintDate : Date               = this.$.constraintDate.getProposedOrPreviousValue()
            const constraintType : ConstraintType   = yield this.$.constraintType

            if (!constraintType) {
                constraintDate      = null
            }
            // use proposed constraint date if provided
            else if (!constraintDate) {
                // fill constraint date based on constraint type provided
                constraintDate      = this.getConstraintTypeDefaultDate(Y, constraintType)
            }

            return constraintDate
        }


        getStartDatePinConstraintType () : ConstraintType {
            const { direction } = this

            if (!this.isTaskPinnableWithConstraint()) return null

            switch (direction) {
                case Direction.Forward : return ConstraintType.StartNoEarlierThan

                case Direction.Backward : return ConstraintType.FinishNoLaterThan
            }
        }


        getEndDatePinConstraintType () : ConstraintType {
            const { direction } = this

            if (!this.isTaskPinnableWithConstraint()) return null

            switch (direction) {
                case Direction.Forward : return ConstraintType.FinishNoEarlierThan

                case Direction.Backward : return ConstraintType.FinishNoLaterThan
            }
        }


        /**
         * Indicates if the task can be pinned with a constraint
         * to enforce its start/end date changes.
         * @private
         */
        isTaskPinnableWithConstraint () : boolean {
            const { manuallyScheduled, constraintType } = this

            let result = false

            // we should not pin manually scheduled tasks
            if (!manuallyScheduled) {

                if (constraintType) {
                    switch (constraintType) {
                        case ConstraintType.StartNoEarlierThan :
                        case ConstraintType.FinishNoEarlierThan :
                            result = true
                    }
                }
                // no constraints -> we can pin
                else {
                    result = true
                }
            }

            return result
        }


        /**
         * Returns default constraint date value for the constraint type provided
         * (either start or end date of the event).
         */
        getConstraintTypeDefaultDate (Y, constraintType : ConstraintType) : Date {
            switch (constraintType) {
                case ConstraintType.StartNoEarlierThan :
                case ConstraintType.StartNoLaterThan :
                case ConstraintType.MustStartOn :
                    return this.$.startDate.getProposedOrPreviousValue()

                case ConstraintType.FinishNoEarlierThan :
                case ConstraintType.FinishNoLaterThan :
                case ConstraintType.MustFinishOn :
                    return this.$.endDate.getProposedOrPreviousValue()
            }

            return null
        }

        /**
         * Returns true if the provided constraint type is applicable to the event.
         *
         * @param {ConstraintType} constraintType Constraint type.
         * @returns `True` if the provided constraint type is applicable (`false` otherwise).
         */
        * isConstraintTypeApplicable (constraintType : ConstraintType) : ChronoIterator<boolean> {
            const childEvents = yield this.$.childEvents

            // Take into account if the event is leaf
            const isSummary : boolean = childEvents.size > 0

            switch (constraintType) {
                // these constraints are applicable to leaves only
                case ConstraintType.FinishNoEarlierThan :
                case ConstraintType.StartNoLaterThan :
                case ConstraintType.MustFinishOn :
                case ConstraintType.MustStartOn :
                    return !isSummary
            }

            return true
        }

        /**
         * Sets the constraint type to the event.
         * @param {ConstraintType} constraintType Constraint type.
         * @returns Promise<PropagateResult>
         */
        setConstraintType : (constrainType : ConstraintType) => Promise<PropagationResult>

        /**
         * Sets the constraint type to the event.
         * @param {Date}   constraintDate Constraint date.
         * @returns Promise<PropagateResult>
         */
        setConstraintDate : (constrainDate : Date) => Promise<PropagationResult>

        /**
         * Sets the constraint type (if applicable) and constraining date to the task.
         * @param {ConstraintType}  constraintType   Constraint type.
         * @param {Date}            [constraintDate] Constraint date.
         * @returns Promise<PropagateResult>
         */
        async setConstraint (constraintType : ConstraintType, constraintDate? : Date) : Promise<PropagationResult> {
            this.constraintType = constraintType

            if (constraintDate !== undefined) {
                this.constraintDate = constraintDate
            }

            return this.propagate()
        }


        * calculateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {

            const intervals : this[ 'endDateConstraintIntervals' ] = yield* super.calculateEndDateConstraintIntervals()

            const constraintType = yield this.$.constraintType
            const constraintDate = yield this.$.constraintDate

            if (constraintType && constraintDate) {
                // if constraint type is
                switch (constraintType) {
                    case ConstraintType.MustFinishOn :
                        intervals.unshift(DateInterval.new({
                            startDate   : constraintDate,
                            endDate     : constraintDate
                        }))
                        break

                    case ConstraintType.FinishNoEarlierThan :
                        intervals.unshift(DateInterval.new({
                            startDate   : constraintDate
                        }))
                        break

                    case ConstraintType.FinishNoLaterThan :
                        intervals.unshift(DateInterval.new({
                            endDate     : constraintDate
                        }))
                        break
                }
            }

            return intervals
        }


        * calculateStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {

            const intervals : this[ 'startDateConstraintIntervals' ] = yield* super.calculateStartDateConstraintIntervals()

            const constraintType : ConstraintType = yield this.$.constraintType
            const constraintDate                  = yield this.$.constraintDate

            if (constraintType && constraintDate) {
                // if constraint type is
                switch (constraintType) {
                    case ConstraintType.MustStartOn :
                        intervals.unshift(DateInterval.new({
                            startDate   : constraintDate,
                            endDate     : constraintDate
                        }))
                        break

                    case ConstraintType.StartNoEarlierThan :
                        intervals.unshift(DateInterval.new({
                            startDate   : constraintDate
                        }))
                        break

                    case ConstraintType.StartNoLaterThan :
                        intervals.unshift(DateInterval.new({
                            endDate     : constraintDate
                        }))
                        break
                }
            }

            return intervals
        }



        // @calculate('constraintType')
        // * calculateConstraintType (proposedValue? : ConstraintType) : ChronoIterator<this[ 'constraintType' ] | boolean> {
        //     let result : this[ 'constraintType' ] = null
        //
        //     // use proposed constraint type if provided and is applicable to the event
        //     if (proposedValue !== undefined && (yield* this.isConstraintTypeApplicable(proposedValue))) {
        //         result = proposedValue
        //     // use consistent value otherwise (if it's applicable)
        //     } else {
        //         const consistentValue = this.$.constraintType.getConsistentValue()
        //
        //         // this check is probably no longer needed since all data now goes through the "proposed" stage
        //         if (yield* this.isConstraintTypeApplicable(consistentValue)) {
        //             result = consistentValue
        //         }
        //     }
        //
        //     return result
        // }
        //
        // getStartDatePinConstraintType () : ConstraintType {
        //     // TODO: for BW projects this should return ConstraintType.StartNoLaterThan
        //     return this.isTaskPinnableWithConstraint() && ConstraintType.StartNoEarlierThan || null
        // }
        //
        // getEndDatePinConstraintType () : ConstraintType {
        //     // TODO: for BW projects this should return ConstraintType.FinishNoLaterThan
        //     return this.isTaskPinnableWithConstraint() && ConstraintType.FinishNoEarlierThan || null
        // }
        //
        // /**
        //  * Indicates if the task can be pinned with a constraint
        //  * to enforce its start/end date changes.
        //  * @private
        //  */
        // isTaskPinnableWithConstraint () : boolean {
        //     let result = false
        //
        //     // we should not pin manually scheduled tasks
        //     if (!this.manuallyScheduled) {
        //         const constraintType = this.constraintType
        //
        //         if (constraintType) {
        //             switch (constraintType) {
        //                 case ConstraintType.StartNoEarlierThan :
        //                 case ConstraintType.FinishNoEarlierThan :
        //                     result = true
        //             }
        //
        //         // no constraints -> we can pin
        //         } else {
        //             result = true
        //         }
        //     }
        //
        //     return result
        // }
        //
        // async setStartDate (date : Date, keepDuration : boolean = true) : Promise<PropagationResult> {
        //     // get constraint type that should be used to enforce start date or
        //     // null if the change cannot be enforced (happens when the task is manually scheduled so no need for enforcement or
        //     // some constraint is already set)
        //     const constrainType = this.getStartDatePinConstraintType()
        //
        //     if (constrainType) {
        //         this.$.constraintType.put(constrainType)
        //         this.$.constraintDate.put(date)
        //     }
        //
        //     return super.setStartDate(date, keepDuration)
        // }
        //
        // async setEndDate (date : Date, keepDuration : boolean = false) : Promise<PropagationResult> {
        //     // if we move the event
        //     if (keepDuration) {
        //         // get constraint type that should be used to enforce end date or
        //         // null if the change cannot be enforced (happens when the task is manually scheduled so no need for enforcement or
        //         // some constraint is already set)
        //         const constrainType = this.getEndDatePinConstraintType()
        //
        //         if (constrainType) {
        //             this.$.constraintType.put(constrainType)
        //             this.$.constraintDate.put(date)
        //         }
        //     }
        //
        //     return super.setEndDate(date, keepDuration)
        // }
        //
        // @calculate('constraintDate')
        // * calculateConstraintDate (proposedValue? : Date) : ChronoIterator<this[ 'constraintDate' ]> {
        //
        //     let result : Date
        //     const constraintType = yield this.$.constraintType
        //
        //     // use proposed constraint date if provided
        //     if (proposedValue !== undefined) {
        //         result = proposedValue
        //     // if no constraint type -> reset constraint date
        //     } else if (!constraintType) {
        //         result = null
        //     // fill constraint date based on constraint type provided
        //     } else {
        //         result = this.getConstraintTypeDefaultDate(constraintType) || this.$.constraintDate.getConsistentValue()
        //     }
        //
        //     return result
        // }
        //
        // /**
        //  * Returns default constraint date value for the constraint type provided
        //  * (either start or end date of the event).
        //  */
        // getConstraintTypeDefaultDate (constraintType : ConstraintType) : Date {
        //     switch (constraintType) {
        //         case ConstraintType.StartNoEarlierThan :
        //         case ConstraintType.StartNoLaterThan :
        //         case ConstraintType.MustStartOn :
        //             return this.startDate
        //
        //         case ConstraintType.FinishNoEarlierThan :
        //         case ConstraintType.FinishNoLaterThan :
        //         case ConstraintType.MustFinishOn :
        //             return this.endDate
        //     }
        //
        //     return null
        // }
        //
        // /**
        //  * Returns true if the provided constraint type is applicable to the event.
        //  *
        //  * @param {ConstraintType} constraintType Constraint type.
        //  * @returns `True` if the provided constraint type is applicable (`false` otherwise).
        //  */
        // * isConstraintTypeApplicable (constraintType : ConstraintType) : ChronoIterator<boolean> {
        //     const childEvents = yield this.$.childEvents
        //
        //     // Take into account if the event is leaf
        //     const isSummary : boolean = childEvents.size > 0
        //
        //     switch (constraintType) {
        //         // these constraints are applicable to leaves only
        //         case ConstraintType.FinishNoEarlierThan :
        //         case ConstraintType.StartNoLaterThan :
        //         case ConstraintType.MustFinishOn :
        //         case ConstraintType.MustStartOn :
        //             return !isSummary
        //     }
        //
        //     return true
        // }
        //
        // /**
        //  * Sets the constraint type to the event.
        //  * @param {ConstraintType} constraintType Constraint type.
        //  * @returns Promise<PropagationResult>
        //  */
        // setConstraintType : (constrainType : ConstraintType) => Promise<PropagationResult>
        //
        // /**
        //  * Sets the constraint type to the event.
        //  * @param {Date}   constraintDate Constraint date.
        //  * @returns Promise<PropagationResult>
        //  */
        // setConstraintDate : (constrainDate : Date) => Promise<PropagationResult>
        //
        // /**
        //  * Sets the constraint type (if applicable) and constraining date to the task.
        //  * @param {ConstraintType} constraintType Constraint type.
        //  * @param {Date}   constraintDate Constraint date.
        //  * @returns Promise<PropagationResult>
        //  */
        // async setConstraint (constraintType : ConstraintType, constraintDate? : Date) : Promise<PropagationResult> {
        //     this.$.constraintType.put(constraintType)
        //
        //     if (constraintDate !== undefined) {
        //         this.$.constraintDate.put(constraintDate)
        //     }
        //
        //     return this.propagate()
        // }
        //
        //
        // protected * calculateEndDateConstraintIntervals () : ChronoIterator<this[ 'endDateConstraintIntervals' ]> {
        //
        //     const intervals : this[ 'endDateConstraintIntervals' ] = yield* super.calculateEndDateConstraintIntervals()
        //
        //     const constraintType = yield this.$.constraintType
        //
        //     if (constraintType) {
        //
        //         const constraintDate = yield this.$.constraintDate
        //
        //         if (constraintDate) {
        //             // if constraint type is
        //             switch (constraintType) {
        //
        //                 case ConstraintType.MustFinishOn :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         startDate           : constraintDate,
        //                         endDate             : constraintDate,
        //                         originDescription   : '"Must Finish On" constraint',
        //                         // TODO:
        //                         // onRemoveAction      : this.getOnRemoveAction(dependency)
        //                     }))
        //                     break
        //
        //                 case ConstraintType.FinishNoEarlierThan :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         startDate         : constraintDate,
        //                         originDescription : '"Finish No Ealier Than" constraint'
        //                     }))
        //                     break
        //
        //                 case ConstraintType.FinishNoLaterThan :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         endDate           : constraintDate,
        //                         originDescription : '"Finish No Ealier Than" constraint'
        //                     }))
        //                     break
        //             }
        //         }
        //     }
        //
        //     return intervals
        // }
        //
        //
        // protected * calculateStartDateConstraintIntervals () : ChronoIterator<this[ 'startDateConstraintIntervals' ]> {
        //
        //     const intervals : this[ 'startDateConstraintIntervals' ] = yield* super.calculateStartDateConstraintIntervals()
        //
        //     const constraintType : ConstraintType = yield this.$.constraintType
        //
        //     if (constraintType) {
        //
        //         const constraintDate = yield this.$.constraintDate
        //
        //         if (constraintDate) {
        //             // if constraint type is
        //             switch (constraintType) {
        //
        //                 case ConstraintType.MustStartOn :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         startDate         : constraintDate,
        //                         endDate           : constraintDate,
        //                         originDescription : '"Must Start On" constraint',
        //                         // TODO:
        //                         // onRemoveAction    : this.getOnRemoveAction(dependency)
        //                     }))
        //                     break
        //
        //                 case ConstraintType.StartNoEarlierThan :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         startDate         : constraintDate,
        //                         originDescription : '"Start No Ealier Than" constraint'
        //                     }))
        //                     break
        //
        //                 case ConstraintType.StartNoLaterThan :
        //                     intervals.unshift(ConstraintInterval.new({
        //                         endDate           : constraintDate,
        //                         originDescription : '"Start No Later Than" constraint'
        //                     }))
        //                     break
        //             }
        //         }
        //     }
        //
        //     return intervals
        // }

    }

    return HasDateConstraint
}

/**
 * This mixin adds support for various constraints for the task. The type of constraint is defined by the
 * [[constraintType]] property.
 */
export interface HasDateConstraint extends Mixin<typeof HasDateConstraint> {}
