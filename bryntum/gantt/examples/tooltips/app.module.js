import { Gantt, ProjectModel, TaskTooltip } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

new Gantt({
    adopt : 'container',

    features : {
        taskTooltip : {
            template(data) {
                const
                    me             = this,
                    { taskRecord } = data;

                // Return the result of the feature's default template, with custom markup appended
                return TaskTooltip.defaultConfig.template.call(me, data) +
                    `<table border="0" cellspacing="0" cellpadding="0">
                        <tr><td>${me.L('Scheduling Mode')}:</td><td>${taskRecord.schedulingMode}</td></tr>
                        <tr><td>${me.L('Calendar')}:</td><td>${taskRecord.calendar.name}</td></tr>
                        <tr><td>${me.L('Critical')}:</td><td>${taskRecord.critical ? me.L('Yes') : me.L('No')}</td></tr>
                    </table>`;
            }
        }
    },

    project : project,

    columns : [
        { type : 'name', field : 'name', width : 250 }
    ]
});

project.load();
