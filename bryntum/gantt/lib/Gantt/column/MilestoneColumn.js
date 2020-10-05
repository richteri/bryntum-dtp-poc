import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/MilestoneColumn
 */

/**
 * Column that indicates whether the task is a milestone. This column is not editable.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classType milestone
 */
export default class MilestoneColumn extends CheckColumn {
    static get type() {
        return 'milestone';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'milestone',
            text  : 'L{Milestone}'
        };
    }
}

ColumnStore.registerColumnType(MilestoneColumn);
