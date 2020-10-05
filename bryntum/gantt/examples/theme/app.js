/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/column/AllColumns.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Gantt/feature/Labels.js';
import '../../lib/Scheduler/feature/TimeRanges.js';
import GlobalEvents from '../../lib/Core/GlobalEvents.js';
import '../../lib/Grid/feature/Filter.js';
import '../../lib/Gantt/feature/ProjectLines.js';
import '../../lib/Gantt/feature/TaskEdit.js';
import Panel from '../../lib/Core/widget/Panel.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';
import DomHelper from '../../lib/Core/helper/DomHelper.js';

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    project : project,

    columns : [
        { type : 'wbs' },
        { type : 'name' }
    ],

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    features : {
        columnLines    : false,
        filter         : true,
        timeRanges     : {
            showHeaderElements : true
        },
        labels : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }
});

const panel = new Panel({
    adopt   : 'container',
    layout  : 'fit',
    items    : [
        gantt
    ],
    tbar : {
        items : [
            {
                type : 'widget',
                cls  : 'label',
                html : 'Theme:'
            },
            {
                type  : 'buttonGroup',
                items : ['Stockholm', 'Light', 'Dark', 'Material', 'Default'].map(name => {
                    return {
                        id           : name.toLowerCase(),
                        color        : 'b-blue',
                        text         : name,
                        pressed      : DomHelper.themeInfo.name === name,
                        enableToggle : true,
                        toggleGroup  : 'theme',
                        onAction({ source: button }) {
                            DomHelper.setTheme(button.text);
                        }
                    };
                })
            }
        ]
    }
});

GlobalEvents.on({
    theme: function theme(themeChangeEvent) {
        WidgetHelper.getById(themeChangeEvent.theme).pressed = true;
    }
});

project.load();
