import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import '../../Core/widget/TextAreaField.js';

/**
 * @module Gantt/column/NoteColumn
 */

/**
 * A column which displays a task's {@link Gantt.model.TaskModel#field-note note} field.
 *
 * Default editor is a {@link Core.widget.TextAreaField TextAreaField}.
 *
 * @extends Grid/column/Column
 * @classType note
 */
export default class NoteColumn extends Column {
    static get type() {
        return 'note';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'note',
            text   : 'L{Note}',
            width  : 150,
            editor : {
                type   : 'textareafield',
                inline : false
            }
        };
    }

    renderer({ value }) {
        return (value || '').trim();
    }

    get disableHtmlEncode() {
        return true;
    }
}

ColumnStore.registerColumnType(NoteColumn);
