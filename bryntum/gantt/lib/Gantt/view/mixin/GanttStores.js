import Base from '../../../Core/Base.js';

/**
 * @module Gantt/view/mixin/GanttStores
 */

/**
 * Functions for store assignment and store event listeners.
 * Properties are aliases to corresponding
 ones of Gantt's {@link Gantt.model.ProjectModel project} instance.
 *
 * @mixin
 */
export default Target => class GanttStores extends (Target || Base) {

    //region Project

    get project() {
        return this._project;
    }

    set project(project) {
        this._project = project;

        this.onTaskStoreChange(project.eventStore);
    }

    //endregion

    //region TaskStore

    set tasks(tasks) {
        this.taskStore.data = tasks;
    }

    /**
     * Get {@link Gantt.data.TaskStore TaskStore} instance.
     * @readonly
     * @return {Gantt.data.TaskStore}
     */
    get eventStore() {
        return this.project.eventStore;
    }

    /**
     * Get {@link Gantt.data.TaskStore TaskStore} instance.
     * Alias to {@link #property-eventStore} instance.
     * @readonly
     * @return {Gantt.data.TaskStore}
     */
    get taskStore() {
        return this.eventStore;
    }

    onTaskStoreChange(taskStore) {
        const me            = this;

        // taskStore = me._taskStore = Store.getStore(taskStore, TaskStore);
        taskStore.metaMapId = me.id;

        // taskStore is used for rows (store) and tasks
        me.store = me.timeAxisViewModel.store = taskStore;

        me.dependencyStore = this.project.dependencyStore;
        // if (!taskStore.dependencyStore) {
        //     taskStore.dependencyStore = me.dependencyStore;
        // }

        if (me.features.dependencies) me.features.dependencies.store = me.dependencyStore;

        me.currentOrientation.bindTaskStore(taskStore);

        /*  */
    }

    //endregion

    //region CalendarManagerStore

    // get calendarManagerStore() {
    //     return this.project.calendarManagerStore;
    // }

    //endregion

    //region AssignmentStore

    /**
     * Get {@link Gantt.data.AssignmentStore AssignmentStore} instance.
     * @readonly
     * @return {Gantt.data.AssignmentStore}
     */
    get assignmentStore() {
        return this.project.assignmentStore;
    }

    bindAssignmentStore(assignmentStore, initial) {
        /*  */
    }

    //endregion

    //region ResourceStore

    /**
     * Get {@link Gantt.data.ResourceStore ResourceStore} instance.
     * @readonly
     * @return {Gantt.data.ResourceStore}
     */
    get resourceStore() {
        return this.project.resourceStore;
    }

    bindResourceStore(resourceStore, initial) {
        /*  */
    }

    //endregion

    //region Internal

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}

    //endregion
};
