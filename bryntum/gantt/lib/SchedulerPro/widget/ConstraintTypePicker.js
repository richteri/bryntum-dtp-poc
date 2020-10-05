import Combo from '../../Core/widget/Combo.js';
import Store from '../../Core/data/Store.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module SchedulerPro/widget/ConstraintTypePicker
 */

/**
 * Combo box preconfigured with possible scheduling mode values. This picker doesn't support {@link Core/widget/Combo#config-multiSelect multiSelect}.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `ConstraintTypeColumn`.
 *
 * @extends Core/widget/Combo
 */
export default class ConstraintTypePicker extends Combo {

    static get $name() {
        return 'ConstraintTypePicker';
    }

    static get type() {
        return 'constrainttypepicker';
    }

    updateLocalization() {
        super.updateLocalization();
        // rebuild newly translated options
        this.store.data = this.buildStoreData();
    }

    buildStoreData() {
        const me = this;

        // 'id' is wrapped in single quotes to prevent the linter from throwing "hardcoded id" error
        return [
            {
                id   : 'none',
                text : me.L('L{none}')
            },
            {
                id   : 'muststarton',
                text : me.L('L{muststarton}')
            },
            {
                id   : 'mustfinishon',
                text : me.L('L{mustfinishon}')
            },
            {
                id   : 'startnoearlierthan',
                text : me.L('L{startnoearlierthan}')
            },
            {
                id   : 'startnolaterthan',
                text : me.L('L{startnolaterthan}')
            },
            {
                id   : 'finishnoearlierthan',
                text : me.L('L{finishnoearlierthan}')
            },
            {
                id   : 'finishnolaterthan',
                text : me.L('L{finishnolaterthan}')
            }
        ];
    }

    set value(value) {
        super.value = value;
    }

    get value() {
        const value = super.value;

        return value === 'none' ? null : value;
    }

    get store() {
        if (!this._store) {
            this.store = new Store({
                data        : this.buildStoreData(),
                allowNullId : true
            });
        }

        return this._store;
    }

    set store(store) {
        super.store = store;
    }
}

BryntumWidgetAdapterRegister.register(ConstraintTypePicker.type, ConstraintTypePicker);
