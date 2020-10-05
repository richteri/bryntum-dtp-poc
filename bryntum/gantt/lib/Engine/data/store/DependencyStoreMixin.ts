import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import Store from "../../../Core/data/Store.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { ChronoStoreMixin } from "./mixin/ChronoStoreMixin.js"
import { DependencyStoreBaseMixin } from "./mixin/DependencyStoreBaseMixin.js"
import { DependencyValidationMixin } from "./mixin/DependencyValidationMixin.js"
import { PartOfProjectStoreMixin } from "./mixin/PartOfProjectMixin.js"


export const DependencyStoreMixin = <T extends AnyConstructor<DependencyStoreBaseMixin & DependencyValidationMixin>>(base : T) => {

    class DependencyStoreMixin extends base {
    }

    return DependencyStoreMixin
}


export interface DependencyStoreMixin extends Mixin<typeof DependencyStoreMixin> {}


export const BuildMinimalDependencyStore = (base : typeof Store = Store) : MixinConstructor<typeof DependencyStoreMixin> =>
    (DependencyStoreMixin as any)(
    DependencyValidationMixin(
    DependencyStoreBaseMixin(
    PartOfProjectStoreMixin(
    PartOfProjectGenericMixin(
    ChronoStoreMixin(
        base
    ))))))


export class MinimalDependencyStore extends BuildMinimalDependencyStore() {}
