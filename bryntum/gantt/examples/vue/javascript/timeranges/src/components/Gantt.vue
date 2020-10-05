<!--
 *- Gantt component
 -->
<template>
    <bryntum-gantt
        container          = "content"
        ref                = "gantt"
        :flex              = "flex"
        :project           = "project"
        :columns           = "columns"
        :timeRangesFeature = "timeRangesFeature"
    />
</template>

<script>
    import BryntumGantt from 'bryntum-vue-shared/src/BryntumGantt.vue';
    import { ProjectModel } from 'bryntum-gantt';
    import { eventBus } from '../main.js';


    export default {
        name : 'app-gantt',

        components : {
            BryntumGantt
        },

        created() {
            eventBus.$on('onShowHeadersClick', this.handleShowHeaders)
        },

        data() {
            return {
                project: new ProjectModel({
                    autoLoad : true,
                    transport : {
                        load : {
                            url : 'data/timeranges.json'
                        }
                    }
                }),
                flex : '2 1 auto',
                columns : [
                    { type : 'name', field : 'name', width : 250 }
                ],
                timeRangesFeature : {
                    enableResizing      : true,
                    showCurrentTimeLine : false,
                    showHeaderElements  : true
                }
            } // eo return from data
        }, // eo data

        methods : {
            handleShowHeaders({source}) {
                this.$refs.gantt.ganttInstance.features.timeRanges.disabled = !source.pressed;
            }
        }
    }
</script>

<!-- eof -->
