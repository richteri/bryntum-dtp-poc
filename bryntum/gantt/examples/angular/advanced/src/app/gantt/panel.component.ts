/**
 * Panel component. Contains toolbar and gantt
 */
import { Component, OnInit, ElementRef } from '@angular/core';
import ganttToolbar from './ganttToolbar';
import ganttConfig from './ganttConfig';
import '../lib/StatusColumn.js';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Gantt, Panel, ProjectModel, Toast, EffectResolutionResult } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector : 'gantt-panel',
    template : '<div id="container"></div>'
})
export class PanelComponent implements OnInit {

    private elementRef: ElementRef;
    public panel: any;

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    ngOnInit() {

        const
            project = new ProjectModel({
                transport : {
                    load : {
                        url : 'assets/datasets/launch-saas.json'
                    }
                }
            }),
            gantt   = new Gantt({
                ...ganttConfig,
                project,
            }),
            tbar    = ganttToolbar(gantt),
            config  = {
                appendTo : this.elementRef.nativeElement.firstElementChild,
                items    : [gantt],
                tbar
            }
        ;

        // panel renders to this component's element
        const panel = this.panel = new Panel(config);

        project.on('load', ({ source }) => {
            // @ts-ignore
            const startDateField = panel.tbar.widgetMap.startDateField;

            // suspending and resuming events to not change the store #9391
            startDateField.suspendEvents();
            startDateField.value = source.startDate;
            startDateField.resumeEvents();

        });

        project.load({}).then(() => {
            const stm = gantt.project.stm;

            // let's track scheduling conflicts happened
            project.on('schedulingconflict', context => {
                // show notification to user
                Toast.show('Scheduling conflict has happened ..recent changes were reverted');
                // as the conflict resolution approach let's simply cancel the changes
                context.continueWithResolutionResult(EffectResolutionResult.Cancel);
            });

            stm.enable();
            stm.autoRecord = true;

        });
    }

}
