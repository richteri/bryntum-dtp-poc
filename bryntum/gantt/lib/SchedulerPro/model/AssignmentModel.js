import SchedulerAssignmentModel from '../../Scheduler/model/AssignmentModel.js';
import { BuildMinimalAssignment } from '../../Engine/data/model/AssignmentMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

/**
 * @module SchedulerPro/model/AssignmentModel
 */

/**
 * This class represent a single assignment of a {@link SchedulerPro.model.ResourceModel resource} to a {@link SchedulerPro.model.ProTaskModel task} in your gantt chart.
 *
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @extends Scheduler/model/AssignmentModel
 * @typings Scheduler/model/AssignmentModel -> Scheduler/model/SchedulerAssignmentModel
 */
export default class AssignmentModel extends PartOfProject(BuildMinimalAssignment(SchedulerAssignmentModel)) {
    //region Fields

    static get fields() {
        return [
            /**
             * The reference to the task, this assignment belongs to.
             *
             * @ts-ignore
             * @property {SchedulerPro.model.ProTaskModel}
             * @name event
             */

            /**
             * The reference to the task, this assignment belongs to.
             *
             * @ts-ignore
             * @field {SchedulerPro.model.ProTaskModel} event
             */

            /**
             * This field is not used, please ignore it.
             *
             * @field {String|Number} eventId
             * @ignore
             */
            { name : 'eventId', persist : false },

            /**
             * The reference to the resource, this assignment belongs to.
             *
             * @field {SchedulerPro.model.ResourceModel} resource
             * @ts-ignore
             */

            /**
             * This field is not used, please ignore it.
             *
             * @field {String|Number} resourceId
             * @ignore
             */
            { name : 'resourceId', persist : false }

            /**
             * The numeric, percent-like value in the [ 0, 100 ] range, indicating what is the "contribution level"
             * of the resource to the task. Number 100, for example, means that for 8h event,
             * resource contributes 8h of working time. Number 50 means, for the same task, resource contributes
             * only 4h, etc.
             *
             * @field {Number} units
             * @default 100
             */
        ];
    }

    //endregion

    //region Field getters/setters

    /**
     * Sets the {@link #property-units} field. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method setUnits
     * @param {Number} units
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the {@link #field-event} field. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method setEvent
     * @param {SchedulerPro.model.ProTaskModel} event
     * @returns {Promise}
     * @propagating
     */

    /**
     * Sets the {@link #field-resource} field. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method setResource
     * @param {SchedulerPro.model.ResourceModel} event
     * @returns {Promise}
     * @propagating
     */

    /**
     * Get/set the units of this assignment
     *
     * @property {Number}
     */
    get units() {
        const me = this;

        return Math.max(0, me.get('units'));
    }

    set units(value) {
        if (value < 0) {
            throw new Error("`Units` value for an assignment can't be less than 0");
        }

        this.set('units', value);
    }

    /**
     * Task assigned
     * @property {SchedulerPro.model.ProTaskModel} task
     */

    get task() {
        return this.event;
    }

    set task(task) {
        this.event = task;
    }

    /**
     * Associated tasks name
     * @property {String}
     * @readonly
     */
    get taskName() {
        return this.task && this.task.name || '';
    }

    //region Foreign id accessors

    // Added for scheduler compatibility, engine does not use foreign ids but Scheduler stores sometimes expect them

    get eventId() {
        return this.event.id;
    }

    get resourceId() {
        return this.resource.id;
    }

    //endregion

    toString() {
        return this.resource.name + ' ' + this.units + '%';
    }
}
