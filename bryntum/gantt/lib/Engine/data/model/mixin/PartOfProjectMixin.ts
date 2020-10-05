import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { EngineReplica } from "../../../chrono/Replica.js"
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js"
import { hasPartOfProjectStoreMixin, PartOfProjectStoreMixin } from "../../store/mixin/PartOfProjectMixin.js"
import { IProjectMixin } from "../ProjectMixin.js"
import { ChronoModelMixin } from "./ChronoModelMixin.js"


export const PartOfProjectMixin = <T extends AnyConstructor<PartOfProjectGenericMixin & ChronoModelMixin>>(base : T) => {

    class PartOfProjectMixin extends base {

        stores           : PartOfProjectStoreMixin[]

        shadowedProject  : IProjectMixin

        leftProject      : IProjectMixin


        joinStore (store : PartOfProjectStoreMixin) {
            let joinedProject   = false

            // Joining a store that is not part of project (for example a chained store) should not affect engine
            if (hasPartOfProjectStoreMixin(store)) {
                const project = store.getProject()

                if (project && !this.getProject() && !this.isShadowed()) {
                    this.setProject(project)
                    joinedProject   = true
                }
            }

            super.joinStore(store)

            if (joinedProject) this.joinProject()
        }


        unJoinStore (store : PartOfProjectStoreMixin) {
            super.unJoinStore(store)

            const project = this.isShadowed() ? this.shadowedProject : this.getProject();

            if (hasPartOfProjectStoreMixin(store) && project && project === store.getProject()) {
                this.leaveProject()
                this.setProject(null)
                this.shadowedProject = null;
            }
        }


        /**
         * Template method, which is called when model is joining the project (through joining some store that
         * has already joined the project)
         */
        joinProject () {
            (this.getGraph() as EngineReplica).addEntity(this)
        }


        /**
         * Template method, which is called when model is leaving the project (through leaving some store usually)
         */
        leaveProject () {
            const project = this.getProject()

            if (!this.isShadowed()) {
                (this.getGraph() as EngineReplica).removeEntity(this)
            }

            this.leftProject = project
        }

        /**
         * Shadows an entity from a project until {@link #function~unshadow unshadow()} method call.
         *
         * Shadowed entity do not affect the project, their atoms are excluded from the graph and thus do not take part
         * in the propagation process.
         */
        shadow() : this {
            const project = this.getProject()

            if (project) {
                this.leaveProject()
                this.setProject(null)
                this.shadowedProject = project
            }

            return this;
        }

        /**
         * Unshadows entity preveosly shadowed by {@link #function~shadow shadow()} call.
         */
        unshadow() : this {
            if (this.shadowedProject) {
                this.setProject(this.shadowedProject)
                this.shadowedProject = null;
                this.joinProject()
            }

            return this;
        }

        /**
         * Checks if an entity has been shadowed
         */
        isShadowed() {
            return !!this.shadowedProject
        }


        getProject() {
            return this.isShadowed() ? null : super.getProject();
        }


        calculateProject () : IProjectMixin {
            // const store = this.stores[0];
            // return store && store.getProject();
            const store = this.stores.find(s => hasPartOfProjectStoreMixin(s) && !!s.getProject());
            return store && store.getProject()
        }


        afterSet(field, value, silent, fromRelationUpdate, beforeResult, wasSet) : void {
            // When undoing old data is set directly to the data object bypassing
            // accessors, which puts atoms like constraintDate into outdated state.
            // Iterating over modified fields and updating required atoms manually
            if (wasSet && this.getProject() && this.getProject().getStm().isRestoring) {
                Object.keys(wasSet).forEach(key => {
                    const atom = this.$[key];
                    // touch atoms affected by undo operation
                    if (atom && atom.graph) {
                        atom.graph.markAsNeedRecalculation(atom)
                    }
                })
            }
            // @ts-ignore
            super.afterSet && super.afterSet(field, value, silent, fromRelationUpdate, beforeResult, wasSet)
        }
    }

    return PartOfProjectMixin
}

/**
 * This a base mixin for every Model, that belongs to a project.
 *
 * The model with this mixin, supposes, that it will be "joining" the store, that is already part of the project,
 * so that such model can take a reference to the project from it.
 *
 * It provides 2 template methods [[joinProject]] and [[leaveProject]], which can be overriden in other mixins
 * (they should always call `super` implementation, because it adds/remove the model to/from the ChronoGraph instance)
 *
 */
export interface PartOfProjectMixin extends Mixin<typeof PartOfProjectMixin> {}
