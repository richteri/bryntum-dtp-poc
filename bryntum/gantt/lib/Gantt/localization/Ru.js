import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../SchedulerPro/localization/Ru.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        //region Common

        Object : {
            Save : 'Сохранить'
        },

        //endregion

        //region Columns

        AddNewColumn : {
            'New Column' : 'Добавить столбец...'
        },

        EarlyStartDateColumn : {
            'Early Start' : 'Раннее начало'
        },

        EarlyEndDateColumn : {
            'Early End' : 'Раннее окончание'
        },

        LateStartDateColumn : {
            'Late Start' : 'Позднее начало'
        },

        LateEndDateColumn : {
            'Late End' : 'Позднее окончание'
        },

        TotalSlackColumn : {
            'Total Slack' : 'Общий временной резерв'
        },

        MilestoneColumn : {
            Milestone : 'Веха'
        },

        EffortColumn : {
            Effort : 'Трудозатраты'
        },

        CalendarColumn : {
            Calendar : 'Календарь'
        },

        ConstraintDateColumn : {
            'Constraint Date' : 'Дата ограничения'
        },

        ConstraintTypeColumn : {
            'Constraint Type' : 'Тип ограничения'
        },

        DeadlineDateColumn : {
            Deadline : 'Крайний срок'
        },

        DependencyColumn : {
            'Invalid dependency found, change is reverted' : 'Найдена неверная зависимость, изменение отменено'
        },

        DurationColumn : {
            Duration : 'Длительность'
        },

        EndDateColumn : {
            Finish : 'Конец'
        },

        NameColumn : {
            Name : 'Наименование задачи'
        },

        NoteColumn : {
            Note : 'Примечание'
        },

        PercentDoneColumn : {
            '% Done' : '% завершения'
        },

        PredecessorColumn : {
            Predecessors : 'Предшествующие'
        },

        ResourceAssignmentColumn : {
            'Assigned Resources' : 'Назначенные ресурсы',
            'more resources'     : 'ресурсов'
        },

        RollupColumn : {
            Rollup : 'Сведение'
        },

        SchedulingModeColumn : {
            'Scheduling Mode' : 'Режим'
        },

        SequenceColumn : {
            Sequence : '#'
        },

        StartDateColumn : {
            Start : 'Начало'
        },

        ShowInTimelineColumn : {
            'Show in timeline' : 'Показать на временной шкале'
        },

        SuccessorColumn : {
            Successors : 'Последующие'
        },

        WBSColumn : {
            WBS : 'СДР'
        },

        EventModeColumn : {
            'Event mode' : 'Режим расчёта',
            Manual       : 'Ручной',
            Auto         : 'Автоматический'
        },

        ManuallyScheduledColumn : {
            'Manually scheduled' : 'Ручное планирование'
        },

        //endregion

        ProjectLines : {
            'Project Start' : 'Начало проекта',
            'Project End'   : 'Окончание проекта'
        },

        TaskTooltip : {
            Start    : 'Начинается',
            End      : 'Заканчивается',
            Duration : 'Длительность',
            Complete : 'Выполнено'
        },

        AssignmentGrid : {
            Name     : 'Имя ресурса',
            Units    : 'Занятость',
            unitsTpl : ({ value }) => value ? value + '%' : ''
        },

        AssignmentEditGrid : {
            Name  : 'Имя ресурса',
            Units : 'Единицы'
        },

        Gantt : {
            Edit                   : 'Редактировать задачу',
            Indent                 : 'Понизить уровень',
            Outdent                : 'Повысить уровень',
            'Convert to milestone' : 'Преобразовать в веху',
            Add                    : 'Добавить...',
            'New task'             : 'Новая задача',
            'New milestone'        : 'Новая веха',
            'Task above'           : 'Задачу выше',
            'Task below'           : 'Задачу ниже',
            'Delete task'          : 'Удалить задачу(и)',
            Milestone              : 'Веху',
            'Sub-task'             : 'Под-задачу',
            Successor              : 'Последующую задачу',
            Predecessor            : 'Предшествующую задачу',
            changeRejected         : 'Планирование двигателя отклонило изменения'
        },

        GanttCommon : {
            dependencyTypes : [
                'НН',
                'НО',
                'ОН',
                'ОО'
            ]
        },

        Indicators : {
            earlyDates   : 'Раннее начало/окончание',
            lateDates    : 'Позднее начало/окончание',
            deadlineDate : 'Крайний срок',
            Start        : 'Начало',
            End          : 'Конец'
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

LocaleManager.registerLocale('Ru', { desc : 'Русский', locale : locale });
