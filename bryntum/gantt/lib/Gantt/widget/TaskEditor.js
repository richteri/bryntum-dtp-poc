import GanttTaskEditor from '../../SchedulerPro/widget/GanttTaskEditor.js';

/**
 * @module Gantt/widget/TaskEditor
 */

/**
 * Provides a UI to edit tasks in a popup dialog. It is implemented as a Tab Panel with
 * several preconfigured built-in tabs. Although the default configuration may be adequate
 * in many cases, the Task Editor is easily configurable.
 *
 * To hide built-in tabs or to add custom tabs, use the {@link #config-tabsConfig} config.
 *
 * To append Widgets to any of the built-in tabs, use the {@link #config-extraItems} config.
 *
 * Built-in tab names are:
 *  * generaltab
 *  * predecessorstab
 *  * successorstab
 *  * resourcestab
 *  * advancedtab
 *  * notestab
 *
 *
 * <h2>Task editor customization example</h2>
 * When you add a custom field you can specify Field {@link Core.widget.Field#config-name name}.
 * It will be used prior to {@link Core.widget.Widget#config-ref ref} and {@link Core.widget.Widget#config-id id}
 * to load/save data automatically. Field name should match data field name.
 *
 * {@inlineexample gantt/feature/TaskEditCustom.js}
 *
 * @externalexample gantt/widget/TaskEditor.js
 * @extends SchedulerPro/widget/GanttTaskEditor
 */
export default class TaskEditor extends GanttTaskEditor {

    static get $name() {
        return 'TaskEditor';
    }

    static get defaultConfig() {
        return {
            cls : 'b-gantt-taskeditor b-schedulerpro-taskeditor'
        };
    }
}
