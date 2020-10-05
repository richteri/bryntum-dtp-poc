import { CalendarModel } from '../../node_modules/bryntum-gantt/gantt.module.js';
import CalendarInterval from './CalendarInterval.js';

export default class Calendar extends CalendarModel {
    static get fields() {
        return [
            { name : 'Id' },
            { name : 'name', dataSource : 'Name' },
            { name : 'daysPerMonth', dataSource : 'DaysPerMonth' },
            { name : 'daysPerWeek', dataSource : 'DaysPerWeek' },
            { name : 'hoursPerDay', dataSource : 'HoursPerDay' },
            { name : 'intervals', dataSource : 'Intervals' },
            { name : 'children', dataSource : 'children' }
        ];
    }
    
    static get defaultConfig() {
        return {
            calendarIntervalModelClass : CalendarInterval
        };
    }
}

Calendar.idField = 'Id';
