import Combo from '../../Core/widget/Combo.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';

/**
 * @module Gantt/widget/DependencyTypePicker
 */

const buildItems = (items) => items.map((item, index) => [index, item]);

/**
 * Selects a Dependency linkage type between two tasks.
 *
 * @extends Core/widget/Combo
 *
 * @classType dependencytypepicker
 */
export default class DependencyTypePicker extends Combo {

    static get $name() {
        return 'DependencyTypePicker';
    }

    static get type() {
        return 'dependencytypepicker';
    }

    construct(config) {
        super.construct(config);

        // Update when changing locale
        LocaleManager.on({
            locale : () => {
                this.items = buildItems(this.L('L{SchedulerProCommon.dependencyTypesLong}'));
            },
            thisObj : this
        });
    }

    get store() {
        if (!this._items) {
            this.items = this._items = buildItems(this.L('L{SchedulerProCommon.dependencyTypesLong}'));
        }

        return super.store;
    }

    set store(store) {
        super.store = store;
    }
}

BryntumWidgetAdapterRegister.register(DependencyTypePicker.type, DependencyTypePicker);
