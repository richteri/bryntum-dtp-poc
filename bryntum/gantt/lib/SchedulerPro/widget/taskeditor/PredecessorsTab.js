import DependencyTab from './DependencyTab.js';
import BryntumWidgetAdapterRegister from '../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module Gantt/widget/taskeditor/PredecessorsTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the predecessors of an event or task.
 * @internal
 */
export default class PredecessorsTab extends DependencyTab {
    static get $name() {
        return 'PredecessorsTab';
    }

    static get type() {
        return 'predecessorstab';
    }

    static get defaultConfig() {
        return Object.assign(
            this.makeDefaultConfig('fromEvent'),
            {
                cls : 'b-predecessors-tab'
            }
        );
    }
}

BryntumWidgetAdapterRegister.register(PredecessorsTab.type, PredecessorsTab);
