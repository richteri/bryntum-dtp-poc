/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Grid/column/AggregateColumn.js';
import '../../lib/Gantt/column/StartDateColumn.js';
import '../../lib/Gantt/column/DurationColumn.js';
import TaskModel from '../../lib/Gantt/model/TaskModel.js';

class MyTaskModel extends TaskModel {
    static get fields() {
        return [
            { name : 'cost', type : 'number' }
        ];
    }
}
// Must happen now so that field definitions are added to the prototype chain's fieldMap
MyTaskModel.exposeProperties();

const
    project = new ProjectModel({
        taskModelClass : MyTaskModel,
        transport      : {
            load : {
                url : '../_datasets/launch-saas.json'
            }
        }
    }),

    gantt = new Gantt({
        adopt   : 'container',
        project : project,
        columns : [
            { type : 'name', field : 'name', width : 250 },
            { type : 'startdate' },
            { type : 'duration' },
            {
                type       : 'aggregate',
                text       : 'Cost<br><span style="font-size:0.8em">(aggregated)</span>',
                field      : 'cost',
                width      : 100,
                htmlEncode : false,
                renderer   : ({ record, value }) => record.isLeaf ? `$${value || 0}` : `<b>$${value || 0}</b>`
            }
        ],
        features : {
            taskEdit : {
                editorConfig : {
                    height     : '37em',
                    extraItems : {
                        generaltab : [
                            {
                                html    : '',
                                ref     : 'costGroup',
                                dataset : {
                                    text : 'Cost'
                                },
                                cls  : 'b-divider',
                                flex : '1 0 100%'
                            },
                            {
                                type  : 'number',
                                ref   : 'costField',
                                name  : 'cost',
                                label : 'Cost',
                                flex  : '.5 0',
                                cls   : 'b-inline'
                            }
                        ]
                    }
                }
            }
        },
        listeners : {
            // Disable Cost editing for parent tasks
            beforeTaskEdit : ({ taskRecord }) => {
                gantt.taskEdit.editor.widgetMap.costField.disabled = !taskRecord.isLeaf;
            }
        }
    });

project.load();
