/**
 * Taken from the original example
 */
import { Column, ColumnStore } from 'bryntum-gantt';

/**
 * @module StatusColumn
 */

/**
 * A column showing the status of a task
 *
 * @extends Gantt/column/Column
 * @classType statuscolumn
 */
export default class StatusColumn extends Column {
    static get type() {
        return 'statuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config properties here
            text       : 'Status',
            htmlEncode : false,
            editor     : false
        };
    }

    //endregion

    renderer({ record }) {
        let status = '';

        if (record.isCompleted) {
            status = 'Completed';
        }
        else if (record.endDate > Date.now()) {
            status = 'Late';
        }
        else if (record.isStarted) {
            status = 'Started';
        }

        return status ? `<i class="b-fa b-fa-circle ${status}"></i>${status}` : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);
