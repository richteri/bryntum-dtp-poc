import SchedulerResourceModel from '../../Scheduler/model/ResourceModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { BuildMinimalResource } from '../../Engine/data/model/ResourceMixin.js';

/**
 * @module SchedulerPro/model/ResourceModel
 */

/**
 * This class represents a single resource in your Scheduler Pro project.
 *
 * If you want to add or change some fields, describing resources - subclass this class:
 *
 * ```javascript
 * class MyResourceModel extends ResourceModel {
 *
 *   static get fields() {
 *     return [
 *       { name: 'company', type: 'string' }
 *     ]
 *   }
 * }
 * ```
 *
 * See also: {@link SchedulerPro/model/AssignmentModel}
 * @extends Scheduler/model/ResourceModel
 * @mixes SchedulerPro/data/mixin/PartOfProject
 * @typings Scheduler/model/ResourceModel -> Scheduler/model/SchedulerResourceModel
 */
export default class ResourceModel extends PartOfProject(BuildMinimalResource(SchedulerResourceModel)) {
    //region Config

    static get fields() {
        return [
            /**
             * The calendar, assigned to the entity. Allows you to set the time when entity can perform the work.
             *
             * All entities are by default assigned to the project calendar, provided as the {@link SchedulerPro.model.ProProjectModel#field-calendar} option.
             *
             * @field {SchedulerPro.model.ProCalendarModel} calendar
             */

            // /**
            //  * The resource rate
            //  * @field {Number} rate
            //  */
            // { name : 'rate', type : 'number', defaultValue : 0 },
            //
            // /**
            //  * The resource rate unit (corresponds to units defined in {@link Core/helper/DateHelper}). Valid values are:
            //  * - "mi" (minutes)
            //  * - "h" (hours)
            //  * - "d" (days)
            //  * - "w" (weeks)
            //  * - "mo" (months)
            //  * - "q" (quarters)
            //  * - "y" (years)
            //  * @field {String} rateUnit
            //  */
            // { name : 'rateUnit', type : 'string', defaultValue : 'h' },
            //
            // /**
            //  * The value of per-use-cost when this resource is assigned
            //  * @field {Number} perUseCost
            //  */
            // { name : 'perUseCost', type : 'number', defaultValue : 0 }

        ];
    }

    //endregion

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
     * Returns a calendar of the task. If task has never been assigned a calendar a project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {SchedulerPro.model.ProCalendarModel}
     */

    /**
     * Returns an array of assignments, associated with this resource
     * @property {SchedulerPro.model.AssignmentModel[]}
     * @name assignments
     * @instance
     * @readonly
     * @ts-ignore
     */

    /**
     * Returns an array of tasks, associated with this resource
     * @property {SchedulerPro.model.ProTaskModel[]}
     * @readonly
     */
    get tasks() {
        return this.events;
    }

    //endregion
}
