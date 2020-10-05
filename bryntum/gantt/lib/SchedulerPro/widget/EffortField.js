import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import DurationField from '../../Core/widget/DurationField.js';

/**
 * @module SchedulerPro/widget/EffortField
 */

// NOTE: class is created mostly for localization reasons
//       effort field invalidText might differ from duration field one.

/**
 * A specialized field allowing a user to also specify duration unit when editing the effort value.
 *
 * @extends Core/widget/DurationField
 * @classType effort
 */
export default class EffortField extends DurationField {

    static get $name() {
        return 'EffortField';
    }

    static get type() {
        return 'effort';
    }
}

BryntumWidgetAdapterRegister.register(EffortField.type, EffortField);
BryntumWidgetAdapterRegister.register(`${EffortField.type}field`, EffortField);
