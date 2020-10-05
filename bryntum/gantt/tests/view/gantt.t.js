/*!
 *
 * Bryntum Gantt 2.1.9
 *
 * Copyright(c) 2020 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
import Panel from '../../lib/Core/widget/Panel.js';
import AllColumns from '../../lib/Gantt/column/AllColumns.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import DateHelper from '../../lib/Core/helper/DateHelper.js';
import VersionHelper from '../../lib/Core/helper/VersionHelper.js';

StartTest(t => {

    let gantt, scheduler;

    t.beforeEach(() => {
        gantt && !gantt.isDestroyed && gantt.destroy();
        scheduler && !scheduler.isDestroyed && scheduler.destroy();
    });

    t.it('Version helper should recognize Core, Grid, Scheduler, SchedulerPro and Gantt', t => {
        t.ok(VersionHelper.getVersion('core'), 'Core version is specified');
        t.ok(VersionHelper.getVersion('grid'), 'Grid version is specified');
        t.ok(VersionHelper.getVersion('scheduler'), 'Scheduler version is specified');
        t.ok(VersionHelper.getVersion('gantt'), 'Gantt version is specified');
    });

    t.it('Should work before being rendered', t => {
        const project = new ProjectModel({
            transport : {
                load : {
                    url : 'launch-saas.json'
                }
            }
        });

        gantt = t.getGantt({
            startDate : '2019-01-14',
            appendTo  : null,
            project
        });

        // This should execute with no error when the Gantt is not rendered.
        // https://github.com/bryntum/bryntum-suite/issues/197
        t.chain(
            () => project.load().then(() => {
                gantt.render(document.body);
            }),

            () => {
                // And tasks appear after render
                t.isGreater(gantt.rowManager.rowCount, 0);
                t.is(gantt.timeAxisSubGridElement.querySelectorAll(gantt.eventSelector).length, gantt.rowManager.rowCount);
            }
        );
    });

    t.it('should render tasks on demand during scroll', t => {
        gantt = t.getGantt({
            height   : 150, // Used to be 100 but did not fit a full row and scroller then refused to scroll
            appendTo : document.body
        });

        // Last task's element is NOT present because of buffered rendering.
        t.notOk(gantt.getElementFromTaskRecord(gantt.store.last), 'Last task not rendered');

        // First task's element is present.
        t.ok(gantt.getElementFromTaskRecord(gantt.store.first), 'First task rendered');

        t.chain(
            // Scroll to end
            () => gantt.scrollTaskIntoView(gantt.store.last),

            // Wait for last task's element to be present.
            {
                waitFor : () => gantt.getElementFromTaskRecord(gantt.store.last)
            }
        );
    });

    t.it('task navigation', t => {
        gantt = t.getGantt({
            height         : 700,
            appendTo       : document.body,
            onTaskBarClick : () => {}
        });

        const
            editTaskSpy    = t.spyOn(gantt.features.taskEdit, 'editTask').and.callFake(() => {}),
            contextmenuSpy = t.spyOn(gantt.features.taskContextMenu, 'showEventContextMenu').and.callFake(() => {}),
            testChain      = [
                { click : gantt.getElementFromTaskRecord(gantt.taskStore.first) }
            ],
            visitedTasks   = [];

        gantt.navigator.on({
            navigate : ({ item }) => {
                visitedTasks.push(item);
            }
        });

        let counter = 0;

        // Navigate through the entire chart, checking triggering of keyboard-based
        // operations on each Task
        gantt.taskStore.forEach(task => {
            const
                taskEl    = gantt.getElementFromTaskRecord(task).parentNode,
                callCount = ++counter;

            testChain.push(
                { waitFor : () => document.activeElement === taskEl },
                { waitFor : () => visitedTasks[callCount - 1] === taskEl },
                { type : '[ENTER]' },

                // Check whether ENTER triggered the editTask method on the task
                next => {
                    t.is(editTaskSpy.calls.count(), callCount);
                    t.isDeeply(editTaskSpy.calls.argsFor(callCount - 1), [task]);
                    next();
                },
                { type : ' ' },

                // Check whether SPACE triggered the onContextMenu method on the task
                next => {
                    t.is(contextmenuSpy.calls.count(), callCount);
                    t.is(contextmenuSpy.calls.argsFor(callCount - 1)[0].target, taskEl);
                    next();
                },
                { type : '[DOWN]' });
        });

        t.chain(...testChain);
    });

    t.it('Should clear tasks', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        t.chain(
            { waitForPropagate : gantt },
            next => {
                gantt.taskStore.data = [];
                next();
            },
            { waitForSelectorNotFound : '.b-gantt-task-wrap' }, // wrap is released for re-usage
            { waitForSelectorNotFound : '.b-sch-timeaxis-cell' }
        );
    });

    t.it('Should hide task elements when none are visible in the time span', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });
        const
            taskSelector         = gantt.eventSelector,
            releasedTaskSelector = '.b-released';

        let taskElCount;

        t.chain(
            { waitForPropagate : gantt },
            next => {
                taskElCount = gantt.timeAxisSubGridElement.querySelectorAll(taskSelector).length;

                // Move the time axis two years into the future.
                // There are no tasks in this range.
                gantt.setTimeSpan(DateHelper.add(gantt.endDate, 24, 'month'), DateHelper.add(gantt.endDate, 25, 'month'));
                next();
            },
            () => {
                // We've moved outside of the time range, so all tasks must have gone in for recycling
                t.is(gantt.timeAxisSubGridElement.querySelectorAll(taskSelector).length, 0);
                t.is(gantt.timeAxisSubGridElement.querySelectorAll(releasedTaskSelector).length, taskElCount);
            }
        );
    });

    t.it('task navigation with Gantt inside a Panel', t => {
        gantt = t.getGantt({
            onTaskBarClick : () => {},
            height         : 600,
            appendTo       : null
        });

        const panel = new Panel({
            layout   : 'fit',
            appendTo : document.body,
            items    : [gantt],
            tbar     : [
                {
                    type     : 'button',
                    ref      : 'expandAllButton',
                    icon     : 'b-fa b-fa-angle-double-down',
                    tooltip  : 'Expand all',
                    onAction : () => gantt.expandAll()
                },
                {
                    type     : 'button',
                    ref      : 'collapseAllButton',
                    icon     : 'b-fa b-fa-angle-double-up',
                    tooltip  : 'Collapse all',
                    onAction : () => gantt.collapseAll()
                },
                {
                    type     : 'button',
                    ref      : 'zoomInButton',
                    icon     : 'b-fa b-fa-search-plus',
                    tooltip  : 'Zoom in',
                    onAction : () => gantt.zoomIn()
                },
                {
                    type     : 'button',
                    ref      : 'zoomOutButton',
                    icon     : 'b-fa b-fa-search-minus',
                    tooltip  : 'Zoom out',
                    onAction : () => gantt.zoomOut()
                },
                {
                    type     : 'button',
                    ref      : 'previousButton',
                    icon     : 'b-fa b-fa-angle-left',
                    tooltip  : 'Previous time span',
                    onAction : () => gantt.shiftPrevious()
                },
                {
                    type     : 'button',
                    ref      : 'nextButton',
                    icon     : 'b-fa b-fa-angle-right',
                    tooltip  : 'Next time span',
                    onAction : () => gantt.shiftNext()
                },
                {
                    type     : 'button',
                    ref      : 'addTaskButton',
                    icon     : 'b-fa b-fa-plus',
                    tooltip  : 'Add new task',
                    onAction : () => {
                        const cellEdit = gantt.features.cellEdit;

                        cellEdit.doAddNewAtEnd().then((added) => {
                            if (added) {
                                cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        });
                    }
                }
            ]
        });

        // Work round Panel default styling which has some padding.
        panel.bodyElement.style.padding = 0;

        let cellEditor,
            scrollY;

        const
            editTaskSpy    = t.spyOn(gantt.features.taskEdit, 'editTask').and.callFake(() => {}),
            contextmenuSpy = t.spyOn(gantt.features.taskContextMenu, 'showEventContextMenu').and.callFake(() => {}),
            testChain      = [
                { waitForPropagate : gantt.project },

                { click : panel.widgetMap.addTaskButton.element },

                { waitForPropagate : gantt.project },

                {
                    waitFor() {
                        if (gantt.features.cellEdit.editorContext) {
                            cellEditor = gantt.features.cellEdit.editorContext.editor.inputField;

                            scrollY = gantt.scrollable.y;

                            return cellEditor.containsFocus;
                        }
                    }
                },

                { click : panel.element, offset : ['50%', 30] },

                {
                    waitFor() {
                        return !cellEditor.containsFocus;
                    }
                },

                next => {
                    t.is(gantt.scrollable.y, scrollY, 'Scroll position unchange after clicking out');
                    gantt.scrollable.y = 0;
                    next();
                },

                { click : gantt.getElementFromTaskRecord(gantt.taskStore.first) }
            ],
            visitedTasks   = [];

        gantt.navigator.on({
            navigate : ({ item }) => {
                visitedTasks.push(item);
            }
        });

        let counter = 0;

        // Navigate through the entire chart, checking triggering of keyboard-based
        // operations on each Task.
        // The trailing DOWN action also tests the protection against navigating
        // to tasks which are outside of the TimeAxis.
        // The added task at the end has no start/end date, so is not navigable.
        gantt.taskStore.forEach(task => {
            const
                innerEl   = gantt.getElementFromTaskRecord(task),
                taskEl    = innerEl && innerEl.parentNode,
                callCount = ++counter;

            if (!taskEl) {
                t.fail('Failed on task ' + task.id);
            }

            testChain.push({
                waitFor : () => document.activeElement === taskEl
            }, {
                waitFor : () => visitedTasks[callCount - 1] === taskEl
            }, {
                type : '[ENTER]'
            },

            // Check whether ENTER triggered the editTask method on the task
            next => {
                t.is(editTaskSpy.calls.count(), callCount);
                t.isDeeply(editTaskSpy.calls.argsFor(callCount - 1), [task]);
                next();
            }, {
                type : ' '
            },

            // Check whether SPACE triggered the onContextMenu method on the task
            next => {
                t.is(contextmenuSpy.calls.count(), callCount);
                t.is(contextmenuSpy.calls.argsFor(callCount - 1)[0].target, taskEl);
                next();
            }, {
                type : '[DOWN]'
            });
        });

        // There is nothing to wait for. The last DOWN should simply not have thrown an error
        // It will not navigate anywhere or fire any events.
        // But it MUST complete before the beforeEach destroys it.
        testChain.push(
            { waitFor : 500 },
            () => {
                panel.destroy();
            }
        );

        t.chain(...testChain);
    });

    t.it('Adding new records', t => {
        gantt = t.getGantt({
            // We only want the name column which will be auto inserted
            columns        : [],
            onTaskBarClick : () => {},
            appendTo       : null
        });
        const panel = new Panel({
            layout   : 'fit',
            height   : 700,
            appendTo : document.body,
            items    : [gantt],
            tbar     : [
                {
                    type     : 'button',
                    ref      : 'expandAllButton',
                    icon     : 'b-fa b-fa-angle-double-down',
                    tooltip  : 'Expand all',
                    onAction : () => gantt.expandAll()
                },
                {
                    type     : 'button',
                    ref      : 'collapseAllButton',
                    icon     : 'b-fa b-fa-angle-double-up',
                    tooltip  : 'Collapse all',
                    onAction : () => gantt.collapseAll()
                },
                {
                    type     : 'button',
                    ref      : 'zoomInButton',
                    icon     : 'b-fa b-fa-search-plus',
                    tooltip  : 'Zoom in',
                    onAction : () => gantt.zoomIn()
                },
                {
                    type     : 'button',
                    ref      : 'zoomOutButton',
                    icon     : 'b-fa b-fa-search-minus',
                    tooltip  : 'Zoom out',
                    onAction : () => gantt.zoomOut()
                },
                {
                    type     : 'button',
                    ref      : 'previousButton',
                    icon     : 'b-fa b-fa-angle-left',
                    tooltip  : 'Previous time span',
                    onAction : () => gantt.shiftPrevious()
                },
                {
                    type     : 'button',
                    ref      : 'nextButton',
                    icon     : 'b-fa b-fa-angle-right',
                    tooltip  : 'Next time span',
                    onAction : () => gantt.shiftNext()
                },
                {
                    type     : 'button',
                    ref      : 'addTaskButton',
                    icon     : 'b-fa b-fa-plus',
                    tooltip  : 'Add new task',
                    onAction : () => {
                        const cellEdit = gantt.features.cellEdit;

                        cellEdit.doAddNewAtEnd().then((added) => {
                            if (added) {
                                cellEdit.startEditing({
                                    record : added,
                                    field  : 'name'
                                });
                            }
                        });
                    }
                }
            ]
        });

        // Work round Panel default styling which is a dark grey background
        // and some padding.
        panel.bodyElement.style.backgroundColor = 'transparent';
        panel.bodyElement.style.padding = 0;

        let cellEdit,
            cellEditor;
        const
            count = gantt.taskStore.count;

        t.chain(
            { click : panel.widgetMap.addTaskButton.element },

            // Wait until a new record has been added and we're editing it
            {
                waitFor() {
                    if (gantt.features.cellEdit.editorContext) {
                        cellEdit = gantt.features.cellEdit;
                        cellEditor = cellEdit.editorContext.editor.inputField;

                        return cellEditor.containsFocus &&
                            gantt.taskStore.count === count + 1 &&
                            cellEdit.editorContext.record === gantt.taskStore.last;
                    }
                }
            },

            // We have only one column, so this should trigger addNewAtEnd
            {
                type : '[TAB]'
            },

            // Wait until a new record has been added and we're editing it
            {
                waitFor() {
                    return cellEditor.containsFocus &&
                        gantt.taskStore.count === count + 2 &&
                        cellEdit.editorContext.record === gantt.taskStore.last;
                }
            },

            () => {
                panel.destroy();
            }
        );
    });

    t.it('Should preserve locked view scroll when hiding columns', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            columns  : Object.values(AllColumns).map(column => {
                return {
                    type : column.type
                };
            }),
            enableEventAnimations : false,
            subGridConfigs        : {
                locked : {
                    width : 500
                },
                normal : {
                    width : 400
                }
            }
        });

        const scrollable = gantt.subGrids.locked.scrollable;

        t.chain(
            { waitForPropagate : gantt },
            () => {
                return scrollable.scrollTo(scrollable.maxX);
            },
            gantt.columns.getRange().reverse().map(column => {
                return next => {
                    column.hide();
                    // Minimal delay is required to get proper scroll position
                    t.waitFor(100, () => {
                        t.is(scrollable.x, scrollable.maxX, 'View scroll is intact');
                        next();
                    });
                };
            })
        );
    });

    t.it('Dates are displayed consistently', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id                : 1,
                    startDate         : '2017-01-16',
                    duration          : 2,
                    name              : 'Task 1',
                    cls               : 'task1',
                    manuallyScheduled : true,
                    constraintType    : 'muststarton',
                    constraintDate    : '2017-01-16'
                },
                {
                    id                : 2,
                    startDate         : '2017-01-16',
                    duration          : 2,
                    name              : 'Task 2',
                    cls               : 'task2',
                    manuallyScheduled : true,
                    constraintType    : 'mustfinishon',
                    constraintDate    : '2017-01-18'
                }
            ],
            columns : [
                { type : 'startdate', format : 'MM/DD/YYYY' },
                { type : 'enddate', format : 'MM/DD/YYYY' },
                { type : 'constraintdate', format : 'MM/DD/YYYY' }
            ],
            displayDateFormat : 'MM/DD/YYYY'
        });

        const
            startDateStr = '01/16/2017',
            endDateStr   = '01/18/2017';

        function assertTask(name) {
            return [
                next => {
                    t.contentLike(`.${name} [data-column=startDate]`, startDateStr, `${name} start date column is ok`);
                    t.contentLike(`.${name} [data-column=endDate]`, endDateStr, `${name} end date column is ok`);

                    next();
                },

                // HOVER
                { moveMouseTo : `.b-gantt-task.${name}`, desc : 'Checking hover tip' },
                { waitForSelector : '.b-gantt-task-tooltip' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },

                // DRAG
                { drag : `.b-gantt-task.${name}`, by : [0, 10], dragOnly : true, desc : 'Checking drag tip' },
                { waitForSelector : '.b-gantt-taskdrag-tooltip .b-sch-tooltip-startdate' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },
                { mouseUp : null },
                { waitForSelectorNotFound : '.b-gantt-taskdrag-tooltip .b-sch-tooltip-startdate' },

                // RESIZE
                { drag : `.b-gantt-task.${name}`, by : [0, 10], offset : ['100%-5', '50%'], dragOnly : true, desc : 'Checking resize tip' },
                { waitForSelector : '.b-sch-tooltip-startdate' },
                next => {
                    t.contentLike('.b-sch-tooltip-startdate .b-sch-clock-text', startDateStr, `${name} start date in tooltip is ok`);
                    t.contentLike('.b-sch-tooltip-enddate .b-sch-clock-text', endDateStr, `${name} end date in tooltip is ok`);
                    next();
                },
                { mouseUp : null },

                // EVENT EDITOR
                { dblclick : `.b-gantt-task.${name}`, desc : 'Checking event editor' },
                { waitForSelector : '.b-gantt-taskeditor' },
                next => {
                    t.is(document.querySelector('.b-gantt-taskeditor input[name=startDate]').value, startDateStr,
                        `${name} start date field in event editor is ok`);
                    t.is(document.querySelector('.b-gantt-taskeditor input[name=endDate]').value, endDateStr,
                        `${name} end date field in event editor is ok`);
                    next();
                },
                { click : '.b-popup-close' }
            ];
        }

        t.chain(
            { waitForPropagate : gantt },
            { moveMouseTo : `.task2`, desc : 'Move mouse to last locked row to avoid unexpected triggering hover tip' },
            next => {
                t.contentLike('.task1 [data-column=constraintDate]', startDateStr, 'Task 1 constraint date column is ok');
                t.contentLike('.task2 [data-column=constraintDate]', endDateStr, 'Task 2 constraint date column is ok');
                next();
            },
            assertTask('task2'),
            assertTask('task1')
        );
    });

    t.it('Dropping on the splitter should not throw an error', t => {
        gantt = t.getGantt({
            height   : 700,
            appendTo : document.body
        });

        t.chain(
            { drag : '.b-grid-cell', to : '.b-grid-splitter' }
        );
    });

    t.it('Collapsing an expanded node which has no children is a no-op', t => {
        gantt = t.getGantt({
            height    : 700,
            appendTo  : document.body,
            startDate : new Date(2011, 6, 1),
            columns   : [{
                type  : 'tree',
                field : 'name',
                flex  : 1,
                text  : 'Name'
            }],
            project : {
                startDate  : new Date(2011, 6, 1),
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Node 1',
                        expanded  : true,
                        startDate : new Date(2011, 6, 1),
                        endDate   : new Date(2011, 6, 2),
                        children  : [
                            {
                                id        : 11,
                                name      : 'Node 1.1',
                                startDate : new Date(2011, 6, 2),
                                endDate   : new Date(2011, 6, 3)
                            },
                            {
                                id        : 111,
                                name      : 'Node 1.1.1',
                                startDate : new Date(2011, 6, 3),
                                endDate   : new Date(2011, 6, 4)
                            }
                        ]
                    },
                    {
                        id        : 2,
                        name      : 'Node 2',
                        startDate : new Date(2011, 6, 4),
                        endDate   : new Date(2011, 6, 5)
                    }
                ],
                _dependenciesData : [
                    { id : 1, fromEvent : 1, toEvent : 11 },
                    { id : 3, fromEvent : 1, toEvent : 2 }
                ]
            }
        });

        // Ensure that an emptied parent doesn't drop to being a leaf.
        // We are testing that collapsing such an entity does nothing.
        gantt.taskStore.modelClass.convertEmptyParentToLeaf = false;

        const
            project             = gantt.project,
            node1               = gantt.taskStore.getById(1),
            node11              = gantt.taskStore.getById(11),
            node111             = gantt.taskStore.getById(111),
            visibleTaskSelector = `#${gantt.id} ${gantt.eventSelector}:not(.b-sch-released)`;

        t.chain(
            { waitForPropagate : project },

            next => {
                // There should *always* be 4 visible events
                t.selectorCountIs(visibleTaskSelector, 4);

                // make Task 11 a child of Task 111
                node11.appendChild(node111);

                // make sure Task 111 is expanded
                gantt.features.tree.toggleCollapse(node11, false);
                next();
            },

            { waitForPropagate : project },

            next => {
                // There should *always* be 4 visible events
                t.selectorCountIs(visibleTaskSelector, 4);

                // Make node11, an expanded node empty, but still a parent
                node1.appendChild(node111);

                next();
            },

            { waitForPropagate : project },

            next => {
                // There should *always* be 4 visible events
                t.selectorCountIs(visibleTaskSelector, 4);

                gantt.features.tree.toggleCollapse(node11, true);

                // There should *always* be 4 visible events
                t.selectorCountIs(visibleTaskSelector, 4);

                next();
            },

            { waitForPropagate : project },

            () => {
                // There should *always* be 4 visible events
                t.selectorCountIs(visibleTaskSelector, 4);
            }
        );
    });

    t.it('ESC handling should not proceed as if a cell was focused if a Task is focused', t => {
        gantt = t.getGantt({
            height    : 700,
            appendTo  : document.body,
            startDate : new Date(2011, 6, 1),
            columns   : [{
                type  : 'tree',
                field : 'name',
                flex  : 1,
                text  : 'Name'
            }],
            project : {
                startDate  : new Date(2011, 6, 1),
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Node 1',
                        expanded  : true,
                        startDate : new Date(2011, 6, 1),
                        endDate   : new Date(2011, 6, 2),
                        children  : [
                            {
                                id        : 11,
                                name      : 'Node 1.1',
                                startDate : new Date(2011, 6, 2),
                                endDate   : new Date(2011, 6, 3)
                            },
                            {
                                id        : 111,
                                name      : 'Node 1.1.1',
                                startDate : new Date(2011, 6, 3),
                                endDate   : new Date(2011, 6, 4)
                            }
                        ]
                    },
                    {
                        id        : 2,
                        name      : 'Node 2',
                        startDate : new Date(2011, 6, 4),
                        endDate   : new Date(2011, 6, 5)
                    }
                ],
                _dependenciesData : [
                    { id : 1, fromEvent : 1, toEvent : 11 },
                    { id : 3, fromEvent : 1, toEvent : 2 }
                ]
            }
        });
        const node1 = gantt.taskStore.getById(1);

        // The correct outcome here is that it does NOT throw an error.
        t.chain(
            { waitForPropagate : gantt.project },

            { click : '.b-grid-row[data-index="1"] .b-grid-cell' },

            { click : '.b-gantt-task-wrap[data-task-id="1"]' },

            { waitFor : () => gantt.activeEvent === node1 },

            { type : '[ESCAPE]' },

            // We are witing for nothing to happen. The error was that ESC attempted to shift focus
            { waitFor : 100 },

            () => {
                // Focus must not have been moved
                t.is(gantt.activeEvent, node1);
            }
        );
    });

    t.it('Should not duplicate task on changing id', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            tasks    : [
                {
                    id        : 1,
                    startDate : '2017-01-16',
                    duration  : 2,
                    name      : 'Task 1'
                }
            ]
        });

        t.selectorCountIs('.b-gantt-task', 1, 'Only one task is rendered');
        const task = gantt.taskStore.first;
        task.id = 2;
        t.selectorCountIs('.b-gantt-task', 1, 'Only one task is rendered');
    });

    t.it('should support scrolling unscheduled task into view', t => {
        gantt = t.getGantt({
            height   : 150, // Used to be 100 but did not fit a full row and scroller then refused to scroll
            appendTo : document.body
        });

        const task = gantt.taskStore.rootNode.appendChild({ cls : 'foo' });

        t.chain(
            // Scroll to end
            () => gantt.scrollTaskIntoView(task),

            // Wait for task element to be present.
            { waitForElementVisible : '.foo' }
        );
    });

    t.it('should scroll task start date into view even if it is unscheduled', t => {
        gantt = t.getGantt({
            height   : 150, // Used to be 100 but did not fit a full row and scroller then refused to scroll
            appendTo : document.body
        });

        const task = gantt.taskStore.rootNode.appendChild({ name : 'New', cls : 'foo', startDate : new Date(2020, 0, 6) });

        t.chain(
            // Scroll to end
            () => gantt.scrollTaskIntoView(task),

            // Wait for task element to be present.
            { waitForElementVisible : '.foo' }
        );
    });
});
