import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/Fi.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {
    });

export default locale;
//</umd>

LocaleManager.registerLocale('En', { desc : 'English', locale : locale });
