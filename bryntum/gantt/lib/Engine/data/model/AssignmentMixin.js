var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate, Entity, generic_field } from "../../../ChronoGraph/replica/Entity.js";
import Model from "../../../Core/data/Model.js";
import { model_field, ModelReferenceField } from "../../chrono/ModelFieldAtom.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js";
const hasMixin = Symbol('AssignmentMixin');
export const AssignmentMixin = (base) => {
    class AssignmentMixin extends base {
        [hasMixin]() { }
        getUnits() {
            return this.units;
        }
        setUnits(units) {
            this.putUnits(units);
            return this.propagate();
        }
        putUnits(units) {
            this.$.units.put(units);
            const event = this.event;
            if (event && this.getGraph()) {
                event.markAsNeedRecalculation(event.$.dispatcher);
                event.markAsNeedRecalculation(event.$.startDate);
                event.markAsNeedRecalculation(event.$.endDate);
                event.markAsNeedRecalculation(event.$.duration);
                event.markAsNeedRecalculation(event.$.effort);
                event.assigned.forEach(assignment => assignment.markAsNeedRecalculation(assignment.$.units));
            }
        }
        *calculateUnits(proposedValue) {
            const event = yield this.$.event;
            if (event && event.calculateAssignmentUnits)
                return yield* event.calculateAssignmentUnits(this, proposedValue);
            return proposedValue !== undefined ? proposedValue : this.$.units.getConsistentValue();
        }
    }
    __decorate([
        model_field({ type: 'number', defaultValue: 100 })
    ], AssignmentMixin.prototype, "units", void 0);
    __decorate([
        generic_field({
            bucket: 'assigned',
            resolver: function (id) { return this.getEventById(id); },
            modelFieldConfig: {
                serialize: event => event.id
            }
        }, ModelReferenceField)
    ], AssignmentMixin.prototype, "event", void 0);
    __decorate([
        generic_field({
            bucket: 'assigned',
            resolver: function (id) { return this.getResourceById(id); },
            modelFieldConfig: {
                serialize: resource => resource.id
            }
        }, ModelReferenceField)
    ], AssignmentMixin.prototype, "resource", void 0);
    __decorate([
        calculate('units')
    ], AssignmentMixin.prototype, "calculateUnits", null);
    return AssignmentMixin;
};
export const BuildMinimalAssignment = (base = Model) => AssignmentMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(base)))));
export class MinimalAssignment extends BuildMinimalAssignment() {
}
export const hasAssignmentMixin = (model) => Boolean(model && model[hasMixin]);
//# sourceMappingURL=AssignmentMixin.js.map