import Exporter from './Exporter.js';
import { Orientation, PaperFormat, RowsRange } from '../Utils.js';

export default class MultiPageVerticalExporter extends Exporter {
    static get type() {
        return 'multipagevertical';
    }

    static get title() {
        // In case locale is missing exporter is still distinguishable
        return this.L('L{multipagevertical}');
    }

    static get exportingPageText() {
        return 'L{exportingPage}';
    }

    //region State management

    async stateNextPage({ client }) {
        const
            { exportMeta } = this,
            {
                totalRows,
                processedRows,
                totalPages
            } = exportMeta;

        ++exportMeta.currentPage;
        ++exportMeta.verticalPosition;

        // With variable row heights it is possible that initial pages estimation is wrong. If we're out but there are
        // more rows to process - continue exporting
        if (exportMeta.currentPage === totalPages && processedRows.size !== totalRows) {
            ++exportMeta.totalPages;
            ++exportMeta.verticalPages;
        }
    }

    //endregion

    estimateTotalPages(config) {
        const
            me             = this,
            { exportMeta } = me,
            {
                client,
                headerTpl,
                footerTpl,
                alignRows,
                rowsRange,
                repeatHeader
            }              = config,
            {
                pageWidth,
                pageHeight,
                totalWidth
            }              = exportMeta,
            scale          = me.getScaleValue(pageWidth, totalWidth);

        // To estimate amount of pages correctly we need to know height of the header/footer on every page
        let
            totalHeight   = 0 - me.getVirtualScrollerHeight(client) + client.height - client.bodyHeight + client.scrollable.scrollHeight,
            // We will be scaling content horizontally, need to adjust content height accordingly
            contentHeight = pageHeight / scale,
            totalRows     = client.store.count,
            initialScroll = 0,
            verticalPages;

        if (headerTpl) {
            contentHeight -= me.measureElement(headerTpl({
                totalWidth,
                totalPages  : -1,
                currentPage : -1
            }));
        }

        if (footerTpl) {
            contentHeight -= me.measureElement(footerTpl({
                totalWidth,
                totalPages  : -1,
                currentPage : -1
            }));
        }

        // If we are repeating header on every page we have smaller contentHeight
        if (repeatHeader) {
            contentHeight -= client.headerHeight;
            totalHeight -= client.headerHeight;
        }

        if (rowsRange === RowsRange.visible) {
            const
                firstRow = client.rowManager.rows[me.getFirstVisibleRowIndex(client)],
                lastRow  = client.rowManager.rows[me.getLastVisibleRowIndex(client)];

            initialScroll = firstRow.top;

            totalRows = me.getVisibleRowsCount(client);

            totalHeight = totalHeight - client.scrollable.scrollHeight + lastRow.bottom - firstRow.top;
        }

        // alignRows config specifies if rows should be always fully visible. E.g. if row doesn't fit on the page, it goes
        // to the top of the next page
        if (alignRows && !repeatHeader && rowsRange !== RowsRange.visible) {
            // we need to estimate amount of vertical pages for case when we only put row on the page if it fits
            // first we need to know how much rows would fit one page, keeping in mind first page also contains header
            // This estimation is loose, because row height might differ much between pages
            const
                rowHeight       = client.rowManager.rowOffsetHeight,
                rowsOnFirstPage = Math.floor((contentHeight - client.headerHeight) / rowHeight),
                rowsPerPage     = Math.floor(contentHeight / rowHeight),
                remainingRows   = totalRows - rowsOnFirstPage;

            verticalPages = 1 + Math.ceil(remainingRows / rowsPerPage);
        }
        else {
            verticalPages = Math.ceil(totalHeight / contentHeight);
        }

        Object.assign(exportMeta, {
            scale,
            contentHeight,
            totalRows,
            totalHeight,
            verticalPages,
            initialScroll,
            horizontalPages : 1,
            totalPages      : verticalPages
        });
    }

    async prepareComponent(config) {
        await super.prepareComponent(config);

        const
            me              = this,
            { exportMeta }  = me,
            { client }      = config,
            paperFormat     = PaperFormat[config.paperFormat],
            isPortrait      = config.orientation === Orientation.portrait,
            paperWidth      = isPortrait ? paperFormat.width : paperFormat.height,
            paperHeight     = isPortrait ? paperFormat.height : paperFormat.width,
            pageWidth       = me.inchToPx(paperWidth),
            pageHeight      = me.inchToPx(paperHeight),
            horizontalPages = 1;

        Object.assign(exportMeta, {
            paperWidth,
            paperHeight,
            pageWidth,
            pageHeight,
            horizontalPages,
            currentPage          : 0,
            verticalPosition     : 0,
            horizontalPosition   : 0,
            currentPageTopMargin : 0,
            processedRows        : new Set()
        });

        me.estimateTotalPages(config);

        me.adjustRowBuffer(client);
    }

    async restoreComponent(config) {
        await super.restoreComponent(config);

        this.restoreRowBuffer(config.client);
    }

    async buildPage(config) {
        const
            me                 = this,
            { exportMeta }     = me,
            {
                client,
                headerTpl,
                footerTpl,
                alignRows,
                repeatHeader
            }                  = config,
            {
                totalWidth,
                totalPages,
                currentPage,
                subGrids,
                currentPageTopMargin,
                verticalPosition,
                totalRows,
                contentHeight
            }                  = exportMeta,
            // If we are repeating header we've already taked header height into account when setting content height
            clientHeaderHeight = repeatHeader ? 0 : client.headerHeight,
            { rowManager }     = client,
            { rows }           = rowManager;

        // Rows are stored in shared state object, need to clean it before exporting next page
        Object.values(subGrids).forEach(subGrid => subGrid.rows = []);

        // With variable row height total height might change after scroll, update it
        // to show content completely on the last page
        if (config.rowsRange === RowsRange.all) {
            exportMeta.totalHeight = client.height - client.bodyHeight + client.scrollable.scrollHeight - me.getVirtualScrollerHeight(client);
        }

        let index = config.rowsRange === RowsRange.visible
                ? rows.findIndex(r => r.bottom > client.scrollable.y)
                : rows.findIndex(r => r.bottom + currentPageTopMargin + clientHeaderHeight > 0),
            remainingHeight, header, footer;

        const
            firstRowIndex     = index,
            // This is a portion of the row which is not visible, which means it shouldn't affect remaining height
            // Don't calculate for the first page
            overflowingHeight = verticalPosition === 0 ? 0 : rows[index].top + currentPageTopMargin + clientHeaderHeight;

        // Measure header and footer height
        if (headerTpl) {
            header = me.prepareHTML(headerTpl({
                totalWidth,
                totalPages,
                currentPage
            }));
        }

        if (footerTpl) {
            footer = me.prepareHTML(footerTpl({
                totalWidth,
                totalPages,
                currentPage
            }));
        }

        // Calculate remaining height to fill with rows
        // remainingHeight is height of the page content region to fill. When next row is exported, this heights gets
        // reduced. Since top rows may be partially visible, it would lead to increasing error and eventually to incorrect
        // exported rows for the page
        remainingHeight = contentHeight - overflowingHeight;

        // first exported page container header
        if (verticalPosition === 0) {
            remainingHeight -= clientHeaderHeight;
        }

        // data index of the last collected row
        let lastDataIndex,
            offset = 0;

        while (remainingHeight > 0) {
            const row = rows[index];

            if (alignRows && remainingHeight < row.offsetHeight) {
                offset = -remainingHeight;
                remainingHeight = 0;
            }
            else {
                me.collectRow(row);

                remainingHeight -= row.offsetHeight;

                // only mark row as processed if it fitted without overflow
                if (remainingHeight > 0) {
                    // We cannot use simple counter here because some rows appear on 2 pages. Need to track unique identifier
                    exportMeta.processedRows.add(row.dataIndex);
                }

                lastDataIndex = row.dataIndex;

                // Last row is processed, still need to fill the view
                if (++index === rows.length && remainingHeight > 0) {
                    remainingHeight = 0;
                }
                else if (config.rowsRange === RowsRange.visible && (index - firstRowIndex) === totalRows) {
                    remainingHeight = 0;
                }
            }
        }

        const lastRow = rows[index - 1];

        if (lastRow) {
            // Calculate exact grid height according to the the last exported row
            exportMeta.exactGridHeight = lastRow.bottom + client.footerContainer.offsetHeight + client.headerContainer.offsetHeight;
        }

        await me.onRowsCollected(rows.slice(firstRowIndex, index), config);

        // No scrolling required if we are only exporting currently visible rows
        if (config.rowsRange === RowsRange.visible) {
            exportMeta.scrollableTopMargin = client.scrollable.y;
        }
        else {
            // With variable row height row manager migh relayout rows to fix position, moving them up or down.
            const detacher = rowManager.on('offsetrows', ({ offset : value }) => offset += value);

            await me.scrollRowIntoView(client, lastDataIndex + 1);

            detacher();
        }

        const html = me.buildPageHtml();

        return { html, header, footer, offset };
    }

    async onRowsCollected() {}

    collectRow(row) {
        const subGrids = this.exportMeta.subGrids;

        Object.entries(row.elements).forEach(([key, value]) => {
            subGrids[key].rows.push(value.outerHTML);
        });
    }

    buildPageHtml() {
        const
            me           = this,
            { subGrids } = me.exportMeta;

        // Now when rows are collected, we need to add them to exported grid
        let html = me.prepareExportElement();

        Object.values(subGrids).forEach(({ placeHolder, rows }) => {
            const placeHolderText = placeHolder.outerHTML;
            html = html.replace(placeHolderText, rows.join(''));
        });

        return html;
    }
}

// HACK: terser/obfuscator doesn't yet support async generators, when processing code it converts async generator to regular async
// function.
MultiPageVerticalExporter.prototype.pagesExtractor = async function * pagesExtractor(config) {
    const
        me = this,
        {
            exportMeta,
            stylesheets
        }  = me,
        {
            totalWidth,
            paperWidth,
            paperHeight,
            contentHeight,
            scale,
            initialScroll
        }  = exportMeta;

    let
        { totalPages } = exportMeta,
        currentPage;

    while ((currentPage = exportMeta.currentPage) < totalPages) {
        me.trigger('exportStep', { text : me.L(MultiPageVerticalExporter.exportingPageText, { currentPage, totalPages }), progress : Math.round(((currentPage + 1) / totalPages) * 90) });

        const { html, header, footer, offset } = await me.buildPage(config);

        // TotalHeight might change in case of variable row heights
        // Move exported content in the visible frame
        const styles = [
            ...stylesheets,
            `
                <style>
                    #${config.client.id} {
                        width: ${totalWidth}px !important;
                    }
                    
                    .b-export .b-export-content {
                        transform: scale(${scale});
                        transform-origin: top left;
                        height: auto;
                    }
                </style>
            `
        ];

        if (config.repeatHeader) {
            const gridHeight = exportMeta.exactGridHeight ? `${exportMeta.exactGridHeight + exportMeta.currentPageTopMargin}px` : '100%';

            styles.push(
                `
                <style>
                    #${config.client.id} {
                        height: ${gridHeight} !important;
                    }
                    
                    .b-export .b-export-content {
                        height: ${100 / scale}%;
                    }
                    
                    .b-export-body {
                        height: 100%;
                        display: flex;
                    }
                
                    .b-export-viewport {
                        height: 100%;
                    }
                    
                    .b-grid-vertical-scroller {
                        margin-top: ${exportMeta.currentPageTopMargin - initialScroll}px;
                    }
                </style>
                `
            );
        }
        else {
            const gridHeight = exportMeta.exactGridHeight || (contentHeight - exportMeta.currentPageTopMargin);

            styles.push(
                `
                <style>
                    #${config.client.id} {
                        height: ${gridHeight}px !important;
                    }
                    
                    .b-export-body {
                        overflow: hidden;
                    }
                    
                    .b-export .b-export-content {
                        height: ${100 / scale}%;
                    }
                    
                    .b-export-body .b-export-viewport {
                        margin-top: ${exportMeta.currentPageTopMargin}px;
                    }
                    
                    .b-grid-vertical-scroller {
                        margin-top: -${initialScroll}px;
                    }
                </style>
                `
            );
        }

        // when aligning rows, offset gets accumulated, so we need to take it into account
        exportMeta.currentPageTopMargin -= contentHeight + offset;

        await me.stateNextPage(config);

        ({ totalPages } = exportMeta);

        yield {
            html : me.pageTpl({
                html,
                header,
                footer,
                styles,
                paperWidth,
                paperHeight
            })
        };
    }
};
