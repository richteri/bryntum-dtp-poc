/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Scheduler/feature/TimeRanges.js';
import Panel from '../../lib/Core/widget/Panel.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';
import Splitter from '../../lib/Core/widget/Splitter.js';

import './lib/TimeRangesGrid.js';

WidgetHelper.append([
    {
        type        : 'button',
        toggleable  : true,
        color       : 'b-blue b-raised',
        text        : 'Show header elements',
        tooltip     : 'Toggles the rendering of time range header elements',
        pressed     : true,
        icon        : 'b-fa-square',
        pressedIcon : 'b-fa-check-square',
        onClick({ source: button }) {
            gantt.features.timeRanges.showHeaderElements = button.pressed;
        }
    }
], { insertFirst : document.getElementById('tools') || document.body });

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/timeranges.json'
        }
    }
});

const gantt = new Gantt({
    flex     : '1 1 auto',
    appendTo : 'main',
    project  : project,

    columns : [
        { type : 'name', field : 'name', width : 250 }
    ],

    features : {
        timeRanges : {
            enableResizing      : true,
            showCurrentTimeLine : false,
            showHeaderElements  : true
        }
    }
});

project.load();

const timeRangeStore = gantt.features.timeRanges.store;

new Splitter({
    appendTo : 'main'
});

new Panel({
    id       : 'timerangesContainer',
    flex     : '0 0 350px',
    layout   : 'fit',
    appendTo : 'main',
    items    : [
        {
            type  : 'timerangesgrid',
            store : timeRangeStore
        }
    ],

    bbar : [
        {
            type    : 'button',
            text    : 'Add',
            icon    : 'b-fa-plus',
            cls     : 'b-green',
            tooltip : 'Add new time range',
            onClick() {
                timeRangeStore.add({
                    name      : 'New range',
                    startDate : new Date(2019, 1, 27),
                    duration  : 5
                });
            }
        }
    ]
});
