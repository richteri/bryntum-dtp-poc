import { ProjectGenerator, BrowserHelper, VersionHelper } from '../../build/gantt.module.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should render dependencies regardless of barMargin size', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            tasks                 : [
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
                    startDate         : '2017-01-24',
                    manuallyScheduled : true,
                    duration          : 1
                },
                {
                    id                : 3,
                    name              : 'Task 3',
                    cls               : 'task3',
                    startDate         : '2017-01-26',
                    manuallyScheduled : true,
                    duration          : 0
                }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 2 },
                { id : 2, fromEvent : 1, toEvent : 3 }
            ]
        });

        const dependencies = gantt.dependencies;

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-sch-dependency' },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                gantt.barMargin = 13;
            },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                gantt.barMargin = 17;
            },
            next => {
                dependencies.forEach(dep => t.assertDependency(gantt, dep));
            }
        );
    });

    t.it('Should not throw for invalid assignments', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            features              : {
                dependencies : true
            },
            resources : [
                { id : 1, name : 'Albert' }
            ],
            tasks : [
                { id : 1, startDate : '2017-01-16', duration : 2 }
            ],
            assignments : [
                { id : 1, resourceId : 1, eventId : 1 }
            ]
        });

        t.livesOk(() => {
            gantt.project.getAssignmentStore().add([
                { id : 2, resourceId : 1, eventId : 2 },
                { id : 3, resourceId : 2, eventId : 1 },
                { id : 4, resourceId : 2, eventId : 2 }
            ]);
        }, 'Lives ok when adding assignment to non existent dependency');
    });

    t.it('Should correctly draw dependencies on task add/remove', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false
        });

        const
            stm = gantt.project.stm,
            taskStore = gantt.taskStore;

        t.chain(
            { waitForPropagate : gantt },
            next => {
                stm.enable();

                t.waitForEvent(gantt, 'dependenciesdrawn', next);

                stm.startTransaction('remove');
                taskStore.getById(12).remove();
                stm.stopTransaction('remove');
            },
            { waitForPropagate : gantt },
            next => {
                t.subTest('Dependencies are ok after removing task', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.undo();
            },
            { waitForPropagate : gantt },
            next => {
                t.subTest('Dependencies are ok after undo', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.startTransaction();
                taskStore.beginBatch();
                taskStore.getById(12).remove();
                taskStore.getById(1).appendChild({ name : 'test' });
                taskStore.endBatch();
                stm.stopTransaction();
            },
            next => {
                t.subTest('Dependencies are ok after batching', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
                stm.undo();
            },
            () => {
                t.subTest('Dependencies are ok after undo', t => {
                    gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
                });
            }
        );
    });

    // TODO: Going to refactor dependency rendering to use DomSync
    t.snooze('2020-09-01'/*'Should avoid forced reflow during refresh'*/, t => {
        gantt = t.getGantt({
            enableEventAnimations : false,
            tasks                 : [
                { id : 1, startDate : '2017-01-16', duration : 1 },
                { id : 2, startDate : '2017-01-16', duration : 1 },
                { id : 3, startDate : '2017-01-16', duration : 1 },
                { id : 4, startDate : '2017-01-17', duration : 1 }
            ],
            dependencies : [
                { id : 1, fromEvent : 1, toEvent : 4 },
                { id : 2, fromEvent : 2, toEvent : 4 },
                { id : 3, fromEvent : 3, toEvent : 4 }
            ]
        });

        function setupOverrides() {
            const
                feature              = gantt.features.dependencies,
                oldGetBox            = feature.getBox,
                oldDrawDependency    = feature.drawDependency,
                oldReleaseDependency = feature.releaseDependency;

            let drawCounter   = 0,
                getBoxCounter = 0;

            feature.getBox = function() {
                if (drawCounter !== 0) {
                    t.fail('Referring to getBox after drawing dependency forces reflow');
                }
                ++getBoxCounter;
                return oldGetBox.apply(feature, arguments);
            };

            feature.drawDependency = function() {
                ++drawCounter;
                return oldDrawDependency.apply(feature, arguments);
            };

            feature.releaseDependency = function() {
                if (getBoxCounter !== 0) {
                    t.fail('Releasing dependency after filling cache forces reflow');
                }
                return oldReleaseDependency.apply(feature, arguments);
            };
        }

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.project.on({
                    commit() {
                        setupOverrides();
                    },
                    once : true
                });
            },
            { drag : '.b-gantt-task', by : [50, 0] },
            { waitFor : 1000 }
        );
    });

    t.it('Should avoid forced reflow during scroll', async t => {
        const config = await ProjectGenerator.generateAsync(100, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            appendTo  : document.body,
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        function setupOverrides() {
            const
                feature              = gantt.features.dependencies,
                oldGetBox            = feature.getBox,
                oldDrawDependency    = feature.drawDependency;

            let drawCounter = 0;

            feature.getBox = function() {
                if (drawCounter !== 0) {
                    t.fail('Referring to getBox after drawing dependency forces reflow');
                }
                return oldGetBox.apply(feature, arguments);
            };

            feature.drawDependency = function() {
                ++drawCounter;
                return oldDrawDependency.apply(feature, arguments);
            };
        }

        t.chain(
            { waitForPropagate : gantt },
            gantt.depsAlreadyDrawn ? null : { waitForEvent : [gantt, BrowserHelper.isIE11 ? 'dependenciesdrawn' : 'transitionend'] },
            { waitForAnimationFrame : null },
            next => {
                setupOverrides();

                gantt.scrollTaskIntoView(gantt.taskStore.last).then(() => {
                    t.waitForEvent(gantt, 'dependenciesdrawn', next);
                });
            }
        );
    });

    t.it('Should clear dependencies cache when clearing task store', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        t.chain(
            { waitForPropagate : gantt },
            next => {
                gantt.taskStore.removeAll();
                gantt.taskStore.add({});
                gantt.features.dependencies.draw();

                t.waitForEvent(gantt, 'dependenciesdrawn', next);
            },
            next => {
                t.selectorCountIs('.b-sch-dependency', 0, 'No dependencies are rendered');
            }
        );
    });

    // https://github.com/bryntum/bryntum-suite/issues/122
    t.it('should not draw dependencies for removed task', t => {
        gantt = t.getGantt({
            appendTo           : document.body,
            useEventAnimations : false
        });

        t.chain(
            { waitForPropagate : gantt },

            next => {
                window.brk = true;
                gantt.taskStore.getById(11).remove();
                next();
            },

            { waitForPropagate : gantt },

            { waitForAnimationFrame : null },

            () => {
                t.selectorNotExists('polyline[depId="1"]', 'Dependency line gone');
            }
        );
    });

    // https://github.com/bryntum/support/issues/139
    t.it('Dependency line between milestones shouldn\'t disappear', t => {
        gantt = t.getGantt({
            appendTo              : document.body,
            enableEventAnimations : false,
            startDate             : '2020-02-03',
            endDate               : '2020-02-09',

            project : {
                // set to `undefined` to overwrite the default '2017-01-16' value in `t.getProject`
                startDate  : undefined,
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Milestone 1',
                        startDate : '2020-02-06',
                        endDate   : '2020-02-06'
                    },
                    {
                        id        : 2,
                        name      : 'Milestone 2',
                        startDate : '2020-02-06',
                        endDate   : '2020-02-06'
                    }
                ],
                dependenciesData : [
                    { id : 1, fromEvent : 1, toEvent : 2 }
                ]
            }
        });

        t.chain(
            { waitForPropagate : gantt },

            { waitForSelector : '.b-sch-dependency', desc : 'Should have dependency line' }
        );
    });

    t.it('Should update dependencies when task is partially outside the view', t => {
        gantt = t.getGantt({
            enableEventAnimations : false,
            startDate             : '2020-02-02',
            endDate               : '2020-02-09',

            project : {
                startDate  : '2020-02-08',
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Task 1',
                        startDate : '2020-02-08',
                        endDate   : '2020-02-09'
                    },
                    {
                        id        : 2,
                        name      : 'Task 2',
                        startDate : '2020-02-09',
                        endDate   : '2020-02-10'
                    }
                ],
                dependenciesData : [
                    { id : 1, fromEvent : 1, toEvent : 2 }
                ]
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            { drag : '[data-task-id="1"]', by : [-100, 0], dragOnly : true, desc : 'Should be draggable' },
            { waitForSelector : '.b-sch-dependency', desc : 'Should have dependency line' },
            { mouseup : null }
        );
    });

    // https://github.com/bryntum/support/issues/577
    t.it('Clean up Dependencies.updateDependenciesForTimeSpan', t => {
        if (VersionHelper.checkVersion('Scheduler', '4.0.0', '>=')) {
            t.fail('Time to clean up!');
        }
    });

});
