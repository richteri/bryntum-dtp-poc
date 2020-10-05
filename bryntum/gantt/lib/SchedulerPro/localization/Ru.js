import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/Ru.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        SchedulerProCommon : {
            SS                  : 'НН',
            SF                  : 'НО',
            FS                  : 'ОН',
            FF                  : 'ОО',
            dependencyTypesLong : [
                'Начало-Начало',
                'Начало-Окончание',
                'Окончание-Начало',
                'Окончание-Окончание'
            ]
        },

        ConstraintTypePicker : {
            none                : 'Нет',
            muststarton         : 'Фиксированное начало',
            mustfinishon        : 'Фиксированное окончание',
            startnoearlierthan  : 'Начало не раньше',
            startnolaterthan    : 'Начало не позднее',
            finishnoearlierthan : 'Окончание не раньше',
            finishnolaterthan   : 'Окончание не позднее'
        },

        CalendarField : {
            'Default calendar' : 'Основной календарь'
        },

        ProTaskEdit : {
            'Edit event' : 'Изменить событие'
        },

        TaskEditorBase : {
            editorWidth : '60em',
            Information : 'Информация',
            Save        : 'Сохранить',
            Cancel      : 'Отменить',
            Delete      : 'Удалить',
            saveError   : 'Сохранение невозможно, исправьте ошибки'
        },

        SchedulerGeneralTab : {
            labelWidth           : '18em',
            General              : 'Основные',
            Name                 : 'Имя',
            '% complete'         : '% выполнено',
            Duration             : 'Длительность',
            Start                : 'Начало',
            Finish               : 'Окончание',
            Dates                : 'Даты',
            'Manually scheduled' : 'Ручное планирование',
            Calendar             : 'Календарь'
        },

        GeneralTab : {
            labelWidth   : '9em',
            General      : 'Основные',
            Name         : 'Имя',
            '% complete' : '% выполнено',
            Duration     : 'Длительность',
            Start        : 'Начало',
            Finish       : 'Окончание',
            Effort       : 'Трудозатраты',
            Dates        : 'Даты'
        },

        AdvancedTab : {
            labelWidth           : '18em',
            Advanced             : 'Дополнительные',
            Calendar             : 'Календарь',
            'Scheduling mode'    : 'Тип планирования',
            'Effort driven'      : 'Управляемое трудозатратами',
            'Manually scheduled' : 'Ручное планирование',
            'Constraint type'    : 'Тип ограничения',
            'Constraint date'    : 'Дата ограничения',
            Constraint           : 'Ограничение',
            Rollup               : 'Сведение'
        },

        DependencyTab : {
            Predecessors                          : 'Предшественники',
            Successors                            : 'Последователи',
            ID                                    : 'Идентификатор',
            Name                                  : 'Имя',
            Type                                  : 'Тип',
            Lag                                   : 'Запаздывание',
            'Cyclic dependency has been detected' : 'Обнаружена цикличная зависимость',
            'Invalid dependency'                  : 'Неверная зависимость'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Ресурсы',
            Resource  : 'Ресурс',
            Units     : '% Занятости'
        },

        NotesTab : {
            Notes : 'Заметки'
        },

        SchedulingModePicker : {
            Normal           : 'Нормальный',
            'Fixed Duration' : 'Фиксированная длительность',
            'Fixed Units'    : 'Фиксированные единицы',
            'Fixed Effort'   : 'Фиксированные трудозатраты'
        },

        DurationColumn : {
            Duration : 'Длительность'
        }

    });

export default locale;
//</umd>

LocaleManager.registerLocale('Ru', { desc : 'Русский', locale : locale });
