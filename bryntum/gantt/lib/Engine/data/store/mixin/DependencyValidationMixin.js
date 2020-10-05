import { EffectResolutionResult, GraphCycleDetectedEffect } from "../../../../ChronoGraph/chrono/Effect.js";
import { PropagationResult } from "../../../../ChronoGraph/chrono/Graph.js";
import { hasDependencyMixin } from "../../model/DependencyMixin.js";
const hasMixin = Symbol('DependencyValidationMixin');
export const DependencyValidationMixin = (base) => {
    class DependencyValidationMixin extends base {
        [hasMixin]() { }
        async isValidDependency(dependency, toId, depType) {
            const me = this, project = me.getProject();
            console.assert(!hasDependencyMixin(dependency) || dependency.getProject() != project, 'Can\'t validate dependency, the dependency given is already a part of this project, validation can be done only on depepdencies which are not joined yet!');
            await project.waitForPropagateCompleted();
            const effectHandler = async (effect) => {
                let result;
                if (effect instanceof GraphCycleDetectedEffect) {
                    result = EffectResolutionResult.Cancel;
                }
                else {
                    result = EffectResolutionResult.Resume;
                }
                return result;
            };
            if (!hasDependencyMixin(dependency)) {
                const eventStore = me.getEventStore(), dependencyClass = me.getDependencyStore().modelClass;
                if (typeof dependency == 'object') {
                    dependency = new dependencyClass(dependency);
                }
                else {
                    dependency = new dependencyClass({
                        fromEvent: eventStore.getById(dependency),
                        toEvent: eventStore.getById(toId),
                        type: depType
                    });
                }
            }
            const oldProject = dependency.getProject();
            dependency.setProject(project);
            let result = await project.tryPropagateWithEntities(effectHandler, [dependency]);
            dependency.setProject(oldProject);
            return result == PropagationResult.Passed;
        }
    }
    return DependencyValidationMixin;
};
export const hasDependencyValidationMixin = (store) => Boolean(store && store[hasMixin]);
//# sourceMappingURL=DependencyValidationMixin.js.map