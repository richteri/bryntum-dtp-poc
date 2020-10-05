import Duration from '../../Core/data/Duration.js';
import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { BuildGanttEvent } from '../../Engine/data/model/event/GanttEvent.js';
import Baseline from './Baseline.js';
import Store from '../../Core/data/Store.js';
import { PropagationResult } from '../../ChronoGraph/chrono/Graph.js';

/**
 * @module Gantt/model/TaskModel
 */

// A utility function to populate a Task's baseline with the Task's default values
const applyBaselineDefaults = (task, baselines) => {
    const {
        startDate, durationUnit, endDate
    } = task;

    return baselines ? baselines.map(baseline => Object.assign({
        task, startDate, durationUnit, endDate
    }, baseline)) : [];
};

/**
 * This class represents a task in your Gantt project. Extend it to add your own custom task fields and methods.
 *
 * ## Subclassing the TaskModel class
 * To subclass the TaskModel, please see the snippet below.
 *
 * ```javascript
 class MyTaskModel extends TaskModel {
    static get fields() {
        return [
            { name: 'deadlineDate', type: 'date' }
        ]
    }

    get calculateDeadline() {
        // TODO implement
    }
 ```

 * ## Creating a new Task programmatically
 *
 * To create a new task programmatically, simply call the TaskModel constructor and pass in any field values.
 *
 * ```javascript
 * var newTask = new TaskModel({
 *     name        : 'My awesome task',
 *     percentDone : 80, // So awesome it's almost done
 *     ...
 * });
 * ```
 *
 * ## Start and end dates
 *
 * For all tasks, the end date is non-inclusive: {@link #field-startDate} <= date < {@link #field-endDate}.
 * Example: a task which starts at 2020/07/18 and has 2 days duration, should have the end date: 2020/07/20, **not** 2018/07/19 23:59:59.
 * The start and end dates of tasks in are *points* on the time axis and if you specify that a task starts
 * 01/01/2020 and has 1 day duration, that means the start point is 01/01/2020 00:00 and end point is 02/01/2020 00:00.
 *
 * @mixes Core/mixin/Events
 * @mixes SchedulerPro/data/mixin/PartOfProject
 *
 * @extends Scheduler/model/TimeSpan
 */
export default class TaskModel extends PartOfProject(BuildGanttEvent(TimeSpan)) {
    //region Fields

    /**
     * This static configuration option allows you to control whether an empty parent task should be converted into a
     * leaf. Enable/disable it for a whole class:
     *
     * ```javascript
     * TaskModel.convertEmptyParentToLeaf = false;
     * ```
     *
     * By specifying `true`, all empty parents will be considered leafs. Can also be assigned a configuration object
     * with with the following Boolean properties to customize the behaviour:
     *
     * * `onLoad` - Apply the transformation on load to any parents without children (`children : []`)
     * * `onRemove` - Apply the transformation when all children have been removed from a parent
     *
     * ```javascript
     * TaskModel.convertEmptyParentToLeaf = {
     *     onLoad   : false,
     *     onRemove : true
     * }
     * ```
     *
     * @member {Boolean|Object} convertEmptyParentToLeaf
     * @default true
     * @static
     * @category Parent & children
     */

    // TODO: handle persist? defaultValue?
    static get fields() {
        return [

            /**
             * Unique identifier of task (mandatory)
             * @field {string|number} id
             */

            /**
             * Name of the task
             * @field {string} name
             */

            /**
             * Start date of the task in ISO 8601 format
             * @field {string|Date} startDate
             */

            /**
             * End date of the task in ISO 8601 format
             * @field {string|Date} endDate
             */

            /**
             * An encapsulation of the CSS classes to be added to the rendered event element.
             * @field {Core.helper.util.DomClassList|String} cls
             *
             * This may be accessed as a string, but for granular control of adding and
             * removing individual classes, it is recommended to use the
             * {@link Core.helper.util.DomClassList DomClassList} API.
             */

            {
                name      : 'cls',
                serialize : (value) => {
                    return value.isDomClassList ? value.toString() : value;
                },
                persist : true
            },

            /**
             * The numeric part of the task effort (the number of units). The effort of the "parent" tasks will be automatically set to the sum
             * of efforts of their "child" tasks
             * @field {number} effort
             */

            /**
             * The unit part of the task duration, defaults to "day" (days). Valid values are:
             *
             * - "millisecond" - Milliseconds
             * - "second" - Seconds
             * - "minute" - Minutes
             * - "hour" - Hours
             * - "day" - Days
             * - "week" - Weeks
             * - "month" - Months
             * - "quarter" - Quarters
             * - "year"- Years
             *
             * This field is readonly after creation, to change it use the {@link #function-setDuration} call.
             * @field {String} durationUnit
             * @default "day"
             */

            /**
             * The unit part of the task's effort, defaults to "h" (hours). Valid values are:
             *
             * - "millisecond" - Milliseconds
             * - "second" - Seconds
             * - "minute" - Minutes
             * - "hour" - Hours
             * - "day" - Days
             * - "week" - Weeks
             * - "month" - Months
             * - "quarter" - Quarters
             * - "year"- Years
             *
             * This field is readonly after creation, to change it use the {@link #function-setEffort} call.
             * @field {String} effortUnit
             * @default "hour"
             */

            { name : 'fullEffort', persist : false },

            /**
             * The calendar, assigned to the task. Allows you to set the time when task can be performed.
             *
             * All tasks by default are assigned to the project calendar, provided as the {@link Gantt.model.ProjectModel#field-calendar} option.
             *
             * @field {Gantt.model.CalendarModel} calendar
             */

            /**
             * The getter will yield a {@link Core.data.Store Store} of {@link Gantt.model.Baseline}s.
             *
             * When constructing a task the baselines will be constructed from an array of
             * {@link Gantt.model.Baseline Baseline} data objects.
             * @field {Object[]} baselines
             */
            { name : 'baselines' },

            /**
             * A freetext note about the task.
             * @field {String} note
             */
            { name : 'note', type : 'string' },

            /**
             * The current status of a task, expressed as the percentage completed (integer from 0 to 100)
             * @field {number} percentDone
             */
            { name : 'percentDone', type : 'number', defaultValue : 0 },

            {
                name      : 'parentId',
                serialize : (value, record) => {
                    const eventStore = record.getEventStore(),
                        project    = record.getProject();

                    // By default we send root level tasks "parentId" as NULL
                    if (eventStore && eventStore.getById(value) === project) {
                        value = null;
                    }

                    return value;
                }
            },

            /**
             * Field storing the task constraint alias or NULL if not constraint set.
             * Valid values are:
             * - "finishnoearlierthan"
             * - "finishnolaterthan"
             * - "mustfinishon"
             * - "muststarton"
             * - "startnoearlierthan"
             * - "startnolaterthan"
             *
             * @field {String} constraintType
             */

            /**
             * Field defining the constraint boundary date, if applicable.
             * @field {Date} constraintDate
             */

            /**
             * When set to `true`, the `startDate` of the task will not be changed by any of its incoming dependencies
             * or constraints.
             *
             * @field {boolean} manuallyScheduled
             */

            /**
             * This field defines the scheduling mode for the task. Based on this field some fields of the task
             * will be "fixed" (should be provided by the user) and some - computed.
             *
             * Possible values are:
             *
             * - `Normal` is the default (and backward compatible) mode. It means the task will be scheduled based on information
             * about its start/end dates, task own calendar (project calendar if there's no one) and calendars of the assigned resources.
             *
             * - `FixedDuration` mode means, that task has fixed start and end dates, but its effort will be computed dynamically,
             * based on the assigned resources information. Typical example of such task is - meeting. Meetings typically have
             * pre-defined start and end dates and the more people are participating in the meeting, the more effort is spent on the task.
             * When duration of such task increases, its effort is increased too (and vice-versa). Note: fixed start and end dates
             * here doesn't mean that a user can't update them via GUI, the only field which won't be editable in GUI is the {@link #field-effort effort field},
             * it will be calculated according to duration and resources assigned to the task.
             *
             * - `FixedEffort` mode means, that task has fixed effort and computed duration. The more resources will be assigned
             * to this task, the less the duration will be. The typical example will be a "paint the walls" task -
             * several painters will complete it faster.
             *
             * - `FixedUnits` mode means, that the assignment level of all assigned resources
             * will be kept as provided by the user, and either {@link #field-effort} or duration of the task is recalculated,
             * based on the {@link #field-effortDriven} flag.
             *
             * @field {string} schedulingMode
             */

            /**
             * This boolean flag defines what part of task data should be updated in the `FixedUnits` scheduling mode.
             * If it is `true`, then {@link #field-effort} is kept intact, and duration is updated. If it is `false` - vice-versa.
             *
             * @field {Boolean} effortDriven
             * @default false
             */

            /**
             * A calculated field storing the _early start date_ of the task.
             * The _early start date_ is the earliest possible date the task can start.
             * This value is calculated based on the earliest dates of the task predecessors and the task own constraints.
             * If the task has no predecessors nor other constraints, its early start date matches the project start date.
             * @field {Date} earlyStartDate
             * @calculated
             */

            /**
             * A calculated field storing the _early end date_ of the task.
             * The _early end date_ is the earliest possible date the task can finish.
             * This value is calculated based on the earliest dates of the task predecessors and the task own constraints.
             * If the task has no predecessors nor other constraints, its early end date matches the project start date plus the task duration.
             * @field {Date} earlyEndDate
             * @calculated
             */

            /**
             * A calculated field storing the _late start date_ of the task.
             * The _late start date_ is the latest possible date the task can start.
             * This value is calculated based on the latest dates of the task successors and the task own constraints.
             * If the task has no successors nor other constraints, its late start date matches the project end date minus the task duration.
             * @field {Date} lateStartDate
             * @calculated
             */

            /**
             * A calculated field storing the _late end date_ of the task.
             * The _late end date_ is the latest possible date the task can finish.
             * This value is calculated based on the latest dates of the task successors and the task own constraints.
             * If the task has no successors nor other constraints, its late end date matches the project end date.
             * @field {Date} lateEndDate
             * @calculated
             */

            /**
             * A calculated field storing the _total slack_ (or _total float_) of the task.
             * The _total slack_ is the amount of working time the task can be delayed without causing a delay
             * to the project end.
             * The value is expressed in {@link #field-slackUnit} units.
             *
             * ```javascript
             * // let output slack info to the console
             * console.log(`The ${task.name} task can be delayed for ${task.totalSlack} ${slackUnit}s`)
             * ```
             *
             * @field {Number} totalSlack
             * @calculated
             */

            /**
             * A calculated field storing unit for the {@link #field-totalSlack} value.
             * @field {String} slackUnit
             * @default "day"
             */

            /**
             * A calculated field indicating if the task is _critical_.
             * A task considered _critical_ if its delaying causes the project delay.
             * The field value is calculated based on {@link #field-totalSlack} field value.
             *
             * ```javascript
             * if (task.critical) {
             *     Toast.show(`The ${task.name} is critical!`);
             * }
             * ```
             *
             * @field {Boolean} critical
             * @calculated
             */

            // NOTE: These are not actually fields, they are never set during task lifespan and only used by crud manager
            // to send changes to the backend
            // Two fields which specify the relations between "phantom" tasks when they are
            // being sent to the server to be created (e.g. when you create a new task containing a new child task).
            // { name : 'phantomId', type : 'string' },
            // { name : 'phantomParentId', type : 'string' },

            // Children field is not supposed to be persistable
            { name : 'children', persist : false },

            /**
             * Set this to true if this task should be shown in the Timeline widget
             * @field {Boolean} showInTimeline
             */
            { name : 'showInTimeline', type : 'boolean' },

            /**
             * Set this to true to roll up a task to its closest parent
             * @field {Boolean} rollup
             */
            { name : 'rollup', type : 'boolean' },

            /**
             * A deadline date for this task. Does not affect scheduling logic.
             * @field {Date} deadlineDate
             */
            { name : 'deadlineDate', type : 'date' },

            // Override TreeNode parentIndex to make it persistable
            { name : 'parentIndex', type : 'int', persist : true },

            /**
             * CSS class specifying an icon to apply to the task row
             * @field {string} iconCls
             */
            'iconCls',

            /**
             * CSS class specifying an icon to apply to the task ba
             * @field {string} taskIconCls
             */
            'taskIconCls',

            /**
             * Specify false to prevent the event from being dragged (if {@link Gantt/feature/TaskDrag} feature is used)
             * @field {boolean} draggable
             * @default true
             */
            { name : 'draggable', type : 'boolean', persist : false, defaultValue : true },   // true or false

            /**
             * Specify false to prevent the task from being resized (if {@link Gantt/feature/TaskResize} feature is used). You can also
             * specify 'start' or 'end' to only allow resizing in one direction
             * @field {boolean|string} resizable
             * @default true
             */
            { name : 'resizable', persist : false, defaultValue : true }                  // true, false, 'start' or 'end'
        ];
    }

    //endregion

    //region Config

    static get defaultConfig() {
        return {
            baselineModelClass : Baseline
        };
    }

    //endregion

    //region Init

    //endregion

    get isTask() {
        return true;
    }

    /**
     * Propagates changes to the dependent tasks. For example:
     *
     * ```js
     * // double a task duration
     * task.duration *= 2;
     * // call propagate() to do further recalculations caused by the duration change
     * task.propagate().then(() => console.log('Schedule updated'));
     * ```
     *
     * @method
     * @name propagate
     * @param onEffect Function that should handle occurred propagation conflicts. For example:
     *
     * ```js
     * // trigger propagation and silently cancel changes in case of any conflict
     * project.propagate(() => EffectResolutionResult.Cancel);
     * ```
     * @returns {Promise}
     * @propagating
     */

    get hasBaselines() {
        return (this.baselinesStore && this.baselinesStore.count) || Boolean(this.originalData.baselines);
    }

    /**
     * Sets the data in the passed baseline index to the current state of this task.
     * @param {Number} index The index in the baselines list of the baseline to update.
     */
    setBaseline(index) {
        if (index > this.baselines.count + 1) {
            throw new Error(`Attempt to set baseline ${index} when there are only ${this.baselines.count} baselines`);
        }

        // Allow adding by setBaseline(1) when there are zero.
        if (index === this.baselines.count + 1) {
            return this.baselines.add(applyBaselineDefaults(this, [{}]));
        }
        this.baselines.getAt(index - 1).set(applyBaselineDefaults(this, [{}])[0]);
    }

    get baselines() {
        if (!this.baselinesStore) {
            this.baselinesStore = new Store({
                modelClass : this.constructor.getDefaultConfiguration().baselineModelClass,
                data       : applyBaselineDefaults(this, this.originalData.baselines)
            });
        }
        return this.baselinesStore;
    }

    // TODO: drop and move to the engine, use outgoingDeps everywhere
    get successors() {
        return Array.from(this.outgoingDeps);
    }

    set successors(successors) {
        this.setOutgoingDeps(successors);
    }

    // TODO: drop and move to the engine, use outgoingDeps everywhere
    get predecessors() {
        return Array.from(this.incomingDeps);
    }

    set predecessors(predecessors) {
        this.setIncomingDeps(predecessors);
    }

    get renderedPercentDone() {
        const value = typeof this.percentDone === 'number' && !isNaN(this.percentDone) ? this.percentDone : 0;

        if (value <= 99) {
            return Math.round(value);
        }

        return Math.floor(value);
    }

    set renderedPercentDone(value) {
        this.percentDone = value;
    }

    //region Is

    get isDraggable() {
        return this.draggable;
    }

    get isResizable() {
        return this.resizable && !this.milestone && !this.isParent;
    }

    /**
     * Indicates if the task is started (its {@link #field-percentDone percent completion} is greater than zero).
     * @return {Boolean} `true` if the task is started.
     */
    get isStarted() {
        return this.percentDone > 0;
    }

    /**
     * Indicates if the task is complete (its {@link #field-percentDone percent completion} is 100% (or greater)).
     * @return {Boolean} `true` if the task is completed.
     */
    get isCompleted() {
        return this.percentDone >= 100;
    }

    /**
     * Indicates if the task is in progress (its {@link #field-percentDone percent completion} is greater than zero and less than 100%).
     * @return {Boolean} `true` if the task is in progress.
     */
    get isInProgress() {
        return this.isStarted && !this.isCompleted;
    }

    //endregion

    //region Milestone

    get milestone() {
        //if (isBaseline) return this.isBaselineMilestone();

        // a summary task may have zero duration when "recalculateParents" is on
        // and a child task has working time on the summary task non-working time
        // so we operate start and end date pair here
        if (!this.isLeaf) {
            const startDate = this.startDate,
                endDate   = this.endDate;

            if (startDate && endDate) {
                return endDate.getTime() === startDate.getTime();
            }
        }

        return this.duration === 0;
    }

    // override `isMilestone` on TimeSpan model and make it to return the same value what `milestone` returns
    get isMilestone() {
        return this.milestone;
    }

    set milestone(value) {
        value ? this.convertToMilestone() : this.convertToRegular();
    }

    async setMilestone(value) {
        return value ? this.convertToMilestone() : this.convertToRegular();
    }

    /**
     * Converts this task to a milestone (start date will match the end date).
     * @propagating
     */
    async convertToMilestone() {
        return this.setDuration(0, this.durationUnit, false);
    }

    /**
     * Converts the milestone task to a regular task with a duration of 1 (keeping current {@link #field-durationUnit}).
     * @propagating
     */
    async convertToRegular() {
        const me = this;

        if (me.milestone) {
            return me.setDuration(1, me.durationUnit, false);
        }
    }

    //endregion

    //region Dependencies

    /**
     * Returns all dependencies of this task (both incoming and outgoing)
     *
     * @return {Gantt.model.DependencyModel[]}
     */
    get allDependencies() {
        return [...this.predecessors || [], ...this.successors || []];
    }

    /**
     * Returns all predecessor tasks of a task
     *
     * @return {Gantt.model.TaskModel[]}
     */
    get predecessorTasks() {
        return this.predecessors.map(dependency => dependency.fromEvent);
    }

    /**
     * Returns all successor tasks of a task
     *
     * @return {Gantt.model.TaskModel[]}
     */
    get successorTasks() {
        return this.successors.map(dependency => dependency.toEvent);
    }

    //endregion

    //region Calculated fields

    /**
     * Returns count of all sibling nodes (including their children).
     * @property {Number}
     */
    get previousSiblingsTotalCount() {
        let task  = this.previousSibling,
            count = this.parentIndex;

        while (task) {
            count += task.descendantCount;
            task = task.previousSibling;
        }

        return count;
    }

    /**
     * Returns the sequential number of the task. A sequential number means the ordinal position of the task in the total dataset, regardless
     * of its nesting level and collapse/expand state of any parent tasks. The root node has a sequential number equal to 0.
     *
     * For example, in the following tree data sample sequential numbers are specified in the comments:
     *
     *        root : {
     *            children : [
     *                {   // 1
     *                    leaf : true
     *                },
     *                {       // 2
     *                    children : [
     *                        {   // 3
     *                            children : [
     *                                {   // 4
     *                                    leaf : true
     *                                },
     *                                {   // 5
     *                                    leaf : true
     *                                }
     *                            ]
     *                        }]
     *                },
     *                {   // 6
     *                    leaf : true
     *                }
     *            ]
     *        }
     *
     * If we will collapse some of the parent tasks, sequential number of collapsed tasks won't change.
     *
     * @property {Number}
     */
    get sequenceNumber() {
        let code = 0,
            task = this;

        // TODO: store keeps allIndex, children are added before parents which makes order wrong. if that is changed
        // TODO: it can be used instead of calculating sequenceNumber

        while (task.parent) {
            code += task.previousSiblingsTotalCount + 1;
            task = task.parent;
        }

        return code;
    }

    //endregion

    //region Project related methods

    get isSubProject() {
        return false;
    }

    // TODO: cache project
    /**
     * Returns the {@link Gantt.model.SubProjectModel project} instance, associated with this task if this task belongs to a project
     *
     * @private
     * @internal
     * @return {Gantt.model.SubProjectModel} project
     */
    get subProject() {
        const me = this;

        let project = null;

        if (me.isProject) { // TODO: implement is project
            project = me;
        }
        else {
            me.bubbleWhile(t => {
                if (t.isProject) {
                    project = t;
                }

                return !project;
            });
        }

        return project;
    }

    //endregion

    /**
     * Property which encapsulates the effort's magnitude and units.
     *
     * @property {Core.data.Duration} fullEffort
     */
    get fullEffort() {
        return new Duration({
            unit      : this.effortUnit,
            magnitude : this.effort
        });
    }

    set fullEffort(effort) {
        this.setEffort(effort.magnitude, effort.unit);
    }

    //endregion

    /**
     * A `Set<Gantt.model.DependencyModel>` of the outgoing dependencies for this task
     * @property {Set}
     * @name outgoingDeps
     * @readonly
     */

    /**
     * A `Set<Gantt.model.DependencyModel>` of the incoming dependencies for this task
     * @property {Set}
     * @name incomingDeps
     * @readonly
     */

    /**
     * An array of the assignments, related to this task
     * @property {Gantt.model.AssignmentModel[]}
     * @name assignments
     * @readonly
     */

    /**
     * If given resource is assigned to this task, returns a {@link Gantt.model.AssignmentModel} record.
     * Otherwise returns `null`
     *
     * @method
     * @name getAssignmentFor
     * @param {Gantt.model.ResourceModel} resource The instance of {@link Gantt.model.ResourceModel}
     *
     * @return {Gantt.model.AssignmentModel|null}
     */

    /**
     * This method assigns a resource to this task.
     *
     * Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name assign
     * @param {Gantt.model.ResourceModel} resource The instance of {@link Gantt.model.ResourceModel}
     * @param {Number} [units=100] The `units` field of the new assignment
     *
     * @returns {Promise}
     * @propagating
     */

    /**
     * This method unassigns a resource from this task.
     *
     * Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name unassign
     * @param {Gantt.model.ResourceModel} resource The instance of {@link Gantt.model.ResourceModel}
     *
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the calendar of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setCalendar
     * @param {Gantt.model.CalendarModel} calendar The new calendar. Provide `null` to return back to the project calendar.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Returns a calendar of the task. If task has never been assigned a calendar the project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {Gantt.model.CalendarModel}
     */

    /**
     * Sets the start date of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * Note, that the actually set start date may be adjusted, according to the calendar, by skipping the non-working time forward.
     *
     * @method
     * @name setStartDate
     * @param {Date} date The new start date.
     * @param {Boolean} [keepDuration=true] Whether to keep the duration (and update the end date), while changing the start date, or vice-versa.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the end date of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * Note, that the actually set end date may be adjusted, according to the calendar, by skipping the non-working time backward.
     *
     * @method
     * @name setEndDate
     * @param {Date} date The new end date.
     * @param {Boolean} [keepDuration=false] Whether to keep the duration (and update the start date), while changing the end date, or vice-versa.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Updates the duration (and optionally unit) of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setDuration
     * @param {Number} duration New duration value
     * @param {String} [unit] New duration unit
     * @returns {Promise}
     * @propagating
     */

    /**
     * Updates the effort (and optionally unit) of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setEffort
     * @param {Number} effort New effort value
     * @param {String} [unit] New effort unit
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the constraint type and (optionally) constraining date to the task.
     *
     * @method
     * @name setConstraint
     * @param {String} constraintType Constraint type, please refer to the {@link Gantt.model.TaskModel#field-constraintType} for the valid values.
     * @param {Date}   [constraintDate] Constraint date.
     * @returns {Promise}
     * @propagating
     */

    //region Normalization

    normalize() {
        // Do nothing, normalization now happens as part of initial propagate and should use calendar anyway
    }

    inSetNormalize(field) {
        // Do nothing, normalization now happens as part of initial propagate and should use calendar anyway
    }

    /**
     * WARNING: Not (yet) supported by the underlying scheduling engine
     *
     * @param {Date} start The new start date
     * @param {Date} end The new end date
     */
    setStartEndDate() {
        throw new Error('Not supported');
    }

    //endregion

    async tryInsertChild() {
        const result = await this.getProject().tryPropagateWithChanges(() => {
            this.insertChild(...arguments);
        });

        return result !== PropagationResult.Canceled;
    }

    // Reset % done value when copying a task
    copy() {
        const copy = super.copy(...arguments);

        copy.percentDone = 0;

        return copy;
    }
}

TaskModel.convertEmptyParentToLeaf = true;
