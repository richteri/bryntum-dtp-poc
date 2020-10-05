import Container from '../../../Core/widget/Container.js';
import EventLoader from './mixin/EventLoader.js';
import EventChangePropagator from './mixin/EventChangePropagator.js';
import StringHelper from '../../../Core/helper/StringHelper.js';
import Field from '../../../Core/widget/Field.js';
import LocaleManager from '../../../Core/localization/LocaleManager.js';
import TaskEditorTab from './mixin/TaskEditorTab.js';

/**
 * @module Gantt/widget/taskeditor/FormTab
 */

/**
 * Base class for form-like {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} tabs.
 *
 * @internal
 */
export default class FormTab extends EventChangePropagator(TaskEditorTab(EventLoader(Container))) {

    static get $name() {
        return 'FormTab';
    }

    static get defaultConfig() {
        return {
            layoutStyle : {
                flexFlow     : 'row wrap',
                alignItems   : 'flex-start',
                alignContent : 'flex-start'
            },

            defaults : {
                labelWidth : '7em'
            }
        };
    }

    afterConfigure() {
        const me = this;

        super.afterConfigure();

        Object.values(me.widgetMap).forEach(w => {
            w.name && w.on('change', me.onWidgetValueChange, me);
        });

        LocaleManager.on({
            locale  : me.onLocaleChange,
            thisObj : me
        });
    }

    loadEvent(eventRecord) {
        this._loading = true;
        super.loadEvent(eventRecord);
        this._loading = false;
    }

    resetData() {
        this._loading = true;
        super.resetData();
        this._loading = false;
    }

    onWidgetValueChange({ source, value, checked, valid }) {
        const
            me      = this,
            project = me.getProject();

        valid = valid !== undefined ? valid : (typeof source.isValid === 'function') ? source.isValid() : source.isValid;

        if (!me._loading && valid && project && !project.isPropagating()) {
            const
                record     = me.record,
                setterName = `set${StringHelper.capitalizeFirstLetter(source.name)}`;

            if ((setterName in record) || (source.name in record) || (record.$[source.name])) {

                if (setterName in record) {
                    record[setterName](value);
                }
                else if (source.name in record) {
                    record[source.name] = value;
                }
                else {
                    record.$[source.name].put(value);
                }

                me.requestPropagation();
            }
        }
    }

    onLocaleChange() {
        Object.values(this.widgetMap).forEach(w => {
            if (w instanceof Field && w.parent === this) {
                w.labelWidth = this.L('labelWidth');
            }
        });
    }
}
