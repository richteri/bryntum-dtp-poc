import { TaskModel, ProjectModel } from '../../build/gantt.module.js';

StartTest(t => {

    t.it('Sequence number should work', t => {
        const task = new TaskModel({ // 0
            children : [
                {}, // 1
                { // 2
                    children : [
                        {}, // 3
                        {} // 4
                    ]
                },
                {} // 5
            ]
        });

        function getSequence() {
            const sequence = [];
            task.traverse(t => sequence.push(t.sequenceNumber));
            return sequence;
        }

        t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5], 'Correct sequence numbers initially');

        task.firstChild.appendChild({});

        t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5, 6], 'Correct after appendChild');

        task.firstChild.insertChild(0, {});

        t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5, 6, 7], 'Correct after insertChild');

        task.firstChild.remove();

        t.isDeeply(getSequence(), [0, 1, 2, 3, 4], 'Correct after removing child');
    });

    t.it('Should handle non working time calendar config', async t => {

        const
            project   = new ProjectModel({
                calendar : 'general',

                tasksData : [
                    {
                        id        : 1,
                        startDate : new Date(2019, 6, 1),
                        endDate   : new Date(2019, 6, 5)
                    }
                ],

                calendarsData : [
                    {
                        id        : 'general',
                        name      : 'General',
                        intervals : [
                            {
                                recurrentStartDate : 'on Sat at 0:00',
                                recurrentEndDate   : 'on Mon at 0:00',
                                isWorking          : false
                            }
                        ]
                    }]

            }),
            taskStore = project.taskStore,
            task      = taskStore.getById('1');

        function checkTask(duration, startDate, endDate) {
            t.is(task.duration, duration, 'Correct task duration');
            t.is(task.startDate, startDate, 'Correct task startDate');
            t.is(task.endDate, endDate, 'Correct task endDate');
        }

        checkTask(4, new Date(2019, 6, 1), new Date(2019, 6, 5));

        await task.setStartDate(new Date(2019, 6, 5));

        checkTask(4, new Date(2019, 6, 5), new Date(2019, 6, 11));

        await task.setStartDate(new Date(2019, 6, 8));

        checkTask(4, new Date(2019, 6, 8), new Date(2019, 6, 12));

        await task.setDuration(10);

        checkTask(10, new Date(2019, 6, 8), new Date(2019, 6, 20));
    });

    t.it('Should set percentDone to 0 when copying', t => {
        const task = new TaskModel({ // 0
            name        : 'foo',
            percentDone : 88.7878
        });

        t.is(task.renderedPercentDone, 89, 'Rounded when less than 99');
        t.is(task.renderedPercentDone, 89, 'Rounded when less than 99');

        task.percentDone = 99;
        t.is(task.renderedPercentDone, 99, 'Rounded <= less than 99');

        task.percentDone = 99.9;
        t.is(task.renderedPercentDone, 99, 'Floor if > than 99');

        task.percentDone = 100;
        t.is(task.renderedPercentDone, 100, 'Floor if > than 99');

        const copy = task.copy();

        t.is(copy.percentDone, 0, 'percentDone set to 0 for copied record');
        t.notOk(copy.isModified, 'No modifications in the copied record');
        t.ok(copy.isPhantom, 'The copied record is a phantom');
    });
});
