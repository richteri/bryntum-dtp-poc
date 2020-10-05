import ColumnStore from '../../Grid/data/ColumnStore.js';
import GanttDateColumn from './GanttDateColumn.js';

/**
 * @module Gantt/column/EarlyStartDateColumn
 */

/**
 * A column that displays the task's {@link Gantt.model.TaskModel#field-earlyStartDate early start date}.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * If {@link #config-format} is omitted, Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used as a default value and
 * the format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * @extends Gantt/column/GanttDateColumn
 * @classType earlystartdate
 */
export default class EarlyStartDateColumn extends GanttDateColumn {
    static get type() {
        return 'earlystartdate';
    }

    static get defaults() {
        return {
            field : 'earlyStartDate',
            text  : 'L{Early Start}'
        };
    }

    // The column is not editable
    canEdit(record) {
        return false;
    }
}

ColumnStore.registerColumnType(EarlyStartDateColumn);
