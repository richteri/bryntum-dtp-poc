/* global ProjectModel */
StartTest(t => {

    t.it('Should be possible to provide store instance during project creation', async t => {
        const taskStore         = t.getTaskStore();
        const dependencyStore   = t.getDependencyStore();

        let project;

        t.livesOk(() => {
            project = new ProjectModel({
                taskStore       : taskStore,
                dependencyStore : dependencyStore
            });
        });

        t.is(project.taskStore, taskStore, 'Correct task store');
        t.is(project.eventStore, project.taskStore, 'Correct task store');
    });

    t.it('Should be possible to use `tasksData` config', async t => {
        const project = new ProjectModel({
            startDate : new Date(2019, 5, 4),
            tasksData : [
                { id : 1, name : 'Sample task' }
            ]
        });

        t.is(project.taskStore.count, 1, 'Correct task store data');
    });

    t.it('Project STM must have 5 stores initially', async t => {

        const project = new ProjectModel();

        t.is(project.getStm().stores.length, 5, 'Correct amount of stores is registered in the STM initially');
    });
});
