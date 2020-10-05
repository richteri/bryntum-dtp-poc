/* global TaskStore, DependencyStore, ProjectModel */
import TaskModel from '../../lib/Gantt/model/TaskModel.js';
import DependencyModel from '../../lib/Gantt/model/DependencyModel.js';
import { DependencyType } from '../../lib/Engine/scheduling/Types.js';

function getDataSet(dependencies, tasks, taskStoreCfg, depStoreCfg) {
    const dependencyStore = new DependencyStore(
        Object.assign({
            data : dependencies || [
                { id : 123, fromEvent : 1, toEvent : 2, type : DependencyType.EndToStart },
                { id : 124, fromEvent : 2, toEvent : 3, type : DependencyType.EndToStart }
            ],
            transitiveDependencyValidation : true
        }, depStoreCfg));

    const taskStore = new TaskStore(Object.assign({
        data : [{
            id       : 'root',
            children : tasks || [
                {
                    id        : 1,
                    leaf      : true,
                    startDate : new Date(2011, 6, 1),
                    endDate   : new Date(2011, 6, 2)
                },
                {
                    id        : 2,
                    leaf      : true,
                    startDate : new Date(2011, 6, 2),
                    endDate   : new Date(2011, 6, 3)
                },
                {
                    id        : 3,
                    leaf      : true,
                    startDate : new Date(2011, 6, 3),
                    endDate   : new Date(2011, 6, 4)
                },
                {
                    id        : 4,
                    leaf      : true,
                    startDate : new Date(2011, 6, 3),
                    endDate   : new Date(2011, 6, 4)
                },
                {
                    id        : 5,
                    leaf      : true,
                    startDate : new Date(2011, 6, 3),
                    endDate   : new Date(2011, 6, 4)
                },
                {
                    id        : 6,
                    leaf      : true,
                    startDate : new Date(2011, 6, 3),
                    endDate   : new Date(2011, 6, 4)
                }
            ]
        }]
    }, taskStoreCfg));

    dependencyStore.taskStore = taskStore;
    taskStore.dependencyStore = dependencyStore;

    return {
        taskStore       : taskStore,
        dependencyStore : dependencyStore
    };
};

const getProject = (...args) => {
    const dataSet       = getDataSet(...args);

    return new ProjectModel({
        eventStore      : dataSet.taskStore,
        dependencyStore : dataSet.dependencyStore
    });
};

StartTest((t) => {

    t.it('Basic functionality', async t => {
        const project           = getProject();

        await project.propagate();

        const taskStore         = project.eventStore;
        const dependencyStore   = project.dependencyStore;

        t.verifyCachedDependenciesState(taskStore);

        t.ok(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');

        let dep                 = dependencyStore.first;

        t.ok(dep.isPersistable, 'Dep is ok to persist');

        let newTask             = new TaskModel();

        t.isDeeply(newTask.allDependencies, [], 'getAllDependencies returns empty array');

        let root                = taskStore.getById('root');

        root.appendChild(newTask);

        await dep.propagate();

        t.verifyCachedDependenciesState(taskStore);

        dep.toEvent             = newTask;

        await dep.propagate();

        // SHOULD CLEAR THE CACHE SOMEWHERE?
        t.notOk(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');

        t.verifyCachedDependenciesState(taskStore);

        t.notOk(dep.isPersistable, 'Dep is no longer ok to persist');

        t.isDeeply(newTask.allDependencies, [dep], 'allDependencies property ok');
        t.isDeeply(newTask.incomingDeps, new Set([dep]), 'Outgoing deps ok');
        t.isDeeply(newTask.outgoingDeps, new Set([]), 'Incoming deps ok');

        dep.toEvent             = taskStore.getById(2);

        await dep.propagate();

        t.verifyCachedDependenciesState(taskStore);

        // This passes but seems just because the cache is not cleared
        t.ok(dependencyStore.hasTransitiveDependency(1, 2), 'hasTransitiveDependency works on directly depended tasks');

        // checking methodsCache
        var cacheKey = dependencyStore.buildCacheKey(1, 2, null, null, { visitedTasks : {} });
        t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');

        t.ok(dependencyStore.hasTransitiveDependency(1, 3), 'hasTransitiveDependency');
        cacheKey = dependencyStore.buildCacheKey(1, 3, null, null, { visitedTasks : {} });
        t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');

        t.notOk(dependencyStore.hasTransitiveDependency(3, 1), 'hasTransitiveDependency returns empty');
        cacheKey = dependencyStore.buildCacheKey(3, 1, null, null, { visitedTasks : {} });
        t.ok(dependencyStore.isCachedResultAvailable('hasTransitiveDependency', cacheKey), 'Method result is cached');

        t.ok(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency');

        // // Creates circular link
        // dep.fromEvent           = 3;
        //
        // await dep.propagate()
        //
        // t.verifyCachedDependenciesState(taskStore);

        // t.notOk(dependencyStore.isValidDependency(dep), 'isValidDependency called with dependency - bad dependency');
        //
        // dep.from = 1; // was dep.reject();
        //
        // t.verifyCachedDependenciesState(taskStore);

        t.notOk(dependencyStore.isValidDependency(3, 1), 'isValidDependency called with ids - bad dependency - cycle');
        t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency called with ids - bad dependency - transitivity');

        t.ok(dependencyStore.areTasksLinked(1, 2), 'areTasksLinked');
        t.notOk(dependencyStore.areTasksLinked(1, 3), 'areTasksLinked falsy');
        t.notOk(dependencyStore.areTasksLinked(4, 1), 'areTasksLinked bad first task');
        t.notOk(dependencyStore.areTasksLinked(1, 4), 'areTasksLinked bad second task');

        let newDependency = new DependencyModel({
            fromEvent : 2,
            toEvent   : 1
        });

        t.notOk(dependencyStore.isValidDependency(newDependency), 'Dependency is not valid, since its will form a circular structure 1->2->1');

        newDependency = new DependencyModel({
            fromEvent : 1,
            toEvent   : 1
        });

        t.notOk(dependencyStore.isValidDependency(newDependency), 'Dependency from itself is not valid');
    });

    // assertions for #1159

    t.it('isValidDependency() treats 2->3 dependency as invalid if we have 1->2,1->3 dependencies (transitivity)', async t => {

        const { dependencyStore } = getProject([{ id : 1, fromEvent : 1, toEvent : 2 }, { id : 2, fromEvent : 1, toEvent : 3 }]);

        // t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
        // t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
        t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid (transitivity)');

        // t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', (t) => {
        //     const { dependencyStore } = getDataSet([{ id : 1, from : 1, to : 2 }, { id : 2, from : 1, to : 3 }], null, null, { transitiveDependencyValidation : false });
        //
        //     t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
        //     t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
        //     t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
        //     t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
        //     t.ok(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid (transitivity)');
        // });
    });

    t.it('isValidDependency() treats 1->2 dependency as invalid if we have 2->3,1->3 dependencies (transitivity)', (t) => {
        // create stores
        const { dependencyStore } = getDataSet([{ id : 1, from : 2, to : 3 }, { id : 2, from : 1, to : 3 }]);

        t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
        t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 2->3 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
        t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid (transitivity)');

        t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', (t) => {
            const { dependencyStore } = getDataSet([{ id : 1, from : 2, to : 3 }, { id : 2, from : 1, to : 3 }], null, null, { transitiveDependencyValidation : false });

            t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
            t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since we already have such dependency');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 2->3 valid');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 1->3 valid');
            t.ok(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid (transitivity)');
        });
    });

    t.it('isValidDependency should handle non existing id as input', (t) => {
        const { dependencyStore } = getDataSet();

        t.notOk(dependencyStore.isValidDependency(22, 'foo'), 'predecessorsHaveTransitiveDependency');
    });

    // #1159 end

    t.it('isValidDependency accepts list of extra added/removed dependencies to be taken into account', (t) => {
        const { dependencyStore } = getDataSet([{ id : 1, from : 1, to : 2 }]);

        t.notOk(dependencyStore.isValidDependency(2, 3, 2, [{ id : 2, from : 1, to : 3 }]), 'isValidDependency 2->3 invalid since we plan to add 1->3 dependency');
        t.notOk(dependencyStore.isValidDependency(1, 3, 2, [{ id : 2, from : 2, to : 3 }]), 'isValidDependency 1->3 invalid since we plan to add 2->3 dependency');
        t.ok(dependencyStore.isValidDependency(1, 2, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
        t.ok(dependencyStore.isValidDependency(2, 1, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');

        t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', (t) => {
            const { dependencyStore } = getDataSet([{ id : 1, from : 1, to : 2 }], null, null, { transitiveDependencyValidation : false });

            t.ok(dependencyStore.isValidDependency(2, 3, 2, [{ id : 2, from : 1, to : 3 }]), 'isValidDependency 2->3 invalid since we plan to add 1->3 dependency');
            t.ok(dependencyStore.isValidDependency(1, 3, 2, [{ id : 2, from : 2, to : 3 }]), 'isValidDependency 1->3 invalid since we plan to add 2->3 dependency');
            t.ok(dependencyStore.isValidDependency(1, 2, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
            t.ok(dependencyStore.isValidDependency(2, 1, 2, null, [dependencyStore.getAt(0)]), 'isValidDependency 1->2 valid since we plan to remove existing 1->2 dependency');
        });
    });

    t.it('isValidDependency() treats 3->4 dependency as invalid if we have 1->2->3,4->5->6,1->6 dependencies (transitivity)', (t) => {
        // create stores
        const { dependencyStore } = getDataSet([
            { id : 1, from : 1, to : 2 },
            { id : 2, from : 2, to : 3 },
            { id : 3, from : 4, to : 5 },
            { id : 4, from : 5, to : 6 },
            { id : 5, from : 1, to : 6 }
        ]);

        t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
        t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
        t.notOk(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since it`s transitivity (we have 1->2->3)');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 2->3 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(3)), 'isValidDependency existing 4->5 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(4)), 'isValidDependency existing 5->6 valid');
        t.ok(dependencyStore.isValidDependency(dependencyStore.getById(5)), 'isValidDependency existing 1->6 valid');
        t.notOk(dependencyStore.isValidDependency(3, 4), 'isValidDependency 3->4 invalid (transitivity)');

        t.it('Doesn`t take transitivity cases into account when transitiveDependencyValidation=false', (t) => {
            // create stores
            const { dependencyStore } = getDataSet([
                { id : 1, from : 1, to : 2 },
                { id : 2, from : 2, to : 3 },
                { id : 3, from : 4, to : 5 },
                { id : 4, from : 5, to : 6 },
                { id : 5, from : 1, to : 6 }
            ], null, null, {
                transitiveDependencyValidation : false
            });

            t.notOk(dependencyStore.isValidDependency(2, 3), 'isValidDependency 2->3 invalid since we already have such dependency');
            t.notOk(dependencyStore.isValidDependency(1, 2), 'isValidDependency 1->2 invalid since we already have such dependency');
            t.ok(dependencyStore.isValidDependency(1, 3), 'isValidDependency 1->3 invalid since it`s transitivity (we have 1->2->3)');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(1)), 'isValidDependency existing 1->2 valid');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(2)), 'isValidDependency existing 2->3 valid');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(3)), 'isValidDependency existing 4->5 valid');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(4)), 'isValidDependency existing 5->6 valid');
            t.ok(dependencyStore.isValidDependency(dependencyStore.getById(5)), 'isValidDependency existing 1->6 valid');
            t.ok(dependencyStore.isValidDependency(3, 4), 'isValidDependency 3->4 invalid (transitivity)');
        });
    });

    t.it('isValidDependency() should check allowParentTaskDependencies flag', (t) => {
        const dependencyStore = t.getDependencyStore({
            allowParentTaskDependencies : false,
            data                        : [
                { id : 1, from : 1, to : 2 },
                { id : 2, from : 2, to : 3 }
            ]
        });

        const taskStore = new TaskStore({
            dependencyStore : dependencyStore,
            data            : [{
                id       : 'root',
                children : [
                    {
                        id       : 1,
                        leaf     : false,
                        children : [{
                            id : 4
                        }]
                    },
                    {
                        id       : 2,
                        leaf     : false,
                        children : [{
                            id : 5
                        }]
                    },
                    {
                        id   : 3,
                        leaf : true
                    }
                ]
            }]
        });

        taskStore.dependencyStore = dependencyStore;
        t.notOk(dependencyStore.isValidDependency(dependencyStore.getAt(0)), 'Should not allow parent task dependencies');
        t.notOk(dependencyStore.isValidDependency(dependencyStore.getAt(1)), 'Should not allow parent task dependencies');
    });

    /*
    t.it('Should append dependency for empty tasks', function (t) {

        t.it('Should work w/ cascadeChanges', function (t) {

            var ds = getDataSet(false, false, {
                cascadeChanges  : true
            });

            var taskStore       = ds.taskStore,
                dependencyStore = ds.dependencyStore,
                root            = taskStore.getRoot();

            t.diag('Adding a predecessor');

            var successor   = root.appendChild({ leaf : true });
            var predecessor = new Gnt.model.Task({ leaf : true });

            successor.addPredecessor(predecessor);

            var projectStartDate = taskStore.getProjectStartDate();

            t.is(predecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
            t.is(predecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
            t.is(predecessor.getDuration(), 1, 'Predecessor duration is correct');

            t.is(successor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
            t.is(successor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
            t.is(successor.getDuration(), 1, 'Successor duration is correct');

            t.diag('Modifying a dependency by switching its source & target tasks');

            var newSuccessor = root.appendChild({ leaf : true });
            var newPredecessor = root.appendChild({ leaf : true });

            var dependency = dependencyStore.last();
            dependency.setTargetTask(newSuccessor);
            dependency.setSourceTask(newPredecessor);

            t.is(newPredecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
            t.is(newPredecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
            t.is(newPredecessor.getDuration(), 1, 'Predecessor duration is correct');

            t.is(newSuccessor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
            t.is(newSuccessor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
            t.is(newSuccessor.getDuration(), 1, 'Successor duration is correct');

            t.diag('Adding a successor');

            predecessor = root.appendChild({ leaf : true });
            successor   = new Gnt.model.Task({ leaf : true });

            predecessor.addSuccessor(successor);

            t.is(predecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
            t.is(predecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
            t.is(predecessor.getDuration(), 1, 'Predecessor duration is correct');

            t.is(successor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
            t.is(successor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
            t.is(successor.getDuration(), 1, 'Successor duration is correct');

            t.diag('Modifying a dependency by switching its source & target tasks');

            newSuccessor   = root.appendChild({ leaf : true });
            newPredecessor = root.appendChild({ leaf : true });

            dependency = dependencyStore.last();
            dependency.setTargetTask(newSuccessor);
            dependency.setSourceTask(newPredecessor);

            t.is(newPredecessor.getStartDate(), projectStartDate, 'Predecessor start date set correctly');
            t.is(newPredecessor.getEndDate(), new Date(2011, 6, 2), 'Predecessor end date set correctly');
            t.is(newPredecessor.getDuration(), 1, 'Predecessor duration is correct');

            t.is(newSuccessor.getStartDate(), new Date(2011, 6, 4), 'Successor start date set correct');
            t.is(newSuccessor.getEndDate(), new Date(2011, 6, 5), 'Successor end date set correctly');
            t.is(newSuccessor.getDuration(), 1, 'Successor duration is correct');
        });

    });

    */
});
