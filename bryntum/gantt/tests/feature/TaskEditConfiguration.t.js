import '../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';
import '../../lib/Gantt/column/AllColumns.js';
import Grid from '../../lib/Grid/view/Grid.js';
import BryntumWidgetAdapterRegister from '../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should support configuring extra widgets for each tab', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskEdit : {
                    editorConfig : {
                        height     : '40em',
                        extraItems : {
                            generaltab      : [{ type : 'button', text : 'general' }],
                            successorstab   : [{ type : 'button', text : 'successors' }],
                            predecessorstab : [{ type : 'button', text : 'predecessors' }],
                            resourcestab    : [{ type : 'button', text : 'resources' }],
                            advancedtab     : [{ type : 'button', text : 'advanced' }],
                            notestab        : [{ type : 'button', text : 'notes' }]
                        }
                    }
                }
            }
        });

        const steps = [];

        ['general', 'successors', 'predecessors', 'resources', 'advanced', 'notes'].forEach((text, i) => {
            steps.push(
                { click : `.b-tabpanel-tab:nth-child(${i + 1})` },
                { waitForSelector : `.b-${text}tab .b-button:contains(${text})` }
            );
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.editTask(gantt.taskStore.getById(11));
            },
            steps
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8785
    t.it('Should support configuring listeners', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskEdit : {
                    editorConfig : {
                        listeners : {
                            beforeClose : () => {
                            }
                        }
                    }
                }
            }
        });

        const editor = gantt.features.taskEdit.getEditor();

        t.ok(editor.listeners.cancel, 'Cancel listener is present');
        t.ok(editor.listeners.delete, 'Delete listener is present');
        t.ok(editor.listeners.save, 'Save listener is present');
        t.ok(editor.listeners.requestpropagation, 'RequestPropagation listener is present');
        t.ok(editor.listeners.beforeclose, 'BeforeClose listener is present');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8885
    t.it('tabsConfig is not taken into account by TaskEditor', async t => {
        // #region FilesTab
        class FilesTab extends Grid {
            static get $name() {
                return 'FilesTab';
            }

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
                        text       : 'Files attached to task',
                        field      : 'name',
                        htmlEncode : false,
                        renderer   : ({ record }) => `<i class="b-fa b-fa-fw b-fa-${record.data.icon}"></i>${record.data.name}`
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
        // #endregion FilesTab

        // #region features config
        const features = {
            taskTooltip : false,
            taskEdit    : {
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
        };
        // #endregion features config

        gantt = t.getGantt({
            appendTo : document.body,
            features : features
        });

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            {
                waitForSelector : '.b-taskeditor',
                desc            : 'Task editor appeared'
            },

            {
                waitForSelector : '.b-tabpanel-tab-title:textEquals(Common)',
                desc            : 'Renamed General -> Common tab appeared'
            },
            {
                waitForSelectorNotFound : '.b-tabpanel-tab-title:textEquals(Notes)',
                desc                    : 'Notes tab is removed'
            },

            next => {
                t.ok(gantt.taskEdit.editor.widgetMap.deadlineField, 'Custom Deadline field appeared');
                next();
            },

            {
                waitForSelector : '.b-tabpanel-tab :textEquals(Files)',
                desc            : 'Files tab appeared'
            },

            { click : '.b-tabpanel-tab :textEquals(Files)' },

            {
                waitFor : () => gantt.taskEdit.editor.widgetMap.tabs.activeItem.$name === 'FilesTab',
                desc    : 'Files tab active'
            }
        );

    });
});
