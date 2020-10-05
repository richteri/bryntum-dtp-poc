import Base from '../../../../Core/Base.js';
import Events from '../../../../Core/mixin/Events.js';

/**
 * Mixin for task editor widgets to properly propagate event changes.
 *
 * Works in tandem with {@link Core/mixin/Events events} mixin.
 *
 * @mixin
 */
export default Target => class extends (Target || Events(Base)) {

    get isEventChangePropagator() {
        return true;
    }

    requestPropagation() {
        this.trigger('requestPropagation');
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
