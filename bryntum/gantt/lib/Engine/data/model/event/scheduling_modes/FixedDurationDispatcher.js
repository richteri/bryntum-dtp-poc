import { CycleResolution, CycleDescription } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js";
import { durationFormula, DurationVar, endDateFormula, EndDateVar, startDateFormula, StartDateVar } from "../BaseEventDispatcher.js";
import { effortFormula, EffortVar, unitsFormula, UnitsVar } from "../HasEffortDispatcher.js";
export const fixedDurationSEDWUGraphDescription = CycleDescription.new({
    variables: new Set([StartDateVar, EndDateVar, DurationVar, EffortVar, UnitsVar]),
    formulas: new Set([
        startDateFormula,
        endDateFormula,
        durationFormula,
        unitsFormula,
        effortFormula,
    ])
});
export const fixedDurationSEDWUForwardNonEffortDriven = CycleResolution.new({
    description: fixedDurationSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([endDateFormula, effortFormula])
});
export const fixedDurationSEDWUForwardEffortDriven = CycleResolution.new({
    description: fixedDurationSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([endDateFormula, unitsFormula])
});
export const fixedDurationSEDWUBackwardNonEffortDriven = CycleResolution.new({
    description: fixedDurationSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([startDateFormula, effortFormula])
});
export const fixedDurationSEDWUBackwardEffortDriven = CycleResolution.new({
    description: fixedDurationSEDWUGraphDescription,
    defaultResolutionFormulas: new Set([startDateFormula, unitsFormula])
});
//# sourceMappingURL=FixedDurationDispatcher.js.map