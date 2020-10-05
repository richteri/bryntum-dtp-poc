import { BrowserHelper } from '../../build/gantt.module.js';

StartTest(t => {
    let gantt;

    t.beforeEach(t => gantt && gantt.destroy());

    function assertHorizontalBreakOnRowBorder(t, dependencyId, taskId, expectedPoints = 6) {
        t.assertHorizontalBreakOnRowBorder(gantt, dependencyId, taskId, expectedPoints);
    }

    t.it('Should render and update dependencies (w/o provided project)', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            columns : [
                { type : 'name' }
            ]
        });

        t.chain(
            async() => {
                await Promise.all([
                    gantt.project.waitForPropagateCompleted(),
                    gantt.await('dependenciesDrawn')
                ]);
            },

            { drag : '.b-gantt-task.id11', by : [gantt.tickSize, 0] },

            async() => {
                await gantt.project.waitForPropagateCompleted();

                await gantt.await('dependenciesDrawn', { checkLog : false });
            },

            { waitForAnimations : null },

            () => {
                gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
            }
        );
    });

    t.it('Dependency break line is aligned with row boundary (task to task)', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name' }
            ],
            tasks : [
                {
                    id       : 1,
                    name     : 'Task to task over task (backwards)',
                    expanded : true,
                    children : [
                        {
                            id        : 11,
                            name      : 'Task 11',
                            cls       : 'task11',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 12,
                            name      : 'Task 12',
                            cls       : 'task12',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id             : 13,
                            name           : 'Task 13',
                            cls            : 'task13',
                            startDate      : '2017-01-16',
                            duration       : 2,
                            constraintType : 'muststarton',
                            constraintDate : '2017-01-16',
                            leaf           : true
                        }
                    ]
                },
                {
                    id       : 2,
                    name     : 'Task to task over task',
                    expanded : true,
                    children : [
                        {
                            id        : 21,
                            name      : 'Task 21',
                            cls       : 'task21',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 22,
                            name      : 'Task 22',
                            cls       : 'task22',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 23,
                            name      : 'Task 23',
                            cls       : 'task23',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        }
                    ]
                },
                {
                    id       : 3,
                    name     : 'Task to task over task (bottom to top)',
                    expanded : true,
                    children : [
                        {
                            id        : 31,
                            name      : 'Task 31',
                            cls       : 'task31',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 32,
                            name      : 'Task 32',
                            cls       : 'task32',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 33,
                            name      : 'Task 33',
                            cls       : 'task33',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        }
                    ]
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 11, toEvent : 13 },
                { id : 2, fromEvent : 21, toEvent : 23 },
                { id : 3, fromEvent : 33, toEvent : 31 }
            ],
            enableEventAnimations : false
        });

        t.chain(
            async() => {
                await Promise.all([
                    gantt.project.waitForPropagateCompleted(),
                    gantt.await('dependenciesDrawn', { checkLog : false })
                ]);
                gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                assertHorizontalBreakOnRowBorder(t, 1, 12);
                assertHorizontalBreakOnRowBorder(t, 2, 22, 3);
                assertHorizontalBreakOnRowBorder(t, 3, 31);
            }
        );
    });

    t.it('Dependency break line is aligned with row boundary (task/milestone)', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name' }
            ],
            tasks : [
                {
                    id       : 4,
                    name     : 'Task to milestone over task',
                    expanded : true,
                    children : [
                        {
                            id        : 41,
                            name      : 'Task 41',
                            cls       : 'task41',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 42,
                            name      : 'Task 42',
                            cls       : 'task42',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 43,
                            name      : 'Task 43',
                            cls       : 'task43',
                            startDate : '2017-01-16',
                            duration  : 0,
                            leaf      : true
                        }
                    ]
                },
                {
                    id       : 5,
                    name     : 'Task to milestone over task (forward)',
                    expanded : true,
                    children : [
                        {
                            id        : 51,
                            name      : 'Task 51',
                            cls       : 'task51',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 52,
                            name      : 'Task 52',
                            cls       : 'task52',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id             : 53,
                            name           : 'Task 53',
                            cls            : 'task53',
                            startDate      : '2017-01-16',
                            duration       : 0,
                            constraintType : 'muststarton',
                            constraintDate : '2017-01-19',
                            leaf           : true
                        }
                    ]
                },
                {
                    id       : 6,
                    name     : 'Milestone to task over task',
                    expanded : true,
                    children : [
                        {
                            id        : 61,
                            name      : 'Task 61',
                            cls       : 'task61',
                            startDate : '2017-01-16',
                            duration  : 0,
                            leaf      : true
                        },
                        {
                            id        : 62,
                            name      : 'Task 62',
                            cls       : 'task62',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id        : 63,
                            name      : 'Task 63',
                            cls       : 'task63',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        }
                    ]
                },
                {
                    id       : 7,
                    name     : 'Milestone to task over task (forward)',
                    expanded : true,
                    children : [
                        {
                            id        : 71,
                            name      : 'Task 71',
                            cls       : 'task71',
                            startDate : '2017-01-16',
                            duration  : 0,
                            leaf      : true
                        },
                        {
                            id        : 72,
                            name      : 'Task 72',
                            cls       : 'task72',
                            startDate : '2017-01-16',
                            duration  : 2,
                            leaf      : true
                        },
                        {
                            id             : 73,
                            name           : 'Task 73',
                            cls            : 'task73',
                            startDate      : '2017-01-16',
                            duration       : 2,
                            constraintType : 'muststarton',
                            constraintDate : '2017-01-18',
                            leaf           : true
                        }
                    ]
                }
            ],
            dependencies : [
                { id : 4, fromEvent : 41, toEvent : 43 },
                { id : 5, fromEvent : 51, toEvent : 53 },
                { id : 6, fromEvent : 61, toEvent : 63 },
                { id : 7, fromEvent : 71, toEvent : 73 }
            ],
            enableEventAnimations : false
        });

        t.chain(
            { waitForPropagate : gantt },
            gantt.depsAlreadyDrawn ? { waitFor : 1 } : { waitForEvent : [gantt, 'dependenciesdrawn'] },
            () => {
                gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                assertHorizontalBreakOnRowBorder(t, 4, 42);
                assertHorizontalBreakOnRowBorder(t, 5, 52, 3);
                assertHorizontalBreakOnRowBorder(t, 6, 62);
                assertHorizontalBreakOnRowBorder(t, 7, 62, 3);
            }
        );
    });

    t.it('Should render dependencies correctly during dragdrop', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name' }
            ],
            features : {
                taskTooltip : false,
                taskDrag    : {
                    showTooltip : false
                }
            },
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    cls       : 'task1',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                },
                {
                    id        : 2,
                    name      : 'task 2',
                    cls       : 'task2',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                },
                {
                    id        : 3,
                    name      : 'task 3',
                    cls       : 'task3',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                },
                {
                    id        : 4,
                    name      : 'task 4',
                    cls       : 'task4',
                    startDate : '2017-01-16',
                    duration  : 0,
                    leaf      : true
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 },
                { id : 2, fromEvent : 3, toEvent : 4 }
            ]
        });

        let [dep1, dep2] = gantt.dependencies;

        t.chain(
            { waitForPropagate : gantt },

            gantt.depsAlreadyDrawn ? null : { waitForEvent : [gantt, 'dependenciesdrawn'] },

            { drag : '.b-gantt-task.task1', by : [100, 0], dragOnly : true },

            next => {
                t.assertDependency(gantt, dep1, { toSide : 'left' });
                assertHorizontalBreakOnRowBorder(t, dep1, 1);
                next();
            },

            { moveMouseBy : [-95, 0] },

            next => {
                t.assertDependency(gantt, dep1, { toSide : 'left' });
                assertHorizontalBreakOnRowBorder(t, dep1, 1);
                next();
            },

            { moveMouseBy : [-5, 0] },

            next => {
                t.assertDependency(gantt, dep1);
                assertHorizontalBreakOnRowBorder(t, dep1, 1, 3);
                next();
            },

            { mouseUp : null },

            { drag : '.b-gantt-task.task3', by : [100, 0], dragOnly : true },

            next => {
                t.assertDependency(gantt, dep2, { toSide : 'left' });
                assertHorizontalBreakOnRowBorder(t, dep2, 3);
                next();
            },

            { moveMouseBy : [-100, 0] },

            next => {
                t.assertDependency(gantt, dep2);
                assertHorizontalBreakOnRowBorder(t, dep2, 3);
                next();
            },

            { mouseUp : null }
        );
    });

    t.it('Should render dependencies correctly during dragdrop when mouse is outside of the element', t => {
        gantt = t.getGantt({
            height   : 300,
            columns  : [
                { type : 'name' }
            ],
            features : {
                taskTooltip : false,
                taskDrag    : {
                    showTooltip : false
                }
            },
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    cls       : 'task1',
                    startDate : '2017-01-16',
                    duration  : 2
                },
                {
                    id        : 2,
                    name      : 'task 2',
                    cls       : 'task2',
                    startDate : '2017-01-16',
                    duration  : 2
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 }
            ]
        });

        let [dep1] = gantt.dependencies;

        t.chain(
            { waitForPropagate : gantt },

            { drag : '.b-gantt-task.task1', by : [100, 0], dragOnly : true },

            next => {
                t.assertDependency(gantt, dep1, { toSide : 'left' });
                assertHorizontalBreakOnRowBorder(t, dep1, 1);
                next();
            },

            { moveMouseBy : [0, 300], desc : 'Move pointer below the gantt element' },

            { moveMouseBy : [100, 0] },

            next => {
                t.assertDependency(gantt, dep1, { toSide : 'left' });
                assertHorizontalBreakOnRowBorder(t, dep1, 1);
                next();
            },

            { moveMouseBy : [-200, 0] },

            next => {
                t.assertDependency(gantt, dep1, { toSide : 'top-left' });
                assertHorizontalBreakOnRowBorder(t, dep1, 1, 3);
                next();
            },

            { mouseUp : null }
        );
    });

    t.it('Should render dependencies effectively on event change', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name' }
            ],
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                },
                {
                    id             : 2,
                    name           : 'task 2',
                    startDate      : '2017-01-16',
                    duration       : 2,
                    constraintType : 'muststarton',
                    constraintDate : '2017-01-18',
                    leaf           : true
                }
            ],
            dependencies : [
                { fromEvent : 1, toEvent : 2 }
            ]
        });

        const event = gantt.taskStore.getById(2);

        t.chain(
            { waitForPropagate : gantt },
            gantt.depsAlreadyDrawn ? null : { waitForEvent : [gantt, 'dependenciesdrawn'] },
            next => {
                t.isCalledNTimes('drawDependency', gantt.features.dependencies, 3);
                t.isCalledNTimes('findPath', gantt.features.dependencies.pathFinder, 3);

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                event.setConstraintDate(new Date(2017, 0, 19));
            },
            next => {
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                event.setConstraintDate(new Date(2017, 0, 20));
            },
            next => {
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                event.setConstraintDate(new Date(2017, 0, 23));
            }
        );
    });

    t.it('Should render dependencies effectively on dependency change', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name' }
            ],
            tasks : [
                {
                    id        : 1,
                    name      : 'task 1',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                },
                {
                    id        : 2,
                    name      : 'task 2',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                }
            ],
            dependencies : [
                { fromEvent : 1, toEvent : 2 }
            ],
            enableEventAnimations : false
        });

        const dep = gantt.dependencies[0];

        t.chain(
            { waitForPropagate : gantt },
            gantt.depsAlreadyDrawn ? null : next => t.waitForEvent(gantt, 'dependenciesdrawn', next),
            next => {
                t.isCalledNTimes('drawDependency', gantt.features.dependencies, 3);
                t.isCalledNTimes('findPath', gantt.features.dependencies.pathFinder, 3);

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                dep.setLag(2);
            },
            next => {
                t.assertDependency(gantt, dep);
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                dep.setLag(3);
            },
            next => {
                t.assertDependency(gantt, dep);
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                dep.setLag(-2);
            },
            next => {
                t.assertDependency(gantt, dep);
            }
        );
    });

    t.it('Should render dependencies to tasks outside of the view', t => {
        gantt = t.getGantt({
            tasks    : [
                {
                    id                : 1,
                    name              : 'Task 1',
                    startDate         : '2017-01-23',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 2,
                    name              : 'Task 2',
                    startDate         : '2017-01-23',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 3,
                    name              : 'Task 3',
                    cls               : 'task3',
                    startDate         : '2017-01-25',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 4,
                    name              : 'Task 4',
                    startDate         : '2017-01-27',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 5,
                    name              : 'Task 5',
                    startDate         : '2017-01-27',
                    manuallyScheduled : true,
                    duration          : 1
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 3 },
                { id : 2, fromEvent : 3, toEvent : 2, type : 1 },
                { id : 3, fromEvent : 3, toEvent : 4, type : 0 },
                { id : 4, fromEvent : 5, toEvent : 3, type : 3 }
            ],
            viewPreset : 'dayAndWeek',
            startDate  : '2017-01-24',
            endDate    : '2017-01-27'
        });

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },
            next => {
                gantt.dependencies.forEach(dep => {
                    t.assertDependency(gantt, dep);
                });

                next();
            },

            { drag : '.b-gantt-task.task3', by : [100, 0], dragOnly : true },

            next => {
                const deps = gantt.dependencies;

                deps.forEach(dep => {
                    t.assertDependency(gantt, dep);
                    if ([2, 3].indexOf(dep.id) !== -1) {
                        const element = gantt.getElementForDependency(dep);
                        t.is(getComputedStyle(element).markerStart, 'none', 'Marker removed');
                        t.ok(element.classList.contains('b-sch-dependency-ends-outside'));
                    }
                });

                next();
            },

            { mouseup : null }
        );
    });

    t.it('Should render dependencies to milestones outside of the view', t => {
        gantt = t.getGantt({
            tasks    : [
                {
                    id                : 1,
                    name              : 'Task 1',
                    startDate         : '2017-01-23',
                    manuallyScheduled : true,
                    duration          : 0
                },
                {
                    id                : 2,
                    name              : 'Task 2',
                    startDate         : '2017-01-24',
                    manuallyScheduled : true,
                    duration          : 0
                },
                {
                    id                : 3,
                    name              : 'Task 3',
                    cls               : 'task3',
                    startDate         : '2017-01-25',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 4,
                    name              : 'Task 4',
                    startDate         : '2017-01-27',
                    manuallyScheduled : true,
                    duration          : 0
                },
                {
                    id                : 5,
                    name              : 'Task 5',
                    startDate         : '2017-01-28',
                    manuallyScheduled : true,
                    duration          : 0
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 3, toEvent : 1, type : 0 },
                { id : 2, fromEvent : 3, toEvent : 2, type : 1 },
                { id : 3, fromEvent : 3, toEvent : 4 },
                { id : 4, fromEvent : 3, toEvent : 5 }
            ],
            weekStartDay          : 1,
            viewPreset            : 'dayAndWeek',
            startDate             : '2017-01-24',
            endDate               : '2017-01-27',
            enableEventAnimations : false
        });

        function assertMilestoneDep(dep) {
            let markerShouldExist = false,
                element = gantt.getElementForDependency(dep),
                classExists = element.classList.contains('b-sch-dependency-ends-outside');

            if (dep.id === 2 || dep.id === 3) {
                markerShouldExist = true;
            }

            // Edge doesn't support auto-reversing markers, so we use specific style to draw arrows for dependency lines
            t.like(getComputedStyle(element).markerStart, markerShouldExist ? (BrowserHelper.isEdge ? 'arrowStart' : 'arrowEnd') : 'none', `Marker is correct for dependency ${dep.id}`);
            t.ok(markerShouldExist ? !classExists : classExists, 'Line class is ok');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },
            next => {
                gantt.dependencies.forEach(dep => {
                    t.assertDependency(gantt, dep);
                });

                next();
            },

            { drag : '.b-gantt-task.task3', by : [100, 0], dragOnly : true },

            next => {
                const deps = gantt.dependencies;

                deps.forEach(dep => {
                    t.assertDependency(gantt, dep);
                    assertMilestoneDep(dep);
                });

                const depEl = gantt.getElementForDependency(deps[3]);
                const lineEnd = parseInt(depEl.getAttribute('points').match(/(\d+)?,/)[1]);

                t.isGreater(lineEnd, gantt.timeAxisViewModel.totalSize, 'Last dependency vertical line is hidden');

                next();
            },

            { mouseup : null }
        );
    });

    t.it('Dependency line should hide, and not reappear when one end is indented', t => {
        gantt = t.getGantt({
            columns  : [
                { type : 'name', field : 'name', text : 'Name', width : 250 }
            ],
            tasks : [
                {
                    id           : 1,
                    name         : 'This becomes a parent',
                    startDate    : '2017-01-16',
                    endDate      : '2017-01-17',
                    duration     : 1,
                    durationUnit : 'd'
                },
                {
                    id           : 2,
                    name         : 'This becomes a child',
                    startDate    : '2017-01-16',
                    endDate      : '2017-01-17',
                    duration     : 1,
                    durationUnit : 'd'
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 }
            ],
            startDate : '2017-01-15',
            endDate   : '2017-01-22'
        });

        const
            t1 = gantt.taskStore.getById(1),
            t2 = gantt.taskStore.getById(2),
            dep = gantt.dependencyStore.getAt(0);

        t.chain(
            { waitForPropagate : gantt },
            gantt.depsAlreadyDrawn ? null : { waitForEvent : [gantt, 'dependenciesdrawn'] },
            next => {
                // There should be one dependency line
                t.selectorCountIs('.b-sch-dependency', gantt.element, 1);

                // Remove the single dependency
                gantt.dependencyStore.remove(dep);

                // There should be no dependency lines
                t.selectorCountIs('.b-sch-dependency', gantt.element, 0);

                t1.appendChild(t2);
                gantt.project.propagate().then(next);
            },
            next => {
                gantt.features.tree.toggleCollapse(t1, false);

                // There should be no dependency lines
                t.selectorCountIs('.b-sch-dependency', gantt.element, 0);

                next();
            },
            { waitFor : 100 },
            () => {
                // There should STILL be no dependency lines
                t.selectorCountIs('.b-sch-dependency', gantt.element, 0);
            }
        );
    });
});
