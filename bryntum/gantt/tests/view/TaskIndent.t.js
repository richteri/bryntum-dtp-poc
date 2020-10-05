import TaskModel from '../../lib/Gantt/model/TaskModel.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';

StartTest(t => {

    window.AjaxHelper = AjaxHelper;

    let gantt, project;

    t.beforeEach(() => gantt && gantt.destroy());

    function getGantt(projectConfig) {
        projectConfig = Object.assign({
            startDate  : '2017-06-19',
            eventsData : [
                {
                    id        : 11,
                    name      : 'Node 11',
                    startDate : '2017-06-19',
                    endDate   : '2017-06-24',
                    expanded  : true,
                    children  : [
                        {
                            id        : 1,
                            name      : 'Node 1',
                            startDate : '2017-06-19',
                            endDate   : '2017-06-24'
                        },
                        {
                            id        : 2,
                            name      : 'Node 2',
                            startDate : '2017-06-19',
                            endDate   : '2017-06-24',
                            expanded  : true,
                            children  : [
                                {
                                    id        : 3,
                                    name      : 'Node 3',
                                    startDate : '2017-06-19',
                                    endDate   : '2017-06-24'
                                },
                                {
                                    id        : 4,
                                    name      : 'Node 4',
                                    startDate : '2017-06-19',
                                    endDate   : '2017-06-24'
                                },
                                {
                                    id        : 5,
                                    name      : 'Node 5',
                                    startDate : '2017-06-19',
                                    endDate   : '2017-06-24'
                                }
                            ]
                        }
                    ]
                }
            ]
        }, projectConfig);

        gantt = t.getGantt({
            height    : 700,
            appendTo  : document.body,
            project   : projectConfig,
            startDate : projectConfig.startDate
        });
        project = gantt.project;

        return gantt;
    }

    t.it('Sanity', t => {
        const
            taskStore = getGantt().taskStore,
            node11    = taskStore.getById(11),
            node2     = taskStore.getById(2),
            node3     = taskStore.getById(3),
            node4     = taskStore.getById(4),
            node5     = taskStore.getById(5);

        t.notOk(node2.isLeaf, 'Task 2 is not leaf');
        t.ok(node3.isLeaf, 'Task 3 is leaf');

        // outdenting a task which should stay at the same level and get 2 children
        t.is(node3.parentIndex, 0, 'Node3 has parentIndex 0');

        t.chain(
            { waitForPropagate : project },

            next => {
                gantt.outdent(node3).then(next);
            },

            next => {
                t.is(node11.children.length, 3, 'Topmost task now has 3 child nodes');
                t.ok(node2.isLeaf, TaskModel.convertEmptyParentToLeaf, 'Task 2 is still a parent after task 3 outdent');
                t.is(node3.parentIndex, 2, 'Node3 now has parentIndex 2');

                t.isDeeply(node3.children, [node4, node5], 'Task 3 now has tasks 4 and 5 as children');

                // indenting it back - should restore the previous state

                gantt.indent(node3).then(next);
            },

            next => {
                t.notOk(node2.isLeaf, 'Task 2 is not leaf after task 3 indent');

                t.isDeeply(node2.children.length, 1, 'Task 2 now has tasks 3 as only child');

                t.is(node3.parentIndex, 0, 'Node3 is first child of node2');

                // clearing the dirty flag()
                node3.clearChanges();

                t.notOk(node3.isModified, 'Node3 is now clean');

                // indenting node3 one more time + its children - nothing should happen
                gantt.indent([node3, node4, node5]).then(next);
            },

            () => {
                t.isDeeply(node2.children, [node3], 'Task 2 now has task 4 as children');
                t.ok(node4.isLeaf, 'Task 4 has no children');

                t.ok(node4.isModified, 'Node4 dirty after indent');
                t.ok(node5.isModified, 'Node5 dirty after indent');
            }
        );
    });

    t.it('Should see 2 indented tasks in a parent stay on the same level', t => {
        const taskStore = getGantt().taskStore,
            node2     = taskStore.getById(2),
            node3     = taskStore.getById(3),
            node4     = taskStore.getById(4),
            node5     = taskStore.getById(5);

        t.chain(
            { waitForPropagate : project },

            next => {
                gantt.indent([node4, node5]).then(next);
            },

            next => {
                t.isDeeply(node3.children, [node4, node5], 'Task 3 now has tasks 4,5 as children');
                t.is(node4.parentIndex, 0);
                t.is(node5.parentIndex, 1);
                next();
            },

            next => {
                gantt.outdent([node4, node5]).then(next);
            },

            next => {
                t.isDeeply(node2.children.map(n => {
                    return n.id;
                }), [3, 4, 5], 'Task 2 now has tasks 3,4,5 as children');

                gantt.indent([node5, node4]).then(next);
            },

            () => {
                t.isDeeply(node3.children.map(n => {
                    return n.id;
                }), [4, 5], 'Task 3 now has tasks 4,5 as children, even if tasks are passed in wrong order');
            }
        );
    });

    /** Can't implement this test right now
    t.it('Should not indent project nodes', t => {
        var taskStore = getGantt({
            eventsData : [
                {
                    id        : 1,
                    startDate : '2010-01-04',
                    duration  : 4,
                    TaskType  : 'Gnt.model.Project'
                },
                {
                    id        : 2,
                    startDate : '2010-01-04',
                    duration  : 4,
                    TaskType  : 'Gnt.model.Project'
                }
            ]
        });

        t.wontFire(taskStore, ['update', 'datachanged', 'remove', 'add']);
        t.firesOk({
            observable : taskStore,
            events     : {
                beforeindentationchange : 1,
                indentationchange       : 1
            }
        });

        gantt.indent(taskStore.getById(2));
        gantt.outdent(taskStore.getById(2));
    });
    */

    t.it('Should handle `false` returned from project#beforeOutdent listener for outdent operation', t => {
        var taskStore = getGantt({
            startDate  : '2010-01-04',
            eventsData : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    startDate : '2010-01-04',
                    duration  : 4,
                    expanded  : true,
                    children  : [
                        {
                            id        : 2,
                            name      : 'Task 2',
                            startDate : '2010-01-04',
                            duration  : 4
                        }
                    ]
                }
            ]
        }).taskStore;

        taskStore.project.on({
            beforeoutdent() {
                return false;
            }
        });
        const
            storageGeneration = taskStore.storage.generation,
            node1             = taskStore.getById(1),
            node2             = taskStore.getById(2);

        t.chain(
            { waitForPropagate : project },

            next => {
                t.wontFire(taskStore, ['update', 'change', 'remove', 'add']);
                gantt.outdent(node2).then(next);
            },

            () => {
                t.is(taskStore.storage.generation, storageGeneration);
                t.notOk(node1.isLeaf);
                t.ok(node2.isLeaf);
                t.expect(node2.parent).toBe(node1);
                t.expect(node2.parentId).toBe(1);
            }
        );
    });

    t.it('Should handle `false` returned from project#beforeIndent listener for indent operation', t => {
        var taskStore = getGantt({
            eventsData : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    startDate : '2010-01-04',
                    duration  : 4
                },
                {
                    id        : 2,
                    name      : 'Task 2',
                    startDate : '2010-01-04',
                    duration  : 4
                }
            ]
        }).taskStore;

        taskStore.project.on({
            beforeindent() {
                return false;
            }
        });
        const
            storageGeneration = taskStore.storage.generation,
            node1             = taskStore.getById(1),
            node2             = taskStore.getById(2);

        t.chain(
            { waitForPropagate : project },

            next => {
                t.wontFire(taskStore, ['update', 'change', 'remove', 'add']);
                gantt.indent(node2).then(next);
            },

            () => {
                t.is(taskStore.storage.generation, storageGeneration);
                t.expect(node1.isLeaf).toBe(true);
                t.expect(node2.previousSibling.id).toBe(1);
            }
        );
    });

    // https://github.com/bryntum/support/issues/317
    t.it('Outdent should keep task position in tree structure', t => {
        const
            taskStore = getGantt().taskStore,
            node4     = taskStore.getById(4),
            node5     = taskStore.getById(5);

        t.chain(
            { waitForPropagate : project },

            () => gantt.outdent(node4),

            () => {
                t.notOk(node4.isLeaf, 'Task 4 is parent now');
                t.isDeeply(node4.children, [node5], 'Task 2 received task 5 as child');

                t.is(node4.parentIndex, 2, 'Node4 kept place after outdent');
                t.ok(node4.isExpanded(taskStore), 2, 'Node4 was expanded after outdent');
                t.ok(node4.isModified, 'Node4 dirty after outdent');
                t.ok(node5.isModified, 'Node5 dirty after outdent');
            }
        );
    });

    // https://github.com/bryntum/support/issues/367
    t.it('Should fire change event after indent operation', t => {
        const
            taskStore = getGantt({
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2
                    },
                    {
                        id        : 2,
                        name      : 'Task 2',
                        startDate : '2020-04-01',
                        duration  : 2
                    }
                ]
            }).taskStore,
            task1     = taskStore.getById(1),
            task2     = taskStore.getById(2);

        t.firesOk(taskStore, 'indent', 1, 'Indent event is fired');
        t.firesOk(taskStore, 'change', 1, 'Change event is fired');

        t.chain(
            { waitForPropagate : project },

            () => taskStore.commit(),

            next => {
                t.notOk(task1.rawModifications, 'Task 1 is not modified');
                t.notOk(task2.rawModifications, 'Task 2 is not modified');
                next();
            },

            () => gantt.indent(task2),

            () => {
                t.notOk(task1.rawModifications, 'Task 1 is not modified');
                t.is(task1.children.length, 1, 'Task 1 has one children');

                t.ok(task2.rawModifications, 'Task 2 is modified');
                t.is(Object.keys(task2.rawModifications).length, 2, 'Task 2 has 2 fields modified');
                t.is(task2.rawModifications.parentIndex, 0, 'Task 2: parentIndex is correct');
                t.is(task2.rawModifications.parentId, 1, 'Task 2: parentId is correct');
            }
        );
    });

    t.it('Should fire change event after outdent operation', t => {
        const
            taskStore = getGantt({
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2,
                        expanded  : true,
                        children  : [
                            {
                                id        : 2,
                                name      : 'Task 2',
                                startDate : '2020-04-01',
                                duration  : 2
                            }
                        ]
                    }
                ]
            }).taskStore,
            task1     = taskStore.getById(1),
            task2     = taskStore.getById(2);

        t.firesOk(taskStore, 'outdent', 1, 'Outdent event is fired');
        t.firesOk(taskStore, 'change', 1, 'Change event is fired');

        t.chain(
            { waitForPropagate : project },

            () => taskStore.commit(),

            next => {
                t.notOk(task1.rawModifications, 'Task 1 is not modified');
                t.notOk(task2.rawModifications, 'Task 2 is not modified');
                next();
            },

            () => gantt.outdent(task2),

            () => {
                t.notOk(task1.rawModifications, 'Task 1 is not modified');
                t.is(task1.children.length, 0, 'Task 1 has no children');

                t.ok(task2.rawModifications, 'Task 2 is modified');
                t.is(Object.keys(task2.rawModifications).length, 2, 'Task 2 has 2 fields modified');
                t.is(task2.rawModifications.parentIndex, 1, 'Task 2: parentIndex is correct');
                t.is(task2.rawModifications.parentId, null, 'Task 2: parentId is correct');
            }
        );
    });

    t.it('Should trigger sync on indent if autosync is true', t => {

        let called = 0;

        const
            taskStore = getGantt({
                autoSync  : true,
                transport : {
                    sync : {
                        url : 'syncurl'
                    }
                },
                listeners : {
                    beforeSync : () => {
                        called++;
                        return false;
                    }
                },
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2
                    },
                    {
                        id        : 2,
                        name      : 'Task 2',
                        startDate : '2020-04-01',
                        duration  : 2
                    }
                ]
            }).taskStore,
            task2     = taskStore.getById(2);

        t.chain(
            { waitForPropagate : project },
            () => taskStore.commit(),
            () => gantt.indent(task2),
            { waitFor : () => called, desc : 'beforeSync happened' }
        );
    });

    t.it('Should trigger sync on outdent if autosync is true', t => {

        let called = 0;

        const
            taskStore = getGantt({
                autoSync  : true,
                transport : {
                    sync : {
                        url : 'syncurl'
                    }
                },
                listeners : {
                    beforeSync : () => {
                        called++;
                        return false;
                    }
                },
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 1,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2,
                        expanded  : true,
                        children  : [
                            {
                                id        : 2,
                                name      : 'Task 2',
                                startDate : '2020-04-01',
                                duration  : 2
                            }
                        ]
                    }
                ]
            }).taskStore,
            task2     = taskStore.getById(2);

        t.chain(
            { waitForPropagate : project },
            () => taskStore.commit(),
            () => gantt.outdent(task2),
            { waitFor : () => called, desc : 'beforeSync happened' }
        );
    });

    t.it('Should support indenting multiple tasks', async t => {
        const
            taskStore = getGantt({
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 100,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2,
                        expanded  : true,
                        children  : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(id => ({ id : id, name : id }))
                    }
                ]
            }).taskStore;

        const children = taskStore.getById(100).children;

        await gantt.indent(children);

        t.is(children[0].children.length, 14, 'Should have indented all task #1 siblings');

        t.isDeeply(children[0].children.map(task => task.id), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'Correct order');
    });

    t.it('Should support outdenting multiple tasks', async t => {
        const
            taskStore = getGantt({
                startDate  : '2020-04-01',
                eventsData : [
                    {
                        id        : 100,
                        name      : 'Task 1',
                        startDate : '2020-04-01',
                        duration  : 2,
                        expanded  : true,
                        children  : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(id => ({ id : id, name : id }))
                    }
                ]
            }).taskStore;

        const children = taskStore.getById(100).children;

        await gantt.outdent(children);

        t.is(taskStore.rootNode.children.length, 16, 'Should have outdented all task #100 children');

        t.isDeeply(taskStore.rootNode.children.map(task => task.id), [100, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'Correct order');
    });
});
