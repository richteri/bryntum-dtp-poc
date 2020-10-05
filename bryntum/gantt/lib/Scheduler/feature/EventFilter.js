import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Scheduler/feature/EventFilter
 */

/**
 * Adds event filter menu items to the timeline header context menu.
 *
 * This feature is **enabled** by default
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @example
 * let scheduler = new Scheduler({
 *   features : {
 *     eventFilter : true // `true` by default, set to `false` to disable the feature and remove the menu item from the timeline header
 *   }
 * });
 *
 * @classtype EventFilter
 * @externalexample scheduler/EventFilter.js
 */
export default class EventFilter extends InstancePlugin {
    // Plugin configuration. This plugin chains some of the functions in Grid.

    static get $name() {
        return 'EventFilter';
    }

    static get pluginConfig() {
        return {
            chain : ['getHeaderMenuItems']
        };
    }

    construct(scheduler, config) {
        super.construct(scheduler, config);

        this.scheduler = scheduler;
    }

    /**
     * Populates the header context menu items.
     * @param {Grid.column.Column} column Column for which the menu will be shown
     * @param {Object[]} items Array of menu items
     * @internal
     */
    getHeaderMenuItems(column, items) {
        const me = this;

        if (column.type !== 'timeAxis') return;

        items.push({
            text        : 'L{filterEvents}',
            localeClass : this,
            icon        : 'b-fw-icon b-icon-filter',
            disabled    : me.disabled,
            menu        : {
                type  : 'popup',
                items : [{
                    type                 : 'textfield',
                    cls                  : 'b-eventfilter b-last-row',
                    clearable            : true,
                    keyStrokeChangeDelay : 300,
                    label                : 'L{byName}',
                    localeClass          : this,
                    width                : 200,
                    listeners            : {
                        change  : me.onEventFilterChange,
                        thisObj : me
                    }
                }],
                onBeforeShow({ source : menu }) {
                    const
                        [filterByName] = menu.items,
                        filter         = me.scheduler.eventStore.filters.getBy('property', 'name');

                    filterByName.value = filter && filter.value;
                }
            }
        });
    }

    onEventFilterChange({ value }) {
        const me = this;

        if (value !== '') {
            me.scheduler.eventStore.filter('name', value);
        }
        else {
            me.scheduler.eventStore.removeFilter('name');
        }
    }
}

EventFilter.featureClass = 'b-event-filter';

GridFeatureManager.registerFeature(EventFilter, true, ['Scheduler', 'Gantt']);
