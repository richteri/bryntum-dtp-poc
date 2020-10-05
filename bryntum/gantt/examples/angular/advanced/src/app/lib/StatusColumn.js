/**
 * Status Column implementation file
 */
import { Column, ColumnStore } from 'bryntum-gantt/gantt.umd.js';

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
