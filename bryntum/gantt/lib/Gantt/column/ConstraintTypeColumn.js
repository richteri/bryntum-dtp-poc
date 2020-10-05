import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import FunctionHelper from '../../Core/helper/FunctionHelper.js';
import ConstraintTypePicker from '../widget/ConstraintTypePicker.js';

/**
 * @module Gantt/column/ConstraintTypeColumn
 */

/**
 * {@link Gantt.model.TaskModel#field-constraintType Constraint type} column.
 *
 * Default editor is a {@link SchedulerPro.widget.ConstraintTypePicker ConstraintTypePicker}.
 *
 * The constraint can be one of:
 *
 * - Must start on [date]
 * - Must finish on [date]
 * - Start no earlier than [date]
 * - Start no later than [date]
 * - Finish no earlier than [date]
 * - Finish no later than [date]
 *
 * The date of the constraint can be specified with the {@link Gantt/column/ConstraintDateColumn ConstraintDateColumn}
 *
 * @extends Grid/column/Column
 * @classType constrainttype
 */
export default class ConstraintTypeColumn extends Column {
    static get type() {
        return 'constrainttype';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'constraintType',
            text   : 'L{Constraint Type}',
            width  : 146,
            editor : {
                type         : ConstraintTypePicker.type,
                clearable    : true,
                allowInvalid : false
            }
        };
    }

    afterConstruct() {
        const me = this;

        super.afterConstruct();

        me.grid.on({
            startCellEdit  : me.onStartCellEdit,
            finishCellEdit : me.onDoneCellEdit,
            cancelCellEdit : me.onDoneCellEdit,
            thisObj        : me
        });

        // we need to trigger the column refresh **after** the editor locale change
        // to display properly translated constraint types
        FunctionHelper.createSequence(me.editor.updateLocalization, me.onEditorLocaleChange, me);
    }

    onStartCellEdit({ editorContext : { editor, record } }) {
        if (editor.inputField instanceof ConstraintTypePicker) {
            editor.inputField.store.filter(r => record.run('isConstraintTypeApplicable', r.id));
            this._filterDetacher = () => editor.inputField.store.clearFilters();
        }
    }

    onDoneCellEdit() {
        this._filterDetacher && this._filterDetacher();
    }

    renderer({ value }) {
        // id 'none' is the special "None" record, so render empty cell.
        const model = value != null && value !== 'none' && this.editor.store.getById(value);
        return model && model.text || '';
    }

    // Refreshes the column **after** the editor locale change
    // to display properly translated constraint types
    onEditorLocaleChange() {
        this.grid.refreshColumn(this);
    }
}

ColumnStore.registerColumnType(ConstraintTypeColumn);
