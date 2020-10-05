import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import Store from "../../../../Core/data/Store.js"


export const ChronoStoreMixin = <T extends AnyConstructor<Store>>(base : T) =>

class ChronoStoreMixin extends base {
    // empty for now
}


export interface ChronoStoreMixin extends Mixin<typeof ChronoStoreMixin> {}
