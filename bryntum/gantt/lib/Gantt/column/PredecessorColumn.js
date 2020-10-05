import ColumnStore from '../../Grid/data/ColumnStore.js';
import DependencyColumn from './DependencyColumn.js';

/**
 * @module Gantt/column/PredecessorColumn
 */

/**
 * A column which displays, in textual form, the dependencies which link from tasks
 * upon which the contextual task depends.
 *
 * This type of column is editable by default. Default editor is a {@link Gantt.widget.DependencyField DependencyField}.
 *
 * @classType predecessor
 * @extends Gantt/column/DependencyColumn
 */
export default class PredecessorColumn extends DependencyColumn {
    static get type() {
        return 'predecessor';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            text  : 'L{Predecessors}',
            field : 'predecessors'
        };
    }
}

ColumnStore.registerColumnType(PredecessorColumn);
