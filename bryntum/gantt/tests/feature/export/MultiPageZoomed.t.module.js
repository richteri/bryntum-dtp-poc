import { AjaxHelper, DateHelper, Override, ProjectGenerator, RandomGenerator, Gantt, PresetManager, PaperFormat, Rectangle } from '../../../build/gantt.module.js';

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

    const zoom = 0.6;

    document.body.style.zoom = `${zoom}`;

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
            async() => {
                try {
                    result = await gantt.features.pdfExport.export({
                        columns      : gantt.columns.visibleColumns.map(c => c.id),
                        exporterType : 'multipage',
                        range        : 'completeview'
                    });
                }
                catch (e) {
                    t.fail(e.stack);

                    return;
                }

                ({ html } = result.response.request.body);

                t.is(html.length, totalPages, `${totalPages} pages exported`);

                for (let i = 0; i < html.length; i++) {
                    await new Promise(resolve => {
                        t.setIframe({
                            height : paperHeight / zoom,
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
});
