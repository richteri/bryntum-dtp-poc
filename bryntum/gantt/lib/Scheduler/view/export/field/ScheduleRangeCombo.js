import { ScheduleRange } from '../../../feature/export/Utils.js';
import BryntumWidgetAdapterRegister from '../../../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import LocalizableCombo from '../../../../Grid/view/export/field/LocalizableCombo.js';

export default class ScheduleRangeCombo extends LocalizableCombo {
    static get $name() {
        return 'ScheduleRangeCombo';
    }

    static get defaultConfig() {
        return {
            editable : false
        };
    }

    buildLocalizedItems() {
        const me = this;

        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{completeview}'
        // 'L{currentview}'
        // 'L{daterange}'
        // 'L{completedata}'

        return Object.entries(ScheduleRange).map(([id, text]) => ({ id, text : me.L(`L{${text}}`) }));
    }
}

BryntumWidgetAdapterRegister.register(ScheduleRangeCombo.$name.toLowerCase(), ScheduleRangeCombo);
