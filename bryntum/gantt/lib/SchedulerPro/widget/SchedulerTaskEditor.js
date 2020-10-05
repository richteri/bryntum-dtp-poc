/**
 * @module SchedulerPro/widget/SchedulerTaskEditor
 */
import TaskEditorBase from './TaskEditorBase.js';

/**
 * {@link SchedulerPro/widget/TaskEditorBase} subclass for simplified SchedulerPro projects.
 *
 * Provides a UI to edit tasks in a dialog. To append Widgets to any of the built-in tabs, use the `extraItems` config.
 *
 * Built-in tab names are:
 *  * generaltab
 *  * predecessorstab
 *  * successorstab
 *  * resourcestab
 *  * advancedtab
 *  * notestab
 *
 * Example:
 * ```
 * new ProScheduler({
 *   features : {
 *     taskEdit : {
 *       editorConfig : {
 *         extraItems : {
 *           generaltab : [
 *             { type : 'button', text : 'My Button' },
 *             ...
 *           ]
 *         }
 *       },
 *       tabsConfig : {
 *         // change title of General tab
 *         generaltab : {
 *           title : 'Common'
 *         },
 *
 *         // remove Notes tab
 *         notestab : false,
 *
 *         // add custom Files tab
 *         filestab : { type : 'filestab' },
 *         ...
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @externalexample schedulerpro/widget/SchedulerTaskEditor.js
 *
 * @extends SchedulerPro/widget/TaskEditorBase
 */
export default class SchedulerTaskEditor extends TaskEditorBase {

    static get $name() {
        return 'SchedulerTaskEditor';
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
                    }
                }
            ],

            defaultTabs : [
                { type : 'schedulergeneraltab' },
                { type : 'successorstab' },
                { type : 'predecessorstab' },
                { type : 'resourcestab' },
                { type : 'notestab' }
            ]
        };
    }
}
