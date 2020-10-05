import LocaleManager from '../../../lib/Core/localization/LocaleManager.js';
//<umd>
import LocaleHelper from '../../../lib/Core/localization/LocaleHelper.js';
import En from '../../../lib/Gantt/localization/En.js';

const examplesLocale = {
    extends : 'En',

    Baselines : {
        baseline           : 'base line',
        Complete           : 'Complete',
        'Delayed start by' : 'Delayed start by',
        Duration           : 'Duration',
        End                : 'End',
        'Overrun by'       : 'Overrun by',
        Start              : 'Start'
    },

    Button : {
        'Add column'    : 'Add column',
        'Display hints' : 'Display hints',
        'Remove column' : 'Remove column',
        Apply           : 'Apply'
    },

    Checkbox : {
        'Auto apply'   : 'Auto apply',
        Automatically  : 'Automatically',
        CheckAutoHints : 'Check to automatically display hints when loading the example'
    },

    CodeEditor : {
        'Code editor'   : 'Code editor',
        'Download code' : 'Download code'
    },

    Indicators : {
        Indicators     : 'Indicators',
        lateDates      : 'Late start/end',
        constraintDate : 'Constraint'
    },

    Combo : {
        'Group by'      : 'Group by',
        'Select theme'  : 'Select theme',
        'Select locale' : 'Select locale',
        'Select size'   : 'Select size'
    },

    MenuItem : {
        'Custom header item' : 'Custom header item',
        'Custom cell action' : 'Custom cell action'
    },

    Shared : {
        'Full size'      : 'Full size',
        'Locale changed' : 'Locale changed',
        'Phone size'     : 'Phone size'
    },

    Slider : {
        'Font size' : 'Font size'
    },

    TaskTooltip : {
        'Scheduling Mode' : 'Scheduling Mode',
        Calendar          : 'Calendar',
        Critical          : 'Critical'
    },

    Tooltip : {
        'Click to show info and switch theme or locale' : 'Click to show info and switch theme or locale',
        'Click to show the built in code editor'        : 'Click to show the built in code editor',
        Fullscreen                                      : 'Fullscreen'
    }
};

LocaleHelper.publishLocale('En', En);
LocaleHelper.publishLocale('EnExamples', examplesLocale);

export default examplesLocale;
//</umd>

LocaleManager.extendLocale('En', examplesLocale);
