import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../SchedulerPro/localization/En.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Common

        Object : {
            Save : 'Save'
        },

        //endregion

        //region Columns

        AddNewColumn : {
            'New Column' : 'New Column'
        },

        CalendarColumn : {
            Calendar : 'Calendar'
        },

        EarlyStartDateColumn : {
            'Early Start' : 'Early Start'
        },

        EarlyEndDateColumn : {
            'Early End' : 'Early End'
        },

        LateStartDateColumn : {
            'Late Start' : 'Late Start'
        },

        LateEndDateColumn : {
            'Late End' : 'Late End'
        },

        TotalSlackColumn : {
            'Total Slack' : 'Total Slack'
        },

        ConstraintDateColumn : {
            'Constraint Date' : 'Constraint Date'
        },

        ConstraintTypeColumn : {
            'Constraint Type' : 'Constraint Type'
        },

        DeadlineDateColumn : {
            Deadline : 'Deadline'
        },

        DependencyColumn : {
            'Invalid dependency found, change is reverted' : 'Invalid dependency found, change is reverted'
        },

        DurationColumn : {
            Duration : 'Duration'
        },

        EffortColumn : {
            Effort : 'Effort'
        },

        EndDateColumn : {
            Finish : 'Finish'
        },

        EventModeColumn : {
            'Event mode' : 'Event mode',
            Manual       : 'Manual',
            Auto         : 'Auto'
        },

        ManuallyScheduledColumn : {
            'Manually scheduled' : 'Manually scheduled'
        },

        MilestoneColumn : {
            Milestone : 'Milestone'
        },

        NameColumn : {
            Name : 'Name'
        },

        NoteColumn : {
            Note : 'Note'
        },

        PercentDoneColumn : {
            '% Done' : '% Done'
        },

        PredecessorColumn : {
            Predecessors : 'Predecessors'
        },

        ResourceAssignmentColumn : {
            'Assigned Resources' : 'Assigned Resources',
            'more resources'     : 'more resources'
        },

        RollupColumn : {
            Rollup : 'Rollup'
        },

        SchedulingModeColumn : {
            'Scheduling Mode' : 'Scheduling Mode'
        },

        SequenceColumn : {
            Sequence : 'Sequence'
        },

        ShowInTimelineColumn : {
            'Show in timeline' : 'Show in timeline'
        },

        StartDateColumn : {
            Start : 'Start'
        },

        SuccessorColumn : {
            Successors : 'Successors'
        },

        WBSColumn : {
            WBS : 'WBS'
        },

        //endregion

        ProjectLines : {
            'Project Start' : 'Project start',
            'Project End'   : 'Project end'
        },

        TaskTooltip : {
            Start    : 'Start',
            End      : 'End',
            Duration : 'Duration',
            Complete : 'Complete'
        },

        AssignmentGrid : {
            Name     : 'Resource name',
            Units    : 'Units',
            unitsTpl : ({ value }) => value ? value + '%' : ''
        },

        AssignmentEditGrid : {
            Name  : 'Resource name',
            Units : 'Units'
        },

        Gantt : {
            Edit                   : 'Edit task',
            Indent                 : 'Indent',
            Outdent                : 'Outdent',
            'Convert to milestone' : 'Convert to milestone',
            Add                    : 'Add...',
            'New task'             : 'New task',
            'New milestone'        : 'New milestone',
            'Task above'           : 'Task above',
            'Task below'           : 'Task below',
            'Delete task'          : 'Delete task',
            Milestone              : 'Milestone',
            'Sub-task'             : 'Subtask',
            Successor              : 'Successor',
            Predecessor            : 'Predecessor',
            changeRejected         : 'Scheduling engine rejected the changes'
        },

        GanttCommon : {
            dependencyTypes : [
                'SS',
                'SF',
                'FS',
                'FF'
            ]
        },

        Indicators : {
            earlyDates   : 'Early start/end',
            lateDates    : 'Late start/end',
            Start        : 'Start',
            End          : 'End',
            deadlineDate : 'Deadline'
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

LocaleManager.registerLocale('En', { desc : 'English', locale : locale });
