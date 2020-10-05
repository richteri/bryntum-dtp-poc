import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ResizeHelper from '../../Core/helper/ResizeHelper.js';

/**
 * @module Gantt/feature/PercentBar
 */

/**
 * This feature renders a special drag handler in every event, by dragging which, user can change the
 * {@link Gantt.model.TaskModel#field-percentDone percentDone} field.
 *
 * This feature is **enabled** by default
 *
 * {@inlineexample gantt/feature/PercentBar.js}
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Gantt/basic
 */
export default class PercentBar extends InstancePlugin {
    //region Config

    static get $name() {
        return 'PercentBar';
    }

    static get defaultConfig() {
        return {
            /**
             * `true` to allow drag drop resizing to set the % done
             * @config {Boolean}
             * @default
             */
            allowResize : true
        };
    }

    static get pluginConfig() {
        return {
            chain : ['onPaint', 'onTaskDataGenerated']
        };
    }

    //endregion

    //region Init

    /**
     * Called when scheduler is painted. Sets up drag and drop and hover tooltip.
     * @private
     */
    onPaint() {
        const
            me    = this,
            gantt = me.client;

        if (me.resize) {
            me.resize.destroy();
        }

        me.resize = new ResizeHelper({
            name           : 'percentBarResize',
            outerElement   : gantt.timeAxisSubGridElement,
            targetSelector : '.b-gantt-task-percent',
            handleSelector : '.b-gantt-task-percent-handle',
            allowResize    : me.isResizable.bind(me),
            dragThreshold  : 0,

            listeners : {
                resizeStart : me.onResizeStart,
                resizing    : me.onResizing,
                resize      : me.onFinishResize,
                cancel      : me.onCancelResize,
                thisObj     : me
            }
        });
    }

    get allowResize() {
        return this._allowResize;
    }

    set allowResize(value) {
        this._allowResize = value;

        this.client.element.classList[value ? 'remove' : 'add']('b-percentbar-drag-disabled');
    }

    doDestroy() {
        this.resize && this.resize.destroy();
        super.doDestroy();
    }

    doDisable(disable) {
        // Redraw to toggle percentbars
        if (this.client.isPainted) {
            this.client.refresh();
        }

        super.doDisable(disable);
    }

    //endregion

    //region Other

    isResizable(el) {
        // cannot change percent of parents, calculated from children
        return this.allowResize && !el.closest('.b-gantt-task-parent');
    }

    //endregion

    //region Contents

    cleanup(context) {
        const
            gantt  = this.client,
            taskEl = context.element.closest(gantt.eventSelector);

        taskEl.classList.remove('b-gantt-task-percent-resizing');
        gantt.element.classList.remove('b-gantt-resizing-task-percent');
    }

    onTaskDataGenerated(taskData) {
        const { task, children } = taskData;

        if (!task.milestone && !this.disabled) {
            children.unshift({
                className : 'b-gantt-task-percent',
                dataset   : {
                    percent        : Math.round(task.percentDone),
                    taskBarFeature : 'percentBar'
                },
                style : {
                    width : task.percentDone + '%'
                },
                children : [
                    {
                        className : 'b-gantt-task-percent-handle'
                    }
                ]
            });
        }
    }

    //endregion

    //region Events

    onResizeStart({ context }) {
        const taskEl = context.element.closest(this.client.eventSelector);

        taskEl.classList.add('b-gantt-task-percent-resizing');
        this.client.element.classList.add('b-gantt-resizing-task-percent');
    }

    onResizing({ context }) {
        const
            el     = context.element,
            taskEl = el.closest(this.client.eventSelector),
            width  = el.offsetWidth === 1 ? 0 : el.offsetWidth;

        el.dataset.percent = Math.min(100, Math.round(100 * width / taskEl.offsetWidth));
    }

    onFinishResize({ context }) {
        const
            me         = this,
            gantt      = me.client,
            el         = context.element,
            taskRecord = gantt.resolveTaskRecord(el);

        me.cleanup(context);

        taskRecord.setPercentDone(parseInt(el.dataset.percent));

        //el.classList.add('b-percent-resize-done');
    }

    onCancelResize({ context }) {
        this.cleanup(context);
    }

    //endregion
}

GridFeatureManager.registerFeature(PercentBar, true, 'Gantt');
