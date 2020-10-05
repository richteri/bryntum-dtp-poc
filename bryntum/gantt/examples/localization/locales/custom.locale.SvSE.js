import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import SvSE from '../../../lib/Gantt/localization/SvSE.js';

const customSvSELocale = {

    extends : 'SvSE',

    App : {
        'Localization demo' : 'Lokaliseringsdemo'
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

    Column : {
        Duration : 'Varaktighet',
        Name     : 'Namn',
        Finish   : 'Slut',
        Start    : 'Start',
        WBS      : 'WBS'
    },

    Combo : {
        'Select theme'  : 'Välj tema',
        'Select locale' : 'Välj språk',
        'Select size'   : 'Välj storlek'
    },

    Shared : {
        'Full size'      : 'Full storlek',
        'Locale changed' : 'Språk ändrat',
        'Phone size'     : 'Telefonstorlek'
    },

    Tooltip : {
        'Click to show info and switch theme or locale' : 'Klicka för att visa information och byta tema eller språk',
        'Click to show the built in code editor'        : 'Klicka för att visa den inbyggda kodredigeraren',
        Fullscreen                                      : 'Fullskärm'
    }

};

// Publishing locales to be loaded automatically (for umd bundles)
LocaleHelper.publishLocale('SvSE', SvSE);
LocaleHelper.publishLocale('SvSE-Custom', customSvSELocale);
//</umd>

// Or extending locales directly
LocaleManager.extendLocale('SvSE', customSvSELocale);
