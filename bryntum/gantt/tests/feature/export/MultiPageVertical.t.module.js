import { AjaxHelper, DateHelper, Override, ProjectGenerator, RandomGenerator, Gantt, PresetManager, PaperFormat, RowsRange, Rectangle, ScheduleRange } from '../../../build/gantt.module.js';

StartTest(t => {
    let gantt, paperHeight;

    const exporterType = 'multipagevertical';

    Object.assign(window, {
        AjaxHelper,
        DateHelper,
        Override,
        ProjectGenerator,
        RandomGenerator,
        Gantt,
        PresetManager,
        PaperFormat,
        Rectangle
    });

    window.DEBUG = true;

    t.overrideAjaxHelper();

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should export to multiple pages', async t => {
        const
            verticalPages   = 8,
            horizontalPages = 2,
            totalPages      = Math.ceil(verticalPages / horizontalPages),
            rowsPerPage     = 20;

        ({ gantt, paperHeight } = await t.createGanttForExport({
            horizontalPages,
            verticalPages,
            rowsPerPage
        }));

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-dependency' },
            async() => {
                async function assertExport(repeatHeader) {
                    return new Promise(resolve => {
                        t.subTest(`Checking export (repeatHeader: ${repeatHeader})`, async t => {
                            const html = await t.getExportHtml(gantt, {
                                exporterType,
                                repeatHeader
                            });

                            t.is(html.length, totalPages, `${totalPages} pages exported`);

                            const indices = new Set();

                            for (let i = 0; i < html.length; i++) {
                                await new Promise(resolve => {
                                    t.setIframe({
                                        height : paperHeight,
                                        html   : html[i].html,
                                        onload(doc, frame) {
                                            t.subTest(`Checking page ${i}`, async t => {
                                                t.ok(t.assertHeaderPosition(doc), 'Header exported ok');
                                                t.ok(t.assertFooterPosition(doc), 'Footer exported ok');

                                                t.assertRowsExportedWithoutGaps(doc, !repeatHeader && i !== 0, !repeatHeader && i !== html.length - 1, false);

                                                if (repeatHeader) {
                                                    t.ok(t.assertGridHeader(doc), 'Grid header is ok');
                                                }

                                                if (i === html.length - 1) {
                                                    t.assertGridHeightAlignedWithLastRow(doc);
                                                }

                                                if (i % verticalPages === 0) {
                                                    t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                                                }

                                                const
                                                    rows          = doc.querySelectorAll('.b-timeline-subgrid .b-grid-row'),
                                                    exportedTasks = Array.from(rows).reduce((map, row) => {
                                                        const id = parseInt(row.dataset.id);

                                                        indices.add(id);

                                                        return map.add(id);
                                                    }, new Set()),
                                                    { taskStore } = gantt,
                                                    tasks         = taskStore.query(record => {
                                                        return exportedTasks.has(record.id) &&
                                                            DateHelper.intersectSpans(gantt.startDate, gantt.endDate, record.startDate, record.endDate);
                                                    }),
                                                    dependencies  = gantt.dependencyStore.query(record => {
                                                        return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                                    });

                                                t.ok(tasks.length, 'Some tasks found');
                                                t.ok(dependencies.length, 'Some dependencies found');

                                                t.ok(t.assertExportedTasksList(doc, tasks), 'Tasks are exported ok');
                                                t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), 'Dependncies are exported ok');

                                                frame.remove();

                                                resolve();
                                            });
                                        }
                                    });
                                });
                            }

                            t.is(indices.size, gantt.taskStore.count, 'All rows are exported');

                            resolve();
                        });
                    });
                }

                await assertExport(false);

                await assertExport(true);
            }
        );
    });

    t.it('Should export visible schedule', async t => {
        ({ gantt, paperHeight } = await t.createGanttForExport({
            horizontalPages : 2,
            verticalPages   : 2,
            rowsPerPage     : 20,
            width           : 900
        }));

        await Promise.all([
            t.waitForSelector('.b-sch-dependency'),
            gantt.timeAxisSubGrid.await('resize', { checkLog : false })
        ]);

        const centerDate = new Date(gantt.startDate.getTime() + (gantt.endDate - gantt.startDate) / 2);

        gantt.zoomToSpan({
            startDate : DateHelper.add(gantt.startDate, -4, 'w'),
            endDate   : DateHelper.add(gantt.endDate, 4, 'w'),
            centerDate
        });

        // Scrolling to center date will start scroll sync process, which will end with scrollEnd event on header scrollable
        await gantt.timeAxisSubGrid.header.scrollable.await('scrollend', { checkLog : false });

        const
            expectedState  = gantt.state,
            // this is precise visible range, we need to round it to ticks
            visibleRange   = gantt.getVisibleDateRange(),
            dateToTickDate = date => gantt.timeAxis.getAt(Math.floor(gantt.timeAxis.getTickFromDate(date))).startDate,
            expectedRange  = {
                startDate : dateToTickDate(visibleRange.startDate),
                endDate   : dateToTickDate(visibleRange.endDate)
            };

        const html = await t.getExportHtml(gantt, {
            exporterType,
            scheduleRange : ScheduleRange.currentview,
            rowsRange     : RowsRange.visible
        });

        t.is(html.length, 1, 'Single page exported');

        for (let i = 0; i < html.length; i++) {
            await new Promise(resolve => {
                t.setIframe({
                    height : paperHeight,
                    html   : html[i].html,
                    onload(doc, frame) {
                        const exportedRange = t.getDateRangeFromExportedPage(doc, true);

                        t.isDeeply(exportedRange, expectedRange, 'Exported date range is ok');

                        t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported ok');

                        if (i === html.length - 1) {
                            t.assertGridHeightAlignedWithLastRow(doc);
                        }

                        frame.remove();

                        resolve();
                    }
                });
            });
        }

        t.isDeeply(gantt.state, expectedState, 'State is restored correctly');
        t.is(gantt.subGrids.normal.header.scrollable.x, expectedState.scroll.scrollLeft.normal, 'Scroll position is ok for normal grid/header');

        // When viewport center date is resolved from coordinate value could be from the same coordinate but to be actually different.
        // So we lookup coordinate from that again and those should match.
        // 1px approximation is to make test stable in headless mode
        t.isApprox(gantt.getCoordinateFromDate(gantt.viewportCenterDate), gantt.getCoordinateFromDate(centerDate), 1, 'Center date is ok');
    });

    t.it('Should export large view', async t => {
        const
            { tasksData, dependenciesData } = await ProjectGenerator.generateAsync(500, 50, null, new Date(2020, 0, 1)),
            startDate                       = new Date(2019, 11, 29);

        gantt = t.getGantt({
            width          : 1322,
            subGridConfigs : {
                locked : {
                    width  : 430,
                    normal : 870
                }
            },
            features : {
                pdfExport : {
                    exportServer : '/export',
                    headerTpl    : ({ currentPage }) => `<div style="height:61px;background-color: grey">
                    ${currentPage != null ? `Page ${currentPage}` : 'HEAD'}</div>`,
                    footerTpl : () => `<div style="height:61px;background-color: grey">FOOT</div>`
                }
            },
            project : {
                eventsData : tasksData,
                startDate,
                dependenciesData
            },
            startDate,
            endDate : new Date(2020, 4, 31)
        });

        await Promise.all([
            t.waitForSelector('.b-sch-dependency'),
            t.waitForSelector(gantt.unreleasedEventSelector),
            gantt.timeAxisSubGrid.await('resize', { checkLog : false })
        ]);

        async function assertExport(repeatHeader = false) {
            await new Promise(resolve => {
                t.subTest(`Checking export (repeatHeader ${repeatHeader})`, async t => {
                    const html = await t.getExportHtml(gantt, {
                        exporterType,
                        repeatHeader
                    });

                    for (let i = 0; i < html.length; i++) {
                        await new Promise(resolve => {
                            t.setIframe({
                                height : paperHeight,
                                html   : html[i].html,
                                onload(doc, frame) {
                                    t.subTest(`Checking page ${i}`, async t => {
                                        t.ok(t.assertHeaderPosition(doc), 'Header exported ok');
                                        t.ok(t.assertFooterPosition(doc), 'Footer exported ok');

                                        t.assertRowsExportedWithoutGaps(doc, !repeatHeader && i !== 0, !repeatHeader && i !== html.length - 1, false);

                                        if (repeatHeader) {
                                            t.ok(t.assertGridHeader(doc), 'Grid header is ok');
                                        }

                                        if (i === 0) {
                                            t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                                        }
                                        else if (i === html.length - 1) {
                                            t.assertGridHeightAlignedWithLastRow(doc);
                                        }

                                        const
                                            rows          = doc.querySelectorAll('.b-timeline-subgrid .b-grid-row'),
                                            exportedTasks = Array.from(rows).reduce((map, row) => {
                                                const id = parseInt(row.dataset.id);

                                                return map.add(id);
                                            }, new Set()),
                                            { taskStore } = gantt,
                                            tasks         = taskStore.query(record => {
                                                return exportedTasks.has(record.id) &&
                                                    DateHelper.intersectSpans(gantt.startDate, gantt.endDate, record.startDate, record.endDate);
                                            }),
                                            dependencies  = gantt.dependencyStore.query(record => {
                                                return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                            });

                                        t.ok(tasks.length, 'Some tasks found');
                                        t.ok(dependencies.length, 'Some dependencies found');

                                        t.ok(t.assertExportedTasksList(doc, tasks), 'Tasks are exported ok');
                                        t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), 'Dependencies are exported ok');

                                        frame.remove();

                                        resolve();
                                    });
                                }
                            });
                        });
                    }

                    resolve();
                });
            });
        }

        await assertExport(false);

        await assertExport(true);
    });

    t.it('Should export with a different combinations of alignRows/repeatHeader configs', async t => {
        const
            horizontalPages = 1,
            verticalPages   = 2,
            rowsPerPage     = 20;

        ({ gantt, paperHeight } = await t.createGanttForExport({
            verticalPages,
            horizontalPages,
            rowsPerPage
        }));

        async function assertExport(alignRows, repeatHeader) {
            return new Promise(resolve => {
                t.subTest(`Align rows: ${alignRows}, Repeat header: ${repeatHeader}`, async t => {
                    const pages = await t.getExportHtml(gantt, {
                        exporterType,
                        alignRows,
                        repeatHeader
                    });

                    for (let i = 0; i < pages.length; i++) {
                        const { document, iframe } = await t.setIframeAsync({
                            html   : pages[i].html,
                            height : paperHeight
                        });

                        const
                            isLastPage = i === pages.length - 1;

                        if (alignRows) {
                            t.ok(t.assertRowsExportedWithoutGaps(document, false, false, true), `Rows are exported ok on page ${i}`);
                        }
                        else {
                            t.ok(t.assertRowsExportedWithoutGaps(document, false, !isLastPage, false), `Rows are exported ok on page ${i}`);
                        }

                        t.assertGridHeightAlignedWithLastRow(document);

                        iframe.remove();
                    }

                    resolve();
                });
            });
        }

        await assertExport(false, false);

        await assertExport(false, true);

        await assertExport(true, false);

        await assertExport(true, true);
    });
});
