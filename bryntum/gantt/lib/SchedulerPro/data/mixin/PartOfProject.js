import Base from '../../../Core/Base.js';

/**
 * @module SchedulerPro/data/mixin/PartOfProject
 */

const throwIfNotTheSameStore = (oldStore, newStore) => {
    if (oldStore !== newStore) {
        throw new Error('Store set is prohibited for Scheduler Pro entity!');
    }
};

/**
 * This is a mixin, included in all models and stores of the Scheduler Pro project. It provides a common API for accessing
 * all stores of the project.
 *
 * @mixin
 */
export default Target => class PartOfProject extends (Target || Base) {

    // had to place it here "globally", because w/o it, somehow, the `relationConfig`
    // of the Scheduler's `AssignmentModel` was exposed, breaking the things
    static get relationConfig() {
        // "turn-off" the relations inherited from scheduler - those interfere with the engine's internals
        return [];
    }

    /**
     * Returns a task store of the project this entity belongs to.
     *
     * @method getEventStore
     * @return {SchedulerPro.data.TaskStore}
     */

    /**
     * Returns a resource store of the project this entity belongs to.
     *
     * @method getResourceStore
     * @return {SchedulerPro.data.ResourceStore}
     */

    /**
     * Returns an assignment store of the project this entity belongs to.
     *
     * @method getAssignmentStore
     * @return {SchedulerPro.data.AssignmentStore}
     */

    /**
     * Returns a dependency store of the project this entity belongs to.
     *
     * @method getDependencyStore
     * @return {SchedulerPro.data.DependencyStore}
     */

    /**
     * Returns a calendar manager store of the project this entity belongs to.
     *
     * @method getCalendarManagerStore
     * @return {SchedulerPro.data.CalendarManagerStore}
     */

    /**
     * Returns a project this entity belongs to.
     *
     * @method getProject
     * @return {SchedulerPro.model.ProProjectModel}
     */

    /**
     * Returns a project this entity belongs to.
     *
     * @property {SchedulerPro.model.ProProjectModel}
     * @readonly
     */

    /**
     * Returns a task store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.TaskStore}
     * @readonly
     */
    get taskStore() {
        return this.eventStore;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set taskStore(store) {
        this.eventStore = store;
    }

    /**
     * Returns a task store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.TaskStore|Scheduler.data.EventStore}
     * @readonly
     * @ts-ignore
     */
    get eventStore() {
        const project = this.getProject();
        return project && project.getEventStore() || null;
    }

    get leftProjectEventStore() {
        const project = this.leftProject;
        return project && project.getEventStore() || null;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set eventStore(store) {
        throwIfNotTheSameStore(this.eventStore, store);
    }

    /**
     * Returns a dependency store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.DependencyStore|Scheduler.data.DependencyStore}
     * @readonly
     * @ts-ignore
     */
    get dependencyStore() {
        const project = this.getProject();
        return project && project.getDependencyStore() || null;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set dependencyStore(store) {
        throwIfNotTheSameStore(this.dependencyStore, store);
    }

    /**
     * Returns an assignment store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.AssignmentStore|Scheduler.data.AssignmentStore}
     * @readonly
     */
    get assignmentStore() {
        const project = this.getProject();
        return project && project.getAssignmentStore() || null;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set assignmentStore(store) {
        throwIfNotTheSameStore(this.assignmentStore, store);
    }

    /**
     * Returns a resource store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.ResourceStore|Scheduler.data.ResourceStore}
     * @readonly
     * @ts-ignore
     */
    get resourceStore() {
        const project = this.getProject();
        return project && project.getResourceStore() || null;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set resourceStore(store) {
        throwIfNotTheSameStore(this.resourceStore, store);
    }

    /**
     * Returns a calendar manager store of the project this entity belongs to.
     *
     * @property {SchedulerPro.data.CalendarManagerStore}
     * @readonly
     */
    get calendarManagerStore() {
        const project = this.getProject();
        return project && project.getCalendarManagerStore() || null;
    }

    // this setter actually does nothing, intentionally, setting the stores on other stores is deprecated
    set calendarManagerStore(store) {
        throwIfNotTheSameStore(this.calendarManagerStore, store);
    }
};
