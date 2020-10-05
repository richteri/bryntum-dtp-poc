import Scheduler from '../../Scheduler/view/Scheduler.js';
import '../../Scheduler/feature/TimeRanges.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import ProjectModel from '../model/ProjectModel.js';
import Store from '../../Core/data/Store.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';

/**
 * @module Gantt/widget/Timeline
 */

/**
 * A visual component showing an overview timeline of tasks having the {@link Gantt.model.TaskModel#field-showInTimeline showInTimeline} field set to true. The timeline component subclasses the {@link Scheduler.view.Scheduler Scheduler} and to use it,
 * simply provide it with a {@link Gantt.model.ProjectModel}:
 *
 * ```javascript
 * const timeline = new Timeline({
 *     appendTo  : 'container',
 *     project   : project
 * });
 * ```
 *
 *
 * {@inlineexample gantt/widget/Timeline.js}
 *
 * @extends Scheduler/view/Scheduler
 * @classType timeline
 */
export default class Timeline extends Scheduler {

    static get $name() {
        return 'Timeline';
    }

    static get type() {
        return 'timeline';
    }

    construct(config) {
        const me = this;

        me.startDateLabel = document.createElement('label');
        me.startDateLabel.className = 'b-timeline-startdate';
        me.endDateLabel = document.createElement('label');
        me.endDateLabel.className = 'b-timeline-enddate';

        super.construct(config);

        if (!me.project) {
            throw new Error('You need to configure the Timeline with a Project');
        }

        if (!(me.project instanceof ProjectModel)) {
            me.project = new ProjectModel(me.project);
        }

        me.taskStore = me.project.taskStore;

        // We don't want to show timeRanges relating to Project
        me.features.timeRanges.store = new Store();

        me.fillFromTaskStore();

        me.fillFromTaskStore = me.buffer(me.fillFromTaskStore, 100);

        me.taskStore.on({
            refresh : me.fillFromTaskStore,
            change  : me.onTaskStoreChange,
            thisObj : me
        });

        me.on({
            resize  : me.onSizeChanged,
            thisObj : me
        });

        me.bodyContainer.appendChild(me.startDateLabel);
        me.bodyContainer.appendChild(me.endDateLabel);

        LocaleManager.on({
            locale  : 'onLocaleChange',
            thisObj : me
        });
    }

    static get defaultConfig() {
        return {
            /**
             * Project config object or a Project instance
             *
             * @config {Gantt.model.ProjectModel|Object} project
             */

            height                    : '13em',
            eventLayout               : 'pack',
            barMargin                 : 1,
            readOnly                  : true,
            forceFit                  : true,
            zoomOnMouseWheel          : false,
            zoomOnTimeAxisDoubleClick : false,
            eventColor                : null,
            eventStyle                : null,
            rowHeight                 : 48,
            displayDateFormat         : 'L',
            features                  : {
                columnLines         : false,
                eventContextMenu    : false,
                contextMenu         : false,
                scheduleContextMenu : false,
                timeRanges          : {
                    showCurrentTimeLine : true
                }
            },

            // A fake resource
            resources : [
                {
                    id : 1
                }
            ],

            columns : []
        };
    }

    onSizeChanged({ width, oldWidth }) {

        this.suspendRefresh();

        this.updateRowHeight();
        this.resumeRefresh();

        if (width !== oldWidth) {
            this.fitTimeline();
        }
    }

    updateRowHeight() {
        this.rowHeight = this.bodyContainer.offsetHeight;
    }

    fitTimeline() {
        if (this.eventStore.count > 0) {
            this.zoomToFit(
                {
                    leftMargin  : 50,
                    rightMargin : 50
                }
            );
        }

        this.updateStartEndLabels();
    }

    updateStartEndLabels() {
        const me = this;
        me.startDateLabel.innerHTML = me.getFormattedDate(me.startDate);
        me.endDateLabel.innerHTML = me.getFormattedDate(me.endDate);
    }

    async onTaskStoreChange(event) {
        const
            me = this,
            eventStore = me.eventStore;

        let needsFit;

        switch (event.action) {
            case 'add':
                event.records.forEach(task => {
                    if (task.showInTimeline) {
                        eventStore.add(me.cloneTask(task));
                        needsFit = true;
                    }
                });
                break;
            case 'remove':
                if (!event.isCollapse) {
                event.records.forEach(task => {
                    if (task.showInTimeline) {
                        eventStore.remove(task.id);
                        needsFit = true;
                    }
                });
                }
                break;
            case 'removeall':
                me.fillFromTaskStore();
                break;

            case 'update':
                const task = event.record;

                if (event.changes.showInTimeline) {
                    // Add or remove from our eventStore
                    if (task.showInTimeline) {
                        eventStore.add(me.cloneTask(task));
                    }
                    else {
                        eventStore.remove(eventStore.getById(task.id));
                    }
                    needsFit = true;
                }
                else if (task.showInTimeline) {
                    // Just sync with existing clone
                    const clone = eventStore.getById(task.id);

                    if (clone) {
                        const filteredData = Object.assign({}, task.data);

                        // Not allowed to set 'expanded' flat
                        delete filteredData.expanded;

                        clone.set(filteredData);
                        needsFit = true;
                    }
                }
                break;
        }

        if (needsFit) {
            me.fitTimeline();
        }
    }

    cloneTask(task) {
        return {
            id           : task.id,
            resourceId   : 1,
            startDate    : task.startDate,
            endDate      : task.endDate,
            duration     : task.duration,
            durationUnit : task.durationUnit,
            name         : task.name
        };
    }

    render() {
        super.render();

        this.updateRowHeight();
    }

    fillFromTaskStore() {
        const
            me = this,
            timelineTasks = [];

        me.taskStore.traverse(task => {
            if (task.showInTimeline && task.isScheduled) {
                timelineTasks.push(me.cloneTask(task));
            }
        });

        me.suspendRefresh();
        me.events = timelineTasks;
        me.resumeRefresh();

        me.fitTimeline();
    }

    onLocaleChange() {
        this.updateStartEndLabels();
    }
};

BryntumWidgetAdapterRegister.register(Timeline.type, Timeline);
