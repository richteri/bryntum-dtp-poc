<!--
Bryntum Gantt wrapper
-->

<template>
    <div class = "b-gantt-container"></div>
</template>

<script>
    import { Gantt } from 'bryntum-gantt';

    // Defines a Vue component that wraps Bryntum Gantt
    export default {

        name : 'gantt',

        props : {
            // Configs
            barMargin                : { default : 10, type : Number },
            calendars                : Array,
            cls                      : String,

            // The defaults for Booleans have to be specified, otherwise they would be false.
            // Setting it to undefined allows the underlying Gantt to apply its own default.
            columnLines              : {type : Boolean, default : undefined },

            columns                  : Array,
            container                : String,
            data                     : Object,
            durationDisplayPrecision : { type : [Number, Boolean], default : undefined },
            emptyText                : String,
            endDate                  : [String, Date],
            eventColor               : String,
            eventStyle               : String,
            fillLastColumn           : { type : Boolean, default : undefined },
            ganttId                  : String,
            height                   : [Number, String],
            minWidth                 : [Number, String],
            minHeight                : [Number, String],
            project                  : Object,
            readOnly                 : { type : Boolean, default : undefined },
            rowHeight                : [Number, String],
            snap                     : { type : Boolean, default : undefined },
            startDate                : [String, Date],
            subGridConfigs           : Object,
            displayDateFormat        : String,
            flex                     : String,
            listeners                : Object,
            maxHeight                : [Number, String],
            maxWidth                 : [Number, String],
            maxZoomLevel             : Number,
            minZoomLevel             : Number,
            partner                  : [Object, String],
            resourceTimeRanges       : Array,
            taskRenderer             : Function,
            scrollLeft               : Number,
            scrollTop                : Number,
            selectedEvents           : Array,
            tickWidth                : Number,
            timeResolution           : Object,
            viewportCenterDate       : Date,
            viewPreset               : [Object, String],
            width                    : [Number, String],
            zoomLevel                : Number,

            // Stores
            assignmentStore : Object,
            dependencyStore : Object,
            eventStore      : Object,
            taskStore       : Object,
            resourceStore   : Object,

            crudManager : Object,

            // Data
            assignments  : Array,
            dependencies : Array,
            events       : Array,
            tasks        : Array,
            resources    : Array,
            timeRanges   : Array,

            config : Object,

            // Features, only used for initialization
            cellEditFeature           : { type : [Boolean, Object], default : undefined },
            cellTooltipFeature        : { type : [Boolean, Object], default : undefined },
            columnDragToolbarFeature  : { type : [Boolean, Object], default : undefined },
            columnPickerFeature       : { type : [Boolean, Object], default : undefined },
            columnReorderFeature      : { type : [Boolean, Object], default : undefined },
            columnResizeFeature       : { type : [Boolean, Object], default : undefined },
            contextMenuFeature        : { type : [Boolean, Object], default : undefined },
            filterBarFeature          : { type : [Boolean, Object], default : undefined },
            filterFeature             : { type : [Boolean, Object], default : undefined },
            groupFeature              : { type : [Boolean, Object, String], default : undefined },
            groupSummaryFeature       : { type : [Boolean, Object], default : undefined },
            headerContextMenuFeature  : { type : [Boolean, Object], default : undefined },
            headerZoomFeature         : { type : Boolean, default : undefined },
            labelsFeature             : { type : [Boolean, Object], default : undefined },
            nonWorkingTimeFeature     : { type : [Boolean, Object], default : undefined },
            panFeature                : { type : [Boolean, Object], default : undefined },
            pdfExportFeature          : { type : [Boolean, Object], default : undefined },
            percentBarFeature         : { type : [Boolean, Object], default : undefined },
            projectLinesBarFeature    : { type : [Boolean, Object], default : undefined },
            quickFindFeature          : { type : [Boolean, Object], default : undefined },
            recurringTimeSpansFeature : { type : [Boolean, Object], default : undefined },
            regionResizeFeature       : { type : Boolean, default : undefined },
            resourceTimeRangesFeature : { type : [Boolean, Object], default : undefined },
            rollupsFeature            : { type : [Boolean, Object], default : undefined },
            rowReorderFeature         : { type : Boolean, default : undefined },
            searchFeature             : { type : [Boolean, Object], default : undefined },
            sortFeature               : { type : [Boolean, Object, String, Array], default : undefined },
            stripeFeature             : { type : Boolean, default : undefined },
            summaryFeature            : { type : [Boolean, Object], default : undefined },
            taskContextMenuFeature    : { type : [Boolean, Object], default : undefined },
            taskDragFeature           : { type : [Boolean, Object], default : undefined },
            taskDragCreateFeature     : { type : [Boolean, Object], default : undefined },
            taskEditFeature           : { type : [Boolean, Object], default : undefined },
            taskResizeFeature         : { type : [Boolean, Object], default : undefined },
            taskTooltipFeature        : { type : [Boolean, Object], default : undefined },
            timeRangesFeature         : { type : [Boolean, Object], default : undefined },
            treeFeature               : { type : [Boolean, Object], default : undefined }
        }, // eo props

        computed : {
            /**
             * @deprecated in favor of ganttInstance
             */
            ganttEngine() {
                console.warn('ganttEngine is deprecated. Use ganttInstance instead.')
                return this.ganttInstance;
            }
        },

        // runs after the component is attached to DOM (mounted)
        mounted() {
            const propKeys = Object.keys(this.$props);

            const config = {

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

            // Apply all props to gantt config
            propKeys.forEach(prop => {
                let match;
                if ((match = prop.match(/(.*)Feature/)) && this[prop] !== undefined) {
                    // Prop which ends with Feature is a feature config
                    config.features[match[1]] = this[prop];
                }
                else if (prop === 'config') {
                    // Prop is a config object
                    Object.assign(config, this[prop]);
                }
                else {
                    // Prop is a config
                    if (this[prop] !== undefined) {
                        config[prop] = this[prop]
                    };

                    // Set up a watcher
                    this.$watch(prop, newValue => {
                        this.ganttInstance[prop] = Array.isArray(newValue) ? newValue.slice() : newValue;
                    });
                }
            }, this);

            // console.log('config=', config, 'props=', this.$props);

            // either append Gantt to the passed container or adopt our own element
            if(this.container) {
                config.appendTo = this.container;
            }
            else {
                config.adopt = this.$el;
            }

            // Create a Bryntum Gantt with props as configs
            const engine = this.ganttInstance = new Gantt(config);

            // remove the own element if it is not needed
            if(this.container) {
                this.$el.parentNode.removeChild(this.$el);
                this.$el = engine.element;
            }

        }, // eo function mounted

        // cleanup before destroy
        beforeDestroy() {
            // Make sure Bryntum Grid is destroyed when vue component is
            this.ganttInstance.destroy();
        } // eo function beforeDestroy

    }; // eo gantt export

</script>

<!-- eof -->
