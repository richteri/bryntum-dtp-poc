<!-- 
 *- Gantt component
 -->
 <template>
    <bryntum-gantt
        ref                = "gantt"
        :project           = "project"
        :columns           = "columns"
        :taskEditFeature   = "taskEditFeature"
        :taskRenderer      = "taskRenderer"
    />
</template>

<script>
    import BryntumGantt from 'bryntum-vue-shared/src/BryntumGantt.vue';
    import { ProjectModel, TaskModel } from 'bryntum-gantt';

    import '../lib/FilesTab.js';
    import '../lib/ColorField.js';

    class MyModel extends TaskModel {
        static get fields() {
            return [
                { name : 'deadline', type : 'date' },
                { name : 'color' }
            ];
        }
    } // eo class MyModel

    export default {
        name : 'app-gantt',

        components : {
            BryntumGantt
        },
        
        data() {
            return {
                project: new ProjectModel({
                    autoLoad       : true,
                    taskModelClass : MyModel,
                    transport      : {
                        load : {
                            url : 'data/launch-saas.json'
                        }
                    }
                }),
                columns : [
                    { type : 'name', field : 'name', text : 'Name', width : 250 },
                    { type : 'date', field : 'deadline', text : 'Deadline' }
                ],
                taskEditFeature : {
                    editorConfig : {
                        height     : '37em',
                        extraItems : {
                            generaltab : [
                                {
                                    html    : '',
                                    dataset : {
                                        text : 'Custom fields'
                                    },
                                    cls  : 'b-divider',
                                    flex : '1 0 100%'
                                },
                                {
                                    type  : 'datefield',
                                    ref   : 'deadlineField',
                                    name  : 'deadline',
                                    label : 'Deadline',
                                    flex  : '1 0 50%',
                                    cls   : 'b-inline'
                                },
                                {
                                    type  : 'colorfield',
                                    ref   : 'colorField',
                                    name  : 'color',
                                    label : 'Color',
                                    flex  : '1 0 50%',
                                    cls   : 'b-inline'
                                }
                            ]
                        } // eo extraItems
                    }, // eo editorConfig
                    tabsConfig : {
                        // change title of General tab
                        generaltab : {
                            title : 'Common'
                        },

                        // remove Notes tab
                        notestab : false,

                        // add custom Files tab
                        filestab : { type : 'filestab' }
                    }

                }, // eo taskEditFeature
                
                taskRenderer : ({ taskRecord, tplData }) => {
                    if (taskRecord.color) {
                        tplData.style += `background-color:${taskRecord.color}`;
                    }
                } // eo taskRenderer

            } // eo return from data
        } // eo data

    }; // eo export default
    
</script>

<!-- eof -->