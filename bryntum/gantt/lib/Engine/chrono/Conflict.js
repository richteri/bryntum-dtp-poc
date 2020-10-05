import { Effect } from "../../ChronoGraph/chrono/Effect.js";
import { Base } from "../../ChronoGraph/class/Mixin.js";
export class Conflict extends Effect {
}
export class ConflictResolution extends Base {
    getDescription() {
        throw new Error('Abstract method');
    }
    resolve() {
        throw new Error('Abstract method');
    }
}
//# sourceMappingURL=Conflict.js.map