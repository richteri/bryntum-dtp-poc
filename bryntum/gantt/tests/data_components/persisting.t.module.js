import { AjaxHelper } from '../../build/gantt.module.js';

StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should commit task store', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            overrideCrudStoreLoad : false,
            tasks    : [
                {
                    id        : 1,
                    cls       : 'id1',
                    startDate : '2017-01-16',
                    endDate   : '2017-01-18',
                    name      : 'Task 1',
                    leaf      : true
                },
                {
                    id        : 2,
                    cls       : 'id2',
                    startDate : '2017-01-18',
                    endDate   : '2017-01-20',
                    name      : 'Task 2',
                    leaf      : true
                }
            ]
        });

        const taskStore = gantt.taskStore;

        AjaxHelper.post = (url, data) => {
            data.data.forEach(record => {
                t.notOk(record.hasOwnProperty('incomingDeps'), 'Incoming deps are not persisted');
                t.notOk(record.hasOwnProperty('outgoingDeps'), 'Outgoing deps are not persisted');
            });

            return Promise.resolve({ parsedJson : { success : true, data : [] } });
        };

        t.chain(
            { waitForPropagate : gantt },
            async() => {
                gantt.dependencyStore.add({ fromEvent : 1, toEvent : 2 });

                await gantt.project.propagate();

                t.is(taskStore.getById(1).outgoingDeps.size, 1, '1 outgoing dep is found');
                t.is(taskStore.getById(2).incomingDeps.size, 1, '1 incoming dep is found');

                taskStore.updateUrl = 'foo';
                // taskStore.on('beforerequest', ({ params }) => { debugger; });
                return taskStore.commit();
            }
        );
    });
});
