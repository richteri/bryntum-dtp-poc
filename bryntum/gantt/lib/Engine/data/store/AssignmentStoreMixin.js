import Store from "../../../Core/data/Store.js";
import { MinimalAssignment } from "../model/AssignmentMixin.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js";
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js";
export const AssignmentStoreMixin = (base) => {
    class AssignmentStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: MinimalAssignment
            };
        }
    }
    return AssignmentStoreMixin;
};
export const BuildMinimalAssignmentStore = (base = Store) => AssignmentStoreMixin(PartOfProjectStoreMixin(PartOfProjectGenericMixin(ChronoStoreMixin(base))));
export class MinimalAssignmentStore extends BuildMinimalAssignmentStore() {
}
//# sourceMappingURL=AssignmentStoreMixin.js.map