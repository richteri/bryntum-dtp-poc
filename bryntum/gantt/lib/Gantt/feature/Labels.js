import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import { default as SchedulerLabels } from '../../Scheduler/feature/Labels.js';
import DateHelper from '../../Core/helper/DateHelper.js';

const sides = [
    'top',
    'left',
    'right',
    'bottom'
];

/**
 * @module Gantt/feature/Labels
 */

/**
 * Specialized version of the Labels feature for Scheduler, that handles labels for tasks in Gantt. See
 * {@link Scheduler/feature/Labels Schedulers Labels feature} for more information.

 * This feature is **disabled** by default.
 *
 * @extends Scheduler/feature/Labels
 * @demo Gantt/labels
 * @typings Scheduler/feature/Labels -> Scheduler/feature/SchedulerLabels
 */
export default class Labels extends SchedulerLabels {
    static get $name() {
        return 'Labels';
    }

    construct(gantt, config) {
        super.construct(gantt, config);
    }

    static get pluginConfig() {
        return {
            chain : ['onTaskDataGenerated']
        };
    }

    onTaskDataGenerated(data) {
        const me = this;
        if (!me.disabled) {
            // Insert all configured labels
            for (const side of sides) {
                if (me[side]) {
                    const
                        {
                            field,
                            fieldDef,
                            recordType,
                            renderer,
                            thisObj
                        }  = me[side];

                    let value;

                    // If there's a renderer, use that by preference
                    if (renderer) {
                        value = renderer.call(thisObj || me.thisObj || me, data);
                    }
                    else {
                        value = data[`${recordType}Record`][field];

                        // If it's a date, format it according to the Scheduler's defaults
                        if (fieldDef && fieldDef.type === 'date' && !renderer) {
                            value = DateHelper.format(value, me.client.displayDateFormat);
                        }
                    }

                    data.wrapperChildren.push({
                        tag       : 'label',
                        className : `${me.labelCls} ${me.labelCls}-${side}`,
                        dataset   : { side, taskFeature : `label-${side}` },
                        html      : value || '\xa0'
                    });
                }
            }
        }
    }
}

GridFeatureManager.registerFeature(Labels, false, 'Gantt');
