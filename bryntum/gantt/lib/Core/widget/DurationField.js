import TextField from './TextField.js';
import DateHelper from '../helper/DateHelper.js';
import BryntumWidgetAdapterRegister from '../adapter/widget/util/BryntumWidgetAdapterRegister.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import Duration from '../data/Duration.js';

/**
 * @module Core/widget/DurationField
 */

/**
 * A specialized field allowing a user to also specify duration unit when editing the duration value.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `DurationColumn`.
 *
 * @extends Core/widget/TextField
 *
 * @classType durationfield
 */
export default class DurationField extends TextField {
    static get $name() {
        return 'DurationField';
    }

    static get defaultConfig() {
        return {
            /**
             * The `value` config may be set in Object form specifying two properties,
             * `magnitude`, a Number, and `unit`, a String.
             *
             * If a String is passed, it is parsed in accordance with current locale rules.
             * The string is taken to be the numeric magnitude, followed by whitespace, then an abbreviation, or name of the unit.
             * @config {Object|String}
             */
            value : null,

            /**
             * Step size for spin button clicks.
             * @config {Number}
             * @default
             */
            step : 1,

            /**
             * The duration unit to use with the current magnitude value.
             * @config {String}
             */
            unit : null,

            defaultUnit : 'day',

            /**
             * The duration magnitude to use with the current unit value.
             * @config {Number}
             */
            magnitude : null,

            /**
             * When set to `true` the field will use short names of unit durations
             * (as returned by {@link Core.helper.DateHelper#function-getShortNameOfUnit-static}) when creating the
             * input field's display value.
             * @config {Boolean}
             */
            useAbbreviation : false,

            /**
             * Set to `true` to allow negative duration
             * @config {Boolean}
             */
            allowNegative : false,

            /**
             * The number of decimal places to allow. Defaults to no constraint.
             * @config {Number}
             * @default
             */
            decimalPrecision : null,

            triggers : {
                spin : {
                    type : 'spintrigger'
                }
            }
        };
    }

    get inputValue() {
        // Do not use the _value property. If called during configuration, this
        // will import the configured value from the config object.
        return this.value == null ? '' : this.value.toString(this.useAbbreviation);
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
    set unit(unit) {
        this._unit = unit;
        super.value = this.calcValue();
    }

    get unit() {
        return this._unit;
    }

    /**
     * Get/Set numeric magnitude `value` to use with the current unit value.
     * @property {Number}
     */
    set magnitude(magnitude) {
        this._magnitude = this.roundMagnitude(magnitude);
        super.value = this.calcValue();
    }

    get magnitude() {
        return this._magnitude;
    }

    roundMagnitude(value) {
        return value && this.decimalPrecision != null ? ObjectHelper.round(value, this.decimalPrecision) : value;
    }

    get allowDecimals() {
        return this.decimalPrecision !== 0;
    }

    get isValid() {
        const
            me      = this,
            isEmpty = me.value == null || (me.value && me.value.magnitude == null);

        return super.isValid && ((isEmpty && !me.required) || !isEmpty && (me.allowNegative || me.value.magnitude >= 0));
    }

    internalOnChange(event) {
        const
            me     = this,
            value  = me.value,
            oldVal = me._lastValue;

        if (me.hasChanged(oldVal, value)) {
            me._lastValue = value;
            me.trigger('change', { value, event, userAction : true, valid : me.isValid });
        }
    }

    onFocusOut(e) {
        this.syncInputFieldValue(true);

        return super.onFocusOut(e);
    }

    /**
     * The `value` property may be set in Object form specifying two properties,
     * `magnitude`, a Number, and `unit`, a String.
     *
     * If a Number is passed, the field's current unit is used and just the magnitude is changed.
     *
     * If a String is passed, it is parsed in accordance with current locale rules.
     * The string is taken to be the numeric magnitude, followed by whitespace, then an abbreviation, or name of the unit.
     *
     * Upon read, the value is always returned in object form containing `magnitude` and `unit`.
     * @property {String|Number|Object|Duration}
     */
    set value(value) {
        const
            me = this;
        let newMagnitude, newUnit;

        if (typeof value === 'number') {
            // A number means preserving existing unit value
            newMagnitude = me.roundMagnitude(value);
            newUnit = me._unit;
        }
        else if (typeof value === 'string') {
            // Parse as a string
            const
                parsedDuration = DateHelper.parseDuration(value, me.allowDecimals, me._unit || DurationField.defaultConfig.defaultUnit);
            if (parsedDuration) {
                newUnit = parsedDuration.unit;
                newMagnitude = me.roundMagnitude(parsedDuration.magnitude);
            }
        }
        else {
            // Using value object with unit and magnitude
            if (value && 'unit' in value && 'magnitude' in value) {
                newUnit = value.unit;
                newMagnitude = me.roundMagnitude(value.magnitude);
            }
            else {
                newUnit = null;
                newMagnitude = null;
            }
        }

        if (me._magnitude !== newMagnitude || me._unit !== newUnit) {
            me._magnitude = newMagnitude;
            me._unit = newUnit;
            super.value = me.calcValue();
        }
    }

    get value() {
        return super.value;
    }

    calcValue() {
        const
            me = this;

        if ((!me._unit || !me._magnitude) && me.clearable) {
            return null;
        }
        else {
            return new Duration(me._magnitude, me._unit || DurationField.defaultConfig.defaultUnit);
        }
    }

    hasChanged(oldValue, newValue) {
        return newValue && !oldValue ||
            !newValue && oldValue ||
            newValue && oldValue && !oldValue.isEqual(newValue);
    }

    /**
     * The `milliseconds` property is a read only property which returns the
     * number of milliseconds in this field's value
     * @property {Number}
     */
    get milliseconds() {
        return this.value ? this.value.milliseconds : 0;
    }

    onInternalKeyDown(keyEvent) {
        if (keyEvent.key === 'ArrowUp') {
            this.doSpinUp();
        }
        else if (keyEvent.key === 'ArrowDown') {
            this.doSpinDown();
        }
    }

    doSpinUp() {
        const
            me = this;
        me._isUserAction = true;
        me.magnitude = (me.magnitude || 0) + me.step;
        me._isUserAction = false;
    }

    doSpinDown() {
        const
            me = this;
        if (me.allowNegative || (me.magnitude || 0) > 0) {
            me._isUserAction = true;
            me.magnitude = (me.magnitude || 0) - me.step;
            me._isUserAction = false;
        }
    }
}

BryntumWidgetAdapterRegister.register('durationfield', DurationField);
BryntumWidgetAdapterRegister.register('duration', DurationField);
