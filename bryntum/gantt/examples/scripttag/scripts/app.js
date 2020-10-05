const project = new bryntum.gantt.ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

new bryntum.gantt.Gantt({
    adopt : 'container',

    project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],

    height : 385
});

project.load();
