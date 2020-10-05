import Container from '../../../Core/widget/Container.js';
import Delayable from '../../../Core/mixin/Delayable.js';
import Toast from '../../../Core/widget/Toast.js';
import EventLoader from './mixin/EventLoader.js';
import EventChangePropagator from './mixin/EventChangePropagator.js';
import ReadyStatePropagator from './mixin/ReadyStatePropagator.js';
import { TimeUnit, DependencyType } from '../../../Engine/scheduling/Types.js';
import '../DependencyTypePicker.js';
import '../../column/DurationColumn.js';
import '../ModelCombo.js';
import TaskEditorTab from './mixin/TaskEditorTab.js';
import '../../../Grid/view/Grid.js';

/**
 * @module Gantt/widget/taskeditor/DependencyTab
 */

const markDependencyValid = (dep, grid) => {
    dep.instanceMeta(grid).valid = true;
};

const markDependencyInvalid = (dep, grid) => {
    dep.instanceMeta(grid).valid = false;
};

const isDependencyMarkedValid = (dep, grid) => {
    return dep.instanceMeta(grid).valid !== false;
};

/**
 * @internal
 */
export default class DependencyTab extends ReadyStatePropagator(EventChangePropagator(TaskEditorTab(EventLoader(Delayable(Container))))) {

    static get $name() {
        return 'DependencyTab';
    }

    static makeDefaultConfig(direction) {
        const
            ref          = direction === 'fromEvent' ? 'predecessorstab' : 'successorstab',
            negDirection = direction === 'fromEvent' ? 'toEvent' : 'fromEvent';

        return {
            direction,

            negDirection,

            ref,

            localeClass : this,

            title : direction === 'fromEvent' ? 'L{Predecessors}' : 'L{Successors}',

            layoutStyle : {
                flexFlow : 'column nowrap'
            },

            items : [
                {
                    type  : 'container',
                    flex  : '0 0 auto',
                    items : [
                        {
                            type : 'button',
                            cls  : 'b-add-button b-green',
                            icon : 'b-icon b-icon-add',
                            ref  : `${ref}-add`
                        },
                        {
                            type     : 'button',
                            cls      : 'b-remove-button b-red',
                            icon     : 'b-icon b-icon-trash',
                            disabled : true,
                            ref      : `${ref}-remove`
                        }
                    ]
                },
                {
                    type      : 'grid',
                    flex      : '1 1 auto',
                    ref       : `${ref}-grid`,
                    emptyText : '',
                    columns   : [
                        {
                            localeClass : this,
                            text        : 'L{ID}',
                            flex        : 1,
                            editor      : false,
                            htmlEncode  : false,
                            renderer({ record : dependency, row, grid }) {
                                let html;

                                if (isDependencyMarkedValid(dependency, grid)) {
                                    const event = dependency[direction];
                                    html = !event || event.hasGeneratedId ? '*' : event.id;
                                }
                                else {
                                    row.addCls('b-invalid');
                                    html = '<div class="b-icon b-icon-warning"></div>';
                                }

                                return html;
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Name}',
                            field       : direction,
                            flex        : 5,
                            renderer({ value }) {
                                return value && value.name || '';
                            },
                            editor : {
                                type         : 'modelcombo',
                                displayField : 'name',
                                valueField   : 'id',
                                editable     : false,
                                allowInvalid : true
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Type}',
                            field       : 'type',
                            flex        : 3,
                            editor      : 'dependencytypepicker',
                            renderer({ value }) {
                                return this.L('L{SchedulerProCommon.dependencyTypesLong}')[value];
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Lag}',
                            type        : 'duration',
                            field       : 'fullLag',
                            flex        : 2,
                            editor      : {
                                allowNegative : true
                            }
                        }
                    ],

                    disableGridRowModelWarning : true
                }
            ]
        };
    }

    afterConstruct() {
        super.afterConstruct();

        const
            me           = this,
            addButton    = me.addButton = me.widgetMap[`${me.ref}-add`],
            removeButton = me.removeButton = me.widgetMap[`${me.ref}-remove`],
            grid         = me.grid = me.widgetMap[`${me.ref}-grid`];

        addButton && addButton.on('click', me.onAddClick, me);
        removeButton && removeButton.on('click', me.onRemoveClick, me);

        grid.on({
            selectionChange : me.onGridSelectionChange,
            startCellEdit   : me.onGridStartCellEdit,
            finishCellEdit  : me.onGridFinishCellEdit,
            cancelCellEdit  : me.onGridCancelCellEdit,
            thisObj         : me
        });
    }

    get dependencyGrid() {
        return this.widgetMap && this.widgetMap[`${this.ref}-grid`];
    }

    get taskCombo() {
        const
            grid = this.dependencyGrid,
            from = grid && grid.columns.get(this.direction);

        return from && from.editor;
    }

    loadEvent(eventRecord) {
        const
            me           = this,
            grid         = me.dependencyGrid,
            firstLoad    = !grid.store.isChained,
            recordChange = !firstLoad && (eventRecord !== me.record);

        //<debug>
        console.assert(
            firstLoad || grid.store.masterStore.getProject() === eventRecord.getProject(),
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        super.loadEvent(eventRecord);

        const
            taskCombo  = me.taskCombo,
            depStore   = me.getProject().getDependencyStore(),
            eventStore = me.getProject().getEventStore();

        // On first load, populate the chained stores.
        // Our grid store will contain only the direction of dependencies
        // this tab is interested in.
        // Our taskCombo only contains all events other than our event.
        // An event can't depend upon itself.
        if (firstLoad) {
            // Cache the mutation generation of the underlying data collection
            // so that we know when we need to refill the chained stores.
            me.depStoreGeneration = depStore.storage.generation;
            me.eventStoreGeneration = eventStore.storage.generation;

            grid.store = depStore.makeChained(
                d => d[me.negDirection] === me.record,
                null
            );

            taskCombo.store = eventStore.makeChained(
                // Remove original record from chained store, but keep those records that are already selected in the dependency grid
                e => e !== me.record,
                null,
                {
                    doRelayToMaster         : [],
                    // Need to show all records in the combo
                    excludeCollapsedRecords : false
                }
            );

            // Post process chained store and exclude records that are already selected in the dependency grid.
            // It's needed to be a separate filtering because otherwise when cell editor opens combo and sets initial value,
            // it cannot find it in the storage and adds new record.
            taskCombo.store.filterBy(e => !grid.store.find(d => d[me.direction] === e));

            taskCombo.on({
                thisObj : me,
                change  : 'onGridCellEditChange'
            });
        }
        else {
            // Only repopulate the chained stores if the master stores have changed
            // or if this is being loaded with a different record.
            if (recordChange || depStore.storage.generation !== me.depStoreGeneration) {
                grid.store.fillFromMaster();
                me.depStoreGeneration = depStore.storage.generation;
            }
            if (recordChange || eventStore.storage.generation !== me.eventStoreGeneration) {
                taskCombo.store.fillFromMaster();
                me.eventStoreGeneration = eventStore.storage.generation;
            }
        }

        me.requestReadyStateChange();
    }

    unshadowAll() {
        this.dependencyGrid.store.forEach(d => {
            if (d.isShadowed) {
                d.forEachFieldAtom(a => {
                    a.clearUserInput();
                });
                markDependencyValid(d, this.dependencyGrid);
                d.unshadow();
            }
        });
    }

    beforeSave() {
        this.unshadowAll();
        super.beforeSave();
    }

    beforeCancel() {
        const activeCellEdit = this._activeCellEdit;

        if (activeCellEdit) {
            // With invalidAction:'block', the cell editor will refuse to dismiss, but it cannot preventDefault on
            // tap of the Cancel button since the completeEdit process is async (and the preventDefault would need to
            // be done synchronously). This means that we can get here with an active editor, so we must cancel it
            // since the task editor is only hidden not destroyed.
            activeCellEdit.editor.cancelEdit();
        }

        this.unshadowAll();

        super.beforeCancel();
    }

    async insertNewDependency() {
        const
            me              = this,
            grid            = me.dependencyGrid,
            depStore        = grid.store,
            projectDepStore = me.getProject().getDependencyStore();

        // This call will be relayed to project dependency store.
        const [newDep] = depStore.insert(0, {
            type              : DependencyType.EndToStart,
            lag               : 0,
            lagUnit           : TimeUnit.Day,
            [me.negDirection] : me.record
        });

        // Reset the dependency store mutation monitor when we add a dependency
        me.depStoreGeneration = projectDepStore.storage.generation;

        grid.features.cellEdit.startEditing({ field : me.direction, id : newDep.id });

        markDependencyInvalid(newDep, grid);

        return newDep;
    }

    onAddClick() {
        this.insertNewDependency();
    }

    onRemoveClick() {
        const
            me              = this,
            toRemove        = me.dependencyGrid.selectedRecords,
            needPropagation = toRemove.some(r => !r.isShadowed());

        me.getProject().getDependencyStore().remove(toRemove);
        me.dependencyGrid.selectedRecords = null;
        me.taskCombo.store.fillFromMaster();
        me.removeButton.disable();

        if (needPropagation) {
            me.requestPropagation();
        }
    }

    onGridSelectionChange({ selection }) {
        if (selection && selection.length) {
            this.removeButton.enable();
        }
        else {
            this.removeButton.disable();
        }
    }

    clearActiveEditorErrors() {
        const
            me = this,
            activeCellEdit = me._activeCellEdit;

        if (activeCellEdit && activeCellEdit.column.field === me.direction) {
            activeCellEdit.editor.inputField.clearError();  // clears all errors
        }
    }

    onGridCellEditChange() {
        // Since we deposit some errors on the editor during startEdit (see onGridStartCellEdit), we must also clear
        // them eventually or the editor will refuse to accept any value. Since validation will still take place, we
        // don't need to worry about preventing the editor from dismissing nor could we realistically since validation
        // is async (see onGridFinishCellEdit).
        this.clearActiveEditorErrors();
    }

    onGridStartCellEdit({ editorContext }) {
        const
            me      = this,
            dep     = me._editingDependency = editorContext.record,
            depGrid = me.dependencyGrid,
            dir     = me.direction;

        me._activeCellEdit = editorContext;

        if (editorContext.column.field === dir) {
            if (!isDependencyMarkedValid(dep, depGrid)) {
                if (!dep[dir]) {
                    editorContext.editor.inputField.setError(me.L('L{Invalid dependency}'));
                }
                else {
                    editorContext.editor.inputField.setError(me.L('L{Cyclic dependency has been detected}'));
                }
            }
            else {
                me.clearActiveEditorErrors();
            }

            dep.shadow();
        }
    }

    onGridFinishCellEdit({ editorContext }) {
        const
            me      = this,
            { record : dependency, column } = editorContext,
            dir     = me.direction,
            depGrid = me.dependencyGrid;

        // Other dependency end
        if (column.field === dir) {
            if (dependency[dir]) {
                const projectDepStore = me.getProject().getDependencyStore();

                projectDepStore.isValidDependency({
                    [me.direction]    : dependency[me.direction],
                    [me.negDirection] : dependency[me.negDirection],
                    lag               : dependency.lag,
                    lagUnit           : dependency.lagUnit,
                    type              : dependency.type
                }).then(valid => {
                    if (valid) {
                        markDependencyValid(dependency, me.dependencyGrid);

                        dependency.unshadow();

                        me.taskCombo.store.fillFromMaster();

                        me.redrawDependencyRow(dependency); // Might not be needed

                        me.requestPropagation();

                        me.requestReadyStateChange();
                    }
                    else {
                        markDependencyInvalid(dependency, depGrid);
                        me.redrawDependencyRow(dependency);

                        Toast.show({
                            html : me.L('L{Cyclic dependency has been detected}')
                        });

                        me.requestReadyStateChange();
                    }
                });
            }
            else {
                markDependencyInvalid(dependency, depGrid);
                me.redrawDependencyRow(dependency);
                me.requestReadyStateChange();
            }
        }
        // Type and Lag
        else {
            me.redrawDependencyRow(dependency);

            if (dependency[dir] && isDependencyMarkedValid(dependency, depGrid)) {
                dependency.unshadow();
                me.requestPropagation();
            }

            me.requestReadyStateChange();
        }

        me._activeCellEdit = me._editingDependency = null;
    }

    onGridCancelCellEdit(data) {
        const me = this;

        if (me._editingDependency) {
            const
                dep     = me._editingDependency,
                depGrid = me.dependencyGrid;

            if (!dep[me.direction]) {
                markDependencyInvalid(dep, depGrid);
                me.redrawDependencyRow(dep);
            }
            else if (isDependencyMarkedValid(dep, depGrid)) {
                dep.unshadow();
            }

            me._activeCellEdit = me._editingDependency = null;
        }

        me.requestReadyStateChange();
    }

    redrawDependencyRow(dep) {
        const
            grid = this.dependencyGrid,
            row = grid.rowManager.getRowById(dep);
        // Might be out of view
        row && row.render(grid.store.indexOf(dep), dep);
    }

    get canSave() {
        const depGrid = this.dependencyGrid;

        return depGrid.store.reduce((r, d) => r && isDependencyMarkedValid(d, depGrid), true);
    }
}
