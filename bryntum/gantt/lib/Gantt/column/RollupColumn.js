import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/RollupColumn
 */

/**
 * A column that displays a checkbox to edit the {@link Gantt.model.TaskModel#field-rollup rollup} data field.
 * This field indicates if a task should rollup to its closest parent or not.
 * Requires the {@link Gantt.feature.Rollups Rollups} feature to be enabled.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classType rollup
 */
export default class RollupColumn extends CheckColumn {
    static get type() {
        return 'rollup';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'rollup',
            text  : 'L{Rollup}'
        };
    }
}

ColumnStore.registerColumnType(RollupColumn);
