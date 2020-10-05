import Localizable from '../../Core/localization/Localizable.js';
import DependencyBaseModel from '../../Scheduler/model/DependencyBaseModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { BuildMinimalDependency } from '../../Engine/data/model/DependencyMixin.js';

const canonicalDependencyTypes = [
    'SS',
    'SF',
    'FS',
    'FF'
];

/**
 * @module SchedulerPro/model/ProDependencyModel
 */

/**
 * This class represents a single dependency between the tasks in your Scheduler Pro project.
 *
 * ## Subclassing the Dependency class
 *
 * The name of any field in data can be customized in the subclass, see the example below.
 *
 * ```javascript
 * class MyDependencyModel extends ProDependencyModel {
 *   static get fields() {
 *     return [
 *       { name: 'to', dataSource : 'targetId' },
 *       { name: 'from', dataSource : 'sourceId' }
 *     ];
 *   }
 * }
 * ```
 * @extends Scheduler/model/DependencyBaseModel
 */
export default class ProDependencyModel extends PartOfProject(BuildMinimalDependency(Localizable(DependencyBaseModel))) {

    static get fields() {
        return [
            { name : 'from', persist : false },
            { name : 'to', persist : false }
        ];
    }

    /**
     * The origin task of this dependency
     * @field {SchedulerPro.model.ProTaskModel} fromEvent
     */

    /**
     * The destination task of this dependency
     * @field {SchedulerPro.model.ProTaskModel} toEvent
     */

    /**
     * A numeric part of the lag (or lead) value between the events.
     * Negative values are supported and treated as lead. Please note, that only working time is counted as
     * "lag" time.
     * @field {Number} lag
     */

    /**
     * A duration unit part of the lag value between the tasks
     * @field {String} lagUnit
     */

    constructor(...args) {
        const [config] = args;

        if (config && config.fromTask) {
            config.fromEvent = config.fromTask;
        }

        if (config && config.toTask) {
            config.toEvent = config.toTask;
        }

        super(...args);
    }

    //region Tasks

    /**
     * Gets/sets the source task of the dependency
     * @property {SchedulerPro.model.ProTaskModel}
     */
    set sourceTask(task) {
        this.fromEvent = task;
    }

    get sourceTask() {
        return this.fromEvent;
    }

    set sourceEvent(task) {
        this.fromEvent = task;
    }

    get sourceEvent() {
        return this.fromEvent;
    }

    get from() {
        return this.fromEvent && this.fromEvent.id;
    }

    get fromTask() {
        return this.fromEvent;
    }

    set fromTask(task) {
        this.fromEvent = task;
    }

    getFromTask() {
        return this.getFromEvent();
    }

    setFromTask(...args) {
        return this.setFromEvent(...args);
    }

    /**
     * Gets/sets the target task of the dependency
     * @property {SchedulerPro.model.ProTaskModel}
     *
     */
    set targetTask(task) {
        this.toEvent = task;
    }

    get to() {
        return this.toEvent && this.toEvent.id;
    }

    get targetTask() {
        return this.toEvent;
    }

    set targetEvent(task) {
        this.toEvent = task;
    }

    get targetEvent() {
        return this.toEvent;
    }

    get toTask() {
        return this.toEvent;
    }

    set toTask(task) {
        this.toEvent = task;
    }

    getToTask() {
        return this.getToEvent();
    }

    setToTask(...args) {
        return this.setToEvent(...args);
    }

    //endregion

    /**
     * Sets the amount of lag for the dependency. Will update the schedule - returns a `Promise`
     *
     * @method setLag
     * @param {Number} amount The amount of lag for the dependency
     * @param {String} [unit] Lag duration unit
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the origin task for the dependency. Will update the schedule - returns a `Promise`
     *
     * @method setFromEvent
     * @param {SchedulerPro.model.ProTaskModel} event The new origin event
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the destination task for the dependency. Will update the schedule - returns a `Promise`
     *
     * @method setToEvent
     * @param {SchedulerPro.model.ProTaskModel} event The new destination event
     * @returns {Promise}
     * @propagating
     */

    getTypeFromSides(fromSide, toSide, rtl) {
        const
            types     = DependencyBaseModel.Type,
            startSide = rtl ? 'right' : 'left',
            endSide   = rtl ? 'left' : 'right';

        // TODO: change right, left to end, start

        if (fromSide === startSide) {
            return (toSide === startSide) ? types.StartToStart : types.StartToEnd;
        }

        return (toSide === endSide) ? types.EndToEnd : types.EndToStart;
    }

    getConnectorString(raw) {
        const rawValue = canonicalDependencyTypes[this.type];

        if (raw) {
            return rawValue;
        }

        // FS => empty string; it's the default
        if (this.type === DependencyBaseModel.Type.EndToStart) {
            return '';
        }

        // See if there is a local version of SS, SF or FF

        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{SchedulerProCommon.SS}'
        // 'L{SchedulerProCommon.SF}'
        // 'L{SchedulerProCommon.FS}'
        // 'L{SchedulerProCommon.FF}'

        return this.L(`L{SchedulerProCommon.${rawValue}}`);
    }
}
