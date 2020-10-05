import { Toolbar, Toast, DateHelper, CSSHelper, Column, ColumnStore, TaskModel, WidgetHelper, Gantt, Panel, ProjectModel, EffectResolutionResult } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';

/**
 * @module GanttToolbar
 */

/**
 * @extends Core/widget/Toolbar
 */
class GanttToolbar extends Toolbar {

    static get $name() {
        return 'GanttToolbar';
    }

    construct(config) {
        const
            me      = this,
            gantt   = me.gantt = me.owner = config.gantt,
            project = gantt.project;

        project.on({
            load                : me.updateStartDateField,
            propagationComplete : me.updateStartDateField,
            thisObj             : me
        });

        const stm = project.stm;

        stm.on({
            recordingstop : me.updateUndoRedoButtons,
            restoringstop : me.updateUndoRedoButtons,
            stmDisabled   : me.updateUndoRedoButtons,
            queueReset    : me.updateUndoRedoButtons,
            thisObj       : me
        });

        super.construct(config);

        me.styleNode = document.createElement('style');
        document.head.appendChild(me.styleNode);
    }

    static get defaultConfig() {
        return {
            items : [
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-green',
                            ref      : 'addTaskButton',
                            icon     : 'b-fa b-fa-plus',
                            text     : 'Create',
                            tooltip  : 'Create new task',
                            onAction : 'up.onAddTaskClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'editTaskButton',
                            icon     : 'b-fa b-fa-pen',
                            text     : 'Edit',
                            tooltip  : 'Edit selected task',
                            onAction : 'up.onEditTaskClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'undoBtn',
                            icon     : 'b-icon b-fa b-fa-undo',
                            tooltip  : 'Undo',
                            disabled : true,
                            width    : '2em',
                            onAction : 'up.onUndoClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'redoBtn',
                            icon     : 'b-icon b-fa b-fa-redo',
                            tooltip  : 'Redo',
                            disabled : true,
                            width    : '2em',
                            onAction : 'up.onRedoClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'expandAllButton',
                            icon     : 'b-fa b-fa-angle-double-down',
                            tooltip  : 'Expand all',
                            onAction : 'up.onExpandAllClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'collapseAllButton',
                            icon     : 'b-fa b-fa-angle-double-up',
                            tooltip  : 'Collapse all',
                            onAction : 'up.onCollapseAllClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomInButton',
                            icon     : 'b-fa b-fa-search-plus',
                            tooltip  : 'Zoom in',
                            onAction : 'up.onZoomInClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomOutButton',
                            icon     : 'b-fa b-fa-search-minus',
                            tooltip  : 'Zoom out',
                            onAction : 'up.onZoomOutClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomToFitButton',
                            icon     : 'b-fa b-fa-compress-arrows-alt',
                            tooltip  : 'Zoom to fit',
                            onAction : 'up.onZoomToFitClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'previousButton',
                            icon     : 'b-fa b-fa-angle-left',
                            tooltip  : 'Previous time span',
                            onAction : 'up.onShiftPreviousClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'nextButton',
                            icon     : 'b-fa b-fa-angle-right',
                            tooltip  : 'Next time span',
                            onAction : 'up.onShiftNextClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'featuresButton',
                            icon       : 'b-fa b-fa-tasks',
                            text       : 'Features',
                            tooltip    : 'Toggle features',
                            toggleable : true,
                            menu       : {
                                onItem       : 'up.onFeaturesClick',
                                onBeforeShow : 'up.onFeaturesShow',
                                items        : [
                                    {
                                        text    : 'Draw dependencies',
                                        feature : 'dependencies',
                                        checked : false
                                    },
                                    {
                                        text    : 'Task labels',
                                        feature : 'labels',
                                        checked : false
                                    },
                                    {
                                        text    : 'Project lines',
                                        feature : 'projectLines',
                                        checked : false
                                    },
                                    {
                                        text    : 'Highlight non-working time',
                                        feature : 'nonWorkingTime',
                                        checked : false
                                    },
                                    {
                                        text    : 'Enable cell editing',
                                        feature : 'cellEdit',
                                        checked : false
                                    },
                                    {
                                        text    : 'Show baselines',
                                        feature : 'baselines',
                                        checked : false
                                    },
                                    {
                                        text    : 'Show rollups',
                                        feature : 'rollups',
                                        checked : false
                                    },
                                    {
                                        text    : 'Show progress line',
                                        feature : 'progressLine',
                                        checked : false
                                    },
                                    {
                                        text    : 'Hide schedule',
                                        cls     : 'b-separator',
                                        subGrid : 'normal',
                                        checked : false
                                    }
                                ]
                            }
                        },
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'settingsButton',
                            icon       : 'b-fa b-fa-cogs',
                            text       : 'Settings',
                            tooltip    : 'Adjust settings',
                            toggleable : true,
                            menu       : {
                                type        : 'popup',
                                anchor      : true,
                                cls         : 'settings-menu',
                                layoutStyle : {
                                    flexDirection : 'column'
                                },
                                onBeforeShow : 'up.onSettingsShow',

                                items : [
                                    {
                                        type      : 'slider',
                                        ref       : 'rowHeight',
                                        text      : 'Row height',
                                        width     : '12em',
                                        showValue : true,
                                        min       : 30,
                                        max       : 70,
                                        onInput   : 'up.onSettingsRowHeightChange'
                                    },
                                    {
                                        type      : 'slider',
                                        ref       : 'barMargin',
                                        text      : 'Bar margin',
                                        width     : '12em',
                                        showValue : true,
                                        min       : 0,
                                        max       : 10,
                                        onInput   : 'up.onSettingsMarginChange'
                                    },
                                    {
                                        type      : 'slider',
                                        ref       : 'duration',
                                        text      : 'Animation duration ',
                                        width     : '12em',
                                        min       : 0,
                                        max       : 2000,
                                        step      : 100,
                                        showValue : true,
                                        onInput   : 'up.onSettingsDurationChange'
                                    }
                                ]
                            }
                        },
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'criticalPathsButton',
                            icon       : 'b-fa b-fa-fire',
                            text       : 'Critical paths',
                            tooltip    : 'Highlight critical paths',
                            toggleable : true,
                            onAction   : 'up.onCriticalPathsClick'
                        }
                    ]
                },
                {
                    type      : 'datefield',
                    ref       : 'startDateField',
                    label     : 'Project start',
                    // required  : true, (done on load)
                    flex      : '1 2 17em',
                    listeners : {
                        change : 'up.onStartDateChange'
                    }
                },
                {
                    type                 : 'textfield',
                    ref                  : 'filterByName',
                    cls                  : 'filter-by-name',
                    flex                 : '1 1 12.5em',
                    // Label used for material, hidden in other themes
                    label                : 'Find tasks by name',
                    // Placeholder for others
                    placeholder          : 'Find tasks by name',
                    clearable            : true,
                    keyStrokeChangeDelay : 100,
                    triggers             : {
                        filter : {
                            align : 'end',
                            cls   : 'b-fa b-fa-filter'
                        }
                    },
                    onChange : 'up.onFilterChange'
                }
            ]
        };
    }

    updateUndoRedoButtons() {
        const
            { stm }              = this.gantt.project,
            { undoBtn, redoBtn } = this.widgetMap,
            redoCount            = stm.length - stm.position;

        undoBtn.badge = stm.position || '';
        redoBtn.badge = redoCount || '';

        undoBtn.disabled = !stm.canUndo;
        redoBtn.disabled = !stm.canRedo;
    }

    setAnimationDuration(value) {
        const
            me      = this,
            cssText = `.b-animating .b-gantt-task-wrap { transition-duration: ${value / 1000}s !important; }`;

        me.gantt.transitionDuration = value;

        if (me.transitionRule) {
            me.transitionRule.cssText = cssText;
        }
        else {
            me.transitionRule = CSSHelper.insertRule(cssText);
        }
    }

    updateStartDateField() {
        const startDateField = this.widgetMap.startDateField;

        startDateField.value = this.gantt.project.startDate;

        // This handler is called on project.load/propagationComplete, so now we have the
        // initial start date. Prior to this time, the empty (default) value would be
        // flagged as invalid.
        startDateField.required = true;
    }

    // region controller methods

    async onAddTaskClick() {
        const
            { gantt } = this,
            added = gantt.taskStore.rootNode.appendChild({ name : 'New task', duration : 1 });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        // scroll to the added task
        await gantt.scrollRowIntoView(added);

        gantt.features.cellEdit.startEditing({
            record : added,
            field  : 'name'
        });
    }

    onEditTaskClick() {
        const { gantt } = this;

        if (gantt.selectedRecord) {
            gantt.editTask(gantt.selectedRecord);
        }
        else {
            Toast.show('First select the task you want to edit');
        }
    }

    onExpandAllClick() {
        this.gantt.expandAll();
    }

    onCollapseAllClick() {
        this.gantt.collapseAll();
    }

    onZoomInClick() {
        this.gantt.zoomIn();
    }

    onZoomOutClick() {
        this.gantt.zoomOut();
    }

    onZoomToFitClick() {
        this.gantt.zoomToFit({
            leftMargin  : 50,
            rightMargin : 50
        });
    }

    onShiftPreviousClick() {
        this.gantt.shiftPrevious();
    }

    onShiftNextClick() {
        this.gantt.shiftNext();
    }

    onStartDateChange({ value, oldValue }) {
        if (!oldValue) { // ignore initial set
            return;
        }

        this.gantt.startDate = DateHelper.add(value, -1, 'week');

        this.gantt.project.setStartDate(value);
    }

    onFilterChange({ value }) {
        if (value === '') {
            this.gantt.taskStore.clearFilters();
        }
        else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            this.gantt.taskStore.filter({
                filters : task => task.name && task.name.match(new RegExp(value, 'i')),
                replace : true
            });
        }
    }

    onFeaturesClick({ source : item }) {
        const { gantt } = this;

        if (item.feature) {
            const feature = gantt.features[item.feature];
            feature.disabled = !feature.disabled;
        }
        else if (item.subGrid) {
            const subGrid = gantt.subGrids[item.subGrid];
            subGrid.collapsed = !subGrid.collapsed;
        }
    }

    onFeaturesShow({ source : menu }) {
        const { gantt } = this;

        menu.items.map(item => {
            const { feature } = item;

            if (feature) {
                // a feature might be not presented in the gantt
                // (the code is shared between "advanced" and "php" demos which use a bit different set of features)
                if (gantt.features[feature]) {
                    item.checked = !gantt.features[feature].disabled;
                }
                // hide not existing features
                else {
                    item.hide();
                }
            }
            else {
                item.checked = gantt.subGrids[item.subGrid].collapsed;
            }
        });
    }

    onSettingsShow({ source : menu }) {
        const { gantt } = this,
            { widgetMap } = menu;

        widgetMap.rowHeight.value = gantt.rowHeight;
        widgetMap.barMargin.value = gantt.barMargin;
        widgetMap.barMargin.max = (gantt.rowHeight / 2) - 5;
        widgetMap.duration.value = gantt.transitionDuration;
    }

    onSettingsRowHeightChange({ value }) {
        this.gantt.rowHeight = value;
        this.widgetMap.settingsButton.menu.widgetMap.barMargin.max = (value / 2) - 5;
    }

    onSettingsMarginChange({ value }) {
        this.gantt.barMargin = value;
    }

    onSettingsDurationChange({ value }) {
        this.gantt.transitionDuration = value;
        this.styleNode.innerHTML = `.b-animating .b-gantt-task-wrap { transition-duration: ${value / 1000}s !important; }`;
    };

    onCriticalPathsClick({ source }) {
        this.gantt.features.criticalPaths.disabled = !source.pressed;
    }

    onUndoClick() {
        this.gantt.project.stm.canUndo && this.gantt.project.stm.undo();
    }

    onRedoClick() {
        this.gantt.project.stm.canRedo && this.gantt.project.stm.redo();
    }

    // endregion
};


/**
 * @module StatusColumn
 */

/**
 * A column showing the status of a task
 *
 * @extends Gantt/column/Column
 * @classType statuscolumn
 */
class StatusColumn extends Column {
    static get type() {
        return 'statuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config properties here
            text       : 'Status',
            editor     : false,
            cellCls    : 'b-status-column-cell',
            htmlEncode : false
        };
    }

    //endregion

    renderer({ record }) {
        let status = '';

        if (record.isCompleted) {
            status = 'Completed';
        }
        else if (record.endDate < Date.now()) {
            status = 'Late';
        }
        else if (record.isStarted) {
            status = 'Started';
        }

        return status ? {
            tag       : 'i',
            className : `b-fa b-fa-circle ${status}`,
            html      : status
        } : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);


// here you can extend our default Task class with your additional fields, methods and logic
class Task extends TaskModel {

    static get fields() {
        return [
            { name : 'deadline', type : 'date' }
        ];
    }

    get isLate() {
        return this.deadline && Date.now() > this.deadline;
    }
}


/**
 * @module BackendTools
 */

class BackendTools {

    //region Constructor

    constructor(gantt) {
        const me = this;

        me.gantt   = gantt;
        me.project = gantt.project;
        me.stm     = me.project.stm;

        [me.saveButton, me.loadButton, me.resetButton] = WidgetHelper.append([
            {
                ref      : 'saveButton',
                type     : 'button',
                icon     : 'b-fa b-fa-cloud-upload-alt',
                color    : 'b-green b-raised',
                text     : 'Save',
                tooltip  : 'Save changes to server',
                disabled : true,
                onAction : () => me.onSaveClick()
            },
            {
                ref      : 'loadButton',
                type     : 'button',
                icon     : 'b-fa b-fa-cloud-download-alt',
                color    : 'b-blue b-raised',
                text     : 'Load',
                tooltip  : 'Load data from server',
                onAction : () => me.onLoadClick()

            },
            {
                ref      : 'resetButton',
                type     : 'button',
                icon     : 'b-fa b-fa-recycle',
                color    : 'b-red b-raised',
                text     : 'Reset',
                tooltip  : 'Reset server data',
                style    : 'margin-right: 1em',
                onAction : () => me.onResetClick()
            }
        ], {
            insertFirst : document.getElementById('tools') || document.body
        });

        // track project changes to disable/enable "Save" button
        gantt.project.on({
            load       : me.onAfterLoadSync,
            sync       : me.onAfterLoadSync,
            haschanges : me.onProjectChanges,
            nochanges  : me.onProjectChanges,
            thisObj    : me
        });

        gantt.on({
            startCellEdit  : me.onStartCellEdit,
            cancelCellEdit : me.onEndCellEdit,
            finishCellEdit : me.onEndCellEdit,
            thisObj        : me
        });

    }

    //endregion

    //region internal procedures

    loadFromServer(requestOptions) {
        Toast.hideAll();

        const me = this;

        function triggerLoadRequest() {
            me.project.load(requestOptions).catch(() => {});
        }

        // If task editor was open we wait until editing is canceled and then load or reset data
        if  (me.gantt.features.taskEdit.isEditing) {
            me.gantt.on({
                taskEditCanceled : triggerLoadRequest,
                thisObj          : me,
                once             : true
            });
        }
        else {
            triggerLoadRequest();
        }
    }

    //endregion

    //region Listeners

    onProjectChanges({ type }) {
        // disable "Save" button if there is no changes in the project data
        this.saveButton.disabled = type === 'nochanges';
    }

    onAfterLoadSync() {
        // since we load all the stores data from the server
        // we reset undo/redo queue (it no longer makes sense)
        this.stm.disable();
        this.stm.resetQueue();
        this.stm.enable();
    }

    onEndCellEdit() {
        this.editorContext = null;
    }

    onStartCellEdit({ editorContext }) {
        this.editorContext = editorContext;
    }

    onSaveClick() {
        // finish editing before changes persisting
        const me = this;
        me.editorContext && me.gantt.features.cellEdit.finishEditing(me.editorContext);
        me.project.sync().catch(() => {});
    }

    onLoadClick() {
        this.loadFromServer();
    }

    onResetClick() {
        this.loadFromServer({ reset : true });
    }

    //endregion

    //region Error handling

    serverError(text, responseText) {
        console.error(`Error: ${text}\nServer response:\n${responseText}`);

        Toast.show({
            html : `Server response:<br>${responseText}<br>
                    <b>Please make sure that you've read readme.md file carefully
                    and setup the database connection accordingly.</b>`,
            color   : 'b-red',
            style   : 'color:white',
            timeout : 0
        });
    }

    //endregion

};

const project = window.project = new ProjectModel({
    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass : Task,
    transport      : {
        load : {
            url       : 'php/load.php',
            paramName : 'q'
        },
        sync : {
            url : 'php/sync.php'
        }
    },

    listeners : {
        beforeSend : ({ params }) => {
            // can be used to dynamically add arbitrary parameters to data load/sync requests
            // for example here we add "config" parameter (we use it for testing purposes)
            const queryString = new URLSearchParams(window.location.search);
            params.config = queryString.get('config') || '';
        },
        syncfail : ({ response, responseText }) => {
            if (!response || !response.success) {
                backendTools.serverError('Could not sync the data with the server.', responseText);
            }
        }
    }
});

const gantt = new Gantt({
    project : project,

    startDate               : '2019-01-12',
    endDate                 : '2019-03-24',
    resourceImageFolderPath : '../_shared/images/users/',

    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        { type : 'resourceassignment', showAvatars : true, width : 120 },
        {
            type  : 'predecessor',
            width : 112
        },
        {
            type  : 'successor',
            width : 112
        },
        { type : 'schedulingmodecolumn' },
        { type : 'calendar' },
        { type : 'percentdone', showCircle : true, text : '%', width : 70 },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'statuscolumn' },
        {
            type  : 'date',
            text  : 'Deadline',
            field : 'deadline'
        },
        { type : 'addnew' }
    ],

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    columnLines : false,

    features : {
        rollups : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 1, 10)
        },
        taskContextMenu : {
            // Our items is merged with the provided defaultItems
            // So we add the provided convertToMilestone option.
            items : {
                convertToMilestone : true
            },
            processItems({ taskRecord, items }) {
                if (taskRecord.isMilestone) {
                    items.convertToMilestone = false;
                }
            }
        },
        filter         : true,
        dependencyEdit : true,
        timeRanges     : {
            showCurrentTimeLine : true
        },
        labels : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }
});

// Add Save / Load / Reset buttons toolbar and server data load/sync handlers
const backendTools = new BackendTools(gantt);

new Panel({
    adopt  : 'container',
    layout : 'fit',
    items  : [
        gantt
    ],
    tbar : new GanttToolbar({ gantt })
});

// console.time("load data");
project.load().then(() => {
    // console.timeEnd("load data");
    const stm = gantt.project.stm;

    stm.enable();
    stm.autoRecord = true;

    // let's track scheduling conflicts happened
    project.on('schedulingconflict', context => {
        // show notification to user
        Toast.show('Scheduling conflict has happened ..recent changes were reverted');
        // as the conflict resolution approach let's simply cancel the changes
        context.continueWithResolutionResult(EffectResolutionResult.Cancel);
    });
}).catch(({ response, responseText }) => {

    if (response && response.message) {
        Toast.show({
            html : `${response.message}<br>
                    <b>Please make sure that you've read readme.md file carefully
                    and setup the database connection accordingly.</b>`,
            cls     : 'php-demo-error-message',
            timeout : 0
        });
    }

});
