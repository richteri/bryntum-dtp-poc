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
