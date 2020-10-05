import Base from '../../../Core/Base.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/view/mixin/GanttState
 */

const copyProperties = [
    'barMargin'
];

/**
 * Mixin for Gantt that handles state. It serializes the following gantt properties:
 *
 * * barMargin
 * * tickSize
 * * zoomLevel
 *
 * See {@link Grid.view.mixin.GridState} and {@link Core.mixin.State} for more information on state.
 *
 * @mixin
 */
export default Target => class GanttState extends (Target || Base) {
    /**
     * Get gantts current state for serialization. State includes rowHeight, headerHeight, readOnly, selectedCell,
     * selectedRecordId, column states and store state etc.
     * @returns {Object} State object to be serialized
     * @private
     */
    getState() {
        const state = ObjectHelper.copyProperties(super.getState(), this, copyProperties);

        state.zoomLevel = this.zoomLevel;

        state.zoomLevelOptions = {
            startDate  : this.startDate,
            endDate    : this.endDate,
            centerDate : this.viewportCenterDate,
            width      : this.tickSize
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
