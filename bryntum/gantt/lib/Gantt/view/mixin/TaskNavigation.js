import Base from '../../../Core/Base.js';
import DomHelper from '../../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/view/mixin/TaskNavigation
 */

/**
 * Mixin that tracks event or assignment selection by clicking on one or more events in the scheduler.
 * @mixin
 */
export default Target => class TaskNavigation extends (Target || Base) {

    static get defaultConfig() {
        return {
            navigator : {
                inlineFlow : false,
                prevKey    : 'ArrowUp',
                nextKey    : 'ArrowDown',
                keys       : {
                    ArrowLeft  : () => {},
                    ArrowRight : () => {},
                    Enter      : 'onTaskEnterKey'
                }
            }
        };
    }

    processEvent(event) {
        const me = this,
            eventElement = DomHelper.up(event.target, me.eventSelector);

        if (!me.navigator.disabled && eventElement) {
            event.taskRecord = event.eventRecord = me.resolveTaskRecord(eventElement);

            if (event.type === 'click') {
                me.selectEvent(event.taskRecord, event.ctrlKey || event.metaKey);
            }
        }

        return event;
    }

    selectEvent(record, preserveSelection = false) {
        // Select row without scrolling any column into view
        this.selectRow({
            record         : record.id,
            column         : false,
            addToSelection : preserveSelection
        });
    }

    deselectEvent(record) {
        this.deselectRow(record.id);
    }

    getNext(taskRecord) {
        const me = this,
            { taskStore } = me;

        for (let rowIdx = taskStore.indexOf(taskRecord) + 1; rowIdx < taskStore.count; rowIdx++) {
            const nextTask = taskStore.getAt(rowIdx);

            // Skip tasks which are outside the TimeAxis
            if (me.isInTimeAxis(nextTask)) {
                return nextTask;
            }
        }
    }

    getPrevious(taskRecord) {
        const me = this,
            { taskStore } = me;

        for (let rowIdx = taskStore.indexOf(taskRecord) - 1; rowIdx >= 0; rowIdx--) {
            const prevTask = taskStore.getAt(rowIdx);

            // Skip tasks which are outside the TimeAxis
            if (me.isInTimeAxis(prevTask)) {
                return prevTask;
            }
        }
    }

    navigateTo(targetEvent, uiEvent = {}) {
        const me = this;

        if (targetEvent) {
            // No key processing during scroll
            me.navigator.disabled = true;
            me.scrollTaskIntoView(
                targetEvent,
                {
                    animate : 100
                }
            ).then(() => {
                me.navigator.disabled = false;
                me.activeEvent = targetEvent;
                me.navigator.trigger('navigate', {
                    event : uiEvent,
                    item  : me.getElementFromTaskRecord(targetEvent).parentNode
                });
            });
        }
    }

    clearEventSelection() {
        this.deselectAll();
    }

    onTaskEnterKey() {
        // Empty, to be chained by features (used by TaskEdit)
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
