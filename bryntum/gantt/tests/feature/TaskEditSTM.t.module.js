
StartTest(t => {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    // https://app.assembla.com/spaces/bryntum/tickets/8247
    t.it('TaskEditor cancel should not leave undoable transaction in the STM', async t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        const investigateTask = gantt.project.taskStore.getById(11);

        const [maximResource] = gantt.project.resourceStore.add({
            name : 'Maxim'
        });

        await investigateTask.assign(maximResource);

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            (next) => {
                gantt.editTask(investigateTask);
                next();
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-grid-cell:contains(Maxim)' },

            { click : '.b-resourcestab .b-remove-button' },

            { click : '.b-button:contains(Cancel)' },

            { waitForPropagate : gantt },

            (next) => {
                t.notOk(stm.canUndo, 'Canceling haven\'t created any unneeded undo actions');
                t.notOk(stm.canRedo, 'Canceling haven\'t created any unneeded redo actions');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8247
    t.it('TaskEditor cancel should not change undo/redo queue', async t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        const investigateTask = gantt.project.taskStore.getById(11);

        const [maximResource] = gantt.project.resourceStore.add({
            name : 'Maxim'
        });

        await investigateTask.assign(maximResource);

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            async() => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            // STM is async, need to wait a bit for action to get into queue
            { waitFor : 200 },

            async() => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            { waitFor : 200 },

            async() => {
                await investigateTask.setStartDate(new Date(investigateTask.getStartDate().getTime() + 1000 * 60 * 60 * 24));
            },

            { waitFor : 200 },

            async() => {
                stm.undo(2);

                await gantt.project.await('stateRestoringDone');

                gantt.editTask(investigateTask);
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-tabpanel-tab-title:contains(Resources)' },

            { click : '.b-resourcestab .b-grid-cell:contains(Maxim)' },

            { click : '.b-resourcestab .b-remove-button' },

            { click : '.b-button:contains(Cancel)' },

            { waitForSelectorNotFound : 'b-taskeditor-editing' },

            { waitFor : () => stm.canUndo },

            (next) => {
                t.ok(stm.canUndo, 'Canceling haven\'t changed undo availability');
                t.ok(stm.canRedo, 'Canceling haven\'t changed redo availability');
                t.is(stm.position, 1, 'Canceling haven\'t changed STM position');
                t.is(stm.length, 3, 'Canceling haven\'t changed STM queue length');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8231
    t.it('TaskEditor cancel should not lead to just added record removal', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        let task;

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            next => {
                task = gantt.addTaskBelow(gantt.taskStore.last).then(t => {
                    task = t;
                    next();
                });
            },

            next => {
                gantt.startEditing({ field : 'name', record : task });
                next();
            },

            (next) => {
                gantt.editTask(task);
                next();
            },

            { waitForSelector : '.b-popup.b-taskeditor' },

            { click : '.b-button:contains(Cancel)' },

            { waitForPropagate : gantt },

            (next) => {
                // Task.id here to avoid #8238
                t.ok(gantt.taskStore.includes(task.id), 'The task is in the store after the Task Editor Cancel');
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8632
    t.it('Should continue editing after cancel/undo', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            project  : t.getProject({
                calendar : 'general'
            }),
            features : {
                taskTooltip : false
            }
        });

        let task = gantt.taskStore.getById(13);

        t.chain(
            { dblclick : '.b-gantt-task.id13' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7,
                desc    : 'End date changed, duration is 7'
            },

            { click : '.b-gantt-task.id12' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 26).getTime() && task.duration === 8,
                desc    : 'End date restored, duration is 8'
            },

            { dblclick : '.b-gantt-task.id13' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7,
                desc    : 'End date changed, duration is 7'
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8225
    t.it('Exception when opening task editor right during new task name inputing with STM autorecording on', t => {

        gantt = t.getGantt({
            appendTo : document.body,

            features : {
                taskTooltip : false
            }
        });

        let task;

        const stm = gantt.project.getStm();

        stm.disabled = false;
        stm.autoRecord = true;

        t.chain(
            next => {
                task = gantt.addTaskBelow(gantt.taskStore.last).then(t => {
                    task = t;
                    next();
                });
            },

            next => {
                gantt.startEditing({ field : 'name', record : task });
                next();
            },

            { type : 'zzzz' },

            next => {
                t.livesOk(() => {
                    gantt.editTask(task);
                }, 'Editor loaded just created task w/o exception');
            }
        );
    });
});
