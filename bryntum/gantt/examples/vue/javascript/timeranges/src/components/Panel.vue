<!-- 
 *- Panel Component
 -->
<template>
    <bryntum-panel 
        container="content"
        type="panel"
        ref="panel"
        layout="fit"
        cls="timeranges"
        flex="0 0 350px"
        :items="items"
        :bbar="bbar"
    />
</template>

<script>
    import BryntumPanel from 'bryntum-vue-shared/src/BryntumWidget.vue';
    export default {
        name : 'app-panel',
        components : {
            BryntumPanel
        },
        data() {
            return {
                items : [{
                    type : 'grid',
                    ref  : 'grid',
                    flex : 1,
                    columns : [{
                        text  : 'Time ranges',
                        flex  : 1,
                        field : 'name'
                    },
                    {
                        type  : 'date',
                        text  : 'Start Date',
                        width : 110,
                        align : 'right',
                        field : 'startDate',
                    },
                    {
                        type          : 'number',
                        text          : 'Duration',
                        width         : 100,
                        field         : 'duration',
                        min           : 0,
                        instantUpdate : true,
                        renderer      : data => `${data.record.duration} d`
                    }], // eo columns
                    features : {
                        sort : true
                    }
                }], // eo items
                bbar : [{
                    type    : 'button',
                    text    : 'Add',
                    icon    : 'b-fa-plus',
                    cls     : 'b-green',
                    tooltip : 'Add new time range',
                    onClick({source}) {
                        const store = source.parent.parent.widgetMap.grid.store;
                        store.add({
                            name      : 'New range',
                            startDate : new Date(2019, 1, 27),
                            duration  : 5
                        });
                    }
                }] // eo bbar

            } // eo return
        }, // eo function data

    }
</script>


<!-- eof -->
