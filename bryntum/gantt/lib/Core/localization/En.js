import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'En',
    localeDesc = 'English',
    locale     = {

        localeName,
        localeDesc,

        // Translations for common words and phrases which are used by all classes.
        Object : {
            Yes    : 'Yes',
            No     : 'No',
            Cancel : 'Cancel'
        },

        //region Widgets

        Combo : {
            noResults : 'No results'
        },

        FilePicker : {
            file : 'File'
        },

        Field : {
            // native input ValidityState statuses
            badInput        : 'Invalid field value',
            patternMismatch : 'Value should match a specific pattern',
            rangeOverflow   : value => `Value must be less than or equal to ${value.max}`,
            rangeUnderflow  : value => `Value must be greater than or equal to ${value.min}`,
            stepMismatch    : 'Value should fit the step',
            tooLong         : 'Value should be shorter',
            tooShort        : 'Value should be longer',
            typeMismatch    : 'Value is required to be in a special format',
            valueMissing    : 'This field is required',

            invalidValue          : 'Invalid field value',
            minimumValueViolation : 'Minimum value violation',
            maximumValueViolation : 'Maximum value violation',
            fieldRequired         : 'This field is required',
            validateFilter        : 'Value must be selected from the list'
        },

        DateField : {
            invalidDate : 'Invalid date input'
        },

        TimeField : {
            invalidTime : 'Invalid time input'
        },

        List : {
            loading : 'Loading...'
        },

        PagingToolbar : {
            firstPage         : 'Go to first page',
            prevPage          : 'Go to previous page',
            page              : 'Page',
            nextPage          : 'Go to next page',
            lastPage          : 'Go to last page',
            reload            : 'Reload current page',
            noRecords         : 'No records to display',
            pageCountTemplate : data => `of ${data.lastPage}`,
            summaryTemplate   : data => `Displaying records ${data.start} - ${data.end} of ${data.allCount}`
        },

        //endregion

        //region Others

        DateHelper : {
            locale       : 'en-US',
            weekStartDay : 0,
            unitNames    : [
                { single : 'millisecond', plural : 'ms', abbrev : 'ms' },
                { single : 'second', plural : 'seconds', abbrev : 's' },
                { single : 'minute', plural : 'minutes', abbrev : 'min' },
                { single : 'hour', plural : 'hours', abbrev : 'h' },
                { single : 'day', plural : 'days', abbrev : 'd' },
                { single : 'week', plural : 'weeks', abbrev : 'w' },
                { single : 'month', plural : 'months', abbrev : 'mon' },
                { single : 'quarter', plural : 'quarters', abbrev : 'q' },
                { single : 'year', plural : 'years', abbrev : 'yr' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 w" or "2 wk" or "2 week" or "2 weeks" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['mil'],
                ['s', 'sec'],
                ['m', 'min'],
                ['h', 'hr'],
                ['d'],
                ['w', 'wk'],
                ['mo', 'mon', 'mnt'],
                ['q', 'quar', 'qrt'],
                ['y', 'yr']
            ],
            parsers : {
                L  : 'MM/DD/YYYY',
                LT : 'HH:mm A'
            },
            ordinalSuffix : number => number + ({ 1 : 'st', 2 : 'nd', 3 : 'rd' }[number[number.length - 1]] || 'th')
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, locale : locale });
