import Column from '../../Grid/column/Column.js';
import Store from '../../Core/data/Store.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import Combo from '../../Core/widget/Combo.js';

/**
 * @module Gantt/column/AddNewColumn
 */

/**
 * This column allows user to dynamically add columns to the Gantt chart by clicking the column header
 * and picking columns from a combobox.
 *
 * ## Adding a custom column to the combobox
 *
 * In order to appear in the column combobox list a column class have to fulfill these conditions:
 *
 * 1. the class should have a static property `type` with unique string value that will identify the column.
 * 2. the class should be registered with the call to {@link Grid/data/ColumnStore#function-registerColumnType-static ColumnStore.registerColumnType}.
 * 3. the class should have a static property `isGanttColumn` with truthy value.
 * 4. the class should have a static `text` property with column name.
 *
 * For example:
 *
 * ```javascript
 * import ColumnStore from 'gantt-distr/lib/Grid/data/ColumnStore.js';
 * import Column from 'gantt-distr/lib/Grid/column/Column.js';
 *
 * // New column class to display task priority
 * export default class TaskPriorityColumn extends Column {
 *     // unique alias of the column
 *     static get type() {
 *         return 'priority';
 *     }
 *
 *     // indicates that the column should be present in "Add New..." column
 *     static get isGanttColumn() {
 *         return true;
 *     }
 *
 *     static get defaults() {
 *         return {
 *             // the column is mapped to "priority" field of the Task model
 *             field : 'priority',
 *             // the column title
 *             text  : 'Priority'
 *         };
 *     }
 * }
 *
 * // register new column
 * ColumnStore.registerColumnType(TaskPriorityColumn);
 * ```
 *
 * @extends Grid/column/Column
 * @classType addnew
 */
export default class AddNewColumn extends Column {
    static get type() {
        return 'addnew';
    }

    static get defaults() {
        return {
            text       : 'L{New Column}',
            cls        : 'b-new-column-column',
            draggable  : false,
            sortable   : false,
            exportable : false,
            field      : null,
            editor     : null
        };
    }

    get columnCombo() {
        const
            me      = this,
            columns = me.grid.columns;

        return me._columnCombo || (
            me._columnCombo = new Combo({
                owner         : me.grid,
                cls           : 'b-new-column-combo',
                placeholder   : me.L('L{New Column}'),
                triggers      : false,
                autoExpand    : true,
                store         : me.ganttColumnStore,
                displayField  : 'text',
                monitorResize : false,
                picker        : {
                    align    : 't0-b0',
                    minWidth : 200,
                    onItem({ record : columnRecord }) {
                        const newColumn = new columnRecord.value({
                            region : me.region
                        }, columns);

                        // Insert the new column before the "New Column" column
                        // then focus it to ensure it is in view.
                        columns.insert(columns.indexOf(me), newColumn);
                        newColumn.element.focus();
                    }
                },
                syncInputFieldValue() {
                    this.input.value = '';
                },
                listeners : {
                    // Keystrokes must not leak up to the Grid where its Navigator will react
                    keydown({ event }) {
                        event.stopImmediatePropagation();
                    }
                }
            })
        );
    }

    get ganttColumnStore() {
        // Create a store containing the Gantt column classes.
        // A filter ensures that column types which are already
        // present in the grid are not shown.
        return new Store({
            data : Object.values(ColumnStore.columnTypes).reduce((result, col) => {
                // We must ensure that the defaultValues property is calculated
                // so that we can detect a text property.
                if (!col.propertiesExposedForData) {
                    col.exposeProperties({});
                }

                // To be included, a column must have a static isGanttColumn
                // property which yields a truthy value, and a text value.
                if (col.isGanttColumn && col.text) {
                    result.push({
                        id    : col.type,
                        text  : col.L(col.text),
                        value : col
                    });
                }
                return result;
            }, []),
            filters : [
                // A colRecord is only filtered in if the grid columns do not contain an instance.
                colRecord => !this.grid.columns.some(gridCol => gridCol.constructor === colRecord.value)
            ],
            sorters : [
                { field : 'text' }
            ]
        });
    }

    headerRenderer({ column, headerElement, isExport }) {
        if (!isExport) {
            const { columnCombo } = column;

            columnCombo.render(headerElement);
            columnCombo.picker.forElement = headerElement;
        }
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            this.columnCombo.focus();
        }
    }

    updateLocalization() {
        // reset cached combo to rebuild options store w/ new translated column names
        if (this._columnCombo) {
            this._columnCombo.destroy();
            this._columnCombo = null;
        }

        super.updateLocalization();
    }
}

ColumnStore.registerColumnType(AddNewColumn);
