import '../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';
import '../../lib/Gantt/column/AllColumns.js';

StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    // https://github.com/bryntum/support/issues/379
    t.it('Task reorder should be undoable', async t => {

        gantt = t.getGantt({
            features : {
                taskTooltip : false
            }
        });

        const
            project = gantt.project,
            taskStore = project.taskStore,
            investigateTask = taskStore.getById(11),
            reportTask = taskStore.getById(14),
            parentTask = taskStore.getById(1),
            stm = project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        parentTask.insertChild(investigateTask, reportTask);

        t.chain(

            { waitFor : () => stm.canUndo },

            async() => {
                stm.undo();

                await gantt.project.await('stateRestoringDone');

                t.is(parentTask.children.findIndex(task => task.id === 11), 0, 'Task moved back correctly');

                stm.redo();

                await gantt.project.await('stateRestoringDone');

                t.is(parentTask.children.findIndex(task => task.id === 11), 2, 'Redo moved task correctly');
            }
        );

    });

});
