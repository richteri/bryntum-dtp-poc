import ColumnStore from '../../Grid/data/ColumnStore.js';
import NumberColumn from '../../Grid/column/NumberColumn.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import '../../Core/widget/DurationField.js';
import { TimeUnit } from '../../Engine/scheduling/Types.js';

/**
 * @module SchedulerPro/column/DurationColumn
 */

/**
 * A column showing the task {@link Scheduler/model/TimeSpan#property-fullDuration duration}. Please note, this column
 * is preconfigured and expects its field to be of the {@link Core.data.Duration} type.
 *
 * The default editor is a {@link Core.widget.DurationField DurationField}. It parses time units,
 * so you can enter "4d" indicating 4 days duration, or "4h" indicating 4 hours, etc.
 *
 * @extends Grid/column/NumberColumn
 * @classType duration
 */
export default class DurationColumn extends NumberColumn {
    static get type() {
        return 'duration';
    }

    static get isGanttColumn() {
        return true;
    }

    get durationUnitField() {
        return `${this.field}Unit`;
    }

    //region Config

    static get fields() {
        return [
            /**
             * Precision of displayed duration, defaults to use {@link SchedulerPro.view.ProScheduler#config-durationDisplayPrecision}.
             * Specify a integer value to override that setting, or `false` to use raw value
             * @config {Number|Boolean} decimalPrecision
             */
            { name : 'decimalPrecision', defaultValue : null }
        ];
    }

    static get defaults() {
        return {
            field         : 'fullDuration',
            text          : 'L{Duration}',
            min           : 0,
            step          : 1,
            instantUpdate : true,

            sortable : (task1, task2) => {
                const
                    ms1 = task1.isScheduled ? task1.calendar.calculateDuration(task1.startDate, task1.endDate, TimeUnit.Millisecond) : 0,
                    ms2 = task2.isScheduled ? task2.calendar.calculateDuration(task2.startDate, task2.endDate, TimeUnit.Millisecond) : 0;

                return ms1 === ms2 ? 0 : (ms1 < ms2 ? -1 : 1);
            }
        };
    }

    //endregion

    defaultRenderer({ record, isExport }) {
        const
            value         = record[this.field],
            type          = typeof value,
            durationValue = type === 'number' ? value : value && value.magnitude;

        // in case of bad input (for instance NaN, undefined or null value)
        if (typeof durationValue !== 'number') {
            return isExport ? '' : null;
        }

        switch (type) {
            // We're using eg 'lag' or 'duration' which is the magnitude part
            case 'number':
                return this.round(durationValue) + ' ' + DateHelper.getLocalizedNameOfUnit(record[this.durationUnitField], value !== 1);
            // We're using eg 'fullLag' or 'fullDuration' which is the two part encapsulated value
            case 'object':
                return this.round(durationValue) + ' ' + DateHelper.getLocalizedNameOfUnit(value.unit, value.magnitude !== 1);
        }
    }

    round(value) {
        let { decimalPrecision } = this;

        if (decimalPrecision === false) {
            return value;
        }

        if (decimalPrecision == null) {
            decimalPrecision = this.grid.durationDisplayPrecision || 1;
        }

        // Prefer this way over toFixed() to not display "unused" decimal places
        const multiplier = Math.pow(10, decimalPrecision);

        return Math.round(value * multiplier) / multiplier;
    }

    get defaultEditor() {
        return {
            type : 'duration',
            name : this.field
        };
    }

    // Can only edit leafs
    canEdit(record) {
        return record.isLeaf;
    }
}

ColumnStore.registerColumnType(DurationColumn);
