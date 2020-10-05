import Store from "../../../Core/data/Store.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js";
import { DependencyStoreBaseMixin } from "./mixin/DependencyStoreBaseMixin.js";
import { DependencyValidationMixin } from "./mixin/DependencyValidationMixin.js";
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js";
export const DependencyStoreMixin = (base) => {
    class DependencyStoreMixin extends base {
    }
    return DependencyStoreMixin;
};
export const BuildMinimalDependencyStore = (base = Store) => DependencyStoreMixin(DependencyValidationMixin(DependencyStoreBaseMixin(PartOfProjectStoreMixin(PartOfProjectGenericMixin(ChronoStoreMixin(base))))));
export class MinimalDependencyStore extends BuildMinimalDependencyStore() {
}
//# sourceMappingURL=DependencyStoreMixin.js.map