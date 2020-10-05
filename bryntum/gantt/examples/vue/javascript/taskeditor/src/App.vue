<!-- 
 *- App component
 -->
<template>
    <div id="container">
        <app-header :title="title" />
        <app-gantt />
    </div>
</template>

<script>
    import { eventBus } from './main.js';
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './components/Header.vue';
    import AppGantt from './components/Gantt.vue';
    
    export default {
        name : 'app',

        components : {
            AppHeader,
            AppGantt
        },
     
        data() {
            return {
                title : document.title
            } // eo return from data
        } // eo data
        
    };
</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
