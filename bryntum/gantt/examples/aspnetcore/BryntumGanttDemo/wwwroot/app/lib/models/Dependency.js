import { DependencyModel } from '../../node_modules/bryntum-gantt/gantt.module.js';

export default class Dependency extends DependencyModel {
    static get fields() {
        return [
            { name : 'Id' },
            { name : 'lag', dataSource : 'Lag' },
            { name : 'lagUnit', dataSource : 'LagUnit' },
            { name : 'type', dataSource : 'Type' },
            { name : 'fromEvent', dataSource : 'From', serialize : r => r.id },
            { name : 'toEvent', dataSource : 'To', serialize : r => r.id },
            { name : 'cls', dataSource : 'Cls' }
        ];
    }
}

Dependency.idField = 'Id';
