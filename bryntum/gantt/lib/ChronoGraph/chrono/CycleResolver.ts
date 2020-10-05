import { ChronoAtom } from "./Atom.js"
import { CycleResolutionInput, Variable } from "../cycle_resolver/CycleResolver.js"


//---------------------------------------------------------------------------------------------------------------------
/**
 * A subclass of [[CycleResolutionInput]] with additional convenience method [[collectInfo]].
 */
export class CycleResolutionInputChrono extends CycleResolutionInput {

    /**
     * This method, given an effect handler, identifier and a variable, will add [[CycleResolutionInput.addPreviousValueFlag|previous value]]
     * and [[CycleResolutionInput.addProposedValueFlag|proposed value]] flags for that variable.
     *
     * @param Y An effect handler function, which is given as a 1st argument of every calculation function
     * @param atom
     * @param symbol
     */
    collectInfo (atom : ChronoAtom, symbol : Variable) {
        if (atom.hasConsistentValue()) this.addPreviousValueFlag(symbol)

        if (atom.hasProposedValue()) this.addProposedValueFlag(symbol)
    }
}
