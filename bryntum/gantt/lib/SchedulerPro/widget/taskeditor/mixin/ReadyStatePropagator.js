import Base from '../../../../Core/Base.js';
import Events from '../../../../Core/mixin/Events.js';

export default Target => class extends (Target || Events(Base)) {

    get isReadyStatePropagator() {
        return true;
    }

    get canSave() {
        return true;
    }

    requestReadyStateChange() {
        this.trigger('readystatechange', { canSave : this.canSave });
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
