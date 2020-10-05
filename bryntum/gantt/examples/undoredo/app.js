import '../_shared/shared.js'; // not required, our example styling etc.
import '../../lib/Core/widget/Splitter.js';
import '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/column/AllColumns.js';
import '../../lib/Gantt/data/TaskStore.js';
import '../../lib/Gantt/data/DependencyStore.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import Container from '../../lib/Core/widget/Container.js';
import StringHelper from '../../lib/Core/helper/StringHelper.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import TaskModel from '../../lib/Gantt/model/TaskModel.js';
import DependencyModel from '../../lib/Gantt/model/DependencyModel.js';
import TreeGrid from '../../lib/Grid/view/TreeGrid.js';
import BryntumWidgetAdapterRegister from '../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import Collection from '../../lib/Core/util/Collection.js';

/**
 * Special collection class used in {@link #ActionsGrid} to allow only single top level item to be selected.
 */
class ActionsCollection extends Collection {

    splice(index = 0, toRemove, ...toAdd) {

        const me = this,
            lengthAfter = me.count - (Array.isArray(toRemove) ? toRemove.length : toRemove) + toAdd.length;

        // Collection must always has 1 action selected
        if (lengthAfter === 1) {
            // Collection doesn't allow adding more then 1 element
            // Only Initial state (id=-1) or parent nodes are allowed
            if (toAdd.length === 0 || (toAdd.length === 1 && (toAdd[0].id === -1 || toAdd[0].isParent))) {
                super.splice(index, toRemove, ...toAdd);
            }
        }
    }
}

/**
 * Actions grid contains list of undo/redo transactions available to switch to and actions
 * constituting them.
 */
class ActionsGrid extends TreeGrid {
    static get type() {
        return 'actionsgrid';
    }

    static get defaultConfig() {
        return {
            readOnly : true,
            features : {
                cellEdit : false
            },

            recordCollection : new ActionsCollection(),

            store : {
                fields : ['idx', 'title', 'changes'],
                data   : [{
                    id      : -1,
                    idx     : 0,
                    title   : 'Initial state',
                    changes : ''
                }]
            },

            selectedCell : { id : -1 },

            columns : [
                { text : '#', field : 'idx', width : '1em', sortable : false },
                { text : 'Action', field : 'title', flex : 0.4, type : 'tree', sortable : false },
                { text : 'Changes', field : 'changes', flex : 0.6, sortable : false }
            ]
        };
    }
}

// The newly created widget (ActionsGrid) should be registered. This allows us insert widget
// into a container using just simple JSON-like configuration object.
BryntumWidgetAdapterRegister.register(ActionsGrid.type, ActionsGrid);

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

// Primary application container. Contains two widgets: Gantt and Actions grid.
const container = new Container({
    appendTo : 'container',

    flex  : '1 1 100%',
    style : {
        flexWrap : 'nowrap'
    },

    items : [
        {
            ref : 'gantt',

            type : 'gantt',

            flex : '1 1 auto',

            project,

            columns : [
                { type : 'wbs' },
                { type : 'name', field : 'name', text : 'Name', width : 250 },
                { type : 'startdate', text : 'Start date' },
                { type : 'duration', text : 'Duration' },
                {
                    text  : 'Predecessors',
                    type  : 'predecessor',
                    width : 112
                },
                {
                    text  : 'Successors',
                    type  : 'successor',
                    width : 112
                },
                {
                    type : 'addnew'
                }
            ],

            subGridConfigs : {
                locked : {
                    width : 420
                }
            },

            loadMask : 'Loading tasks...'

        },
        {
            type : 'splitter'
        },
        {
            ref  : 'actionsGrid',
            type : 'actionsgrid',
            flex : '0 0 30em'
        }
    ]
});

const
    gantt       = container.widgetMap.gantt,
    actionsGrid = container.widgetMap.actionsGrid,
    actionStore = actionsGrid.store,
    // Obtaining State Tracking Manager instance we will be using to track tasks and dependencies store state.
    stm = gantt.project.stm;

// Disabling State Tracking Manager initially to not record normalization transaction
stm.disable();
// State Tracking Manager provide us with possibility to create custom title for each transaction
stm.getTransactionTitle = (transaction) => {
    return `Transaction ${stm.position + 1}`;
};
// Adding event listeners to update GUI accordingly
stm.on({
    // This event handler will be called each time a transaction recording stops.
    // Upon this event we:
    // - add a new transaction into the Actions grid store as well as we add
    //   transaction constituting actions as transaction node children.
    // - update undo/redo controls
    // - select the transaction currently
    recordingstop({ stm, transaction }) {
        // Because of the selection's ActionsCollection's insistence on NOT
        // removing a selected record, we must gather the toRemove records
        // before adding and selecting the new one, then remove them.
        const toRemove = actionStore.rootNode.children.slice(stm.position);

        const action = actionStore.rootNode.insertChild({
            idx      : stm.position,
            title    : transaction.title,
            changes  : transaction.length > 1 ? `${transaction.length} steps` : `${transaction.length} step`,
            expanded : false,
            // Here we analyze transaction actions queue and provide a corresponding title for each
            // action record for better user experience. Similar thing can be done for entire transaction title.
            children : transaction.queue.map((action, idx) => {
                let { type, parentModel, model, modelList, newData } = action,
                    title = '', changes = '';

                if (!model) {
                    if (parentModel) {
                        model = parentModel;
                    }
                    else {
                        model = modelList[modelList.length - 1];
                    }
                }

                if (type === 'UpdateAction' && model instanceof ProjectModel) {
                    title = 'Update project';
                    changes = StringHelper.safeJsonStringify(newData);
                }
                else if (type === 'UpdateAction' && model instanceof TaskModel) {
                    title = 'Edit task ' + model.name;
                    changes = StringHelper.safeJsonStringify(newData);
                }
                else if (type === 'AddAction' && model instanceof TaskModel) {
                    title = 'Add task ' + model.name;
                }
                else if (type === 'RemoveAction' && model instanceof TaskModel) {
                    title = 'Remove task ' + model.name;
                }
                else if (type === 'UpdateAction' && model instanceof DependencyModel) {
                    if (model.sourceEvent && model.targetEvent) {
                        title = `Edit link ${model.sourceEvent.name} -> ${model.targetEvent.name}`;
                    }
                    else {
                        title = 'Edit link';
                    }
                    changes = StringHelper.safeJsonStringify(newData);
                }
                else if (type === 'AddAction' && model instanceof DependencyModel) {
                    title = `Link ${model.sourceTask.name} -> ${model.targetTask.name}`;
                }
                else if (type === 'RemoveAction' && model instanceof DependencyModel) {
                    const
                        sourceEvent = model.sourceEvent || gantt.taskStore.getById(model.from),
                        targetEvent = model.targetEvent || gantt.taskStore.getById(model.to);

                    if (sourceEvent && targetEvent) {
                        title = `Unlink ${sourceEvent.name} -> ${targetEvent.name}`;
                    }
                    else {
                        title = 'Unlink tasks';
                    }
                }
                else if (type === 'InsertChildAction') {
                    title = `Insert task ${model.name} at ${action.insertIndex} posiiton`;
                }

                return {
                    idx     : `${stm.position}.${idx + 1}`,
                    title   : title,
                    changes : changes
                };
            })
        }, toRemove[0]);

        updateUndoRedoControls();

        actionsGrid.selectedRecord = action;

        // Remove after because the selection insists on having at least one selected record
        if (toRemove.length) {
            actionStore.rootNode.removeChild(toRemove);
        }
    },

    // This event is fired each time a transaction restoring stops i.e. when state is restored to
    // a particular transaction. Here we update undo/redo controls and select the transaction currently
    // we are at in the Actions grid.
    restoringstop({ stm }) {
        const action = actionStore.rootNode.children[stm.position];

        updateUndoRedoControls();

        actionsGrid.selectedRecord = action;
    },

    stmDisabled() {
        updateUndoRedoControls();
    }
});

// Registering `selectionchange` event handler to restore application data model state to a particular
// Action grid selected transaction.
actionsGrid.on({
    selectionchange : () => {
        const action = actionsGrid.selectedRecord;

        if (action && action.parent.isRoot) {
            // Actions grid always will have one item selected
            const idx = action.idx;

            if (stm.position < idx) {
                stm.redo(idx - stm.position);
            }
            else if (stm.position > idx) {
                stm.undo(stm.position - idx);
            }
        }
    }
});

// This will add Undo/Redo buttons to the example tools area.
WidgetHelper.append([
    {
        id       : 'undoBtn',
        type     : 'button',
        icon     : 'b-icon b-fa b-fa-undo',
        color    : 'b-blue b-raised',
        text     : 'Undo',
        tooltip  : 'Undo',
        disabled : true,
        onAction : () => {
            stm.canUndo && stm.undo();
        }
    },
    {
        id       : 'redoBtn',
        type     : 'button',
        icon     : 'b-icon b-fa b-fa-redo',
        color    : 'b-blue b-raised',
        text     : 'Redo',
        tooltip  : 'Redo',
        disabled : true,
        onAction : () => {
            stm.canRedo && stm.redo();
        }
    }
], {
    insertFirst : document.getElementById('tools') || document.body
});

// The functions updates state and badges of Undo/Redo buttons depending
// on State Tracking Manager properties
const updateUndoRedoControls = () => {
    const undoBtn = WidgetHelper.getById('undoBtn');
    const redoBtn = WidgetHelper.getById('redoBtn');

    undoBtn.badge = stm.position || '';
    redoBtn.badge = (stm.length - stm.position)  || '';

    undoBtn.disabled = !stm.canUndo;
    redoBtn.disabled = !stm.canRedo;
};

project.load()
    .then(() => {
        stm.enable();
        stm.autoRecord = true;
    });

window.stm = stm;
