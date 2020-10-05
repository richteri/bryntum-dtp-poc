import Combo from '../../Core/widget/Combo.js';
import Store from '../../Core/data/Store.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module Gantt/widget/CalendarPicker
 */

/**
 * Combo box preconfigured with possible calendar values. This picker doesn't support {@link Core/widget/Combo#config-multiSelect multiSelect}
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Gantt.column.CalendarColumn CalendarColumn}.
 *
 * @extends Core/widget/Combo
 */
export default class CalendarPicker extends Combo {

    static get $name() {
        return 'CalendarPicker';
    }

    static get type() {
        return 'calendarpicker';
    }

    /**
     * Replaces the field store records with the provided ones.
     * @param {Scheduler.data.Calendar[]} calendars New contents for the widget store.
     */
    refreshCalendars(calendars) {
        this.store.data = calendars.map(c => {
            return {
                id   : c.id,
                text : c.name
            };
        });
    }

    get store() {
        if (!this._store) {
            this.store = new Store();
        }

        return this._store;
    }

    set store(store) {
        super.store = store;
    }

    get value() {
        return super.value;
    }

    set value(value) {
        if (value) {
            if (value.isDefault && value.isDefault()) {
                value = null;
            }
            else if (value.id) {
                value = value.id;
            }
        }

        super.value = value;
    }
}

BryntumWidgetAdapterRegister.register(CalendarPicker.type, CalendarPicker);
