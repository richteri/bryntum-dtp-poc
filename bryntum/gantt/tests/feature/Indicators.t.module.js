import { ProjectModel, Rectangle } from '../../build/gantt.module.js';

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
                        { id : 13, name : 'Task 13', startDate : '2020-02-24', duration : 2 },
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
            features : {
                indicators : true
            },

            rowHeight             : 50,
            barMargin             : 15,
            enableEventAnimations : false,

            startDate : '2020-02-24',

            project
        }, config));

        await project.waitForPropagateCompleted();
    }

    t.it('Should render default indicators', async t => {
        await createGantt();

        t.selectorExists('.b-indicator.b-early-dates', 'Early start/end date indicator rendered');
        t.selectorExists('.b-indicator.b-late-dates', 'Late start/end date indicator renderred');
        t.selectorExists('.b-indicator.b-constraint-date', 'Constraint date indicator rendered');
        t.selectorExists('.b-indicator.b-deadline-date', 'Deadline indicator rendered');
    });

    t.it('Should render custom indicators', async t => {
        await createGantt({
            features : {
                indicators : {
                    items : {
                        beer : taskRecord => ({
                            startDate : taskRecord.startDate,
                            name      : 'Beer',
                            iconCls   : 'b-fa b-fa-beer'
                        })
                    }
                }
            }
        });

        t.selectorCountIs('.b-indicator .b-fa-beer', gantt.taskStore.count, 'Custom indicators rendered');
    });

    t.it('Should allow toggling indicators', async t => {
        await createGantt({
            features : {
                indicators : {
                    items : {
                        earlyDates : false,

                        beer : taskRecord => ({
                            startDate : taskRecord.startDate,
                            name      : 'Dog',
                            iconCls   : 'b-fa b-fa-dog'
                        })
                    }
                }
            }
        });

        t.selectorNotExists('.b-early-dates', 'Early dates not rendered');

        gantt.features.indicators.items.earlyDates = true;
        gantt.features.indicators.items.beer = false;

        t.selectorExists('.b-early-dates', 'Early dates rendered');
        t.selectorNotExists('.b-indicator .b-fa-dog', 'Custom not rendered');
    });

    t.it('Should update UI on data changes', async t => {
        await createGantt();

        const
            constraintElement = document.querySelector('.b-indicator.b-constraint-date'),
            deadlineElement = document.querySelector('.b-indicator.b-deadline-date'),
            constraintBox = Rectangle.from(constraintElement),
            deadlineBox   = Rectangle.from(deadlineElement);

        t.diag('Changing constraint and deadline dates');

        gantt.taskStore.getById(11).constraintDate = '2020-02-25';
        gantt.taskStore.getById(12).deadlineDate = '2020-03-06';

        await project.propagate();

        const
            deltaConstraint = constraintBox.getDelta(Rectangle.from(constraintElement)),
            deltaDeadline   = deadlineBox.getDelta(Rectangle.from(deadlineElement));

        t.selectorCountIs('.b-indicator.b-constraint-date', 1, 'Single constraint indicator');
        t.selectorCountIs('.b-indicator.b-deadline-date', 1, 'Single deadline indicator');

        t.is(document.querySelector('.b-indicator.b-constraint-date'), constraintElement, 'Constraint element reused');
        t.is(document.querySelector('.b-indicator.b-deadline-date'), deadlineElement, 'Deadline element reused');

        t.is(deltaConstraint[0], gantt.tickWidth, 'Constraint did move correct distance horizontally');
        t.is(deltaConstraint[1], 0, 'Constraint did not move vertically');

        t.is(deltaDeadline[0], gantt.tickWidth, 'Deadline did move correct distance horizontally');
        t.is(deltaDeadline[1], 0, 'Deadline did not move vertically');

        t.diag('Nulling deadline date');

        gantt.taskStore.getById(12).deadlineDate = null;

        t.selectorNotExists('.b-indicator.b-deadline-date', 'No deadline indicator');
    });

    t.it('Should not show point-in-time indicators that are outside time axis', async t => {
        await createGantt({
            project : {
                tasksData : [
                    { id : 11, name : 'Task 11', startDate : '2020-03-01', duration : 2, constraintDate : '2020-03-01', constraintType : 'muststarton' }
                ]
            },
            features : {
                indicators : {
                    items : {
                        earlyDates : false,
                        beer : taskRecord => ({
                            startDate : new Date(2020, 1, 22),
                            name      : 'Dog',
                            iconCls   : 'b-fa b-fa-dog'
                        })
                    }
                }
            }
        });

        t.selectorNotExists('.b-indicator .b-fa-dog', 'Indicators outside axis not rendered');
    });
});
