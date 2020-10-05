import Combo from '../../Core/widget/Combo.js';
import Store from '../../Core/data/Store.js';
import { SchedulingMode } from '../../Engine/scheduling/Types.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module SchedulerPro/widget/SchedulingModePicker
 */

/**
 * Combo box preconfigured with possible scheduling mode values.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `SchedulingModeColumn`.
 *
 * @extends Core/widget/Combo
 */
export default class SchedulingModePicker extends Combo {

    static get $name() {
        return 'SchedulingModePicker';
    }

    static get type() {
        return 'schedulingmodecombo';
    }

    buildStoreData() {
        return [
            {
                id   : SchedulingMode.Normal,
                text : this.L('L{Normal}')
            }, {
                id   : SchedulingMode.FixedDuration,
                text : this.L('L{Fixed Duration}')
            }, {
                id   : SchedulingMode.FixedUnits,
                text : this.L('L{Fixed Units}')
            }, {
                id   : SchedulingMode.FixedEffort,
                text : this.L('L{Fixed Effort}')
            }
        ];
    }

    get store() {
        if (!this._store) {
            this.store = new Store({
                data : this.buildStoreData()
            });
        }

        return this._store;
    }

    set store(store) {
        super.store = store;
    }

    updateLocalization() {
        super.updateLocalization();
        // rebuild newly translated options
        this.store.data = this.buildStoreData();
    }
}

BryntumWidgetAdapterRegister.register(SchedulingModePicker.type, SchedulingModePicker);
