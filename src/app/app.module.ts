import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GanttViewComponent } from './gantt-view/gantt-view.component';

@NgModule({
  declarations: [
    AppComponent,
    GanttViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
