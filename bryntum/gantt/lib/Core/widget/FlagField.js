import Checkbox from './Checkbox.js';
import BryntumWidgetAdapterRegister from '../adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module Core/widget/FlagField
 */

/**
 * DEPRECATED! Flag field is a checkbox which is driven by its boolean value and vice-versa.
 * When value is `true` then checkbox is checked, when it's `false` then checkbox
 * is unchecked.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * @deprecated
 */
export default class FlagField extends Checkbox {
    static get $name() {
        return 'FlagField';
    }

    static get type() {
        return 'flagfield';
    }

    static get defaultConfig() {
        return {
            value : ''
        };
    }

    get value() {
        return this.checked;
    }

    set value(v) {
        v = Boolean(v);
        super.value = v;

        if (!this.inputting) {
            this.checked = v;
        }
    }
}

BryntumWidgetAdapterRegister.register(FlagField.type, FlagField);
