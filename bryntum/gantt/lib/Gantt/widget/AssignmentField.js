import Combo from '../../Core/widget/Combo.js';
import PickerField from '../../Core/widget/PickerField.js';
import AssignmentPicker from './AssignmentPicker.js';
import AssignmentsManipulationStore from '../data/AssignmentsManipulationStore.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import WidgetHelper from '../../Core/helper/WidgetHelper.js';

/**
 * @module Gantt/widget/AssignmentField
 */

/**
 * Special field class to edit single event assignments.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Gantt.column.ResourceAssignmentColumn ResourceAssignmentColumn}
 *
 * @extends Core/widget/PickerField
 * @classType 'assignmentfield'
 */
export default class AssignmentField extends Combo {

    static get $name() {
        return 'AssignmentField';
    }

    static get type() {
        return 'assignmentfield';
    }

    //region Config
    static get defaultConfig() {
        return {
            chipView : {
                cls : 'b-assignment-chipview',
                itemTpl(assignment, i) {
                    return `${assignment.name} ${assignment.units}%`;
                },
                scrollable : {
                    overflowX : 'hidden-scroll'
                }
            },
            triggers : {
                expand : {
                    cls     : 'b-icon-down',
                    handler : 'onTriggerClick'
                }
            },
            multiSelect : true,
            clearable   : false, // TODO: change when it's back to editable
            editable    : false,
            value       : null,

            /**
             * Width of picker, defaults to this field's {@link Core/widget/PickerField#config-pickerAlignElement} width
             *
             * @config {Number}
             */
            pickerWidth  : null,
            /**
             * Event to load resource assignments for.
             * Either event or {@link #config-store store} should be given.
             *
             * @config {Gantt.model.TaskModel}
             */
            projectEvent : null,
            /**
             * Assignment manipulation store to use or it's configuration object.
             * Either store or {@link #config-projectEvent projectEvent} should be given
             *
             * @config {Core.data.Store|object}
             */
            store        : null
        };
    }
    //endregion

    // Any change must offer the save/cancel UI since THAT is what actually makes the edit
    onChipClose(records) {
        this.showPicker();

        // Showing the picker recreates the AssignmentsManipulationModels, so we
        // must find the corresponding new version to deassign.
        records.forEach(record => this.picker.grid.deselectRow(record));
    }

    syncInputFieldValue() {
        super.syncInputFieldValue();

        if (this.store) {
            this.tooltip = this.store.toValueString();
        }
    }

    //region Picker

    // Override. This field does not have a primary filter, so
    // down arrow/trigger click should just show the picker.
    onTriggerClick(event) {
        if (this.pickerVisible) {
            this.hidePicker();
        }
        else {
            PickerField.prototype.showPicker.call(this, event && ('key' in event));
        }
    }

    focusPicker() {
        this.picker.focus();
    }

    createPicker(picker) {
        const me = this;

        return WidgetHelper.createWidget(Object.assign({
            type         : AssignmentPicker.type,
            projectEvent : me.projectEvent,
            store        : me.store,
            readOnly     : me.readOnly,
            owner        : me,
            forElement   : me[me.pickerAlignElement],
            floating     : true,
            scrollAction : 'realign',
            assignments  : me.valueCollection,
            align        : {
                align    : 't0-b0',
                axisLock : true,
                anchor   : me.overlayAnchor,
                target   : me[me.pickerAlignElement]
            }
        }, picker));
    }

    //endregion

    //region Value
    get projectEvent() {
        return this._projectEvent;
    }

    set projectEvent(projectEvent) {
        const me = this;

        me._projectEvent = projectEvent;
        me._projectEventGeneration = projectEvent.generation;

        me.store.projectEvent = me.picker.projectEvent = projectEvent;
    }

    get store() {
        if (!this._store) {
            this.store = {};
        }

        return this._store;
    }

    set store(store) {
        const me = this;

        if (store !== me._store) {
            if (store instanceof AssignmentsManipulationStore) {
                me._store = store;
                me.projectEvent = store.projectEvent;
            }
            else if (store) {
                me._store = new AssignmentsManipulationStore(store);
                me._store.projectEvent = me.projectEvent; // This is to not do the store::fillFromMaster() call, otherwise editor will be unhappy
            }
        }
    }

    // The AssignmentPicker's "Save" button applies the change to the task
    // being edited immediately. The field's value has no bearing and
    // the Editor's completeEdit will find no change upon complete.
    get value() {}

    set value(v) {}
    //endregion

    // Override. Picker is completely self-contained. Prevent any
    // field action on its key events.
    onPickerKeyDown(event) {
        const grid = this.picker.grid;

        // Move "down" into the grid body
        if (event.key === 'ArrowDown' && event.target.compareDocumentPosition(grid.bodyContainer) === document.DOCUMENT_POSITION_FOLLOWING) {
            grid.element.focus();
        }
    }
}

BryntumWidgetAdapterRegister.register(AssignmentField.type, AssignmentField);
