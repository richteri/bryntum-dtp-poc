import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import Store from "../../../Core/data/Store.js"
import { MinimalResource } from "../model/ResourceMixin.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js"
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js"

export const ResourceStoreMixin = <T extends AnyConstructor<PartOfProjectStoreMixin & ChronoStoreMixin>>(base : T) => {

    class ResourceStoreMixin extends base {
        modelClass          : AnyConstructor<MinimalResource>

        static get defaultConfig () {
            return {
                modelClass : MinimalResource
            }
        }
    }

    return ResourceStoreMixin
}


export interface ResourceStoreMixin extends Mixin<typeof ResourceStoreMixin> {}


export const BuildMinimalResourceStore = (base : typeof Store = Store) : MixinConstructor<typeof ResourceStoreMixin> =>
    (ResourceStoreMixin as any)(
    PartOfProjectStoreMixin(
    PartOfProjectGenericMixin(
    ChronoStoreMixin(
        base
    ))))


export class MinimalResourceStore extends BuildMinimalResourceStore() {}
