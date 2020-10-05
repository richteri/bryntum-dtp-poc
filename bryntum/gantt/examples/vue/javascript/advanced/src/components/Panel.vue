<!-- 
 *- Gantt panel
-->
<template>
    <div class="panel"></div>
</template>

<script>
    import { 
        Gantt, 
        Panel,
        Menu,
        WidgetHelper,
        DateHelper,
        Popup,
        Toast,
        EffectResolutionResult 
    } from 'bryntum-gantt';

    import ganttConfig from './gantt/ganttConfig.js';
    import GanttToolbar from '../lib/GanttToolbar.js'
    
    export default {
        name: 'gantt-panel',
        
        data() {
            return {
                gantt : null,
                panel : null
            }
        }, // eo function data
                    
        mounted() {
            const
                gantt   = this.gantt    = new Gantt(ganttConfig),
                project = gantt.project,
                stm     = project.stm,
                panel   = this.panel    = new Panel({
                    items : [ gantt ],
                    tbar : new GanttToolbar({ gantt })
                }),
                updateUndoRedoButtons = () => {
                    const 
                        widgetMap = panel.tbar.widgetMap,
                        undoBtn = widgetMap.undoBtn,
                        redoBtn = widgetMap.redoBtn,
                        redoCount = stm.length - stm.position
                    ;
                    
                    undoBtn.badge = stm.position || '';
                    redoBtn.badge = redoCount || '';
                    
                    undoBtn.disabled = !stm.canUndo;
                    redoBtn.disabled = !stm.canRedo;
                } // eo function updateUndoRedoButtons
            ;
            
            stm.on({
                recordingstop : updateUndoRedoButtons,
                restoringstop : updateUndoRedoButtons
            });   
            
            // render panel and its children: toolbar and gantt
            panel.render(this.$el);
            
            project.on('load', ({source}) => {
                panel.tbar.widgetMap.startDateField.value = source.startDate;
            });
            
            // load project
            project.load().then(() => {
                
                // let's track scheduling conflicts happened
                project.on('schedulingconflict', context => {
                    // show notification to user
                    Toast.show('Scheduling conflict has happened ..recent changes were reverted');
                    // as the conflict resolution approach let's simply cancel the changes
                    context.continueWithResolutionResult(EffectResolutionResult.Cancel);
                });
                
                stm.enable();
                stm.autoRecord = true;
                
            }); // eo project load
            
        } // eo function mounted()
        
    } // export the Panel component
    
</script>
