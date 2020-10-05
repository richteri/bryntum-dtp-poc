import { Component, ViewChild, OnInit } from '@angular/core';
import ganttConfig from './ganttConfig';
import { GanttComponent } from "bryntum-angular-shared";

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title       = 'Task editor customization Angular demo';
    ganttConfig = ganttConfig;

    @ViewChild(GanttComponent, { static : false }) gantt : GanttComponent;

    ngOnInit() : void {
    }

    onPdfExport() {
        this.gantt.ganttInstance.features.pdfExport.showExportDialog()
    }

}
