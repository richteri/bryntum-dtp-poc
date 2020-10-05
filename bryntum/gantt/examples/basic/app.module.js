import { Gantt, ProjectModel, Toast, EffectResolutionResult } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

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
