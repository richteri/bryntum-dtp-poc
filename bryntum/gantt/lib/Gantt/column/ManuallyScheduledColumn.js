import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * A column that displays (and allows user to update) the task's
 * {@link Gantt.model.TaskModel#field-manuallyScheduled manuallyScheduled} field.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classType manuallyscheduled
 */
export default class ManuallyScheduledColumn extends CheckColumn {
    static get type() {
        return 'manuallyscheduled';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'manuallyScheduled',
            text  : 'L{Manually scheduled}'
        };
    }
}

ColumnStore.registerColumnType(ManuallyScheduledColumn);
