import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'Ru',
    localeDesc = 'Русский',
    locale     = {

        localeName,
        localeDesc,

        Object : {
            Yes    : 'Да',
            No     : 'Нет',
            Cancel : 'Отмена'
        },

        //region Widgets

        Combo : {
            noResults : 'Нет результатов'
        },

        FilePicker : {
            file : 'Файл'
        },

        Field : {
            // native input ValidityState statuses
            badInput        : 'Недопустимое значение поля',
            patternMismatch : 'Значение должно соответствовать определенному шаблону',
            rangeOverflow   : value => `Значение должно быть меньше или равно ${value.max}`,
            rangeUnderflow  : value => `Значение должно быть больше или равно ${value.min}`,
            stepMismatch    : 'Значение должно соответствовать шагу',
            tooLong         : 'Значение должно быть короче',
            tooShort        : 'Значение должно быть длиннее',
            typeMismatch    : 'Значение должно быть в специальном формате',
            valueMissing    : 'Поле не может быть пустым',

            invalidValue          : 'Недопустимое значение поля',
            minimumValueViolation : 'Нарушение минимального значения',
            maximumValueViolation : 'Нарушение максимального значения',
            fieldRequired         : 'Поле не может быть пустым',
            validateFilter        : 'Выберите значение из списка'
        },

        DateField : {
            invalidDate : 'Невернывй формат даты'
        },

        TimeField : {
            invalidTime : 'Неверный формат времени'
        },

        List : {
            loading : 'Загрузка...'
        },

        PagingToolbar : {
            firstPage         : 'Перейти на первую страницу',
            prevPage          : 'Перейти на предыдущую страницу',
            page              : 'страница',
            nextPage          : 'Перейти на следующую страницу',
            lastPage          : 'Перейти на последнюю страницу',
            reload            : 'Перезагрузить текущую страницу',
            noRecords         : 'Нет записей для отображения',
            pageCountTemplate : data => `из ${data.lastPage}`,
            summaryTemplate   : data => `Показаны записи ${data.start} - ${data.end} из ${data.allCount}`
        },

        //endregion

        //region Others

        DateHelper : {
            locale       : 'ru',
            weekStartDay : 1,
            unitNames    : [
                { single : 'миллисек', plural : 'миллисек', abbrev : 'мс' },
                { single : 'секунда', plural : 'секунд', abbrev : 'с' },
                { single : 'минута', plural : 'минут', abbrev : 'мин' },
                { single : 'час', plural : 'часов', abbrev : 'ч' },
                { single : 'день', plural : 'дней', abbrev : 'д' },
                { single : 'неделя', plural : 'недели', abbrev : 'нед' },
                { single : 'месяц', plural : 'месяцев', abbrev : 'мес' },
                { single : 'квартал', plural : 'кварталов', abbrev : 'квар' },
                { single : 'год', plural : 'лет', abbrev : 'г' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 н" or "2 нед" or "2 неделя" or "2 недели" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['мс', 'мил'],
                ['с', 'сек'],
                ['м', 'мин'],
                ['ч'],
                ['д', 'ден', 'дне'],
                ['н', 'нед'],
                ['мес'],
                ['к', 'квар', 'квр'],
                ['г']
            ],
            parsers : {
                L  : 'DD.MM.YYYY',
                LT : 'HH:mm'
            },
            ordinalSuffix : number => `${number}-й`
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, path : 'lib/Core/localization/Ru.js', locale : locale });
