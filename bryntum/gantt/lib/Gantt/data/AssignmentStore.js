import ProAssignmentStore from '../../SchedulerPro/data/AssignmentStore.js';
import AssignmentModel from '../model/AssignmentModel.js';

/**
 * @module Gantt/data/AssignmentStore
 */

/**
 * A class representing a collection of assignments between tasks in the {@link Gantt/data/TaskStore} and resources
 * in the {@link Gantt/data/ResourceStore}.
 *
 * Contains a collection of the {@link Gantt/model/AssignmentModel} records.
 *
 * @extends SchedulerPro/data/AssignmentStore
 * @typings SchedulerPro/data/AssignmentStore -> SchedulerPro/data/ProAssignmentStore
 */
export default class AssignmentStore extends ProAssignmentStore {
    static get defaultConfig() {
        return {
            modelClass : AssignmentModel
        };
    }
}
