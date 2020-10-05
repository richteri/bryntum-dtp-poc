import DateHelper from '../helper/DateHelper.js';

/**
 * @module Core/data/Duration
 */

/**
 * Class which represents a duration object.
 * ```
 * {
 *    unit: String,
 *    magnitude: Number
 * }
 * ```
 */
export default class Duration {

    /**
     * Duration constructor.
     * @param {Number} magnitude Duration magnitude value
     * @param {String} unit Duration uni value
     */
    constructor(magnitude, unit) {
        if (typeof magnitude === 'number') {
            this._magnitude = magnitude;
            this._unit = unit;
        }
        else if (typeof magnitude === 'object') {
            Object.assign(this, magnitude);
        }
    }

    /**
     * Get/Set numeric magnitude `value`.
     * @property {Number}
     */
    get magnitude() {
        return this._magnitude;
    }

    set magnitude(value) {
        this._magnitude = (typeof value === 'number') && value;
    }

    /**
     * Get/Set duration unit to use with the current magnitude value.
     * Valid values are:
     * - "millisecond" - Milliseconds
     * - "second" - Seconds
     * - "minute" - Minutes
     * - "hour" - Hours
     * - "day" - Days
     * - "week" - Weeks
     * - "month" - Months
     * - "quarter" - Quarters
     * - "year"- Years
     *
     * @property {String}
     */
    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = DateHelper.parseTimeUnit(value);
    }

    get isValid() {
        return this._magnitude && this._unit;
    }

    /**
     * The `milliseconds` property is a read only property which returns the number of milliseconds in this Duration
     * @property {Number}
     * @readonly
     */
    get milliseconds() {
        return this.isValid ? DateHelper.asMilliseconds(this._magnitude, this._unit) : 0;
    }

    /**
     * Returns truthy value if this Duration equals to passed value
     * @param value
     * @return {Boolean}
     */
    isEqual(value) {
        return Boolean(value && this._magnitude === value.magnitude && this._unit === value.unit);
    }

    toString(useAbbreviation) {
        const
            me             = this,
            abbreviationFn = me.useAbbreviation ? 'getShortNameOfUnit' : 'getLocalizedNameOfUnit';
        return me.isValid ? `${me._magnitude} ${DateHelper[abbreviationFn](me._unit, me._magnitude !== 1)}` : '';
    }
};
