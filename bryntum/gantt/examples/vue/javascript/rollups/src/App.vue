<!--
 *- App component 
-->
<template>
    <div id="container">
        <app-header :title="title" />
        <app-gantt ref="gantt"></app-gantt>
    </div>
</template>

<script>
    import { eventBus } from './main.js';
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './components/header/Header.vue';
    import AppGantt from './components/gantt/Gantt.vue';
    
    export default {
        name: 'app',
        
        components: {
            AppHeader,
            AppGantt
        }, // eo components

        data() {
            return {
                title : document.title
            } // eo return from data
        } // eo data
        
    } // eo export default App
    
</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
