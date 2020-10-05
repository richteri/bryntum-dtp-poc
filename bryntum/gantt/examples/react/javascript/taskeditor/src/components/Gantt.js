/**
 *- Gantt Functional Component
 */
import React from 'react';
import { BryntumGantt } from 'bryntum-react-shared';
import { ProjectModel, TaskModel } from 'bryntum-gantt';

import './ColorField'; // custom color field
import './FilesTab'; // custom files tab

class MyModel extends TaskModel {
    static get fields() {
        return [
            { name : 'deadline', type : 'date' },
            { name : 'color' }
        ];
    }
}

// we use forwardRef to pass ref to Gantt up to the parent
const Gantt = props => {

    // create and load the project
    const project = new ProjectModel({
        autoLoad : true,
        taskModelClass : MyModel,
        transport : {
            load : {
                url : 'data/launch-saas.json'
            }
        }
    });

    return (
        <BryntumGantt 
            flex    = "1 1 auto"
            project = {project}
            columns = {[
                { type : 'name', field : 'name', text : 'Name', width : 250 },
                { type : 'date', field : 'deadline', text : 'Deadline' }
            ]}
            taskRenderer = {({ taskRecord, tplData }) => {
                if (taskRecord.color) {
                    tplData.style += `background-color:${taskRecord.color}`;
                }
            }}

            taskEditFeature = {{
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
            }}
        />
    ); // eo return
}; // eo function Gantt

export default Gantt;

// eof