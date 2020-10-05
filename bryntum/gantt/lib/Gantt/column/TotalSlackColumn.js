import ColumnStore from '../../Grid/data/ColumnStore.js';
import DurationColumn from './DurationColumn.js';

/**
 * @module Gantt/column/TotalSlackColumn
 */

/**
 * A column that displays the task's {@link Gantt.model.TaskModel#field-totalSlack total slack}.
 *
 * Default editor is a {@link Core.widget.DurationField DurationField}.
 *
 * @extends Gantt/column/DurationColumn
 * @classType totalslack
 */
export default class TotalSlackColumn extends DurationColumn {
    static get type() {
        return 'totalslack';
    }

    static get isGanttColumn() {
        return true;
    }

    get durationUnitField() {
        return 'slackUnit';
    }

    static get defaults() {
        return {
            field : 'totalSlack',
            text  : 'L{Total Slack}'
        };
    }

    // The column is not editable
    canEdit(record) {
        return false;
    }
}

ColumnStore.registerColumnType(TotalSlackColumn);
