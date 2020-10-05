import DateHelper from '../../../../Core/helper/DateHelper.js';
import Rectangle from '../../../../Core/helper/util/Rectangle.js';
import DomHelper from '../../../../Core/helper/DomHelper.js';
import BrowserHelper from '../../../../Core/helper/BrowserHelper.js';
import { ScheduleRange } from '../Utils.js';

const immediatePromise = Promise.resolve();

export default base => class SchedulerExporterMixin extends base {
    async scrollRowIntoView(client, index) {
        const
            {
                rowManager,
                scrollable
            }    = client,
            oldY = scrollable.y;

        // If it's a valid index to scroll to, then try it.
        if (index < client.store.count) {
            // Scroll the requested row to the viewport top
            scrollable.scrollTo(null, rowManager.calculateTop(index));

            // If that initiated a scroll, we need to wait for the row to be rendered, so return
            // a Promise which resolves when that happens.
            if (scrollable.y !== oldY) {
                // GridBase adds listener to vertical scroll to update rows. Rows might be or might not be updated,
                // but at the end of each scroll grid will trigger `scroll` event. So far this is the only scroll event
                // triggered by the grid itself and it is different from `scroll` event on scrollable.
                return new Promise(resolve => {
                    const detacher = client.on({
                        scroll({ scrollTop }) {
                            // future-proof: only react to scroll event with certain argument
                            if (scrollTop != null && rowManager.getRow(index)) {
                                detacher();
                                resolve();
                            }
                        }
                    });
                });
            }
        }

        // No scroll ocurred. Promise must be resolved immediately
        return immediatePromise;
    }

    async scrollToDate(client, date) {
        let scrollFired = false;

        const promises    = [];

        // Time axis is updated on element scroll, which is async event. We need to synchronize this logic.
        // If element horizontal scroll is changed then sync event is fired. We add listener to that one specific event
        // and remove it right after scrollToDate sync code, keeping listeners clean. If scrolling occurred, we need
        // to wait until time header is updated.
        const detacher = client.timeAxisSubGrid.scrollable.on({
            scrollstart({ x }) {
                if (x != null) {
                    scrollFired = true;
                }
            }
        });

        // added `block: start` to do scrolling faster
        // it moves data to begin of visible area that is longer section for re-render
        promises.push(client.scrollToDate(date, { block : 'start' }));

        detacher();

        if (scrollFired) {
            promises.push(client.timeView.await('refresh', { checkLog : false }));

            // We have to wait for scrollEnd event before moving forward. When exporting large view we might have to scroll
            // extensively and it might occur that requested scroll position would not be reached because concurrent
            // scrollEnd events would move scroll back.
            // Covered by Gantt/tests/feature/export/MultiPageVertical.t.js
            promises.push(client.timeAxisSubGrid.header.scrollable.await('scrollEnd', { checkLog : false }));
        }

        await Promise.all(promises);
    }

    async prepareComponent(config) {
        const
            me              = this,
            { client }      = config,
            includeTimeline = client.timeAxisSubGrid.width > 0;

        switch (config.scheduleRange) {
            case ScheduleRange.completeview:
                config.rangeStart = client.startDate;
                config.rangeEnd   = client.endDate;
                break;
            case ScheduleRange.currentview:
                const { startDate, endDate } = client.getVisibleDateRange();
                config.rangeStart = startDate;
                config.rangeEnd = endDate;
                break;
        }

        // Don't change timespan if time axis subgrid is not visible
        if (includeTimeline) {
            // set new timespan before calling parent to get proper scheduler header/content size
            client.setTimeSpan(config.rangeStart, config.rangeEnd);

            // Access svgCanvas el to create dependency canvas early
            // eslint-disable-next-line no-unused-expressions
            client.svgCanvas;
        }

        await super.prepareComponent(config);

        const
            { exportMeta } = me,
            fgCanvasEl     = me.element.querySelector('.b-sch-foreground-canvas'),
            timeAxisEl     = me.element.querySelector('.b-horizontaltimeaxis');

        exportMeta.includeTimeline = includeTimeline;

        if (includeTimeline && config.scheduleRange !== ScheduleRange.completeview) {
            // If we are exporting subrange of dates we need to change subgrid size accordingly
            exportMeta.totalWidth -= exportMeta.subGrids.normal.width;
            exportMeta.totalWidth += exportMeta.subGrids.normal.width = client.timeAxisViewModel.getDistanceBetweenDates(config.rangeStart, config.rangeEnd);

            const
                horizontalPages = Math.ceil(exportMeta.totalWidth / exportMeta.pageWidth),
                totalPages      = horizontalPages * exportMeta.verticalPages;

            exportMeta.horizontalPages = horizontalPages;
            exportMeta.totalPages = totalPages;

            // store left scroll to imitate normal grid/header scroll using margin
            exportMeta.subGrids.normal.scrollLeft = client.getCoordinateFromDate(config.rangeStart);
        }

        exportMeta.timeAxisHeaders = [];
        exportMeta.timeAxisPlaceholders = [];
        exportMeta.headersColleted = false;

        DomHelper.forEachSelector(timeAxisEl, '.b-sch-header-row', headerRow => {
            exportMeta.timeAxisPlaceholders.push(me.createPlaceholder(headerRow));
            exportMeta.timeAxisHeaders.push(new Map());
        });

        // Add placeholder for events, clear all event elements, but not the entire elements as it contains svg canvas
        exportMeta.subGrids.normal.eventsPlaceholder = me.createPlaceholder(fgCanvasEl, false);
        DomHelper.removeEachSelector(fgCanvasEl, '.b-sch-event-wrap');
        DomHelper.removeEachSelector(fgCanvasEl, '.b-released');

        exportMeta.eventsBoxes = new Map();
        exportMeta.client = client;

        if (client.features.dependencies && !client.features.dependencies.disabled) {
            const svgCanvasEl = me.element.querySelector(`[id="${client.svgCanvas.getAttribute('id')}"]`);

            // Same as above, clear only dependency lines, because there might be markers added by user
            if ((exportMeta.dependenciesPlaceholder = svgCanvasEl)) {
                DomHelper.removeEachSelector(svgCanvasEl, '.b-sch-dependency');
            }
        }

        // We need to scroll component to date to calculate correct start margin
        if (includeTimeline && !DateHelper.betweenLesser(config.rangeStart, client.startDate, client.endDate)) {
            await me.scrollToDate(client, config.rangeStart);
        }
    }

    async restoreState(config) {
        let waitForHorizontalScroll = false;

        const
            { client } = config,
            promises = [];

        // If scroll will be changed during restoring state (and it will likely be), raise a flag that exporter should
        // wait for scrollEnd event before releasing control
        const detacher = client.timeAxisSubGrid.scrollable.on({
            scrollStart({ x }) {
                // HACK: scrollStart might actually fire when scroll is set to existing value
                if (this.element.scrollLeft !== x) {
                    waitForHorizontalScroll = true;
                }
            }
        });

        promises.push(super.restoreState(config));

        // Scroll start will be fired synchronously
        detacher();

        if (waitForHorizontalScroll) {
            promises.push(client.timeAxisSubGrid.header.scrollable.await('scrollEnd', { checkLog : false }));
        }

        await Promise.all(promises);
    }

    async onRowsCollected(rows, config) {
        const me = this;

        await super.onRowsCollected(rows);

        // Only collect this data if timeline is visible
        if (me.exportMeta.includeTimeline) {
            const
                { client }                       = config,
                { timeView }                     = client,
                { pageRangeStart, pageRangeEnd } = me.getCurrentPageDateRange(config);

            let rangeProcessed = false;

            await me.scrollToDate(client, pageRangeStart);

            // Time axis and events are only rendered for the visible time span
            // we need to scroll the view and gather events/timeline elements
            // while (timeView.endDate <= config.rangeEnd) {
            while (!rangeProcessed) {
                me.collectHeaders(config);

                me.collectEvents(rows, config);

                if (DateHelper.timeSpanContains(timeView.startDate, timeView.endDate, pageRangeStart, pageRangeEnd)) {
                    rangeProcessed = true;
                }
                else if (timeView.endDate.getTime() >= pageRangeEnd.getTime()) {
                    rangeProcessed = true;
                }
                else {
                    const endDate = timeView.endDate;

                    await me.scrollToDate(client, timeView.endDate);

                    // If timeview end date is same as before scroll it means client is not able to scroll to date
                    // and will go into infinite loop unless we stop it
                    if (endDate.getTime() === timeView.endDate.getTime()) {
                        throw new Error('Could not scroll to date');
                    }
                }
            }

            await me.scrollToDate(client, config.rangeStart);
        }
    }

    getCurrentPageDateRange({ rangeStart, rangeEnd, client }) {
        const
            me = this,
            { exportMeta } = me,
            { horizontalPages, horizontalPosition, pageWidth, subGrids } = exportMeta;

        let pageRangeStart, pageRangeEnd;

        // when exporting to multiple pages we only need to scroll sub-range within visible time span
        if (horizontalPages > 1) {
            const
                pageStartX = horizontalPosition * pageWidth,
                pageEndX   = (horizontalPosition + 1) * pageWidth,
                // Assuming normal grid is right next to right side of the locked grid
                // There is also a default splitter
                normalGridX = subGrids.locked.width;

            if (pageEndX <= normalGridX) {
                pageRangeEnd = pageRangeStart = null;
            }
            else {
                pageRangeStart = client.getDateFromCoordinate(Math.max(pageStartX - normalGridX, 0));
                // Extend visible schedule by 20% to cover up possible splitter
                pageRangeEnd = client.getDateFromCoordinate((pageEndX - normalGridX) * 1.2) || rangeEnd;
            }
        }
        else {
            pageRangeStart = rangeStart;
            pageRangeEnd   = rangeEnd;
        }

        return {
            pageRangeStart,
            pageRangeEnd
        };
    }

    prepareExportElement() {
        const
            { element, exportMeta }                = this,
            { id, headerId, footerId, scrollLeft } = exportMeta.subGrids.normal;

        const el = element.querySelector(`[id="${id}"]`);

        ['.b-sch-background-canvas', '.b-sch-foreground-canvas'].forEach(selector => {
            const canvasEl = el.querySelector(selector);

            if (canvasEl) {
                // Align canvases to last exported row bottom. If no such property exists - remove inline height
                if (exportMeta.lastExportedRowBottom) {
                    canvasEl.style.height = `${exportMeta.lastExportedRowBottom}px`;
                }
                else {
                    canvasEl.style.height = '';
                }

                // Simulate horizontal scroll
                if (scrollLeft) {
                    canvasEl.style.marginLeft = `-${scrollLeft}px`;
                }
            }
        });

        if (scrollLeft) {
            [headerId, footerId].forEach(id => {
                const el = element.querySelector(`[id="${id}"] .b-widget-scroller`);
                if (el) {
                    el.style.marginLeft = `-${scrollLeft}px`;
                }
            });
        }

        return super.prepareExportElement();
    }

    collectRow(row) {
        const
            me           = this,
            { subGrids } = me.exportMeta;

        Object.entries(row.elements).forEach(([key, value]) => {
            const rowConfig = [value.outerHTML, row.top, row.offsetHeight];

            if (key === 'normal') {
                rowConfig.push(new Map());
            }

            subGrids[key].rows.push(rowConfig);
        });
    }

    collectHeaders(config) {
        const
            me             = this,
            { client }     = config,
            { exportMeta } = me;

        // We only need to collect headers once, this flag is raised once they are collected along all exported range
        if (!exportMeta.headersCollected) {
            const
                timeAxisEl = client.timeView.element,
                timeAxisHeaders = exportMeta.timeAxisHeaders;

            DomHelper.forEachSelector(timeAxisEl, '.b-sch-header-row', (headerRow, index, headerRows) => {
                const headersMap = timeAxisHeaders[index];

                DomHelper.forEachSelector(headerRow, '.b-sch-header-timeaxis-cell', el => {
                    if (!headersMap.has(el.dataset.tickIndex)) {
                        headersMap.set(el.dataset.tickIndex, el.outerHTML);
                    }
                });

                if (index === headerRows.length - 1 && headersMap.has(String(client.timeAxis.count - 1))) {
                    exportMeta.headersCollected = true;
                }
            });
        }
    }

    collectEvents(rows, config) {
        const
            me         = this,
            addedRows  = rows.length,
            { client } = config,
            normalRows = me.exportMeta.subGrids.normal.rows;

        rows.forEach((row, index) => {
            const
                rowConfig = normalRows[normalRows.length - addedRows + index],
                resource  = client.store.getAt(row.dataIndex),
                eventsMap = rowConfig[3];

            resource.events && resource.events.forEach(event => {
                if (event.isScheduled) {
                    let el = client.getElementFromEventRecord(event, resource);

                    if (el && (el = el.parentElement) && !eventsMap.has(event.id)) {
                        eventsMap.set(event.id, [el.outerHTML, Rectangle.from(el, el.offsetParent)]);
                    }
                }
            });
        });
    }

    buildPageHtml() {
        const
            me           = this,
            { subGrids, timeAxisHeaders, timeAxisPlaceholders } = me.exportMeta;

        // Now when rows are collected, we need to add them to exported grid
        let html = me.prepareExportElement();

        Object.values(subGrids).forEach(({ placeHolder, eventsPlaceholder, rows }) => {
            const
                placeHolderText       = placeHolder.outerHTML,
                // Rows can be repositioned, in which case event related to that row should also be translated
                { resources, events } = me.positionRows(rows);

            html = html.replace(placeHolderText, resources.join(''));

            if (eventsPlaceholder) {
                html = html.replace(eventsPlaceholder.outerHTML, events.join(''));
            }
        });

        timeAxisHeaders.forEach((headers, index) => {
            html = html.replace(timeAxisPlaceholders[index].outerHTML, Array.from(headers.values()).join(''));
        });

        html = me.buildDependenciesHtml(html);

        return html;
    }

    // outerHTML is not supported on SVG elements in IE11, using workaround
    getDependenciesOuterHTML() {
        const { dependenciesPlaceholder } = this.exportMeta;

        let result;

        if (BrowserHelper.isIE11) {
            const
                wrapper = document.createElement('div'),
                tmpEl   = dependenciesPlaceholder.cloneNode(true);

            wrapper.appendChild(tmpEl);
            result = wrapper.innerHTML;
        }
        else {
            result = dependenciesPlaceholder.outerHTML;
        }

        return result;
    }

    renderDependencies() {
        const
            me                                               = this,
            { client, dependenciesPlaceholder, eventsBoxes } = me.exportMeta,
            { dependencies }                                 = client,
            dependencyFeature                                = client.features.dependencies,
            eventsInView                                     = Array.from(eventsBoxes.keys());

        dependencies
            .filter(r => eventsInView.includes(String(r.from)) || eventsInView.includes(String(r.to)))
            .forEach(dependency => {
                let fromBox     = eventsBoxes.get(String(dependency.from)),
                    toBox       = eventsBoxes.get(String(dependency.to));

                const { sourceEvent, targetEvent } = dependency;

                // In case of single page export from/to boxes will always be present, also we cannot trust boxes from cache
                // because single page exporter can possible change row/event vertical position
                // In case of multipage we will get box from the dependency feature
                if (!fromBox) {
                    if (sourceEvent) {
                        const box = dependencyFeature.getBox(dependency, true);

                        if (box) {
                            fromBox = box instanceof Rectangle ? box : new Rectangle(box.start, box.top, box.end - box.start, box.bottom - box.top);
                        }
                    }
                }

                if (!toBox) {
                    if (targetEvent) {
                        const box = dependencyFeature.getBox(dependency, false);

                        if (box) {
                            toBox = box instanceof Rectangle ? box : new Rectangle(box.start, box.top, box.end - box.start, box.bottom - box.top);
                        }
                    }
                }

                // Gantt dependencies feature modifies box size to point arrow to the top, clone box to keep original size
                const drawData = {
                    startRectangle : fromBox && fromBox.clone(),
                    endRectangle   : toBox && toBox.clone()
                };

                if (fromBox && toBox) {
                    dependencyFeature.drawDependency(dependency, drawData, null, dependenciesPlaceholder, false);
                }
            });

        const result = me.getDependenciesOuterHTML();

        DomHelper.removeEachSelector(dependenciesPlaceholder, '.b-sch-dependency');

        return result;
    }

    buildDependenciesHtml(html) {
        const { dependenciesPlaceholder, includeTimeline } = this.exportMeta;

        if (dependenciesPlaceholder && includeTimeline) {
            const placeholder = this.getDependenciesOuterHTML();
            html = html.replace(placeholder, this.renderDependencies());
        }

        return html;
    }
};
