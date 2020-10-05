import { Effect, EffectResolutionResult, EffectResolverFunction } from "../../ChronoGraph/chrono/Effect.js"
import { PropagationResult } from "../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../ChronoGraph/class/Mixin.js"
import { EntityAtom, FieldAtom } from "../../ChronoGraph/replica/Atom.js"
import { Replica } from "../../ChronoGraph/replica/Replica.js"
import Model from '../../Core/data/Model.js'
import { IProjectMixin } from "../data/model/ProjectMixin.js"
import { Conflict } from "./Conflict.js"


//---------------------------------------------------------------------------------------------------------------------
export const EngineReplica = <T extends AnyConstructor<Replica>>(base : T) =>

class EngineReplica extends base {

    project                 : IProjectMixin

    projectRefreshThreshold : number        = 500


    async propagate (onEffect? : EffectResolverFunction, dryRun : (boolean | Function) = false) : Promise<PropagationResult> {
        const project = this.project

        let result

        // In case we're already propagating the super class throws some exception, to not mangle it I do custom handling
        // with events only if we are not propagating. Otherwise just fallback to superclass.
        if (!this.isPropagating) {

            project.trigger('propagationStart', { dryRun : !!dryRun})

            result = await super.propagate(onEffect, dryRun)

            project.trigger('propagationComplete', { dryRun : !!dryRun, result })
        }
        else {
            result = await super.propagate(onEffect, dryRun)
        }

        return result
    }


    commit () {
        const project = this.project
        const changedAtoms = this.changedAtoms
        const records = new Set(changedAtoms.map((atom : FieldAtom | EntityAtom) => atom.self as Model))

        records.forEach(r => r.beginBatch())

        project.trigger('beforeCommit', { records, changedAtoms })
        super.commit()
        project.trigger('commit', { records, changedAtoms })

        // When there are a lot of changes do not fire any events for individual records. Instead ignore all of them
        // and fire one big refresh which is supposed to trigger one view refresh
        const silent = records.size > this.projectRefreshThreshold

        records.forEach(r => r.endBatch(silent))

        if (silent) {
            project.trigger('refresh', { records })
        }
    }


    async onEffect (effect : Effect) : Promise<EffectResolutionResult> {
        const project   = this.project

        if (effect instanceof Conflict) {
            // is there is a "schedulingconflict" event listener we expect resolution option will be picked there
            if (project.hasListener('schedulingconflict')) {
                return new Promise((resolve, reject) => {
                    project.trigger('schedulingconflict', {
                        conflict                        : effect,
                        continueWithResolutionResult    : resolve
                    })
                })
            // by default we cancel the propagated changes
            } else {
                return Promise.resolve(EffectResolutionResult.Cancel)
            }
        } else {
            return super.onEffect(effect)
        }
    }
}

export type EngineReplica = Mixin<typeof EngineReplica>
