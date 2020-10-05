import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Popup from '../../Core/widget/Popup.js';
import Toast from '../../Core/widget/Toast.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';
import IdHelper from '../../Core/helper/IdHelper.js';
import ReadyStatePropagator from '../widget/taskeditor/mixin/ReadyStatePropagator.js';
import './taskeditor/SchedulerGeneralTab.js';
import './taskeditor/GeneralTab.js';
import './taskeditor/SuccessorsTab.js';
import './taskeditor/PredecessorsTab.js';
import './taskeditor/ResourcesTab.js';
import './taskeditor/AdvancedTab.js';
import './taskeditor/NotesTab.js';

/**
 * @module SchedulerPro/widget/TaskEditorBase
 */

/**
 * Abstract base class for Scheduler and Gantt task editors
 *
 * @extends Core/widget/Popup
 */
export default class TaskEditorBase extends ReadyStatePropagator(Popup) {

    static get $name() {
        return 'TaskEditorBase';
    }

    static get defaultConfig() {
        return {
            localeClass : this,
            title       : 'L{Information}',
            width       : this.L('L{editorWidth}'),
            cls         : 'b-schedulerpro-taskeditor',
            closable    : true,
            draggable   : {
                handleSelector : ':not(button,.b-field-inner)' // blacklist butons and field inners
            },
            axisLock  : 'flexible',
            autoClose : true,
            onChange  : null,
            onCancel  : null,
            onSave    : null,
            autoShow  : false,
            // Required to save editor widget height when switching between tabs, some of which may want to stretch it
            height    : '30em',

            closeAction : 'cancelAndHide',

            items : null, // overriden in subclasses

            bbar : [
                {
                    text        : 'L{Save}',
                    localeClass : this,
                    type        : 'button',
                    color       : 'b-green',
                    ref         : 'saveButton'
                },
                {
                    text        : 'L{Delete}',
                    localeClass : this,
                    type        : 'button',
                    color       : 'b-gray',
                    ref         : 'deleteButton'
                },
                {
                    text        : 'L{Object.Cancel}',
                    localeClass : this,
                    type        : 'button',
                    color       : 'b-gray',
                    ref         : 'cancelButton'
                }
            ],

            /**
             * Duration field/columns decimal precision
             */
            durationDecimalPrecision : 1,

            /**
             * Config object specifying widgets for tabs in task editor. Every tab accepts array of widgets/widget configs.
             * Tab names are:
             *  * schedulergeneraltab
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * advancedtab
             *  * notestab
             *
             *  Example:
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
             *       }
             *     }
             *   }
             * });
             * ```
             * @config {Object}
             */
            extraItems : null,

            /**
             * A configuration object used to configure the built-in tabs or to add custom tab(s).
             * The individual configuration objects of the tabs contained in {@link #config-tabsConfig tabsConfig}
             * are keyed by tab names and are merged with the default built-in configurations.
             *
             *
             * Built-in tab names are:
             *  * schedulergeneraltab
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * advancedtab
             *  * notestab
             *
             * The built-in tabs can be individually switched on or off, customized,
             * or new custom tab(s) can be added.
             *
             * Example:
             * ```
             * new ProScheduler({
             *   features : {
             *     taskEdit : {
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
             * @config {Object}
             */
            tabsConfig : null,

            /**
             * This config has been deprecated in favour of {@link #config-extraItems}.
             * @deprecated 1.0.1
             * @config {String|Object[]}
             * @category Editor widgets
             */
            extraWidgets : null,

            defaultTabs : null,

            project : null
        };
    }

    get extraWidgets() {
        console.warn('`extraWidgets` was deprecated in 1.0.1, please change your code to use `extraItems`');
        return this.extraItems;
    }

    set extraWidgets(widgets) {
        console.warn('`extraWidgets` was deprecated in 1.0.1, please change your code to use `extraItems`');
        this.extraItems = widgets;
    }

    // This method is called for every child widget in the task editor
    processWidgetConfig(widgetConfig) {
        const me = this;

        if (widgetConfig.type?.includes('date') && widgetConfig.weekStartDay == null) {
            widgetConfig.weekStartDay = me.weekStartDay;
        }

        // TODO: find a better way to pass through duration display precession
        switch (widgetConfig.ref) {
            case 'startDateField':
            case 'endDateField':
                widgetConfig.project = me.project;
                break;
            case 'fullDurationField':
                widgetConfig.decimalPrecision = me.durationDecimalPrecision;
                break;
            case 'predecessorstab-grid':
            case 'successorstab-grid':
                widgetConfig.durationDisplayPrecision = me.durationDisplayPrecision;
                break;
            case 'tabs':
                widgetConfig.items.forEach(cfg => {
                    cfg.extraItems = (me.extraItems || {})[cfg.type];
                });
                break;
        }
        // ----

        if (widgetConfig.ref === 'deleteButton' && !me.showDeleteButton) {
            return false;
        }

        return widgetConfig;
    }

    // Called before instances of items are created. Implements support of tabsConfig.
    startConfigure(config) {
        const
            tabsConfig = config.tabsConfig || {},
            tabs       = ObjectHelper.clone(config.defaultTabs);

        Object.keys(tabsConfig).forEach(tabType => {
            let index;
            const
                config = tabsConfig[tabType],
                tab    = tabs.find((t, i) => {
                    index = i;
                    return (tabType || '').toLowerCase() === t.type;
                });

            if (tab) {
                // remove unwanted tab
                if (config === false) {
                    tabs.splice(index, 1);
                }
                // apply custom config to the default tab
                else if (typeof (config) === 'object') {
                    Object.assign(tab, config);
                }
            }
            // add the custom tab
            else {
                tabs.push(config);
            }
        });

        // mutate tabpanel config
        config.items[0].items = tabs;

        super.startConfigure(config);

    } // eo function startConfigure

    afterConfigure() {
        const
            me                                         = this,
            widgetMap                                  = me.widgetMap,
            bbarWidgets                                = (me.bbar && me.bbar.widgetMap) || {},
            { cancelButton, deleteButton, saveButton } = bbarWidgets;

        saveButton && saveButton.on('click', me.onSaveClick, me);
        cancelButton && cancelButton.on('click', me.onCancelClick, me);
        deleteButton && deleteButton.on('click', me.onDeleteClick, me);

        Object.values(widgetMap).forEach(w => {
            if (w.isEventChangePropagator) {
                w.on('requestPropagation', me.onPropagationRequested, me);
            }
            if (w.isReadyStatePropagator) {
                w.on('readystatechange', me.onReadyStateChange, me);
            }
        });

        LocaleManager.on({
            locale  : me.onLocaleChange,
            thisObj : me
        });
    }

    onSaveClick() {
        if (this.canSave) {
            this.trigger('save');
        }
        else {
            Toast.show({
                html : this.L('L{saveError}')
            });
        }
    }

    onCancelClick() {
        this.trigger('cancel');
    }

    onDeleteClick() {
        this.trigger('delete');
    }

    onPropagationRequested() {
        this.trigger('requestPropagation');
    }

    onReadyStateChange({ source, canSave }) {
        this.requestReadyStateChange();

        if (!source.couldSaveTitle) {
            source.couldSaveTitle = source.title;
        }

        if (source.parent === this.widgetMap.tabs) {
            if (canSave) {
                source.titleElement.classList.remove('b-invalid');
                source.title = source.couldSaveTitle;
                source.couldSaveTitle = null;
            }
            else {
                source.titleElement.classList.add('b-invalid');
                source.title = `<span class='b-icon b-icon-warning'></span>${source.couldSaveTitle}`;
            }
        }
    }

    get canSave() {
        let canSave = true;

        // If widget report it can't both save and cancel then there's no reason to walk through others
        Object.values(this.widgetMap).forEach(w => {
            if (w.isReadyStatePropagator) {
                canSave = canSave && w.canSave;
            }
        });

        return canSave;
    }

    get canCancel() {
        let canCancel = true;

        // If widget report it can't both save and cancel then there's no reason to walk through others
        Object.values(this.widgetMap).forEach(w => {
            if (w.isReadyStatePropagator) {
                canCancel = canCancel && w.canCancel;
            }
        });

        return canCancel;
    }

    cancelAndHide() {
        // this handler will trigger 'cancel' event, which is caught by taskedit feature, which will cancel changes
        // and that cancel also hides editor
        this.onCancelClick();
    }

    /**
     * Loads a task model into the editor
     *
     * @param {SchedulerPro.model.ProTaskModel} record
     */
    loadEvent(record) {
        this.eachWidget(w => {
            if (typeof w.loadEvent === 'function') {
                w.loadEvent(record);
            }
            return true;
        });
    }

    beforeSave() {
        this.callWidgetHook('beforeSave');
    }

    afterSave() {
        this.callWidgetHook('afterSave');
    }

    beforeCancel() {
        this.callWidgetHook('beforeCancel');
    }

    afterCancel() {
        this.callWidgetHook('afterCancel');
    }

    beforeDelete() {
        this.callWidgetHook('beforeDelete');
    }

    afterDelete() {
        this.callWidgetHook('afterDelete');
    }

    callWidgetHook(name, args = []) {
        this.eachWidget(w => {
            if (typeof w[name] === 'function') {
                w[name](...args);
            }
        });
    }

    onInternalKeyDown(event) {
        if (event.key === 'Enter' && this.saveAndCloseOnEnter && event.target.tagName.toLowerCase() === 'input') {
            if (event.target.matches('input')) {

                // Enter might have been pressed right after field editing so we need to process the changes (Fix for #166)
                const field = IdHelper.fromElement(event.target);
                if (field && field.internalOnChange) {
                    field.internalOnChange();
                }
            }

            // this prevents field events so the new value would not be processed without above call to internalOnChange
            // Need to prevent this key events from being fired on whatever receives focus after the editor is hidden
            event.preventDefault();

            this.onSaveClick();
        }

        super.onInternalKeyDown(event);
    }

    //region Localization
    onLocaleChange() {
        this.width = this.L('L{editorWidth}');
    }

    //endregion
}
