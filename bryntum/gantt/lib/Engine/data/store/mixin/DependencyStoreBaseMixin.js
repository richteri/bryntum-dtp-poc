import { MinimalDependency } from "../../model/DependencyMixin.js";
export const DependencyStoreBaseMixin = (base) => {
    class DependencyStoreBaseMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: MinimalDependency
            };
        }
    }
    return DependencyStoreBaseMixin;
};
//# sourceMappingURL=DependencyStoreBaseMixin.js.map