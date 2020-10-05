import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { Entity } from "../../../../ChronoGraph/replica/Entity.js"
import Model from "../../../../Core/data/Model.js"


export const ChronoModelMixin = <T extends AnyConstructor<Model & Entity>>(base : T) => {

    class ChronoModelMixin extends base {

        construct (config, ...args : any[]) {
            // this is to force the fields creation, because we need all fields to be created
            // for the `this.getFieldDefinition()` to return correct result
            // @ts-ignore
            this.constructor.exposeProperties()

            const commonConfig      = {}
            const chronoConfig      = {}

            // Cache original data before we recreate the incoming data here.
            // @ts-ignore
            this.originalData = (config = config || {})

            for (let key in config) {
                const fieldDefinition = this.getFieldDefinitionFromDataSource(key)
                const field           = fieldDefinition ? fieldDefinition.name : key
                const chronoField     = this.$entity.getField(field)

                if (!chronoField || field == 'expanded' || field == 'children')
                    // Use mapped name for model data (myName, myStartDate)
                    commonConfig[ key ] = config[ key ]
                else {
                    // Use the predefined name for engine (name, startDate)
                    chronoConfig[ field ] = config[ key ]
                }
            }

            super.construct(commonConfig, ...args)

            Object.assign(this, chronoConfig)
        }

        copy (newId : string | number = null, proposed : boolean = true) : this {
            const copy = super.copy(newId)

            proposed && this.forEachFieldAtom((atom, fieldName) => {
                copy.$[ fieldName ].put(atom.get())
            })

            return copy
        }
    }

    return ChronoModelMixin
}

/**
 * This mixin serves as a "bridge" between the ChronoGraph's `Entity` and `Model` from Bryntum Common package
 */
export interface ChronoModelMixin extends Mixin<typeof ChronoModelMixin> {}
