import FormTab from './FormTab.js';
import '../../../Core/widget/TextAreaField.js';
import BryntumWidgetAdapterRegister from '../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module SchedulerPro/widget/taskeditor/NotesTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the notes for an event or task.
 * @internal
 */
export default class NotesTab extends FormTab {
    static get $name() {
        return 'NotesTab';
    }

    static get type() {
        return 'notestab';
    }

    static get defaultConfig() {
        return {
            localeClass : this,
            title       : 'L{Notes}',
            ref         : 'notestab',

            layoutConfig : {
                alignItems   : 'flex-start',
                alignContent : 'stretch'
            },

            items : [
                {
                    type : 'textareafield',
                    cls  : 'b-taskeditor-notes-field',
                    name : 'note'
                }
            ]
        };
    }
}

BryntumWidgetAdapterRegister.register(NotesTab.type, NotesTab);
