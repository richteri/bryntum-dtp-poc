/**
 *- Gantt configuration
 */
import { ProjectModel } from 'bryntum-gantt';

const project = new ProjectModel({
    autoLoad : true,
    transport : {
        load : {
            url : 'data/tasks.json'
        }
    }
});

const ganttConfig = {

    project : project,

    columns : [
        { type : 'wbs' },
        { type : 'name' }
    ],

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    viewPreset : 'monthAndYear',

    // Allow extra space for rollups
    rowHeight : 50,
    barMargin : 7,

    columnLines : true,

    features : {
        rollups : true
    }
};


export default ganttConfig;

// eof
