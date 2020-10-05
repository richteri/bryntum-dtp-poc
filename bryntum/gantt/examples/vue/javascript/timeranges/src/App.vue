<!--
/**
 *- App component
 */
-->
<template>
    <div id="container">
        <app-header :title="title" />
        <div id="content">
            <app-gantt ref="gantt"></app-gantt>
            <app-splitter type="splitter" container="content" />
            <app-panel ref="panel"></app-panel>
        </div>
    </div>
</template>

<script>
    import { eventBus } from './main.js';
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './components/Header.vue';
    import AppGantt from './components/Gantt.vue';
    import AppSplitter from 'bryntum-vue-shared/src/BryntumWidget.vue';
    import AppPanel from './components/Panel';

    export default {
        name: 'app',

        components: {
            AppHeader,
            AppGantt,
            AppSplitter,
            AppPanel
        }, // eo components

        data() {
            return {
                title : document.title
            } // eo return from data
        }, // eo data

        mounted() {
            const
                gantt = this.$refs.gantt.$refs.gantt.ganttInstance,
                grid = this.$refs.panel.$refs.panel.widget.widgetMap.grid
            ;

            grid.store = gantt.features.timeRanges.store;
        }

    } // eo export default App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
