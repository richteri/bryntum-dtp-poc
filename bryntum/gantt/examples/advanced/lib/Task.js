import TaskModel from '../../../lib/Gantt/model/TaskModel.js';

// here you can extend our default Task class with your additional fields, methods and logic
export default class Task extends TaskModel {

    static get fields() {
        return [
            { name : 'deadline', type : 'date' }
        ];
    }

    get isLate() {
        return this.deadline && Date.now() > this.deadline;
    }
}
