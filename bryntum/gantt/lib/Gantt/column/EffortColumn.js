import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from './DurationColumn.js';
import EffortField from '../widget/EffortField.js';

/**
 * @module Gantt/column/EffortColumn
 */

/**
 * A column showing the task {@link Gantt.model.TaskModel#field-effort effort} and {@link Gantt.model.TaskModel#field-effortUnit units}.
 * The editor of this column understands the time units, so user can enter "4d" indicating 4 days effort, or "4h" indicating 4 hours, etc.
 *
 * Default editor is a {@link Core.widget.DurationField DurationField}.
 *
 * @extends Gantt/column/DurationColumn
 * @classType effort
 */
export default class EffortColumn extends DurationColumn {
    static get type() {
        return 'effort';
    }

    //region Config

    static get defaults() {
        return {
            field : 'fullEffort',
            text  : 'L{Effort}'
        };
    }

    //endregion

    get defaultEditor() {
        return {
            type : EffortField.type,
            name : this.field
        };
    }

    // Can only edit leafs
    canEdit(record) {
        return record.isLeaf;
    }
}

ColumnStore.registerColumnType(EffortColumn);
