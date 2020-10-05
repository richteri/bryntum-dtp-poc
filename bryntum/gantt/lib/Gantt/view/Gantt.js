import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

import GanttBase from './GanttBase.js';

// Based on thin GridBase, need to pull in default Grid features also
import '../../Grid/feature/ColumnDragToolbar.js';
import '../../Grid/feature/ColumnPicker.js';
import '../../Grid/feature/ColumnReorder.js';
import '../../Grid/feature/ColumnResize.js';
import '../../Grid/feature/ContextMenu.js';
import '../../Grid/feature/Filter.js';
import '../../Grid/feature/FilterBar.js';
import '../../Grid/feature/Group.js';
import '../../Grid/feature/Sort.js';
import '../../Grid/feature/Stripe.js';
import '../../Grid/column/CheckColumn.js'; // For checkbox selection mode

import '../../Grid/feature/RowReorder.js';

import '../../Scheduler/feature/ColumnLines.js';
import '../../Scheduler/feature/EventContextMenu.js';
import '../../Scheduler/feature/EventFilter.js';
import '../../Scheduler/feature/HeaderContextMenu.js';
import '../../Scheduler/feature/ScheduleTooltip.js';

import '../../SchedulerPro/feature/ProNonWorkingTime.js';

import '../feature/CellEdit.js';
import '../feature/CriticalPaths.js';
import '../feature/Dependencies.js';
import '../feature/PercentBar.js';
import '../feature/TaskDrag.js';
import '../feature/TaskContextMenu.js';
import '../feature/TaskDragCreate.js';
import '../feature/TaskEdit.js';
import '../feature/TaskResize.js';
import '../feature/TaskTooltip.js';

/**
 * @module Gantt/view/Gantt
 */

/**
 * <h2>Summary</h2>
 * The <b>Gantt</b> widget is the main component that visualizes the project data contained in a
 *  {@link Gantt.model.ProjectModel ProjectModel} instance. The Gantt view is implemented as a treegrid consisting
 *  of a left section showing the task hierarchy (or WBS) and a right section showing a graphical representation of the tasks on the time axis.
 *  Task relationships (or "dependencies") are rendered as arrows between the tasks and in the background you can (optionally) render non-working time too.
 *
 * The view is very interactive by default:
 *  * hovering over elements shows informative tooltips
 *  * right-clicking various elements shows context menus
 *  * double-clicking the task name shows an inline editor
 *  * double-clicking a task bar opens a detailed task editor popup
 *  * task bars can be dragged and resized
 *  * task progress can be changed by drag drop
 *  * task dependencies can be created by drag drop
 *
 * The Gantt view is very easy to use and is fully functional with minimal configuration yet
 * it is highly configurable through many configuration options and features.
 *
 * The minimum configuration consists of a {@link #config-project} and {@link Grid.view.Grid#config-columns}.
 * (If you only want to show the "Name" column, you can even omit `columns` as it's the default column set.)
 *
 * {@inlineexample gantt/Gantt.js}
 *
 * <h2>Configuring data for Gantt</h2>
 * The central place for all data visualized in the Gantt chart is the {@link Gantt.model.ProjectModel ProjectModel} instance, passed as the {@link #config-project}
 * configuration option when configuring the Gantt.
 *
 * For details related to the Gantt data structure / updating data / loading and saving data to the server,
 * adding custom fields and other information, please refer to the [Project data guide](#guides/project_data.md).
 *
 * <h2>Configuring columns</h2>
 * The only mandatory column is the <code>name</code> column which is of type {@link Gantt.column.NameColumn NameColumn}.
 * It is a tree column that shows the project WBS structure, and allows inline editing of the
 * {@link Gantt.model.TaskModel#field-name} field.
 *
 * The Gantt chart ships with lots of predefined columns (such as {@link Gantt.column.PercentDoneColumn PercentDoneColumn) but you can of course add your own columns too, showing any additional data in your data model.
 *
 * {@inlineexample gantt/GanttColumns.js}
 *
 * <h2>Advanced configurations</h2>
 * Almost any aspect of Bryntum Gantt can be configured. The included examples cover most of the supported configuration options.
 * To see some of the features in action, please click on the links below:
 *
 *  * [Labels](../examples/labels/)
 *  * [Tooltips](../examples/tooltips)
 *  * [Time Ranges](../examples/timeranges/)
 *  * [Resource Picker](../examples/resourceassignment/)
 *  * [Context Menu](../examples/taskcontextmenu/)
 *  * [Task Editor](../examples/taskeditor/)
 *  * [Undo/Redo](../examples/undoredo/)
 *  * [Advanced](../examples/advanced)
 *
 * @extends Gantt/view/GanttBase
 */
export default class Gantt extends GanttBase {

    /**
     * **This config is not used in the Gantt**
     * @private
     * @config {Scheduler.crud.AbstractCrudManagerMixin} crudManagerClass
     */

    /**
     * **This config is not used in the Gantt. Please use {@link #config-project} config instead**
     * @private
     * @config {Object|Scheduler.crud.AbstractCrudManagerMixin} crudManager
     */

    static get $name() {
        return 'Gantt';
    }
}

BryntumWidgetAdapterRegister.register('gantt', Gantt);
