import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { CalculateProposed, FormulaId } from "../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js"
import { ReferenceBucketAtom } from "../../../../ChronoGraph/replica/Reference.js"
import { model_field } from "../../../chrono/ModelFieldAtom.js"
import { Duration, SchedulingMode, TimeUnit } from "../../../scheduling/Types.js"
import { AssignmentMixin } from "../AssignmentMixin.js"
import { durationFormula, DurationVar, EndDateVar, SEDDispatcher, StartDateVar } from "./BaseEventDispatcher.js"
import { HasAssignments } from "./HasAssignments.js"
import { HasEffort } from "./HasEffort.js"
import {
    effortFormula, EffortVar,
    endDateByEffortFormula,
    SEDWUDispatcher,
    SEDWUDispatcherIdentifier,
    startDateByEffortFormula,
    unitsFormula, UnitsVar
} from "./HasEffortDispatcher.js"


export const HasSchedulingMode = <T extends AnyConstructor<HasEffort>>(base : T) => {

    class HasSchedulingMode extends base {

        @model_field({ 'type' : 'boolean', defaultValue : false })
        effortDriven    : boolean

        /**
         * The scheduling mode of the task.
         */
        @model_field({ type : 'string', defaultValue : SchedulingMode.Normal })
        schedulingMode  : SchedulingMode

        @field({ atomCls : SEDWUDispatcherIdentifier })
        dispatcher      : SEDWUDispatcher


        /**
         * Generated setter for the [[schedulingMode]] field.
         */
        setSchedulingMode : (schedulingMode : SchedulingMode) => Promise<PropagationResult>
        /**
         * Generated getter for the [[schedulingMode]] field.
         */
        getSchedulingMode : () => SchedulingMode


        /**
         * Generated setter for the [[effortDriven]] field.
         */
        setEffortDriven : (effortDriven : boolean) => Promise<PropagationResult>
        /**
         * Generated getter for the [[effortDriven]] field.
         */
        getEffortDriven : () => boolean


        * prepareDispatcher () : ChronoIterator<SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                const cycleDispatcher               = yield* super.prepareDispatcher()

                cycleDispatcher.collectInfo(this.$.effort, EffortVar)

                if (yield* this.hasProposedValueForUnits() as any) cycleDispatcher.addProposedValueFlag(UnitsVar)
                // units are always available
                cycleDispatcher.addPreviousValueFlag(UnitsVar)

                return cycleDispatcher
            }
            else {
                return yield* super.prepareDispatcher()
            }
        }


        * dispatcherClass () : ChronoIterator<typeof SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                return SEDWUDispatcher
            }
            else {
                return yield* super.dispatcherClass()
            }
        }


        buildProposedDispatcher () : SEDDispatcher {
            const dispatcher = super.buildProposedDispatcher()

            // TODO should check for dispatcher class probably
            dispatcher.addPreviousValueFlag(EffortVar)
            dispatcher.addPreviousValueFlag(UnitsVar)

            return dispatcher
        }


        * calculateAssignmentUnits (assignment : AssignmentMixin) : ChronoIterator<number> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch : SEDWUDispatcher        = yield this.$.dispatcher

                const formulaId : FormulaId = dispatch.resolution.get(UnitsVar)

                if (formulaId === CalculateProposed) {
                    return yield* this.calculateAssignmentUnitsProposed(assignment)
                }
                else if (formulaId === unitsFormula.formulaId) {
                    return yield* this.calculateAssignmentUnitsPure(assignment)
                } else {
                    throw new Error("Unknown formula for `units`")
                }
            }
            else {
                return yield* super.calculateAssignmentUnits(assignment)
            }
        }


        putEffort (effort : Duration, unit? : TimeUnit) {
            const isVeryFirstAssignment             = this.$.effort.getProposedOrPreviousValue() === undefined

            // ignore null/undefined for very 1st assignment, to not count it as proposed value
            if (effort == null && isVeryFirstAssignment) return super.putEffort(effort, unit)

            if (this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.endDate)
                this.markAsNeedRecalculation(this.$.duration)

                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units))
            }

            super.putEffort(effort, unit)
        }


        putStartDate (date : Date, keepDuration : boolean = true) {
            const isVeryFirstAssignment             = this.$.startDate.getProposedOrPreviousValue() === undefined

            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.endDate)
                this.markAsNeedRecalculation(this.$.duration)
                this.markAsNeedRecalculation(this.$.effort)

                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units))
            }

            super.putStartDate(date, keepDuration)
        }


        putEndDate (date : Date, keepDuration : boolean = false) {
            const isVeryFirstAssignment             = this.$.endDate.getProposedOrPreviousValue() === undefined

            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.endDate)
                this.markAsNeedRecalculation(this.$.duration)
                this.markAsNeedRecalculation(this.$.effort)

                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units))
            }

            super.putEndDate(date, keepDuration)
        }


        putDuration (duration : Duration, unit? : TimeUnit, keepStartDate : boolean = true) {
            const isVeryFirstAssignment             = this.$.duration.getProposedOrPreviousValue() === undefined

            if (!isVeryFirstAssignment && this.getGraph()) {
                this.markAsNeedRecalculation(this.$.dispatcher)
                this.markAsNeedRecalculation(this.$.startDate)
                this.markAsNeedRecalculation(this.$.endDate)
                this.markAsNeedRecalculation(this.$.duration)
                this.markAsNeedRecalculation(this.$.effort)

                this.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units))
            }

            super.putDuration(duration, unit, keepStartDate)
        }


        @calculate('effort')
        * calculateEffort () : ChronoIterator<Duration> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch : SEDWUDispatcher        = yield this.$.dispatcher

                const formulaId : FormulaId = dispatch.resolution.get(EffortVar)

                if (formulaId === CalculateProposed) {
                    return yield* this.calculateEffortProposed()
                }
                else if (formulaId === effortFormula.formulaId) {
                    return yield* this.calculateEffortPure()
                } else {
                    throw new Error("Unknown formula for `effort`")
                }
            }
            else {
                return yield* super.calculateEffort()
            }
        }


        @calculate('startDate')
        * calculateStartDate () : ChronoIterator<Date> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch : SEDWUDispatcher        = yield this.$.dispatcher

                const formulaId : FormulaId = dispatch.resolution.get(StartDateVar)

                if (formulaId === startDateByEffortFormula.formulaId) {
                    return yield* this.calculateProjectedXDateByEffort(yield this.$.endDate, false)
                } else {
                    return yield* super.calculateStartDate() as any
                }
            }
            else {
                return yield* super.calculateStartDate() as any
            }
        }


        @calculate('endDate')
        * calculateEndDate () : ChronoIterator<Date> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode !== SchedulingMode.Normal) {
                const dispatch : SEDWUDispatcher        = yield this.$.dispatcher

                const formulaId : FormulaId = dispatch.resolution.get(EndDateVar)

                if (formulaId === endDateByEffortFormula.formulaId) {
                    return yield* this.calculateProjectedXDateByEffort(yield this.$.startDate, true)
                } else {
                    return yield* super.calculateEndDate() as any
                }
            }
            else {
                return yield* super.calculateEndDate() as any
            }
        }


        * calculateEffectiveDuration () : ChronoIterator<Duration> {
            const dispatch : SEDWUDispatcher            = yield this.$.dispatcher
            const schedulingMode : SchedulingMode       = yield this.$.schedulingMode

            const durationResolution : FormulaId        = dispatch.resolution.get(DurationVar)
            const effortResolution : FormulaId          = dispatch.resolution.get(EffortVar)

            let effectiveDurationToUse : Duration

            if (durationResolution === durationFormula.formulaId && schedulingMode != SchedulingMode.Normal) {
                const proposedOrPreviousStartDate : Date    = this.$.startDate.getProposedOrPreviousValue()
                const proposedOrPreviousEndDate : Date      = this.$.endDate.getProposedOrPreviousValue()

                const startDateResolution : FormulaId       = dispatch.resolution.get(StartDateVar)
                const endDateResolution : FormulaId         = dispatch.resolution.get(EndDateVar)

                const effortDriven : boolean                = yield this.$.effortDriven

                if (effortDriven || schedulingMode === SchedulingMode.FixedEffort) {
                    if (proposedOrPreviousEndDate && startDateResolution === startDateByEffortFormula.formulaId) {
                        effectiveDurationToUse  = yield* this.calculateProjectedDuration(
                            yield* this.calculateProjectedXDateByEffort(proposedOrPreviousEndDate, false) as any,
                            proposedOrPreviousEndDate
                        )
                    }
                    else if (proposedOrPreviousStartDate && endDateResolution === endDateByEffortFormula.formulaId) {
                        effectiveDurationToUse  = yield* this.calculateProjectedDuration(
                            proposedOrPreviousStartDate,
                            yield* this.calculateProjectedXDateByEffort(proposedOrPreviousStartDate, true) as any
                        )
                    }
                }
                else if (
                    proposedOrPreviousStartDate && proposedOrPreviousEndDate
                    || !proposedOrPreviousStartDate && !proposedOrPreviousEndDate
                ) {
                    effectiveDurationToUse  = yield* super.calculateEffectiveDuration()
                }
            }
            else
                effectiveDurationToUse  = yield* super.calculateEffectiveDuration()

            return effectiveDurationToUse
        }


        @calculate('schedulingMode')
        * calculateSchedulingMode () : ChronoIterator<SchedulingMode> {
            return this.$.schedulingMode.getProposedOrPreviousValue() || SchedulingMode.Normal
        }

    }

    return HasSchedulingMode
}

export interface HasSchedulingMode extends Mixin<typeof HasSchedulingMode> {}

