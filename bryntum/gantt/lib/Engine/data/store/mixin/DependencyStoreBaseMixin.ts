import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { MinimalDependency } from "../../model/DependencyMixin.js"
import { ChronoStoreMixin } from "./ChronoStoreMixin.js"
import { PartOfProjectStoreMixin } from "./PartOfProjectMixin.js"


export const DependencyStoreBaseMixin = <T extends AnyConstructor<PartOfProjectStoreMixin & ChronoStoreMixin>>(base : T) => {

    class DependencyStoreBaseMixin extends base {
        modelClass          : AnyConstructor<MinimalDependency>

        static get defaultConfig () {
            return {
                modelClass : MinimalDependency
            }
        }
    }

    return DependencyStoreBaseMixin
}


export interface DependencyStoreBaseMixin extends Mixin<typeof DependencyStoreBaseMixin> {}
