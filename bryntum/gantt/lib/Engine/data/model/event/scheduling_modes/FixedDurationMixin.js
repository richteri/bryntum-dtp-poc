import { Direction, SchedulingMode } from "../../../../scheduling/Types.js";
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js";
import { fixedDurationSEDWUBackwardEffortDriven, fixedDurationSEDWUBackwardNonEffortDriven, fixedDurationSEDWUForwardEffortDriven, fixedDurationSEDWUForwardNonEffortDriven } from "./FixedDurationDispatcher.js";
export const FixedDurationMixin = (base) => {
    class FixedDurationMixin extends base {
        *prepareDispatcher() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedDuration) {
                const cycleDispatcher = yield* super.prepareDispatcher();
                const effortDriven = yield this.$.effortDriven;
                if (effortDriven) {
                    cycleDispatcher.addKeepIfPossibleFlag(EffortVar);
                }
                if (this.hasAssignmentChanges()) {
                    const effortDriven = yield this.$.effortDriven;
                    if (effortDriven) {
                        cycleDispatcher.addProposedValueFlag(EffortVar);
                    }
                    else {
                        cycleDispatcher.addProposedValueFlag(UnitsVar);
                    }
                }
                return cycleDispatcher;
            }
            else {
                return yield* super.prepareDispatcher();
            }
        }
        *cycleResolutionContext() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedDuration) {
                const direction = yield this.$.direction;
                const effortDriven = yield this.$.effortDriven;
                if (direction === Direction.Forward || direction === Direction.None) {
                    return effortDriven ? fixedDurationSEDWUForwardEffortDriven : fixedDurationSEDWUForwardNonEffortDriven;
                }
                else {
                    return effortDriven ? fixedDurationSEDWUBackwardEffortDriven : fixedDurationSEDWUBackwardNonEffortDriven;
                }
            }
            else {
                return yield* super.cycleResolutionContext();
            }
        }
        *getBaseOptionsForDurationCalculations() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedDuration) {
                return { ignoreResourceCalendars: true };
            }
            else {
                return yield* super.getBaseOptionsForDurationCalculations();
            }
        }
    }
    return FixedDurationMixin;
};
//# sourceMappingURL=FixedDurationMixin.js.map