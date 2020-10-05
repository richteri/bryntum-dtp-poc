import TimeSpan from '../../Scheduler/model/TimeSpan.js';

/**
 * @module Gantt/model/Baseline
 */

/**
 * This class represents a baseline of a Task.
 *
 * @extends Scheduler/model/TimeSpan
 */
export default class Baseline extends TimeSpan {
    //region Fields

    // TODO: handle persist? defaultValue?
    static get fields() {
        return [
            /**
             * The owning Task of the Baseline
             * @field {Gantt.model.TaskModel} task
             */
            {
                name    : 'task',
                persist : false
            }

            /**
             * Start date of the baseline in ISO 8601 format
             * @field {string|Date} startDate
             */

            /**
             * End date of the baseline in ISO 8601 format
             * @field {string|Date} endDate
             */

            /**
             * An encapsulation of the CSS classes to be added to the rendered baseline element.
             * @field {Core.helper.util.DomClassList|String} cls
             *
             * This may be accessed as a string, but for granular control of adding and
             * removing individual classes, it is recommended to use the
             * {@link Core.helper.util.DomClassList DomClassList} API.
             */

        ];
    }

    //endregion

    //region Init

    //endregion

    get isBaseline() {
        return true;
    }

    //region Milestone

    get milestone() {
        // a summary baseline may have zero duration when "recalculateParents" is on
        // and a child baseline has working time on the summary baseline non-working time
        // so we operate start and end date pair here
        if (!this.isLeaf) {
            const { startDate, endDate } = this;

            if (startDate && endDate) {
                return endDate.getTime() === startDate.getTime();
            }
        }

        return this.duration === 0;
    }

    set milestone(value) {
        value ? this.convertToMilestone() : this.convertToRegular();
    }

    async setMilestone(value) {
        return value ? this.convertToMilestone() : this.convertToRegular();
    }

    /**
     * Converts this baseline to a milestone (start date will match the end date).
     *
     * @propagating
     */
    async convertToMilestone() {
        return this.setDuration(0, this.durationUnit, false);
    }

    /**
     * Converts a milestone baseline to a regular baseline with a duration of 1 (keeping current `durationUnit`).
     *
     * @propagating
     */
    async convertToRegular() {
        if (this.milestone) {
            return this.setDuration(1, this.durationUnit, false);
        }
    }

    //endregion
}
