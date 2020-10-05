import { EffectResolutionResult } from "../../ChronoGraph/chrono/Effect.js";
import { Conflict } from "./Conflict.js";
export const EngineReplica = (base) => class EngineReplica extends base {
    constructor() {
        super(...arguments);
        this.projectRefreshThreshold = 500;
    }
    async propagate(onEffect, dryRun = false) {
        const project = this.project;
        let result;
        if (!this.isPropagating) {
            project.trigger('propagationStart', { dryRun: !!dryRun });
            result = await super.propagate(onEffect, dryRun);
            project.trigger('propagationComplete', { dryRun: !!dryRun, result });
        }
        else {
            result = await super.propagate(onEffect, dryRun);
        }
        return result;
    }
    commit() {
        const project = this.project;
        const changedAtoms = this.changedAtoms;
        const records = new Set(changedAtoms.map((atom) => atom.self));
        records.forEach(r => r.beginBatch());
        project.trigger('beforeCommit', { records, changedAtoms });
        super.commit();
        project.trigger('commit', { records, changedAtoms });
        const silent = records.size > this.projectRefreshThreshold;
        records.forEach(r => r.endBatch(silent));
        if (silent) {
            project.trigger('refresh', { records });
        }
    }
    async onEffect(effect) {
        const project = this.project;
        if (effect instanceof Conflict) {
            if (project.hasListener('schedulingconflict')) {
                return new Promise((resolve, reject) => {
                    project.trigger('schedulingconflict', {
                        conflict: effect,
                        continueWithResolutionResult: resolve
                    });
                });
            }
            else {
                return Promise.resolve(EffectResolutionResult.Cancel);
            }
        }
        else {
            return super.onEffect(effect);
        }
    }
};
//# sourceMappingURL=Replica.js.map