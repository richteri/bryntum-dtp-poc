import ColumnStore from '../../Grid/data/ColumnStore.js';
import DependencyColumn from './DependencyColumn.js';

/**
 * @module Gantt/column/SuccessorColumn
 */

/**
 * A column which displays, in textual form, the dependencies which link from the
 * contextual to successor tasks.
 *
 * This type of column is editable by default. Default editor is a {@link Gantt.widget.DependencyField DependencyField}.
 *
 * @classType successor
 * @extends Gantt/column/DependencyColumn
 */
export default class SuccessorColumn extends DependencyColumn {
    static get type() {
        return 'successor';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            text  : 'L{Successors}',
            field : 'successors'
        };
    }
}

ColumnStore.registerColumnType(SuccessorColumn);
