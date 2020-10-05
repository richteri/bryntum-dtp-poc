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
    
    t.it('Should export to single page', async(t) => {
        ({ gantt, paperHeight } = await t.createGanttForExport({
            verticalPages   : 4,
            horizontalPages : 2
        }));
        
        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-dependency' },
            async() => {
                const result = await gantt.features.pdfExport.export({
                    columns      : gantt.columns.visibleColumns.map(c => c.id),
                    exporterType : 'singlepage',
                    range        : 'completeview'
                });
    
                const { html } = result.response.request.body;
    
                t.is(html.length, 1, '1 page is exported');
                
                await new Promise(resolve => {
                    t.setIframe({
                        height : paperHeight,
                        html   : html[0].html,
                        onload(doc, frame) {
                            t.ok(t.assertHeaderPosition(doc), 'Header is exported ok');
                            t.ok(t.assertFooterPosition(doc), 'Footer is exported ok');
    
                            t.assertRowsExportedWithoutGaps(doc, false, true);
    
                            t.ok(t.assertTicksExportedWithoutGaps(doc), 'Ticks exported without gaps');
                            t.isExportedTickCount(doc, gantt.timeAxis.count);
    
                            t.ok(t.assertExportedTasksList(doc, gantt.tasks), 'Tasks are exported ok');
                            t.ok(t.assertExportedGanttDependenciesList(doc, gantt.dependencies), 'Dependencies are exported ok');
                            
                            frame.remove();
                            
                            resolve();
                        }
                    });
                });
            }
        );
    });
});
