import { Base } from "../class/Mixin.js";
export var EffectResolutionResult;
(function (EffectResolutionResult) {
    EffectResolutionResult[EffectResolutionResult["Cancel"] = 0] = "Cancel";
    EffectResolutionResult[EffectResolutionResult["Restart"] = 1] = "Restart";
    EffectResolutionResult[EffectResolutionResult["Resume"] = 2] = "Resume";
})(EffectResolutionResult || (EffectResolutionResult = {}));
export class Effect extends Base {
}
export class PromiseEffect extends Effect {
}
export class CancelPropagationEffect extends Effect {
}
export class RestartPropagationEffect extends Effect {
}
export class GraphCycleDetectedEffect extends Effect {
}
//# sourceMappingURL=Effect.js.map