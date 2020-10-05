/**
 * Angular wrapper for Bryntum Widget
 */
import { Component, OnInit, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Widget, WidgetHelper } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector : 'bry-widget',
    template : ''
})

export class WidgetComponent implements OnInit, OnDestroy {

    private elementRef: ElementRef;
    public widget: Widget;

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    @Input() config: any;
    @Output() onWidgetEvents = new EventEmitter<object>();

    /**
     * Create and append the underlying widget
     */
    ngOnInit(): void {
        const me = this;

        Object.assign(me.config, {
            appendTo  : me.elementRef.nativeElement,
            listeners : me.config.listeners || {
                catchAll(event: any) {
                    me.onWidgetEvents.emit(event);
                },
                thisObj : me
            }
        });

        // make the widget publicly available
        me.widget = WidgetHelper.createWidget(me.config) as Widget;
    }

    /**
     * Destroy the component
     */
    ngOnDestroy(): void {
        const me = this;
        if (me.widget && me.widget.destroy) {
            me.widget.destroy();
        }
    }

}
