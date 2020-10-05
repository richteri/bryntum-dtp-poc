import DependencyTab from './DependencyTab.js';
import BryntumWidgetAdapterRegister from '../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module Gantt/widget/taskeditor/SuccessorsTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor}
 * showing the successors of an event or task.
 *
 * @internal
 */
export default class SuccessorsTab extends DependencyTab {
    static get $name() {
        return 'SuccessorsTab';
    }

    static get type() {
        return 'successorstab';
    }

    static get defaultConfig() {
        return Object.assign(
            this.makeDefaultConfig('toEvent'),
            {
                cls : 'b-successors-tab'
            }
        );
    }
}

BryntumWidgetAdapterRegister.register(SuccessorsTab.type, SuccessorsTab);
