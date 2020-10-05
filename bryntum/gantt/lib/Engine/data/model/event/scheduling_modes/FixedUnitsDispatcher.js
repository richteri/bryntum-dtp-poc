import { CycleResolution, CycleDescription } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js";
import { durationFormula, DurationVar, endDateFormula, EndDateVar, startDateFormula, StartDateVar } from "../BaseEventDispatcher.js";
import { effortFormula, EffortVar, endDateByEffortFormula, startDateByEffortFormula, unitsFormula, UnitsVar } from "../HasEffortDispatcher.js";
export const fixedUnitsSEDWUGraphDescription = CycleDescription.new({
    variables: new Set([StartDateVar, EndDateVar, DurationVar, EffortVar, UnitsVar]),
    formulas: new Set([
        endDateByEffortFormula,
        durationFormula,
        effortFormula,
        unitsFormula,
        startDateByEffortFormula,
        startDateFormula,
        endDateFormula
    ])
});
export const fixedUnitsSEDWUForwardNonEffortDriven = CycleResolution.new({
    description: fixedUnitsSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([endDateByEffortFormula, endDateFormula, effortFormula])
});
export const fixedUnitsSEDWUForwardEffortDriven = CycleResolution.new({
    description: fixedUnitsSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([endDateByEffortFormula, endDateFormula, durationFormula])
});
export const fixedUnitsSEDWUBackwardNonEffortDriven = CycleResolution.new({
    description: fixedUnitsSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([startDateByEffortFormula, startDateFormula, effortFormula])
});
export const fixedUnitsSEDWUBackwardEffortDriven = CycleResolution.new({
    description: fixedUnitsSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([startDateByEffortFormula, startDateFormula, durationFormula])
});
//# sourceMappingURL=FixedUnitsDispatcher.js.map