import Base from '../Base.js';
import LocaleManager from './LocaleManager.js';

/**
 * @module Core/localization/Localizable
 */

const
    ObjectProto = Object.getPrototypeOf(Object),
    localeRe    = /L{.*?}/g,
    escape      = (txt) => txt.replace(/{(\d+)}/gm, '[[$1]]'),
    unescape    = (txt) => txt.replace(/\[\[(\d+)]]/gm, '{$1}');

/**
 * Mixin that simplifies localization of strings in a class.
 *
 * ```
 * // Get localized string
 * grid.L('foo');
 * grid.L('L{foo});
 * ```
 *
 * @mixin
 */
export default Target => class Localizable extends (Target || Base) {
    static get defaultConfig() {
        return {
            localeClass           : null,
            localizableProperties : []
        };
    }

    static clsName(cls) {
        return typeof cls === 'string' ? cls : cls === ObjectProto ? 'Object' : cls.$name || cls.name || cls.prototype?.$name || cls.prototype?.name;
    }

    static parseLocaleString(text) {
        const matches = [];
        let m;

        // Parse locale text in case it's wrapped with L{foo}
        if (text?.includes('L{')) {
            const re = /L{(.*?)}/g;

            // Escape fix for {1}, {2} etc. in locale str
            text = escape(text);

            while ((m = re.exec(text)) != null) {
                // Support for parsing class namespace L{Class.foo}
                const classMatch = /((.*?)\.)?(.+)/g.exec(m[1]);
                matches.push({
                    match       : unescape(m[0]),
                    localeKey   : unescape(classMatch[3]),
                    localeClass : classMatch[2]
                });
            }
        }

        return matches.length > 0 ? matches : [{
            match     : text,
            localeKey : text
        }];
    }

    construct(config = {}, ...args) {
        const me = this;

        // Base class applies configs.
        super.construct(config, ...args);

        LocaleManager.on('locale', me.updateLocalization, me);

        me.updateLocalization();
    }

    get localeClass() {
        return this._localeClass || null;
    }

    set localeClass(key) {
        this._localeClass = key;
    }

    localizeProperty(name) {
        const me = this;

        // need to translate string properties only
        if (typeof me[name] === 'string') {

            me.originalLocales = me.originalLocales || {};

            // Need to save original values since they will be overridden by localizable equivalents
            me.originalLocales[name] = me.originalLocales[name] || me[name];

            const text = me.originalLocales[name];

            // Doing localization from the original values
            if (text) {
                me[name] = me.L(text);
            }
        }
    }

    updateLocalization() {
        const me = this;
        me.localizableProperties && me.localizableProperties.forEach(me.localizeProperty, me);
    }

    static getTranslation(text, templateData, targetCls) {
        const { locale } = LocaleManager;

        let result = null,
            clsName,
            cls;

        if (locale) {

            // Iterate over all found localization entries
            for (const match of this.parseLocaleString(text)) {
                const translate = (name) => {
                    const translation = locale[name]?.[match.localeKey];
                    if (translation) {
                        if (typeof translation === 'function') {
                            result = templateData != null ? translation(templateData) : translation;
                        }
                        else if (typeof translation === 'object' || text === match.match) {
                            result = translation;
                        }
                        else {
                            result = (result || text).replace(match.match, translation);
                        }
                    }
                    return translation;
                };

                // Translate order
                // 1. Try to translate for current class
                // 2. Try to translate by Class hierarchy traversing prototypes
                // 3. Try to translate if Class is in {Class.foo} format
                let success = false;
                for (cls = targetCls; cls && (clsName = Localizable.clsName(cls)); cls = Object.getPrototypeOf(cls)) {
                    if ((success = translate(clsName))) {
                        break;
                    }
                    else if (typeof cls === 'string') {
                        break;
                    }
                }
                if (!success && match.localeClass) {
                    translate(match.localeClass);
                }
            }
        }

        return result;
    }

    /**
     * Builds `localizableProperties` config value for the class instance by iterating
     * though the class ancestor classes and concatenating their `localizableProperties` values.
     * @param {Object} config The class instance configuration object.
     * @private
     */
    buildLocalizableProperties(config) {
        const localizableProperties = [];

        if (config.localizableProperties) {
            localizableProperties.push(...config.localizableProperties);
        }

        // collect localizable properties defined on subclasses
        for (let cls = this.constructor.superclass; cls && cls !== Base; cls = cls.superclass) {
            const superConfigDefaultConfig = cls.getConfigDescriptor(true).defaultConfig;
            if (superConfigDefaultConfig && superConfigDefaultConfig.localizableProperties) {
                localizableProperties.push(
                    ...(superConfigDefaultConfig.localizableProperties.filter(i => localizableProperties.indexOf(i) < 0))
                );
            }
        }

        return localizableProperties;
    }

    startConfigure(config) {
        config.localizableProperties = this.buildLocalizableProperties(config);

        super.startConfigure(config);
    }

    /**
     * Get localized string, returns `null` if no localized string found.
     * @param {String} text String key
     * @param {Object} [templateData] Data to supply to template if localized string is a function
     * @returns {String}
     * @internal
     */
    static localize(text, templateData = undefined, ...localeClasses) {
        // In case this static method is called directly third argument is not provided
        // just fallback to searching locales for the class itself
        if (localeClasses?.length === 0) {
            localeClasses = [this];
        }
        let translation = null;
        localeClasses.some(cls => {
            translation = Localizable.getTranslation(text, templateData, cls);
            return translation != null;
        });
        return translation;
    }

    /**
     * Get localized string, returns value of `text` if no localized string found.
     * If {@link Core.localization.LocaleManager#property-throwOnMissingLocale-static LocaleManager.throwOnMissingLocale} is `true`
     * and localization text is in `L{foo}` format then call to `L('L{foo})` will throw
     * `Localization is not found for 'text' in 'ClassName'` exception when no localization is found.
     * @param {String} text String key
     * @param {Object} [templateData] Data to supply to template if localized string is a function
     * @returns {String}
     */
    static L(text, templateData = undefined, ...localeClasses) {
        // In case this static method is called directly third argument is not provided
        // just fallback to searching locales for the class itself
        if (localeClasses?.length === 0) {
            localeClasses = [this];
        }
        const translation = this.localize(text, templateData, ...localeClasses);

        // Throw error if not localized anв text matches `L{foo}`
        if (LocaleManager.throwOnMissingLocale && LocaleManager.locale && translation == null && localeRe.test(text)) {
            throw new Error(`Localization is not found for '${text}' in '${localeClasses.map(cls => Localizable.clsName(cls)).join(', ')}'. ${LocaleManager.locale.localeName ? `Locale : ${LocaleManager.locale.localeName}` : ''}`);
        }

        return translation ?? text;
    }

    /**
     * Convenience function that can be called directly on the class that mixes Localizable in
     * @param {String} text String key
     * @param {Object} [templateData] Data to supply to template if localized string is a function
     * @returns {String}
     * @category Misc
     * @example
     * button.text = grid.L('group');
     */
    L(text, templateData = undefined) {
        const me = this;
        // If we have a different class set as translations provider
        // pass it first and use the class being translated as a fallback provider
        if (me.localeClass && Localizable.clsName(me.localeClass) !== Localizable.clsName(me.constructor)) {
            return Localizable.L(text, templateData, me.localeClass, me.constructor);
        }
        else {
            return Localizable.L(text, templateData, me.constructor);
        }
    }

    /**
     * Get the global LocaleManager
     * @returns {Core.localization.LocaleManager}
     * @category Misc
     */
    get localeManager() {
        return LocaleManager;
    }
};
