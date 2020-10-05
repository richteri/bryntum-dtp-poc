import { Gantt, ProjectModel, GlobalEvents, Panel, WidgetHelper, DomHelper } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

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
