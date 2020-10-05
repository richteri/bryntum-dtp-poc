import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import SvSE from '../../../lib/Gantt/localization/SvSE.js';

const examplesLocale = {
    extends : 'SvSE',

    Baselines : {
        Start    : 'Börjar',
        End      : 'Slutar',
        Duration : 'Längd',
        Complete : 'Färdig',

        baseline           : 'baslinje',
        'Delayed start by' : 'Försenad start med',
        'Overrun by'       : 'Överskridande med'
    },

    Button : {
        'Add column'    : 'Lägg till kolumn',
        'Display hints' : 'Visa tips',
        'Remove column' : 'Ta bort kolumn',
        Apply           : 'Verkställ'
    },

    Checkbox : {
        'Auto apply'   : 'Auto applicera',
        Automatically  : 'Automatiskt',
        CheckAutoHints : 'Markera för att automatiskt visa tips när du laddar exemplet'
    },

    CodeEditor : {
        'Code editor'   : 'Kodredigerare',
        'Download code' : 'Ladda ner kod'
    },

    Combo : {
        'Group by'      : 'Gruppera på',
        'Select theme'  : 'Välj tema',
        'Select locale' : 'Välj språk',
        'Select size'   : 'Välj storlek'
    },

    Indicators : {
        Indicators     : 'Indikatorer',
        constraintDate : 'Villkor'
    },

    MenuItem : {
        'Custom header item' : 'Anpassad header-meny',
        'Custom cell action' : 'Anpassad cell-åtgärd'
    },

    Shared : {
        'Full size'      : 'Full storlek',
        'Locale changed' : 'Språk ändrat',
        'Phone size'     : 'Telefonstorlek'
    },

    Slider : {
        'Font size' : 'Fontstorlek'
    },

    TaskTooltip : {
        'Scheduling Mode' : 'Läge',
        Calendar          : 'Kalender',
        Critical          : 'Kritisk'
    },

    Tooltip : {
        'Click to show info and switch theme or locale' : 'Klicka för att visa information och byta tema eller språk',
        'Click to show the built in code editor'        : 'Klicka för att visa den inbyggda kodredigeraren',
        Fullscreen                                      : 'Fullskärm'
    }
};

LocaleHelper.publishLocale('SvSE', SvSE);
LocaleHelper.publishLocale('SvSEExamples', examplesLocale);

export default examplesLocale;
//</umd>

LocaleManager.extendLocale('SvSE', examplesLocale);
