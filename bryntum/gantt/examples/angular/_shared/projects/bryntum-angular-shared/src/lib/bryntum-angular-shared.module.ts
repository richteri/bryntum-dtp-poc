/**
 * Bryntum Angular shared module
 */
import { NgModule } from '@angular/core';
import { ButtonComponent } from './button.component';
import { FullscreenComponent } from './fullscreen.component';
import { GanttComponent } from './gantt.component';
import { SliderComponent } from './slider.component';
import { WidgetComponent } from './widget.component';

@NgModule({
    declarations : [
        ButtonComponent,
        FullscreenComponent,
        GanttComponent,
        SliderComponent,
        WidgetComponent
    ],
    imports      : [],
    exports      : [
        ButtonComponent,
        FullscreenComponent,
        GanttComponent,
        SliderComponent,
        WidgetComponent
    ]
})

export class BryntumAngularSharedModule {}


