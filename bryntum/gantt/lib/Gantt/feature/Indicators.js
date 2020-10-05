import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import TooltipBase from '../../Scheduler/feature/base/TooltipBase.js';
import DomClassList from '../../Core/helper/util/DomClassList.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/feature/Indicators
 */

/**
 * The Indicators feature displays indicators (icons) for different dates related to a task in its row. Hovering an
 * indicator will show a tooltip with its name and date(s).
 *
 * By default it includes and displays the following indicators (config name):
 * * Early start/end dates (earlyDates)
 * * Late start/end dates (lateDates)
 * * Constraint date (constraintDate)
 * * Deadline date (deadlineDate)
 *
 * {@inlineexample gantt/feature/Indicators.js}
 *
 * This config will display them all:
 *
 * ```javascript
 * new Gantt({
 *   features : {
 *     indicators : true
 *   }
 * });
 * ```
 *
 * To selectively disable indicators:
 *
 * ```javascript
 * features : {
 *   indicators : {
 *     items : {
 *       earlyDates     : false,
 *       constraintDate : false
 *     }
 *   }
 * }
 * ```
 *
 * They can also be toggled at runtime:
 *
 * ```javascript
 * gantt.features.indicators.items.deadlineDate = true/false;
 * ```
 *
 * The feature also supports adding custom indicators, by adding properties to the `items` config object:
 *
 * ```javascript
 * items : {
 *   lateDates  : false,
 *
 *   // Custom indicator only shown for tasks more than half done
 *   myCustomIndicator : taskRecord => taskRecord.percentDone > 50 ? {
 *      startDate : DateHelper.add(taskRecord.endDate, 2, 'days'),
 *      name : 'My custom indicator',
 *      iconCls : 'b-fa b-fa-alien'
 *   } : null
 * }
 * ```
 *
 * {@inlineexample gantt/feature/IndicatorsCustom.js}
 *
 * These custom indicators are defined as functions, that accept a task record and return a TimeSpan (or a raw data
 * object). The function will be called for each visible task during rendering, to not show the indicator for certain
 * tasks return `null` from it.
 *
 * When using this feature we recommend that you configure gantt with a larger `rowHeight` + `barMargin` (>15 px), since
 * the indicators are indented to fit below the task bars.
 *
 * @classType indicators
 * @extends Scheduler/feature/base/TooltipBase
 * @demo Gantt/indicators
 */
export default class Indicators extends TooltipBase {
    //region Config

    static get $name() {
        return 'Indicators';
    }

    static get defaultConfig() {
        return {
            cls         : 'b-gantt-task-tooltip', // resused on purpose
            forSelector : '.b-indicator',
            recordType  : 'indicator',
            hoverDelay  : 500,

            defaultIndicators : {
                earlyDates : taskRecord => taskRecord.earlyStartDate && !taskRecord.isMilestone ? {
                    startDate : taskRecord.earlyStartDate,
                    endDate   : taskRecord.earlyEndDate,
                    cls       : 'b-bottom b-early-dates',
                    name      : this.L('L{earlyDates}')
                } : null,

                lateDates : taskRecord => taskRecord.lateStartDate && !taskRecord.isMilestone ? {
                    startDate : taskRecord.lateStartDate,
                    endDate   : taskRecord.lateEndDate,
                    cls       : 'b-bottom b-late-dates',
                    name      : this.L('L{lateDates}')
                } : null,

                constraintDate : taskRecord => taskRecord.constraintDate ? {

                    // Do not remove. Assertion strings for Localization sanity check.
                    // 'L{ConstraintTypePicker.none}'
                    // 'L{ConstraintTypePicker.muststarton}'
                    // 'L{ConstraintTypePicker.mustfinishon}'
                    // 'L{ConstraintTypePicker.startnoearlierthan}'
                    // 'L{ConstraintTypePicker.startnolaterthan}'
                    // 'L{ConstraintTypePicker.finishnoearlierthan}'
                    // 'L{ConstraintTypePicker.finishnolaterthan}'

                    startDate : taskRecord.constraintDate,
                    cls       : `b-bottom b-constraint-date b-constraint-type-${taskRecord.constraintType}`,
                    name      : this.L(`L{ConstraintTypePicker.${taskRecord.constraintType}}`)
                } : null,

                deadlineDate : taskRecord => taskRecord.deadlineDate ? {
                    startDate : taskRecord.deadlineDate,
                    cls       : `b-bottom b-deadline-date`,
                    name      : this.L('L{deadlineDate}')
                } : null
            },

            /**
             * Used to enable/disable built in indicators and to define custom indicators.
             *
             * ```
             * new Gantt({
             *   features : {
             *     indicators : {
             *       items : {
             *         // Disable deadlineDate indicators
             *         deadlineDate : false,
             *
             *         // Add a custom indicator (called prepare)
             *         prepare : taskRecord => ({
             *            startDate : taskRecord.startDate,
             *            iconCls   : 'b-fa b-fa-magnify',
             *            name      : 'Start task preparations'
             *         })
             *       }
             *     }
             *   }
             * });
             * ```
             *
             * For more information, please see the class description at top.
             *
             * @config {Object}
             * @category Common
             */
            items : {}
        };
    }

    static get pluginConfig() {
        return {
            chain : ['onTaskDataGenerated', 'render']
        };
    }

    //endregion

    construct(gantt, config = {}) {
        this.tipId = `${gantt.id}-indicators-tip`;
        this.gantt = gantt;

        // Store items to set manually after config, we do not want to pass them along to the baseclass since it will
        // apply them to the tooltip
        const { items } = config;

        delete config.items;

        super.construct(gantt, config);

        this.items = items;
    }

    // Private setter, not supposed to set it during runtime
    set items(indicators) {
        const me = this;

        // All indicators, custom + default
        me._indicators = ObjectHelper.assign({}, me.defaultIndicators, indicators);

        // Accessors to toggle the indicators from the outside
        me._indicatorAccessors = {};
        // Keep track of enabled/disabled indicators
        me._indicatorStatus = {};

        for (const name in me._indicators) {
            // Store if indicator is enabled/disabled (enabled if true or fn)
            me._indicatorStatus[name] = Boolean(me._indicators[name]);

            // If it was configured as true, it means we should use a default implementation
            if (typeof me._indicators[name] !== 'function') {
                me._indicators[name] = me.defaultIndicators[name];
            }

            // Create accessors so that we can enable/disable on the fly using:
            // gantt.features.indicators.items.deadlineDate = false;
            Object.defineProperty(me._indicatorAccessors, name, {
                enumerable : true,
                get() {
                    return me._indicatorStatus[name] ? me._indicators[name] : false;
                },
                set(value) {
                    me._indicatorStatus[name] = value;
                    me.gantt.refresh();
                }
            });
        }
    }

    /**
     * Accessors for the indicators that can be used to toggle them at runtime.
     *
     * ```
     * gantt.features.indicators.items.deadlineDate = false;
     * ```
     *
     * @returns {Object}
     * @readonly
     * @category Common
     */
    get items() {
        // These accessors are generated in `set items`, allowing runtime enabling/disabling of indicators
        return this._indicatorAccessors;
    }

    //region Render

    // Map fn that generates a DOMConfig for an indicator
    createIndicatorDOMConfig(indicator, index) {
        const
            { gantt, renderData } = this,
            { cls, iconCls }      = indicator,
            x                     = gantt.getCoordinateFromDate(indicator.startDate),
            width                 = indicator.endDate ? gantt.getCoordinateFromDate(indicator.endDate) - x : null,
            classList             = cls && cls.isDomClassList ? cls : new DomClassList(cls);

        return {
            className : Object.assign(classList, {
                'b-indicator' : 1,
                'b-has-icon'  : indicator.iconCls
            }),
            style : {
                transform : `translate(${x}px, ${renderData.top}px)`,
                height    : renderData.height,
                width,
                style     : indicator.style
            },
            dataset : {
                // For sync
                taskId : `${renderData.taskId}-indicator-${index}`,
                title  : indicator.name
            },
            children : [
                iconCls ? {
                    tag       : 'i',
                    className : iconCls
                } : null
            ],
            elementData : indicator
        };
    }

    // Add DOMConfigs for enabled indicators as `extraConfigs` on the task. Will in the end be added to the task row
    onTaskDataGenerated(renderData) {
        const
            { items } = this,
            usedIndicators   = [];

        // Iterate all indicators
        for (const name in items) {
            const indicatorFn = items[name];

            // If it is enabled and a function, call it and store the resulting timespan
            if (this._indicatorStatus[name] && typeof indicatorFn === 'function') {
                const timeSpan = indicatorFn(renderData.taskRecord);
                timeSpan && this.gantt.timeAxis.timeSpanInAxis(timeSpan.startDate, timeSpan.endDate) && usedIndicators.push(timeSpan);
            }
        }

        // Convert indicator timespans to DOMConfigs for rendering
        renderData.extraConfigs.push(...usedIndicators.map(this.createIndicatorDOMConfig, {
            gantt : this.gantt,
            renderData
        }));
    }

    //endregion

    //region Tooltip

    resolveTimeSpanRecord(forElement) {
        return forElement.lastDomConfig.elementData;
    }

    template(data) {
        const { indicator } = data;

        if (data.endDate) {
            return `
                ${indicator.name ? `<div class="b-gantt-task-title">${indicator.name}</div>` : ''}
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr><td>${this.L('L{Start}')}:</td><td>${data.startClockHtml}</td></tr>
                    <tr><td>${this.L('L{End}')}:</td><td>${data.endClockHtml}</td></tr>
                </table>
            `;
        }

        return `
            ${indicator.name ? `<div class="b-gantt-task-title">${indicator.name}</div>` : ''}
            ${data.startText}
        `;
    }

    //endregion
}

GridFeatureManager.registerFeature(Indicators, false);
