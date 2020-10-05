export const PartOfProjectGenericMixin = (base) => {
    class PartOfProjectGenericMixin extends base {
        calculateProject() {
            throw new Error("Implement me");
        }
        setProject(project) {
            return this.project = project;
        }
        getProject() {
            if (this.project)
                return this.project;
            return this.setProject(this.calculateProject());
        }
        getGraph() {
            const project = this.getProject();
            return project && project.getGraph();
        }
        getEventStore() {
            const project = this.getProject();
            return project && project.eventStore;
        }
        getDependencyStore() {
            const project = this.getProject();
            return project && project.dependencyStore;
        }
        getAssignmentStore() {
            const project = this.getProject();
            return project && project.assignmentStore;
        }
        getResourceStore() {
            const project = this.getProject();
            return project && project.resourceStore;
        }
        getCalendarManagerStore() {
            const project = this.getProject();
            return project && project.calendarManagerStore;
        }
        getEventById(id) {
            return this.getEventStore() && this.getEventStore().getById(id);
        }
        getDependencyById(id) {
            return this.getDependencyStore() && this.getDependencyStore().getById(id);
        }
        getResourceById(id) {
            return this.getResourceStore() && this.getResourceStore().getById(id);
        }
        getAssignmentById(id) {
            return this.getAssignmentStore() && this.getAssignmentStore().getById(id);
        }
        getCalendarById(id) {
            return this.getCalendarManagerStore() && this.getCalendarManagerStore().getById(id);
        }
    }
    return PartOfProjectGenericMixin;
};
//# sourceMappingURL=PartOfProjectGenericMixin.js.map