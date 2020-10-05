import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../SchedulerPro/localization/SvSE.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Common

        Object : {
            Save : 'Spara'
        },

        //endregion

        //region Columns

        AddNewColumn : {
            'New Column' : 'Lägg till ny kolumn...'
        },

        EarlyStartDateColumn : {
            'Early Start' : 'Tidig Start'
        },

        EarlyEndDateColumn : {
            'Early End' : 'Tidigt Slut'
        },

        LateStartDateColumn : {
            'Late Start' : 'Sen Start'
        },

        LateEndDateColumn : {
            'Late End' : 'Sent Slut'
        },

        TotalSlackColumn : {
            'Total Slack' : 'Totalt slack'
        },

        MilestoneColumn : {
            Milestone : 'Milstolpe (v)'
        },

        EffortColumn : {
            Effort : 'Arbetsinsats'
        },

        CalendarColumn : {
            Calendar : 'Kalender'
        },

        ConstraintDateColumn : {
            'Constraint Date' : 'Måldatum'
        },

        ConstraintTypeColumn : {
            'Constraint Type' : 'Villkorstyp'
        },

        DeadlineDateColumn : {
            Deadline : 'Deadline'
        },

        DependencyColumn : {
            'Invalid dependency found, change is reverted' : 'Ogiltigt beroende hittades, ändringen ej utförd'
        },

        DurationColumn : {
            Duration : 'Varaktighet'
        },

        EndDateColumn : {
            Finish : 'Slut'
        },

        NameColumn : {
            Name : 'Aktivitet'
        },

        NoteColumn : {
            Note : 'Anteckning'
        },

        PercentDoneColumn : {
            '% Done' : '% Färdig'
        },

        PredecessorColumn : {
            Predecessors : 'Föregående'
        },

        ResourceAssignmentColumn : {
            'Assigned Resources' : 'Tilldelade Resurser',
            'more resources'     : 'ytterligare resurser'
        },

        RollupColumn : {
            Rollup : 'Upplyft'
        },

        SchedulingModeColumn : {
            'Scheduling Mode' : 'Läge'
        },

        SequenceColumn : {
            Sequence : '#'
        },

        StartDateColumn : {
            Start : 'Start'
        },

        ShowInTimelineColumn : {
            'Show in timeline' : 'Visa i tidslinje'
        },

        SuccessorColumn : {
            Successors : 'Efterföljande'
        },

        WBSColumn : {
            WBS : 'Strukturkod'
        },

        EventModeColumn : {
            'Event mode' : 'Händelse läge',
            Manual       : 'Manuell',
            Auto         : 'Automatiskt'
        },

        ManuallyScheduledColumn : {
            'Manually scheduled' : 'Manuellt planerad'
        },

        //endregion

        ProjectLines : {
            'Project Start' : 'Projektstart',
            'Project End'   : 'Projektslut'
        },

        TaskTooltip : {
            Start    : 'Börjar',
            End      : 'Slutar',
            Duration : 'Längd',
            Complete : 'Färdig'
        },

        AssignmentGrid : {
            Name     : 'Resursnamn',
            Units    : 'Enheter',
            unitsTpl : ({ value }) => value ? value + '%' : ''
        },

        AssignmentEditGrid : {
            Name  : 'Resursnamn',
            Units : 'Enheter'
        },

        Gantt : {
            Edit                   : 'Redigera uppgift',
            Indent                 : 'Indrag',
            Outdent                : 'Minska indrag',
            'Convert to milestone' : 'Konvertera till milstolpe',
            Add                    : 'Lägg till...',
            'New task'             : 'Ny aktivitet',
            'New milestone'        : 'Ny milstolpe',
            'Task above'           : 'Aktivtitet över',
            'Task below'           : 'Aktivitet under',
            'Delete task'          : 'Ta bort aktivitet(er)',
            Milestone              : 'Milstolpe',
            'Sub-task'             : 'Underaktivitet',
            Successor              : 'Efterföljare',
            Predecessor            : 'Föregångare',
            changeRejected         : 'Schemaläggningsmotorn avvisade ändringarna'
        },

        GanttCommon : {
            dependencyTypes : [
                'SS',
                'SA',
                'AS',
                'AA'
            ]
        },

        Indicators : {
            earlyDates   : 'Tidigt start/slut',
            lateDates    : 'Sent start/slut',
            deadlineDate : 'Deadline',
            Start        : 'Start',
            End          : 'Slut'
        }
    });

// Trim not used properties
LocaleHelper.trimLocale(locale, {
    EventEdit : [
        'Repeat'
    ],
    RecurrenceCombo              : {},
    RecurrenceConfirmationPopup  : {},
    RecurrenceDaysCombo          : {},
    RecurrenceEditor             : {},
    RecurrenceFrequencyCombo     : {},
    RecurrenceLegend             : {},
    RecurrencePositionsCombo     : {},
    RecurrenceStopConditionCombo : {}
});

export default locale;
//</umd>

LocaleManager.registerLocale('SvSE', { desc : 'Svenska', locale : locale });
