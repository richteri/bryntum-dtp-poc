import { MinimalFieldAtom } from "../../ChronoGraph/replica/Atom.js";
import { generic_field } from "../../ChronoGraph/replica/Entity.js";
import { ReferenceAtom, ReferenceBucketAtom, ReferenceBucketFieldMixin, ReferenceFieldMixin } from "../../ChronoGraph/replica/Reference.js";
import { Field } from "../../ChronoGraph/schema/Field.js";
import DateHelper from "../../Core/helper/DateHelper.js";
export class ModelField extends Field {
    constructor() {
        super(...arguments);
        this.atomCls = ChronoModelFieldAtom;
        this.modelFieldConfig = {};
    }
}
export class ModelReferenceField extends ReferenceFieldMixin(ModelField) {
    constructor() {
        super(...arguments);
        this.atomCls = ChronoModelReferenceFieldAtom;
    }
}
export class ModelBucketField extends ReferenceBucketFieldMixin(ModelField) {
    constructor() {
        super(...arguments);
        this.atomCls = ChronoModelReferenceBucketFieldAtom;
    }
    initialize(...args) {
        super.initialize(...args);
        this.modelFieldConfig = Object.assign({ isEqual: () => false, defaultValue: new Set(), persist: false }, this.modelFieldConfig);
    }
}
export class ChronoModelFieldAtom extends MinimalFieldAtom {
    get value() {
        return this.self.get(this.field.name);
    }
    set value(value) {
        this.self.set(this.field.name, value);
    }
}
export class ChronoModelReferenceFieldAtom extends ReferenceAtom(ChronoModelFieldAtom) {
}
export class ChronoModelReferenceBucketFieldAtom extends ReferenceBucketAtom(ChronoModelFieldAtom) {
    get value() {
        if (!this.self)
            return;
        return this.self.get(this.field.name);
    }
    set value(value) {
        if (!this.self)
            return;
        this.self.set(this.field.name, value);
    }
}
export const model_field = function (modelFieldConfig = {}, chronoFieldConfig = {}) {
    return function (target, propertyKey) {
        const decoratorFn = generic_field(Object.assign({ modelFieldConfig }, chronoFieldConfig), ModelField);
        decoratorFn(target, propertyKey);
        injectStaticFieldsProperty(target.constructor);
    };
};
export const injectStaticFieldsProperty = (prototype) => {
    if (!prototype.hasOwnProperty('fields')) {
        Object.defineProperty(prototype, 'fields', {
            get: function () {
                return getDecoratedModelFields(this);
            }
        });
    }
};
export const getDecoratedModelFields = (constr) => {
    let result = [];
    const proto = constr.prototype;
    if (proto.hasOwnProperty('$entity'))
        proto.$entity.fields.forEach((field) => {
            if (field instanceof ModelField) {
                result.push(Object.assign(field.modelFieldConfig || {}, { name: field.name }));
            }
        });
    return result;
};
export const dateConverter = (date, field) => {
    if (date === null)
        return null;
    if (!(date instanceof Date)) {
        date = DateHelper.parse(date, field.modelFieldConfig.format || field.modelFieldConfig.dateFormat);
    }
    return date || undefined;
};
//# sourceMappingURL=ModelFieldAtom.js.map