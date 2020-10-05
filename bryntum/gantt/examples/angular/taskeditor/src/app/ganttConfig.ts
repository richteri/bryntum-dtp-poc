import filesTabConfig from './lib/filesTabConfig';

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { ProjectModel } from 'bryntum-gantt/gantt.umd.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : 'assets/data/launch-saas.json'
        }
    },
    autoLoad  : true
})

export default {
    columns  : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],
    features : {
        taskEdit : {
            editorConfig : {
                height     : '37em',
                extraItems : {
                    generaltab : [
                        {
                            html    : '',
                            dataset : {
                                text : 'Custom fields'
                            },
                            cls     : 'b-divider',
                            flex    : '1 0 100%'
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
                }
            },
            tabsConfig   : {
                // change title of General tab
                generaltab : {
                    title : 'Common'
                },

                // remove Notes tab
                notestab : false,

                // add custom Files tab
                filesTabConfig
            }
        }
    },
    project
}
