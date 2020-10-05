import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { BuildSchedulerEvent } from '../../Engine/data/model/event/SchedulerEvent.js';

/**
 * @module SchedulerPro/model/ProTaskModel
 */

/**
 * This class represents a task in your Scheduler Pro project. Extend it to add your own custom task fields and methods.
 *
 * ## Subclassing the TaskModel class
 * To subclass the TaskModel, please see the snippet below.
 *
 * ```javascript
 * class MyTaskModel extends ProTaskModel {
 *    static get fields() {
 *        return [
 *            { name: 'deadlineDate', type: 'date' }
 *        ]
 *    }
 *
 *    get calculateDeadline() {
 *        // TODO implement
 *    }
 * ```
 *
 * ## Creating a new Task programmatically
 *
 * To create a new task programmatically, simply call the TaskModel constructor and pass in any field values.
 *
 * ```javascript
 * const newTask = new ProTaskModel({
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
 * @mixes SchedulerPro/data/mixin/PartOfProject
 *
 * @extends Scheduler/model/TimeSpan
 */
export default class ProTaskModel extends PartOfProject(BuildSchedulerEvent(TimeSpan)) {
    //region Fields
    /**
     * This static configuration option allows you to control whether an empty parent task should be converted into a
     * leaf. Enable/disable it for a whole class:
     *
     * ```javascript
     * ProTaskModel.convertEmptyParentToLeaf = false;
     * ```
     *
     * By specifying `true`, all empty parents will be considered leafs. Can also be assigned a configuration object
     * with with the following Boolean properties to customize the behaviour:
     *
     * * `onLoad` - Apply the transformation on load to any parents without children (`children : []`)
     * * `onRemove` - Apply the transformation when all children have been removed from a parent
     *
     * ```javascript
     * ProTaskModel.convertEmptyParentToLeaf = {
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
             * The calendar, assigned to the task. Allows you to set the time when task can be performed.
             *
             * All tasks by default are assigned to the project calendar, provided as the {@link SchedulerPro.model.ProProjectModel#field-calendar} option.
             *
             * @field {SchedulerPro.model.ProCalendarModel} calendar
             */

            /**
             * A freetext note about the task.
             * @field {string} note
             */
            { name : 'note', type : 'string' },

            /**
             * The current status of a task, expressed as the percentage completed (integer from 0 to 100)
             * @field {number} percentDone
             */
            { name : 'percentDone', type : 'number', defaultValue : 0 },

            {
                name : 'parentId',
                serialize(value, record) {
                    const
                        eventStore = record.getEventStore(),
                        project    = record.getProject();

                    // By default we send root level tasks "parentId" as NULL
                    if (eventStore && eventStore.getById(value) === project) {
                        value = null;
                    }

                    return value;
                }
            },

            /**
             * When set to `true`, the `startDate` of the task will not be changed by any of its incoming dependencies
             * or constraints.
             *
             * @field {boolean} manuallyScheduled
             */

            // Two fields which specify the relations between "phantom" tasks when they are
            // being sent to the server to be created (e.g. when you create a new task containing a new child task).
            { name : 'phantomId', type : 'string' },
            { name : 'phantomParentId', type : 'string' },

            /**
             * Set this to true if this task should be shown in the Timeline widget
             * @field {boolean} showInTimeline
             */
            { name : 'showInTimeline', type : 'boolean' },

            // /**
            //  * A deadline date for this task
            //  * @field {date} deadlineDate
            //  */
            // { name : 'deadlineDate', type : 'date', format : 'c' },

            // Override NodeInterface defaults
            { name : 'index', type : 'int', persist : true },

            /**
             * CSS class specifying an icon to apply to the event
             * @field {string} iconCls
             */
            { name : 'iconCls' },

            /**
             * Specify false to prevent the event from being dragged (if {@link Scheduler/feature/EventDrag} feature is used)
             * @field {boolean} draggable
             * @default true
             */
            { name : 'draggable', type : 'boolean', persist : false, defaultValue : true },   // true or false

            /**
             * Specify false to prevent the task from being resized (if {@link Scheduler/feature/EventResize} feature is used). You can also
             * specify 'start' or 'end' to only allow resizing in one direction
             * @field {boolean|string} resizable
             * @default true
             */
            { name : 'resizable', persist : false, defaultValue : true }                      // true, false, 'start' or 'end'
        ];
    }

    //endregion

    //region Init

    //endregion

    get isTask() {
        return true;
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
        if (this.percentDone <= 99) {
            return Math.round(this.percentDone);
        }
        else {
            return Math.floor(this.percentDone);
        }
    }

    //region Is

    get isDraggable() {
        return this.draggable;
    }

    get isResizable() {
        return this.resizable && !this.milestone && !this.isParent;
    }

    get isStarted() {
        return this.percentDone > 0;
    }

    get isCompleted() {
        return this.percentDone >= 100;
    }

    //endregion

    //region Milestone

    get milestone() {
        //if (isBaseline) return this.isBaselineMilestone();

        // a summary task may have zero duration when "recalculateParents" is on
        // and a child task has working time on the summary task non-working time
        // so we operate start and end date pair here
        if (!this.isLeaf) {
            const { startDate, endDate } = this;

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
        const me      = this;

        if (me.milestone) {
            return me.setDuration(1, me.durationUnit, false);
        }
    }

    //endregion

    //region Dependencies

    /**
     * Returns all dependencies of this task (both incoming and outgoing)
     *
     * @return {SchedulerPro.model.ProDependencyModel[]}
     */
    get allDependencies() {
        return [...this.predecessors || [], ...this.successors || []];
    }

    /**
     * Returns all predecessor tasks of a task
     *
     * @return {SchedulerPro.model.ProTaskModel[]}
     */
    get predecessorTasks() {
        return this.predecessors.map(dependency => dependency.fromEvent);
    }

    /**
     * Returns all successor tasks of a task
     *
     * @return {SchedulerPro.model.ProTaskModel[]}
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
     * Returns the {@link SchedulerPro.model.ProSubProjectModel} instance, associated with this task if this task belongs to a project
     * @return {SchedulerPro.model.ProSubProjectModel|Null} project
     * @private
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
     * @property {Object} fullEffort Object with two fields: `unit` and `magnitude`
     */
    get fullEffort() {
        return {
            unit      : this.effortUnit,
            magnitude : this.effort
        };
    }

    set fullEffort(effort) {
        this.setEffort(effort.magnitude, effort.unit);
    }

    get fullDuration() {
        return {
            unit      : this.durationUnit,
            magnitude : this.duration
        };
    }

    set fullDuration(value) {
        this.setDuration(value.magnitude, value.unit);
    }

    //endregion

    /**
     * A `Set<SchedulerPro.model.ProDependencyModel>` of the outgoing dependencies for this task
     * @property {Set}
     * @name outgoingDeps
     * @readonly
     */

    /**
     * A `Set<SchedulerPro.model.ProDependencyModel>` of the incoming dependencies for this task
     * @property {Set}
     * @name incomingDeps
     * @readonly
     */

    /**
     * An array of the assignments, related to this task
     * @property {SchedulerPro.model.AssignmentModel[]}
     * @name assignments
     * @readonly
     */

    /**
     * If given resource is assigned to this task, returns a {@link SchedulerPro.model.AssignmentModel} record.
     * Otherwise returns `null`
     *
     * @method
     * @name getAssignmentFor
     * @param {SchedulerPro.model.ResourceModel} resource The instance of {@link SchedulerPro.model.ResourceModel}
     *
     * @return {SchedulerPro.model.AssignmentModel|null}
     */

    /**
     * This method assigns a resource to this task.
     *
     * Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name assign
     * @param {SchedulerPro.model.ResourceModel} resource The instance of {@link SchedulerPro.model.ResourceModel}
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
     * @param {SchedulerPro.model.ResourceModel} resource The instance of {@link SchedulerPro.model.ResourceModel}
     *
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the calendar of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setCalendar
     * @param {SchedulerPro.model.ProCalendarModel} calendar The new calendar. Provide `null` to return back to the project calendar.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Returns a calendar of the task. If task has never been assigned a calendar the project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {SchedulerPro.model.ProCalendarModel}
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

    //region Normalization

    normalize() {
        // Do nothing, normalization now happens as part of initial propagate and should use calendar anyway
    }

    inSetNormalize(field) {
        // Do nothing, normalization now happens as part of initial propagate and should use calendar anyway
    }

    //endregion
}

ProTaskModel.convertEmptyParentToLeaf = true;
