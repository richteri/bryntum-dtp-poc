import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from '../../Gantt/column/GanttDateColumn.js';

/**
 * @module Gantt/column/DeadlineDateColumn
 */

/**
 * A column showing the {@link Gantt.model.TaskModel#field-deadlineDate} field.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat}
 * will be used as a default value and the format will be dynamically updated while zooming according to the
 * {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classType deadlinedate
 */
export default class DeadlineDateColumn extends GanttDateColumn {
    static get type() {
        return 'deadlinedate';
    }

    static get defaults() {
        return {
            field : 'deadlineDate',
            text  : 'L{Deadline}',
            width : 146
        };
    }
}

ColumnStore.registerColumnType(DeadlineDateColumn);
