/**
 * @module Core/helper/VersionHelper
 */

let isSiesta = false;

try {
    isSiesta = Boolean(window !== window.parent && window.parent.Siesta);
}
catch (e) {

}

/**
 * Helper for version handling
 * @private
 * @example
 *
 * VersionHelper.setVersion('grid', '1.5');
 *
 * if (VersionHelper.getVersion('grid').isNewerThan('1.0')) {
 *   ...
 * }
 */
export default class VersionHelper {
    /**
     * Set version for specified product
     * @private
     * @param {String} product
     * @param {String} version
     */
    static setVersion(product, version) {
        product = product.toLowerCase();

        this[product] = {
            version,
            isNewerThan(otherVersion) {
                return otherVersion < version;
            },
            isOlderThan(otherVersion) {
                return otherVersion > version;
            }
        };

        let bundleFor = '';

        // Var productName is only defined in bundles, it is internal to bundle so not available on window. Used to
        // tell importing combinations of grid/scheduler/gantt bundles apart from loading same bundle twice
        // eslint-disable-next-line no-undef
        if (typeof productName !== 'undefined') {
            // eslint-disable-next-line no-undef
            bundleFor = productName;
        }

        // Set "global" flag to detect bundle being loaded twice
        const globalKey = `${bundleFor}.${product}${version.replace(/\./g, '-')}`;

        if (window.bryntum[globalKey] === true) {
            if (isSiesta) {
                window.BUNDLE_EXCEPTION = true;
            }
            else {
                throw new Error('Bundle included twice, check cache-busters and file types (.js)');
            }
        }
        else {
            window.bryntum[globalKey] = true;
        }
    }

    /**
     * Get (previously set) version for specified product
     * @private
     * @param {String} product
     */
    static getVersion(product) {
        product = product.toLowerCase();

        if (!this[product])  {
            throw new Error('No version specified');
        }

        return this[product].version;
    }

    /**
     * Checks the passed product against the passed version using the passed test.
     * @param {String} product The name of the product to test the version of
     * @param {String} version The version to test against
     * @param {String} test The test operator, `<=`, `<`, `=`, `>` or `>=`.
     * @param {String} [message] A warning message to log if the test is found to be true.
     * @returns {Boolean} `true` if the test passes.
     * @internal
     */
    static checkVersion(product, version, test, message) {
        const productVersion = this.getVersion(product);

        let result;

        switch (test) {
            case '<':
                result = productVersion < version;
                break;
            case '<=':
                result = productVersion <= version;
                break;
            case '=':
                result = productVersion === version;
                break;
            case '>=':
                result = productVersion >= version;
                break;
            case '>':
                result = productVersion > version;
                break;
        }

        return result;
    }

    /**
     * Based on a comparison of current product version and the passed version this method either outputs a console.warn or throws an error
     * @param {String} product The name of the product
     * @param {String} invalidAsOfVersion The version where the offending code is invalid (when any compatibility layer is actually removed)
     * @param {String} message Required! A helpful warning message to show to the developer using a deprecated API.
     * @internal
     */
    static deprecate(product, invalidAsOfVersion, message) {
        const justWarn = this.checkVersion(product, invalidAsOfVersion, '<', message);

        //<debug>
        if (!invalidAsOfVersion.endsWith('.0.0')) {
            throw new Error('May only break APIs in major releases');
        }
        if (!message) {
            throw new Error('Must provide helpful message for developers');
        }
        //</debug>

        if (justWarn) {
            // During the grace period (until the next major release following the deprecated code), just show a console warning
            console.warn(`Deprecation warning: You are using a deprecated API which will change in v${invalidAsOfVersion}. ${message}`);
        }
        else {
            throw new Error(`Deprecated API use. ${message}`);
        }
    }

    static get isTestEnv() {
        return isSiesta;
    }
}

(window.bryntum || (window.bryntum = {})).getVersion = VersionHelper.getVersion.bind(VersionHelper);
window.bryntum.checkVersion = VersionHelper.checkVersion.bind(VersionHelper);
window.bryntum.deprecate = VersionHelper.deprecate.bind(VersionHelper);
