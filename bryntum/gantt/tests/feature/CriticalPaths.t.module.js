StartTest(function(t) {

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should render critical paths', async(t) => {

        gantt = t.getGantt({
            appendTo : document.body,
            project  : {
                tasksData : [
                    { id : 1, startDate : '2016-02-01', duration : 5 },
                    { id : 2, startDate : '2016-02-01', duration : 10 },
                    { id : 3, startDate : '2016-02-12', duration : 1 },
                    { id : 4, startDate : '2016-02-01', duration : 1 },
                    { id : 5, startDate : '2016-02-02', duration : 1 },
                    { id : 6, startDate : '2016-02-03', duration : 1 }
                ],
                dependenciesData : [
                    /* DependencyType.EndToEnd */
                    { id : 23, fromEvent : 2, toEvent : 3, type : 3 },
                    { id : 45, fromEvent : 4, toEvent : 5 },
                    { id : 56, fromEvent : 5, toEvent : 6 }
                ]
            }
        });

        await gantt.project.waitForPropagateCompleted();

        t.chain(
            next => {
                t.ok(gantt.features.criticalPaths.disabled, 'the feature is disabled by default');
                t.selectorCountIs('.b-gantt-task.b-critical', 2, 'two critical tasks are there');
                next();
            },

            { diag : 'Enabling the feature' },

            next => {
                t.waitForEvent(gantt, 'criticalPathsHighlighted', next);
                gantt.features.criticalPaths.disabled = false;
            },

            { waitForSelector : '.b-gantt.b-gantt-critical-paths', desc : 'Critical path feature CSS class is added' },

            next => {
                t.selectorCountIs('.b-sch-dependency.b-critical', 1, 'one dependency is highlighted');
                next();
            },

            { diag : 'Disabling the feature' },

            next => {
                t.waitForEvent(gantt, 'criticalPathsUnhighlighted', next);
                gantt.features.criticalPaths.disabled = true;
            },

            { waitForSelectorNotFound : '.b-gantt.b-gantt-critical-paths', desc : 'Critical path feature CSS class is removed' },

            next => {
                t.selectorCountIs('.b-sch-dependency.b-critical', 0, 'no highlighted dependency');
                next();
            }
        );
    });
});
