import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/WBSColumn
 */

/**
 * A "calculated" column which displays the _WBS_ (_Work Breakdown Structure_) for the tasks - the position of the task in the project tree structure.
 *
 * There is no `editor`, since value is read-only.
 *
 * @extends Grid/column/Column
 * @classType wbs
 */
export default class WBSColumn extends Column {
    static get type() {
        return 'wbs';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'wbsCode',
            text   : 'L{WBS}',
            width  : 70,
            editor : null
        };
    }
}

ColumnStore.registerColumnType(WBSColumn);
