import { Gantt, ProjectModel, DateHelper, Button } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/constraints.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    features : {
        // Enabling and configuring the Indicators feature
        indicators : {
            items : {
                // Early start/end dates indicator disabled
                earlyDates : false,

                // Custom indicator added
                beer : taskRecord =>  taskRecord.name.startsWith('C') ? {
                    startDate : DateHelper.add(taskRecord.endDate, 2, 'day'),
                    cls       : 'beer',
                    iconCls   : 'b-fa b-fa-beer',
                    name      : 'Post-task celebration beer'
                } : null
            }
        }
    },

    // Higher row and some more margin to accommodate the indicators
    rowHeight      : 50,
    resourceMargin : 15,

    // Initial width for the locked region
    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    // Columns relevant to the indicators
    columns : [
        { type : 'name' },
        { type : 'constraintdate', width : 100 },
        { type : 'constrainttype' },
        { type : 'deadlinedate' }
    ],

    project
});

// Handles toggling indicators
function onToggle({ item, checked }) {
    gantt.features.indicators.items[item.ref] = checked;
}

// Button showing a menu, to toggle indicators
new Button({
    color : 'b-orange b-raised',
    icon  : 'b-fa-bars',
    ref   : 'criticalPathsButton',
    text  : 'L{Indicators.Indicators}',
    menu  : [
        { ref : 'earlyDates', text : 'L{Indicators.earlyDates}', checked : false, onToggle },
        { ref : 'lateDates', text : 'L{Indicators.lateDates}', checked : true, onToggle },
        { ref : 'deadlineDate', text : 'L{Indicators.deadlineDate}', checked : true, onToggle },
        { ref : 'constraintDate', text : 'L{Indicators.constraintDate}', checked : true, onToggle },
        { ref : 'beer', text : 'Beer', checked : true, onToggle }
    ],
    insertFirst : document.getElementById('tools') || document.body
});

project.load();
