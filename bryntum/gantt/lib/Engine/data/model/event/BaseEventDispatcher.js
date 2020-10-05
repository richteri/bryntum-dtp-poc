import { CycleResolutionInputChrono } from "../../../../ChronoGraph/chrono/CycleResolver.js";
import { CycleDescription, CycleResolution, Formula } from "../../../../ChronoGraph/cycle_resolver/CycleResolver.js";
import { MinimalFieldAtom } from "../../../../ChronoGraph/replica/Atom.js";
export var Instruction;
(function (Instruction) {
    Instruction["KeepDuration"] = "KeepDuration";
    Instruction["KeepStartDate"] = "KeepStartDate";
    Instruction["KeepEndDate"] = "KeepEndDate";
})(Instruction || (Instruction = {}));
export const StartDateVar = Symbol('StartDate');
export const EndDateVar = Symbol('EndDate');
export const DurationVar = Symbol('Duration');
export const startDateFormula = Formula.new({
    output: StartDateVar,
    inputs: new Set([DurationVar, EndDateVar])
});
export const endDateFormula = Formula.new({
    output: EndDateVar,
    inputs: new Set([DurationVar, StartDateVar])
});
export const durationFormula = Formula.new({
    output: DurationVar,
    inputs: new Set([StartDateVar, EndDateVar])
});
export const SEDGraphDescription = CycleDescription.new({
    variables: new Set([StartDateVar, EndDateVar, DurationVar]),
    formulas: new Set([startDateFormula, endDateFormula, durationFormula])
});
export const SEDForwardCycleResolutionContext = CycleResolution.new({
    description: SEDGraphDescription,
    defaultResolutionFormulas: new Set([endDateFormula])
});
export const SEDBackwardCycleResolutionContext = CycleResolution.new({
    description: SEDGraphDescription,
    defaultResolutionFormulas: new Set([startDateFormula])
});
export class SEDDispatcher extends CycleResolutionInputChrono {
    addInstruction(instruction) {
        if (instruction === Instruction.KeepStartDate)
            this.addKeepIfPossibleFlag(StartDateVar);
        if (instruction === Instruction.KeepEndDate)
            this.addKeepIfPossibleFlag(EndDateVar);
        if (instruction === Instruction.KeepDuration)
            this.addKeepIfPossibleFlag(DurationVar);
    }
}
export class SEDDispatcherIdentifier extends MinimalFieldAtom {
    equality(v1, v2) {
        const resolution1 = v1.resolution;
        const resolution2 = v2.resolution;
        return resolution1.get(StartDateVar) === resolution2.get(StartDateVar)
            && resolution1.get(EndDateVar) === resolution2.get(EndDateVar)
            && resolution1.get(DurationVar) === resolution2.get(DurationVar);
    }
}
//# sourceMappingURL=BaseEventDispatcher.js.map