import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'Fi',
    localeDesc = 'Suomi',
    locale     = {

        localeName,
        localeDesc,

        // Translations for common words and phrases which are used by all classes.
        Object : {
            Yes    : 'Joo',
            No     : 'Ei',
            Cancel : 'Peruuttaa'
        },

        //region Widgets

        Combo : {
            noResults : 'Ei tuloksia'
        },

        FilePicker : {
            file : 'Tiedosto'
        },

        Field : {
            fieldRequired         : 'This field is required',
            invalidValue          : 'Invalid field value',
            maximumValueViolation : 'Maximum value violation',
            minimumValueViolation : 'Minimum value violation',
            validateFilter        : 'Value must be selected from the list'
        },

        DateField : {
            invalidDate : 'Invalid date input'
        },

        TimeField : {
            invalidTime : 'Invalid time input'
        },

        Tooltip : {
            loading : 'Laddar...'
        },

        //endregion

        //region Others

        // TODO: Correct this locale, it's copied from SvSE
        DateHelper : {
            locale       : 'fi',
            shortWeek    : 'V',
            shortQuarter : 'q',
            unitNames    : [
                { single : 'ms', plural : 'ms', abbrev : 'ms' },
                { single : 'sekund', plural : 'sekunder', abbrev : 's' },
                { single : 'minut', plural : 'minuter', abbrev : 'min' },
                { single : 'timme', plural : 'timmar', abbrev : 'tim' },
                { single : 'dag', plural : 'dagar', abbrev : 'd' },
                { single : 'vecka', plural : 'veckor', abbrev : 'v' },
                { single : 'månad', plural : 'månader', abbrev : 'mån' },
                { single : 'kvartal', plural : 'kvartal', abbrev : 'kv' },
                { single : 'år', plural : 'år', abbrev : 'år' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 v" or "2 ve" or "2 vecka" or "2 veckor" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['mil'],
                ['s', 'sek'],
                ['m', 'min'],
                ['t', 'tim'],
                ['d'],
                ['v', 've'],
                ['må', 'mån'],
                ['kv', 'kva'],
                []
            ]
        },

        PagingToolbar : {
            firstPage         : 'Siirry ensimmäiselle sivulle',
            prevPage          : 'Siirry edelliselle sivulle',
            page              : 'Sivu',
            nextPage          : 'Siirry seuraavalle sivulle',
            lastPage          : 'Siirry viimeiselle sivulle',
            reload            : 'Lataa nykyinen sivu uudelleen',
            noRecords         : 'Ei näytettäviä rivejä',
            pageCountTemplate : data => `of ${data.lastPage}`,
            summaryTemplate   : data => `Näyttää tietueet ${data.start} - ${data.end}/${data.allCount}`
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, path : 'lib/Core/localization/Fi.js', locale : locale });
