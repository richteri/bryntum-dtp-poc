import GridCellEdit from '../../Grid/feature/CellEdit.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/CellEdit
 */

/**
 * Extends the {@link Grid.feature.CellEdit} to encapsulate Gantt functionality. This feature is enabled by <b>default</b>
 *
 * {@inlineexample gantt/feature/CellEdit.js}
 *
 * Editing can be started by a user by double-clicking an editable cell in the gantt's data grid, or it can be started programatically
 * by calling {@link Grid/feature/CellEdit#function-startEditing} and providing it with correct cell context.
 *
 * See {@link #function-doAddNewAtEnd}.
 *
 * @extends Grid/feature/CellEdit
 *
 * @classtype ganttCellEdit
 * @typings Grid/feature/CellEdit -> Grid/feature/GridCellEdit
 */
export default class CellEdit extends GridCellEdit {

    static get $name() {
        // NOTE: Even though the class name matches the one defined on the base class
        // we need this method in order registerFeature() to work properly
        // (it uses hasOwnProperty when detecting the class name)
        return 'CellEdit';
    }

    /**
     * Adds a new, empty record at the end of the TaskStore with the initial
     * data specified by the {@link Grid.feature.CellEdit#config-addNewAtEnd} setting.
     *
     * @returns {Promise} Newly added record wrapped in a promise.
     */
    async doAddNewAtEnd() {
        const
            grid        = this.grid,
            addNewAtEnd = this.addNewAtEnd,
            taskStore   = grid.taskStore,
            newTask     = taskStore.rootNode.appendChild(Object.assign({
                name      : 'New task',
                startDate : taskStore.getProject().startDate
            }, addNewAtEnd));

        await taskStore.getProject().propagate();

        // If the new record was not added due to it being off the end of the rendered block
        // ensure we force it to be there before we attempt to edit it.
        if (!grid.rowManager.getRowFor(newTask)) {
            grid.rowManager.displayRecordAtBottom();
        }

        return newTask;
    }
}

GridFeatureManager.registerFeature(CellEdit, true, 'Gantt');
