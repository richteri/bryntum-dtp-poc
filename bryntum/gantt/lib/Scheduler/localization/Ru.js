import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Grid/localization/Ru.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        ResourceInfoColumn : {
            eventCountText : function(data) {
                return data + ' ' + (data >= 2 && data <= 4 ? 'события' : data !== 1 ? 'событий' : 'событие');
            }
        },

        Dependencies : {
            from     : 'От',
            to       : 'К',
            valid    : 'Верная',
            invalid  : 'Неверная',
            Checking : 'Проверяю…'
        },

        EventEdit : {
            Name         : 'Название',
            Resource     : 'Ресурс',
            Start        : 'Начало',
            End          : 'Конец',
            Save         : 'Сохранить',
            Delete       : 'Удалить',
            Cancel       : 'Отмена',
            'Edit Event' : 'Изменить событие',
            Repeat       : 'Повтор'
        },

        DependencyEdit : {
            From              : 'От',
            To                : 'К',
            Type              : 'Тип',
            Lag               : 'Запаздывание',
            'Edit dependency' : 'Редактировать зависимость',
            Save              : 'Сохранить',
            Delete            : 'Удалить',
            Cancel            : 'Отменить',
            StartToStart      : 'Начало к Началу',
            StartToEnd        : 'Начало к Окончанию',
            EndToStart        : 'Окончание к Началу',
            EndToEnd          : 'Окончание к Окончанию'
        },

        EventDrag : {
            eventOverlapsExisting : 'Событие перекрывает существующее событие для этого ресурса',
            noDropOutsideTimeline : 'Событие не может быть отброшено полностью за пределами графика'
        },

        Scheduler : {
            'Add event'      : 'Добавить событие',
            'Delete event'   : 'Удалить событие',
            'Unassign event' : 'Убрать назначение с события'
        },

        HeaderContextMenu : {
            pickZoomLevel   : 'Выберите масштаб',
            activeDateRange : 'Диапазон дат',
            startText       : 'Начало',
            endText         : 'Конец',
            todayText       : 'Сегодня'
        },

        EventFilter : {
            filterEvents : 'Фильтровать задачи',
            byName       : 'По имени'
        },

        TimeRanges : {
            showCurrentTimeLine : 'Показать текущую шкалу времени'
        },

        PresetManager : {
            minuteAndHour : {
                topDateFormat : 'ddd DD.MM, HH:mm'
            },
            hourAndDay : {
                topDateFormat : 'ddd DD.MM'
            },
            weekAndDay : {
                displayDateFormat : 'HH:mm'
            }
        },

        RecurrenceConfirmationPopup : {
            'delete-title'              : 'Вы удаляете повторяющееся событие',
            'delete-all-message'        : 'Хотите удалить все повторения этого события?',
            'delete-further-message'    : 'Хотите удалить это и все последующие повторения этого события или только выбранное?',
            'delete-further-btn-text'   : 'Удалить все будущие повторения',
            'delete-only-this-btn-text' : 'Удалить только это событие',

            'update-title'              : 'Вы изменяете повторяющееся событие',
            'update-all-message'        : 'Изменить все повторения события?',
            'update-further-message'    : 'Изменить только это повторение или это и все последующие повторения события?',
            'update-further-btn-text'   : 'Все будущие повторения',
            'update-only-this-btn-text' : 'Только это событие',

            Yes    : 'Да',
            Cancel : 'Отменить',

            width : 600
        },

        RecurrenceLegend : {
            ' and '                         : ' и ',
            // frequency patterns
            Daily                           : 'Ежедневно',
            'Weekly on {1}'                 : ({ days }) => `Еженедельно (${days})`,
            'Monthly on {1}'                : ({ days }) => `Ежемесячно (день: ${days})`,
            'Yearly on {1} of {2}'          : ({ days, months }) => `Ежегодно (день: ${days}, месяц: ${months})`,
            'Every {0} days'                : ({ interval }) => `Каждый ${interval} день`,
            'Every {0} weeks on {1}'        : ({ interval, days }) => `Каждую ${interval} неделю, день: ${days}`,
            'Every {0} months on {1}'       : ({ interval, days }) => `Каждый ${interval} месяц, день: ${days}`,
            'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Каждый ${interval} год, день: ${days} месяц: ${months}`,
            // day position translations
            position1                       : 'первый',
            position2                       : 'второй',
            position3                       : 'третий',
            position4                       : 'четвертый',
            position5                       : 'пятый',
            'position-1'                    : 'последний',
            // day options
            day                             : 'день',
            weekday                         : 'будний день',
            'weekend day'                   : 'выходной день',
            // {0} - day position info ("the last"/"the first"/...)
            // {1} - day info ("Sunday"/"Monday"/.../"day"/"weekday"/"weekend day")
            // For example:
            //  "the last Sunday"
            //  "the first weekday"
            //  "the second weekend day"
            daysFormat                      : ({ position, days }) => `${position} ${days}`
        },

        RecurrenceEditor : {
            'Repeat event'      : 'Повторять событие',
            Cancel              : 'Отменить',
            Save                : 'Сохранить',
            Frequency           : 'Как часто',
            Every               : 'Каждый(ую)',
            DAILYintervalUnit   : 'день',
            WEEKLYintervalUnit  : 'неделю по:',
            MONTHLYintervalUnit : 'месяц',
            YEARLYintervalUnit  : 'год/лет в:',
            Each                : 'Какого числа',
            'On the'            : 'В следующие дни',
            'End repeat'        : 'Прекратить',
            'time(s)'           : 'раз(а)'
        },

        RecurrenceDaysCombo : {
            day           : 'день',
            weekday       : 'будний день',
            'weekend day' : 'выходной день'
        },

        RecurrencePositionsCombo : {
            position1    : 'первый',
            position2    : 'второй',
            position3    : 'третий',
            position4    : 'четвертый',
            position5    : 'пятый',
            'position-1' : 'последний'
        },

        RecurrenceStopConditionCombo : {
            Never     : 'Никогда',
            After     : 'После',
            'On date' : 'В дату'
        },

        RecurrenceFrequencyCombo : {
            Daily   : 'Каждый день',
            Weekly  : 'Каждую неделю',
            Monthly : 'Каждый месяц',
            Yearly  : 'Каждый год'
        },

        RecurrenceCombo : {
            None   : 'Не выбрано',
            Custom : 'Настроить...'
        },

        //region Features

        Summary : {
            'Summary for' : date => `Сводка на ${date}`
        },

        //endregion

        //region Export

        ScheduleRangeCombo : {
            completeview : 'Полное расписание',
            currentview  : 'Текущая видимая область',
            daterange    : 'Диапазон дат',
            completedata : 'Полное расписание (по всем событиям)'
        },

        SchedulerExportDialog : {
            'Schedule range' : 'Диапазон расписания',
            'Export from'    : 'С',
            'Export to'      : 'По'
        },

        ExcelExporter : {
            'No resource assigned' : 'Ресурс не назначен'
        },

        //endregion

        CrudManagerView : {
            serverResponseLabel : 'Ответ сервера:'
        }

    });

export default locale;
//</umd>

LocaleManager.registerLocale('Ru', { desc : 'Русский', locale : locale });
