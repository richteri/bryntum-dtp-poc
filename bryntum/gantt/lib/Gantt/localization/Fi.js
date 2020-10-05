import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../SchedulerPro/localization/Fi.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

    });

export default locale;
//</umd>

LocaleManager.registerLocale('Fi', { desc : 'Soumi', locale : locale });
