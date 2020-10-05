/* globals requirejs */

requirejs.config({
    paths : {
        'gantt' : '../../../build/gantt.umd'
    }
});

requirejs(['gantt'], function(bryntum) {
    const project = new bryntum.ProjectModel({
        transport : {
            load : {
                url : '../_datasets/launch-saas.json'
            }
        }
    });

    new bryntum.Gantt({
        adopt : 'container',

        project,

        columns : [
            { type : 'name', field : 'name', text : 'Name', width : 250 }
        ],

        height : 385
    });

    // expose bryntum namespace to window, to make testing easier
    window.bryntum.gantt = bryntum;

    project.load();
});
