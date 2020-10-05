import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { PanelComponent } from './gantt/panel.component';

@NgModule({
    declarations: [
        AppComponent,
        PanelComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap: [AppComponent]
})
export class AppModule { }
