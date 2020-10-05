import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from './GanttDateColumn.js';

/**
 * @module Gantt/column/LateStartDateColumn
 */

/**
 * A column that displays the task's {@link Gantt.model.TaskModel#field-lateStartDate late start date}.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classType latestartdate
 */
export default class LateStartDateColumn extends GanttDateColumn {
    static get type() {
        return 'latestartdate';
    }

    static get defaults() {
        return {
            field : 'lateStartDate',
            text  : 'L{Late Start}'
        };
    }

    // The column is not editable
    canEdit(record) {
        return false;
    }
}

ColumnStore.registerColumnType(LateStartDateColumn);
