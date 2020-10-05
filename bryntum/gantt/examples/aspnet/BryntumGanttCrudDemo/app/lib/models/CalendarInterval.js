import { CalendarIntervalModel } from '../../node_modules/bryntum-gantt/gantt.module.js';

export default class CalendarInterval extends CalendarIntervalModel {
    static get fields() {
        return [
            { name : 'Id' },
            { name : 'recurrentStartDate', dataSource : 'RecurrentStartDate' },
            { name : 'recurrentEndDate', dataSource : 'RecurrentEndDate' },
            { name : 'startDate', dataSource : 'StartDate', type : 'date' },
            { name : 'endDate', dataSource : 'EndDate', type : 'date' },
            { name : 'isWorking', dataSource : 'IsWorking', defaultValue : false },
            { name : 'cls', dataSource : 'Cls' }
        ];
    }
}

CalendarInterval.idField = 'Id';
