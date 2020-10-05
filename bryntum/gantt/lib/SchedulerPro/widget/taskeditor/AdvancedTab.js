import FormTab from './FormTab.js';
import BryntumWidgetAdapterRegister from '../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import '../CalendarField.js';
import '../ConstraintTypePicker.js';
import '../../../Core/widget/DateField.js';
import '../../../Core/widget/Checkbox.js';
import '../SchedulingModePicker.js';

/**
 * @module SchedulerPro/widget/taskeditor/AdvancedTab
 */

/**
 * Advanced task options {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} tab.
 * @internal
 */
export default class AdvancedTab extends FormTab {

    static get $name() {
        return 'AdvancedTab';
    }

    static get type() {
        return 'advancedtab';
    }

    static get defaultConfig() {
        return {
            localeClass : this,
            title       : 'L{Advanced}',
            ref         : 'advancedtab',

            defaults : {
                localeClass : this,
                labelWidth  : this.L('labelWidth')
            },

            items : [
                {
                    type  : 'calendarfield',
                    ref   : 'calendarField',
                    name  : 'calendar',
                    label : 'L{Calendar}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                }, {
                    type  : 'checkbox',
                    ref   : 'manuallyScheduledField',
                    name  : 'manuallyScheduled',
                    label : 'L{Manually scheduled}',
                    flex  : '1 0 50%'
                },
                {
                    type  : 'schedulingmodecombo',
                    ref   : 'schedulingModeField',
                    name  : 'schedulingMode',
                    label : 'L{Scheduling mode}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                {
                    type  : 'checkbox',
                    ref   : 'effortDrivenField',
                    name  : 'effortDriven',
                    label : 'L{Effort driven}',
                    flex  : '1 0 50%'
                },
                {
                    html    : '',
                    dataset : {
                        text : this.L('L{Constraint}')
                    },
                    cls  : 'b-divider',
                    flex : '1 0 100%'
                },
                {
                    type      : 'constrainttypepicker',
                    ref       : 'constraintTypeField',
                    name      : 'constraintType',
                    label     : 'L{Constraint type}',
                    clearable : true,
                    flex      : '1 0 50%',
                    cls       : 'b-inline'
                },
                {
                    type  : 'date',
                    ref   : 'constraintDateField',
                    name  : 'constraintDate',
                    label : 'L{Constraint date}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                {
                    type  : 'checkbox',
                    ref   : 'rollupField',
                    name  : 'rollup',
                    label : 'L{Rollup}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                }
            ]
        };
    }

    get calendarField() {
        return this.widgetMap.calendarField;
    }

    get constraintTypeField() {
        return this.widgetMap.constraintTypeField;
    }

    get constraintDateField() {
        return this.widgetMap.constraintDateField;
    }

    loadEvent(eventRecord) {
        const
            me        = this,
            firstLoad = !me.record;

        //<debug>
        console.assert(
            firstLoad || me.getProject() === eventRecord.getProject(),
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        const calendarField = this.calendarField;

        if (calendarField && firstLoad) {
            calendarField.store = eventRecord.getProject().getCalendarManagerStore();
        }

        super.loadEvent(eventRecord);
    }
}

BryntumWidgetAdapterRegister.register(AdvancedTab.type, AdvancedTab);
