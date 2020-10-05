/**
 * @module Gantt/model/DependencyModel
 */
import ProDependencyModel from '../../SchedulerPro/model/ProDependencyModel.js';

/**
 * This class represents a single dependency between the tasks in your Gantt project.
 *
 * ## Subclassing the Dependency class
 *
 * The name of any field in data can be customized in the subclass, see the example below.
 *
 * ```javascript
 * class MyDependencyModel extends DependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource : 'targetId' },
 *       { name: 'from', dataSource : 'sourceId' }
 *     ];
 *   }
 * }
 * ```
 * @extends SchedulerPro/model/ProDependencyModel
 * @typings Scheduler/model/DependencyModel -> Scheduler/model/SchedulerDependencyModel
 */
export default class DependencyModel extends ProDependencyModel {
    /**
     * The origin task of this dependency
     * @field {Gantt.model.TaskModel} fromTask
     */

    /**
     * The destination task of this dependency
     * @field {Gantt.model.TaskModel} toTask
     */
}
