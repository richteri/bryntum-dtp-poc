/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import TaskModel from '../../lib/Gantt/model/TaskModel.js';
import '../../lib/Grid/column/DateColumn.js';
import './lib/FilesTab.js';
import './lib/ColorField.js';

class MyModel extends TaskModel {
    static get fields() {
        return [
            { name : 'deadline', type : 'date' },
            { name : 'color' }
        ];
    }
}

const project = window.project = new ProjectModel({
    taskModelClass : MyModel,
    transport      : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

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
                }
            },
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
        }
    },

    taskRenderer : ({ taskRecord, tplData }) => {
        if (taskRecord.color) {
            tplData.style += `background-color:${taskRecord.color}`;
        }
    },

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 },
        { type : 'date', field : 'deadline', text : 'Deadline' }
    ],

    project
});

project.load();
