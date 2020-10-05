/* eslint-disable react-hooks/rules-of-hooks */

import { useEffect } from 'react';
import {
    Panel,
    Gantt,
    Toast,
    Menu,
    Popup,
    DateHelper,
    EffectResolutionResult
} from 'bryntum-gantt';
import ganttConfig from '../components/gantt/ganttConfig';
import 'bryntum-gantt/gantt.stockholm.css';

const panel = props => {

    const
        gantt = new Gantt(ganttConfig),
        panel = new Panel(getPanelConfig(gantt))
    ;

    // runs once after render
    useEffect(() => {
        panel.render('container')

        const
            project = gantt.project,
            stm = project.stm,
            widgetMap = panel.tbar.widgetMap,
            updateUndoRedoButtons = () => {
                const
                    undoBtn = widgetMap.undoBtn,
                    redoBtn = widgetMap.redoBtn,
                    redoCount = stm.length - stm.position;

                undoBtn.badge = stm.position || '';
                redoBtn.badge = redoCount || '';

                undoBtn.disabled = !stm.canUndo;
                redoBtn.disabled = !stm.canRedo;
            } // eo function updateUndoRedoButtons
        ;

        stm.on({
            recordingstop : updateUndoRedoButtons,
            restoringstop : updateUndoRedoButtons
        });

        project.on('load', ({source}) => {
            widgetMap.startDateField.value = source.startDate;
        });

        // console.time("load data");
        project.load().then(() => {
            // console.timeEnd("load data");

            // let's track scheduling conflicts happened
            project.on('schedulingconflict', context => {
                // show notification to user
                Toast.show('Scheduling conflict has happened ..recent changes were reverted');
                // as the conflict resolution approach let's simply cancel the changes
                context.continueWithResolutionResult(EffectResolutionResult.Cancel);
            });

            stm.enable();
            stm.autoRecord = true;
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
} // eo function panel

const getPanelConfig = gantt => {

    const project = gantt.project;

    return {
        myPanel : true,
        items : [
            gantt
        ],
        tbar : {
            items : [
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type    : 'button',
                            color   : 'b-green',
                            ref     : 'addTaskButton',
                            icon    : 'b-fa b-fa-plus',
                            text    : 'Create',
                            tooltip : 'Create new task',
                            async onAction() {
                                const added = gantt.taskStore.rootNode.appendChild({ name : 'New task', duration : 1 });

                                // run propagation to calculate new task fields
                                await project.propagate();

                                // scroll to the added task
                                await gantt.scrollRowIntoView(added);

                                gantt.features.cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type    : 'button',
                            color   : 'b-blue',
                            ref     : 'editTaskButton',
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
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'undoBtn',
                            icon     : 'b-icon b-fa b-fa-undo',
                            tooltip  : 'Undo',
                            disabled : true,
                            width    : '2em',
                            onAction() {
                                project.stm.canUndo && project.stm.undo();
                            }
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'redoBtn',
                            icon     : 'b-icon b-fa b-fa-redo',
                            tooltip  : 'Redo',
                            disabled : true,
                            width    : '2em',
                            onAction() {
                                project.stm.canRedo && project.stm.redo();
                            }
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'expandAllButton',
                            icon     : 'b-fa b-fa-angle-double-down',
                            tooltip  : 'Expand all',
                            onAction : () => gantt.expandAll()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'collapseAllButton',
                            icon     : 'b-fa b-fa-angle-double-up',
                            tooltip  : 'Collapse all',
                            onAction : () => gantt.collapseAll()
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomInButton',
                            icon     : 'b-fa b-fa-search-plus',
                            tooltip  : 'Zoom in',
                            onAction : () => gantt.zoomIn()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomOutButton',
                            icon     : 'b-fa b-fa-search-minus',
                            tooltip  : 'Zoom out',
                            onAction : () => gantt.zoomOut()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomToFitButton',
                            icon     : 'b-fa b-fa-compress-arrows-alt',
                            tooltip  : 'Zoom to fit',
                            onAction : () => gantt.zoomToFit({
                                leftMargin  : 50,
                                rightMargin : 50
                            })
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'previousButton',
                            icon     : 'b-fa b-fa-angle-left',
                            tooltip  : 'Previous time span',
                            onAction : () => gantt.shiftPrevious()
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'nextButton',
                            icon     : 'b-fa b-fa-angle-right',
                            tooltip  : 'Next time span',
                            onAction : () => gantt.shiftNext()
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'featuresButton',
                            icon       : 'b-fa b-fa-tasks',
                            text       : 'Features',
                            tooltip    : 'Toggle features',
                            toggleable : true,
                            onAction({ source }) {
                                const features = gantt.features;

                                new Menu({
                                    forElement  : source.element,
                                    closeAction : 'destroy',
                                    items       : [
                                        {
                                            text     : 'Draw dependencies',
                                            checked  : !features.dependencies.disabled,
                                            onToggle : () => features.dependencies.disabled = !features.dependencies.disabled
                                        },
                                        {
                                            text     : 'Task labels',
                                            checked  : !features.labels.disabled,
                                            onToggle : () => features.labels.disabled = !features.labels.disabled
                                        },
                                        {
                                            text     : 'Project lines',
                                            checked  : !features.projectLines.disabled,
                                            onToggle : () => features.projectLines.disabled = !features.projectLines.disabled
                                        },
                                        {
                                            text     : 'Highlight non-working time',
                                            checked  : !features.nonWorkingTime.disabled,
                                            onToggle : () => features.nonWorkingTime.disabled = !features.nonWorkingTime.disabled
                                        },
                                        {
                                            text     : 'Hide schedule',
                                            cls      : 'b-separator',
                                            checked  : gantt.subGrids.normal.collapsed,
                                            onToggle : () => gantt.subGrids.normal.collapsed = !gantt.subGrids.normal.collapsed
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
                            ref        : 'settingsButton',
                            icon       : 'b-fa b-fa-cogs',
                            text       : 'Settings',
                            tooltip    : 'Adjust settings',
                            toggleable : true,
                            onAction({ source }) {
                                const popup = new Popup({
                                    forElement  : source.element,
                                    closeAction : 'destroy',
                                    anchor      : true,
                                    layoutStyle : {
                                        flexDirection : 'column'
                                    },
                                    items : [
                                        {
                                            type      : 'slider',
                                            ref        : 'rowHeight',
                                            text      : 'Row height',
                                            width     : '10em',
                                            showValue : true,
                                            value     : gantt.rowHeight,
                                            min       : 30,
                                            max       : 70,
                                            style     : 'margin-bottom: .5em',
                                            onInput({ value }) {
                                                gantt.rowHeight = value;
                                                popup.widgetMap.barMargin.max = (value / 2) - 5;
                                            }
                                        },
                                        {
                                            type      : 'slider',
                                            ref        : 'barMargin',
                                            text      : 'Bar margin',
                                            width     : '10em',
                                            showValue : true,
                                            value     : gantt.barMargin,
                                            min       : 0,
                                            max       : (gantt.rowHeight / 2) - 5,
                                            onInput   : ({ value }) => gantt.barMargin = value
                                        }
                                    ],
                                    onDestroy() {
                                        source.pressed = false;
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    type      : 'datefield',
                    ref       : 'startDateField',
                    label     : 'Project start',
                    width     : '17em',
                    required  : true,
                    value     : project.startDate,
                    listeners : {
                        change : ({ value }) => {
                            gantt.startDate = DateHelper.add(value, -1, 'week');
                            project.setStartDate(value);
                        }
                    }
                },
                {
                    type                 : 'textfield',
                    ref                  : 'filterByName',
                    width                : '13em',
                    placeholder          : 'Find tasks by name',
                    clearable            : true,
                    keyStrokeChangeDelay : 100,
                    triggers             : {
                        filter : {
                            align : 'start',
                            cls   : 'b-fa b-fa-filter'
                        }
                    },
                    onChange({ value }) {
                        if (value === '') {
                            gantt.taskStore.clearFilters();
                        }
                        else {
                            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                            gantt.taskStore.filter(task => task.name && task.name.match(new RegExp(value, 'i')));
                        }
                    }
                }
            ]
        } // eo tbar
    } // eo panel config
} // eo function getPanelConfig

export default panel;

// eof
