import { Gantt, ProjectModel } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const tools = document.getElementById('tools') || document.body,
    label = document.createElement('label');
label.className = 'responsive-size';
tools.insertBefore(label, tools.firstElementChild);

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

    startDate : new Date(2019, 0, 6),

    columns : [
        {
            type  : 'name',
            field : 'name',
            width : 250
        },
        {
            type             : 'startdate',
            responsiveLevels : {
                small  : { hidden : true },
                medium : { hidden : true },
                large  : { hidden : false }
            }
        }
    ],

    features : {
        labels : {
            left : {
                field : 'name'
            }
        }
    },

    // Breakpoints at which configs should change
    responsiveLevels : {
        small : {
            // When below 500 px wide, apply "small"
            levelWidth : 500,
            // With these configs
            tickWidth  : 15,
            rowHeight  : 40,

            collapsed : {
                locked : true
            }
        },
        medium : {
            // When below 800 px wide, apply "medium"
            levelWidth : 800,
            // With these configs
            tickWidth  : 20,
            rowHeight  : 40,

            collapsed : {
                locked : false
            }
        },
        large : {
            // For any larger width, apply "large"
            levelWidth : '*',
            // With these configs
            tickWidth  : 25,
            rowHeight  : 50,

            collapsed : {
                locked : false
            }
        }
    },

    listeners : {
        // Function called when reaching a responsive breakpoint (level)
        responsive({ level }) {
            label.innerHTML = '<span>Responsive level: </span>' + level;
        }
    }
});

project.load();
