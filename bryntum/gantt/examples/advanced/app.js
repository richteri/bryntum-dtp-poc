/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import Panel from '../../lib/Core/widget/Panel.js';
import '../../lib/Gantt/column/AllColumns.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import Task from './lib/Task.js';
import Toast from '../../lib/Core/widget/Toast.js';
import { EffectResolutionResult } from '../../lib/ChronoGraph/chrono/Effect.js';
import '../../lib/Gantt/feature/Labels.js';
import '../../lib/Scheduler/feature/TimeRanges.js';
import '../../lib/Gantt/feature/Baselines.js';
import '../../lib/Gantt/feature/DependencyEdit.js';
import '../../lib/Grid/feature/Filter.js';
import '../../lib/Gantt/feature/TaskEdit.js';
import '../../lib/Gantt/feature/ProjectLines.js';
import '../../lib/Gantt/feature/ProgressLine.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Gantt/feature/Rollups.js';
import GanttToolbar from './lib/GanttToolbar.js';
import '../../lib/Gantt/column/PercentDoneColumn.js';
import './lib/StatusColumn.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';

const project = new ProjectModel({

    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass : Task,
    transport      : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    project : project,

    startDate               : '2019-01-12',
    endDate                 : '2019-03-24',
    resourceImageFolderPath : '../_shared/images/users/',
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
});

const panel = new Panel({
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
});
