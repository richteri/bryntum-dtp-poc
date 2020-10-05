var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate, Entity, field, generic_field } from "../../../ChronoGraph/replica/Entity.js";
import { isAtomicValue } from "../../../ChronoGraph/util/Helper.js";
import Model from "../../../Core/data/Model.js";
import DateHelper from "../../../Core/helper/DateHelper.js";
import { model_field, ModelReferenceField } from "../../chrono/ModelFieldAtom.js";
import { DependenciesCalendar, DependencyType, TimeUnit } from "../../scheduling/Types.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js";
const hasMixin = Symbol('hasMixin');
export const DependencyMixin = (base) => {
    class DependencyMixin extends base {
        [hasMixin]() { }
        *calculateSelf() {
            yield this.$.lag;
            yield this.$.lagUnit;
            yield this.$.type;
            return this;
        }
        *calculateCalendar() {
            const dependenciesCalendar = yield this.getProject().$.dependenciesCalendar;
            let calendar;
            switch (dependenciesCalendar) {
                case DependenciesCalendar.Project:
                    calendar = yield this.getProject().$.calendar;
                    break;
                case DependenciesCalendar.FromEvent:
                    const fromEvent = yield this.$.fromEvent;
                    calendar = fromEvent && !isAtomicValue(fromEvent) ? yield fromEvent.$.calendar : null;
                    break;
                case DependenciesCalendar.ToEvent:
                    const toEvent = yield this.$.toEvent;
                    calendar = toEvent && !isAtomicValue(toEvent) ? yield toEvent.$.calendar : null;
                    break;
            }
            if (!calendar)
                calendar = yield this.getProject().$.calendar;
            yield calendar.$$;
            return calendar;
        }
        async setLag(lag, lagUnit = this.lagUnit) {
            this.$.lag.put(lag);
            this.$.lagUnit.put(lagUnit);
            return this.propagate();
        }
    }
    __decorate([
        generic_field({
            bucket: 'outgoingDeps',
            resolver: function (id) { return this.getEventById(id); },
            modelFieldConfig: {
                persist: true,
                serialize: event => event.id
            },
        }, ModelReferenceField)
    ], DependencyMixin.prototype, "fromEvent", void 0);
    __decorate([
        generic_field({
            bucket: 'incomingDeps',
            resolver: function (id) { return this.getEventById(id); },
            modelFieldConfig: {
                persist: true,
                serialize: event => event.id
            },
        }, ModelReferenceField)
    ], DependencyMixin.prototype, "toEvent", void 0);
    __decorate([
        model_field({ type: 'number', defaultValue: 0 })
    ], DependencyMixin.prototype, "lag", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: TimeUnit.Day }, { converter: DateHelper.normalizeUnit })
    ], DependencyMixin.prototype, "lagUnit", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: DependencyType.EndToStart })
    ], DependencyMixin.prototype, "type", void 0);
    __decorate([
        field()
    ], DependencyMixin.prototype, "calendar", void 0);
    __decorate([
        calculate('calendar')
    ], DependencyMixin.prototype, "calculateCalendar", null);
    return DependencyMixin;
};
export const BuildMinimalDependency = (base = Model) => DependencyMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(base)))));
export class MinimalDependency extends BuildMinimalDependency() {
}
export const hasDependencyMixin = (model) => Boolean(model && model[hasMixin]);
//# sourceMappingURL=DependencyMixin.js.map