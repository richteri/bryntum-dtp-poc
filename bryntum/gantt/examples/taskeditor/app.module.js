import { BryntumWidgetAdapterRegister, Combo, Grid, Gantt, ProjectModel, TaskModel } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';

const baseColors = [
    'maroon', 'red', 'orange', 'yellow',
    'olive', 'green', 'purple', 'fuchsia',
    'lime', 'teal', 'aqua', 'blue', 'navy',
    'black', 'gray', 'silver', 'white'
];

class ColorField extends Combo {
    static get type() {
        return 'colorfield';
    }

    static get defaultConfig() {
        return {
            clearable : true,
            items     : baseColors,
            picker    : {
                cls     : 'b-color-picker-container',
                itemCls : 'b-color-picker-item',
                itemTpl : item => `<div style="background-color:${item.id}"></div>`
            }
        };
    }
}

BryntumWidgetAdapterRegister.register(ColorField.type, ColorField);


/**
 * @module FilesTab
 */

/**
 * @internal
 */
class FilesTab extends Grid {

    static get type() {
        return 'filestab';
    }

    static get defaultConfig() {
        return {
            title    : 'Files',
            defaults : {
                labelWidth : 200
            },
            columns : [{
                text     : 'Files attached to task',
                field    : 'name',
                type     : 'template',
                template : data => `<i class="b-fa b-fa-fw b-fa-${data.record.data.icon}"></i>${data.record.data.name}`
            }]
        };
    }

    loadEvent(eventRecord) {
        let files = [];

        for (let i = 0; i < Math.random() * 10; i++) {
            const nbr = Math.round(Math.random() * 5);

            switch (nbr) {
                case 1:
                    files.push({
                        name : `Image${nbr}.pdf`,
                        icon : 'image'
                    });
                    break;
                case 2:
                    files.push({
                        name : `Charts${nbr}.pdf`,
                        icon : 'chart-pie'
                    });
                    break;
                case 3:
                    files.push({
                        name : `Spreadsheet${nbr}.pdf`,
                        icon : 'file-excel'
                    });
                    break;
                case 4:
                    files.push({
                        name : `Document${nbr}.pdf`,
                        icon : 'file-word'
                    });
                    break;
                case 5:
                    files.push({
                        name : `Report${nbr}.pdf`,
                        icon : 'user-chart'
                    });
                    break;
            }
        }

        this.store.data = files;
    }
}

BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab);
/* eslint-disable no-unused-vars */

class MyModel extends TaskModel {
    static get fields() {
        return [
            { name : 'deadline', type : 'date' },
            { name : 'color' }
        ];
    }
}

const project = window.project = new ProjectModel({
    taskModelClass : MyModel,
    transport      : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    features : {
        taskEdit : {
            editorConfig : {
                height     : '37em',
                extraItems : {
                    generaltab : [
                        {
                            html    : '',
                            dataset : {
                                text : 'Custom fields'
                            },
                            cls  : 'b-divider',
                            flex : '1 0 100%'
                        },
                        {
                            type  : 'datefield',
                            ref   : 'deadlineField',
                            name  : 'deadline',
                            label : 'Deadline',
                            flex  : '1 0 50%',
                            cls   : 'b-inline'
                        },
                        {
                            type  : 'colorfield',
                            ref   : 'colorField',
                            name  : 'color',
                            label : 'Color',
                            flex  : '1 0 50%',
                            cls   : 'b-inline'
                        }
                    ]
                }
            },
            tabsConfig : {
                // change title of General tab
                generaltab : {
                    title : 'Common'
                },

                // remove Notes tab
                notestab : false,

                // add custom Files tab
                filestab : { type : 'filestab' }
            }
        }
    },

    taskRenderer : ({ taskRecord, tplData }) => {
        if (taskRecord.color) {
            tplData.style += `background-color:${taskRecord.color}`;
        }
    },

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 },
        { type : 'date', field : 'deadline', text : 'Deadline' }
    ],

    project
});

project.load();
