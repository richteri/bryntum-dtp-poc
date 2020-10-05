<!--
*- Vue Application Component
-->
<template>
    <div id="container">
        <app-header title="Gantt Advanced Vue demo"></app-header>
        <app-panel></app-panel>
    </div>
</template>

<script>
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './components/header/Header.vue';
    import AppPanel from './components/Panel.vue';

    export default {
        name: 'app',

        components: {
            AppHeader,
            AppPanel
        } // eo components
    } // eo export default App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
