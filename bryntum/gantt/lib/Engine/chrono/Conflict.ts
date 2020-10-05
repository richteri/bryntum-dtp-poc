import { Effect } from "../../ChronoGraph/chrono/Effect.js"
import { Base } from "../../ChronoGraph/class/Mixin.js"


//---------------------------------------------------------------------------------------------------------------------
export class Conflict extends Effect {
    description         : string

    resolutions         : ConflictResolution[]
}


//---------------------------------------------------------------------------------------------------------------------
export class ConflictResolution extends Base {

    getDescription () : string {
        throw new Error('Abstract method')
    }

    resolve () {
        throw new Error('Abstract method')
    }
}
