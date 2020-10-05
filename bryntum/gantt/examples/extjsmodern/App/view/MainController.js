/* eslint-disable */
Ext.define('App.view.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    requires: [
        'Bryntum.GanttPanel'
    ],

    async addTask(startDate, resourceRecord) {
        const
            gantt = this.lookupReference('ganttPanel').getGantt(),
            task = new bryntum.gantt.TaskModel({
            name: 'New Task',
            duration: 1,
            effort : 0,
            startDate : gantt.project.startDate
        });

        gantt.project.appendChild(task);
        
        // run propagation to calculate new task fields
        await gantt.project.propagate();

        await gantt.scrollTaskIntoView(task);

        gantt.features.taskEdit.editTask(task);
    }
});
