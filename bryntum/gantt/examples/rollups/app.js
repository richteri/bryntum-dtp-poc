/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/column/WBSColumn.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Gantt/feature/TaskEdit.js';
import '../../lib/Gantt/feature/Rollups.js';
import '../../lib/Gantt/column/RollupColumn.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : 'data/tasks.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    project : project,

    columns : [
        { type : 'wbs' },
        { type : 'name' },
        { type : 'rollup' }
    ],

    viewPreset : 'monthAndYear',

    // Allow extra space for rollups
    rowHeight : 50,
    barMargin : 11,

    columnLines : true,

    features : {
        rollups : true
    }
});

WidgetHelper.append([
    {
        cls        : 'b-blue b-bright',
        type       : 'checkbox',
        text       : 'Show Rollups',
        checked    : true,
        toggleable : true,
        onAction({ checked }) {
            gantt.features.rollups.disabled = !checked;
        }
    }
], {
    insertFirst : document.getElementById('tools') || document.body
});

project.load();
