import AjaxStore from '../../Core/data/AjaxStore.js';
import EventStoreMixin from '../../Scheduler/data/mixin/EventStoreMixin.js';
import ProTaskModel from '../model/ProTaskModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import { BuildMinimalEventStore } from '../../Engine/data/store/EventStoreMixin.js';

/**
 * @module SchedulerPro/data/TaskStore
 */

/**
 * A class representing the tree of tasks in the Scheduler Pro project. An individual task is represented as an instance of the
 * {@link SchedulerPro.model.ProTaskModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * @extends Core/data/AjaxStore
 * @mixes Scheduler/data/mixin/EventStoreMixin
 * @mixes Core/data/mixin/StoreTree
 * @mixes SchedulerPro/data/mixin/PartOfProject
 */
export default class TaskStore extends PartOfProject(BuildMinimalEventStore(EventStoreMixin(AjaxStore))) {
    //region Config

    static get defaultConfig() {
        return {
            tree         : true,
            modelClass   : ProTaskModel,
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 200,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 300,
            storeId      : 'tasks'
        };
    }

    //endregion

    // method just calls `super` - can be removed completely?
    updateIdMap() {
        // for mixins updateIdMap to work
        super.updateIdMap();
    }

    // used during rendering
    getEvents(id) {
        const task = this.getById(id);
        return task && [task];
    }

    getEventsForResource(resourceId) {
        const
            resource    = this.resourceStore.getById(resourceId),
            assignments = resource && resource.assignments.filter(assignment => assignment.isPartOfStore(this.assignmentStore)) || [];
        // TODO: Why not map directly?
        return [...assignments].map(r => r.event);
    }

    getResourcesForEvent(task) {
        return task.assignments.map(a => a.resource);
    }
}
