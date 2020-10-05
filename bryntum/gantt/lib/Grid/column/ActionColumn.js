import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/column/ActionColumn
 */

/**
 * A column that displays actions (clickable icons) in the cell.
 *
 * ```javascript
 * new TreeGrid({
 *     appendTo : document.body,
 *     columns  : [{
 *         type    : 'action',
 *         text    : 'Increase amount',
 *         actions : [{
 *             cls      : 'b-fa b-fa-plus',
 *             renderer : ({ action, record }) => `<i class="b-action-item ${action.cls} b-${record.enabled ? "green" : "red"}-class"></i>`,
 *             visible  : ({ record }) => record.canAdd,
 *             tooltip  : ({ record }) => `<p class="b-nicer-than-default">Add to ${record.name}</p>`,
 *             onClick  : ({ record }) => console.log(`Adding ${record.name}`)
 *         }, {
 *             cls     : 'b-fa b-fa-pencil',
 *             tooltip : 'Edit note',
 *             onClick : ({ record }) => console.log(`Editing ${record.name}`)
 *         }]
 *     }]
 * });
 * ```
 *
 * Actions may be placed in {@link Grid/feature/Group} headers, by setting `actions.showForGroup` to `true`. Those actions will not be shown on normal rows.
 *
 * @extends Grid/column/Column
 *
 * @classType action
 * @externalexample column/ActionColumn.js
 */
export default class ActionColumn extends Column {

    static get type() {
        return 'action';
    }

    static get fields() {
        return [
            /**
             * An array of action config objects
             * @config {Object[]} actions List of action configs
             * @config {String} actions.cls CSS Class for action icon
             * @config {Function|String} actions.tooltip Tooltip text
             * @config {Function|Boolean} actions.visible Callback function or Boolean to update action icon visiblity on data change
             * @config {Function} actions.onClick Callback to handle click action item event
             * @config {Model} actions.onClick.record Record model
             * @config {Boolean} actions.showForGroup Set to true to have action icon visible in group headers only when using the `group` feature
             * @config {Function} actions.renderer A render function used to define the action element. Expected to return a HTML string or a DOM config object
             * @category Common
             */
            'actions'
        ];
    }

    static get defaults() {
        return {
            filterable : false,
            sortable   : false,
            editor     : false,
            searchable : false,
            htmlEncode : false,
            resizable  : false,
            groupable  : false,
            minWidth   : 30
        };
    }

    construct(config, store) {
        this.internalCellCls = 'b-action-cell';

        super.construct(...arguments);

        // use auto-size only as default behaviour
        if (!config.width && !config.flex) {
            this.grid.on('paint', this.updateAutoWidth, this);
        }
    }

    /**
     * Renderer that displays action icon(s) in the cell.
     * @private
     */
    renderer({ column, record }) {
        const inGroupTitle = record && ('groupRowFor' in record.meta);

        return {
            className : { 'b-action-ct' : 1 },
            children  : column.actions.map((actionConfig, index) => {
                if ('visible' in actionConfig) {
                    if ((typeof actionConfig.visible === 'function') && actionConfig.visible({ record }) === false) {
                        return '';
                    }
                    if (actionConfig.visible === false) {
                        return '';
                    }
                }

                // check if an action allowed to be shown in case of using groupping
                if ((inGroupTitle && !actionConfig.showForGroup) || (!inGroupTitle && actionConfig.showForGroup)) {
                    return '';
                }

                let btip;
                if (typeof actionConfig.tooltip === 'function') {
                    btip = actionConfig.tooltip({ record });
                }
                else {
                    btip = actionConfig.tooltip || '';
                }

                // handle custom renderer if it is specified
                if (actionConfig.renderer && typeof actionConfig.renderer === 'function') {
                    const customRendererData =  actionConfig.renderer({
                        index,
                        record,
                        column,
                        tooltip : btip,
                        action  : actionConfig
                    });

                    // take of set data-index to make onClick handler work stable
                    if (typeof customRendererData === 'string') {
                        return {
                            tag     : 'span',
                            dataset : { index },
                            html    : customRendererData
                        };
                    }
                    else {
                        customRendererData.dataset = customRendererData.dataset || {};
                        customRendererData.dataset.index = index;
                        return customRendererData;
                    }
                }
                else {
                    return {
                        tag       : 'i',
                        dataset   : { index, btip },
                        className : {
                            'b-action-item'    : 1,
                            [actionConfig.cls] : 1
                        }
                    };
                }
            })
        };
    }

    /**
     * Handle icon click and call action handler.
     * @private
     */
    onCellClick({ grid, column, record, target }) {
        if (!target.classList.contains('b-action-item') || grid.readOnly) {
            return;
        }

        let actionIndex = target.dataset.index;
        // index may be set in a parent node if user used an html string in his custom renderer
        // and we take care to set this property to support onClick handler
        if (!actionIndex) {
            actionIndex = target.parentElement.dataset && target.parentElement.dataset.index;
        }

        const
            action        = column.actions[actionIndex],
            actionHandler = action && action.onClick;

        if (actionHandler) {
            this.callback(actionHandler, column, [{ record, action }]);
        }
    }

    /**
     * Update width for actions column to fit content.
     * @private
     */
    updateAutoWidth() {
        const
            me           = this,
            groupActions = [];

        let actions = [];

        // collect group and non group actions to check length later
        me.actions.forEach(actionOriginal => {
            const action = { ...actionOriginal };

            // remove possible visibility condition to make sure an action will exists in test HTML
            delete action.visible;
            // group actions shows in different row and never together with non group
            if (action.showForGroup) {
                delete action.showForGroup;
                groupActions.push(action);
            }
            else {
                actions.push(action);
            }
        });

        // use longest actions length to calculate column width
        if (groupActions.length > actions.length) {
            actions = groupActions;
        }

        const
            actionsHtml = DomHelper.createElement(me.renderer({ column : { actions } })).outerHTML,
            cellElement = me.grid.element.querySelector(`.b-grid-cell[data-column-id=${me.id}]`);

        me.width = DomHelper.measureText(actionsHtml, cellElement, true, cellElement.parentElement);
    }
}

ColumnStore.registerColumnType(ActionColumn);
ActionColumn.exposeProperties();
