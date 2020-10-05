import Column from '../../../lib/Grid/column/Column.js';
import ColumnStore from '../../../lib/Grid/data/ColumnStore.js';

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
            editor     : false,
            cellCls    : 'b-status-column-cell',
            htmlEncode : false
        };
    }

    //endregion

    renderer({ record }) {
        let status = '';

        if (record.isCompleted) {
            status = 'Completed';
        }
        else if (record.endDate < Date.now()) {
            status = 'Late';
        }
        else if (record.isStarted) {
            status = 'Started';
        }

        return status ? {
            tag       : 'i',
            className : `b-fa b-fa-circle ${status}`,
            html      : status
        } : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);
