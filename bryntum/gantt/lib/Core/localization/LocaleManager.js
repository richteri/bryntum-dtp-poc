import Base from '../Base.js';
import AjaxHelper from '../helper/AjaxHelper.js';
import Events from '../mixin/Events.js';
import VersionHelper from '../helper/VersionHelper.js';
import LocaleHelper from './LocaleHelper.js';

// No module tag here. That stops the singleton from being included by the docs.

/**
 * Singleton that handles switching locale. Locales can be included on page with `<script type="module">` tags or
 * loaded using ajax. When using script tags the first locale loaded is used per default, if another should be used as
 * default specify it on the script tag for the grid (see example below).
 *
 * ```
 * // Using Ecma 6 modules
 * &lt;script type="module" src="./Core/localization/SvSE.js"&gt;
 *
 * // Specify default when using scripts
 * &lt;script src="build/locales/grid.locale.SvSE.js"&gt;
 * &lt;script data-default-locale="En" src="build/grid-all.js"&gt;
 *
 * import LocaleManager from 'Core/localization/LocaleManager.js';
 * // Set locale using method
 * LocaleManager.applyLocale('SvSE');
 * // Or set locale using property
 * LocaleManager.locale = LocaleManager.locales.SvSE;
 * ```
 *
 * @demo Grid/localization
 * @singleton
 */
class LocaleManager extends Events(Base) {

    static get defaultConfig() {
        return {
            locales              : {},
            // Enable strict locale checking by default for tests
            throwOnMissingLocale : VersionHelper.isTestEnv
        };
    }

    construct(...args) {
        const
            me = this;

        super.construct(...args);

        const
            scriptTag = document.querySelector('script[data-default-locale]');
        if (scriptTag) {
            me.defaultLocaleName = scriptTag.dataset.defaultLocale;
        }

        if (window.bryntum && window.bryntum.locales) {
            Object.keys(window.bryntum.locales).forEach(localeName => {
                // keeping this check in case some client tries to use an old locale
                if (!localeName.startsWith('moment')) {
                    const
                        locale = window.bryntum.locales[localeName];
                    if (locale.extends) {
                        me.extendLocale(locale.extends, locale);
                    }
                    else if (locale.localeName) {
                        me.registerLocale(locale.localeName, { desc : locale.localeDesc, locale : locale });
                    }
                }
            });

            if (!me.locale) {
                // English locale is built in, no need to apply it here since it will be applied anyway
                if (me.defaultLocaleName !== 'En') {
                    // No locale applied, use default or first found
                    me.applyLocale(me.defaultLocaleName || Object.keys(me.locales)[0]);
                }
            }
        }
    }

    set locales(localeConfigs) {
        this._locales = localeConfigs;
    }

    /**
     * Get currently registered locales.
     * Returns an object with locale names (`localeName`) as properties.
     *
     * Example:
     * ```
     * const englishLocale = LocaleManager.locales.En;
     * ```
     *
     * this returns registered English locale object.
     * ```
     * {
     *   "desc": "English",
     *   "locale": {
     *     "localeName": "En",
     *     "localeDesc": "English",
     *
     *     ... (localization goes here)
     *
     *   }
     * }
     * ```
     * @readonly
     * @property {Object}
     */
    get locales() {
        return this._locales;
    }

    /**
     * Get/set currently used locale. Set a name of a locale to have it applied, or give a locale configuration to
     * have it registered and then applied
     * @property {String|Object}
     */
    set locale(locale) {
        if (typeof locale === 'string') {
            this.applyLocale(locale);
        }
        else {
            if (!locale.locale) {
                locale = {
                    locale,
                    localeName : locale.localeName || 'custom'
                };
            }

            this.registerLocale(locale.localeName, locale);
            this.applyLocale(locale.localeName);
        }
    }

    get locale() {
        return this._locale;
    }

    /**
     * Register a locale to make it available for applying.
     * Registered locales are available in {@link Core.localization.LocaleManager#property-locales-static}.
     * @param {String} name Name of locale (for example `En` or `SvSE`)
     * @param {Object} config Object with localized properties
     */
    registerLocale(name, config) {
        const
            me        = this,
            isDefault = me.defaultLocaleName === name,
            isCurrent = me.locale && me.locale.localeName === name,
            isFirst   = Object.keys(me.locales).length === 0;

        // Avoid registering the same locale twice and merge configs
        if (!me.locales[name]) {
            me.locales[name] = config;
        }
        else {
            me.locales[name].locale = LocaleHelper.mergeLocales(me.locales[name].locale, config.locale);
        }

        // if no default locale specified, use the first one. otherwise apply the default when it is registered
        // also reapply if current locale is registered again (first grid, then scheduler etc).
        if (isDefault || (!me.defaultLocaleName && (isFirst || isCurrent))) {
            me.internalApplyLocale(me.locales[name]);
        }
    }

    /**
     * Extend an already loaded locale to add additional translations.
     * @param {String} name Name of locale (for example `En` or `SvSE`)
     * @param {Object} config Object with localized properties
     */
    extendLocale(name, config) {
        const
            locale = this.locales[name];
        if (!locale) {
            return false;
        }
        locale.locale = LocaleHelper.mergeLocales(locale.locale, config);
        delete locale.locale.extends;

        // If current loaded locale is the same then apply to reflect changes
        if (this.locale?.localeName === name) {
            this.applyLocale(name);
        }
        return true;
    }

    internalApplyLocale(localeConfig) {
        this._locale = localeConfig.locale;
        this.trigger('locale', localeConfig);
    }

    /**
     * Apply a locale. Locale must be defined in {@link Core.localization.LocaleManager#property-locales-static}.
     * If it is not loaded it will be loaded using AjaxHelper {@link Core.helper.AjaxHelper#function-get-static} request and then applied.
     * @param {String} name Name of locale to apply (for example `En` or `SvSE`)
     * @returns {boolean|Promise}
     */
    applyLocale(name, forceApply = false, ignoreError = false) {
        const
            me           = this,
            localeConfig = me.locales[name];

        if (localeConfig && localeConfig.locale && me._locale === localeConfig.locale && !forceApply) {
            // no need to apply same locale again
            return true;
        }

        // ignoreError is used in examples where one example might have defined a locale not available in another

        if (!localeConfig) {
            if (ignoreError) return true;

            throw new Error(`Locale ${name} not registered`);
        }

        function internalApply() {
            me.internalApplyLocale(localeConfig);
        }

        if (!localeConfig.locale) {
            return new Promise((resolve, reject) => {
                me.loadLocale(localeConfig.path).then(response => {
                    response.text().then(text => {
                        const
                            // eslint-disable-next-line no-new-func
                            parseLocale = new Function(text);
                        parseLocale();

                        localeConfig.locale = window.bryntum.locales[name];
                        internalApply();
                        resolve(localeConfig);
                    });
                }).catch(response => reject(response));
            });
        }

        internalApply();
        return true;
    }

    /**
     * Loads a locale using AjaxHelper {@link Core.helper.AjaxHelper#function-get-static} request.
     * @private
     * @param {String} path Path to locale file
     * @returns {Promise}
     */
    loadLocale(path) {
        return AjaxHelper.get(path);
    }

    /**
     * Specifies if {@link Core.localization.Localizable#function-L-static Localizable.L()} function would throw error if no localization found in runtime
     * @property {Boolean}
     * @default false
     */
    set throwOnMissingLocale(value) {
        this._throwOnMissingLocale = value;
    }

    get throwOnMissingLocale() {
        return this._throwOnMissingLocale;
    }

}

const
    LocaleManagerSingleton = new LocaleManager();

export default LocaleManagerSingleton;
