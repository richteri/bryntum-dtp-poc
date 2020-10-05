/**
 * Angular wrapper for Bryntum Fullscreen button
 */
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Button, Fullscreen, WidgetHelper } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector : 'bry-fullscreen',
    template : ''
})

export class FullscreenComponent implements OnInit, OnDestroy {

    // class variables
    private elementRef: ElementRef;
    private button: Button;

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    /**
     * Initializes component
     */
    ngOnInit() {
        if (!Fullscreen.enabled) {
            return;
        }

        this.button = WidgetHelper.createWidget({
            type       : 'button',
            appendTo   : this.elementRef.nativeElement,
            icon       : 'b-icon b-icon-fullscreen',
            tooltip    : 'Fullscreen',
            toggleable : true,
            cls        : 'b-blue b-raised',
            onToggle   : ({ pressed }) => {
                if (pressed) {
                    Fullscreen.request(document.documentElement);
                } else {
                    Fullscreen.exit();
                }
            }
        }) as Button;

        Fullscreen.onFullscreenChange(() => {
            this.button.pressed = Fullscreen.isFullscreen;
        });
    }

    /**
     * Destroys component
     */
    ngOnDestroy() {
        if (this.button) {
            this.button.destroy();
        }
    }
}
