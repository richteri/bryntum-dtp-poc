/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import '../../lib/Core/widget/FilePicker.js';
import Importer from './lib/Importer.js';
import Toast from '../../lib/Core/widget/Toast.js';

const
    project = window.project = new ProjectModel({
        transport : {
            load : {
                url : '../_datasets/launch-saas.json'
            }
        }
    }),
    importer         = new Importer(project),
    [input, sendBtn] = WidgetHelper.append([
        {
            type         : 'filepicker',
            text         : 'File',
            buttonConfig : {
                cls : 'b-blue b-raised'
            },
            listeners : {
                change : ({ files }) => {
                    if (files.length) {
                        sendBtn.enable();
                    }
                    else {
                        sendBtn.disable();
                    }
                },
                clear : () => {
                    sendBtn.disable();
                }
            }
        },
        {
            type     : 'button',
            text     : 'Import data',
            cls      : 'b-orange b-raised b-load-button',
            disabled : true,
            onClick  : () => {
                const files = input.files;

                if (files) {
                    const formData = new FormData();
                    formData.append('mpp-file', files[0]);

                    gantt.maskBody('Importing project ...');

                    AjaxHelper.post('php/load.php', formData, { parseJson : true })
                        .then(async response => {
                            const json = response.parsedJson;
                            if (json.success && json.data) {
                                importer.importData(json.data);
                                gantt.zoomToFit();
                                await project.propagate();
                                input.clear();
                                gantt.unmaskBody();
                                Toast.show('File imported successfully!');
                            }
                            else {
                                onError(`Import error: ${json.msg}`);
                            }
                        }).catch(response => {
                            onError(`Import error: ${response.error || response.message}`);
                        });
                }
            }
        }
    ], { insertFirst : document.getElementById('tools') || document.body });

const gantt = new Gantt({
    adopt : 'container',

    startDate : '2019-01-08',
    endDate   : '2019-04-01',

    project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],

    viewPreset : 'weekAndDayLetter'
});

function onError(text) {
    gantt.unmaskBody();
    console.error(text);

    Toast.show({
        html    : text,
        color   : 'b-red',
        style   : 'color:white',
        timeout : 3000
    });
}

project.load();
