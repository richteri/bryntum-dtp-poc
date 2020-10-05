import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/En.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        SchedulerProCommon : {
            SS                  : 'SS',
            SF                  : 'SF',
            FS                  : 'FS',
            FF                  : 'FF',
            dependencyTypesLong : [
                'Start-to-Start',
                'Start-to-End',
                'End-to-Start',
                'End-to-End'
            ]
        },

        ConstraintTypePicker : {
            none                : 'None',
            muststarton         : 'Must start on',
            mustfinishon        : 'Must finish on',
            startnoearlierthan  : 'Start no earlier than',
            startnolaterthan    : 'Start no later than',
            finishnoearlierthan : 'Finish no earlier than',
            finishnolaterthan   : 'Finish no later than'
        },

        CalendarField : {
            'Default calendar' : 'Default calendar'
        },

        ProTaskEdit : {
            'Edit event' : 'Edit event'
        },

        TaskEditorBase : {
            editorWidth : '45em',
            Information : 'Information',
            Save        : 'Save',
            Cancel      : 'Cancel',
            Delete      : 'Delete',
            saveError   : 'Can\'t save, please correct errors first'
        },

        SchedulerGeneralTab : {
            labelWidth           : '11.5em',
            General              : 'General',
            Name                 : 'Name',
            '% complete'         : '% complete',
            Duration             : 'Duration',
            Start                : 'Start',
            Finish               : 'Finish',
            Dates                : 'Dates',
            'Manually scheduled' : 'Manually scheduled',
            Calendar             : 'Calendar'
        },

        GeneralTab : {
            labelWidth   : '6.5em',
            General      : 'General',
            Name         : 'Name',
            '% complete' : '% complete',
            Duration     : 'Duration',
            Start        : 'Start',
            Finish       : 'Finish',
            Effort       : 'Effort',
            Dates        : 'Dates'
        },

        AdvancedTab : {
            labelWidth           : '11.5em',
            Advanced             : 'Advanced',
            Calendar             : 'Calendar',
            'Scheduling mode'    : 'Scheduling mode',
            'Effort driven'      : 'Effort driven',
            'Manually scheduled' : 'Manually scheduled',
            'Constraint type'    : 'Constraint type',
            'Constraint date'    : 'Constraint date',
            Constraint           : 'Constraint',
            Rollup               : 'Rollup'
        },

        DependencyTab : {
            Predecessors                          : 'Predecessors',
            Successors                            : 'Successors',
            ID                                    : 'ID',
            Name                                  : 'Name',
            Type                                  : 'Type',
            Lag                                   : 'Lag',
            'Cyclic dependency has been detected' : 'Cyclic dependency has been detected',
            'Invalid dependency'                  : 'Invalid dependency'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Resources',
            Resource  : 'Resource',
            Units     : 'Units'
        },

        NotesTab : {
            Notes : 'Notes'
        },

        SchedulingModePicker : {
            Normal           : 'Normal',
            'Fixed Duration' : 'Fixed Duration',
            'Fixed Units'    : 'Fixed Units',
            'Fixed Effort'   : 'Fixed Effort'
        },

        DurationColumn : {
            Duration : 'Duration'
        }

    });

export default locale;
//</umd>

LocaleManager.registerLocale('En', { desc : 'English', locale : locale });
