import { base } from '../../Core/helper/MixinHelper.js';
import Dependencies from '../../Scheduler/feature/Dependencies.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ProDataAPI from '../data/api/ProDataAPI.js';

/**
 * @module SchedulerPro/feature/ProDependencies
 */

/**
 * Dependencies feature adopted to work with ProScheduler.
 *
 * @extends Scheduler/feature/Dependencies
 */
export default class ProDependencies extends base(Dependencies).mixes(
    ProDataAPI
) {
    static get featureClass() {
        return 'b-dependencies';
    }

    static get defaultConfig() {
        return {
            terminalSides : ['left', 'right']
        };
    }

    getProjectForDataAPI() {
        return this.dependencyStore.getProject();
    }

    obtainResourceStore(scheduler, config) {
        return scheduler.project.getResourceStore();
    }

    obtainDependencyStore(scheduler, config) {
        return scheduler.project.getDependencyStore();
    }

    obtainAssignmentStore(scheduler, config) {
        return scheduler.project.getAssignmentStore();
    }

    obtainEventStore(scheduler, config) {
        return scheduler.project.getEventStore();
    }
}

GridFeatureManager.registerFeature(ProDependencies, true, 'ProScheduler', 'Dependencies');
