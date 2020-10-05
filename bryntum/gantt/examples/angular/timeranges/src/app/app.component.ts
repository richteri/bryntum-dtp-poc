/**
 * App component script
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { WidgetComponent } from 'bryntum-angular-shared';
import containerConfig from './containerConfig';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Container } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private title: string = document.title;
    private containerConfig: any = containerConfig;

    @ViewChild('container', { static : false } ) container: WidgetComponent;

    ngOnInit(): void {
    }

    onShowHeaders(event: any): void {
      // we may be called too early when container is not yet set
      if(!this.container) {
        return;
      }
      const gantt = (this.container.widget as Container).widgetMap.gantt;
      if('action' === event.type) {
            gantt.features.timeRanges.showHeaderElements = event.source.pressed;
        }
    }
}
