import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import Ru from '../../../lib/Gantt/localization/Ru.js';

const examplesLocale = {
    extends : 'Ru',

    Baselines : {
        Start              : 'Начало',
        End                : 'Конец',
        Duration           : 'Длительность',
        Complete           : 'Выполнено',
        baseline           : 'базовая линия',
        'Delayed start by' : 'Задержка старта на',
        'Overrun by'       : 'Переполнен на'
    },

    Button : {
        'Add column'    : 'Добавить колонку',
        'Display hints' : 'Показать подсказки',
        'Remove column' : 'Удалить колонку',
        Apply           : 'Применить'
    },

    Checkbox : {
        'Auto apply'   : 'Применять сразу',
        Automatically  : 'Автоматически',
        CheckAutoHints : 'Автоматически показывать подсказки при загрузке примера'
    },

    CodeEditor : {
        'Code editor'   : 'Редактор кода',
        'Download code' : 'Скачать код'
    },

    Combo : {
        'Group by'      : 'Группировка',
        'Select theme'  : 'Выбрать тему',
        'Select locale' : 'Выбрать язык',
        'Select size'   : 'Выбрать размер'
    },

    MenuItem : {
        'Custom header item' : 'Свой заголовок',
        'Custom cell action' : 'Свое действие для ячейки'
    },

    Indicators : {
        Indicators     : 'Индикаторы',
        constraintDate : 'Ограничение'
    },

    Shared : {
        'Locale changed' : 'Язык изменен',
        'Full size'      : 'Полный размер',
        'Phone size'     : 'Экран смартфона'
    },

    Slider : {
        'Font size' : 'Шрифт'
    },

    TaskTooltip : {
        'Scheduling Mode' : 'Тип планирования',
        Calendar          : 'Календарь',
        Critical          : 'Критично'
    },

    Tooltip : {
        'Click to show the built in code editor'        : 'Показать редактор кода',
        'Click to show info and switch theme or locale' : 'Показать информацию, переключить тему или язык',
        Fullscreen                                      : 'На весь экран'
    }

};

LocaleHelper.publishLocale('Ru', Ru);
LocaleHelper.publishLocale('RuExamples', examplesLocale);

export default examplesLocale;
//</umd>

LocaleManager.extendLocale('Ru', examplesLocale);
