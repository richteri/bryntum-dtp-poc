import { ChronoIterator } from "../../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../../ChronoGraph/class/Mixin.js"
import { CycleResolution } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js"
import { SEDDispatcher } from "../BaseEventDispatcher.js"
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js"
import { HasSchedulingMode } from "../HasSchedulingMode.js"
import {
    fixedDurationSEDWUBackwardEffortDriven,
    fixedDurationSEDWUBackwardNonEffortDriven,
    fixedDurationSEDWUForwardEffortDriven,
    fixedDurationSEDWUForwardNonEffortDriven
} from "./FixedDurationDispatcher.js"

export const FixedDurationMixin = <T extends AnyConstructor<HasSchedulingMode>>(base : T) => {

    class FixedDurationMixin extends base {

        * prepareDispatcher () : ChronoIterator<SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedDuration) {
                const cycleDispatcher               = yield* super.prepareDispatcher()

                const effortDriven : boolean    = yield this.$.effortDriven

                if (effortDriven) {
                    cycleDispatcher.addKeepIfPossibleFlag(EffortVar)
                }

                if (this.hasAssignmentChanges()) {
                    const effortDriven : boolean    = yield this.$.effortDriven

                    // for effort driven case, we treat adding/removing of assignments as changing effort
                    // instead of units (this will trigger both, but units formula will win in presence of effort change)
                    if (effortDriven) {
                        cycleDispatcher.addProposedValueFlag(EffortVar)
                    }
                    else {
                        cycleDispatcher.addProposedValueFlag(UnitsVar)
                    }
                }

                return cycleDispatcher
            }
            else {
                return yield* super.prepareDispatcher()
            }
        }


        * cycleResolutionContext () : ChronoIterator<CycleResolution> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedDuration) {
                const direction : Direction         = yield this.$.direction
                const effortDriven : boolean        = yield this.$.effortDriven

                if (direction === Direction.Forward || direction === Direction.None) {
                    return effortDriven ? fixedDurationSEDWUForwardEffortDriven : fixedDurationSEDWUForwardNonEffortDriven
                } else {
                    return effortDriven ? fixedDurationSEDWUBackwardEffortDriven : fixedDurationSEDWUBackwardNonEffortDriven
                }
            }
            else {
                return yield* super.cycleResolutionContext()
            }

        }


        * getBaseOptionsForDurationCalculations () : ChronoIterator<{ ignoreResourceCalendars : boolean }> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedDuration) {
                return { ignoreResourceCalendars : true }
            }
            else {
                return yield* super.getBaseOptionsForDurationCalculations()
            }
        }

    }

    return FixedDurationMixin
}

export interface FixedDurationMixin extends Mixin<typeof FixedDurationMixin> {}

