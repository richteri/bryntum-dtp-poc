import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/SequenceColumn
 */

/**
 * A "calculated" column which displays the sequential position of the task in the project.
 *
 * There is no `editor`, since value is read-only.
 *
 * See {@link Gantt.model.TaskModel#property-sequenceNumber} for details.
 *
 * @extends Grid/column/Column
 * @classType sequence
 */
export default class SequenceColumn extends Column {
    static get type() {
        return 'sequence';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field      : 'sequenceNumber',
            text       : 'L{Sequence}',
            sortable   : false,
            groupable  : false,
            filterable : false,
            width      : 70,
            editor     : null
        };
    }
}

ColumnStore.registerColumnType(SequenceColumn);
