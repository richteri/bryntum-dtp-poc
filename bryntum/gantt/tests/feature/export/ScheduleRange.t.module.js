import { AjaxHelper, DateHelper, Override, ProjectGenerator, RandomGenerator, Gantt, PresetManager, PaperFormat, RowsRange, ScheduleRange, Rectangle } from '../../../build/gantt.module.js';

StartTest(t => {
    let gantt, paperHeight;

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

    t.overrideAjaxHelper();

    window.DEBUG = true;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should export visible schedule', async(t) => {
        const
            horizontalPages = 3;

        ({ gantt, paperHeight } = await t.createGanttForExport({
            height        : 500,
            verticalPages : 2,
            horizontalPages
        }));

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-dependency' },
            async() => {
                async function doExport(scheduleRange, exporterType, totalPages, callback) {
                    const html = await t.getExportHtml(gantt, {
                        columns   : [gantt.columns.getAt(1).id],
                        rowsRange : RowsRange.visible,
                        scheduleRange,
                        exporterType
                    });

                    t.is(html.length, totalPages, `${totalPages} page(s) exported`);

                    for (let i = 0; i < html.length; i++) {
                        await new Promise(resolve => {
                            t.setIframe({
                                height : paperHeight + 50,
                                html   : html[i].html,
                                onload(doc, frame) {
                                    callback(doc, i);

                                    frame.remove();

                                    resolve();
                                }
                            });
                        });
                    }
                }

                function assertContent(doc) {
                    const
                        { taskStore, timeAxisSubGrid } = gantt,
                        rows                           = Array.from(doc.querySelectorAll('.b-grid-subgrid-locked .b-grid-row')),
                        bodyContainerEl                = doc.querySelector('.b-grid-body-container'),
                        bodyContainerBox               = bodyContainerEl.getBoundingClientRect(),
                        gridHeaderEl                   = doc.querySelector('.b-grid-header-container'),
                        gridHeaderBox                  = gridHeaderEl.getBoundingClientRect(),
                        ganttEl                        = doc.querySelector('.b-gantt'),
                        ganttBox                       = ganttEl.getBoundingClientRect(),
                        { startDate, endDate }         = gantt.getVisibleDateRange(),
                        gotVisibleRange                = t.getDateRangeFromExportedPage(doc, true),
                        expectedWidth                  = gantt.columns.getAt(1).width + timeAxisSubGrid.width + gantt.subGrids.locked.splitterElement.offsetWidth;

                    t.isApprox(ganttBox.height, 500, 1, 'Gantt height is ok');

                    t.is(rows.length, 9, '9 rows exported');

                    rows.forEach((el, index) => {
                        t.is(el.dataset.index, index, `Row ${index} is exported ok`);
                    });

                    t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');
                    t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');

                    t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');
                    t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported ok');

                    const
                        events = taskStore.query(r => {
                            return DateHelper.intersectSpans(r.startDate, r.endDate, startDate, endDate) && taskStore.indexOf(r) < 9;
                        });

                    t.ok(events.length, 'Event list to check not empty');
                    t.assertExportedTasksList(doc, events);

                    t.todo('Investigate getVisibleDateRange inconsistency', t => {
                        // This assertion fails because in single page export only, because of incorrect visible end date
                        // returned by gantt.
                        t.isApprox(ganttBox.width, expectedWidth, 1, 'Gantt element width is ok');
                    });

                    // Use round for start because that date is supposed to be at the beginning
                    t.is(gotVisibleRange.startDate, gantt.timeAxis.roundDate(startDate), 'Exported start date is ok');
                    // Use floor for end because last tick is partially visible
                    t.is(gotVisibleRange.endDate, gantt.timeAxis.floorDate(endDate), 'Exported end date is ok');
                }

                await gantt.scrollToDate(gantt.timeAxis.getAt(6).startDate, { block : 'start' });

                // time axis is updated on element scroll which is async
                await gantt.timeView.await('refresh', { checkLog : false });

                t.diag('Exporting visible rows to single page');

                await doExport(ScheduleRange.currentview, 'singlepage', 1, assertContent);

                // This timeout is required to make this test pass is headless, scrollbarless chrome in puppeteer
                // TODO: investigate, get rid of timeout
                await new Promise(resolve => setTimeout(resolve, 100));

                t.diag('Exporting visible rows to multiple pages');

                await doExport(ScheduleRange.currentview, 'multipage', 1, assertContent);
            }
        );
    });
});
