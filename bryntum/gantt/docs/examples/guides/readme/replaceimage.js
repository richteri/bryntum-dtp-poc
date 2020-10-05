(function() {
    const targetElement = document.querySelector('div[data-file="guides/readme/replaceimage.js"]');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

//START
    const project = window.project = new ProjectModel({
        transport : {
            load : {
                url : 'examples/gantt/load.json'
            }
        }
    });

    const gantt = new Gantt({
        project : project,

        columns : [
            {type : 'wbs'},
            {type : 'name', width : 250},
            {type : 'startdate'},
            {type : 'duration'},
            {type : 'percentdone', width : 70},
            // { type : 'effort', text : 'Effort' },
            {
                type  : 'predecessor',
                width : 112
            },
            {
                type  : 'successor',
                width : 112
            },
            {type : 'schedulingmodecolumn'},
            {type : 'calendar'},
            {type : 'constrainttype'},
            {type : 'constraintdate'},
            {type : 'addnew'}
        ],

        subGridConfigs : {
            locked : {
                flex : 1
            },
            normal : {
                flex : 2
            }
        },

        startDate : '2017-01-09',
        endDate   : '2017-02-13',

        features : {
            columnLines : false,
            filter      : true,
            labels      : {
                left : {
                    field  : 'name',
                    editor : {
                        type : 'textfield'
                    }
                }
            }
        }
    });

    const panel = new Panel({
        appendTo : targetElement,
        height : 600,
        layout : 'fit',
        items  : [
            gantt
        ],
        tbar     : {
            items   : [
                {
                    type  : 'buttonGroup',
                    style : 'margin-right: .5em',
                    items : [
                        {
                            type    : 'button',
                            color   : 'b-green',
                            id      : 'addTaskButton',
                            icon    : 'b-fa b-fa-plus',
                            text    : 'Create',
                            tooltip : 'Create new task',
                            async onAction() {
                                const added = gantt.taskStore.rootNode.appendChild({ name : 'New task', duration : 1 });

                                // run propagation to calculate new task fields
                                await project.propagate();

                                // scroll to the added task. Smoothly.
                                await gantt.scrollRowIntoView(added, {
                                    animate : true
                                });

                                gantt.features.cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        },
                        {
                            type    : 'button',
                            color   : 'b-green',
                            id      : 'editTaskButton',
                            icon    : 'b-fa b-fa-pen',
                            text    : 'Edit',
                            tooltip : 'Edit selected task',
                            onAction() {
                                if (gantt.selectedRecord) {
                                    gantt.editTask(gantt.selectedRecord);
                                }
                                else {
                                    Toast.show('First select the task you want to edit');
                                }
                            }
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    style : 'margin-right: .5em',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'expandAllButton',
                            icon     : 'b-fa b-fa-angle-double-down',
                            tooltip  : 'Expand all',
                            onAction : () => gantt.expandAll()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'collapseAllButton',
                            icon     : 'b-fa b-fa-angle-double-up',
                            tooltip  : 'Collapse all',
                            onAction : () => gantt.collapseAll()
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    style : 'margin-right: .5em',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'zoomInButton',
                            icon     : 'b-fa b-fa-search-plus',
                            tooltip  : 'Zoom in',
                            onAction : () => gantt.zoomIn()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'zoomOutButton',
                            icon     : 'b-fa b-fa-search-minus',
                            tooltip  : 'Zoom out',
                            onAction : () => gantt.zoomOut()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'zoomToFitButton',
                            icon     : 'b-fa b-fa-compress-arrows-alt',
                            tooltip  : 'Zoom to fit',
                            onAction : () => gantt.zoomToFit()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'previousButton',
                            icon     : 'b-fa b-fa-angle-left',
                            tooltip  : 'Previous time span',
                            onAction : () => gantt.shiftPrevious()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            id       : 'nextButton',
                            icon     : 'b-fa b-fa-angle-right',
                            tooltip  : 'Next time span',
                            onAction : () => gantt.shiftNext()
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    style : 'margin-right: .5em',
                    items : [
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            id         : 'featuresButton',
                            icon       : 'b-fa b-fa-tasks',
                            text       : 'Features',
                            tooltip    : 'Toggle features',
                            toggleable : true,
                            onAction({source}) {
                                const features = gantt.features;

                                new Menu({
                                    forElement  : source.element,
                                    closeAction : 'destroy',
                                    items       : [
                                        {
                                            text     : 'Task labels',
                                            checked  : !features.labels.disabled,
                                            onToggle() {
                                                features.labels.disabled = !features.labels.disabled
                                            }
                                        },
                                        {
                                            text    : 'Project lines',
                                            checked : !features.projectLines.disabled,
                                            onToggle() {
                                                features.projectLines.disabled = !features.projectLines.disabled;
                                            }
                                        }
                                    ],
                                    onDestroy() {
                                        source.pressed = false;
                                    }
                                });
                            }
                        },
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            id         : 'settingsButton',
                            icon       : 'b-fa b-fa-cogs',
                            text       : 'Settings',
                            tooltip    : 'Adjust settings',
                            toggleable : true,
                            onAction({source}) {
                                const popup = new Popup({
                                    forElement  : source.element,
                                    closeAction : 'destroy',
                                    anchor      : true,
                                    layoutStyle : {
                                        flexDirection : 'column'
                                    },
                                    items       : [
                                        {
                                            type      : 'slider',
                                            id        : 'rowHeight',
                                            text      : 'Row height',
                                            width     : '10em',
                                            showValue : true,
                                            value     : gantt.rowHeight,
                                            min       : 30,
                                            max       : 70,
                                            style     : 'margin-bottom: .5em',
                                            onInput({value}) {
                                                gantt.rowHeight = value;
                                                popup.widgetMap.barMargin.max = (value / 2) - 5;
                                            }
                                        },
                                        {
                                            type      : 'slider',
                                            id        : 'barMargin',
                                            text      : 'Bar margin',
                                            width     : '10em',
                                            showValue : true,
                                            value     : gantt.barMargin,
                                            min       : 0,
                                            max       : 45 / 2 - 5,
                                            onInput   : ({value}) => gantt.barMargin = value
                                        }
                                    ],
                                    onDestroy() {
                                        source.pressed = false;
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        }
    });

    project.load().then(() => {
        // let's track scheduling conflicts happened
        project.on('schedulingconflict', context => {
            // show notification to user
            Toast.show('Scheduling conflict has happened ..recent changes were reverted');
            // as the conflict resolution approach let's simply cancel the changes
            context.continueWithResolutionResult(EffectResolutionResult.Cancel);
        });
    });

//END
})();
