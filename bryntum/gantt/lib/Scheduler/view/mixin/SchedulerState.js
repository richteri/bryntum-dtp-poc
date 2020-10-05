import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/view/mixin/SchedulerState
 */

const copyProperties = [
    'eventLayout',
    'barMargin',
    'mode',
    'eventColor',
    'eventStyle',
    'fillTicks'
];

/**
 * Mixin for Scheduler that handles state. It serializes the following scheduler properties:
 *
 * * eventLayout
 * * barMargin
 * * mode
 * * tickSize
 * * zoomLevel
 * * eventColor
 * * eventStyle
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * @mixin
 */
export default Target => class SchedulerState extends (Target || Base) {
    /**
     * Get schedulers current state for serialization. State includes rowHeight, headerHeight, readOnly, selectedCell,
     * selectedRecordId, column states and store state.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const state = ObjectHelper.copyProperties(super.getState(), this, copyProperties);

        state.zoomLevel = this.zoomLevel;

        state.zoomLevelOptions = {
            startDate          : this.startDate,
            endDate            : this.endDate,
            viewportCenterDate : this.viewportCenterDate,
            width              : this.tickSize
        };

        return state;
    }

    /**
     * Apply previously stored state.
     * @param {Object} state
     * @private
     */
    applyState(state) {
        if (state.zoomLevel) {
            this.zoomToLevel(state.zoomLevel, state.zoomLevelOptions);
        }

        ObjectHelper.copyProperties(this, state, copyProperties);

        super.applyState(state);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
