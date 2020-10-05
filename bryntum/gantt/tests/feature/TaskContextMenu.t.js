import DateHelper from '../../lib/Core/helper/DateHelper.js';
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Gantt/column/StartDateColumn.js';
import ObjectHelper from '../../lib/Core/helper/ObjectHelper.js';

StartTest(t => {
    let gantt;

    Object.assign(window, {
        Gantt
    });

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Basic context menu works', t => {
        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip     : false,
                taskContextMenu : {
                    items : {
                        moveLeft  : {
                            text : 'Move left',
                            icon : 'b-fa b-fa-fw b-fa-arrow-left',
                            cls  : 'b-separator b-move-left',
                            onItem({ taskRecord }) {
                                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, -1, 'day'));
                            }
                        },
                        moveRight : {
                            text : 'Move right',
                            icon : 'b-fa b-fa-fw b-fa-arrow-right',
                            cls  : 'b-move-right',
                            onItem({ taskRecord }) {
                                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, 1, 'day'));
                            }
                        }
                    }
                }
            }
        });

        const targetTask = gantt.taskStore.getById(11);

        t.firesOk({
            observable : gantt,
            events     : {
                taskcontextmenubeforeshow : 6,
                taskcontextmenushow       : 5,
                taskcontextmenuitem       : 5
            }
        });

        gantt.on({
            taskcontextmenubeforeshow : () => false,
            once                      : true
        });

        const listeners = {
            taskcontextmenubeforeshow : ({ source, items, taskRecord }) => {
                t.describe('Assert taskcontextmenubeforeshow event', t => {
                    t.is(source, gantt, 'Source is ok');
                    // We should see
                    // Edit
                    // Add...
                    // Indent
                    // Outdent
                    // Delete task
                    // Move left
                    // Move right
                    t.is(ObjectHelper.getTruthyKeys(items).length, 7, '7 menu items');
                    t.is(taskRecord, taskRecord, 'Target task is ok');
                });
            },
            taskcontextmenushow       : ({ source, taskRecord, taskElement }) => {
                t.describe('Assert taskcontextmenushow event', t => {
                    t.is(source, gantt, 'Source is ok');
                    t.is(taskRecord, targetTask, 'Target task is ok');
                    t.is(taskElement, gantt.getElementFromTaskRecord(targetTask).parentElement, 'Element is ok');
                });
            },
            taskcontextmenuitem       : ({ source, item, taskRecord }) => {
                t.describe('Assert taskcontextmenuitem event', t => {
                    t.is(source, gantt, 'Source is ok');
                    t.is(item.text, 'Move right', 'Item is ok');
                    t.is(taskRecord, targetTask, 'Target task is ok');
                });
            },
            once                      : true
        };

        let task;

        t.chain(
            { contextmenu : '.b-gantt-task.id11', desc : 'First menu is cancelled' },
            next => {
                gantt.on(listeners);
                next();
            },
            { contextmenu : '.b-gantt-task.id11', desc : 'Move one day right' },
            { click : '.b-move-right' },
            { waitForPropagate : gantt },
            next => {
                t.is(targetTask.startDate, new Date(2017, 0, 17), 'Start date moved');
                next();
            },
            { contextmenu : '.b-gantt-task.id11', desc : 'Move one day left' },
            { click : '.b-move-left' },
            { waitForPropagate : gantt },
            next => {
                t.is(targetTask.startDate, new Date(2017, 0, 16), 'Start date moved');
                next();
            },
            { contextmenu : '.b-gantt-task.id11' },
            { moveMouseTo : '.b-icon-add', offset : [130, 0] },
            { click : '.b-icon-up', desc : 'Add task above' },
            next => {
                task     = gantt.taskStore.changes.added[0];
                task.cls = 'task1';
                next();
            },
            { contextmenu : '.b-gantt-task.task1' },
            { moveMouseTo : '.b-icon-add', offset : [130, 0] },
            { click : '.b-icon-down' },
            next => {
                const [task1, task2] = gantt.taskStore.changes.added;

                t.is(task1.startDate, targetTask.startDate, 'New task 1 start date is ok');
                t.is(task2.startDate, targetTask.startDate, 'New task 2 start date is ok');

                next();
            },
            { contextmenu : '.b-gantt-task.task1' },
            { click : '.b-icon-edit' },
            { waitForSelector : '.b-contains-focus input' },
            { type : 'foo[ENTER]' },
            next => {
                t.is(task.name, 'New task 1foo', 'Task name is ok');
                next();
            }
        );
    });

    t.it('Should be possible to trigger menu using API', t => {
        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip     : false,
                taskContextMenu : true
            }
        });

        const
            menu    = gantt.features.taskContextMenu,
            getTask = id => gantt.taskStore.getById(id);

        gantt.collapse(getTask(23));

        t.chain(
            { waitForSelector : '.b-gantt-task' },
            next => {
                let task = getTask(12);
                menu.showContextMenuFor(task);
                t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');

                task = getTask(231);
                menu.showContextMenuFor(task);
                t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');

                task = getTask(21);
                t.waitForEvent(gantt, 'taskcontextmenushow', next);
                menu.showContextMenuFor(task);
            },
            next => {
                t.selectorCountIs('.b-menu', 1, 'Task context menu appears');
                const
                    taskBox = gantt.getElementFromTaskRecord(getTask(21)).getBoundingClientRect(),
                    menuBox = document.querySelector('.b-menu').getBoundingClientRect();

                t.ok(taskBox.left < menuBox.left && taskBox.right > menuBox.left, 'Menu is aligned horizontally');
                t.ok(taskBox.top < menuBox.top && taskBox.bottom > menuBox.top, 'Menu is aligned vertically');
                next();
            }
        );
    });

    t.it('Context menu should match for locked and normal region (when context menu features is enabled after)', t => {
        function getGantt(features) {
            return new Gantt({
                appendTo  : document.body,
                startDate : new Date(2020, 1, 17),
                width     : 600,
                height    : 400,
                features  : Object.assign({
                    filter : true
                }, features),
                tasks     : [
                    {
                        id       : 1,
                        name     : 'Task 1',
                        expanded : true,
                        children : [
                            {
                                id        : 11,
                                name      : 'Task 11',
                                startDate : '2020-02-17',
                                duration  : 5
                            }
                        ]
                    }
                ]
            });
        }

        let expectedItems;

        const steps = [
            () => gantt.project.waitForPropagateCompleted(),
            { contextmenu : '.b-gantt-task-wrap[data-task-id="11"]' },
            { waitForSelector : '.b-menu' },
            async () => {
                expectedItems = Array.from(document.querySelectorAll('.b-menuitem')).map(el => el.dataset.ref);
            },
            { contextmenu : '.b-grid-row[data-id="11"]' },
            { waitForSelector : '.b-menu' },
            async () => {
                const items = Array.from(document.querySelectorAll('.b-menuitem')).map(el => el.dataset.ref);

                t.isDeeply(items.slice(0, items.length - 1), expectedItems, 'Context menu items match');
            }
        ];

        t.chain(
            async () => {
                t.diag('Context menu enabled before task context menu');

                gantt = getGantt({
                    contextMenu     : true,
                    taskContextMenu : true
                });
            },
            steps,
            async () => {
                gantt.destroy();

                t.diag('Context menu enabled after task context menu');

                gantt = getGantt({
                    taskContextMenu : true,
                    contextMenu     : true
                });
            },
            steps
        );
    });

    t.it('Should be possible to disable Task Edit feature and use Task Context menu', t => {
        gantt = t.getGantt({
            features : {
                taskEdit        : false,
                taskContextMenu : true
            }
        });

        t.chain(
            { rightclick : '.b-gantt-task.id11' },
            { waitForSelector : '.b-menu', desc : 'Menu is visible' },
            { waitForSelectorNotFound : '.b-menuitem[data-ref="editTask"]', desc : 'Edit menu item is not in the menu' }
        );
    });

    // https://github.com/bryntum/support/issues/1056
    t.it('Should be possible to disable Task Context menu for a specific column', t => {
        gantt = t.getGantt({
            features : {
                taskContextMenu : true
            },
            columns : [
                { type : 'name', width : 250 },
                { type : 'startdate', enableCellContextMenu : false }
            ]
        });

        t.chain(
            { rightclick : '.b-grid-cell[data-column="name"]' },
            { waitForSelector : '.b-menu', desc : 'Menu is visible' },
            { rightclick : '.b-grid-cell[data-column="startDate"]' },
            { waitForSelectorNotFound : '.b-menu', desc : 'Menu is not visible' }
        );
    });

    t.it('Should open context menu on row border', t => {
        gantt = t.getGantt({
            features : {
                taskEdit        : false,
                taskContextMenu : true
            }
        });

        t.chain(
            { rightClick : '.b-grid-row.id11', offset : ['50%', '100%'] },
            { waitFor : 500, desc : 'No exception is thrown during timeout' }
        );
    });
});
