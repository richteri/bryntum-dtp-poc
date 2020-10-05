import { base } from '../../Core/helper/MixinHelper.js';
import Delayable from '../../Core/mixin/Delayable.js';
import ProTaskEditStm from './mixin/ProTaskEditStm.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Field from '../../Core/widget/Field.js';
import GanttTaskEditor from '../widget/GanttTaskEditor.js';
import SchedulerTaskEditor from '../widget/SchedulerTaskEditor.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import { ProjectType } from '../../Engine/scheduling/Types.js';

/**
 * @module SchedulerPro/feature/ProTaskEdit
 */

/**
 * The Scheduler Pro task editor feature enables a popup window activated when double clicking a task bar, or through
 * the {@link Scheduler.feature.EventContextMenu}
 *
 * {@inlineexample schedulerpro/feature/ProTaskEdit.js}
 *
 * <h2>Customizing tabs</h2>
 * You can append widgets to tabs with a {@link SchedulerPro.widget.TaskEditorBase#config-extraItems}
 *
 * {@inlineexample schedulerpro/feature/ProTaskEditExtraItems.js}
 *
 * To turn off the Task Editor just simple disable the feature.
 *
 * ```javascript
 * new ProScheduler ({
 *     features : {
 *         eventEdit : false
 *     }
 *     ...
 * })
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @mixes SchedulerPro/feature/mixin/ProTaskEditStm
 * @mixes Core/mixin/Delayable
 */
export default class ProTaskEdit extends base(InstancePlugin).mixes(
    Delayable,
    ProTaskEditStm
) {
    static get pluginConfig() {
        return {
            chain  : ['getEventMenuItems', 'onEnterKey'],
            assign : ['editEvent']
        };
    }

    static get defaultConfig() {
        return {
            /**
             * The event that shall trigger showing the editor. Defaults to `eventdblclick`, set to `` or null to disable editing of existing events.
             * @config {String}
             * @default
             * @category Editor
             */
            triggerEvent : 'eventdblclick',

            /**
             * Project type to editor class map.
             *
             * @config {Object}
             * @default
             * @category Editor
             */
            editorClassMap : {
                [ProjectType.Unknown]   : SchedulerTaskEditor,
                [ProjectType.Gantt]     : GanttTaskEditor,
                [ProjectType.Scheduler] : SchedulerTaskEditor
            },

            /**
             * Editor class to use, if given will override anything defined in {@link #config-editorClassMap} option.
             *
             * @config {Function}
             * @default
             * @category Editor
             */
            editorClass : null,

            /**
             * A configuration object used to configure the internal {@link SchedulerPro.widget.TaskEditorBase TaskEditor} which
             * can be used to add additional tabs or remove any of the default ones.
             * @config {Object}
             */
            editorConfig : null,

            /**
             * True to show a delete button in the editor.
             * @config {Boolean}
             * @default
             * @category Editor widgets
             */
            showDeleteButton : true,

            /**
             * True to save and close this panel if ENTER is pressed in one of the input fields inside the panel.
             * @config {Boolean}
             * @default
             * @category Editor
             */
            saveAndCloseOnEnter : true,

            /**
             * A configuration object used to configure tabs of the task editor which can be used to
             * customize the built-in tabs without changing the whole {@link #config-editorConfig editorConfig}.
             * It is especially useful when only a few tabs should be changed.
             * The individual configuration objects of the tabs contained in {@link #config-tabsConfig tabsConfig}
             * are keyed by tab names and are merged with the default built-in configurations.
             *
             *
             * Built-in tab names are:
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * advancedtab
             *  * notestab
             *
             * The built-in tabs can be individually switched on or off, customized,
             * or new custom tab(s) can be added. See {@link SchedulerPro.widget.TaskEditorBase#config-tabsConfig TaskEditorBase}
             * for details and example. {@link #config-tabsConfig tabsConfig}
             * object is passed to TaskEditor where it is applied to the built-in and custom tabs.
             *
             * @config {Object}
             */
            tabsConfig : null,

            /**
             * The week start day used in all date fields of the feature editor form by default.
             * 0 means Sunday, 6 means Saturday.
             * Defaults to the locale's week start day.
             * @config {Number}
             */
            weekStartDay : null
        };
    }

    construct(scheduler, config) {
        const me = this;

        scheduler.taskEdit = me;

        super.construct(scheduler, ObjectHelper.assign({
            weekStartDay : scheduler.weekStartDay
        }, config));

        me._clientListenersDetacher = scheduler.on({
            [me.triggerEvent] : me.onActivateEditor,
            thisObj           : me
        });
    }

    get scheduler() {
        return this.client;
    }

    getProject() {
        return this.scheduler.project;
    }

    doDestroy() {
        const me = this;

        me._clientListenersDetacher();

        me.detachFromProject();

        me.editor && me.editor.destroy();

        super.doDestroy();
    }

    get isEditing() {
        return !!this._editing;
    }

    onActivateEditor({ eventRecord, resourceRecord }) {
        this.editEvent(eventRecord, resourceRecord);
    }

    getElementFromTaskRecord(taskRecord, resourceRecord) {
        return this.client.getElementFromEventRecord(taskRecord, resourceRecord);
    }

    /**
     * Shows a {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor}
     * to edit the passed task. This function is exposed on the Scheduler Pro instance and can be called as `scheduler.editTask()`.
     * @param {SchedulerPro.model.ProTaskModel|Function} taskRecord Task to edit or a function returning a task to edit, the function will be executed within an STM transaction
     *                                                               which will be canceled in case user presses Cancel button or closes editor w/o hitting Save.
     * @param {SchedulerPro.model.ResourceModel} [resourceRecord] The Resource record for the event.
     * This parameter is needed if the event is newly created for a resource and has not been assigned, or when using
     * multi assignment.
     * @param {HTMLElement} [element] Element to anchor editor to (defaults to events element)
     * @return {Promise} Promise which resolves after the editor is shown
     * @async
     */
    async editEvent(taskRecord, resourceRecord = null, element = null) {
        const
            me = this,
            scheduler = me.scheduler;

        if (!scheduler.readOnly && !me.disabled) {

            const partner = me.client.partner;

            if (partner && (partner.editEvent || partner.editTask)) {
                (partner.editEvent || partner.editTask)(taskRecord, resourceRecord, element);
            }
            else {
                const doScrollIntoView = !element;
                me._editing = true;

                me.captureStm();
                me.startStmTransaction();

                // Suspend AjaxStore auto committing for the duration of the edit.
                me.schedulerAutoCommit = scheduler.taskStore.autoCommit;
                scheduler.taskStore.autoCommit = false;

                // Suspend Project auto syncing for the duration of the edit.
                me.schedulerAutoSync = scheduler.project.autoSync;
                scheduler.project.autoSync = false;

                if (typeof taskRecord === 'function') {
                    taskRecord = taskRecord();
                }

                // For programmatic edit calls for an event not currently in view, scroll it into view first
                if (doScrollIntoView && scheduler.taskStore.includes(taskRecord)) {
                    await me.scrollEventIntoView(taskRecord, resourceRecord);
                }

                const
                    taskElement = element || DomHelper.down(
                        me.getElementFromTaskRecord(taskRecord, resourceRecord),
                        scheduler.eventInnerSelector
                    ),
                    editor = me.getEditor(taskRecord);

                /**
                 * Fires on the owning Scheduler instance before a task is displayed in the editor.
                 * This may be listened to in order to take over the task editing flow. Returning `false`
                 * stops the default editing UI from being shown.
                 * @event beforeTaskEdit
                 * @param {SchedulerPro.view.ProScheduler} source The Scheduler Pro instance
                 * @param {SchedulerPro.feature.ProTaskEdit} taskEdit The taskEdit feature
                 * @param {SchedulerPro.model.ProTaskModel} taskRecord The task about to be shown in the editor.
                 * @param {HTMLElement} taskElement The element which represents the task
                 * @preventable
                 */
                if (false !== scheduler.trigger('beforeTaskEdit', {
                    taskEdit : me,
                    taskRecord,
                    taskElement
                })) {

                    // The Promise being async allows a mouseover to trigger the event tip
                    // unless we add the editing class immediately.
                    scheduler.element.classList.add('b-taskeditor-editing');

                    /**
                     * Fires on the owning Scheduler when the editor for an event is available but before it is shown. Allows
                     * manipulating fields etc.
                     * @event beforeTaskEditShow
                     * @param {SchedulerPro.view.ProScheduler} source The SchedulerPro instance
                     * @param {SchedulerPro.feature.ProTaskEdit} taskEdit The taskEdit feature
                     * @param {SchedulerPro.model.ProTaskModel} taskRecord The task about to be shown in the editor.
                     * @param {HTMLElement} eventElement The element which represents the task
                     * @param {SchedulerPro.widget.TaskEditorBase} editor The editor
                     */
                    scheduler.trigger('beforeTaskEditShow', {
                        taskEdit : me,
                        taskRecord,
                        taskElement,
                        editor
                    });

                    me.load(taskRecord);
                    me.attachToProject();

                    if (taskElement) {
                        await editor.showBy({
                            target : taskElement,
                            anchor : true,
                            offset : -5
                        });
                    }
                    else {
                        // Display the editor centered in the Scheduler
                        await editor.showBy({
                            target : scheduler.element,
                            anchor : false,
                            // For records not part of the store (new ones, or filtered out ones) - center the editor
                            align  : 'c-c'
                        });
                    }
                }
                else {
                    me.rejectStmTransaction();
                    me.disableStm();
                    me.freeStm();
                    me._editing = false;
                }
            }
        }
    }

    getEditor(taskRecord = this.record) {
        const
            me = this,
            project = taskRecord && taskRecord.getProject() || this.getProject(),
            projectType = project.getType(),
            editorClass = me.editorClass || me.editorClassMap[projectType] || me.editorClassMap[ProjectType.Unknown] || SchedulerTaskEditor;

        if (!me.editor || me.editor.constructor !== editorClass) {

            me.editor && me.editor.destroy();

            me.editor = new editorClass(ObjectHelper.merge({
                eventEditFeature         : me,
                weekStartDay             : me.weekStartDay,
                saveAndCloseOnEnter      : me.saveAndCloseOnEnter,
                showDeleteButton         : me.showDeleteButton,
                project                  : me.getProject(),
                durationDisplayPrecision : me.client.durationDisplayPrecision,
                tabsConfig               : me.tabsConfig,
                listeners                : {
                    cancel             : me.onCancel,
                    delete             : me.onDelete,
                    save               : me.onSave,
                    requestPropagation : me.onRequestPropagation,
                    thisObj            : me
                }
            }, me.editorConfig));
        }

        return me.editor;
    }

    load(taskRecord) {
        const me = this,
            editor = me.getEditor(taskRecord);

        me._loading = true;

        me.record = taskRecord;
        editor.loadEvent(taskRecord);

        me._loading = false;
    }

    async save() {
        const
            me            = this,
            { scheduler } = me;

        if (me._editing) {
            const editor = me.getEditor();

            /**
             * Fires on the owning Scheduler Pro instance before a task is saved
             * @event beforeTaskSave
             * @param {SchedulerPro.view.ProScheduler} source The Scheduler Pro instance
             * @param {SchedulerPro.model.ProTaskModel} taskRecord The task about to be saved
             * @param {SchedulerPro.widget.TaskEditorBase} editor The editor widget
             * @preventable
             */
            if (!me.isValid || scheduler.trigger('beforeTaskSave', {
                taskRecord : me.record,
                editor     : editor
            }) === false) {
                return;
            }

            me.detachFromProject();

            const project = me.getProject();

            if (project.isPropagating()) {
                await project.waitForPropagateCompleted();
            }

            editor.beforeSave();

            me.commitStmTransaction();

            me.freeStm();

            // afterSave to happen only after the editor is fully invisible.
            editor.hide().then(() => editor.afterSave());

            me.resumeAutoSync(true);

            scheduler.element.classList.remove('b-taskeditor-editing');

            me._editing = false;
        }
    }

    async cancel() {
        const
            me            = this,
            { scheduler } = me;

        if (me._editing) {
            me._canceling = true;

            me.detachFromProject();

            const taskRecord = me.record;

            const project = me.getProject();

            if (project.isPropagating()) {
                await project.waitForPropagateCompleted();
            }

            const editor = me.getEditor();

            editor.beforeCancel();

            await editor.hide();

            me.rejectStmTransaction();

            me.disableStm();

            await project.propagate();

            me.freeStm();

            editor.afterCancel();

            me.resumeAutoSync(false);

            me.scheduler.element.classList.remove('b-taskeditor-editing');

            me._canceling = false;

            me._editing = false;

            scheduler.trigger('taskEditCanceled', { taskRecord, editor });
        }
    }

    async delete() {
        const me = this,
            editor = me.getEditor();

        /**
         * Fires on the owning Scheduler Pro before a task is deleted, return `false` to prevent it.
         * @event beforeTaskDelete
         * @param {SchedulerPro.view.ProScheduler} source The Scheduler Pro instance.
         * @param {SchedulerPro.model.ProTaskModel} taskRecord The record about to be deleted
         * @param {SchedulerPro.widget.TaskEditorBase} editor The editor widget
         * @preventable
         */
        if (me.scheduler.trigger('beforeTaskDelete', { taskRecord : me.record, editor }) === false) {
            return;
        }

        const project = me.getProject();

        if (project.isPropagating()) {
            await project.waitForPropagateCompleted();
        }

        me.detachFromProject();

        editor.beforeDelete();

        me.record.remove();

        me.freeStm();

        await project.propagate();

        me.resumeAutoSync(true);

        editor.hide();

        editor.afterDelete();

        me.scheduler.element.classList.remove('b-taskeditor-editing');

        me._editing = false;
    }

    resumeAutoSync(commit) {
        const
            me            = this,
            { scheduler } = me;

        scheduler.taskStore.autoCommit = me.schedulerAutoCommit;
        if (scheduler.taskStore.autoCommit && commit) {
            scheduler.taskStore.doAutoCommit();
        }

        scheduler.project.autoSync = me.schedulerAutoSync;
        if (scheduler.project.autoSync && commit) {
            scheduler.project.sync();
        }
    }

    onSave() {
        // There's might be propagation requested, so we giving the chance to start propagating
        // before we're doing save commit procedure.
        this.requestAnimationFrame(() => this.save());
    }

    onCancel() {
        // There's might be propagation requested, so we giving the chance to start propagating
        // before we're doing cancel rejection procedure.
        this.requestAnimationFrame(() => this.cancel());
    }

    onDelete() {
        // There's might be propagation requested, so we giving the chance to start propagating
        // before we're doing cancel rejection procedure.
        this.requestAnimationFrame(() => this.delete());
    }

    onRequestPropagation() {
        const project = this.getProject();

        // The propagation start is made asynchronous because it should have the lowest priority,
        // the propagation might be started by the engine as the result of record property setter call
        // (like setLag() for example). And then requested manually as the result of one of the tabs
        // grid cell editing feature editing complete. So we delay, and if the propagation will be run
        // at the next frame then we just skip.
        this.requestAnimationFrame(() => {
            if (!project.isPropagating()) {
                project.propagate();
            }
        });
    }

    attachToProject() {
        const me = this,
            project = me.getProject();

        me.detachFromProject();

        me._projectEventDetacher = project.on({
            loadstart           : () => me.save(),
            propagationStart    : me.onPropagationStart,
            propagationComplete : me.onPropagationComplete,
            thisObj             : me,
            detachable          : true
        });
    }

    detachFromProject() {
        if (this._projectEventDetacher) {
            this._projectEventDetacher();
            this._projectEventDetacher = null;
        }
    }

    onPropagationStart() {
        const editor = this.getEditor();
        editor.mask('Calculating…');
    }

    onPropagationComplete({ dryRun }) {
        const me = this;

        me.getEditor().unmask();

        // If record being edited was removed, hide
        if (me.isEditing && !me.getProject().taskStore.includes(me.record)) {
            me.save();
        }
        else if (!dryRun && !me._canceling) {
            me.load(me.record);
        }
    }

    //region Context menu

    getEventMenuItems({ eventRecord, resourceRecord, items }) {
        if (!this.scheduler.readOnly) {
            items.editEvent = {
                text     : this.L('L{Edit event}'),
                icon     : 'b-icon b-icon-edit',
                weight   : -200,
                disabled : this.disabled,
                onItem   : () => this.editEvent(eventRecord, resourceRecord)
            };
        }
    }

    //endregion

    //region Event navigation

    onEnterKey({ assignmentRecord, eventRecord }) {
        if (assignmentRecord) {
            this.editEvent(eventRecord, assignmentRecord.resource);
        }
        else if (eventRecord) {
            this.editEvent(eventRecord, eventRecord.resource);
        }
    }

    //endregion

    scrollEventIntoView(eventRecord, resourceRecord) {
        this.client.scrollResourceEventIntoView(resourceRecord, eventRecord);
    }

    get isValid() {
        const me = this;

        return me.editor.eachWidget(widget => {
            if (widget.isValid === true || widget.hidden || widget.disabled || (widget instanceof Field && !widget.name)) {
                return true;
            }

            return widget.isValid !== false;
        }, true);
    }
}

GridFeatureManager.registerFeature(ProTaskEdit, true, 'ProScheduler', 'EventEdit');
