import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import Nl from '../../../lib/Gantt/localization/Nl.js';

const examplesLocale = {
    extends : 'Nl',

    Button : {
        'Add column'    : 'Kolom toevoegen',
        'Remove column' : 'Kolom verwijderen',
        'Display hints' : 'Hints weergeven',
        Apply           : 'Еoepassen'
    },

    Checkbox : {
        'Auto apply'   : 'Automatisch toepassen',
        Automatically  : 'Automatisch',
        CheckAutoHints : 'Vink deze optie aan om automatisch hints weer te geven bij het laden van het voorbeeld'
    },

    CodeEditor : {
        'Code editor'   : 'Code editor',
        'Download code' : 'Download code'
    },

    TaskTooltip : {
        'Scheduling Mode' : 'Planningsmodus',
        Calendar          : 'Kalender',
        Critical          : 'Kritisch'
    },

    Baselines : {
        baseline           : 'baslinje',
        Complete           : 'Gedaan',
        'Delayed start by' : 'Uitgestelde start met',
        Duration           : 'Duur',
        End                : 'Einde',
        'Overrun by'       : 'Overschreden met',
        Start              : 'Begin'
    },

    Combo : {
        'Group by'      : 'Groeperen door',
        'Select theme'  : 'Selecteer thema',
        'Select locale' : 'Selecteer landinstelling',
        'Select size'   : 'Selecteer grootte'
    },

    Indicators : {
        Indicators     : 'Indicatoren',
        constraintDate : 'Beperking'
    },

    MenuItem : {
        'Custom header item' : 'Aangepast header-item',
        'Custom cell action' : 'Aangepaste celactie'
    },

    Shared : {
        'Full size'      : 'Volledige grootte',
        'Locale changed' : 'Taal is veranderd',
        'Phone size'     : 'Grootte telefoon'
    },

    Slider : {
        'Font size' : 'Lettertypegrootte'
    },

    Tooltip : {
        'Click to show info and switch theme or locale' : 'Klik om informatie weer te geven en van thema of land te wisselen',
        'Click to show the built in code editor'        : 'Klik om de ingebouwde code-editor te tonen',
        Fullscreen                                      : 'Volledig scherm'
    }

};

LocaleHelper.publishLocale('Nl', Nl);
LocaleHelper.publishLocale('NlExamples', examplesLocale);

export default examplesLocale;
//</umd>

LocaleManager.extendLocale('Nl', examplesLocale);
