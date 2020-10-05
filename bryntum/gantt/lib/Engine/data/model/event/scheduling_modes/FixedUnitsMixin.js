import { Direction, SchedulingMode } from "../../../../scheduling/Types.js";
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js";
import { fixedUnitsSEDWUBackwardEffortDriven, fixedUnitsSEDWUBackwardNonEffortDriven, fixedUnitsSEDWUForwardEffortDriven, fixedUnitsSEDWUForwardNonEffortDriven } from "./FixedUnitsDispatcher.js";
export const FixedUnitsMixin = (base) => {
    class FixedUnitsMixin extends base {
        *prepareDispatcher() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedUnits) {
                const cycleDispatcher = yield* super.prepareDispatcher();
                if (this.hasAssignmentChanges())
                    cycleDispatcher.addProposedValueFlag(UnitsVar);
                if (yield this.$.effortDriven)
                    cycleDispatcher.addKeepIfPossibleFlag(EffortVar);
                cycleDispatcher.addKeepIfPossibleFlag(UnitsVar);
                return cycleDispatcher;
            }
            else {
                return yield* super.prepareDispatcher();
            }
        }
        *cycleResolutionContext() {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedUnits) {
                const direction = yield this.$.direction;
                const effortDriven = yield this.$.effortDriven;
                if (direction === Direction.Forward || direction === Direction.None) {
                    return effortDriven ? fixedUnitsSEDWUForwardEffortDriven : fixedUnitsSEDWUForwardNonEffortDriven;
                }
                else {
                    return effortDriven ? fixedUnitsSEDWUBackwardEffortDriven : fixedUnitsSEDWUBackwardNonEffortDriven;
                }
            }
            else {
                return yield* super.cycleResolutionContext();
            }
        }
    }
    return FixedUnitsMixin;
};
//# sourceMappingURL=FixedUnitsMixin.js.map