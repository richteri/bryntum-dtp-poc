/* global ProjectModel */
import '../../lib/Gantt/feature/Labels.js';
import '../../lib/Gantt/column/WBSColumn.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import CSSHelper from '../../lib/Core/helper/CSSHelper.js';
import Rectangle from '../../lib/Core/helper/util/Rectangle.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    function assertTask(t, taskOrId, index) {
        const
            task           = getTask(taskOrId),
            taskEl         = gantt.getElementFromTaskRecord(task),
            hasParentClass = taskEl && taskEl.parentElement.classList.contains('b-gantt-task-parent');

        let result = true;

        if (!taskEl) {
            t.fail(`Element for ${task.name} is not found`);
            result = false;
        }
        else {
            if (task.isLeaf && hasParentClass || !task.isLeaf && !hasParentClass) {
                t.fail(`${task.name} has incorrect leaf/parent cls`);
                result = false;
            }

            if (!isTaskPositioned(t, task)) {
                t.fail(`${task.name} is positioned incorrectly`);
                result = false;
            }

        }

        if (index != null) {
            const currentTask = gantt.getRecordFromElement(gantt.rowManager.rows[index].elements.normal);
            t.is(currentTask.id, task.id, `Task ${task.name} is displayed in correct row`);
        }

        if (result) {
            t.pass(`${task.name} is ok`);
        }
    }

    function isTaskPositioned(t, taskOrId) {
        const
            task    = getTask(taskOrId),
            taskEl  = gantt.getElementFromTaskRecord(task),
            taskBox = taskEl.getBoundingClientRect(),
            // cannot rely on cells order, need to validate
            // https://app.assembla.com/spaces/bryntum/tickets/7598-subgrids-order-need-to-be-fixed/details
            rowBox  = gantt.getRowFor(task).cells.find(cell => cell.classList.contains('b-sch-timeaxis-cell')).getBoundingClientRect();

        return taskBox.top >= rowBox.top && taskBox.bottom <= rowBox.bottom &&
            (task.isMilestone || taskBox.left === gantt.getCoordinateFromDate(task.startDate, false));
    }

    function tasksPositioned(t) {
        return gantt.project.eventStore.getRange()
            .filter(record => gantt.getRowFor(record))
            .every(record => isTaskPositioned(t, record));
    }

    function getTask(id) {
        return gantt.project.eventStore.getById(id);
    }

    function assertTaskBox(t, taskOrId, x, y, width) {
        const
            task = gantt.taskStore.getById(taskOrId),
            element = gantt.getElementFromTaskRecord(task);

        if (x === null) {
            t.notOk(element, `Unexpected element found for task ${task.id} ${task.name}`);
        }
        else {
            const box = Rectangle.from(element, gantt.timeAxisSubGridElement);
            t.isApprox(box.left, x, 1, 'Correct x');
            t.isApprox(box.top, y, 1, 'Correct y');
            t.isApprox(box.width, width, 1, 'Correct width');
            // Dont care about height, always the same
        }
    }

    t.it('Gantt should refresh on task add/update/remove', async t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : []
        });

        const projectA = getTask(1);

        t.chain(
            { waitForSelector : '.b-gantt-task' },

            async() => {
                await projectA.waitForPropagateCompleted();
                t.diag('Append child to the bottom');
                projectA.appendChild({
                    id        : 12,
                    name      : 'Child 2',
                    startDate : '2017-01-16',
                    duration  : 1,
                    cls       : 'child2'
                });
            },

            { waitForSelector : '.b-gantt-task.child2' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Insert child to the top');
                projectA.insertChild({
                    id        : 13,
                    name      : 'Child 3',
                    startDate : '2017-01-17',
                    duration  : 1,
                    cls       : 'child3'
                }, getTask(11));
            },

            { waitForSelector : '.b-gantt-task.child3' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Remove task');
                getTask(11).remove();
                t.selectorNotExists('.b-gantt-task.child1');
            },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Update task');
                await getTask(12).setStartDate(new Date(2017, 0, 18));
            },

            { click : '.b-grid-header.b-sortable', desc : 'Sort tasks' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Append child to sorted project A. It should appear first');
                projectA.appendChild({
                    id        : 14,
                    name      : 'Child 1',
                    startDate : '2017-01-18',
                    duration  : 1,
                    cls       : 'child1'
                });
            },

            { waitForSelector : '.b-gantt-task.child1' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            () => {
                t.diag('Filter store');
                projectA.project.eventStore.filter(r => r.name !== 'Child 2');

                t.ok(tasksPositioned(t), 'Tasks positioned ok');
            }
        );
    });

    t.it('Gantt should refresh when multiple tasks added/removed', async t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : []
        });

        const projectA = getTask(1);

        t.chain(
            { waitForSelector : '.b-gantt-task' },

            async() => projectA.waitForPropagateCompleted(),

            async() => {
                t.diag('Append child to the bottom');
                projectA.appendChild([
                    { id : 12, name : 'Child 2', startDate : '2017-01-16', duration : 1, cls : 'child2' },
                    { id : 13, name : 'Child 3', startDate : '2017-01-16', duration : 1, cls : 'child3' }
                ]);
            },

            { waitForSelector : '.b-gantt-task.child2' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },

            async() => {
                t.diag('Insert child to the top');
                projectA.insertChild([
                    { id : 14, name : 'Child 4', startDate : '2017-01-17', duration : 1, cls : 'child4' },
                    { id : 15, name : 'Child 5', startDate : '2017-01-17', duration : 1, cls : 'child5' }
                ], getTask(11));
            },

            { waitForSelector : '.b-gantt-task.child4' },

            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' }
        );
    });

    t.it('Should render tasks properly after scroll', t => {
        const tasks = [], dependencies = [];

        for (let i = 0; i < 20; i++) {
            const
                currentId = i + 1,
                task      = {
                    id        : currentId,
                    name      : `Task ${currentId}`,
                    startDate : '2017-01-17',
                    duration  : 2,
                    expanded  : true,
                    children  : []
                };

            for (let j = 0; j < 10; j++) {
                task.children.push({
                    id        : `${currentId}-${j + 1}`,
                    name      : `Task ${currentId}-${j + 1}`,
                    startDate : '2017-01-17',
                    duration  : 2
                });

                if (j < 9) {
                    dependencies.push({
                        id        : `${currentId}-${j + 1}`,
                        fromEvent : `${currentId}-${j + 1}`,
                        toEvent   : `${currentId}-${j + 2}`,
                        lag       : -1
                    });
                }
            }

            tasks.push(task);
        }

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                labels : {
                    right : 'name'
                }
            },
            startDate : '2017-01-15',
            endDate   : '2017-02-19',
            tasks,
            dependencies
        });

        function assertRenderedTasks() {
            Array.from(document.querySelectorAll('.b-gantt-task-wrap')).forEach(el => {
                const taskRecord = gantt.resolveTaskRecord(el);
                assertTask(t, taskRecord);
            });
        }

        function assertDependencies() {
            Array.from(gantt.foregroundCanvas.querySelectorAll('.b-sch-dependency')).forEach(dep => {
                t.assertDependency(gantt, gantt.getDependencyForElement(dep));
            });
        }

        let dependenciesDrawn = false,
            scrollEnded       = false;

        t.chain(
            { waitForPropagate : gantt },
            { waitFor : tasksPositioned, desc : 'Tasks positioned ok' },
            next => {
                assertRenderedTasks();

                gantt.on({
                    dependenciesDrawn : () => dependenciesDrawn = true,
                    once              : true
                });

                gantt.scrollable.on({
                    scrollend : () => scrollEnded = true,
                    once      : true
                });

                t.diag('Scrolling down to 1000px');

                gantt.scrollTop = 1000;

                next();
            },

            { waitFor : () => dependenciesDrawn && scrollEnded, desc : 'Scroll ended & dependencies are redrawn' },

            next => {
                assertRenderedTasks();

                assertDependencies();

                dependenciesDrawn = false;
                scrollEnded = false;

                gantt.on({
                    dependenciesDrawn : () => dependenciesDrawn = true,
                    once              : true
                });

                gantt.scrollable.on({
                    scrollend : () => scrollEnded = true,
                    once      : true
                });

                t.diag('Scrolling up to 0px');

                gantt.scrollTop = 0;

                next();
            },

            { waitFor : () => dependenciesDrawn && scrollEnded, desc : 'Scroll ended & dependencies are redrawn' },

            next => {
                assertRenderedTasks();

                assertDependencies();
            }
        );
    });

    t.it('Should render tasks properly after tree node removal', t => {
        gantt = t.getGantt();

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.taskStore.getById(3).remove();

                Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(el => {
                    const task = gantt.getRecordFromElement(el);
                    assertTask(t, task);
                });

                await gantt.collapse(gantt.taskStore.getById(2));

                gantt.taskStore.getById(22).remove();
            },
            { waitForPropagate : gantt },
            { waitForSelectorNotFound : '.b-animating' },
            async() => {
                Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(el => {
                    const task = gantt.getRecordFromElement(el);
                    assertTask(t, task);
                });
            }
        );
    });

    t.it('Should add task below', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 1,
                    name      : 'Project A',
                    startDate : '2017-01-16',
                    duration  : 5,
                    expanded  : true,
                    children  : [
                        {
                            id        : 11,
                            name      : 'Child 1',
                            startDate : '2017-01-16',
                            duration  : 5,
                            leaf      : true,
                            cls       : 'child1'
                        }
                    ]
                },
                {
                    id        : 2,
                    name      : 'Project B',
                    startDate : '2017-01-16',
                    duration  : 5
                },
                {
                    id        : 3,
                    name      : 'Project C',
                    startDate : '2017-01-17',
                    duration  : 4
                }
            ],
            dependencies : [],
            columns      : [
                { type : 'wbs' },
                { type : 'name' }
            ]
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '2', '3']
                );

                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '2', '3']
                );

                gantt.addTaskBelow(getTask(11));
                return gantt.project.waitForPropagateCompleted();
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '2', '3']
                );
            }
        );
    });

    // this test case needs to be reviewed after https://github.com/bryntum/support/issues/552
    t.it('Should add task below a task with constraint', async t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
                {
                    id        : 11,
                    startDate : '2017-01-16',
                    duration  : 1
                }
            ],
            dependencies : [],
            columns      : [
                { type : 'name' }
            ]
        });

        const { project } = gantt;

        t.is(project.startDate, new Date(2017, 0, 16));

        await project.waitForPropagateCompleted();

        // this will set a constraint on task 11
        await project.getEventById(11).setStartDate(new Date(2017, 0, 18));

        const newTask = await gantt.addTaskBelow(project.getEventById(11));

        t.is(newTask.startDate, new Date(2017, 0, 18));
        t.is(newTask.endDate, new Date(2017, 0, 19));
    });

    t.it('Should add task above/below milestone', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            startDate             : '2019-05-27',
            endDate               : '2019-06-01',
            project               : new ProjectModel({
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2019-05-27',
                        duration  : 2,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                name      : 'Child 11',
                                startDate : '2019-05-27',
                                duration  : 2,
                                leaf      : true
                            },
                            {
                                id        : 12,
                                name      : 'Child 12',
                                startDate : '2019-05-29',
                                duration  : 0,
                                leaf      : true
                            }
                        ]
                    },
                    {
                        id        : 2,
                        name      : 'Project B',
                        startDate : '2019-05-27',
                        duration  : 5
                    }
                ],
                calendarsData : [
                    {
                        id        : 'general',
                        name      : 'General',
                        intervals : [
                            {
                                recurrentStartDate : 'on Sat at 00:00',
                                recurrentEndDate   : 'on Mon at 00:00',
                                isWorking          : false
                            }
                        ]
                    }
                ],
                dependenciesData : [
                    { fromEvent : 11, toEvent : 12 }
                ],
                calendar : 'general'
            }),
            columns : [
                { type : 'wbs' },
                { type : 'name' }
            ],
            features : {
                taskContextMenu : true
            }
        });

        let task1, task2, task3;

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                task1 = await gantt.addTaskBelow(getTask(12));

                t.is(task1.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task1.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task1.duration, 0, 'Duration date ok');
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '2']
                );

                task2 = await gantt.addTaskBelow(getTask(12));

                t.is(task2.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task2.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task2.duration, 0, 'Duration date ok');
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '2']
                );

                task3 = await gantt.addTaskAbove(getTask(12));

                t.is(task3.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(task3.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(task3.duration, 0, 'Duration date ok');
            },
            {
                waitFor : () => document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7,
                desc    : 'Rows are ok'
            },
            async() => {
                t.isDeeply(
                    Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(el => el.textContent),
                    ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '2']
                );

                [task1, task2, task3].forEach(record => {
                    t.is(record.startDate, new Date(2019, 4, 27), 'Start date ok');
                    t.is(record.endDate, new Date(2019, 4, 27), 'End date ok');
                    t.is(record.duration, 0, 'Duration date ok');
                });
            }
        );
    });

    t.it('Appending new task should not cause scheduling conflict', t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-05-20',
            endDate   : '2019-05-27',
            project   : {
                startDate : '2019-05-20',
                tasksData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2019-05-20',
                        duration  : 1,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                name      : 'Task 11',
                                startDate : '2019-05-20',
                                duration  : 1
                            },
                            {
                                id        : 12,
                                name      : 'Task 12',
                                startDate : '2019-05-21',
                                expanded  : true,
                                children  : [
                                    {
                                        id        : 121,
                                        name      : 'task 121',
                                        startDate : '2019-05-21',
                                        duration  : 1
                                    }
                                ]
                            }
                        ]
                    }
                ],
                dependenciesData : [
                    { id : 1, fromEvent : 11, toEvent : 12 }
                ]
            }
        });

        t.wontFire(gantt.project, 'schedulingconflict');

        // we added listener, we have to continue propagation
        gantt.project.on('schedulingconflict', ({ continueWithResolutionResult }) => {
            continueWithResolutionResult();
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                const task = await gantt.addTaskBelow(gantt.taskStore.getById(121));

                t.is(task.startDate, new Date(2019, 4, 21), 'Task start is ok');
                t.is(task.endDate, new Date(2019, 4, 22), 'Task end is ok');
                t.is(task.duration, 1, 'Task duration is ok');
            }
        );
    });

    t.it('Appending a milestone should not throw', t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-05-20',
            endDate   : '2019-05-27',
            project   : {
                startDate : '2019-05-20',
                tasksData : [
                    {
                        id        : 1,
                        name      : 'Project A',
                        startDate : '2019-05-20',
                        duration  : 1,
                        expanded  : true,
                        children  : [
                            {
                                id        : 11,
                                name      : 'Task 11',
                                startDate : '2019-05-20',
                                duration  : 1
                            }
                        ]
                    }
                ],
                dependenciesData : [
                ]
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                const task = await gantt.addTask(gantt.taskStore.getById(11), { milestone : true });

                t.is(task.startDate, new Date(2019, 4, 20), 'Task start is ok');
                t.is(task.endDate, new Date(2019, 4, 20), 'Task end is ok');
                t.is(task.duration, 0, 'Task duration is ok');
            }
        );
    });

    t.it('Gantt tasks should animate to new state when modified', async t => {
        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : '2019-07-07',
            endDate   : '2019-07-29',
            project   : {
                startDate  : '2019-07-07',
                duration   : 30,
                eventsData : [
                    {
                        id       : 1,
                        name     : 'Project A',
                        duration : 30,
                        expanded : true,
                        children : [
                            {
                                id       : 11,
                                name     : 'Child 1',
                                duration : 5,
                                leaf     : true,
                                cls      : 'child1'
                            }
                        ]
                    }
                ]
            }
        });

        const
            project  = gantt.project,
            task11   = gantt.taskStore.getById(11),
            task11El = gantt.getElementFromTaskRecord(task11);

        let startTask11Rect, expectedTask11Data, startTime;

        t.chain(
            { waitForPropagate : project },

            // Wait for initial animation to be over
            { waitForSelectorNotFound : '.b-animating' },

            async() => {
                t.diag('Change position of task 11');

                // Capture start position
                startTask11Rect = Rectangle.from(task11El, gantt.timeAxisSubGridElement);

                // Make a long transition so we can determine that it moves slowly
                CSSHelper.insertRule('.b-animating .b-gantt-task-wrap { transition-duration: 5s !important; }');
                gantt.transitionDuration = 5000;

                // When we hit the end condition, *approx* 5000ms must have elapsed from here
                startTime = performance.now();

                // Move task into future and make it longer
                task11.set({
                    startDate : '2019-07-15',
                    endDate   : '2019-07-27',
                    duration  : 10
                });

                project.propagate();
            },

            // Wait for corrected data to get to the task
            { waitForPropagate : project },

            next => {
                const r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);

                // It must not start moving until the next AF
                t.is(r.x, startTask11Rect.x, 'Task has not started moving');
                t.is(r.width, startTask11Rect.width, 'Task has not started changing width');
                next();
            },

            { waitFor : 500 },

            // After 500 ms, it must not have moved to its final position
            next => {
                // Calculate the final position where it will animate to.
                expectedTask11Data = gantt.taskRendering.getTaskBox(task11);

                const r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                t.isLess(r.x, expectedTask11Data.left, 'Task has not reached its final position');
                t.isLess(r.width, expectedTask11Data.width, 'Task has not reached its funal width');
                next();
            },

            // Wait for final position and width to happen.
            {
                waitFor : () => {
                    const r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);

                    return r.x === expectedTask11Data.left && r.width === expectedTask11Data.width;
                },
                desc : 'Task has reached its final position and width'
            },

            // It must have taken Approx 5 seconds to get here
            () => {
                // .7 second margin due to slow test platforms
                t.isApprox(performance.now(), startTime + 5000, 700, 'Transition took correct time');
            }
        );
    });

    t.it('Tasks that starts/ends outside timeaxis should render correctly', async t => {
        const tickWidth = 150;

        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tickWidth,
            startDate             : new Date(2017, 0, 22),
            endDate               : new Date(2017, 0, 29)
        });

        assertTaskBox(t, 1000, -6 * tickWidth, 10, 19 * tickWidth);
        assertTaskBox(t, 1, -6 * tickWidth, 56, 10 * tickWidth);
        assertTaskBox(t, 2, 4 * tickWidth, 286, 9 * tickWidth);
        assertTaskBox(t, 22, 4 * tickWidth, 378, 4 * tickWidth);
        assertTaskBox(t, 23, null);
        assertTaskBox(t, 234, null);
    });

    t.it('Should trigger renderTask and releaseTask', t => {
        let renderCount = 0, releaseCount = 0;

        gantt = t.getGantt({
            listeners : {
                renderTask() {
                    renderCount++;
                },

                releaseTask() {
                    releaseCount++;
                }
            }
        });

        const initialRenderCount = renderCount;

        t.diag('Initial render');

        t.is(renderCount, document.querySelectorAll('.b-gantt-task').length, 'Correct render count');
        t.is(releaseCount, 0, 'Correct release count');

        t.diag('Remove task');

        gantt.taskStore.last.remove();

        t.is(renderCount, initialRenderCount, 'Correct render count');
        t.is(releaseCount, 1, 'Correct release count');
    });

    t.it('should not get a box for removed task', t => {
        gantt = t.getGantt();

        const task = gantt.taskStore.getById(11);

        task.remove();

        t.notOk(gantt.getTaskBox(task), 'No box returned for removed task');
    });

    t.it('should include task content element when using icon', t => {
        gantt = t.getGantt();

        t.selectorNotExists('.b-gantt-task-content', 'task content not found initially');

        gantt.taskStore.getAt(0).taskIconCls = 'b-fa b-fa-car';

        t.selectorExists('.b-gantt-task-content', 'task content found after assigning icon');
        t.selectorExists('.b-gantt-task-content i', 'icon found');
    });

    t.it('should use taskRenderer', t => {
        gantt = t.getGantt({
            taskRenderer({ taskRecord }) {
                if (taskRecord.id === 1) {
                    return;
                }

                if (taskRecord.id === 12) {
                    return null;
                }

                return taskRecord.name;
            }
        });

        gantt.taskStore.getAt(0).taskIconCls = 'b-fa b-fa-car';
        gantt.taskStore.getAt(2).taskIconCls = 'b-fa b-fa-air-freshener';

        t.selectorExists('.b-gantt-task:textEquals(Project A) i', 'taskRenderer used for parent');
        t.selectorExists('.b-gantt-task:textEquals(Investigate) i', 'taskRenderer used for child');
        t.selectorNotExists('.b-gantt-task:textEquals(undefined)', 'No undefined');
        t.selectorNotExists('.b-gantt-task:textEquals(null)', 'No null');
    });

    t.it('should work with taskRenderer returning DOM config', t => {
        gantt = t.getGantt({
            taskRenderer({ taskRecord }) {
                return {
                    tag  : 'b',
                    html : taskRecord.name
                };
            }
        });

        t.selectorExists('.b-gantt-task b:textEquals(Project A)', 'taskRenderer used for parent');
        t.selectorExists('.b-gantt-task b:textEquals(Investigate)', 'taskRenderer used for child');
    });

    t.it('should work with taskRenderer returning HTML string', t => {
        gantt = t.getGantt({
            taskRenderer({ taskRecord }) {
                return `<b>${taskRecord.name}</b>`;
            }
        });

        t.selectorExists('.b-gantt-task b:textEquals(Project A)', 'taskRenderer used for parent');
        t.selectorExists('.b-gantt-task b:textEquals(Investigate)', 'taskRenderer used for child');
    });

    // https://github.com/bryntum/support/issues/255
    t.it('Should show tasks after adding columns to locked grid with schedule region collapsed ', async t => {
        gantt = t.getGantt();

        t.chain(
            { waitForRowsVisible : gantt },

            () => gantt.subGrids.normal.collapse(),

            next => {
                gantt.columns.add({ region : 'locked', text : 'foo' });
                next();
            },

            () => gantt.subGrids.normal.expand(),

            { waitForElementTop : '.b-gantt-task' }
        );
    });

    // https://github.com/bryntum/support/issues/399
    t.it('Should calculate width if a milestone gets duration', t => {
        gantt = t.getGantt();

        const task = gantt.taskStore.getById(14);

        let oldWidth;

        t.chain(
            { waitForRowsVisible : gantt },

            next => {
                oldWidth = gantt.getElementFromTaskRecord(task).offsetWidth;
                next();
            },

            () => task.setDuration(10),

            { waitFor : () => gantt.getElementFromTaskRecord(task).offsetWidth > oldWidth, desc : 'Task has a width greater than when it was a milestone' }
        );
    });

    t.it('Should accept wrapperCls string value in taskRenderer', t => {
        gantt = t.getGantt({
            taskRenderer({ taskRecord, renderData }) {
                renderData.wrapperCls += 'foo';
            }
        });

        t.chain(
            { waitForSelector : '.b-gantt-task-wrap.foo' }
        );
    });
});
