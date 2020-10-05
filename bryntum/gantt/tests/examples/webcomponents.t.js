StartTest(t => {
    const gantt = bryntum.query('gantt');

    t.it('Should support rendering + dragging event in a webcomponent', async t => {
        t.isInstanceOf(gantt.element.querySelector('.b-gantt-task'), HTMLElement, 'task rendered');

        t.firesOnce(gantt, 'taskdragstart');
        t.firesAtLeastNTimes(gantt.project.taskStore, 'update', 1);

        t.chain(
            { drag : 'bryntum-gantt -> .b-gantt-task-wrap[data-task-id="11"]', by : [100, 100] }
        );
    });
});
