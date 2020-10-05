/**
 * Angular wrapper for Bryntum Button widget
 */
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Button, WidgetHelper } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector : 'bry-button',
    template : ''
})

export class ButtonComponent implements OnInit, OnChanges, OnDestroy {

    private elementRef: ElementRef;
    private button: Button;

    @Input() cls: string;
    @Input() color: string = 'b-orange b-raised';
    @Input() disabled: boolean;
    @Input() icon: string;
    @Input() pressed: boolean;
    @Input() text: string;
    @Input() toggleable: boolean;
    @Input() toggleGroup: string;
    @Input() tooltip: string;

    @Output() click: EventEmitter<any> = new EventEmitter();
    @Input() onAction = () => {}; // empty fn by default, fixes #436

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    /**
     * Initializes component
     */
    ngOnInit() {
        this.button = WidgetHelper.createWidget({
            type        : 'button',
            appendTo    : this.elementRef.nativeElement,
            cls         : this.cls,
            color       : this.color,
            icon        : this.icon,
            onAction    : this.onAction,
            onClick     : (event: any) => this.click.emit(event),
            pressed     : this.pressed,
            text        : this.text,
            toggleable  : this.toggleable,
            toggleGroup : this.toggleGroup,
            tooltip     : this.tooltip,
            disabled    : this.disabled
        }) as Button;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.button) {
            Object.entries(changes).forEach(([name, { currentValue }]) => {
                this.button[name] = currentValue;
            });
        }
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
