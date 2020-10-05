var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, generic_field } from "../../../ChronoGraph/replica/Entity.js";
import Model from "../../../Core/data/Model.js";
import { model_field, ModelBucketField } from "../../chrono/ModelFieldAtom.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { HasCalendarMixin } from "./HasCalendarMixin.js";
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js";
const hasMixin = Symbol('ResourceMixin');
export const ResourceMixin = (base) => {
    class ResourceMixin extends base {
        [hasMixin]() { }
        get assignments() {
            return [...this.assigned];
        }
        leaveProject() {
            const assignmentStore = this.getAssignmentStore();
            this.assigned.forEach(assignment => assignmentStore.remove(assignment));
            super.leaveProject();
        }
    }
    __decorate([
        model_field({ type: 'string' })
    ], ResourceMixin.prototype, "name", void 0);
    __decorate([
        generic_field({}, ModelBucketField)
    ], ResourceMixin.prototype, "assigned", void 0);
    return ResourceMixin;
};
export const BuildMinimalResource = (base = Model) => ResourceMixin(HasCalendarMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(base))))));
export class MinimalResource extends BuildMinimalResource() {
}
export const hasResourceMixin = (model) => Boolean(model && model[hasMixin]);
//# sourceMappingURL=ResourceMixin.js.map