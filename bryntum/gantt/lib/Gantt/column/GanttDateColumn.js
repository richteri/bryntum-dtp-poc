import DateColumn from '../../Grid/column/DateColumn.js';

/**
 * @module Gantt/column/GanttDateColumn
 */

/**
 * Base column class that displays dates, in the `ll` format by default. If set to `null` uses Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat date format} as a default.
 * The format will be dynamically updated while zooming according to the {@link Scheduler.preset.ViewPreset#field-displayDateFormat} value specified for the ViewPreset being selected.
 *
 * By default, this class hides the left/right arrows to modify the date incrementally, you can enable this with the {@link Grid.column.DateColumn#config-step} config
 * of the {@link #config-editor} config.
 *
 * Default editor is a {@link Core.widget.DateField DateField}.
 *
 * @extends Grid/column/DateColumn
 * @abstract
 */
export default class GanttDateColumn extends DateColumn {

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            instantUpdate : true,
            width         : 130,
            step          : null,

            /**
             * The date format used to display dates in this column. If `format` is set to `null`,
             * the current value of the Gantt's {@link Scheduler.view.mixin.TimelineViewPresets#config-displayDateFormat} will be used to format the date value.
             * @config {String}
             * @category Common
             */
            format : 'll'
        };
    }

    construct(data, store) {
        const me = this;

        me.gantt = store.grid;

        super.construct(data, store);

        // If a format is specified, always stick to it
        if (me.format) {
            me.explicitFormat = true;
        }
        // Otherwise adapt to gantts format when it changes
        else {
            me.gantt.on({
                displayDateFormatChange({ format }) {
                    if (!me.explicitFormat) {
                        me.set('format', format);
                    }
                }
            });
        }
    }

    set format(format) {
        this.explicitFormat = true;
        this.set('format', format);
    }

    get format() {
        return (this.explicitFormat && this.data.format) || this.gantt.displayDateFormat;
    }
}
