import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Gantt/view/mixin/GanttScroll
 */

const defaultScrollOptions = {
    block      : 'nearest',
    edgeOffset : 20
};

/**
 * Functions for scrolling to tasks, dates etc.
 *
 * @mixin
 */
export default Target => class GanttScroll extends (Target || Base) {
    /**
     * Scrolls a task record into the viewport.
     *
     * @param {Gantt.model.TaskModel} taskRecord The task record to scroll into view
     * @param {Object} [options] How to scroll.
     * @param {String} [options.block=nearest] How far to scroll the event: `start/end/center/nearest`.
     * @param {Number} [options.edgeOffset=20] edgeOffset A margin *in pixels* around the event to bring into view.
     * @param {Boolean|Number} [options.animate] Set to `true` to animate the scroll, or the number of milliseconds to animate over.
     * @param {Boolean} [options.highlight] Set to `true` to highlight the event element when it is in view.
     * @param {Boolean} [options.focus] Set to `true` to focus the event element when it is in view.
     * @returns {Promise} A Promise which resolves when the scrolling is complete.
     */
    scrollTaskIntoView(taskRecord, options = defaultScrollOptions) {
        let el,
            taskStart = taskRecord.startDate,
            taskEnd   = taskRecord.endDate;

        const me = this;

        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        if (!taskRecord.isScheduled) {
            return this.scrollRowIntoView(taskRecord, options);
        }

        taskStart = taskStart || taskEnd;
        taskEnd   = taskEnd || taskStart;

        const taskIsOutside = taskStart < me.timeAxis.startDate | ((taskEnd > me.timeAxis.endDate) << 1);

        // Make sure task is within TimeAxis time span unless extendTimeAxis passed as false.
        // The TaskEdit feature passes false because it must not mutate the TimeAxis.
        // Bitwise flag:
        //  1 === start is before TimeAxis start.
        //  2 === end is after TimeAxis end.
        if (taskIsOutside && options.extendTimeAxis !== false) {
            const currentTimeSpanRange = me.timeAxis.endDate - me.timeAxis.startDate;
            let startAnchorPoint, endAnchorPoint;

            // Event is too wide, expand the range to encompass it.
            if (taskIsOutside === 3) {
                me.timeAxis.setTimeSpan(
                    new Date(taskStart.valueOf() - currentTimeSpanRange / 2),
                    new Date(taskEnd.getTime() + currentTimeSpanRange / 2)
                );
            }
            // Event is partially or wholly outside but will fit.
            // Move the TimeAxis to include it. Attempt to maintain visual position.
            else {
                startAnchorPoint = me.getCoordinateFromDate((taskIsOutside & 1) ? taskEnd : taskStart);

                // Event starts before
                if (taskIsOutside & 1) {
                    me.timeAxis.setTimeSpan(
                        new Date(taskStart),
                        new Date(taskStart.valueOf() + currentTimeSpanRange)
                    );
                }
                // Event ends after
                else {
                    me.timeAxis.setTimeSpan(
                        new Date(taskEnd.valueOf() - currentTimeSpanRange),
                        new Date(taskEnd)
                    );
                }
                // Restore view to same relative scroll position.
                endAnchorPoint = (taskIsOutside & 1)
                    ? me.getCoordinateFromDate(taskEnd)
                    : me.getCoordinateFromDate(taskStart);

                me.timeAxisSubGrid.scrollable.scrollBy(endAnchorPoint - startAnchorPoint);
            }
        }

        // Establishing element to scroll to
        el = me.getElementFromTaskRecord(taskRecord);

        if (el) {
            const scroller = me.timeAxisSubGrid.scrollable;

            // Scroll into view with animation and highlighting if needed.
            // Mute scroll events during the scroll so that event rendering does't replace
            // the target element.
            return scroller.scrollIntoView(el, ObjectHelper.assign({
                silent : true
            }, options));
        }
        else {
            // Event not rendered, scroll to calculated location
            return me.scrollUnrenderedTaskIntoView(taskRecord, options);
        }
    }

    /**
     * Scrolls an unrendered task into view. Internal function used from #scrollTaskIntoView.
     * @private
     */
    scrollUnrenderedTaskIntoView(taskRec, options = defaultScrollOptions) {
        if (options.edgeOffset == null) {
            options.edgeOffset = 20;
        }

        const
            me               = this,
            scroller         = me.timeAxisSubGrid.scrollable,
            box              = me.getTaskBox(taskRec),
            scrollerViewport = scroller.viewport,
            targetRect       = box.translate(scrollerViewport.x - scroller.x, scrollerViewport.y - scroller.y);

        let result           = scroller.scrollIntoView(targetRect, Object.assign({}, options, { highlight : false }));

        if (options.highlight || options.focus) {
            const detacher = me.on({
                renderTask({ taskRecord, element }) {
                    if (taskRecord === taskRec) {
                        detacher();
                        result = result.then(() => {
                            options.highlight && DomHelper.highlight(element);
                            options.focus && element.focus();
                        });
                    }
                }
            });
        }
        else {
            // Task is painter asynchronously after scroll, need to wait for corresponding event from the view
            result = Promise.all([
                result,
                new Promise(resolve => {
                    const detacher = me.on({
                        renderTask({ taskRecord }) {
                            if (taskRecord === taskRec) {
                                detacher();
                                resolve();
                            }
                        }
                    });
                })
            ]);
        }

        return result;
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
