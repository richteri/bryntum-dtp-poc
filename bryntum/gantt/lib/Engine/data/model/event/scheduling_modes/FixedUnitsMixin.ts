import { ChronoIterator } from "../../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../../ChronoGraph/class/Mixin.js"
import { CycleResolution } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js"
import { SEDDispatcher } from "../BaseEventDispatcher.js"
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js"
import { HasSchedulingMode } from "../HasSchedulingMode.js"
import {
    fixedUnitsSEDWUBackwardEffortDriven,
    fixedUnitsSEDWUBackwardNonEffortDriven,
    fixedUnitsSEDWUForwardEffortDriven,
    fixedUnitsSEDWUForwardNonEffortDriven
} from "./FixedUnitsDispatcher.js"

export const FixedUnitsMixin = <T extends AnyConstructor<HasSchedulingMode>>(base : T) => {

    class FixedUnitsMixin extends base {

        * prepareDispatcher () : ChronoIterator<SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedUnits) {
                const cycleDispatcher               = yield* super.prepareDispatcher()

                if (this.hasAssignmentChanges()) cycleDispatcher.addProposedValueFlag(UnitsVar)

                if (yield this.$.effortDriven) cycleDispatcher.addKeepIfPossibleFlag(EffortVar)

                cycleDispatcher.addKeepIfPossibleFlag(UnitsVar)

                return cycleDispatcher
            }
            else {
                return yield* super.prepareDispatcher()
            }
        }


        * cycleResolutionContext () : ChronoIterator<CycleResolution> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedUnits) {
                const direction : Direction         = yield this.$.direction
                const effortDriven : boolean        = yield this.$.effortDriven

                if (direction === Direction.Forward || direction === Direction.None) {
                    return effortDriven ? fixedUnitsSEDWUForwardEffortDriven : fixedUnitsSEDWUForwardNonEffortDriven
                } else {
                    return effortDriven ? fixedUnitsSEDWUBackwardEffortDriven : fixedUnitsSEDWUBackwardNonEffortDriven
                }
            }
            else {
                return yield* super.cycleResolutionContext()
            }

        }
    }

    return FixedUnitsMixin
}

export interface FixedUnitsMixin extends Mixin<typeof FixedUnitsMixin> {}
