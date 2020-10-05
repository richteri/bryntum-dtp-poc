import Base from '../../../Core/Base.js';

/**
 * @module SchedulerPro/view/mixin/ProSchedulerStores
 */

/**
 * Functions for store assignment and store event listeners overriden for Scheduler Pro
 *
 * @mixin
 */
export default Target => class ProSchedulerStores extends (Target || Base) {

    get project() {
        return this._project;
    }

    set project(project) {
        Object.assign(this, {
            _project        : project,
            // TODO: First assigning this.resourceStore -> this.store and then reassigning it looks backwards?
            store           : this.resourcesStore,
            resourceStore   : project.getResourceStore(),
            eventStore      : project.getEventStore(),
            assignmentStore : project.getAssignmentStore(),
            dependencyStore : project.getDependencyStore(),
            taskStore       : project.getEventStore()
        });
    }

    onBeforeAssignmentRemove(event) {
        event.doRemoveLastEvent = false;
        super.onBeforeAssignmentRemove(event);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
