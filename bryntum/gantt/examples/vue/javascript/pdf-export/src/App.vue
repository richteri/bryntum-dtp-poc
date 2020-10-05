<!--
 *- Vue Application Component
 -->
<template>
    <div id="app">
        <demo-header :title="title"></demo-header>

        <bryntum-gantt
            ref                  = "gantt"
            :project             = "ganttConfig.project"
            :startDate           = "ganttConfig.startDate"
            :endDate             = "ganttConfig.endDate"
            :viewPreset          = "ganttConfig.viewPreset"
            :rowHeight           = "ganttConfig.rowHeight"
            :timeRangesFeature   = "ganttConfig.timeRangesFeature"
            :pdfExportFeature    = "ganttConfig.pdfExportFeature"
        ></bryntum-gantt>
    </div>
</template>

<script>
    // header
    import DemoHeader from './components/Header.vue';

    // gantt and its config
    import BryntumGantt from 'bryntum-vue-shared/src/BryntumGantt.vue';
    import ganttConfig from './components/ganttConfig.js';

    // we need to import it here because it comes from the package
    import 'bryntum-gantt/gantt.stockholm.css';
    import {eventBus} from './main';

    // App
    export default {
        name: 'app',

        // local components
        components: {
            DemoHeader,
            BryntumGantt
        },

        created() {
            // centralized button click listeners
            eventBus.$on('click', this.dispatchClick);
        }, // eo function created

        // function that returns data
        data() {
            return {
                ganttConfig,
                title : document.title
            }
        }, // eo function data

        methods : {
            // dispatch button clicks from this centralized
            // click handler to the respective action handlers
            dispatchClick(action) {
                const
                    method = `${action}Handler`,
                    me = this;

                // console.log(method);
                if(me[method]) me[method](action);
            }, // eo function dispatchClick

            exportHandler() {
                this.$refs.gantt.ganttInstance.features.pdfExport.showExportDialog();
            }
        },

        // cleanup before destroy
        beforeDestroy() {
            // remove event listeners from eventBus
            eventBus.$off['click'];
        } //
    } // eo export App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
