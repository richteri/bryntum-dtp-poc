// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { ProjectModel } from 'bryntum-gantt/gantt.umd.js';

const project = new ProjectModel({
    transport : {
        load : {
            url : 'assets/data/launch-saas.json'
        }
    },
    autoLoad  : true
})

export default {
    columns  : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],
    features : {
        pdfExport : {
            exportServer            : 'http://localhost:8080',

            // Development config
            translateURLsToAbsolute : 'http://localhost:4200',

            // For production replace with this one. See README.md for explanation
            // translateURLsToAbsolute : 'http://localhost:8080/resources/', // Trailing slash is important
            keepPathName            : false
        }
    },
    project
}

