import TreeColumn from '../../Grid/column/TreeColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/NameColumn
 */

/**
 * A tree column showing (and allowing user to edit) the task's {@link Gantt.model.TaskModel#field-name name} field.
 *
 * Default editor is a {@link Core.widget.TextField TextField}.
 *
 * @extends Grid/column/TreeColumn
 * @classType name
 */
export default class NameColumn extends TreeColumn {
    static get type() {
        return 'name';
    }

    static get isGanttColumn() {
        return true;
    }

    //region Config

    static get defaults() {
        return {
            htmlEncode : false,
            width      : 200,
            field      : 'name',
            text       : 'L{Name}'
        };
    }

    //endregion
}

ColumnStore.registerColumnType(NameColumn);
