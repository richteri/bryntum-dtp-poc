import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import Ru from '../../../lib/Gantt/localization/Ru.js';

const customRuLocale = {

    extends : 'Ru',

    App : {
        'Localization demo' : 'Демо локализации'
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

    Column : {
        Duration : 'Длительность',
        Name     : 'Имя',
        Finish   : 'Конец',
        Start    : 'Начало',
        WBS      : 'СДР'
    },

    Combo : {
        'Select theme'  : 'Выбрать тему',
        'Select locale' : 'Выбрать язык',
        'Select size'   : 'Выбрать размер'
    },

    Shared : {
        'Locale changed' : 'Язык изменен',
        'Full size'      : 'Полный размер',
        'Phone size'     : 'Экран смартфона'
    },

    Tooltip : {
        'Click to show the built in code editor'        : 'Показать редактор кода',
        'Click to show info and switch theme or locale' : 'Показать информацию, переключить тему или язык',
        Fullscreen                                      : 'На весь экран'
    }
};

// Publishing locales to be loaded automatically (for umd bundles)
LocaleHelper.publishLocale('Ru', Ru);
LocaleHelper.publishLocale('Ru-Custom', customRuLocale);
//</umd>

// Or extending locales directly
LocaleManager.extendLocale('Ru', customRuLocale);
