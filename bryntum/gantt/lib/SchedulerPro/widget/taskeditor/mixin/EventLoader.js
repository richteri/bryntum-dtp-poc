import Container from '../../../../Core/widget/Container.js';

/**
 * @module SchedulerPro/widget/taskeditor/mixin/EventLoader
 */

/**
 * Mixin class for task editor widgtes which require record loading functionality
 *
 * @mixin
 */
export default Target => class extends (Target || Container) {

    getProject() {
        return this.record && this.record.getProject();
    }

    loadEvent(record) {
        this.record = record;
    }

    resetData() {
        this.record = null;
    }

    beforeSave() {}

    afterSave() {
        this.resetData();
    }

    beforeCancel() {}

    afterCancel() {
        this.resetData();
    }

    beforeDelete() {}

    afterDelete() {
        this.resetData();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
