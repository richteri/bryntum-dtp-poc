import { TaskModel, Button, Gantt, ProjectModel } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';

// Extend default Task model class to provide additional CSS class
class Task extends TaskModel {

    get cls() {
        // adds 'b-critical' CSS class to critical tasks
        return Object.assign(super.cls, { 'b-critical' : this.critical });
    }

}
/* eslint-disable no-unused-vars */

new Button({
    color       : 'b-red b-raised',
    icon        : 'b-fa-square',
    pressedIcon : 'b-fa-check-square',
    ref         : 'criticalPathsButton',
    text        : 'Highlight Critical Paths',
    toggleable  : true,
    pressed     : true,
    insertFirst : document.getElementById('tools') || document.body,
    onAction() {
        // toggle critical paths feature disabled/enabled state
        gantt.features.criticalPaths.disabled = !gantt.features.criticalPaths.disabled;
    }
});

const project = window.project = new ProjectModel({
    taskModelClass : Task,
    transport      : {
        load : {
            url : '../_datasets/criticalpaths.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    project,

    columns : [
        { type : 'name' },
        { type : 'earlystartdate' },
        { type : 'earlyenddate' },
        { type : 'latestartdate' },
        { type : 'lateenddate' },
        { type : 'totalslack' }
    ],

    features : {
        // Critical paths features is always included, but starts disabled by default
        criticalPaths : {
            disabled : false
        }
    }
});

project.load();
