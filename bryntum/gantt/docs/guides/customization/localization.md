# Localization
Bryntum Gantt uses locales for translations of texts, date formats and such. This guide shows you how to use one of the locales that Bryntum Gantt ships with and how to create your own.

## Use an included locale
Bryntum Gantt ships with a collection of locales, located under `build/locales`. These locales are in UMD format and can be included on page using normal script tags:

```
<script src="build/locales/gantt.locale.SvSE.js"></script>
```

Each included locale gets registered in a global namespace (bryntum.locales), which is later checked by the Gantt's
[LocaleManager](#Core/localization/LocaleManager). Therefore it is important that they are loaded before the Gantt, so that their script tags are above the tag for the umd bundle:

```
<script src="build/locales/gantt.locale.SvSE.js"></script>
<script src="build/gantt.umd.js"></script>
```

The first included locale becomes the default locale, but you can override it by setting the attribute of the script tag in any order. For example, to set the Dutch locale as the default one use the following tag:

```
<script data-default-locale="Nl" src="build/gantt.umd.js"></script>
```

Please note that the English locale is part of the Gantt bundle so you never need to include it separately.
You can also use LocaleManager from code to switch locale at any point:

```
// using module bundle
LocaleManager.locale = 'SvSE';

// also possible to reach it from the gantt instance
gantt.localeManager.locale = 'SvSE';
```

## Including a locale in React
The approach described above (using a script tag) should work for all frameworks. But if you are using a React + WebPack approach (or similar) you have also the option to include the locale using `import`. Follow these steps to get it to work:

1. Copy the locale you want to use from `build/locales` to `src/components`.
2. Import it and apply it in App.js:

```
import { Gantt, LocaleManager } from './gantt.module.js';
import SvSE from './gantt.locale.SvSE.js';

LocaleManager.locale = SvSE;
```

## Create a custom locale
The localization demo (found at <a href="../examples/localization" target="_blank">examples/localization</a>) has a custom locale (german, `custom-local-de.js`). You can inspect it and the demo to see how to create your own and how to include it. 

The translation of Gantt strings is grouped by Gantt class names. Here is a small excerpt from the English locale:

```javascript
Dependencies : {
    from    : 'From',
    to      : 'To',
    valid   : 'Valid',
    invalid : 'Invalid'
},

EventEdit : {
    nameText     : 'Name',
    resourceText : 'Resource',
    startText    : 'Start',
    endText      : 'End',
    saveText     : 'Save',
    deleteText   : 'Delete',
    cancelText   : 'Cancel',
    editEvent    : 'Edit event'
}
```
 
To translate, replace the string part ('Edit event' etc) with your translation.

### Change date formats
Gantt uses ViewPresets to configure the time axis header and the date format used by tooltips and similar. A ViewPreset, among other things, defines the rows displayed in the time axis header, from one to three levels named bottom, middle and top. When creating a custom locale, you might want to change the date format for these levels to suite your needs. This can be achieved by creating an entry for PresetManager with sub entries per ViewPreset.

```javascript
const locale = {
    
    // ... Other translations here ...
    
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
    }
}

LocaleManager.extendLocale('En', locale);

PresetManager.onLocalized(); // private but required to apply changes (see #8460);

```

Dates are formatted using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat).
Full list of locales according to BCP 47 standard is available [here](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

This table lists all the built in ViewPresets, the unit and the date formats they use for the header levels:

|Preset          |Bottom       |Middle                 |Top                  |
|----------------|-------------|-----------------------|---------------------|
|secondAndMinute |             |second, `ss`           |minute, `llll`       |
|minuteAndHour   |             |minute, `mm`           |hour, `ddd MM/DD, hA`|
|hourAndDay      |             |hour, `LT`             |day, `ddd DD/MM`     |
|day             |hour, *      |day, `ddd DD/MM`       |                     |
|dayAndWeek      |             |day, `dd DD`           |week, *              |
|weekAndDay      |day, `DD MMM`|week, `YYYY MMMM DD`   |                     |
|weekAndDayLetter|day, *       |week, `ddd DD MMM YYYY`|                     |
|week            |hour, *      |week, `D d`            |                     |
|weekAndMonth    |             |week, `DD MMM`         |month, `MMM YYYY`    |
|weekDateAndMonth|             |week, `DD`             |month, `YYYY MMMM`   |
|monthAndYear    |             |month, `MMM YYYY`      |year, `YYYY`         |
|year            |             |quarter, *             |year, `YYYY`         |
|manyYears       |year, `YYYY` |year, `YY`             |                     |

In case you want to localize date formats for the default zoom levels in Gantt, these are the ViewPresets used:

* manyYears
* year
* monthAndYear
* weekDateAndMonth
* weekAndMonth
* weekAndDayLetter
* weekAndDay
* hourAndDay
* minuteAndHour
* secondAndMinute


## Change single entries
It is also possible to change the translation of most items one by one at runtime. Try the following approach, but
please note that any string already displayed will not change:

```
gantt.localeManager.locale.EventEdit.deleteText = 'Scrap it';
```
