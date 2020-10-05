/**
 * @module Gantt/widget/taskeditor/mixin/TaskEditorTab
 */

/**
 * Mixin class for task editor tabs which processes common tab configs. Like `extraWidgets`
 *
 * @mixin
 */

export default Target => class extends Target {
    startConfigure(config) {
        if (config.extraItems && config.items) {
            config.items.push(...config.extraItems);
            config.items.sort((widgetA, widgetB) => (widgetA.index | 0) - (widgetB.index - 0));
        }
        super.afterConfigure();
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
