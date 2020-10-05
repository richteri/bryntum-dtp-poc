/**
 * @module Core/localization/LocaleHelper
 */

/**
 * Provides locale management methods.
 */
export default class LocaleHelper {

    /**
     * Merges all properties of provided locales into new locale.
     * Locales are merged in order they provided and locales wich go later replace same properties of previous locales.
     * @param {...Object} locales Locales to merge
     * @return {Object} Merged locale
     */
    static mergeLocales(...locales) {
        const
            result = {};
        locales.forEach(locale => {
            Object.keys(locale).forEach(key => {
                if (typeof locale[key] === 'object') {
                    result[key] = { ...result[key], ...locale[key] };
                }
                else {
                    result[key] = locale[key];
                }
            });
        });

        return result;
    }

    /**
     * Removes all properties from `locale` that are present in the provided `trimLocale`.
     * @param {Object} locale locales to merge
     * @param {Object} trimLocale locales to merge
     */
    static trimLocale(locale, trimLocale) {
        const
            remove = (key, subKey) => {
                if (!locale[key]) {
                    throw new Error(`Key "${key}" doesn't exist in locale`);
                }
                if (subKey) {
                    if (!locale[key][subKey]) {
                        throw new Error(`SubKey "${key}.${subKey}" doesn't exist in locale`);
                    }
                    delete locale[key][subKey];
                }
                else {
                    delete locale[key];
                }
            };

        Object.keys(trimLocale).forEach(key => {
            if (Array.isArray(trimLocale[key])) {
                trimLocale[key].forEach(subKey => remove(key, subKey));
            }
            else {
                remove(key);
            }
        });
    }

    /**
     * Put the locale under `window.bryntum.locales` to make sure it can be discovered automatically
     * @param {String} localeName Locale name
     * @param {Object} config Locale config
     */
    static publishLocale(localeName, config) {
        const
            bryntum = window.bryntum = window.bryntum || {},
            locales = bryntum.locales = bryntum.locales || {};
        // Avoid registering locales twice
        locales[localeName] = !locales[localeName] ? config : this.mergeLocales(locales[localeName], config);
    }

}
