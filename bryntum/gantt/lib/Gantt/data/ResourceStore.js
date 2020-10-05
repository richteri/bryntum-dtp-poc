import ProResourceStore from '../../SchedulerPro/data/ResourceStore.js';
import ResourceModel from '../model/ResourceModel.js';

/**
 * @module Gantt/data/ResourceStore
 */

/**
 * A class representing the collection of the resources - {@link Gantt/model/ResourceModel} records.
 *
 * @extends SchedulerPro/data/ResourceStore
 * @typings SchedulerPro/data/ResourceStore -> SchedulerPro/data/ProResourceStore
 */
export default class ResourceStore extends ProResourceStore {
    static get defaultConfig() {
        return {
            modelClass : ResourceModel
        };
    }
}
