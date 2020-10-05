import TaskStore from '../../lib/Gantt/data/TaskStore.js';
import DependencyStore from '../../lib/Gantt/data/DependencyStore.js';

StartTest((t) => {
    /* Here we check the validation of cyclic dependencies like this:
        (T1 is a child of P1):

        P1 =========
        T1 ++++++       P2 ==========
                        T2    ++++       P3 =====
                                         T3 +++++

        -----------------------------------------

        Scenario #1: P1---->P2
        -- Set : T2---->P1

        Scenario #2: P1---->T2
        -- Set : T2---->T1

        Scenario #3: P1---->P2
        -- Set : T2---->T1

        Scenario #4: P1---->P2---->P3
        -- Set : T3---->T1

        Scenario #5: P1---->T2
        -- Set : P2---->T1

        Scenario #6: P1---->T2 P2---->T3
        -- Set : P3---->T1

        Scenario #7: T1---->P2 T2---->P3
        -- Set : T3---->P1

        Scenario #8: T1---->P2 T2---->P3
        -- Set : T4---->P1

        Scenario #9: T1---->P2 T4---->P1
        -- Set : T2---->P3

        Scenario #10: T4---->P1 T1---->P2
        -- Set : T2---->T3

        Scenario #11: P1---->P2 T2---->T3
        -- Set : P3---->P1

        Scenario #12: P1---->P2 T2---->T3
        -- Set : P3---->T1

        Scenario #13: P1---->P2
        -- Set : T1---->T2

        Scenario #14: P1---->P2
        -- Set : T1---->P2

        Scenario #15: P1---->P2
        -- Set : P1---->T2

        ---------------------------------

        Scenario #16: P1---->T2
        -- Set : T1---->P2

        Scenario #17: P1---->T2
        -- Set : T1---->T2

        Scenario #18: P1---->T2
        -- Set : P1---->P2

        ---------------------------------

        Scenario #19: P1---->T2 P2---->T3
        -- Set : T1---->P3

        Scenario #20: T1---->P2 T2---->P3
        -- Set : P1---->T3

        Scenario #21: T1---->P2 T2---->P3
        -- Set : P1---->T4

        Scenario #22: T1---->P2 T4---->P1
        -- Set : P3---->T2

        Scenario #23: T4---->P1 T1---->P2
        -- Set : T3---->T2

        Scenario #24: P1---->P2 T2---->T3
        -- Set : P1---->P3

        Scenario #25: P1---->P2 T2---->T3
        -- Set : T1---->P3

        Scenario #26: T2---->P3 T3---->T3.1
        -- Existing T2---->P3 must be valid
    */

    let dependencyStore,
        taskStore;

    function getDefaultTasks() {
        return [
            {
                id       : 'P1',
                children : [
                    {
                        id   : 'T1',
                        leaf : true
                    }
                ]
            },
            {
                id       : 'P2',
                children : [
                    {
                        id   : 'T2',
                        leaf : true
                    }
                ]
            },
            {
                id       : 'P3',
                children : [
                    {
                        id   : 'T3',
                        leaf : true
                    },
                    {
                        id       : 'T3.1',
                        children : [
                            {
                                id   : 'T4',
                                leaf : true
                            }
                        ]
                    }
                ]
            }
        ];
    };

    function getData(dependencies, tasks, dependencyStoreCfg) {
        taskStore && (taskStore = null); // taskStore && taskStore.destroy();
        dependencyStore && (dependencyStore = null); // dependencyStore && dependencyStore.destroy();

        dependencyStore = new DependencyStore(Object.assign({
            data                       : dependencies || [{ from : 'P1', to : 'P2' }],
            strictDependencyValidation : true
        }, dependencyStoreCfg));

        taskStore = new TaskStore({
            data : tasks || getDefaultTasks()
        });

        taskStore.dependencyStore = dependencyStore;
        dependencyStore.taskStore = taskStore;

        return {
            taskStore,
            dependencyStore
        };
    };

    function getData2(dependencies, dependencyStoreCfg) {
        // the same data as getData() returns except tasks are wrapped with a common parent task A1
        return getData(dependencies, [{ id : 'A1', children : getDefaultTasks() }], dependencyStoreCfg);
    };

    function getData3(dependencies) {
        return getData(dependencies, null, { transitiveDependencyValidation : false });
    };

    function getData4(dependencies) {
        return getData2(dependencies, { transitiveDependencyValidation : false });
    };

    function scenario(getData, t) {
        t.it('Validates correctly for scenario #1', (t) => {
            getData();

            t.notOk(dependencyStore.isValidDependency('T2', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #2', (t) => {
            getData([{ from : 'P1', to : 'T2' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #3', (t) => {
            getData();

            t.notOk(dependencyStore.isValidDependency('T2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #4', (t) => {
            getData([{ from : 'P1', to : 'P2' }, { from : 'P2', to : 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T3', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #5', (t) => {
            getData([{ from : 'P1', to : 'T2' }]);

            t.notOk(dependencyStore.isValidDependency('P2', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #6', (t) => {
            getData([{ from : 'P1', to : 'T2' }, { from : 'P2', to : 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #7', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T2', to : 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T3', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #8', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T2', to : 'P3' }]);

            t.notOk(dependencyStore.isValidDependency('T4', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #9', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T4', to : 'P1' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'P3'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #10', (t) => {
            getData([{ from : 'T4', to : 'P1' }, { from : 'T1', to : 'P2' }]);

            t.notOk(dependencyStore.isValidDependency('T2', 'T3'), 'correctly detects cycle');
        });

        t.it('Validates correctly some valid dependencies', (t) => {
            getData();

            t.ok(dependencyStore.isValidDependency('P2', 'P3'), 'valid dependency');
            t.ok(dependencyStore.isValidDependency('P2', 'T3'), 'valid dependency');
        });

        t.it('Validates correctly for scenario #1 (having common group P3)', (t) => {
            getData([{ from : 'T3', to : 'T3.1' }, { from : 'T4', to : 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('T4', 'T3'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #11', (t) => {
            getData([{ from : 'P1', to : 'P2' }, { from : 'T2', to : 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'P1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #12', (t) => {
            getData([{ from : 'P1', to : 'P2' }, { from : 'T2', to : 'T3' }]);

            t.notOk(dependencyStore.isValidDependency('P3', 'T1'), 'correctly detects cycle');
        });

        t.it('Validates correctly for scenario #13', (t) => {
            getData();

            t.ok(dependencyStore.isValidDependency('T1', 'T2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #14', (t) => {
            getData();

            t.ok(dependencyStore.isValidDependency('T1', 'P2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #15', (t) => {
            getData();

            t.ok(dependencyStore.isValidDependency('P1', 'T2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #16', (t) => {
            getData([{ from : 'P1', to : 'T2' }]);

            t.ok(dependencyStore.isValidDependency('T1', 'P2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #17', (t) => {
            getData([{ from : 'P1', to : 'T2' }]);

            t.ok(dependencyStore.isValidDependency('T1', 'T2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #18', (t) => {
            getData([{ from : 'P1', to : 'T2' }]);

            t.ok(dependencyStore.isValidDependency('P1', 'P2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #19', (t) => {
            getData([{ from : 'P1', to : 'T2' }, { from : 'P2', to : 'T3' }]);

            t.ok(dependencyStore.isValidDependency('T1', 'P3') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #20', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T2', to : 'P3' }]);

            t.ok(dependencyStore.isValidDependency('P1', 'T3') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #21', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T2', to : 'P3' }]);

            t.ok(dependencyStore.isValidDependency('P1', 'T4') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #22', (t) => {
            getData([{ from : 'T1', to : 'P2' }, { from : 'T4', to : 'P1' }]);

            t.ok(dependencyStore.isValidDependency('P3', 'T2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #23', (t) => {
            getData([{ from : 'T4', to : 'P1' }, { from : 'T1', to : 'P2' }]);

            t.ok(dependencyStore.isValidDependency('T3', 'T2') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #24', (t) => {
            getData([{ from : 'P1', to : 'P2' }, { from : 'T2', to : 'T3' }]);

            t.ok(dependencyStore.isValidDependency('P1', 'P3') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #25', (t) => {
            getData([{ from : 'P1', to : 'P2' }, { from : 'T2', to : 'T3' }]);

            t.ok(dependencyStore.isValidDependency('T1', 'P3') != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity');
        });

        t.it('Validates correctly for scenario #26', (t) => {
            getData([{ from : 'T2', to : 'P3' }, { from : 'T3', to : 'T3.1' }]);

            t.ok(dependencyStore.getTasksLinkingDependency('T2', 'P3').isValid(), 'valid');
        });

        t.it('isValidDependency accepts list of extra added/removed dependencies to be taken into account', (t) => {
            getData([{ from : 'P1', to : 'P2' }]);

            t.ok(dependencyStore.isValidDependency('T1', 'P3', 2, [{ from : 'T2', to : 'T3' }]) != dependencyStore.transitiveDependencyValidation, 'correctly treats transitivity since we plan to add T2->T3 dependency');
            t.ok(dependencyStore.isValidDependency('T1', 'P3', 2, [{ from : 'T2', to : 'T3' }], [dependencyStore.getAt(0)]), 'correctly DOESN`T detects transitivity since we plan to drop T2->T3 dependency');
        });
    };

    t.it('Validates correctly when transitiveDependencyValidation=true', (t) => {
        // invoke assertions
        scenario(getData, t);

        t.it('All above scenarios but tasks are enclosed by a single super-group A1', (t) => {
            scenario(getData2, t);
        });
    });

    t.it('Validates correctly when transitiveDependencyValidation=false', (t) => {
        // invoke assertions
        scenario(getData3, t);

        t.it('All above scenarios but tasks are enclosed by a single super-group A1', (t) => {
            scenario(getData4, t);
        });
    });
});
