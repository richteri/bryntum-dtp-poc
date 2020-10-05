import SchedulerAssignmentStore from '../../Scheduler/data/AssignmentStore.js';
import AssignmentModel from '../model/AssignmentModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import { BuildMinimalAssignmentStore } from '../../Engine/data/store/AssignmentStoreMixin.js';

/**
 * @module SchedulerPro/data/AssignmentStore
 */

/**
 * A class representing a collection of assignments between tasks in the {@link SchedulerPro/data/TaskStore} and resources
 * in the {@link SchedulerPro/data/ResourceStore}.
 *
 * Contains a collection of the {@link SchedulerPro/model/AssignmentModel} records.
 *
 * @extends Scheduler/data/AssignmentStore
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @typings Scheduler/data/AssignmentStore -> Scheduler/data/SchedulerAssignmentStore
 */
export default class AssignmentStore extends PartOfProject(BuildMinimalAssignmentStore(SchedulerAssignmentStore)) {
    //region Config

    static get defaultConfig() {
        return {
            modelClass   : AssignmentModel,
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 500,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 400,
            storeId      : 'assignments'
        };
    }

    //endregion

    //region Assignment: add, remove & map

    /**
     * Maps over task assignments.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @param {Function} fn
     * @param {Function} filterFn
     * @return {Object[]}
     */
    mapAssignmentsForTask(task, fn, filterFn) {
        return this.mapAssignmentsForEvent(task, fn, filterFn);
    }

    /**
     * Returns all assignments for a given task.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @return {SchedulerPro.model.AssignmentModel[]}
     */
    getAssignmentsForTask(task) {
        return this.getAssignmentsForEvent(task);
    }

    /**
     * Removes all assignments for given task.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     */
    removeAssignmentsForTask(task) {
        return this.removeAssignmentsForEvent(task);
    }

    /**
     * Returns all resources assigned to a task.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @return {SchedulerPro.model.ResourceModel[]}
     */
    getResourcesForTask(task) {
        return this.getResourcesForEvent(task);
    }

    /**
     * Returns all tasks assigned to a resource.
     *
     * @param {SchedulerPro.model.ResourceModel|Object} resource
     * @return {SchedulerPro.model.ProTaskModel[]}
     */
    getTasksForResource(resource) {
        return this.getEventsForResource(resource);
    }

    /**
     * Creates and adds assignment record for a given task and a resource.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @param {SchedulerPro.model.ResourceModel|Object} resource
     * @return {SchedulerPro.model.AssignmentModel}
     */
    assignTaskToResource(task, resource, units) {
        return this.assignEventToResource(task, resource, assignment => {
            assignment.units = units;
            return assignment;
        });
    }

    /**
     * Removes assignment record for a given task and a resource.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @param {SchedulerPro.model.ResourceModel|Object} resource
     * @return {SchedulerPro.model.AssignmentModel}
     */
    unassignTaskFromResource(task, resource) {
        return this.unassignEventFromResource(task, resource);
    }

    /**
     * Checks whether a task is assigned to a resource.
     *
     * @param {SchedulerPro.model.ProTaskModel|Object} task
     * @param {SchedulerPro.model.ResourceModel|Object} resource
     * @param {Function} [fn] Function which will resieve assignment record if one present
     * @return {Boolean}
     */
    isTaskAssignedToResource(task, resource, fn) {
        return this.isEventAssignedToResource(task, resource, fn);
    }

    /**
     * Returns assignment record for given task and resource.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {SchedulerPro.model.ResourceModel} resource
     * @return {SchedulerPro.model.AssignmentModel}
     */
    getAssignmentForTaskAndResource(task, resource) {
        return this.getAssignmentForEventAndResource(task, resource);
    }

    //endregion
}
