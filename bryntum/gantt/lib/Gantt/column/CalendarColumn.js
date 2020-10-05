import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import CalendarPicker from '../widget/CalendarPicker.js';

/**
 * @module Gantt/column/CalendarColumn
 */

/**
 * A column that displays (and allows user to update) the current {@link Gantt.model.CalendarModel calendar} of the task.
 *
 * Default editor is a {@link Gantt.widget.CalendarPicker CalendarPicker}.
 *
 * @extends Grid/column/Column
 * @classType calendar
 */
export default class CalendarColumn extends Column {
    static get type() {
        return 'calendar';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            field  : 'calendar',
            text   : 'L{Calendar}',
            editor : {
                type         : CalendarPicker.type,
                clearable    : true,
                allowInvalid : false
            }
        };
    }

    afterConstruct() {
        const me = this;

        super.afterConstruct();

        const project = me.grid.project;

        // Store default calendar to filter out this value
        me.defaultCalendar = project.defaultCalendar;

        me.refreshCalendars();

        project.calendarManagerStore.on({
            change  : me.refreshCalendars,
            refresh : me.refreshCalendars,
            thisObj : me
        });
    }

    // region Events

    refreshCalendars() {
        const
            me = this,
            project = me.grid.project;

        me.editor.refreshCalendars(project.calendarManagerStore.getRange());
    }

    // endregion

    renderer({ value }) {
        const me = this;

        if (value === me.defaultCalendar) {
            return '';
        }
        else if (value && value.id) {
            const model = me.editor.store.getById(value.id);
            return model && model[me.editor.displayField] || '';
        }
        else {
            return '';
        }
    }
}

ColumnStore.registerColumnType(CalendarColumn);
