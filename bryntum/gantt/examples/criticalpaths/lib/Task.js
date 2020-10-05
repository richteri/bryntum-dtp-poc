import TaskModel from '../../../lib/Gantt/model/TaskModel.js';

// Extend default Task model class to provide additional CSS class
export default class Task extends TaskModel {

    get cls() {
        // adds 'b-critical' CSS class to critical tasks
        return Object.assign(super.cls, { 'b-critical' : this.critical });
    }

}
