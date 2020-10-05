import { ProjectModel } from '../../build/gantt.module.js';

StartTest(t => {

    let gantt, project;

    t.beforeEach(t => {
        project && project.destroy();
        gantt && gantt.destroy();
    });

    async function createGantt(config = {}) {
        project = new ProjectModel({
            tasksData : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    expanded  : true,
                    startDate : '2020-02-24',
                    children  : [
                        { id : 11, name : 'Task 11', startDate : '2020-02-24', duration : 2, constraintDate : '2020-02-24', constraintType : 'muststarton' },
                        { id : 12, name : 'Task 12', startDate : '2020-02-24', duration : 2, deadlineDate : '2020-03-05' },
                        { id : 22, name : 'Task 22', startDate : '2020-02-24', duration : 2 },
                        { id : 14, name : 'Task 14', startDate : '2020-02-24', duration : 2 }
                    ]
                }
            ],

            dependenciesData : [
                { fromEvent : 11, toEvent : 12 },
                { fromEvent : 12, toEvent : 13 },
                { fromEvent : 13, toEvent : 14 }
            ]
        });

        gantt = t.getGantt(Object.assign({
            features  : { filter : true },
            startDate : '2020-02-24',
            project
        }, config));

        await project.waitForPropagateCompleted();
    }

    t.it('Should not dysplay deleted data after re-apply filter', async t => {
        await createGantt();

        t.chain(
            { waitForSelector : '[data-task-id="22"]' },
            (next) => {
                gantt.taskStore.filter('name', '1');
                next();
            },
            { waitForSelectorNotFound : '[data-task-id="22"]' },
            { waitForSelector : '[data-task-id="11"]' },
            (next) => {
                gantt.taskStore.remove(gantt.taskStore.getById(11));
                next();
            },
            { waitForSelectorNotFound : '[data-task-id="11"]', desc : 'Task 11 has been deleted' },
            (next) => {
                gantt.on('renderRows', () => {
                    next();
                });
                gantt.taskStore.filter();
            },
            { waitForSelectorNotFound : '[data-task-id="11"]', desc : 'Task 11 has not been showed again after filter re-apply' }
        );
    });
});
