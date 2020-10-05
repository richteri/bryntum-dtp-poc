import { ResourceModel } from '../../node_modules/bryntum-gantt/gantt.module.js';

export default class Resource extends ResourceModel {
    static get fields() {
        return [
            { name : 'Id' },
            { name : 'name', dataSource : 'Name' },
            { name : 'calendar', dataSource : 'CalendarId', serialize : calendar => calendar && calendar.id }
        ];
    }
}

Resource.idField = 'Id';
