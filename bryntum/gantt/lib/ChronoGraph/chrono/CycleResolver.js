import { CycleResolutionInput } from "../cycle_resolver/CycleResolver.js";
export class CycleResolutionInputChrono extends CycleResolutionInput {
    collectInfo(atom, symbol) {
        if (atom.hasConsistentValue())
            this.addPreviousValueFlag(symbol);
        if (atom.hasProposedValue())
            this.addProposedValueFlag(symbol);
    }
}
//# sourceMappingURL=CycleResolver.js.map