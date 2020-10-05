import { hasPartOfProjectStoreMixin } from "../../store/mixin/PartOfProjectMixin.js";
export const PartOfProjectMixin = (base) => {
    class PartOfProjectMixin extends base {
        joinStore(store) {
            let joinedProject = false;
            if (hasPartOfProjectStoreMixin(store)) {
                const project = store.getProject();
                if (project && !this.getProject() && !this.isShadowed()) {
                    this.setProject(project);
                    joinedProject = true;
                }
            }
            super.joinStore(store);
            if (joinedProject)
                this.joinProject();
        }
        unJoinStore(store) {
            super.unJoinStore(store);
            const project = this.isShadowed() ? this.shadowedProject : this.getProject();
            if (hasPartOfProjectStoreMixin(store) && project && project === store.getProject()) {
                this.leaveProject();
                this.setProject(null);
                this.shadowedProject = null;
            }
        }
        joinProject() {
            this.getGraph().addEntity(this);
        }
        leaveProject() {
            const project = this.getProject();
            if (!this.isShadowed()) {
                this.getGraph().removeEntity(this);
            }
            this.leftProject = project;
        }
        shadow() {
            const project = this.getProject();
            if (project) {
                this.leaveProject();
                this.setProject(null);
                this.shadowedProject = project;
            }
            return this;
        }
        unshadow() {
            if (this.shadowedProject) {
                this.setProject(this.shadowedProject);
                this.shadowedProject = null;
                this.joinProject();
            }
            return this;
        }
        isShadowed() {
            return !!this.shadowedProject;
        }
        getProject() {
            return this.isShadowed() ? null : super.getProject();
        }
        calculateProject() {
            const store = this.stores.find(s => hasPartOfProjectStoreMixin(s) && !!s.getProject());
            return store && store.getProject();
        }
        afterSet(field, value, silent, fromRelationUpdate, beforeResult, wasSet) {
            if (wasSet && this.getProject() && this.getProject().getStm().isRestoring) {
                Object.keys(wasSet).forEach(key => {
                    const atom = this.$[key];
                    if (atom && atom.graph) {
                        atom.graph.markAsNeedRecalculation(atom);
                    }
                });
            }
            super.afterSet && super.afterSet(field, value, silent, fromRelationUpdate, beforeResult, wasSet);
        }
    }
    return PartOfProjectMixin;
};
//# sourceMappingURL=PartOfProjectMixin.js.map