import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../SchedulerPro/localization/Nl.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Common

        Object : {
            Save : 'Bewaar'
        },

        //endregion

        //region Columns

        AddNewColumn : {
            'New Column' : 'Nieuwe kolom'
        },
        CalendarColumn : {
            Calendar : 'Kalender'
        },

        EarlyStartDateColumn : {
            'Early Start' : 'Vroegste startdatum'
        },

        EarlyEndDateColumn : {
            'Early End' : 'Vroegste einddatum'
        },

        LateStartDateColumn : {
            'Late Start' : 'Late startdatum'
        },

        LateEndDateColumn : {
            'Late End' : 'Late einddatum'
        },

        TotalSlackColumn : {
            'Total Slack' : 'Totale marge'
        },

        ConstraintDateColumn : {
            'Constraint Date' : 'Beperkingsdatum'
        },

        ConstraintTypeColumn : {
            'Constraint Type' : 'Beperkingstype'
        },

        DeadlineDateColumn : {
            Deadline : 'Uiterste datum'
        },

        DependencyColumn : {
            'Invalid dependency found, change is reverted' : 'Ongeldige afhankelijkheid gevonden, wijziging ongedaan gemaakt'
        },

        DurationColumn : {
            Duration : 'Duur'
        },

        EffortColumn : {
            Effort : 'Inspanning'
        },

        EndDateColumn : {
            Finish : 'Einde'
        },

        EventModeColumn : {
            'Event mode' : 'Mode',
            Manual       : 'Met de hand',
            Auto         : 'Auto'
        },

        ManuallyScheduledColumn : {
            'Manually scheduled' : 'Handmatig ingepland'
        },

        MilestoneColumn : {
            Milestone : 'Mijlpaalmarkering'
        },

        NameColumn : {
            Name : 'Taak Naam'
        },

        NoteColumn : {
            Note : 'Notitie'
        },

        PercentDoneColumn : {
            '% Done' : '% Gedaan'
        },

        PredecessorColumn : {
            Predecessors : 'Voorafgaande taken'
        },

        ResourceAssignmentColumn : {
            'Assigned Resources' : 'Toegewezen Resources',
            'more resources'     : 'extra resources'
        },

        RollupColumn : {
            Rollup : 'Samenvouwen'
        },

        SchedulingModeColumn : {
            'Scheduling Mode' : 'Taaktype'
        },

        SequenceColumn : {
            Sequence : '#'
        },

        StartDateColumn : {
            Start : 'Begin'
        },

        ShowInTimelineColumn : {
            'Show in timeline' : 'Toevoegen aan tijdlijn'
        },

        SuccessorColumn : {
            Successors : 'Opvolgende taken'
        },

        WBSColumn : {
            WBS : 'WBS'
        },

        //endregion

        ProjectLines : {
            'Project Start' : 'Project begin',
            'Project End'   : 'Project einde'
        },

        TaskTooltip : {
            Start    : 'Begin',
            End      : 'Einde',
            Duration : 'Duur',
            Complete : 'Gedaan'
        },

        AssignmentGrid : {
            Name     : 'Resource Naam',
            Units    : 'Eenheden',
            unitsTpl : ({ value }) => value ? value + '%' : ''
        },

        AssignmentEditGrid : {
            Name  : 'Resource Naam',
            Units : 'Eenheden'
        },

        Gantt : {
            Edit                   : 'Taak bewerken',
            Indent                 : 'Inspringen',
            Outdent                : 'Uitspringen',
            'Convert to milestone' : 'Converteren naar mijlpaal',
            Add                    : 'Voeg toe...',
            'New task'             : 'Nieuwe taak',
            'New milestone'        : 'Nieuwe mijlpaal',
            'Task above'           : 'Bovenliggende taak',
            'Task below'           : 'Onderliggende Taak',
            'Delete task'          : 'Verwijder taak/taken',
            Milestone              : 'Mijlpaal',
            'Sub-task'             : 'Subtaak',
            Successor              : 'Voorgaande',
            Predecessor            : 'Voorganger',
            changeRejected         : 'Scheduling engine heeft de wijzigingen afgewezen'
        },

        GanttCommon : {
            dependencyTypes : [
                'GB',
                'BE',
                'EB',
                'GE'
            ]
        },

        Indicators : {
            earlyDates   : 'Vroegste start/eind',
            lateDates    : 'Laatste start/eind',
            deadlineDate : 'Uiterste datum',
            Start        : 'Start',
            End          : 'Eind'
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

LocaleManager.registerLocale('Nl', { desc : 'Nederlands', locale : locale });
