import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import Panel from '../../lib/Core/widget/Panel.js';
import '../../lib/Gantt/column/AllColumns.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import Task from '../advanced/lib/Task.js';
import Toast from '../../lib/Core/widget/Toast.js';
import { EffectResolutionResult } from '../../lib/ChronoGraph/chrono/Effect.js';
import '../../lib/Gantt/feature/Labels.js';
import '../../lib/Scheduler/feature/TimeRanges.js';
import '../../lib/Gantt/feature/DependencyEdit.js';
import '../../lib/Grid/feature/Filter.js';
import '../../lib/Gantt/feature/TaskEdit.js';
import '../../lib/Gantt/feature/ProjectLines.js';
import '../../lib/Gantt/feature/ProgressLine.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Gantt/feature/Rollups.js';
import GanttToolbar from '../advanced/lib/GanttToolbar.js';
import '../advanced/lib/StatusColumn.js';
import BackendTools from './lib/BackendTools.js';

const project = window.project = new ProjectModel({
    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass : Task,
    transport      : {
        load : {
            url       : 'php/load.php',
            paramName : 'q'
        },
        sync : {
            url : 'php/sync.php'
        }
    },

    listeners : {
        beforeSend : ({ params }) => {
            // can be used to dynamically add arbitrary parameters to data load/sync requests
            // for example here we add "config" parameter (we use it for testing purposes)
            const queryString = new URLSearchParams(window.location.search);
            params.config = queryString.get('config') || '';
        },
        syncfail : ({ response, responseText }) => {
            if (!response || !response.success) {
                backendTools.serverError('Could not sync the data with the server.', responseText);
            }
        }
    }
});

const gantt = new Gantt({
    project : project,

    startDate               : '2019-01-12',
    endDate                 : '2019-03-24',
    resourceImageFolderPath : '../_shared/images/users/',

    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        { type : 'resourceassignment', showAvatars : true, width : 120 },
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
        { type : 'percentdone', showCircle : true, text : '%', width : 70 },
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
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    columnLines : false,

    features : {
        rollups : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 1, 10)
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
});

// Add Save / Load / Reset buttons toolbar and server data load/sync handlers
const backendTools = new BackendTools(gantt);

new Panel({
    adopt  : 'container',
    layout : 'fit',
    items  : [
        gantt
    ],
    tbar : new GanttToolbar({ gantt })
});

// console.time("load data");
project.load().then(() => {
    // console.timeEnd("load data");
    const stm = gantt.project.stm;

    stm.enable();
    stm.autoRecord = true;

    // let's track scheduling conflicts happened
    project.on('schedulingconflict', context => {
        // show notification to user
        Toast.show('Scheduling conflict has happened ..recent changes were reverted');
        // as the conflict resolution approach let's simply cancel the changes
        context.continueWithResolutionResult(EffectResolutionResult.Cancel);
    });
}).catch(({ response, responseText }) => {

    if (response && response.message) {
        Toast.show({
            html : `${response.message}<br>
                    <b>Please make sure that you've read readme.md file carefully
                    and setup the database connection accordingly.</b>`,
            cls     : 'php-demo-error-message',
            timeout : 0
        });
    }

});
