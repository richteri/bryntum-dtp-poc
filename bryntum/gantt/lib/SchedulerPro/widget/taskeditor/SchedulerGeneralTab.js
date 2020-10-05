import GeneralTab from './GeneralTab.js';
import BryntumWidgetAdapterRegister from '../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import '../CalendarField.js';
import '../../../Core/widget/Checkbox.js';

/**
 * @module SchedulerPro/widget/taskeditor/SchedulerGeneralTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the general information for a task
 * from a simplified scheduler project.
 *
 * @internal
 */
export default class SchedulerGeneralTab extends GeneralTab {
    static get $name() {
        return 'SchedulerGeneralTab';
    }

    static get type() {
        return 'schedulergeneraltab';
    }

    static get defaultConfig() {
        return {
            localeClass : this,
            title       : 'L{General}',
            ref         : 'generaltab',

            defaults : {
                localeClass : this,
                labelWidth  : this.L('labelWidth')
            },

            items : [
                {
                    type      : 'text',
                    required  : true,
                    label     : 'L{Name}',
                    clearable : true,
                    name      : 'name',
                    ref       : 'nameField',
                    cls       : 'b-name'
                },
                {
                    type  : 'number',
                    label : 'L{% complete}',
                    name  : 'renderedPercentDone',
                    ref   : 'percentDoneField',
                    cls   : 'b-percent-done b-inline',
                    flex  : '1 0 50%',
                    min   : 0,
                    max   : 100
                },
                {
                    type  : 'calendarfield',
                    ref   : 'calendarField',
                    name  : 'calendar',
                    label : 'L{Calendar}',
                    flex  : '1 0 50%'
                },
                {
                    html    : '',
                    dataset : {
                        text : this.L('L{Dates}')
                    },
                    cls  : 'b-divider',
                    flex : '1 0 100%'
                },
                {
                    type  : 'date',
                    label : 'L{Start}',
                    name  : 'startDate',
                    ref   : 'startDateField',
                    cls   : 'b-start-date b-inline',
                    flex  : '1 0 50%'
                },
                {
                    type  : 'date',
                    label : 'L{Finish}',
                    name  : 'endDate',
                    ref   : 'endDateField',
                    cls   : 'b-end-date',
                    flex  : '1 0 50%'
                },
                {
                    type  : 'durationfield',
                    label : 'L{Duration}',
                    name  : 'fullDuration',
                    ref   : 'fullDurationField',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                {
                    type  : 'checkbox',
                    ref   : 'manuallyScheduledField',
                    name  : 'manuallyScheduled',
                    label : 'L{Manually scheduled}',
                    flex  : '1 0 50%'
                }
            ]
        };
    }

    loadEvent(record) {
        const
            me = this,
            step = {
                unit      : record.durationUnit,
                magnitude : 1
            },
            { isParent } = record,
            {
                fullDurationField,
                percentDoneField,
                startDateField,
                endDateField,
                calendarField
            } = this.widgetMap,
            firstLoad = !this.record;

        //<debug>
        console.assert(
            firstLoad || me.getProject() === record.getProject(),
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        // Editing duration, percentDone & endDate disallowed for parent tasks
        if (fullDurationField) {
            fullDurationField.disabled = isParent;
        }

        if (percentDoneField) {
            percentDoneField.disabled = isParent;
        }

        if (startDateField) {
            startDateField.step = step;
        }

        if (endDateField) {
            endDateField.step = step;
            endDateField.disabled = isParent;
        }

        if (calendarField && firstLoad) {
            calendarField.store = record.getProject().getCalendarManagerStore();
        }

        super.loadEvent(record);
    }
}

BryntumWidgetAdapterRegister.register(SchedulerGeneralTab.type, SchedulerGeneralTab);
