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

    t.it('Should export to multiple pages', async(t) => {
        const
            verticalPages   = 3,
            horizontalPages = 2,
            totalPages      = horizontalPages * verticalPages,
            rowsPerPage     = 11;

        ({ gantt, paperHeight } = await t.createGanttForExport({
            horizontalPages,
            verticalPages,
            rowsPerPage
        }));

        let result, html;

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-dependency' },
            { waitFor : 500 },
            async() => {
                result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'multipage',
                    range        : 'completeview'
                });

                ({ html } = result.response.request.body);

                t.is(html.length, totalPages, `${totalPages} pages exported`);

                for (let i = 0; i < html.length; i++) {
                    await new Promise(resolve => {
                        t.setIframe({
                            height : paperHeight,
                            html   : html[i].html,
                            onload(doc, frame) {
                                t.ok(t.assertHeaderPosition(doc), `Header exported ok on page ${i}`);
                                t.ok(t.assertFooterPosition(doc), `Footer exported ok on page ${i}`);

                                t.assertRowsExportedWithoutGaps(doc, false, (i + 1) % verticalPages !== 0);

                                if (i % verticalPages === 0) {
                                    t.ok(t.assertTicksExportedWithoutGaps(doc), `Ticks exported without gaps on page ${i}`);
                                }

                                const
                                    { taskStore } = gantt,
                                    tasks = taskStore.query(record => {
                                        return taskStore.indexOf(record) > rowsPerPage * (i % verticalPages) - 1 &&
                                            taskStore.indexOf(record) < rowsPerPage * (i % verticalPages + 1) - 1;
                                    }),
                                    dependencies = gantt.dependencyStore.query(record => {
                                        return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                    });

                                t.ok(tasks.length, 'Some tasks found');
                                t.ok(dependencies.length, 'Some dependencies found');

                                t.ok(t.assertExportedTasksList(doc, tasks), `Tasks are exported ok on page ${i}`);
                                t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), `Dependncies are exported ok on page ${i}`);

                                frame.remove();

                                resolve();
                            }
                        });
                    });
                }
            }
        );
    });

    t.it('Should export large gantt to multiple pages', async t => {
        const
            verticalPages = 5,
            rowsPerPage   = 24,
            startDate     = new Date(2020, 6, 13),
            endDate       = new Date(2020, 6, 20),
            {
                tasksData,
                dependenciesData
            } = await ProjectGenerator.generateAsync(100, 10, null, startDate);

        gantt = t.getGantt({
            height     : 900,
            width      : 600,
            viewPreset : 'weekAndDayLetter',
            project    : {
                eventsData : tasksData,
                dependenciesData,
                startDate
            },
            features : {
                pdfExport : {
                    exportServer : '/export',
                    headerTpl    : ({ currentPage }) => `<div style="height:9px;background-color: grey">
                    ${currentPage != null ? `Page ${currentPage}` : 'HEAD'}</div>`,
                    footerTpl : () => `<div style="height:9px;background-color: grey">FOOT</div>`
                }
            },
            startDate,
            endDate,
            columns : [
                { type : 'wbs', width : 50, minWidth : 50 },
                { type : 'name', width : 200 }
            ]
        });

        await Promise.all([
            gantt.project.waitForPropagateCompleted(),
            t.waitForSelector('.b-sch-dependency')
        ]);

        const html = await t.getExportHtml(gantt, {
            exporterType : 'multipage'
        });

        t.is(html.length, verticalPages, 'Correct amount of exported pages');

        for (let i = 0; i < html.length; i++) {
            await new Promise(resolve => {
                t.setIframe({
                    height : paperHeight,
                    html   : html[i].html,
                    onload(doc, frame) {
                        t.subTest(`Checking exported page ${i}`, async t => {
                            t.ok(t.assertHeaderPosition(doc), `Header exported ok on page ${i}`);
                            t.ok(t.assertFooterPosition(doc), `Footer exported ok on page ${i}`);

                            t.assertRowsExportedWithoutGaps(doc, false, (i + 1) % verticalPages !== 0);

                            if (i % verticalPages === 0) {
                                t.ok(t.assertTicksExportedWithoutGaps(doc), `Ticks exported without gaps on page ${i}`);
                            }

                            const
                                { taskStore } = gantt,
                                tasks = taskStore.query(record => {
                                    return taskStore.indexOf(record) > rowsPerPage * (i % html.length) - 1 &&
                                        taskStore.indexOf(record) < rowsPerPage * (i % html.length + 1) - 1 &&
                                        gantt.timeAxis.isTimeSpanInAxis(record);
                                }),
                                dependencies = gantt.dependencyStore.query(record => {
                                    return tasks.includes(record.sourceEvent) && tasks.includes(record.targetEvent);
                                });

                            if (i === html.length) {
                                t.ok(tasks.length, 'Some tasks found');
                                t.ok(dependencies.length, 'Some dependencies found');
                            }

                            t.ok(t.assertExportedTasksList(doc, tasks), `Tasks are exported ok on page ${i}`);
                            t.ok(t.assertExportedGanttDependenciesList(doc, dependencies), `Dependencies are exported ok on page ${i}`);

                            frame.remove();

                            resolve();
                        });
                    }
                });
            });
        }
    });
});
