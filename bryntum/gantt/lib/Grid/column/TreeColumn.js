import Column from './Column.js';
import ColumnStore from '../data/ColumnStore.js';

/**
 * @module Grid/column/TreeColumn
 */

let currentParentHasIcon = false;

/**
 * A column that displays a tree structure when using the {@link Grid.feature.Tree tree} feature.
 *
 * Default editor is a {@link Core.widget.TextField TextField}.
 *
 * TreeColumn provides configs to define icons for {@link #config-expandIconCls expanded} / {@link #config-collapseIconCls collapsed} nodes,
 * {@link #config-expandedFolderIconCls expanded folder} / {@link #config-collapsedFolderIconCls collapsed folder} nodes and
 * {@link #config-leafIconCls leaf} nodes.
 *
 * When the TreeColumn renders its cells, it will look for two special fields {@link Grid.data.GridRowModel#field-href}
 * and {@link Grid.data.GridRowModel#field-target}. Specifying `href` will produce a link for the TreeNode,
 * and `target` will have the same meaning as in an A tag:
 *
 * ```javascript
 * {
 *    id        : 1,
 *    name      : 'Some external link'
 *    href      : '//www.website.com",
 *    target    : '_blank"
 * }
 * ```
 *
 * @example
 * new TreeGrid({
 *     appendTo : document.body,
 *
 *     columns : [
 *          { type: 'tree', field: 'name' }
 *     ]
 * });
 *
 * @classType tree
 * @extends Grid/column/Column
 * @externalexample column/TreeColumn.js
 */
export default class TreeColumn extends Column {
    static get defaults() {
        return {
            tree     : true,
            hideable : false,
            minWidth : 150
        };
    }

    static get fields() {
        return [
            /**
             * The icon to use for the collapse icon in collapsed state
             * @config {String} expandIconCls
             */
            { name : 'expandIconCls', defaultValue : 'b-icon b-icon-tree-expand' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} collapseIconCls
             */
            { name : 'collapseIconCls', defaultValue : 'b-icon b-icon-tree-collapse' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} collapsedFolderIconCls
             */
            { name : 'collapsedFolderIconCls' },

            /**
             * The icon to use for the collapse icon in expanded state
             * @config {String} expandedFolderIconCls
             */
            { name : 'expandedFolderIconCls' },

            /**
             * Size of the child indent in em. Resulting indent is indentSize multiplied by child level.
             * @config {Number} indentSize
             * @default 1.7
             */
            { name : 'indentSize', defaultValue : 1.7 },

            /**
             * The icon to use for the leaf nodes in the tree
             * @config {String} leafIconCls
             */
            { name : 'leafIconCls', defaultValue : 'b-icon b-icon-tree-leaf' },

            { name : 'editTargetSelector', defaultValue : '.b-tree-cell-value' }
        ];
    }

    static get type() {
        return 'tree';
    }

    constructor(config, store) {
        super(...arguments);

        const me = this;

        me.internalCellCls = 'b-tree-cell';

        // We handle htmlEncoding in this class rather than relying on the generic Row DOM manipulation
        // since this class requires quite a lot of DOM infrastructure around the actual rendered content
        me.shouldHtmlEncode = me.htmlEncode;
        me.tempDiv = document.createElement('div');
        me.setData('htmlEncode', false);

        // add tree renderer (which calls original renderer internally)
        if (me.renderer) {
            me.originalRenderer = me.renderer;
        }
        me.renderer = me.treeRenderer.bind(me);
    }

    /**
     * A column renderer that is automatically added to the column with { tree: true }. It adds padding and node icons
     * to the cell to make the grid appear to be a tree. The original renderer is called in the process.
     * @private
     */
    treeRenderer(renderData) {
        const
            me       = this,
            {
                cellElement,
                row,
                record,
                isExport
            }        = renderData,
            gridMeta = record.instanceMeta(renderData.grid.store),
            tag      = record.href ? 'a' : 'div';

        let { value } = renderData,
            result;

        if (me.originalRenderer) {
            const rendererHtml = me.originalRenderer(renderData);
            value = rendererHtml === false ? cellElement.innerHTML : rendererHtml;
        }

        if (!isExport) {
            let html = '',
                iconCls;

            if (!record.isLeaf) {
                const
                    isCollapsed     = gridMeta.collapsed,
                    expanderIconCls = isCollapsed ? me.expandIconCls : me.collapseIconCls,
                    folderIconCls   = isCollapsed ? me.collapsedFolderIconCls : me.expandedFolderIconCls;

                // Row can be just a dummy object for example when the renderer is called from Column#resizeToFitContent
                if (row.$name === 'Row') {
                    const
                        loadingCls      = 'b-loading-children',
                        collapsedCls    = 'b-tree-collapsed',
                        expandedCls     = 'b-tree-expanded',
                        rowClsToAdd     = ['b-tree-parent-row'],
                        rowClsToRemove  = [];

                    // Spinner while loading children, added to row in Tree#toggleCollapse but needs to be readded if row is rerendered during load
                    if (gridMeta.isLoadingChildren) {
                        rowClsToAdd.push(loadingCls);
                    }
                    else {
                        rowClsToRemove.push(loadingCls);
                    }

                    if (isCollapsed) {
                        rowClsToAdd.push(collapsedCls);
                        rowClsToRemove.push(expandedCls);
                    }
                    else {
                        rowClsToAdd.push(expandedCls);
                        rowClsToRemove.push(collapsedCls);
                    }

                    row.removeCls(...rowClsToRemove);
                    row.addCls(...rowClsToAdd);
                }

                cellElement.classList.add('b-tree-parent-cell');

                html += `<div class="b-tree-expander">${expanderIconCls ? `<i class="${expanderIconCls}"></i>` : ''}</div>`;

                // Allow user to customize tree icon or opt out entirely
                currentParentHasIcon = iconCls = renderData.iconCls || record.iconCls || folderIconCls;
            }
            else {
                // TODO: Cleanup for reusing dom nodes should be done elsewhere, also cleanup selection
                cellElement.classList.add('b-tree-leaf-cell');

                // Allow user to customize tree icon or opt out entirely
                iconCls = renderData.iconCls || record.iconCls || me.leafIconCls;
            }

            value = value != null ? value : '';

            if (me.shouldHtmlEncode) {
                me.tempDiv.innerText = value;
                value = me.tempDiv.innerHTML;
            }

            html += `<div class="b-tree-cell-value">${iconCls ? `<i class="b-tree-icon ${iconCls}"></i>` : ''}${value}</div>`;

            const padding = (record.childLevel * me.indentSize + (record.isLeaf ? (currentParentHasIcon ? 2.0 : (iconCls ? 0.5 : 0.4)) : 0));

            // requires to be a one-liner for SinglePage_features.t.js test
            result = `<${tag} ${record.href ? `href="${record.href}"` : ''} ${tag === 'a' && record.target ? `target="${record.target}"` : ''} class="b-tree-cell-inner" style="padding-left:${padding}em;">${html}</${tag}>`;
        }
        else {
            result = value != null ? value : '';
        }

        return result;
    }
}

ColumnStore.registerColumnType(TreeColumn, true);
TreeColumn.exposeProperties();
