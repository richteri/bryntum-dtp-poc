import { Direction, SchedulingMode } from "../../../../scheduling/Types.js";
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js";
import { fixedEffortSEDWUBackward, fixedEffortSEDWUForward } from "./FixedEffortDispatcher.js";
export const FixedEffortMixin = (base) => {
    class FixedEffortMixin extends base {
        *prepareDispatcher() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedEffort) {
                const cycleDispatcher = yield* super.prepareDispatcher();
                if (this.hasAssignmentChanges())
                    cycleDispatcher.addProposedValueFlag(UnitsVar);
                cycleDispatcher.addKeepIfPossibleFlag(EffortVar);
                return cycleDispatcher;
            }
            else {
                return yield* super.prepareDispatcher();
            }
        }
        *cycleResolutionContext() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedEffort) {
                const direction = yield this.$.direction;
                return direction === Direction.Forward || direction === Direction.None ? fixedEffortSEDWUForward : fixedEffortSEDWUBackward;
            }
            else {
                return yield* super.cycleResolutionContext();
            }
        }
    }
    return FixedEffortMixin;
};
//# sourceMappingURL=FixedEffortMixin.js.map