import SchedulerResourceStore from '../../Scheduler/data/ResourceStore.js';
import ResourceModel from '../model/ResourceModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import { BuildMinimalResourceStore } from '../../Engine/data/store/ResourceStoreMixin.js';

/**
 * @module SchedulerPro/data/ResourceStore
 */

/**
 * A class representing the collection of the resources - {@link SchedulerPro/model/ResourceModel} records.
 *
 * @extends Scheduler/data/ResourceStore
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @typings Scheduler/data/ResourceStore -> Scheduler/data/SchedulerResourceStore
 */
export default class ResourceStore extends PartOfProject(BuildMinimalResourceStore(SchedulerResourceStore)) {
    //region Config

    static get defaultConfig() {
        return {
            modelClass   : ResourceModel,
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 400,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 200,
            storeId      : 'resources'
        };
    }

    //endregion
}
