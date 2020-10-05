import Tooltip from '../../Core/widget/Tooltip.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import '../../Core/data/DomDataStore.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/feature/CellTooltip
 */

/**
 * Displays a tooltip when hovering cells. Contents can be customized by specifying a global `tooltipRenderer` function
 * for the feature and/or on a per column basis.
 *
 * Configuration properties passed into this feature are used to configure the {@link Core.widget.Tooltip} instance
 * used.
 *
 * This feature is <strong>disabled</strong> by default.
 *
 * ## Showing async content
 * Showing remotely loaded content is super easy using the {@link #config-tooltipRenderer}:
 *
 * ```javascript
 * // Async tooltip with some custom settings
 * let grid = new Grid({
 *   features: {
 *     cellTooltip: {
 *       // Time that mouse needs to be over cell before tooltip is shown
 *       hoverDelay : 4000,
 *       // Time after mouse out to hide the tooltip, 0 = instantly
 *       hideDelay  : 0,
 *       // Async tooltip renderer, return a Promise which yields the text content
 *       tooltipRenderer({ record, tip }) => AjaxHelper.get(`tooltip.php?id=${record.id}`).then(response => response.text())
 *     }
 *   }
 * });
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @example
 * // Enable CellTooltip and configure it to show the cell's full value
 * let grid = new Grid({
 *   features: {
 *     cellTooltip: ({value}) => value
 *   }
 * });
 *
 * // Column with its own tooltip renderer
 * {
 *   text            : 'Name',
 *   field           : 'name',
 *   tooltipRenderer : ({ record }) => `My name is\xa0<b>${record.name}</b>`
 * }
 *
 * @demo Grid/celltooltip
 * @classtype cellTooltip
 * @externalexample feature/CellTooltip.js
 */
export default class CellTooltip extends InstancePlugin {
    //region Config

    static get $name() {
        return 'CellTooltip';
    }

    static get defaultConfig() {
        return {
            /**
             * Function called to generate the HTML content for the cell tooltip. The function should return a string (your HTML), or a Promise yielding a string (for remotely loaded content)
             * @config {Function}
             * @param {Object} context
             * @param {HTMLElement} context.cellElement The cell element
             * @param {Core.data.Model} context.record The row record
             * @param {Grid.column.Column} context.column The column
             * @param {Core.widget.Tooltip} context.tip The Tooltip instance
             * @param {Grid.feature.CellTooltip} context.cellTooltip The feature
             * @param {Event} context.event The raw DOM event
             * @return {String|Promise}
             */
            tooltipRenderer : null
        };
    }

    //endregion

    // region Init

    construct(grid, config) {
        const me = this;

        super.construct(grid, me.processConfig(config));
    }

    initTip() {
        const me = this;

        me.tip = new Tooltip(ObjectHelper.assign({
            forElement  : me.client.element,
            forSelector : '.b-grid-cell',
            hoverDelay  : 1000,
            trackMouse  : false,
            cls         : 'b-celltooltip-tip',
            getHtml     : me.getTooltipContent.bind(me),
            listeners   : {
                pointerOver : 'onPointerOver',
                thisObj     : me
            }
        }, me.initialConfig));

        me.relayEvents(me.tip, ['beforeshow', 'show']);
    }

    onPointerOver({ target }) {
        const column = this.client.getColumnFromElement(target);

        // Veto onPointerOver if column's tooltipRenderer is false
        return column.tooltipRenderer !== false;
    }

    // CellTooltip feature handles special config cases, where user can supply a function to use as tooltipRenderer
    // instead of a normal config object
    processConfig(config) {
        if (typeof config === 'function') {
            return {
                tooltipRenderer : config
            };
        }

        return config;
    }

    // override setConfig to process config before applying it (used mainly from ReactGrid)
    setConfig(config) {
        super.setConfig(this.processConfig(config));
    }

    doDestroy() {
        this.tip && this.tip.destroy();
        super.doDestroy();
    }

    doDisable(disable) {
        if (!disable) {
            this.initTip();
        }
        else if (this.tip) {
            this.tip.destroy();
            this.tip = null;
        }

        super.doDisable(disable);
    }

    //endregion

    //region Content

    /**
     * Called from Tooltip to populate it with html.
     * @private
     */
    getTooltipContent({ tip, activeTarget : cellElement, event }) {
        const
            me     = this,
            record = me.client.getRecordFromElement(cellElement),
            column = me.client.getColumnFromElement(cellElement);

        let result;

        // If we have not changed context, we should not change content, unless we have a custom target selector (element within the cell)
        if (!me.forSelector && record === me.lastRecord && column === me.lastColumn) {
            return me.tip._html;
        }

        me.lastRecord = record;
        me.lastColumn = column;

        // first, use columns tooltipRenderer if any
        if (column.tooltipRenderer) {
            result = column.tooltipRenderer({ cellElement, record, column, event, tip, cellTooltip : me });

            if (result === false) {
                VersionHelper.deprecate('Grid', '5.0.0', 'Returning false to indicate loading is deprecated. Please see https://bryntum.com/docs/grid/#guides/upgrades/3.0.1.md for more information');
            }
        }
        // secondly, try features renderer (but specifying column.tooltipRenderer as false prevents tooltip in that column)
        else if (me.tooltipRenderer && column.tooltipRenderer !== false) {
            result = me.tooltipRenderer({ cellElement, record, column, event, tip, cellTooltip : me });

            if (result === false) {
                VersionHelper.deprecate('Grid', '5.0.0', 'Returning false to indicate loading is deprecated. Please see https://bryntum.com/docs/grid/#guides/upgrades/3.0.1.md for more information');
            }
        }

        return result;
    }

    //endregion
}

GridFeatureManager.registerFeature(CellTooltip);
