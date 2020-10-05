import Store from '../../Core/data/Store.js';
import Model from '../../Core/data/Model.js';
import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import ProTaskModel from './ProTaskModel.js';
import TaskStore from '../data/TaskStore.js';
import DependencyStore from '../data/DependencyStore.js';
import ResourceStore from '../data/ResourceStore.js';
import AssignmentStore from '../data/AssignmentStore.js';
import ProDependencyModel from './ProDependencyModel.js';
import ResourceModel from './ResourceModel.js';
import AssignmentModel from './AssignmentModel.js';
import CalendarManagerStore from '../data/CalendarManagerStore.js';
import ProCalendarModel from './ProCalendarModel.js';
import ProCrudManager from '../data/mixin/ProCrudManager.js';
import { BuildMinimalSchedulerProject } from '../../Engine/data/model/SchedulerProjectMixin.js';

/**
 * @module SchedulerPro/model/ProProjectModel
 */

/**
 * This class represents a global project of your Project plan or scheduler - a central place for all data.
 *
 * Please refer to [this guide](#guides/project_data.md) for more information.
 *
 *
 * @extends SchedulerPro/model/ProTaskModel
 * @mixes SchedulerPro/data/mixin/ProCrudManager
 */
export default class ProProjectModel extends ProCrudManager(BuildMinimalSchedulerProject(Model)) {
    //region Config

    static get defaults() {
        return {
            /**
             * State tracking manager instance the project relies on
             * @property {Core.data.stm.StateTrackingManager}
             * @name stm
             */

            /**
             * The {@link SchedulerPro.data.TaskStore store} holding the tasks information.
             *
             * See also {@link SchedulerPro.model.ProTaskModel}
             *
             * @property {SchedulerPro.data.TaskStore}
             * @name eventStore
             */
            /**
             * An alias for the {@link SchedulerPro.model.ProProjectModel#property-eventStore eventStore}
             *
             * See also {@link SchedulerPro.model.ProTaskModel}
             *
             * @property {SchedulerPro.data.TaskStore}
             * @name taskStore
             */
            // taskStore : null,

            /**
             * The {@link SchedulerPro.data.DependencyStore store} holding the dependencies information.
             *
             * See also {@link SchedulerPro.model.ProDependencyModel}
             *
             * @property {SchedulerPro.data.DependencyStore}
             * @name dependencyStore
             */
            // dependencyStore : null,

            /**
             * The {@link SchedulerPro.data.ResourceStore store} holding the resources that can be assigned to the tasks in the task store.
             *
             * See also {@link SchedulerPro.model.ResourceModel}
             *
             * @property {SchedulerPro.data.ResourceStore}
             * @name resourceStore
             */
            // resourceStore : null,

            /**
             * The {@link SchedulerPro.data.AssignmentStore store} holding the assignments information.
             *
             * See also {@link SchedulerPro.model.AssignmentModel}
             *
             * @property {SchedulerPro.data.AssignmentStore}
             * @name assignmentStore
             */
            // assignmentStore : null

            /**
             * The store, holding the calendars information.
             *
             * @property {SchedulerPro.data.CalendarManagerStore}
             * @name calendarManagerStore
             */

            // root should be always expanded
            expanded : true
        };
    }

    static get defaultConfig() {
        return {
            /**
             * Deprecated, use `taskModelClass`
             * @deprecated Use `taskModelClass`
             * @config {SchedulerPro.model.ProTaskModel} [eventModelClass]
             */
            eventModelClass : null,

            /**
             * The constructor of the event model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link SchedulerPro.model.ProProjectModel#property-eventStore}
             *
             * @config {SchedulerPro.model.ProTaskModel} [taskModelClass]
             */
            taskModelClass : ProTaskModel,

            /**
             * The constructor of the dependency model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link SchedulerPro.model.ProProjectModel#property-dependencyStore}
             *
             * @config {SchedulerPro.model.ProDependencyModel} [dependencyModelClass]
             */
            dependencyModelClass : ProDependencyModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link SchedulerPro.model.ProProjectModel#property-resourceStore}
             *
             * @config {SchedulerPro.model.ResourceModel} [resourceModelClass]
             */
            resourceModelClass : ResourceModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link SchedulerPro.model.ProProjectModel#property-assignmentStore}
             *
             * @config {SchedulerPro.model.AssignmentModel} [assignmentModelClass]
             */
            assignmentModelClass : AssignmentModel,

            /**
             * The constructor of the calendar model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link SchedulerPro.model.ProProjectModel#property-calendarManagerStore}
             *
             * @config {SchedulerPro.model.ProCalendarModel} [calendarModelClass]
             */
            calendarModelClass : ProCalendarModel,

            /**
             * Deprecated, use `taskStoreClass`
             * @deprecated
             * @config {SchedulerPro.data.TaskStore}
             */
            eventStoreClass : null,

            /**
             * The constructor to create an task store instance with. Should be a class, subclassing the {@link SchedulerPro.data.TaskStore}
             * @config {SchedulerPro.data.TaskStore}
             */
            taskStoreClass : TaskStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link SchedulerPro.data.DependencyStore}
             * @config {SchedulerPro.data.DependencyStore}
             */
            dependencyStoreClass : DependencyStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link SchedulerPro.data.ResourceStore}
             * @config {SchedulerPro.data.ResourceStore}
             */
            resourceStoreClass : ResourceStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link SchedulerPro.data.AssignmentStore}
             * @config {SchedulerPro.data.AssignmentStore}
             */
            assignmentStoreClass : AssignmentStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link SchedulerPro.data.CalendarManagerStore}
             * @config {SchedulerPro.data.CalendarManagerStore}
             */
            calendarManagerStoreClass : CalendarManagerStore,

            /**
             * Start date of the project in the ISO 8601 format. Setting this date will constrain all other tasks in the project,
             * to start no later than it. If this date is not provided, it will be calculated as the earliest date among all events.
             *
             * @field {string|Date} startDate
             */

            /**
             * End date of the project in the ISO 8601 format. If this date is not provided, it will be calculated
             * as the earliest date among all tasks.
             *
             * @field {string|Date} endDate
             */

            /**
             * The initial data, to fill the {@link #property-taskStore} with.
             * Should be an array of {@link SchedulerPro.model.ProTaskModel TaskModels} or it's configuration objects.
             *
             * @config {SchedulerPro.model.ProTaskModel[]}
             */
            eventsData : null,

            /**
             * The initial data, to fill the {@link #property-taskStore} with.
             * Should be an array of {@link SchedulerPro.model.ProTaskModel TaskModels} or it's configuration objects.
             *
             * Alias for {@link #config-eventsData}
             *
             * @config {SchedulerPro.model.ProTaskModel[]}
             */
            tasksData : null,

            /**
             * The initial data, to fill the {@link #property-dependencyStore} with.
             * Should be an array of {@link SchedulerPro.model.ProDependencyModel DependencyModels} or it's configuration objects.
             *
             * @config {SchedulerPro.model.ProDependencyModel[]}
             */
            dependenciesData : null,

            /**
             * The initial data, to fill the {@link #property-resourceStore} with.
             * Should be an array of {@link SchedulerPro.model.ResourceModel ResourceModels} or it's configuration objects.
             *
             * @config {SchedulerPro.model.ResourceModel[]}
             */
            resourcesData : null,

            /**
             * The initial data, to fill the {@link #property-assignmentStore} with.
             * Should be an array of {@link SchedulerPro.model.AssignmentModel AssignmentModels} or it's configuration objects.
             *
             * @config {SchedulerPro.model.AssignmentModel[]}
             */
            assignmentsData : null,

            /**
             * The initial data, to fill the {@link #property-calendarManagerStore calendarManagerStore} with.
             * Should be an array of {@link SchedulerPro.model.ProCalendarModel CalendarModels} or it's configuration objects.
             *
             * @config {SchedulerPro.model.ProCalendarModel[]}
             */
            calendarsData : null,

            /**
             * Store that holds time ranges (using the {@link Scheduler.model.TimeSpan} model or subclass thereof) for {@link Scheduler.feature.TimeRanges} feature.
             * A store will be automatically created if none is specified.
             * @config {Object|Core.data.Store} timeRangeStore
             */
            timeRangeStore : null,

            convertEmptyParentToLeaf : false
        };
    }

    /**
     * Returns a calendar of the task. If task has never been assigned a calendar a project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {SchedulerPro.model.ProCalendarModel}
     */

    /**
     * Sets the calendar of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setCalendar
     * @param {SchedulerPro.model.ProCalendarModel} calendar The new calendar. Provide `null` to return back to the project calendar.
     * @returns {Promise}
     */

    /**
     * Causes the scheduling engine to re-evaluate the task data and all associated data and constraints
     * and apply necessary changes.
     * @returns {Promise}
     * @function propagate
     */

    /**
     * Suspend {@link #function-propagate propagation} processing. When propagation is suspended,
     * calls to {@link #function-propagate} do not proceed, instead a propagate call is deferred
     * until a matching {@link #function-resumePropagate} is called.
     * @function suspendPropagate
     */

    /**
     * Resume {@link #function-propagate propagation}. If propagation is resumed (calls may be nested
     * which increments a suspension counter), then if a call to propagate was made during suspension,
     * {@link #function-propagate} is executed.
     * @param {Boolean} [trigger] Pass `false` to inhibit automatic propagation if propagate was requested during suspension.
     * @returns {Promise}
     * @function resumePropagate
     */

    construct(...args) {

        //ObjectHelper.assign(this, this.constructor.getDefaultConfiguration());

        const config = args[0] || {};

        // put config to arguments (passed to the parent class "construct")
        args[0] = config;

        if ('tasksData' in config) {
            config.eventsData   = config.tasksData;
            delete config.tasksData;
        }

        if ('taskStore' in config) {
            config.eventStore = config.taskStore;
            delete config.taskStore;
        }

        // Maintain backwards compatibility
        // TODO remove for 3.0
        config.eventModelClass = config.taskModelClass || config.eventModelClass || this.defaultEventModelClass;
        config.eventStoreClass = config.taskStoreClass || config.eventStoreClass || this.defaultEventStoreClass;

        if (!config.timeRangeStore) {
            config.timeRangeStore = {
                modelClass : TimeSpan,
                storeId    : 'timeRanges'
            };
        }

        super.construct(...args);
    }

    get defaultEventModelClass() {
        return ProTaskModel;
    }

    get defaultEventStoreClass() {
        return TaskStore;
    }

    get taskStore() {
        return this.getEventStore();
    }

    get timeRangeStore() {
        return this._timeRangeStore;
    }

    set timeRangeStore(store) {
        const me = this;

        me._timeRangeStore = store && Store.getStore(store, Store);

        if (store && !me._timeRangeStore.storeId) {
            me._timeRangeStore.storeId = 'timeRanges';
        }
    }

    //endregion
}

ProProjectModel.applyConfigs = true;

/**
 * @typedef EffectResolutionResult
 * @property {Number} Cancel    Stop propagation
 * @property {Number} Restart   Restart propagation
 * @property {Number} Resume    Resume propagation from current state
 */
