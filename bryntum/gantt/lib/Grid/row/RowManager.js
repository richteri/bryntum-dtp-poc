//TODO: Handle vertical resize, add/remove row elements?

import Rectangle from '../../Core/helper/util/Rectangle.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import Row from './Row.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Grid/row/RowManager
 * @private
 */

/**
 * Virtual representation of the grid, using {@link Grid.row.Row} to represent rows. Plugs into {@link Grid.view.Grid}
 * and exposes the following functions on grid itself:
 * * {@link #function-getRecordCoords()}
 * * {@link #function-getRowById()}
 * * {@link #function-getRow()}
 * * {@link #function-getRowFor()}
 * * {@link #function-getRowFromElement()}
 *
 * @example
 * let row = grid.getRowById(1);
 * @private
 */
export default class RowManager extends InstancePlugin {
    //region Config

    // Plugin configuration.
    static get pluginConfig() {
        return {
            chain : [
                'getRowById', 'topRow', 'bottomRow', 'getRecordCoords', 'getRow', 'getRowFor', 'getRowFromElement', 'destroy'
            ],
            assign : [
                'rowHeight'
            ]
        };
    }

    static get defaultConfig() {
        return {
            /**
             * Number of rows to render above current viewport
             * @config {Number}
             * @default
             */
            prependRowBuffer : 5,

            /**
             * Number of rows to render below current viewport
             * @config {Number}
             * @default
             */
            appendRowBuffer : 5,

            /**
             * Default row height, assigned from Grid at construction (either from config
             * {@link Grid.view.Grid#config-rowHeight} or CSS). Can be set from renderers
             * @config {Number}
             * @default
             */
            rowHeight : null,

            /**
             * Set to `true` to get a small performance boost in applications that uses fixed row height
             * @config {Boolean}
             */
            fixedRowHeight : null,

            autoHeight : false
        };
    }

    static get properties() {
        return {
            idMap                : {},
            // TODO: investigate if topIndex can to built away, since topRow is always first in array and has dataIndex??
            topIndex             : 0,
            lastScrollTop        : 0,
            _rows                : [],
            // Record id -> row height mapping
            heightMap            : new Map(),
            // Sum of entries in heightMap
            totalKnownHeight     : 0,
            // Will be calculated in `estimateTotalHeight()`, as totalKnownHeight + an estimate for unknown rows
            _totalHeight         : 0,
            // Average of the known heights, kept up to date when entries in the heightMap are updated
            averageRowHeight     : 0,
            scrollTargetRecordId : null,
            refreshDetails       : {
                topRowIndex : 0,
                topRowTop   : 0
            }
        };
    }

    //endregion

    //region Init

    construct(config) {
        config.grid._rowManager = this;

        super.construct(config.grid, config);
    }

    // Chained to grids doDestroy
    doDestroy() {
        // To remove timeouts
        this._rows.forEach(row => row.destroy());

        super.doDestroy();
    }

    /**
     * Initializes the RowManager with Rows to fit specified height.
     * @param {Number} height
     * @param {Boolean} [isRendering]
     * @private
     * @category Init
     */
    initWithHeight(height, isRendering = false) {
        const me = this;

        // no valid height, make room for all rows
        if (me.autoHeight) {
            height = me.store.allCount * me.preciseRowOffsetHeight;
        }

        me.viewHeight = height;
        me.calculateRowCount(isRendering);

        return height;
    }

    /**
     * Releases all elements (not from dom), calculates how many are needed, creates those and renders
     */
    reinitialize(returnToTop = false) {
        const me = this;

        // Calculate and correct the amount of rows needed (without triggering render)
        // Rows which are found to be surplus are destroyed.
        me.calculateRowCount(false, true, true);

        // If our row range is outside of the store's range, force a return to top
        if (me.topIndex + me.rowCount - 1 > me.store.count) {
            returnToTop = true;
        }

        const top = me.topRow && !returnToTop ? me.topRow.top : 0;

        me.scrollTargetRecordId = null;

        if (returnToTop) {
            me.topIndex = me.lastScrollTop = 0;
        }

        const { topRow } = me;

        if (topRow) {
            // Ensure rendering from the topRow starts at the correct position
            topRow.dataIndex = me.topIndex;
            topRow.setTop(top);
        }

        // Need to estimate height in case we have Grid using autoHeight
        me.estimateTotalHeight();

        me.renderFromRow(topRow);
    }

    //endregion

    //region Rows

    /**
     * Add or remove rows to fit row count
     * @private
     * @category Rows
     */
    matchRowCount(skipRender = false) {
        const
            me             = this,
            { rows, grid } = me,
            numRows        = rows.length,
            delta          = numRows - me.rowCount;

        if (delta) {
            if (delta < 0) {
                const newRows = [];

                // add rows
                for (let index = numRows, dataIndex = numRows ? rows[numRows - 1].dataIndex + 1 : 0; index < me.rowCount; index++, dataIndex++) {
                    newRows.push(new Row({
                        rowManager : me,
                        grid,
                        index,
                        dataIndex
                    }));
                }
                rows.push.apply(rows, newRows);
                // and elements (by triggering event used by SubGrid to add elements)
                me.trigger('addRows', { rows : newRows });

                if (!skipRender) {
                    // render
                    me.renderFromRow(rows[Math.max(0, numRows - 1)]);
                }
            }
            else {
                // remove rows from bottom
                const removedRows = rows.splice(numRows - delta, delta);

                // trigger event in case some feature needs to cleanup when removing (widget column might be interested)
                me.trigger('removeRows', { rows : removedRows });

                removedRows.forEach(row => row.destroy());
                // no need to rerender or such when removing from bottom. all is good :)
            }
        }
    }

    /**
     * Calculates how many rows fit in the available height (view height)
     * @private
     * @category Rows
     */
    calculateRowCount(skipMatchRowCount = false, allowRowCountShrink = true, skipRender = false) {
        // TODO: replace prependRowBuffer, appendXX with bufferSize
        const
            me                = this,
            { store }         = me,
            visibleRowCount   = Math.ceil(me.viewHeight / me.minRowOffsetHeight), // Want whole rows
            maxRenderRowCount = visibleRowCount + me.prependRowBuffer + me.appendRowBuffer;

        // If RowManager is reinitialized in a hidden state the view might not have a height
        if (!me.grid.columns.count || isNaN(visibleRowCount)) {
            me.rowCount = 0;
            return 0;
        }

        // when for example jumping we do not want to remove excess rows,
        // since we know they are needed at other scroll locations
        if (maxRenderRowCount < me.rowCount && !allowRowCountShrink) {
            return me.rowCount;
        }

        me.visibleRowCount = visibleRowCount;
        me.rowCount = Math.min(store.count, maxRenderRowCount); // No need for more rows than data

        // If the row count doesn't match the calculated, ensure it matches,
        if (!skipMatchRowCount) {
            if (me.rows && me.rowCount !== me.rows.length) {
                me.matchRowCount(skipRender);
            }
            else if (!me.rowCount) {
                me.trigger('changeTotalHeight', { totalHeight : me.totalHeight });
            }
            me.grid.toggleEmptyText();
        }

        return me.rowCount;
    }

    removeAllRows() {
        // remove rows from bottom
        const
            me         = this,
            { topRow } = me,
            result     = topRow ? (me.refreshDetails = {
                topRowIndex : topRow.dataIndex,
                topRowTop   : topRow.top
            }) : me.refreshDetails,
            removedRows = me.rows.slice();

        // trigger event in case some feature needs to cleanup when removing (widget column might be interested)
        me.trigger('removeRows', { rows : removedRows });

        me.rows.forEach(row => row.destroy());
        me.rows.length = 0;
        me.idMap = {};

        // We return a descriptor of the last rendered block before the remove.
        // This is primarily for a full GridBase#renderContents to be able to perform a correct refresh.
        return result;
    }

    setPosition(refreshDetails) {
        // Sets up the rendering position for the next call to reinitialize
        const
            { topRow }                 = this,
            { topRowIndex, topRowTop } = refreshDetails;

        topRow.setTop(topRowTop);
        topRow.dataIndex = topRowIndex;
    }

    //endregion

    //region Rows - Getters

    get store() {
        return this.client.store;
    }

    /**
     * Get all Rows
     * @property {Grid.row.Row[]}
     * @readonly
     * @category Rows
     */
    get rows() {
        return this._rows;
    }

    /**
     * Get the Row at specified index. Returns `undefined` if the row index is not rendered.
     * @param {Number} index
     * @returns {Grid.row.Row}
     * @category Rows
     */
    getRow(index) {
        return this.rowCount && this.rows[index - this.topIndex];
    }

    /**
     * Get Row for specified record id
     * @param {Core.data.Model|String|Number} recordOrId Record id (or a record)
     * @returns {Grid.row.Row} Found Row or null if record not rendered
     * @category Rows
     */
    getRowById(recordOrId) {
        if (recordOrId.isModel) {
            recordOrId = recordOrId.id;
        }
        return this.idMap[recordOrId];
    }

    /**
     * Get a Row from an HTMLElement
     * @param {HTMLElement} element
     * @returns {Grid.row.Row} Found Row or null if record not rendered
     * @category Rows
     */
    getRowFromElement(element) {
        element = element.closest('.b-grid-row');
        return element && this.getRow(element.dataset.index);
    }

    /**
     * Get the row at the specified Y coordinate, which is by default viewport-based.
     * @param {Number} y The `Y` coordinate to find the Row for.
     * @param {Boolean} [local=false] Pass `true` if the `Y` coordinate is local to the SubGrid's element.
     * @returns {Grid.row.Row} Found Row or null if no row is rendered at that point.
     */
    getRowAt(y, local = false) {
        // Make it local.
        if (!local) {
            // Because this is used with event Y positions which are integers, we must
            // round the Rectangle to the closest integer.
            y -= Rectangle.from(this.grid.bodyContainer, null, true).roundPx(1).top;

            // Adjust for scrolling
            y += this.grid.scrollable.y;
        }
        y = DomHelper.roundPx(y);

        return this.rows.find(r => y >= r.top && y < r.bottom);
    }

    /**
     * Get a Row for either a record, a record id or an HTMLElement
     * @param {HTMLElement|Core.data.Model|String|Number} recordOrId Record or record id or HTMLElement
     * @returns {Grid.row.Row} Found Row or null if record not rendered
     * @category Rows
     */
    getRowFor(recordOrId) {
        if (recordOrId instanceof HTMLElement) {
            return this.getRowFromElement(recordOrId);
        }
        return this.getRowById(recordOrId);
    }

    /**
     * Gets the Row following the specified Row (by index or object). Wraps around the end.
     * @param {Number|Grid.row.Row} indexOrRow index or Row
     * @returns {Grid.row.Row}
     * @category Rows
     */
    getNextRow(indexOrRow) {
        const index = typeof indexOrRow === 'number' ? indexOrRow : indexOrRow.index;
        return this.getRow((index + 1) % this.rowCount);
    }

    /**
     * Get the Row that is currently displayed at top.
     * @property {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get topRow() {
        return this.rows[0];
    }

    /**
     * Get the Row currently displayed furthest down.
     * @property {Grid.row.Row}
     * @readonly
     * @category Rows
     */
    get bottomRow() {
        // TODO: remove when ticket on making sure rowCount is always up to date is fixed
        const rowCount = Math.min(this.rowCount, this.store.count);

        return this.rows[rowCount - 1];
    }

    /**
     * Calls offset() for each Row passing along offset parameter
     * @param {Number} offset Pixels to translate Row elements.
     * @private
     * @category Rows
     */
    offsetRows(offset) {
        if (offset !== 0) {
            const
                { rows }   = this,
                { length } = rows;

            for (let i = 0; i < length; i++) {
                rows[i].offset(offset);
            }
        }

        this.trigger('offsetRows', { offset });
    }

    //endregion

    //region Row height

    // TODO: should support setting rowHeight in em and then convert internally to pixels. 1em = font-size. Not needed for 1.0
    /**
     * Set a fixed row height (can still be overridden by renderers) or get configured row height. Setting refreshes all rows
     * @category Rows
     */
    get rowHeight() {
        return this._rowHeight;
    }

    set rowHeight(height) {
        const
            me                       = this,
            { grid, fixedRowHeight } = me,
            oldRowHeight             = me.rowHeight;

        ObjectHelper.assertNumber(height, 'rowHeight');

        if (height < 10) {
            //<debug>
            console.warn(`The rowHeight of ${height} was increased to 10 which is the minimum.`);
            //</debug>
            height = 10;
        }

        me.trigger('beforeRowHeight', { height });

        me.minRowHeight = me._rowHeight = height;

        me.prependBufferHeight = me.prependRowBuffer * me.rowOffsetHeight;
        me.appendBufferHeight = me.appendRowBuffer * me.rowOffsetHeight;

        if (fixedRowHeight) {
            me.averageRowHeight = height;
        }

        if (me.rows.length) {
            const
                oldY       = grid.scrollable.y,
                topRow     = me.getRowAt(oldY, true),
                // When changing rowHeight in a scrolled grid, there might no longer be a row at oldY
                edgeOffset = topRow ? topRow.top - oldY : 0;

            let average, oldAverage;

            // When using fixedRowHeight there is no need to update an average
            if (fixedRowHeight) {
                average = height;
                oldAverage = oldRowHeight;
            }
            else {
                oldAverage = average = me.averageRowHeight;

                me.clearKnownHeights();

                // Scale the average height in proportion to the row height change
                average *= height / oldRowHeight;
            }

            // Adjust number of rows, since it is only allowed to shrink in refresh()
            me.calculateRowCount(false, true, true);

            // Reposition the top row since it is used to position the rest
            me.topRow.setTop(me.topRow.dataIndex * (average + grid._rowBorderHeight));

            me.refresh();

            const newY = oldY * (average / oldAverage);

            // Scroll top row to the same position.
            if (newY !== oldY) {
                grid.scrollRowIntoView(topRow.id, {
                    block : 'start',
                    edgeOffset
                });
            }
        }

        me.trigger('rowHeight', { height });
    }

    /**
     * Get actually used row height, which includes any border and might be an average if using variable row height.
     * @property {Number}
     */
    get rowOffsetHeight() {
        return Math.floor(this.preciseRowOffsetHeight);
    }

    get preciseRowOffsetHeight() {
        return (this.averageRowHeight || this._rowHeight) + this.grid._rowBorderHeight;
    }

    get minRowOffsetHeight() {
        return (this.minRowHeight || this._rowHeight) + this.grid._rowBorderHeight;
    }

    /*
    * How store CRUD affects the height map:
    *
    * | Operation | Result                            |
    * |-----------|-----------------------------------|
    * | add       | No. Appears on render             |
    * | insert    | No. Appears on render             |
    * | remove    | Remove entry                      |
    * | removeAll | Clear                             |
    * | update    | No                                |
    * | replace   | Height might differ, remove entry |
    * | move      | No                                |
    * | filter    | No                                |
    * | sort      | No                                |
    * | group     | No                                |
    * | dataset   | Clear                             |
    *
    * The above is handled in GridBase
    */

    /**
     * Returns `true` if all rows have a known height. They do if all rows are visitied, or if RowManager is configured
     * with `fixedRowHeight`. If so, all tops can be calculated exactly, no guessing needed
     * @property {Boolean}
     * @private
     */
    get allHeightsKnown() {
        return this.fixedRowHeight || this.heightMap.size >= this.store.count;
    }

    /**
     * Store supplied `height` using `id` as key in the height map. Called by `Row` when it gets its height.
     * Keeps `avarageRowHeight` and `totalKnownHeight` up to date. Ignored when configured with `fixedRowHeight`
     * @param {String|Number} id
     * @param {Number} height
     * @internal
     */
    storeKnownHeight(id, height) {
        const
            me = this,
            { heightMap } = me;

        if (!me.fixedRowHeight) {
            // Decrease know height with old value
            if (heightMap.has(id)) {
                me.totalKnownHeight -= heightMap.get(id);
            }

            // Height here is "clientHeight"
            heightMap.set(id, height);

            // And increase with new
            me.totalKnownHeight += height;

            if (height < me.minRowHeight) {
                me.minRowHeight = height;
            }

            me.averageRowHeight = me.totalKnownHeight / heightMap.size;
        }
    }

    /**
     * Invalidate cached height for a record. Removing it from `totalKnownHeight` and factoring it out of
     * `avarageRowHeight`.
     * @param {Core.data.Model|Core.data.Model[]} records
     */
    invalidateKnownHeight(records) {
        const me = this;

        if (!me.fixedRowHeight) {
            const { heightMap } = me;

            if (!Array.isArray(records)) {
                records = [records];
            }

            records.forEach(record => {
                if (record) {
                    if (heightMap.has(record.id)) {
                        // Known height decreases when invalidating
                        me.totalKnownHeight -= heightMap.get(record.id);

                        heightMap.delete(record.id);
                    }
                }
            });

            me.averageRowHeight = me.totalKnownHeight / heightMap.size;
        }
    }

    /**
     * Invalidates all cached height and resets `avarageRowHeight` and `totalKnownHeight`
     */
    clearKnownHeights() {
        this.heightMap.clear();
        this.averageRowHeight = this.totalKnownHeight = 0;
    }

    /**
     * Calculates a row top from its data index. Uses known values from the height map, unknown are substituted with
     * the average row height. When configured with `fixedRowHeight`, it will always calculate a correct value
     * @param {Number} index Index in store
     * @private
     */
    calculateTop(index) {
        // When using fixed row height, life is easy
        if (this.fixedRowHeight) {
            return index * this.rowOffsetHeight;
        }

        const { heightMap, averageRowHeight, store, grid } = this;

        let top = 0;

        // When not using fixed row height, we make an educated guess at the top. The more rows have been visited, the
        // more correct the guess is (fully correct if all rows visited)
        for (let i = 0; i < index; i++) {
            const record = store.getAt(i);
            // Use known height when available (clientHeight -> offsetHeight by adding border)
            if (heightMap.has(record.id)) {
                top += heightMap.get(record.id);
            }
            // Otherwise use average height
            else {
                top += grid.getRowHeight(record) || averageRowHeight;
            }

            top += grid._rowBorderHeight;
        }

        return Math.floor(top);
    }

    //endregion

    //region Calculations

    /**
     * Returns top and bottom for rendered row or estimated coordinates for unrendered.
     * @param {Core.data.Model|string|Number} recordOrId Record or record id
     * @param {Boolean} [local] Pass true to get relative record coordinates
     * @returns {Core.helper.util.Rectangle} Record bounds with format { x, y, width, height, bottom, right }
     * @category Calculations
     */
    getRecordCoords(recordOrId, local = false) {
        const
            me  = this,
            id  = typeof recordOrId === 'string' || typeof recordOrId === 'number' ? recordOrId : recordOrId.id,
            row = me.getRowById(recordOrId);

        let scrollingViewport = me.client._bodyRectangle;

        // _bodyRectangle is not updated on page/containing element scroll etc. Need to make sure it is correct in case
        // that has happend. This if-statement should be removed when fixing
        // https://app.assembla.com/spaces/bryntum/tickets/6587-cached-_bodyrectangle-should-be-updated-on--quot-external-quot--scroll/details
        if (!local) {
            scrollingViewport = me.client._bodyRectangle = Rectangle.client(me.client.bodyContainer);
        }

        // Rendered? Then we know position for certain
        if (row) {
            return new Rectangle(
                scrollingViewport.x,
                local ? Math.round(row.top) : Math.round(row.top + scrollingViewport.y - me.client.scrollable.y),
                scrollingViewport.width,
                row.offsetHeight
            );
        }

        return me.getRecordCoordsByIndex(me.store.indexOf(id), local);
    }

    /**
     * Returns estimated top and bottom coordinates for specified row.
     * @param {Number} recordIndex Record index
     * @param {Boolean} [local]
     * @returns {Core.helper.util.Rectangle} Estimated record bounds with format { x, y, width, height, bottom, right }
     * @category Calculations
     */
    getRecordCoordsByIndex(recordIndex, local = false) {
        const
            me                    = this,
            { topRow, bottomRow } = me,
            scrollingViewport     = me.client._bodyRectangle,
            { id }                = me.store.getAt(recordIndex),
            // Not using rowOffsetHeight since it floors the value and that rounding might give big errors far down
            height                = me.preciseRowOffsetHeight,
            currentTopIndex       = topRow.dataIndex,
            currentBottomIndex    = bottomRow.dataIndex,
            // Instead of estimating top from the very top, use closest known coordinate. Makes sure a coordinate is not
            // estimated on wrong side of rendered rows, needed to correctly draw dependencies where one event is located
            // on a unrendered row
            calculateFrom         =
                // bottomRow is closest, calculate from it
                recordIndex > currentBottomIndex
                    ? { index : recordIndex - currentBottomIndex - 1, y : bottomRow.bottom, from : 'bottomRow' }
                    //  closer to topRow than 0, use topRow
                    : recordIndex > currentTopIndex / 2
                        ? { index : recordIndex - currentTopIndex, y : topRow.top, from : 'topRow' }
                        // closer to the very top, use it
                        : { index : recordIndex, y : 0, from : 'top' },
            top                   = me.allHeightsKnown
                // All heights are known (all rows visited or fixed row height), get actual top coord
                ? me.calculateTop(recordIndex)
                // Otherwise estimate
                : Math.floor(calculateFrom.y + calculateFrom.index * height),
            result                = new Rectangle(
                scrollingViewport.x,
                local ? top : top + scrollingViewport.y - me.client.scrollable.y,
                scrollingViewport.width,
                // Either known height or average
                Math.floor(me.heightMap.get(id) || height)
            );

        // Signal that it's not based on an element, so is only approximate.
        // Grid.scrollRowIntoView will have to go round again using the block options below to ensure it's correct.
        result.virtual = true;

        // When the block becomes visible, scroll it to the logical position using the scrollIntoView's block
        // option. If it's above, use block: 'start', if below, use block: 'end'.
        result.block = result.bottom < scrollingViewport.y ? 'start' : (result.y > scrollingViewport.bottom ? 'end' : 'nearest');

        return result;
    }

    /**
     * Total estimated grid height (used for scroller)
     * @property {Number}
     * @readonly
     * @category Calculations
     */
    get totalHeight() {
        return this._totalHeight;
    }

    //endregion

    //region Iteration etc.

    /**
     * Calls a function for each Row
     * @param {Function} fn Function that will be called with Row as first parameter
     * @category Iteration
     */
    forEach(fn) {
        this.rows.forEach(fn);
    }

    /**
     * Iterator that allows you to do for (let row of rowManager)
     * @category Iteration
     */
    [Symbol.iterator]() {
        return this.rows[Symbol.iterator]();
    }

    //endregion

    //region Scrolling & rendering

    /**
     * Renders from the top of the grid, also resetting scroll to top. Used for example when collapsing all groups.
     * @category Scrolling & rendering
     */
    returnToTop() {
        const me = this;

        me.topIndex = 0;
        me.lastScrollTop = 0;

        if (me.topRow) {
            me.topRow.dataIndex = 0;

            // Force the top row to the top of the scroll range
            me.topRow.setTop(0);
        }

        me.refresh();

        // Rows rendered from top, make sure grid is scrolled to top also
        me.grid.scrollable.y = 0;
    }

    /**
     * Renders from specified records row and down (used for example when collapsing a group, does not affect rows above).
     * @param {Core.data.Model} record Record of first row to render
     * @category Scrolling & rendering
     */
    renderFromRecord(record) {
        const row = this.getRowById(record.id);
        if (row) {
            this.renderFromRow(row);
        }
    }

    /**
     * Renders from specified row and down (used for example when collapsing a group, does not affect rows above).
     * @param {Grid.row.Row} fromRow First row to render
     * @category Scrolling & rendering
     */
    renderFromRow(fromRow = null) {
        const
            me              = this,
            { rows, store } = me,
            storeCount      = store.count;

        // Calculate row count, adding rows if needed, but do not rerender - we are going to do that below.
        // Bail out if no rows. Allow removing rows if we have more than store have rows
        if (me.calculateRowCount(false, storeCount < rows.length, true) === 0) {
            return;
        }

        let // render from this row
            fromRowIndex  = fromRow ? rows.indexOf(fromRow) : 0,
            // starting either from its specified dataIndex or from its index (happens on first render, no dataIndex yet)
            dataIndex     = fromRow ? fromRow.dataIndex : rows[0].dataIndex,
            // amount of records after this one in store
            recordsAfter  = storeCount - dataIndex - 1,
            // render to this row, either the last row or the row which will hold the last record available
            toRowIndex    = Math.min(rows.length - 1, fromRowIndex + recordsAfter),
            // amount of rows which wont be rendered below last record (if we have fewer records than topRow + row count)
            leftOverCount = rows.length - toRowIndex - 1,
            // Start with top correctly just below the previous row's bottom
            top           = fromRowIndex > 0 ? rows[fromRowIndex - 1].bottom : rows[fromRowIndex].top,
            row;

        // _rows array is ordered in display order, just iterate to the end
        for (let i = fromRowIndex; i <= toRowIndex; i++) {
            row = rows[i];
            // Needed in scheduler when translating events, happens before render
            row.dataIndex = dataIndex;
            row.setTop(top);
            row.render(dataIndex, store.getAt(dataIndex++), false);
            top += row.offsetHeight;
        }

        // if number for records to display has decreased, for example by collapsing a node, we might get unused rows
        // below bottom. move those to top to not have unused rows laying around
        while (leftOverCount-- > 0) {
            me.displayRecordAtTop();
        }

        // Reestimate total height
        me.estimateTotalHeight();

        me.trigger('renderDone');
    }

    /**
     * Renders the passed array (or [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)) of {@link Grid.row.Row rows}
     * @param {Grid.row.Row[]|Set} rows The rows to render
     * @category Scrolling & rendering
     */
    renderRows(rows) {
        let oldHeight,
            heightChanged = false;

        rows = Array.from(rows);

        // Render the requested rows.
        for (const row of rows) {
            oldHeight = row.height;

            // Pass updatingSingleRow as false, so that it does not shuffle following
            // rows downwards on each render. We do that once here after the rows are all refreshed.
            row.render(null, null, false);
            heightChanged |= row.height !== oldHeight;
        }

        // If this caused a height change, shuffle following rows.
        if (heightChanged) {
            this.translateFromRow(rows[0], true);

            // Reestimate total height
            this.estimateTotalHeight();
        }

        this.trigger('renderDone');
    }

    /**
     * Translates all rows after the specified row. Used when a single rows height is changed and the others should
     * rearrange. (Called from Row#render)
     * @param {Grid.row.Row} fromRow
     * @private
     * @category Scrolling & rendering
     */
    translateFromRow(fromRow, batch = false) {
        const me = this;

        let top = fromRow.bottom,
            //storeCount = me.store.count,
            row, index;

        for (index = fromRow.dataIndex + 1, row = me.getRow(index); row; row = me.getRow(++index)) {
            row.setTop(top);
            top += row.offsetHeight;
        }

        // Reestimate total height
        if (!batch) {
            me.estimateTotalHeight();
        }
    }

    /**
     * Rerender all rows
     * @category Scrolling & rendering
     */
    refresh() {
        const
            me         = this,
            { topRow } = me;

        // too early
        if (!topRow) {
            return;
        }

        me.idMap = {};

        me.renderFromRow(topRow);

        me.trigger('refresh');
    }

    /**
     * Makes sure that specified record is displayed in view
     * @param newScrollTop Top of visible section
     * @param [forceRecordIndex] Index of record to display at center
     * @private
     * @category Scrolling & rendering
     */
    jumpToPosition(newScrollTop, forceRecordIndex) {
        // There are two very different requirements here.
        // If there is a forceRecordIndex, that takes precedence to get it into the center of the
        // viewport, and wherever we render the calculated row block, we may then *adjust the scrollTop*
        // to get that row to the center.
        //
        // If there's no forceRecordIndex, then the scroll position is the primary objective and
        // we must render what we calculate to be correct at that viewport position.

        const
            me                    = this,
            { store, heightMap }  = me,
            storeCount            = store.count;

        if (me.allHeightsKnown && !me.fixedRowHeight) {
            const
                top    = newScrollTop - me.prependBufferHeight,
                border = me.grid._rowBorderHeight;

            let accumulated = 0,
                targetIndex = 0;

            while (accumulated < top) {
                const record = store.getAt(targetIndex);

                accumulated += heightMap.get(record.id) + border;

                targetIndex++;
            }

            const startIndex = Math.max(Math.min(targetIndex, storeCount - me.rowCount), 0);

            me.lastScrollTop = newScrollTop;
            me.topRow.dataIndex = me.topIndex = startIndex;

            me.topRow.setTop(me.calculateTop(startIndex), false);

            // render entire buffer
            me.refresh();
        }
        else {
            const
                rowHeight      = me.preciseRowOffsetHeight,
                // Calculate index of the top of the rendered block.
                // If we are targeting the scrollTop, this will be the top index at the scrollTop minus prepend count.
                // If we are targeting a recordIndex, this will attempt to place that in the center of the rendered block.
                targetIndex    = forceRecordIndex == null ? Math.floor(newScrollTop / rowHeight) - me.prependRowBuffer : forceRecordIndex - Math.floor(me.rowCount / 2),
                startIndex     = Math.max(Math.min(targetIndex, storeCount - me.rowCount), 0),
                viewportTop    = me.client.scrollable.y,
                viewportBottom = Math.min(me.client._bodyRectangle.height + viewportTop + me.appendBufferHeight, me.totalHeight);

            me.lastScrollTop = newScrollTop;
            me.topRow.dataIndex = me.topIndex = startIndex;

            me.topRow.setTop(Math.floor(startIndex * rowHeight), false);

            // render entire buffer
            me.refresh();

            // TODO: It is likely the approach below will be needed for scrolling in opposite direction also, although no
            //   problem encountered yet

            // Not filled all the way down?
            if (me.bottomRow.bottom < viewportBottom) {
                // Might have jumped into a section of low heights. Needs to be done after the refresh, since heights
                // are not known before it
                me.calculateRowCount(false, false, false);

                // Fill with available rows (might be available above buffer because of var row height), stop if we run out of records :)
                while (me.bottomRow.bottom < viewportBottom && me._rows[me.prependRowBuffer].top < viewportTop && me.bottomRow.dataIndex < storeCount - 1) {
                    me.displayRecordAtBottom();
                }

                // TODO: Block below was not needed for current tests, but if row height in one block is enough smaller
                //  than average row height then we will need to add more rows

                // Still not filled all the way down? Need more rows
                // if (me.bottomRow.bottom < viewportBottom) {
                //     //const localAverage = blockHeight / me.rowCount;
                //     while (me.bottomRow.bottom < viewportBottom) {
                //        me.addRecordAtBottom();
                //     }
                // }
            }

            me.estimateTotalHeight();
        }

        // If the row index is our priority, then scroll it into the center
        if (forceRecordIndex != null) {
            const
                { scrollable } = me.grid,
                targetRow      = me.getRow(forceRecordIndex),
                // When coming from a block of high rowHeights to one with much lower we might still miss the target...
                // TODO: Jump again in these cases?
                rowCenter      = targetRow && Rectangle.from(targetRow._elementsArray[0]).center.y,
                viewportCenter = scrollable.viewport.center.y;

            // Scroll the targetRow into the center of the viewport
            if (targetRow) {
                scrollable.y = newScrollTop = Math.floor(scrollable.y + (rowCenter - viewportCenter));
            }
        }

        return newScrollTop;
    }

    /**
     * Jumps to a position if it is far enough from current position. Otherwise does nothing.
     * @private
     * @category Scrolling & rendering
     */
    warpIfNeeded(newScrollTop) {
        const
            me     = this,
            result = { newScrollTop, deltaTop : newScrollTop - me.lastScrollTop };

        // if gap to fill is large enough, better to jump there than to fill row by row
        if (Math.abs(result.deltaTop) > (me.rowCount * me.rowOffsetHeight) * 3) {
            // no specific record targeted
            let index;

            // Specific record specified as target of scroll?
            if (me.scrollTargetRecordId) {
                index = me.store.indexOf(me.scrollTargetRecordId);

                // since scroll is happening async record might have been removed after requesting scroll,
                // in that case we rely on calculated index (as when scrolling without target)
            }

            // perform the jump and return results
            result.newScrollTop = me.jumpToPosition(newScrollTop, index);
            result.deltaTop = 0; // no extra filling needed
        }

        return result;
    }

    /**
     * Handles virtual rendering (only visible rows + buffer are in dom) for rows
     * @param {Number} newScrollTop The `Y` scroll position for which to render rows.
     * @param {Boolean} [force=false] Pass `true` to update the rendered row block even if the scroll position has not changed.
     * @return {Number} Adjusted height required to fit rows
     * @private
     * @category Scrolling & rendering
     */
    updateRenderedRows(newScrollTop, force, ignoreError = false) {
        const
            me         = this,
            clientRect = me.client._bodyRectangle;

        // Might be triggered after removing all records, should not crash
        if (me.rowCount === 0) {
            return 0;
        }

        let result = me.totalHeight;

        if (
            force ||
            // Only react if we have scrolled by more than one row
            Math.abs(newScrollTop - me.lastScrollTop) > me.rowOffsetHeight ||
            // or if we have a gap at top/bottom (#9375)
            me.topRow.top > newScrollTop ||
            me.bottomRow.bottom < newScrollTop + clientRect.height
        ) {
            // If scrolled by a large amount, jump instead of rendering each row
            const posInfo = me.warpIfNeeded(newScrollTop);

            me.scrollTargetRecordId = null;

            // Cache the last correct render scrollTop before fill.
            // it can be adjusted to hide row position corrections.
            me.lastScrollTop = posInfo.newScrollTop;

            if (posInfo.deltaTop > 0) {
                // Scrolling down
                me.fillBelow(posInfo.newScrollTop);
            }
            else if (posInfo.deltaTop < 0) {
                // Scrolling up
                me.fillAbove(posInfo.newScrollTop);
            }

            if (!me.fixedRowHeight && !ignoreError) {
                me.correctError(posInfo, clientRect, newScrollTop);
            }

            // Calculate the new height based on new content
            result = me.estimateTotalHeight();
        }

        return result;
    }

    correctError(posInfo, clientRect, newScrollTop) {
        const me = this;

        let error = 0;

        // TODO: Merge with else, does the same calculation
        // When we transition from not knowing all heights to doing so, the old estimate will likely have positioned
        // rows a bit off. Compensate for that here.
        if (me.allHeightsKnown) {
            error = me.topRow.top - me.calculateTop(me.topRow.dataIndex);
        }
        // If it's a temporary scroll, we can be told to ignore the drift.
        // Apart from that, we must correct keep the rendered block position correct.
        // Otherwise, when rolling upwards after a teleport, we may not be able to reach
        // the top. Some rows may end up at -ve positions.
        else {
            // Only correct the rendered block position if we are in danger of running out of scroll space.
            // That is if we are getting towards the top or bottom of the scroll range.
            if (
                // Scrolling up within top zone
                (posInfo.deltaTop < 0 && newScrollTop < clientRect.height * 2) ||
                // Scrolling down within bottom zone
                (posInfo.deltaTop > 0 && newScrollTop > me.totalHeight - clientRect.height * 2 - 3)
            ) {
                // TODO: Calc could be eased more, using distance left to have less effect the further away from top/bottom
                error = me.topRow.top - me.calculateTop(me.topRow.dataIndex); //me.topIndex * me.rowOffsetHeight;
            }
        }

        if (error) {
            // Correct the rendered block position if it's not at the calculated position.
            // Keep the visual position correct by adjusting the scrollTop by the same amount.
            // When variable row heights are used, this will keep the rendered block top correct.
            me.offsetRows(-error);
            me.grid.scrollable.y = me.lastScrollTop = me.grid.scrollable.y - error;
        }
    }

    /**
     * Moves as many rows from the bottom to the top that are needed to fill to current scroll pos.
     * @param newTop Scroll position
     * @private
     * @category Scrolling & rendering
     */
    fillAbove(newTop) {
        const
            me         = this,
            fillHeight = newTop - me.topRow.top - me.prependBufferHeight;

        let accumulatedHeight = 0;

        while (accumulatedHeight > fillHeight && me.topIndex > 0) {
            // We want to show prev record at top of rows
            accumulatedHeight -= me.displayRecordAtTop();
        }

        me.trigger('renderDone');
    }

    /**
     * Moves as many rows from the top to the bottom that are needed to fill to current scroll pos.
     * @param newTop Scroll position
     * @private
     * @category Scrolling & rendering
     */
    fillBelow(newTop) {
        const
            me          = this,
            fillHeight  = newTop - me.topRow.top - me.prependBufferHeight,
            recordCount = me.store.count,
            rowCount    = me.rowCount;

        let accumulatedHeight = 0;

        // Repeat until we have filled empty height
        while (
            accumulatedHeight < fillHeight &&         // fill empty height
            me.topIndex + rowCount < recordCount &&   // as long as we have records left
            me.topRow.top + me.topRow.offsetHeight < newTop // and do not move top row fully into view (can happen with var row height)
        ) {
            // We want to show next record at bottom of rows
            accumulatedHeight += me.displayRecordAtBottom();
        }

        me.trigger('renderDone');
    }

    /**
     * Estimates height needed to fit all rows, based on average row height. Also offsets rows if needed to not be above
     * the reachable area of the view.
     * @param {Boolean} [immediate] Specify true to pass the `immediate` flag on to any listeners (probably only Grid
     * cares. Used to bypass buffered element resize)
     * @returns {Number}
     * @private
     * @category Scrolling & rendering
     */
    estimateTotalHeight(immediate = false) {
        const me = this;

        if (me.grid.renderingRows) {
            return;
        }

        const
            recordCount   = me.store.count,
            unknownCount  = recordCount - me.heightMap.size,
            { bottomRow } = me;

        let estimate;

        // No need to estimate when using fixed row height
        if (me.fixedRowHeight) {
            estimate = recordCount * me.rowOffsetHeight;
        }
        else {
            estimate =
                // Known height, from entries in heightMap
                me.totalKnownHeight +
                // Those heights are "clientHeights", estimate needs to include borders
                me.heightMap.size * me.grid._rowBorderHeight +
                // Add estimate for rows with unknown height
                unknownCount * me.preciseRowOffsetHeight;

            // No bottomRow yet if estimating initial height in autoHeight grid
            if (bottomRow && unknownCount) {
                const bottom = bottomRow.bottom;

                // To low estimate or reached the end with scroll left, adjust to fit current bottom
                if (bottom > estimate || (me.topIndex + me.rowCount >= recordCount && estimate > bottom)) {
                    estimate = bottom;

                    // estimate all the way down
                    if (bottomRow.dataIndex < recordCount - 1) {
                        estimate += (recordCount - 1 - bottomRow.dataIndex) * me.preciseRowOffsetHeight;
                    }
                }
            }

            estimate = Math.floor(estimate);
        }

        if (estimate !== me.totalHeight) {
            if (me.trigger('changeTotalHeight', { totalHeight : estimate, immediate }) !== false) {
                me._totalHeight = estimate;
            }
        }

        return estimate;
    }

    /**
     * Moves a row from bottom to top and renders the corresponding record to it.
     * @returns {Number} New row height
     * @private
     * @category Scrolling & rendering
     */
    displayRecordAtTop() {
        const
            me           = this,
            recordIndex  = me.topIndex - 1,
            record       = me.store.getAt(recordIndex),
            // Row currently rendered at the bottom, the row we want to move
            bottomRow    = me.bottomRow,
            bottomRowTop = bottomRow.top;

        me.trigger('beforeTranslateRow', {
            row       : bottomRow,
            newRecord : record
        });

        // estimated top, for rendering that depends on having top
        bottomRow._top = me.topRow.top - me.rowOffsetHeight;
        // if configured with fixed row height, it will be the correct value
        bottomRow.estimatedTop = !me.fixedRowHeight;

        // Render row
        bottomRow.render(recordIndex, record, false);

        // Move it to top. Restore top so that the setter won't reject non-change
        // if the estimate happened to be correct.
        bottomRow._top = bottomRowTop;
        bottomRow.setBottom(me.topRow.top);
        bottomRow.estimatedTop = false;

        // Prev row is now at top
        me.topIndex--;

        // move to start of array (bottomRow becomes topRow)
        me._rows.unshift(me._rows.pop());

        return bottomRow.offsetHeight;
    }

    /**
     * Moves a row from top to bottom and renders the corresponding record to it.
     * @returns {Number} New row height
     * @private
     * @category Scrolling & rendering
     */
    displayRecordAtBottom() {
        const
            me          = this,
            recordIndex = me.topIndex + me.rowCount,
            record      = me.store.getAt(recordIndex),
            // Row currently rendered on the top, the row we want to move
            topRow      = me.topRow;

        me.trigger('beforeTranslateRow', {
            row       : topRow,
            newRecord : record
        });

        topRow.dataIndex = recordIndex;

        // Move it to bottom
        topRow.setTop(me.bottomRow.bottom);
        // Render row
        topRow.render(recordIndex, record, false);

        // Next row is now at top
        me.topIndex++;

        // move to end of array (topRow becomes bottomRow)
        me._rows.push(me._rows.shift());

        return topRow.offsetHeight;
    }

    //endregion
}
