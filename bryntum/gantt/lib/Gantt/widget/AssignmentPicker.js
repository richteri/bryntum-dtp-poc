import AssignmentGrid from './AssignmentGrid.js';
import Panel from '../../Core/widget/Panel.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import '../../Core/widget/Container.js';
import '../../Core/widget/Button.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/widget/AssignmentPicker
 */

/**
 * Class for assignment field dropdown, wraps {@link Gantt/widget/AssignmentGrid} within a frame and adds two buttons: Save and Cancel
 * @private
 */
export default class AssignmentPicker extends Panel {

    static get $name() {
        return 'AssignmentPicker';
    }

    static get type() {
        return 'assignmentpicker';
    }

    static get defaultConfig() {
        return {
            /**
             * A config object used to modify the {@link Gantt.widget.AssignmentGrid assignment grid}
             * used to select resourtces to assign.
             *
             * This config is merged with the configuration of the picker's assignment grid, so features
             * can be added (or default features removed by using `featureName : false`).
             *
             * Any `columns` provided are concatenated onto the default column set.
             * @config {Object} [grid]
             */
            grid      : null,
            focusable : true,
            trapFocus : true,
            height    : '20em',
            minWidth  : '25em',
            items     : [{
                ref  : 'grid',
                type : AssignmentGrid.type
            }],
            bbar : [
                {
                    type        : 'button',
                    text        : this.L('L{Object.Save}'),
                    localeClass : this,
                    ref         : 'saveBtn',
                    color       : 'b-green'
                },
                {
                    type        : 'button',
                    text        : this.L('L{Object.Cancel}'),
                    localeClass : this,
                    ref         : 'cancelBtn',
                    color       : 'b-gray'
                }
            ],
            /**
             * Event to load resource assignments for.
             * Either event or {@link #config-store store} should be given.
             *
             * @config {Gantt.model.TaskModel}
             */
            projectEvent : null,

            /**
             * Store for the picker.
             * Either store or {@link #config-projectEvent projectEvent} should be given
             *
             * @config {Gantt.data.AssignmentsManipulationStore}
             */
            store : null
        };
    }

    afterConfigure() {
        const me = this;

        super.afterConfigure();

        me.bbar.widgetMap.saveBtn.on('click', me.onSaveClick, me);
        me.bbar.widgetMap.cancelBtn.on('click', me.onCancelClick, me);
    }

    // Override, default focus to the filter field
    get focusElement() {
        return this.element.querySelector('input[type=text]');
    }

    get grid() {
        return this.isConfiguring ? this._grid : this.widgetMap.grid;
    }

    set grid(grid) {
        this._grid = grid;
    }

    get projectEvent() {
        return this._projectEvent;
    }

    set projectEvent(projectEvent) {
        this._projectEvent = projectEvent;

        if (this.grid) {
            this.grid.projectEvent = projectEvent;
        }
    }

    createWidget(config) {
        if (config && config.ref === 'grid') {
            const
                me              = this,
                gridClassConfig = BryntumWidgetAdapterRegister.getClass(config.type).defaultConfig;

            // During configuration, this will return the config passed in,
            // not the grid instance (which won't exist at that time)
            let gridExtraConfig = me.grid;

            if (gridExtraConfig) {
                // Columns is an array, and won't merge, so concat it before.
                if (gridExtraConfig.columns) {
                    config.columns = [...gridClassConfig.columns, ...gridExtraConfig.columns];

                    // We must not mutate config objects owned by outside classes.
                    gridExtraConfig = Object.assign({}, gridExtraConfig);
                    delete gridExtraConfig.columns;
                }

                // Merge the AssignmentField's grid config into the default.
                ObjectHelper.merge(config, gridExtraConfig);
            }

            config.projectEvent             = me.projectEvent;
            config.store                    = me.store;
            config.selectedRecordCollection = me.assignments;
        }

        return super.createWidget(config);
    }

    //region Event handlers
    onSaveClick() {
        this.store.applyChanges();
        this.hide();
    }

    onCancelClick() {
        this.hide();
    }
    //endregion
}

BryntumWidgetAdapterRegister.register(AssignmentPicker.type, AssignmentPicker);
