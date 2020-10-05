/**
 * Gantt configuration file
 */

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { ProjectModel } from 'bryntum-gantt/gantt.umd.js';

const project  = new ProjectModel({
    autoLoad  : true,
    transport : {
        load : {
            url : 'assets/data/tasks.json'
        }
    }
});

export default {
    project,

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

}
