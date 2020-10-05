import { AnyConstructor } from "../../ChronoGraph/class/Mixin.js"
import { MinimalFieldAtom } from "../../ChronoGraph/replica/Atom.js"
import { Entity, generic_field } from "../../ChronoGraph/replica/Entity.js"
import { ReferenceAtom, ReferenceBucketAtom, ReferenceBucketFieldMixin, ReferenceFieldMixin } from "../../ChronoGraph/replica/Reference.js"
import { ConverterFunc, Field } from "../../ChronoGraph/schema/Field.js"
import Model from "../../Core/data/Model.js"
import DateHelper from "../../Core/helper/DateHelper.js"


// Fields

//---------------------------------------------------------------------------------------------------------------------
export type ModelFieldConfig = {
    type?               : string,
    isEqual?            : (a, b) => boolean,
    allowNull?          : boolean,
    defaultValue?       : any,
    format?             : string,
    dateFormat?         : string,
    persist?            : boolean,
    convert?            : (value) => any,
    serialize?          : (value) => any
}


//---------------------------------------------------------------------------------------------------------------------
export class ModelField extends Field {
    atomCls             : typeof MinimalFieldAtom   = ChronoModelFieldAtom

    modelFieldConfig    : ModelFieldConfig  = {}
}


//---------------------------------------------------------------------------------------------------------------------
export class ModelReferenceField extends ReferenceFieldMixin(ModelField) {
    atomCls             : typeof MinimalFieldAtom   = ChronoModelReferenceFieldAtom
}


//---------------------------------------------------------------------------------------------------------------------
export class ModelBucketField extends ReferenceBucketFieldMixin(ModelField) {
    atomCls             : typeof MinimalFieldAtom   = ChronoModelReferenceBucketFieldAtom

    initialize (...args) {
        super.initialize(...args)

        this.modelFieldConfig   = Object.assign({ isEqual : () => false, defaultValue : new Set(), persist : false }, this.modelFieldConfig)
    }
}

// eof Fields


// Atoms

//---------------------------------------------------------------------------------------------------------------------
export class ChronoModelFieldAtom extends MinimalFieldAtom {

    self        : Entity & Model


    get value () {
        return this.self.get(this.field.name)
    }

    set value (value : any) {
        this.self.set(this.field.name, value)
    }
}


//---------------------------------------------------------------------------------------------------------------------
export class ChronoModelReferenceFieldAtom extends ReferenceAtom(ChronoModelFieldAtom) {}


//---------------------------------------------------------------------------------------------------------------------
export class ChronoModelReferenceBucketFieldAtom extends ReferenceBucketAtom(ChronoModelFieldAtom) {

    get value () {
        if (!this.self) return

        return this.self.get(this.field.name)
    }


    set value (value : any) {
        // this can be only setting of the default value from the property
        // initializer (from the "engine" bucket)
        if (!this.self) return

        this.self.set(this.field.name, value)
    }
}

// eof Atoms


export const model_field = function (modelFieldConfig : ModelFieldConfig = {}, chronoFieldConfig : Partial<Field> = {}) : PropertyDecorator {

    return function (target : Entity, propertyKey : string) : void {
        const decoratorFn = generic_field({ modelFieldConfig, ...chronoFieldConfig }, ModelField)

        decoratorFn(target, propertyKey)

        injectStaticFieldsProperty(target.constructor)
    }
}


export const injectStaticFieldsProperty = (prototype : object) => {
    if (!prototype.hasOwnProperty('fields')) {
        Object.defineProperty(prototype, 'fields', {
            get : function () {
                return getDecoratedModelFields(this)
            }
        })
    }
}


export const getDecoratedModelFields = (constr : AnyConstructor) : object[] => {
    let result = []

    const proto     = constr.prototype

    if (proto.hasOwnProperty('$entity'))
        proto.$entity.fields.forEach((field : Field) => {
            if (field instanceof ModelField) {
                result.push(
                    Object.assign(field.modelFieldConfig || {}, { name : field.name })
                )
            }
        })

    return result
}


export const dateConverter : ConverterFunc = (date : Date | string, field : ModelField) => {
    if (date === null) return null

    if (!(date instanceof Date)) {
        date        = DateHelper.parse(date, field.modelFieldConfig.format || field.modelFieldConfig.dateFormat)
    }
    // if parsing has failed, we would like to return `undefined` to indicate the "absence" of data
    // instead of `null` (presence of "empty" data)
    return date || undefined

}
