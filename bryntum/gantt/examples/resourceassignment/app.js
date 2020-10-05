/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Grid/feature/Group.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import '../../lib/Gantt/column/ResourceAssignmentColumn.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';
import AssignmentField from '../../lib/Gantt/widget/AssignmentField.js';

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 },
        {
            type  : 'resourceassignment',
            width : 250,

            editor : {
                type   : AssignmentField.type,
                picker : {
                    // This config is applied over the provided picker grid's config
                    // Object based configs are merged. The columns, being an array is concatenated
                    // onto the provided column set.
                    grid : {
                        features : {
                            filterBar   : true,
                            group       : 'resource.city',
                            contextMenu : false
                        },
                        columns : [{
                            text       : 'Calendar',
                            field      : 'resource.calendar.name',
                            filterable : false,
                            editor     : false,
                            width      : 85
                        }]
                    }
                }
            }
        }
    ],

    project
});

project.load();
