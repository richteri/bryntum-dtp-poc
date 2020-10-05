/**
 * App component script
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import ganttConfig from './ganttConfig';
import { GanttComponent } from "bryntum-angular-shared";

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : [ './app.component.scss']
})
export class AppComponent implements OnInit {
    private title : string = document.title;
    private ganttConfig : any = ganttConfig;

    private checkboxConfig : object = {
        type       : 'checkbox',
        text       : 'Show Rollups',
        tooltip    : 'Toggle rollups showing',
        checked    : true,
        toggleable : true,
        cls        : 'b-blue b-bright'
    };

    @ViewChild(GanttComponent, { static : false }) gantt : GanttComponent;

    ngOnInit(): void {
    }

    onShowRollups(event : any) {
        if('action' === event.type) {
            this.gantt.ganttInstance.features.rollups.disabled = !event.source.checked;
        }
    }

}
