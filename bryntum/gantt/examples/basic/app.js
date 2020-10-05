/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import Toast from '../../lib/Core/widget/Toast.js';
import { EffectResolutionResult } from '../../lib/ChronoGraph/chrono/Effect.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    },
    listeners : {
        // let's track scheduling conflicts happened
        schedulingconflict : context => {
            // show notification to user
            Toast.show('Scheduling conflict has happened ..recent changes were reverted');
            // as the conflict resolution approach let's simply cancel the changes
            context.continueWithResolutionResult(EffectResolutionResult.Cancel);
        }
    }
});

new Gantt({
    adopt : 'container',

    project : project,

    columns : [
        { type : 'name', field : 'name', width : 250 }
    ],

    // Custom task content, display task name on child tasks
    taskRenderer({ taskRecord }) {
        if (taskRecord.isLeaf && !taskRecord.isMilestone) {
            return taskRecord.name;
        }
    }
});

project.load();
