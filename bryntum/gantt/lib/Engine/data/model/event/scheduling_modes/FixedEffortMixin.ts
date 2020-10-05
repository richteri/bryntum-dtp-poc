import { ChronoIterator } from "../../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../../ChronoGraph/class/Mixin.js"
import { CycleResolution } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js"
import { SEDDispatcher } from "../BaseEventDispatcher.js"
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js"
import { HasSchedulingMode } from "../HasSchedulingMode.js"
import { fixedEffortSEDWUBackward, fixedEffortSEDWUForward } from "./FixedEffortDispatcher.js"

export const FixedEffortMixin = <T extends AnyConstructor<HasSchedulingMode>>(base : T) => {

    class FixedEffortMixin extends base {

        * prepareDispatcher () : ChronoIterator<SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedEffort) {
                const cycleDispatcher               = yield* super.prepareDispatcher()

                if (this.hasAssignmentChanges()) cycleDispatcher.addProposedValueFlag(UnitsVar)

                cycleDispatcher.addKeepIfPossibleFlag(EffortVar)

                return cycleDispatcher
            }
            else {
                return yield* super.prepareDispatcher()
            }
        }


        * cycleResolutionContext () : ChronoIterator<CycleResolution> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedEffort) {
                const direction : Direction         = yield this.$.direction

                return direction === Direction.Forward || direction === Direction.None ? fixedEffortSEDWUForward : fixedEffortSEDWUBackward
            }
            else {
                return yield* super.cycleResolutionContext()
            }

        }
    }

    return FixedEffortMixin
}

export interface FixedEffortMixin extends Mixin<typeof FixedEffortMixin> {}

