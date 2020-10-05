import DomHelper from '../../lib/Core/helper/DomHelper.js';

StartTest(t => {

    let gantt;

    t.beforeEach(t => {
        gantt && !gantt.isDestroyed && gantt.destroy();
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            appendTo : document.body
        });
    });

    t.it('Should add hover class to task and all its dependencies', t => {
        t.chain(
            { moveCursorTo : '.b-gantt-task-wrap:not(.b-gantt-task-parent)' },

            { waitForSelector : '.b-gantt-task-wrap.b-gantt-task-hover' },
            { waitForSelector : '.b-sch-dependency-over' }
        );
    });

    t.it('Should display terminals for task moved by propagate', t => {
        gantt.dependencyStore.removeAll();

        t.chain(
            { moveMouseTo : [0, 0] },

            { moveMouseTo : '[data-task-id="11"]' },

            { drag : '.b-sch-terminal-right', to : '[data-task-id="12"]', dragOnly : true },

            { moveMouseTo : '[data-task-id="12"] .b-sch-terminal-left' },

            { mouseUp : null },

            { waitForPropagate : gantt.project },

            { moveMouseTo : '[data-task-id="12"]' },

            () => {
                t.selectorExists('[data-task-id="12"] .b-sch-terminal-left', 'Terminal shown');
            }
        );
    });

    t.it('Should not fail on hover over task and dependencies', t => {
        const
            dependencyChain = [],
            taskChain = [];

        DomHelper.forEachSelector('.b-sch-dependency', element => {
            dependencyChain.push({
                moveMouseTo : element
            });
        });

        gantt.taskStore.forEach(task => {
            taskChain.push({
                moveMouseTo : `[data-task-id="${task.id}"]`
            });
        });

        t.chain(
            dependencyChain,
            taskChain,
            async() => {
                gantt.dependencyStore.removeAll();
            },
            taskChain
        );
    });

});
