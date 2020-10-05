import SchedulerDependencyStore from '../../Scheduler/data/DependencyStore.js';
import ProDependencyModel from '../model/ProDependencyModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import { BuildMinimalDependencyStore } from '../../Engine/data/store/DependencyStoreMixin.js';

/**
 * @module SchedulerPro/data/DependencyStore
 */

/**
 * A class representing a collection of dependencies between the tasks in the {@link SchedulerPro/data/TaskStore}.
 * Contains a collection of {@link SchedulerPro/model/ProDependencyModel} records.
 *
 * @extends Scheduler/data/DependencyStore
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @typings Scheduler/data/DependencyStore -> Scheduler/data/SchedulerDependencyStore
 */
export default class DependencyStore extends PartOfProject(BuildMinimalDependencyStore(SchedulerDependencyStore)) {
    //region Config

    static get defaultConfig() {
        return {
            modelClass   : ProDependencyModel,
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 300,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 500
        };
    }

    //endregion

    //region Map/reduce

    // TODO: document
    reduceTaskDependencies(task, reduceFn, result, flat, depsGetterFn) {
        return this.reduceEventDependencies(task, reduceFn, result, flat, depsGetterFn);
    }

    // TODO: document
    reduceTaskPredecessors(task, reduceFn, result, flat) {
        return this.reduceEventPredecessors(task, reduceFn, result, flat);
    }

    // TODO: document
    reduceTaskSuccessors(task, reduceFn, result, flat) {
        return this.reduceEventSuccessors(task, reduceFn, result, flat);
    }

    // TODO: document
    mapTaskDependencies(task, fn, filterFn, flat, depsGetterFn) {
        return this.mapEventDependencies(task, fn, filterFn, flat, depsGetterFn);
    }

    // TODO: document
    mapTaskPredecessors(task, fn, filterFn, flat) {
        return this.mapEventPredecessors(task, fn, filterFn, flat);
    }

    // TODO: document
    mapTaskSuccessors(task, fn, filterFn, flat) {
        return this.mapEventSuccessors(task, fn, filterFn, flat);
    }

    //endregion

    //region Task dependencies

    /**
     * Returns all dependencies for a certain task (both incoming and outgoing).
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     * @return {SchedulerPro.model.ProDependencyModel[]}
     */
    getTaskDependencies(task, flat) {
        return this.getEventDependencies(task, flat);
    }

    /**
     * Returns all predecessors of a task.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     *
     * @return {SchedulerPro.model.ProTaskModel[]}
     */
    getTaskPredecessors(task, flat) {
        return this.getEventPredecessors(task, flat);
    }

    /**
     * Returns all successors of a task.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     *
     * @return {SchedulerPro.model.ProTaskModel[]}
     */
    getTaskSuccessors(task, flat) {
        return this.getEventSuccessors(task, flat);
    }

    /**
     * Removed all dependencies for a task.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     */
    removeTaskDependencies(task, flat) {
        this.removeEventDependencies(task, flat);
    }

    /**
     * Removes all incoming dependencies for a task.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     */
    removeTaskPredecessors(task, flat) {
        this.removeEventPredecessors(task, flat);
    }

    /**
     * Removes all outgoing dependencies for a task.
     *
     * @param {SchedulerPro.model.ProTaskModel} task
     * @param {Boolean} flat
     */
    removeTaskSuccessors(task, flat) {
        this.removeEventSuccessors(task, flat);
    }

    //endregion

    //region Task & dependency getters

    /**
     * Returns dependency model instance linking tasks with given ids. The dependency can be forward (from 1st
     * task to 2nd) or backward (from 2nd to 1st).
     *
     * @param {SchedulerPro.model.ProTaskModel|String} sourceTask 1st task
     * @param {SchedulerPro.model.ProTaskModel|String} targetTask 2nd task
     * @return {SchedulerPro.model.ProDependencyModel}
     */
    getDependencyForSourceAndTargetTasks(sourceTask, targetTask) {
        return this.getDependencyForSourceAndTargetEvents(sourceTask, targetTask);
    }

    /**
     * Returns a dependency model instance linking given tasks if such dependency exists in the store.
     * The dependency can be forward (from 1st event to 2nd) or backward (from 2nd to 1st).
     *
     * @param {SchedulerPro.model.ProTaskModel} sourceEvent
     * @param {SchedulerPro.model.ProTaskModel} targetEvent
     * @return {SchedulerPro.model.ProDependencyModel}
     */
    getTasksLinkingDependency(sourceEvent, targetEvent) {
        return this.getEventsLinkingDependency(sourceEvent, targetEvent);
    }

    async isValidDependencyToCreate(fromId, toId, type) {
        const
            isValid = await this.isValidDependency(fromId, toId, type),
            linked = Boolean(this.getDependencyForSourceAndTargetEvents(fromId, toId));

        return isValid && !linked;
    }

    getTaskById(id) {
        const taskStore = this.taskStore;
        return taskStore && taskStore.getById(id) || null;
    }

    /**
     * Returns the source task of the dependency
     *
     * @param {SchedulerPro.model.ProDependencyModel|Object} dependency The dependency or its id
     * @return {SchedulerPro.model.ProTaskModel} The source task of this dependency
     */
    getSourceTask(dependency) {
        const id = dependency instanceof ProDependencyModel ? dependency.sourceId : dependency;
        return this.getTaskById(id);
    }

    /**
     * Returns the target task of the dependency
     * @param {SchedulerPro.model.ProDependencyModel|Object} dependency The dependency or its id
     * @return {SchedulerPro.model.ProTaskModel} The target task of this dependency
     */
    getTargetTask(dependency) {
        const id = dependency instanceof ProDependencyModel ? dependency.targetId : dependency;
        return this.getTaskById(id);
    }

    //endregion
};
