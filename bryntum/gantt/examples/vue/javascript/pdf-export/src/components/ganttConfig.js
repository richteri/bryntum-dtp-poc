/**
 * Gantt configuration
 */

/*  */

import { ProjectModel, Task } from 'bryntum-gantt';

const ganttConfig = {

    startDate : '2019-01-10 00:00',

    project : new ProjectModel({
        // Let the Project know we want to use our own Task model with custom fields / methods
        taskModelClass : Task,
        autoLoad  : true,
        transport      : {
            load : {
                url : 'datasets/launch-saas.json'
            }
        }
    }),

    timeRangesFeature : {
        showHeaderElements  : true,
        showCurrentTimeLine : true
    },

    pdfExportFeature  : {
        exportServer : 'http://localhost:8080',

        // Development config
        translateURLsToAbsolute : 'http://localhost:8081',
        clientURL               : 'http://localhost:8081',
        // For production replace with this one. See README.md for explanation
        // translateURLsToAbsolute : 'http://localhost:8080/resources/', // Trailing slash is important
        keepPathName            : false
    }

};

export default ganttConfig;

