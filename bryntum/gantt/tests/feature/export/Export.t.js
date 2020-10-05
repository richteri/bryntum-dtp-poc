import AjaxHelper from '../../../lib/Core/helper/AjaxHelper.js';
import DateHelper from '../../../lib/Core/helper/DateHelper.js';
import Override from '../../../lib/Core/mixin/Override.js';
import ProjectGenerator from '../../../lib/Gantt/util/ProjectGenerator.js';
import RandomGenerator from '../../../lib/Core/helper/util/RandomGenerator.js';
import Gantt from '../../../lib/Gantt/view/Gantt.js';
import PresetManager from '../../../lib/Scheduler/preset/PresetManager.js';
import { PaperFormat } from '../../../lib/Grid/feature/export/Utils.js';
import Rectangle from '../../../lib/Core/helper/util/Rectangle.js';
import '../../../lib/Gantt/column/WBSColumn.js';
import '../../../lib/Gantt/column/StartDateColumn.js';
import '../../../lib/Gantt/column/EndDateColumn.js';
import '../../../lib/Gantt/feature/export/PdfExport.js';
import '../../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';
import ProjectModel from '../../../lib/Gantt/model/ProjectModel.js';

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

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Sanity', async(t) => {
        ({ gantt, paperHeight } = await t.createGanttForExport());

        const expectedName = 'File name';
        gantt.features.pdfExport.fileName = expectedName;

        let result, html, fileName;

        async function assertContent() {
            for (let i = 0; i < html.length; i++) {
                await new Promise(resolve => {
                    t.setIframe({
                        height : paperHeight + 50,
                        html   : html[i].html,
                        onload(doc, frame) {
                            t.ok(t.assertHeaderPosition(doc), `Header is exported ok on page ${i}`);
                            t.ok(t.assertFooterPosition(doc), `Footer is exported ok on page ${i}`);

                            t.assertRowsExportedWithoutGaps(doc, false, true);

                            t.ok(t.assertTicksExportedWithoutGaps(doc), `Ticks exported without gaps on page ${i}`);
                            t.isExportedTickCount(doc, gantt.timeAxis.count);

                            t.ok(t.assertExportedGanttDependenciesList(doc, gantt.dependencies), `Dependencies are exported ok on page ${i}`);

                            t.is(doc.querySelectorAll('.b-gantt-task-wrap').length, gantt.eventStore.count, 'All tasks exported');

                            frame.remove();

                            resolve();
                        }
                    });
                });
            }
        }

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                await gantt.await('dependenciesDrawn');

                t.diag('Using singlepage export');

                result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage',
                    range        : 'completeview'
                });

                ({ html, fileName } = result.response.request.body);

                t.is(html.length, 1, '1 page is exported');

                t.is(fileName, expectedName, 'File name is ok');

                await assertContent();

                t.diag('Using multipage export');

                result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'multipage',
                    range        : 'completeview'
                });

                ({ html } = result.response.request.body);

                t.is(html.length, 1, '1 page is exported');

                await assertContent();

                gantt.taskStore.first.name = '';

                result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage',
                    range        : 'completeview'
                });

                ({ fileName } = result.response.request.body);

                t.is(fileName, expectedName, 'File name is ok');

                gantt.taskStore.removeAll();

                result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage',
                    range        : 'completeview'
                });

                ({ fileName } = result.response.request.body);

                t.is(fileName, expectedName, 'File name is ok');
            }
        );
    });

    t.it('Should restore gantt properly after export', async(t) => {
        const project = new ProjectModel({
            transport : {
                load : {
                    url : '../examples/_datasets/launch-saas.json'
                }
            }
        });

        gantt = t.getGantt({
            project,
            width    : 900,
            height   : 600,
            features : {
                pdfExport : {
                    exportServer : '/export'
                }
            },
            startDate      : new Date(2019, 0, 13),
            endDate        : new Date(2019, 1, 17),
            subGridConfigs : {
                locked : {
                    width : 175
                }
            }
        });

        await project.load();

        t.chain(
            { waitForSelector : '.b-sch-dependency' },
            async() => {
                for (let id = 1; id <= 3; id++) {
                    await project.eventStore.toggleCollapse(id, true);
                }

                await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage'
                });
            },
            { waitFor : () => gantt.getRowFor(1), desc : 'First row is restored' },
            () => {
                t.ok(gantt.getRowFor(1), 'Row found for record #1');
                t.ok(gantt.getRowFor(2), 'Row found for record #2');
                t.ok(gantt.getRowFor(3), 'Row found for record #3');

                t.is(gantt.scrollable.y, 0, 'Scroll restored properly');
            }
        );
    });

    t.it('Should process config', t => {
        gantt = new Gantt({
            appendTo : document.body,
            features : {
                pdfExport : true
            }
        });

        let config = gantt.features.pdfExport.buildExportConfig({});
        t.is(config.fileName, 'Gantt', 'File name is set from class name');

        gantt.taskStore.add({ name : 'New parent' });
        config = gantt.features.pdfExport.buildExportConfig({});
        t.is(config.fileName, 'Gantt', 'File name is set from class name');

        gantt.features.pdfExport.fileName = 'foo';
        config = gantt.features.pdfExport.buildExportConfig({});
        t.is(config.fileName, 'foo', 'File name is set from feature config');

        config = gantt.features.pdfExport.buildExportConfig({ fileName : 'bar' });
        t.is(config.fileName, 'bar', 'File name is set from export options');
    });

    t.it('Should export dependencies not visible on a first page', async t => {
        const startDate = new Date(2020, 6, 19);

        let { tasksData, dependenciesData } = await ProjectGenerator.generateAsync(100, 10, null, startDate);

        dependenciesData = dependenciesData.slice(Math.round(dependenciesData.length / 2));

        gantt = t.getGantt({
            startDate,
            endDate : DateHelper.add(startDate, 4, 'w'),
            project : {
                startDate,
                dependenciesData,
                eventsData : tasksData
            },
            height   : 400,
            width    : 600,
            features : {
                pdfExport : {
                    exportServer : '/export',
                    headerTpl({ currentPage }) {
                        return `<div style="height:61px;">Page ${currentPage}</div>`;
                    },
                    footerTpl() {
                        return '<div style="height:61px;"></div>';
                    }
                }
            }
        });

        await gantt.project.waitForPropagateCompleted();

        const pages = await t.getExportHtml(gantt, {
            exporterType : 'multipagevertical'
        });

        const { document, iframe } = await t.setIframeAsync({
            height : 1123,
            html   : pages[pages.length - 1].html
        });

        const
            rows = document.querySelectorAll('.b-timeline-subgrid .b-grid-row'),
            tasks = Array.from(rows).map(row => Number(row.dataset.id)),
            dependencies = gantt.dependencyStore.query(d => tasks.includes(d.fromTask.id) && tasks.includes(d.toTask.id));

        t.ok(t.assertExportedGanttDependenciesList(document, dependencies), 'Dependencies exported ok on last page');

        iframe.remove();
    });

    t.it('Should export with narrow time axis subgrid', async t => {
        ({ gantt, paperHeight } = await t.createGanttForExport());

        gantt.timeAxisSubGrid.width = 3;

        const pages = await t.getExportHtml(gantt, {
            exporterType    : 'singlepage',
            keepRegionSizes : { normal : true }
        });

        const { document, iframe } = await t.setIframeAsync({
            height : paperHeight,
            html   : pages[0].html
        });

        t.ok(t.assertRowsExportedWithoutGaps(document, false, true), 'Rows exported without gaps');
        t.ok(t.assertTicksExportedWithoutGaps(document), 'Ticks exported without gaps');

        t.is(document.querySelectorAll('.b-grid-row').length, gantt.taskStore.count * 2, 'All resources exported');
        t.isExportedTickCount(document, gantt.timeAxis.count);
        t.is(document.querySelectorAll(gantt.unreleasedEventSelector).length, gantt.taskStore.count, 'All tasks are exported');

        t.is(document.querySelector('.b-grid-subgrid-normal').offsetWidth, 3, 'Normal grid width is ok');

        iframe.remove();
    });
});
