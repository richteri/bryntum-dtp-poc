import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from '../../Gantt/column/GanttDateColumn.js';

/**
 * @module Gantt/column/ConstraintDateColumn
 */

/**
 * A column showing the {@link Gantt.model.TaskModel#field-constraintDate date} of the constraint, applied to the task.
 * The type of the constraint can be displayed with the {@link Gantt/column/ConstraintTypeColumn ConstraintTypeColumn}.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classType constraintdate
 */
export default class ConstraintDateColumn extends GanttDateColumn {
    static get type() {
        return 'constraintdate';
    }

    static get defaults() {
        return {
            field : 'constraintDate',
            text  : 'L{Constraint Date}',
            width : 146
        };
    }
}

ColumnStore.registerColumnType(ConstraintDateColumn);
