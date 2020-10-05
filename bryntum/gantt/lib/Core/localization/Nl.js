import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'Nl',
    localeDesc = 'Nederlands',
    locale     = {

        localeName,
        localeDesc,

        Object : {
            Yes    : 'Ja',
            No     : 'Nee',
            Cancel : 'Annuleren'
        },

        //region Widgets

        Combo : {
            noResults : 'Geen resultaten'
        },

        FilePicker : {
            file : 'Vijl'
        },

        Field : {
            // native input ValidityState statuses
            badInput              : 'Ongeldige veldwaarde',
            patternMismatch       : 'Waarde moet overeenkomen met een specifiek patroon',
            rangeOverflow         : value => `Waarde moet kleiner zijn dan of gelijk aan ${value.max}`,
            rangeUnderflow        : value => `Waarde moet groter zijn dan of gelijk aan ${value.min}`,
            stepMismatch          : 'Waarde moet bij de stap passen',
            tooLong               : 'Waarde moet korter zijn',
            tooShort              : 'Waarde moet langer zijn',
            typeMismatch          : 'Waarde moet een speciaal formaat hebben',
            valueMissing          : 'Dit veld is verplicht',
            invalidValue          : 'Ongeldige veldwaarde',
            minimumValueViolation : 'Minimale waarde schending',
            maximumValueViolation : 'Maximale waarde schending',
            fieldRequired         : 'Dit veld is verplicht',
            validateFilter        : 'Waarde moet worden geselecteerd in de lijst'
        },

        DateField : {
            invalidDate : 'Ongeldige datuminvoer'
        },

        TimeField : {
            invalidTime : 'Ongeldige tijdsinvoer'
        },

        List : {
            loading : 'Laden...'
        },

        PagingToolbar : {
            firstPage         : 'Ga naar de eerste pagina',
            prevPage          : 'Ga naar de vorige pagina',
            page              : 'Pagina',
            nextPage          : 'Ga naar de volgende pagina',
            lastPage          : 'Ga naar de laatste pagina',
            reload            : 'Laad huidige pagina opnieuw',
            noRecords         : 'Geen rijen om weer te geven',
            pageCountTemplate : data => `van ${data.lastPage}`,
            summaryTemplate   : data => `Records ${data.start} - ${data.end} van ${data.allCount} worden weergegeven`
        },

        //endregion

        //region Others

        DateHelper : {
            locale            : 'nl',
            weekStartDay      : 1,
            unitNames         : [
                { single : 'ms', plural : 'ms', abbrev : 'ms' },
                { single : 'seconde', plural : 'seconden', abbrev : 's' },
                { single : 'minuut', plural : 'minuten', abbrev : 'm' },
                { single : 'uur', plural : 'uren', abbrev : 'u' },
                { single : 'dag', plural : 'dagen', abbrev : 'd' },
                { single : 'week', plural : 'weken', abbrev : 'w' },
                { single : 'maand', plural : 'maanden', abbrev : 'ma' },
                { single : 'kwartaal', plural : 'kwartalen', abbrev : 'kw' },
                { single : 'jaar', plural : 'jaren', abbrev : 'j' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 w" or "2 wk" or "2 week" or "2 weken" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['mil'],
                ['s', 'sec'],
                ['m', 'min'],
                ['u'],
                ['d'],
                ['w', 'wk'],
                ['ma', 'mnd', 'm'],
                ['k', 'kwar', 'kwt', 'kw'],
                ['j', 'jr']
            ],
            parsers           : {
                L  : 'DD-MM-YYYY',
                LT : 'HH:mm'
            },
            ordinalSuffix     : number => number
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, locale : locale });
