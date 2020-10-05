import Grid from '../../Grid/view/Grid.js';
import NumberColumn from '../../Grid/column/NumberColumn.js';
import AssignmentManipulationStore from '../data/AssignmentsManipulationStore.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import '../../Core/widget/Checkbox.js';
import '../../Grid/feature/FilterBar.js';

/**
 * @module Gantt/widget/AssignmentGrid
 */

/**
 * This grid visualizes and edits current {@link #config-projectEvent events} assignments.
 *
 * @extends Grid/view/Grid
 * @classType assignmentgrid
 */
export default class AssignmentGrid extends Grid {

    static get $name() {
        return 'AssignmentGrid';
    }

    static get type() {
        return 'assignmentgrid';
    }

    //region Config
    static get defaultConfig() {
        return {
            selectionMode : {
                rowCheckboxSelection : true,
                multiSelect          : true,
                showCheckAll         : true
            },
            columns : [
                {
                    cls        : 'b-assignmentgrid-resource-column',
                    field      : 'resourceId',
                    flex       : 1,
                    editor     : null,
                    renderer   : p => p.record.name,
                    filterable : {
                        filterField : {
                            placeholder : this.L('L{Name}'),
                            triggers    : {
                                filter : {
                                    align : 'start',
                                    cls   : 'b-icon b-icon-filter'
                                }
                            }
                        },
                        filterFn : ({ value, record }) => {
                            return record.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                        }
                    },
                    sortable : (lhs, rhs) => lhs.name < rhs.name ? -1 : lhs.name > rhs.name  ? 1 : 0
                },
                {
                    field      : 'units',
                    type       : NumberColumn.type,
                    text       : this.L('L{Units}'),
                    width      : 70,
                    min        : 0,
                    max        : 100,
                    step       : 10,
                    unit       : '%',
                    renderer   : ({ value }) => this.L('L{unitsTpl}', { value }),
                    filterable : false
                }
            ],

            // If enabled blocks header checkbox click event
            features : {
                group       : false,
                filterBar   : true,
                contextMenu : false
            },

            disableGridRowModelWarning : true,

            /**
             * Event model to manipulate assignments of, the task should be part of a task store.
             * Either task or {@link Grid/view/Grid#config-store store} should be given.
             *
             * @config {Gantt.model.TaskModel}
             */
            projectEvent : null
        };
    }
    //endregion

    construct() {
        super.construct(...arguments);

        this.on('selectionchange', ({ selected, deselected }) => {
            selected.forEach(resourceManipulationRecord => resourceManipulationRecord.assigned = true);
            deselected.forEach(resourceManipulationRecord => resourceManipulationRecord.assigned = false);
        });
    }

    get projectEvent() {
        const me = this,
            store = me.store;

        let projectEvent = me._projectEvent;

        if (store && (projectEvent !== store.projectEvent)) {
            projectEvent = me._projectEvent = store.projectEvent;
        }

        return projectEvent;
    }

    set projectEvent(projectEvent) {
        this._projectEvent = projectEvent;

        this.store.projectEvent = projectEvent;

        this.selectedRecords = this.store.originalAssignmentManipulationRecords;
    }

    get store() {
        return super.store;
    }

    set store(store) {
        const me = this,
            oldStore = me.store;

        if (oldStore !== store) {
            if (!(store instanceof AssignmentManipulationStore)) {
                store = new AssignmentManipulationStore(Object.assign({
                    projectEvent : me._projectEvent
                }, store));
            }

            super.store = store;
        }
    }
}

BryntumWidgetAdapterRegister.register(AssignmentGrid.type, AssignmentGrid);
