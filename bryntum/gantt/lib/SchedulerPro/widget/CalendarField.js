import ModelCombo from './ModelCombo.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module SchedulerPro/widget/CalendarField
 */

/**
 * Event calendar selector combo.
 */
export default class CalendarField extends ModelCombo {

    static get $name() {
        return 'CalendarField';
    }

    static get type() {
        return 'calendarfield';
    }

    static get defaultConfig() {
        return {
            valueField   : 'id',
            displayField : 'name',
            editable     : false,

            listItemTpl : c => {
                return c && c.name ? c.name : this.L('L{Default calendar}');
            },

            displayValueRenderer : c => {
                return c ? c.name : this.L('L{Default calendar}');
            }
        };
    }

    get value() {
        return super.value;
    }

    set value(v) {
        if (v && v.isDefault && v.isDefault()) {
            v = null;
        }
        super.value = v;
    }
}

BryntumWidgetAdapterRegister.register(CalendarField.type, CalendarField);
