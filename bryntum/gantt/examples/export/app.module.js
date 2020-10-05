import { Gantt, ProjectModel, WidgetHelper, DateHelper } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

//<debug>
// disable certain debugging code to make record generation faster
window.bryntum.DISABLE_DEBUG = true;
//</debug>

const project = new ProjectModel({
    autoLoad  : true,
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

WidgetHelper.append([
    {
        ref   : 'exportButton',
        type  : 'button',
        color : 'b-orange b-raised',
        icon  : 'b-fa b-fa-file-export',
        text  : 'Export',
        onClick() {
            gantt.features.pdfExport.showExportDialog();
        }
    }
], {
    insertFirst : document.getElementById('tools') || document.body,
    cls         : 'b-bright'
});

const headerTpl = ({ currentPage, totalPages }) => `
    <div class="demo-export-header">
        <img src="resources/logo.png"/>
        <dl>
            <dt>Date: ${DateHelper.format(new Date(), 'll LT')}</dt>
            <dd>${totalPages ? `Page: ${currentPage + 1}/${totalPages}` : ''}</dd>
        </dl>
    </div>`;

const footerTpl = () => '<div class="demo-export-footer"><h3>© 2020 Bryntum AB</h3></div>';

const gantt = new Gantt({
    // We don't need to export demo header
    appendTo : 'container',

    emptyText : '',

    project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 200 },
        { type : 'startdate', text : 'Start date' },
        { type : 'duration', text : 'Duration' }
    ],

    columnLines : false,

    features : {
        pdfExport : {
            exportServer            : 'http://localhost:8080/',
            translateURLsToAbsolute : 'http://localhost:8080/resources/',
            headerTpl,
            footerTpl
        }
    }
});
