import { Gantt, ProjectModel, WidgetHelper } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const statusDate = new Date(2019, 0, 27);

WidgetHelper.append([
    {
        type      : 'checkbox',
        label     : 'Show project line',
        checked   : true,
        cls       : 'b-bright',
        listeners : {
            change : ({ checked }) => gantt.features.progressLine.disabled = !checked
        }
    },
    {
        type      : 'datefield',
        label     : 'Project status date',
        value     : statusDate,
        step      : '1d',
        cls       : 'b-bright b-statusdate',
        listeners : {
            change : ({ value }) => {
                gantt.features.progressLine.statusDate = value;
            }
        }
    }

], { insertFirst : document.getElementById('tools') || document.body });

const gantt = new Gantt({
    adopt : 'container',

    startDate : '2019-01-08',
    endDate   : '2019-04-01',

    project,

    features : {
        progressLine : { statusDate }
    },

    columns : [
        { type : 'name', width : 250 }
    ],

    viewPreset : 'weekAndDayLetter'
});

project.load();
