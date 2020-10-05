import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';
import { AppComponent } from './app.component';
import { BryntumAngularSharedModule} from 'bryntum-angular-shared';

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

