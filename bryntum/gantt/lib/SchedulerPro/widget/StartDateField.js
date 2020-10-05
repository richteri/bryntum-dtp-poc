import DateField from '../../Core/widget/DateField.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module SchedulerPro/widget/StartDateField
 */

/**
 * Date field widget (text field + date picker) to be used together with Scheduling Engine.
 * This field adjusts time to the earliest possible time of the day based on active {@link SchedulerPro.model.ProProjectModel#field-calendar calendar}.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `StartDateColumn`.
 *
 * @extends Core/widget/DateField
 * @classType startdatefield
 */
export default class StartDateField extends DateField {

    static get $name() {
        return 'StartDateField';
    }

    static get defaultConfig() {
        return {
            /**
             * Project model which is a central place for all data to schedule including
             * {@link SchedulerPro.model.ProProjectModel#property-calendarManagerStore calendars}
             * which have info about working/non-working time.
             * @config {SchedulerPro.model.ProProjectModel}
             * @default
             */
            project : null
        };
    }

    transformTimeValue(value) {
        const calendar = this.project && this.project.calendar;

        if (calendar) {
            const
                startOfTheDay = DateHelper.clearTime(value),
                // search for the earliest available time for this day
                earliestTime = calendar.skipNonWorkingTime(startOfTheDay);

            // if it's the same day, the earliest time is found, use it
            if (DateHelper.isValidDate(earliestTime) && DateHelper.isEqual(earliestTime, startOfTheDay, 'day')) {
                return DateHelper.copyTimeValues(startOfTheDay, earliestTime);
            }
        }

        return super.transformTimeValue(value);
    }
}

BryntumWidgetAdapterRegister.register('startdatefield', StartDateField);
BryntumWidgetAdapterRegister.register('startdate', StartDateField);
