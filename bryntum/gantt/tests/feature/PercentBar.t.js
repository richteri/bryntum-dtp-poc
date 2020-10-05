import Panel from '../../lib/Core/widget/Panel.js';

StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    function assertPercentBarWidth(t, taskRecord) {
        const
            taskElement = gantt.getElementFromTaskRecord(taskRecord),
            percentBar = taskElement.querySelector('.b-gantt-task-percent'),
            expectedWidth = taskElement.offsetWidth * taskRecord.percentDone / 100;

        t.isApprox(expectedWidth, percentBar.offsetWidth, `Correct percent bar width for ${taskRecord.name}, ${taskRecord.percentDone}%`);
    }

    t.it('Should render percent bars', t => {
        gantt = t.getGantt();

        const taskElements = Array.from(document.querySelectorAll('.b-gantt-task-wrap:not(.b-milestone-wrap)'));

        t.selectorExists('.b-gantt-task-percent', 'Percent bar rendered');
        t.selectorCountIs('.b-gantt-task-percent', taskElements.length, 'One per normal task rendered');

        // Check all widths
        taskElements.forEach(taskElement => {
            assertPercentBarWidth(t, gantt.resolveTaskRecord(taskElement));
        });
    });

    t.it('Should update percent bar when data changes', async t => {
        gantt = t.getGantt({
            enableEventAnimations : false
        });

        const task = gantt.taskStore.getById(11);

        await task.setPercentDone(10);

        assertPercentBarWidth(t, task);

        await task.setPercentDone(90);

        assertPercentBarWidth(t, task);

        await task.setPercentDone(100);

        assertPercentBarWidth(t, task);
    });

    t.it('Should set percent to 0 if dragging fully to the start of the bar', async t => {
        gantt = t.getGantt();

        const task = gantt.taskStore.getById(11);

        task.cls = 'foo';

        await task.setDuration(1);
        await task.setPercentDone(10);

        t.chain(
            { moveCursorTo : '.foo.b-gantt-task' },
            { drag : '.foo .b-gantt-task-percent-handle', by : [-100, 0] },
            { waitForPropagate : gantt.project },

            () => {
                t.is(task.percentDone, 0);
                t.is(task.duration, 1);
            }
        );
    });

    t.it('Should be possible to resize percent bar to 100% of the task width', async t => {
        gantt = t.getGantt({
            tickWidth : 40,
            features  : {
                taskTooltip : false
            }
        });

        t.chain(
            { waitForPropagate : gantt },
            { moveMouseTo : '.b-gantt-task.id11' },
            { drag : '.id11 .b-gantt-task-percent-handle', by : [400, 0], dragOnly : true },
            async() => {
                const
                    barEl     = document.querySelector('.id11 .b-gantt-task-percent'),
                    barWidth  = barEl.offsetWidth,
                    taskWidth = barEl.parentElement.offsetWidth;

                t.is(barWidth, taskWidth, 'Percent bar size is ok');
            },
            { moveMouseTo : '.b-gantt-task.id11', offset : [0, '50%'] },
            async() => {
                const
                    barEl     = document.querySelector('.id11 .b-gantt-task-percent'),
                    barWidth  = barEl.offsetWidth;

                t.is(barWidth, 1, 'Percent bar size is ok');
            },
            { mouseUp : null }
        );
    });

    t.it('Should not show resize handle if Gantt is readOnly', async t => {
        gantt = t.getGantt({
            readOnly : true,
            features : {
                taskTooltip : false
            }
        });

        const task = gantt.taskStore.getById(11);

        task.cls = 'foo';

        t.chain(
            { moveCursorTo : '.b-gantt-task.foo' },

            () => {
                t.elementIsNotVisible('.foo .b-gantt-task-percent-handle', 'Handle not shown when readOnly is set');
            }
        );
    });

    t.it('Should support disabling', t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 6,
                    name      : 'Task 6',
                    startDate : new Date(2011, 6, 28),
                    duration  : 5
                }
            ]
        });

        gantt.features.percentBar.disabled = true;

        t.selectorNotExists('.b-gantt-task-percent', 'No percent bars');

        gantt.features.percentBar.disabled = false;

        t.selectorExists('.b-gantt-task-percent', 'Percent bars shown');

        gantt.features.percentBar.allowResize = false;

        t.chain(
            { moveCursorTo : '.b-gantt-task-wrap:not(.b-gantt-task-parent) .b-gantt-task' },

            next => {
                t.elementIsNotVisible('.b-gantt-task-percent-handle', 'resize handle hidden');
                gantt.features.percentBar.allowResize = true;
                next();
            },
            { moveCursorTo : [0, 0] },
            { moveCursorTo : '.b-gantt-task-wrap:not(.b-gantt-task-parent) .b-gantt-task' },
            next => {
                t.elementIsVisible('.b-gantt-task-percent-handle', 'resize handle visible');
            }
        );
    });

    t.it('Percent bar drag should not affect the task duration', async t => {
        new Panel({
            adopt  : document.body,
            layout : 'fit',
            items  : [
                gantt = t.getGantt({
                    appendTo : null
                })
            ]
        });

        const task = gantt.taskStore.getById(11);

        task.cls = 'foo';

        await task.setDuration(1);
        await task.setPercentDone(10);

        t.chain(
            { moveCursorTo : '.foo.b-gantt-task' },
            { drag : '.foo .b-gantt-task-percent-handle', by : [100, 0] },
            { waitForPropagate : gantt.project },

            () => {
                t.is(task.percentDone, 100);
                t.is(task.duration, 1);
            }
        );
    });

});
