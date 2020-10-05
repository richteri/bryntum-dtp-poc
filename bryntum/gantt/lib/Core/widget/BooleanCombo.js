import Combo from './Combo.js';
import Store from '../data/Store.js';
import Localizable from '../../Core/localization/Localizable.js';
import BryntumWidgetAdapterRegister from '../adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * Boolean combo, a combo box with two options corresponding to true or false.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 *
 * @classType booleancombo
 * @extends Core/widget/Combo
 */
export default class BooleanCombo extends Localizable(Combo) {
    static get $name() {
        return 'BooleanCombo';
    }

    static get type() {
        return 'booleancombo';
    }

    //region Config
    static get defaultConfig() {
        return {
            /**
             * Positive option value
             *
             * @config {*}
             */
            positiveValue : true,
            /**
             * Positive option display value
             *
             * @config {String}
             */
            positiveText  : null,
            /**
             * Negative option value
             *
             * @config {*}
             */
            negativeValue : false,
            /**
             * False option display value
             *
             * @config {String}
             */
            negativeText  : null,
            /**
             * Default value
             *
             * @config {*}
             */
            value         : false
        };
    }
    //endregion

    get store() {
        const me = this;
        if (!me._store) {
            me.store = new Store({
                data : [{
                    id   : me.positiveValue,
                    text : me.positiveText || me.L('L{Object.Yes}')
                }, {
                    id   : me.negativeValue,
                    text : me.negativeText || me.L('L{Object.No}')
                }]
            });
        }

        return me._store;
    }

    set store(store) {
        super.store = store;
    }
}

BryntumWidgetAdapterRegister.register(BooleanCombo.type, BooleanCombo);
