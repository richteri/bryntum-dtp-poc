import NumberColumn from '../../Grid/column/NumberColumn.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

/**
 * @module Gantt/column/PercentDoneColumn
 */

/**
 * A column representing the {@link Gantt.model.TaskModel#field-percentDone percentDone} field of the task.
 *
 * Default editor is a {@link Core.widget.NumberField NumberField}.
 *
 * @extends Grid/column/NumberColumn
 * @classType percentdone
 */
export default class PercentDoneColumn extends NumberColumn {
    static get type() {
        return 'percentdone';
    }

    static get isGanttColumn() {
        return true;
    }

    //region Config

    static get fields() {
        return [
            /**
             * Set to `true` to render a circular progress bar to visualize the task progress
             * @config {Boolean} showCircle
             */
            'showCircle'
        ];
    }

    static get defaults() {
        return {
            field : 'percentDone',
            text  : 'L{% Done}',
            unit  : '%',
            step  : 1,
            min   : 0,
            max   : 100,
            width : 90
        };
    }
    //endregion

    construct(config) {
        super.construct(...arguments);

        if (this.showCircle) {
            this.htmlEncode = false;
        }
    }

    defaultRenderer({ record }) {
        const value = record.renderedPercentDone;

        if (this.showCircle) {
            const size  = this.grid.rowHeight * 0.8;

            return {
                className : 'b-percentdone-circle',
                style     : {
                    animationDelay : `-${value - 0.1}s`,
                    width          : size,
                    height         : size
                },
                dataset : {
                    value
                }
            };

        }

        return value + this.unit;
    }

    // Can only edit leafs
    canEdit(record) {
        return record.isLeaf;
    }
}

ColumnStore.registerColumnType(PercentDoneColumn);
