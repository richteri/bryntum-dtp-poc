import { Grid, BryntumWidgetAdapterRegister, Gantt, ProjectModel, Panel, WidgetHelper, Splitter } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

class TimeRangesGrid extends Grid {

    static get defaultConfig() {
        return {
            features : {
                stripe : true,
                sort   : 'startDate'
            },

            columns : [
                {
                    text  : 'Time ranges',
                    flex  : 1,
                    field : 'name'
                },
                {
                    type  : 'date',
                    text  : 'Start Date',
                    width : 110,
                    align : 'right',
                    field : 'startDate'
                },
                {
                    type          : 'number',
                    text          : 'Duration',
                    width         : 100,
                    field         : 'duration',
                    min           : 0,
                    instantUpdate : true,
                    renderer      : data => `${data.record.duration} d`
                }]
        };
    }

    construct(config) {
        super.construct(config);

    }
};

BryntumWidgetAdapterRegister.register('timerangesgrid', TimeRangesGrid);
/* eslint-disable no-unused-vars */


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
