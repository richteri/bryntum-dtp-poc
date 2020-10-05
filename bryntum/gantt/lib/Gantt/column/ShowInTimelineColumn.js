import CheckColumn from '../../Grid/column/CheckColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/ShowInTimelineColumn
 */

/**
 * Column that shows if a task should be shown in the {@link Gantt.widget.Timeline Timeline} widget.
 *
 * This column uses a {@link Core.widget.Checkbox checkbox} as its editor, and it is not intended to be changed.
 *
 * @extends Grid/column/CheckColumn
 * @classType showintimeline
 */
export default class ShowInTimelineColumn extends CheckColumn {
    static get type() {
        return 'showintimeline';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field : 'showInTimeline',
            text  : 'L{Show in timeline}'
        };
    }
}

ColumnStore.registerColumnType(ShowInTimelineColumn);
