// GanttBase is a thinner version of Gantt, that do not include any features by default. Using it makes it
// easier to get a smaller build
import GanttBase from '../../../lib/Gantt/view/GanttBase.js';
import ProjectModel from '../../../lib/Gantt/model/ProjectModel.js';
// Import the features you need (have to name it, otherwise webpack will clean it out in production)
import TaskTooltip from '../../../lib/Gantt/feature/TaskTooltip.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

new GanttBase({
    adopt : document.body,

    project,

    columns : [
        { type : 'name', field : 'name', width : 250 }
    ]
});

project.load();
