/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Button from '../../lib/Core/widget/Button.js';
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Gantt/column/AllColumns.js';
import Task from './lib/Task.js';

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
