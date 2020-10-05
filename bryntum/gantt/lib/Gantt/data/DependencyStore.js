import ProDependencyStore from '../../SchedulerPro/data/DependencyStore.js';
import DependencyModel from '../model/DependencyModel.js';

/**
 * @module Gantt/data/DependencyStore
 */

/**
 * A class representing a collection of dependencies between the tasks in the {@link Gantt/data/TaskStore}.
 * Contains a collection of {@link Gantt/model/DependencyModel} records.
 *
 * @extends SchedulerPro/data/DependencyStore
 * @typings SchedulerPro/data/DependencyStore -> SchedulerPro/data/ProDependencyStore
 */
export default class DependencyStore extends ProDependencyStore {
    static get defaultConfig() {
        return {
            modelClass : DependencyModel
        };
    }
}
