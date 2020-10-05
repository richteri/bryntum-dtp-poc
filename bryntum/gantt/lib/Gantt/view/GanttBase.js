import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import TimelineBase from '../../Scheduler/view/TimelineBase.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

//import TaskRendering from './orientation/TaskRendering.js';
import NewTaskRendering from './orientation/NewTaskRendering.js';

import { base } from '../../Core/helper/MixinHelper.js';

import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';
import GanttDom from './mixin/GanttDom.js';
import GanttRegions from './mixin/GanttRegions.js';
import GanttScroll from './mixin/GanttScroll.js';
import GanttState from './mixin/GanttState.js';
import GanttStores from './mixin/GanttStores.js';
import GanttTimelineDateMapper from './mixin/GanttTimelineDateMapper.js';
import TaskNavigation from './mixin/TaskNavigation.js';

import EventNavigation from '../../Scheduler/view/mixin/EventNavigation.js';

import ProjectModel from '../model/ProjectModel.js';

import '../localization/En.js';
import '../../Scheduler/column/TimeAxisColumn.js';

// Always required features
import '../../Grid/feature/Tree.js';
import '../../Grid/feature/RegionResize.js';
import '../feature/Dependencies.js';

import NameColumn from '../column/NameColumn.js';

import { DependencyType } from '../../Engine/scheduling/Types.js';
import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';

import { PropagationResult } from '../../ChronoGraph/chrono/Graph.js';
import Toast from '../../Core/widget/Toast.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Gantt/view/GanttBase
 */

const emptyObject = Object.freeze({});

let newTaskCount = 0;

/**
 * A thin base class for {@link Gantt.view.Gantt}. Does not include any features by default, allowing smaller custom
 * built bundles if used in place of {@link Gantt.view.Gantt}.
 *
 * @mixes Gantt/view/mixin/GanttDom
 * @mixes Gantt/view/mixin/GanttRegions
 * @mixes Gantt/view/mixin/GanttScroll
 * @mixes Gantt/view/mixin/GanttState
 * @mixes Gantt/view/mixin/GanttStores
 * @mixes Scheduler/crud/mixin/CrudManagerView
 * @mixes Scheduler/view/mixin/EventNavigation
 * @mixes Gantt/view/mixin/TaskNavigation
 *
 * @extends Scheduler/view/TimelineBase
 */
export default class GanttBase extends base(TimelineBase).mixes(
    CrudManagerView,
    GanttDom,
    GanttRegions,
    GanttScroll,
    GanttState,
    GanttStores,
    GanttTimelineDateMapper,
    EventNavigation,
    TaskNavigation
) {

    //region Task interaction events

    /**
     * Triggered after a mousedown on a task bar.
     * @event taskMouseDown
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a mouseup on a task bar.
     * @event taskMouseUp
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a click on a task bar.
     * @event taskClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a doubleclick on a task.
     * @event taskDblClick
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a rightclick (or long press on a touch device) on a task.
     * @event taskContextMenu
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered after a mouseover on a task.
     * @event taskMouseOver
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    /**
     * Triggered for mouseout from a task.
     * @event taskMouseOut
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Gantt.model.TaskModel} taskRecord The Task record
     * @param {MouseEvent} event The native browser event
     */

    //endregion

    //region Other events

    /**
     * Task is rendered, its element is available in DOM.
     * @event renderTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    /**
     * Task is released, no longer in view/removed. A good spot for cleaning custom things added in a `renderTask`
     * listener up, if needed.
     * @event releaseTask
     * @param {Gantt.view.Gantt} source The Gantt instance
     * @param {Object} renderData Task render data
     * @param {Gantt.model.TaskModel} taskRecord Rendered task
     * @param {HTMLElement} element Task element
     */

    //endregion

    //region Config

    static get $name() {
        return 'GanttBase';
    }

    static get defaultConfig() {
        return {

            /**
             * A Project instance or a config object. The project holds all Gantt data.
             *
             * @config {Gantt.model.ProjectModel|Object} project
             * @category Common
             */

            /**
             * The project instance, containing the data visualized by this Gantt chart.
             *
             * @property {Gantt.model.ProjectModel}
             */
            project : null,

            /**
             * The path for resource images, used by various widgets such as the resource assignment column.
             * @config {String}
             * @category Common
             */
            resourceImageFolderPath : null,

            /**
             * The file name of an image file to use when a resource has no image, or its image cannot be loaded.
             * @config {String}
             * @category Common
             */
            defaultResourceImageName : null,

            // data for the stores, in the topological order
            calendars    : null,
            resources    : null,
            tasks        : null,
            dependencies : null,
            assignments  : null,

            eventCls                : 'b-gantt-task',
            eventBarTextField       : null,
            eventLayout             : 'none',
            eventSelectionDisable   : true,
            eventColor              : null,
            eventStyle              : null,
            rowHeight               : 45,
            scheduledEventName      : 'task',
            eventScrollMode         : 'move',
            overScheduledEventClass : 'b-gantt-task-hover',
            mode                    : 'horizontal',
            //fixedRowHeight          : true, // Not working with exporter, no time to investigate why currently

            timeCellCls : 'b-sch-timeaxis-cell',

            timeCellSelector : '.b-sch-timeaxis-cell',

            // TODO: This will be brought in by the TaskNavigation mixin when it is implemented
            focusCls : 'b-active',

            /**
             * Decimal precision used for displaying durations, used by tooltips and DurationColumn.
             * Specify `false` to use raw value
             * @config {Number|Boolean}
             * @default
             * @category Common
             */
            durationDisplayPrecision : 1,

            /**
             * An empty function by default, but provided so that you can override it. This function is called each time
             * a task is rendered into the gantt to render the contents of the task.
             *
             * Returning a string will display it in the task bar, it accepts both plain text or HTML. It is also
             * possible to return a DOM config object which will be synced to the task bars content.
             *
             * ```javascript
             * // using plain string
             * new Gantt({
             *    taskRenderer : ({ taskRecord }) => taskRecord.name
             * });
             *
             * // using html string
             * new Gantt({
             *    taskRenderer : ({ taskRecord }) => `${taskRecord.id} <b>${taskRecord.name}</b>`
             * });
             *
             * // using DOM config
             * new Gantt({
             *    taskRenderer({ taskRecord }) {
             *       return {
             *           tag  : 'b',
             *           html : taskRecord.name
             *       }
             *    }
             * });
             * ```
             *
             * @param {Object} detail An object containing the information needed to render a Task.
             * @param {Gantt.model.TaskModel} detail.taskRecord The task record.
             * @param {Object} detail.tplData DEPRECATED: Use renderData instead.
             * @param {Object} detail.renderData An object containing details about the task rendering.
             * @param {Core.helper.util.DomClassList|String} detail.renderData.cls An object whose property names represent the CSS class names
             * to be added to the tasks's element. Set a property's value to truthy or falsy to add or remove the class
             * name based on the property name. Using this technique, you do not have to know whether the class is already
             * there, or deal with concatenation.
             * @param {Core.helper.util.DomClassList|String} detail.renderData.wrapperCls An object whose property names represent the CSS class names
             * to be added to the event wrapper element. Set a property's value to truthy or falsy to add or remove the class
             * name based on the property name. Using this technique, you do not have to know whether the class is already
             * there, or deal with concatenation.
             * @param {Core.helper.util.DomClassList|String} detail.renderData.iconCls An object whose property names represent the CSS class
             * names to be added to an task icon element.
             * @param {Scheduler.model.TimeSpan[]|Object[]} indicators An array that can be populated with TimeSpan
             * records or their config objects to have them rendered in the task row
             * @returns {String} A simple string creating the actual HTML
             * @config {Function}
             * @category Scheduled events
             */
            taskRenderer : null
        };
    }

    get isGantt() {
        return true;
    }

    //endregion

    //region Init

    construct(config) {
        const
            me = this,
            hasInlineStores = Boolean(config.calendars || config.taskStore || config.dependencyStore || config.resourceStore || config.assignmentStore),
            hasInlineData = Boolean(config.calendars || config.tasks || config.dependencies || config.resources || config.assignments);

        // TODO: Config system to be enhanced to merge object properties from the hierarchy's
        // defaultConfig set so that each class level could just declare the features it requires.
        if (!config.features) {
            config.features = {};
        }

        // gantt is always a tree
        if (!('tree' in config.features)) {
            config.features.tree = true;
        }

        let project = config.project;

        if (project && (hasInlineStores || hasInlineData)) {
            throw new Error('Providing both project and inline data is not supported');
        }

        // gather all data in the ProjectModel instance
        if (!(project instanceof ProjectModel)) {
            project = config.project = new ProjectModel(ObjectHelper.assign({
                calendarsData    : config.calendars,
                eventsData       : config.tasks,
                dependenciesData : config.dependencies,
                resourcesData    : config.resources,
                assignmentsData  : config.assignments,

                resourceStore   : config.resourceStore,
                eventStore      : config.taskStore,
                assignmentStore : config.assignmentStore,
                dependencyStore : config.dependencyStore,
                timeRangeStore  : config.timeRangeStore
            }, project));

            delete config.resourceStore;
            delete config.taskStore;
            delete config.assignmentStore;
            delete config.dependencyStore;
            delete config.timeRangeStore;

            delete config.calendars;
            delete config.resources;
            delete config.tasks;
            delete config.assignments;
            delete config.dependencies;
        }
        // EOF data gathering

        // Add listeners with negative priority to call propagation after rows are rendered
        project.getEventStore().on({
            add     : me.onTaskStoreAddOrRemove,
            remove  : me.onTaskStoreAddOrRemove,
            prio    : -1,
            thisObj : me
        });

        project.on({
            eventstorechanged : me.onTaskStoreChange,
            refresh           : me.onProjectRefresh,
            load              : me.onProjectLoad,
            commit            : me.onProjectCommit,
            prio              : 1000,
            thisObj           : me
        });

        // map project to scheduler defined crudManager property
        config.crudManager = project;

        // If project is already loaded, possibly need to adjust timeline
        // if (project.loaded) {
        //     this.onProjectLoad();
        // }

        super.construct(config);

        if (me.features.cellEdit) {
            me.features.cellEdit.addNewAtEnd = {
                name         : me.L('L{Gantt.New task}'),
                startDate    : project.startDate,
                duration     : 1,
                durationUnit : me.timeAxis.unit
            };
        }

        me.on('taskclick', me.onTaskBarClick, me);
    }

    get columns() {
        return super.columns;
    }

    set columns(columns) {
        if (columns) {
            let cols = columns;

            if (!Array.isArray(columns)) {
                cols = columns.data;

                // Need to pull the taskstore in, to make sure any fields added by columns are added to it
                this._thisIsAUsedExpression(this.taskStore);
            }

            // Always include the name column
            if (!cols.some(column => {
                const constructor = column instanceof Column ? column.constructor : ColumnStore.getColumnClass(column.type) || Column;

                return constructor === NameColumn || constructor.prototype instanceof NameColumn;
            })) {
                cols.unshift({
                    type : 'name'
                });
            }
        }

        super.columns = columns;
    }

    // Overrides TimelineBase to supply taskStore as its store (which is only used in passed events)
    set timeAxisViewModel(timeAxisViewModel) {
        super.timeAxisViewModel = timeAxisViewModel;

        if (this.taskStore) {
            this.timeAxisViewModel.store = this.taskStore;
        }
    }

    get timeAxisViewModel() {
        return super.timeAxisViewModel;
    }

    //endregion

    //region Events

    // Overriding grids behaviour to ignore individual updates caused by propagation
    onStoreUpdateRecord(params) {
        if (!this.project.isPropagating()) {
            let result;

            this.runWithTransition(() => {
                result = super.onStoreUpdateRecord(params);
            });

            return result;
        }
    }

    onProjectCommit({ records }) {
        if (this.isPainted) {
            const
                { rowManager } = this,
                rows = [];

            for (const record of records) {
                if (record.isTask && this.taskStore.isAvailable(record)) {
                    const row = rowManager.getRowFor(record);
                    if (row) {
                        rows.push(row);
                    }
                }
            }

            rows.sort((a, b) => a.index - b.index);

            this.runWithTransition(() => {
                rowManager.renderRows(rows);
            });
        }
    }

    onTaskStoreAddOrRemove({ isExpand, isCollapse }) {
        // Do not recalculate project if we expand or collapse
        // Also if we undoing/redoing, because project will be in already calculated state
        if (!isExpand && !isCollapse && !this.project.stm.isRestoring) {
            // This code basically means "if no one started propagation on previous animation frame after record
            // was added, start one to schedule new records". Required by refactored async addTask method, which forces
            // propagation
            if (!this.project.isPropagating()) {
                this.project.propagate();
            }
        }
    }

    onProjectRefresh() {
        this.refreshRows();
        // storing feature into variable allows to save quite a few time on big projects
        const dependencyFeature = this.features.dependencies;
        // Add all dependencies to the cache, required dependencies will be drawn in next animation frame and will be
        // properly updated on view scroll
        this.dependencies.forEach(dep => dependencyFeature.addToGridCache(dep));
    }

    // On project load, show project start date unless implementer chose a specific start date of the timeline
    onProjectLoad() {
        const me = this;

        if (!('startDate' in me.initialConfig) && me.project.startDate) {
            me.startDate = me.project.startDate;
        }
    }

    // Features can hook into this to add to generated task data
    onTaskDataGenerated() {}

    onTaskBarClick({ taskRecord }) {
        if (!taskRecord.isLeaf) {
            this.toggleCollapse(taskRecord);
        }
    }

    // Grid row selection change
    // TODO #8301 - EventSelection based on Collection may break it
    triggerChangeEvent(selectionChangeEvent, silent) {
        super.triggerChangeEvent(selectionChangeEvent, silent);

        const me = this;

        function setTaskSelection(record, selected) {
            const taskElement = me.getElementFromTaskRecord(record);
            if (taskElement) {
                taskElement.classList[selected ? 'add' : 'remove']('b-task-selected');
            }
        }

        if (selectionChangeEvent.mode === 'row') {
            selectionChangeEvent.selected.map(record => setTaskSelection(record, true));
            selectionChangeEvent.deselected.map(record => setTaskSelection(record, false));
        }
    }

    //endregion

    //region TimelineBase implementations

    // Overrides grid to take project loading into account
    toggleEmptyText() {
        if (this.bodyContainer) {
            DomHelper.toggleClasses(this.bodyContainer, 'b-grid-empty', !(this.rowManager.rowCount || this.project.isLoadingOrSyncing));
        }
    }

    // Gantt only has one orientation, but TimelineBase expects this to work to call correct rendering code
    get currentOrientation() {
        const me = this;

        if (!me._currentOrientation) {
            //me.taskRendering = me._currentOrientation = new TaskRendering(me);
            me.taskRendering = me._currentOrientation = new NewTaskRendering(me);
        }

        return me._currentOrientation;
    }

    getTimeSpanMouseEventParams(taskElement, event) {
        const taskRecord = this.resolveTaskRecord(taskElement);

        return !taskRecord ? null : {
            taskRecord,
            taskElement,
            event
        };
    }

    getScheduleMouseEventParams(cellData) {
        return {
            taskRecord : this.store.getById(cellData.id)
        };
    }

    // Used by shared features to resolve an event or task
    resolveTimeSpanRecord(element) {
        return this.resolveTaskRecord(element);
    }

    repaintEventsForResource(taskRecord) {
        this.taskRendering.redraw(taskRecord);
    }

    //endregion

    // region ContextMenu

    async addTask(referenceTask, options = emptyObject) {
        const
            me        = this,
            { milestone, above, asChild, asPredecessor, asSuccessor } = options,
            project   = me.store.getProject(),
            parent    = referenceTask.parent,
            newRecord = referenceTask.copy();

        if (milestone) {
            newRecord.name = `${me.L('L{Gantt.New milestone}')} ${++newTaskCount}`;
        }
        else {
            newRecord.name = `${me.L('L{Gantt.New task}')} ${++newTaskCount}`;
        }

        if (asChild) {
            referenceTask.insertChild(newRecord, referenceTask.firstChild);
        }
        else if (above) {
            referenceTask.parent.insertChild(newRecord, referenceTask);
        }
        else {
            parent.insertChild(newRecord, referenceTask.nextSibling);
        }

        if (milestone) {
            await project.waitForPropagateCompleted();
            await newRecord.convertToMilestone();
        }
        else {
            // the propagation will probably be already started by the `onTaskStoreAddOrRemove` listener
            if (!project.isPropagating()) {
                await project.propagate();
            }
        }

        // run propagation to handle the new task record
        // and then add a dependency if needed
        if (asSuccessor) {
            me.dependencyStore.add({
                fromEvent : referenceTask,
                toEvent   : newRecord,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }
        else if (asPredecessor) {
            me.dependencyStore.add({
                fromEvent : newRecord,
                toEvent   : referenceTask,
                type      : DependencyType.EndToStart,
                fromSide  : 'right',
                toSide    : 'left'
            });
        }

        if (asSuccessor || asPredecessor) {
            // run propagation to handle the new dependency
            await project.propagate();
        }

        return newRecord;
    }

    addTaskAbove(taskRecord) {
        return this.addTask(taskRecord, { above : true });
    }

    addTaskBelow(taskRecord) {
        return this.addTask(taskRecord);
    }

    addMilestonBelow(taskRecord) {
        return this.addTask(taskRecord, { milestone : true });
    }

    addSubtask(taskRecord) {
        const result = this.addTask(taskRecord, { asChild : true });

        this.toggleCollapse(taskRecord, false);
        return result;
    }

    addSuccessor(taskRecord) {
        return this.addTask(taskRecord, { asSuccessor : true });
    }

    addPredecessor(taskRecord) {
        return this.addTask(taskRecord, { above : true, asPredecessor : true });
    }

    /**
     * Increase the indentation level of one or more tasks in the tree
     *
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to indent.
     * @return {Promise} A promise which resolves if operation is successful
     */
    async indent(nodes) {
        const
            me     = this,
            result = await me.taskStore.indent(nodes);

        // The scheduling engine found a reason that the operation could not happen.
        if (result === PropagationResult.Canceled) {
            Toast.show(me.L('L{Gantt.changeRejected}'));
        }

        return result;
    }

    /**
     * Decrease the indentation level of one or more tasks in the tree
     *
     * @param {Gantt.model.TaskModel[]|Gantt.model.TaskModel} tasks The task(s) to outdent.
     * @return {Promise} A promise which resolves if operation is successful
     */
    async outdent(nodes) {
        const
            me     = this,
            result = await me.taskStore.outdent(nodes);

        // The scheduling engine found a reason that the operation could not happen.
        if (result === PropagationResult.Canceled) {
            Toast.show(me.L('L{Gantt.changeRejected}'));
        }
        return result;
    }

    // endregion
}

BryntumWidgetAdapterRegister.register('ganttbase', GanttBase);

VersionHelper.setVersion('gantt', '2.1.9');
