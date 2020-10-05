import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * A column that displays (and allows user to update) the task's
 * {@link Gantt.model.TaskModel#field-manuallyScheduled manuallyScheduled} field.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classType eventmode
 */
export default class EventModeColumn extends CheckColumn {
    static get type() {
        return 'eventmode';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'manuallyScheduled',
            align : 'left',
            text  : 'L{Event mode}'
        };
    }

    constructor(config, store) {
        super(...arguments);

        this.internalCellCls = 'b-eventmode-cell';
    }

    renderer({ value, cellElement, column, isExport }) {
        super.renderer(...arguments);

        if (isExport) {
            return this.renderText(value);
        }
        else {
            if (cellElement.widget) {
                cellElement.widget.text = this.renderText(value);
            }
        }
    }

    onCheckboxChange({ source, checked }) {
        super.onCheckboxChange(...arguments);
        source.text = this.renderText(checked);
    }

    renderText(value) {
        return value ? this.L('L{Manual}') : this.L('L{Auto}');
    }
}

ColumnStore.registerColumnType(EventModeColumn);
