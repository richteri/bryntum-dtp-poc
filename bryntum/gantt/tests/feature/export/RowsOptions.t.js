import AjaxHelper from '../../../lib/Core/helper/AjaxHelper.js';
import DateHelper from '../../../lib/Core/helper/DateHelper.js';
import Override from '../../../lib/Core/mixin/Override.js';
import ProjectGenerator from '../../../lib/Gantt/util/ProjectGenerator.js';
import RandomGenerator from '../../../lib/Core/helper/util/RandomGenerator.js';
import Gantt from '../../../lib/Gantt/view/Gantt.js';
import PresetManager from '../../../lib/Scheduler/preset/PresetManager.js';
import { PaperFormat, RowsRange } from '../../../lib/Grid/feature/export/Utils.js';
import Rectangle from '../../../lib/Core/helper/util/Rectangle.js';
import '../../../lib/Gantt/column/WBSColumn.js';
import '../../../lib/Gantt/column/StartDateColumn.js';
import '../../../lib/Gantt/column/EndDateColumn.js';
import '../../../lib/Gantt/feature/export/PdfExport.js';
import '../../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';

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

    t.it('Should export visible rows (scrolled)', async(t) => {
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
                async function doExport(rowsRange, exporterType, totalPages, callback) {
                    const html = await t.getExportHtml(gantt, {
                        exporterType,
                        rowsRange
                    });

                    t.is(html.length, totalPages, `${totalPages} page(s) exported`);

                    for (let i = 0; i < html.length; i++) {
                        await new Promise(resolve => {
                            t.setIframe({
                                height : paperHeight,
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

                const topRecord = gantt.taskStore.getById(5);

                function assertContent(doc) {
                    const
                        { taskStore }   = gantt,
                        rows            = Array.from(doc.querySelectorAll('.b-grid-subgrid-locked .b-grid-row')),
                        bodyContainerEl = doc.querySelector('.b-grid-body-container'),
                        bodyContainerBox = bodyContainerEl.getBoundingClientRect(),
                        gridHeaderEl    = doc.querySelector('.b-grid-header-container'),
                        gridHeaderBox   = gridHeaderEl.getBoundingClientRect(),
                        ganttEl         = doc.querySelector('.b-gantt');

                    t.isApprox(ganttEl.offsetHeight, 500, 1, 'Gantt height is ok');

                    t.is(rows.length, 9, '9 rows exported');

                    rows.forEach((el, index) => {
                        t.is(el.dataset.index, taskStore.indexOf(topRecord) + index, `Row ${index} is exported ok`);
                    });

                    t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');
                    t.is(doc.elementFromPoint(bodyContainerBox.left + 1, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');

                    t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');

                    const
                        events = taskStore.query(r => {
                            return gantt.timeAxis.isTimeSpanInAxis(r) && taskStore.indexOf(r) > 3 && taskStore.indexOf(r) < 13;
                        });

                    t.ok(events.length, 'Event list to check not empty');
                    t.assertExportedTasksList(doc, events);

                    t.is(bodyContainerEl.ownerDocument.defaultView.getComputedStyle(bodyContainerEl).overflowY, 'hidden', 'Scrollbar is hidden');
                }

                function assertContentMultipage(doc, i) {
                    const
                        { taskStore }   = gantt,
                        rows            = Array.from(doc.querySelectorAll('.b-grid-subgrid-normal .b-grid-row')),
                        bodyContainerEl = doc.querySelector('.b-grid-body-container'),
                        exportBodyEl     = doc.querySelector('.b-export-body'),
                        exportBodyBox  = exportBodyEl.getBoundingClientRect(),
                        gridHeaderEl    = doc.querySelector('.b-grid-header-container'),
                        gridHeaderBox   = gridHeaderEl.getBoundingClientRect(),
                        ganttEl         = doc.querySelector('.b-gantt');

                    t.isApprox(ganttEl.offsetHeight, 500, 1, `Gantt height is ok on page ${i}`);

                    t.is(rows.length, 9, '9 rows exported');

                    rows.forEach((el, index) => {
                        t.is(el.dataset.index, taskStore.indexOf(topRecord) + index, `Row ${index} is exported ok`);
                    });

                    t.is(doc.elementFromPoint(exportBodyBox.right - 10, gridHeaderBox.bottom + 1).closest('.b-grid-row'), rows[0], 'First visible row is ok');

                    t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');

                    const
                        { startDate, endDate } = t.getDateRangeFromExportedPage(doc),
                        tasks = taskStore.query(r => {
                            return DateHelper.intersectSpans(startDate, endDate, r.startDate, r.endDate) && taskStore.indexOf(r) > 3 && taskStore.indexOf(r) < 13;
                        });

                    t.ok(tasks.length, 'Event list to check not empty');
                    t.ok(t.assertExportedTasksList(doc, tasks), `Tasks exported ok on page ${i}`);

                    t.is(bodyContainerEl.ownerDocument.defaultView.getComputedStyle(bodyContainerEl).overflowY, 'hidden', 'Scrollbar is hidden');
                }

                await gantt.scrollRowIntoView(topRecord, { block : 'start' });

                t.diag('Exporting visible rows to single page');

                await doExport(RowsRange.visible, 'singlepage', 1, assertContent);

                t.diag('Exporting visible rows to multiple pages');

                await doExport(RowsRange.visible, 'multipage', horizontalPages, assertContentMultipage);
            }
        );
    });
});
