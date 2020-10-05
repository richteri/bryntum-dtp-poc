/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Grid/feature/experimental/ExcelExporter.js';
import Button from '../../lib/Core/widget/Button.js';
import '../../lib/Gantt/column/AllColumns.js';
import ObjectHelper from '../../lib/Core/helper/ObjectHelper.js';

new Button({
    type        : 'button',
    text        : 'Export',
    ref         : 'excelExportBtn',
    color       : 'b-blue b-raised',
    insertFirst : document.getElementById('tools') || document.body,
    onAction    : () => {
        const filename = gantt.project.taskStore.first && gantt.project.taskStore.first.name;
        gantt.features.excelExporter.export({
            filename
        });
    }
});

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    project : project,

    features : {
        excelExporter : {
            // Choose the date format for date fields
            dateFormat : 'YYYY-MM-DD HH:mm'
        }
    },

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'effort' },
        { type : 'resourceassignment' },
        { type : 'percentdone', width : 70 },
        {
            type  : 'predecessor',
            width : 112
        },
        {
            type  : 'successor',
            width : 112
        },
        { type : 'schedulingmodecolumn' },
        { type : 'calendar' },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'addnew' }
    ]
});

project.load();
