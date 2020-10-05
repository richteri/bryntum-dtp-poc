import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import SchedulerDependencyEdit from '../../Scheduler/feature/DependencyEdit.js';

/**
 * @module Gantt/feature/DependencyEdit
 */

/**
 * Feature that displays a popup containing fields for editing dependency data.
 *
 * This feature is **disabled** by default
 *
 * @extends Scheduler/feature/DependencyEdit
 * @externalexample gantt/feature/DependencyEdit.js
 * @typings Scheduler/feature/DependencyEdit -> Scheduler/feature/SchedulerDependencyEdit
 * @demo Gantt/advanced
 */
export default class DependencyEdit extends SchedulerDependencyEdit {
    //region Config

    static get $name() {
        return 'DependencyEdit';
    }

    static get defaultConfig() {
        return {
            /**
             * True to show the lag field for the dependency
             * @config {Boolean}
             * @default
             * @category Editor widgets
             */
            showLagField : true
        };
    }
    //endregion
}

GridFeatureManager.registerFeature(DependencyEdit, false);
