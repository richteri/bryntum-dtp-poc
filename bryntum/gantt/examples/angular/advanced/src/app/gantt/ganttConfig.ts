/**
 * Gantt configuration export
 */

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { AssignmentModel } from 'bryntum-gantt/gantt.umd.js';

const imgFolderPath = 'assets/images/users/';

const ganttConfig = {
    startDate               : '2019-01-12',
    endDate                 : '2019-03-24',
    resourceImageFolderPath : 'assets/images/users/',
    columns                 : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'resourceassignment', width : 120, showAvatars : true },
        { type : 'percentdone', showCircle : true, width : 70 },
        {
            type  : 'predecessor',
            width : 112
        },
        {
            type  : 'successor',
            width : 112
        },
        { type : 'schedulingmodecolumn' },
        { type : 'calendar' },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'statuscolumn' },
        {
            type  : 'date',
            text  : 'Deadline',
            field : 'deadline'
        },
        { type : 'addnew' }
    ],

    subGridConfigs : {
        locked : {
            flex : 3
        },
        normal : {
            flex : 4
        }
    },

    columnLines : false,

    features : {
        rollups : {
            disabled : true
        },
        baselines : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 0, 25)
        },
        taskContextMenu : {
            // Our items is merged with the provided defaultItems
            // So we add the provided convertToMilestone option.
            items : {
                convertToMilestone : true
            },
            processItems({ taskRecord, items }) {
                if (taskRecord.isMilestone) {
                    items.convertToMilestone = false;
                }
            }
        },
        filter         : true,
        dependencyEdit : true,
        timeRanges     : {
            showCurrentTimeLine : true
        },
        labels : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }
};

export default ganttConfig;
