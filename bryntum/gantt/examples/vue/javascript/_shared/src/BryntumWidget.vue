<!--
Bryntum Widget wrapper
-->

<template>
</template>

<script>
    import { WidgetHelper } from 'bryntum-gantt';

    export default {

        name : 'widget',

        props : {
            activeTab               : Number,
            allowOver               : { type : Boolean, default : undefined },
            anchorToTarget          : { type : Boolean, default : undefined },
            animateTabChange        : { type : Boolean, default : undefined },
            autoClose               : { type : Boolean, default : undefined },
            autoComplete            : String,
            autoExpand              : { type : Boolean, default : undefined },
            autoShow                : { type : Boolean, default : undefined },
            badge                   : String,
            bbar                    : [Array, Object],
            checked                 : { type : Boolean, default : undefined },
            chipView                : { type : Boolean, default : undefined },
            clearable               : { type : Boolean, default : undefined },
            closable                : { type : Boolean, default : undefined },
            closeAction             : String,
            closeParent             : { type : Boolean, default : undefined },
            cls                     : String,
            color                   : String,
            columns                 : [Array, Object],
            container               : [String, Object],
            config                  : Object,
            dataset                 : Object,
            defaults                : Object,
            disabled                : { type : Boolean, default : undefined },
            displayField            : String,
            displayValueRenderer    : Function,
            editable                : { type : Boolean, default : undefined },
            emptyText               : String,
            filterOperator          : String,
            filterSelected          : { type : Boolean, default : undefined },
            flex                    : [Number, String],
            focusOnHover            : { type : Boolean, default : undefined },
            footer                  : [Object, String],
            forElement              : [Object, String],
            forSelector             : String,
            format                  : String,
            header                  : [Object, String],
            height                  : [Number, String],
            hidden                  : { type : Boolean, default : undefined },
            hideDelay               : Number,
            highlightExternalChange : { type : Boolean, default : undefined },
            html                    : String,
            icon                    : String,
            iconTpl                 : Function,
            inline                  : { type : Boolean, default : undefined },
            inputWidth              : [Number, String],
            itemCls                 : String,
            items                   : [Array, Object],
            keyStrokeChangeDelay    : Number,
            keyStrokeFilterDelay    : Number,
            label                   : String,
            labelWidth              : [Number, String],
            layoutStyle             : Object,
            listCls                 : String,
            listItemTpl             : Function,
            loadingMsg              : String,
            margin                  : [Number, String],
            max                     : Number,
            menu                    : [Array, Object],
            min                     : Number,
            minChars                : Number,
            mode                    : String,
            mouseOffsetX            : Number,
            mouseOffsetY            : Number,
            multiSelect             : Boolean,
            onAction                : Function,
            onChange                : Function,
            onClick                 : Function,
            onItem                  : Function,
            picker                  : Object,
            pickerAlignElement      : String,
            pickerFormat            : String,
            pickerWidth             : Number,
            placeholder             : String,
            pressed                 : { type : Boolean, default : undefined },
            pressedIcon             : String,
            readOnly                : { type : Boolean, default : undefined },
            required                : { type : Boolean, default : undefined },
            resize                  : String,
            ripple                  : [{ type : Boolean, default : undefined }, Object],
            selected                : Object,
            showOnClick             : { type : Boolean, default : undefined },
            showOnHover             : { type : Boolean, default : undefined },
            showProgress            : { type : Boolean, default : undefined },
            showTooltip             : { type : Boolean, default : undefined },
            showValue               : { type : Boolean, default : undefined },
            step                    : Number,
            store                   : Object,
            tabMinWidth             : Number,
            tabMaxWidth             : Number,
            tbar                    : [Array, Object],
            text                    : String,
            timeout                 : Number,
            title                   : String,
            toggle                  : Function,
            toggleable              : { type : Boolean, default : undefined },
            toggleGroup             : String,
            tools                   : Object,
            tooltip                 : [String, Object],
            trapFocus               : { type : Boolean, default : undefined },
            triggerAction           : Number,
            triggers                : Object,
            type                    : String,
            unit                    : String,
            useAbbreviation         : { type : Boolean, default : undefined },
            validateFilter          : { type : Boolean, default : undefined },
            value                   : [Number, String],
            valueField              : String,
            visible                 : { type : Boolean, default : undefined },
            width                   : [Number, String]
        }, // eo props

        // runs after the component is attached to DOM (mounted)
        mounted() {
            const
                propKeys = Object.keys(this.$props),

                adoptTypes = ['splitter'],

                skipProps = [
                    'adopt',
                    'appendTo'
                ],
                // this is only a subset of props that should not be updated
                skipUpdateProps = [
                    'clearable',
                    'listeners',
                    'placeholder',
                    'triggers',
                    'type'
                ]
            ;

            const config = {

                appendTo : this.container ? this.container : this.$el,

                // Listeners, will relay events using $emit
                listeners : {
                    catchAll(event) {
                        // Uncomment this line to log events being emitted to console
                        //console.log(event.type);
                        this.$emit(event.type, event);
                    },

                    thisObj : this
                },

                features : {}
            };

            // Object.assign(config, adoptAppend);

            // Apply all props to the widget config
            propKeys.forEach(prop => {
                let match;
                if ((match = prop.match(/(.*)Feature/)) && this[prop] !== undefined) {
                    // Prop which ends with Feature is a feature config
                    config.features[match[1]] = this[prop];
                }
                else if (skipProps.includes(prop)) {
                    return;
                }
                else if (prop === 'config') {
                    // Prop is a config object
                    Object.assign(config, this[prop]);
                }
                else if (this[prop] !== undefined) {
                    config[prop] = this[prop];
                }
                else if (!skipUpdateProps.includes(prop)) {
                    // Set up a watcher
                    this.$watch(prop, newValue => {
                        this.ganttInstance[prop] = Array.isArray(newValue) ? newValue.slice() : newValue;
                    });
                }
            }, this); // eo propKeys.forEach

            // console.log('BryntumWidget:', config);

            this.widget = WidgetHelper.createWidget(config);

            if(this.container) {
                this.$el.parentNode.removeChild(this.$el);
                this.$el = this.widget.element;
            }
        }, // eo function mounted

        // cleanup before destroy
        beforeDestroy() {
            // Make sure the widget is destroyed when vue component is
            this.widget.destroy();
        } // eo function beforeDestroy

    }; // eo export default

</script>

<!-- eof -->
