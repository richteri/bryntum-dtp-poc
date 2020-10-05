/* eslint-disable */

Ext.define('App.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.main-view',

    controller: 'main',
    layout: 'hbox',
    title: 'Bryntum Gantt inside an Ext JS Modern Panel',
    id: 'main-view',

    viewModel: {
        data: {
            rowHeight: 45
        }
    },

    items: [
        {
            xtype: 'panel',
            title: 'Ext JS Modern List',
            width: 250,
            cls: 'ext-list',
            layout: 'fit',
            resizable: {
                split: true,
                edges: 'east'
            },
            items: {
                xtype: 'list',
                itemTpl: '<div class="contact">{firstName} <b>{lastName}</b></div>',
                grouped: true,

                store: {
                    grouper: {
                        property: 'lastName'
                    },

                    data: [
                        { firstName: 'Peter', lastName: 'Venkman' },
                        { firstName: 'Raymond', lastName: 'Stantz' },
                        { firstName: 'Egon', lastName: 'Spengler' },
                        { firstName: 'Fred', lastName: 'Spengler' },
                        { firstName: 'Winston', lastName: 'Zeddemore' },
                        { firstName: 'Ralph', lastName: 'Zeddemore' }
                    ]
                }
            }
        },
        {
            title: 'Bryntum Gantt',
            xtype: 'ganttpanel',
            reference: 'ganttPanel',
            flex: 1,
            startDate : new Date(2019, 0, 6),
            project: new bryntum.gantt.ProjectModel({
                autoLoad: true,
                transport: {
                    load: {
                        url: '../_datasets/launch-saas.json'
                    }
                }
            }),
            header: {
                items: [{
                    xtype: 'spinnerfield',
                    label: 'Row height',
                    width: '12.5em',
                    bind: '{rowHeight}',
                    minValue: 20
                }, {
                    xtype: 'button',
                    iconCls: 'b-fa b-fa-plus',
                    text: 'Add Task',
                    ui: 'action',
                    handler: 'addTask',
                    cls: 'b-add-task'
                }]
            },

            bind: {
                rowHeight: '{rowHeight}'
            },

            features : {
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
            },

            columns : [
                { type : 'wbs' },
                { type : 'name', width : 250 },
                { type : 'startdate' },
                { type : 'duration' },
                { type : 'percentdone', width : 70 },
                {
                    type  : 'successor',
                    width : 112
                },
                { type : 'schedulingmodecolumn' },
                { type : 'calendar' },
                { type : 'constrainttype' },
                { type : 'constraintdate' },
                {
                    type  : 'date',
                    text  : 'Deadline',
                    field : 'deadline'
                },
                { type : 'addnew' }
            ]
        }
    ]
});
