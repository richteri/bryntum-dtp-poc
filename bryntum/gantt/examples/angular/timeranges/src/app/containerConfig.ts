/**
 * Container configuration file (Gantt, Splitter, Grid)
 */

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { ProjectModel, Gantt } from 'bryntum-gantt/gantt.umd.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : 'assets/data/timeranges.json'
        }
    }
});

const gantt = new Gantt({
  cls  : 'gantt-timeranges',
  project,

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

export default {
    type : 'container',
    namedItems : {
        gantt,
        splitter : {
            type : 'splitter'
        },
        panel : {
            type : 'panel',
            layout : 'fit',
            items : [{
                type : 'grid',
                cls  : 'grid-timeranges',
                store : timeRangeStore,
                columns : [{
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
                }],
                features : {
                    stripe : true,
                    sort   : 'startDate'
                }
            }],
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
        }
    },
    items : {
        gantt: true,
        splitter: true,
        panel : true
    }

};
