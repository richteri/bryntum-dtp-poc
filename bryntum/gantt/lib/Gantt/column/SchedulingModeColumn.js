import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';
import SchedulingModePicker from '../widget/SchedulingModePicker.js';

/**
 * @module Gantt/column/SchedulingModeColumn
 */

/**
 * A column which displays a task's scheduling {@link Gantt.model.TaskModel#field-schedulingMode mode} field.
 *
 * Default editor is a {@link SchedulerPro.widget.SchedulingModePicker SchedulingModePicker}.
 *
 * @extends Grid/column/Column
 * @classType schedulingmodecolumn
 */
export default class SchedulingModeColumn extends Column {
    static get type() {
        return 'schedulingmodecolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'schedulingMode',
            text   : 'L{Scheduling Mode}',
            editor : {
                type         : SchedulingModePicker.type,
                allowInvalid : false,
                picker       : {
                    minWidth : '8.5em'
                }
            }
        };
    }

    afterConstruct() {
        const me = this;

        super.afterConstruct();

        // we need to trigger the column refresh **after** the editor locale change
        // to display properly translated scheduling modes
        FunctionHelper.createSequence(me.editor.updateLocalization, me.onEditorLocaleChange, me);
    }

    renderer({ value }) {
        const model = this.editor.store.getById(value);
        return model && model.text || '';
    }

    // Refreshes the column **after** the editor locale change
    // to display properly translated scheduling modes
    onEditorLocaleChange() {
        this.grid.refreshColumn(this);
    }
}

ColumnStore.registerColumnType(SchedulingModeColumn);
