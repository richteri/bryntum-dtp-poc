import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BryntumAngularSharedModule } from 'bryntum-angular-shared';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

@NgModule({

    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BryntumAngularSharedModule
    ],
    providers: [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap: [AppComponent]
})
export class AppModule { }
