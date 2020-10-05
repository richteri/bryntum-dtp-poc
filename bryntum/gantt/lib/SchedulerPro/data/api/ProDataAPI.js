import Base from '../../../Core/Base.js';
import { base } from '../../../Core/helper/MixinHelper.js';
// APIs
import EventAPI from '../../../Scheduler/data/api/EventAPI.js';
import AssignmentAPI from '../../../Scheduler/data/api/AssignmentAPI.js';
import DependencyAPI from '../../../Scheduler/data/api/DependencyAPI.js';
import ResourceAPI from '../../../Scheduler/data/api/ResourceAPI.js';
import ProEventAPI from './ProEventAPI.js';
import ProAssignmentAPI from './ProAssignmentAPI.js';
import ProDependencyAPI from './ProDependencyAPI.js';
import ProResourceAPI from './ProResourceAPI.js';
import ProProjectAPI from './ProProjectAPI.js';

/**
 * @module SchedulerPro/data/api/ProDataAPI
 */

/**
 * This mixin combines all data layer APIs and provides a way to call API method regardless
 * if it conflicts with host class method. The mixin should be consumed alongside
 * with {@link SchedulerPro.data.api.ProDataAPI} mixin
 *
 * @mixin
 */
export default Target => {

    // Add new APIs here
    const APIs = [
        ResourceAPI,
        EventAPI,
        AssignmentAPI,
        DependencyAPI,
        ProResourceAPI,
        ProEventAPI,
        ProAssignmentAPI,
        ProDependencyAPI,
        ProProjectAPI
    ];

    const RAW_API = base(Base).mixes(...APIs);

    return class ProDataAPI extends (Target || Base) {
        /**
         * Pro Data layer API gateway
         *
         * @property {Object}
         */
        get dataApi() {
            if (!this._dataApi) {
                this._dataApi = new RAW_API({ host : this.dataApiHost || this });
            }
            return this._dataApi;
        }
    };
};
