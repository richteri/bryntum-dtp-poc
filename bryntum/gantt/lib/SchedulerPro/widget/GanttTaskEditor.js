/**
 * @module SchedulerPro/widget/GanttTaskEditor
 */
import TaskEditorBase from './TaskEditorBase.js';

/**
 * {@link SchedulerPro/widget/TaskEditorBase} subclass for Gantt projects which SchedulerPro can handle as well.
 *
 * @extends SchedulerPro/widget/TaskEditorBase
 */
export default class GanttTaskEditor extends TaskEditorBase {

    static get $name() {
        return 'GanttTaskEditor';
    }

    static get defaultConfig() {
        return {
            items : [
                {
                    type : 'tabpanel',
                    ref  : 'tabs',
                    flex : '1 0 100%',

                    layoutConfig : {
                        alignItems   : 'stretch',
                        alignContent : 'stretch'
                    },

                    items : []
                }
            ],

            defaultTabs : [
                { type : 'generaltab' },
                { type : 'successorstab' },
                { type : 'predecessorstab' },
                { type : 'resourcestab' },
                { type : 'advancedtab' },
                { type : 'notestab' }
            ]
        };
    }
}
