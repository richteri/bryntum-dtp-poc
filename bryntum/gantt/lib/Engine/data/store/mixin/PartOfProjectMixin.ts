import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import Store from "../../../../Core/data/Store.js"
import { IProjectMixin } from "../../model/ProjectMixin.js"
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js"

const hasMixin = Symbol('PartOfProjectStoreMixin')

export const PartOfProjectStoreMixin = <T extends AnyConstructor<PartOfProjectGenericMixin & Store>>(base : T) => {

    class PartOfProjectStoreMixin extends base {

        [hasMixin] () {}

        calculateProject () : IProjectMixin {
            // project is supposed to be provided for stores from outside
            return this.project
        }


        loadData (data : any) {
            super.loadData(data)

            const project = this.getProject()

            project && project.trigger('storerefresh', { store : this })
        }
    }

    return PartOfProjectStoreMixin
}


export interface PartOfProjectStoreMixin extends Mixin<typeof PartOfProjectStoreMixin> {}

/**
 * Type guard
 */
export const hasPartOfProjectStoreMixin = (store : any) : store is PartOfProjectStoreMixin => Boolean(store && store[hasMixin])
