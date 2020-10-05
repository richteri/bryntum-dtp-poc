import PredecessorColumn from '../../lib/Gantt/column/PredecessorColumn.js';
import SuccessorColumn from '../../lib/Gantt/column/SuccessorColumn.js';
import { TimeUnit } from '../../lib/Engine/scheduling/Types.js';

StartTest((t) => {
    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();
    });

    t.it('Should update dependency columns on dependency store changes', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : PredecessorColumn.type, width : 150 },
                { type : SuccessorColumn.type, width : 150 }
            ],
            tasks : [
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
                    startDate : '2017-01-16',
                    endDate   : '2017-01-18',
                    name      : 'Task 2',
                    leaf      : true
                },
                {
                    id        : 3,
                    cls       : 'id3',
                    startDate : '2017-01-16',
                    endDate   : '2017-01-18',
                    name      : 'Task 3',
                    leaf      : true
                }
            ],
            dependencies : []
        });

        const
            project = gantt.project,
            dependencyStore = project.dependencyStore,
            eventStore = project.eventStore;

        let dep1;

        t.chain(
            { waitForPropagate : project },

            () => {
                t.isntCalled('refresh', gantt);

                [dep1] = dependencyStore.add({ id : 1, fromEvent : 1, toEvent : 2 });

                return project.propagate();
            },

            () => {
                t.isDeeply(eventStore.getById(1).outgoingDeps, new Set([dependencyStore.getById(1)]), 'Correct outgoing deps for event 1');
                t.isDeeply(eventStore.getById(2).incomingDeps, new Set([dependencyStore.getById(1)]), 'Correct incoming deps for event 2');

                t.contentLike('.id1 [data-column=successors]', '2', 'Successor rendered');
                t.contentLike('.id2 [data-column=predecessors]', '1', 'Predecessor rendered');

                dependencyStore.add({ fromEvent : 3, toEvent : 2 });

                return project.propagate();
            },

            (next) => {
                t.contentLike('.id1 [data-column=successors]', '2', 'Successor rendered');
                t.contentLike('.id2 [data-column=predecessors]', '1;3', 'Predecessor rendered');
                t.contentLike('.id3 [data-column=successors]', '2', 'Successor rendered');
                next();
            },

            () => {
                dep1.setLag(1, TimeUnit.Day);

                return project.waitForPropagateCompleted();
            },

            () => {
                t.contentLike('.id2 [data-column=predecessors]', '1+1d;3', 'Predecessor rendered');
            }
        );
    });

    t.it('Should use delimiter config for rendering and editing', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : PredecessorColumn.type, width : 150, delimiter : ',' },
                { type : SuccessorColumn.type, width : 150, delimiter : '/' }
            ]
        });

        t.selectorExists('.id14 [data-column=predecessors]:contains(11,12,13)', 'Correct separator rendered #1');
        t.selectorExists('.id14 [data-column=successors]:contains(21/22)', 'Correct separator rendered #2');

        gantt.startEditing({ id : 14, field : 'predecessors' });
        t.is(document.querySelector('input[name=predecessors]').value, '11,12,13', 'Correct separator while editing #1');

        gantt.features.cellEdit.cancelEditing();

        gantt.startEditing({ id : 14, field : 'successors' });
        t.is(document.querySelector('input[name=successors]').value, '21/22', 'Correct separator while editing #2');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8763
    t.it('Should not crash when picking two predecessors', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            appendTo : document.body,
            columns  : [
                { type : PredecessorColumn.type, width : 150 }
            ]
        });

        t.chain(
            { dblclick : '[data-index="9"] .b-grid-cell[data-column=predecessors]' },

            { click : '.b-icon-picker' },

            { click : '.b-list-item:textEquals(Planning)' },

            { click : '.b-list-item:textEquals(Investigate)' },

            { click : '[data-task-id="11"]' },

            () => {
                t.pass('No crash');
            }

        );
    });
});
