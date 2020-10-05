import { TaskStore, DependencyStore } from '../../build/gantt.module.js';

StartTest(t => {

    let dependencyStore, taskStore;

    t.beforeEach(() => {
        dependencyStore && dependencyStore.destroy();
        dependencyStore = null;

        taskStore && taskStore.destroy();
        taskStore = null;
    });

    const createStores = () => {
        dependencyStore = new DependencyStore();
        taskStore = new TaskStore({
            data : [{
                id        : 1,
                startDate : '2020-05-08',
                duration  : 1
            }, {
                id        : 2,
                startDate : '2020-05-08',
                duration  : 1
            }]
        });
    };

    t.it('Should be possible to pass task instance to from/to fields when create a new dependency', t => {
        createStores();

        const dependency = dependencyStore.add({
            from : taskStore.getById(1),
            to   : taskStore.getById(2)
        })[0];

        t.is(dependency.from, 1, 'Dependency "from" is correct');
        t.is(dependency.to, 2, 'Dependency "to" is correct');
    });

    t.it('Should be possible to pass task instance to fromEvent/toEvent fields when create a new dependency', t => {
        createStores();

        const dependency = dependencyStore.add({
            fromEvent : taskStore.getById(1),
            toEvent   : taskStore.getById(2)
        })[0];

        t.is(dependency.from, 1, 'Dependency "from" is correct');
        t.is(dependency.to, 2, 'Dependency "to" is correct');
    });

    t.it('Should be possible to pass task instance to fromTask/toTask fields when create a new dependency', t => {
        createStores();

        const dependency = dependencyStore.add({
            fromTask : taskStore.getById(1),
            toTask   : taskStore.getById(2)
        })[0];

        t.is(dependency.from, 1, 'Dependency "from" is correct');
        t.is(dependency.to, 2, 'Dependency "to" is correct');
    });
});
