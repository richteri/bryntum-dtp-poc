import shared from '../../../../_shared/shared.module.js';
/* eslint-disable no-unused-vars, import/extensions */


const project = window.project = new ProjectModel({
    taskModelClass       : Task,
    dependencyModelClass : Dependency,
    resourceModelClass   : Resource,
    assignmentModelClass : Assignment,
    calendarModelClass   : Calendar,
    
    transport : {
        load : {
            url       : 'ganttcrud/load',
            paramName : 'q'
        },
        sync : {
            url : 'ganttcrud/sync'
        }
    },
    
    listeners : {
        syncfail : ({ response, responseText }) => {
            if (!response || !response.success) {
                backendTools.serverError('Could not sync the data with the server.', responseText);
            }
        }
    },
    
    autoLoad : false,
    autoSync : false
});

const gantt = window.gantt = new Gantt({
    project      : project,
    weekStartDay : 1,
    startDate    : '2012-08-28',
    endDate      : '2012-11-05',
    columns      : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        { type : 'resourceassignment', width : 120 },
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
        { type : 'percentdone', showCircle : true, text : '%', width : 70 },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'deadlinedate' },
        { type : 'addnew' }
    ],
    
    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },
    
    columnLines : false,
    
    features : {
        indicators : {
            items : {
                deadline       : true,
                earlyDates     : false,
                lateDates      : false,
                constraintDate : false
            }
        },
        rollups : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 1, 10)
        },
        taskContextMenu : {
            // Our items is merged with the provided defaultItems
            // So we add the provided convertToMilestone option.
            items : {
                convertToMilestone : true
            },
            processItems({ taskRecord, items }) {
                if (taskRecord.isMilestone) {
                    items.convertToMilestone = false;
                }
            }
        },
        filter         : true,
        dependencyEdit : true,
        timeRanges     : {
            showCurrentTimeLine : true
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

// Add Save / Load / Reset buttons toolbar and server data load/sync handlers
const backendTools = new BackendTools(gantt);

new Panel({
    adopt  : 'container',
    layout : 'fit',
    items  : [
        gantt
    ],
    tbar : new GanttToolbar({ gantt })
});

// console.time("load data");
project.load().then(() => {
    // console.timeEnd("load data");
    const stm = gantt.project.stm;
    
    stm.enable();
    stm.autoRecord = true;
    
    // let's track scheduling conflicts happened
    project.on('schedulingconflict', context => {
        // show notification to user
        Toast.show('Scheduling conflict has happened ..recent changes were reverted');
        // as the conflict resolution approach let's simply cancel the changes
        context.continueWithResolutionResult(EffectResolutionResult.Cancel);
    });
}).catch(({ response, responseText }) => {
    
    if (response && response.message) {
        Toast.show({
            html : `${response.message}<br>
                    <b>Please make sure that you've read readme.md file carefully
                    and setup the database connection accordingly.</b>`,
            color   : 'b-red',
            style   : 'color:white',
            timeout : 0
        });
    }
    
});
