import { Gantt, ProjectModel } from '../../../build/gantt.module.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

new Gantt({
    adopt : 'container',

    project : project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],

    height : 385
});

project.load();
