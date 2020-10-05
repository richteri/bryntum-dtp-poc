import { Effect, EffectResolutionResult, GraphCycleDetectedEffect } from "../../../../ChronoGraph/chrono/Effect.js"
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { Entity } from "../../../../ChronoGraph/replica/Entity.js"
import { DependencyType } from "../../../scheduling/Types.js"
import { hasDependencyMixin, MinimalDependency } from "../../model/DependencyMixin.js"
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js"
import { ModelId } from "../../Types.js"
import { DependencyStoreBaseMixin } from "./DependencyStoreBaseMixin.js"


const hasMixin = Symbol('DependencyValidationMixin')


export const DependencyValidationMixin = <T extends AnyConstructor<DependencyStoreBaseMixin>>(base : T) => {

    class DependencyValidationMixin extends base {

        [hasMixin] () {}

        async isValidDependency (dependency : MinimalDependency | ModelId, toId? : ModelId, depType? : DependencyType) : Promise<boolean> {
            const me = (this as unknown as DependencyStoreBaseMixin & PartOfProjectGenericMixin),
                  project = me.getProject()

            //<debug>
            console.assert(
                !hasDependencyMixin(dependency) || dependency.getProject() != project,
                'Can\'t validate dependency, the dependency given is already a part of this project, validation can be done only on depepdencies which are not joined yet!'
            )
            //</debug>

            // In case we are currently propagating
            await project.waitForPropagateCompleted()

            // Effect handler, here we are interested only in cycles
            const effectHandler = async (effect : Effect) => {
                let result : EffectResolutionResult

                if (effect instanceof GraphCycleDetectedEffect) {
                    result = EffectResolutionResult.Cancel
                }
                else {
                    result = EffectResolutionResult.Resume
                }

                return result
            }

            if (!hasDependencyMixin(dependency)) {
                const eventStore = me.getEventStore(),
                    dependencyClass = me.getDependencyStore().modelClass

                if (typeof dependency == 'object') {
                    dependency = new dependencyClass(dependency)
                }
                else {
                    dependency = new dependencyClass({
                        fromEvent : eventStore.getById(dependency),
                        toEvent   : eventStore.getById(toId),
                        type      : depType
                    })
                }
            }

            const oldProject = dependency.getProject()

            dependency.setProject(project)

            let result = await project.tryPropagateWithEntities(effectHandler, [dependency as Entity])

            dependency.setProject(oldProject)

            return result == PropagationResult.Passed
        }

    }

    return DependencyValidationMixin
}


export interface DependencyValidationMixin extends Mixin<typeof DependencyValidationMixin> {}


/**
 * Dependency validation mixin type guard
 */
export const hasDependencyValidationMixin = (store : any) : store is DependencyValidationMixin => Boolean(store && store[hasMixin])
