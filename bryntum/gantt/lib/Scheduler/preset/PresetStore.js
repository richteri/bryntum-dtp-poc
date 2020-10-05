// eslint-disable-next-line import/no-named-default
import { unitMagnitudes } from '../../Core/helper/DateHelper.js';
import ViewPreset from './ViewPreset.js';
import Localizable from '../../Core/localization/Localizable.js';
import Store from '../../Core/data/Store.js';
import PresetManager from './PresetManager.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Scheduler/preset/PresetStore
 */

/**
 * A special Store subclass which holds {@link Scheduler.preset.ViewPreset ViewPresets}.
 * Each ViewPreset in this store represents a zoom level. The store data is sorted in special
 * zoom order. That is zoomed out to zoomed in. The first Preset will produce the narrowest event bars
 * the last one will produce the widest event bars.
 *
 * To specify view presets (zoom levels) please provide set of view presets to the scheduler:
 *
 * ```javascript
 * const myScheduler = new Scheduler({
 *     presets : [
 *         {
 *             base : 'hourAndDay',
 *             id   : 'MyHourAndDay',
 *             // other preset configs....
 *         },
 *         {
 *             base : 'weekAndMonth',
 *             id   : 'MyWeekAndMonth',
 *             // other preset configs....
 *         }
 *     ],
 *     viewPreset : 'MyHourAndDay',
 *     // other scheduler configs....
 *     });
 * ```
 *
 * @extends Core/data/Store
 */
export default class PresetStore extends Localizable(Store) {
    static get defaultConfig() {
        return {
            useRawData : true,

            modelClass : ViewPreset,

            /**
             * Specifies the sort order of the presets in the store.
             * By default they are in zoomed out to zoomed in order. That is
             * presets which will create widest event bars to presets
             * which will produce narrowest event bars.
             *
             * Configure this as `-1` to reverse this order.
             * @config {Number}
             * @default
             */
            zoomOrder : 1
        };
    }

    set storage(storage) {
        super.storage = storage;

        // Maintained in order automatically while adding.
        this.storage.addSorter((lhs, rhs) => {
            const
                leftBottomHeader  = lhs.bottomHeader,
                rightBottomHeader = rhs.bottomHeader;

            // Sort order:
            //  Milliseconds per pixel.
            //  Tick size.
            //  Unit magnitude.
            //  Increment size.
            const
                order = rhs.msPerPixel - lhs.msPerPixel ||
                unitMagnitudes[leftBottomHeader.unit] - unitMagnitudes[rightBottomHeader.unit] ||
                leftBottomHeader.increment - rightBottomHeader.increment;

            return order * this.zoomOrder;
        });
    }

    get storage() {
        return super.storage;
    }

    createRecord(data) {
        // TODO: remove deprecated compatibility layer in V4
        if (data.preset && !data.base) {
            VersionHelper.deprecate('Scheduler', '4.0.0', 'ViewPreset preset config replaced by base config. See https://www.bryntum.com/docs/scheduler/#guides/upgrades/3.0.md');
            data.base = data.preset;
        }

        if (data.base) {
            const base = this.getById(data.base) || PresetManager.getById(data.base);

            data = Object.setPrototypeOf(data, base.data);
        }
        return super.createRecord(...arguments);
    }

    updateLocalization() {
        super.updateLocalization();

        this.forEach((preset) => {
            const locale = this.L(preset.id);

            if (locale) {
                locale.displayDateFormat && (preset.displayDateFormat = locale.displayDateFormat);
                locale.middleDateFormat  && preset.headerConfig.middle && (preset.headerConfig.middle.dateFormat = locale.middleDateFormat);
                locale.topDateFormat     && preset.headerConfig.top    && (preset.headerConfig.top.dateFormat    = locale.topDateFormat);
                locale.bottomDateFormat  && preset.headerConfig.bottom && (preset.headerConfig.bottom.dateFormat = locale.bottomDateFormat);
            }
        });
    }
}
