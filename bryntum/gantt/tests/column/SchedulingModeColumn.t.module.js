import { SchedulingModeColumn } from '../../build/gantt.module.js';

StartTest((t) => {
    let gantt;

    t.beforeEach((t) => {
        gantt && gantt.destroy();
    });

    t.it('Should render properly', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : SchedulingModeColumn.type, width : 80 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            next => {
                t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)', 'Cell rendered correctly');
                t.selectorExists('[data-index=3] [data-column=schedulingMode]:textEquals(Fixed Units)', 'Cell rendered correctly');
                t.selectorExists('[data-index=4] [data-column=schedulingMode]:textEquals(Fixed Effort)', 'Cell rendered correctly');
                next();
            }
        );
    });

    t.it('Should change scheduling mode property', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : SchedulingModeColumn.type, width : 80 }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            { dblclick : '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)' },

            { click : '.b-fieldtrigger' },

            { click : '.b-list-item:textEquals(Fixed Units)' },

            { type : '[TAB]' },

            (next) => {
                t.is(gantt.taskStore.getAt(2).schedulingMode, 'FixedUnits', 'Switched to fixed units');
                next();
            },

            { dblclick : '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Units)' },

            { click : '.b-fieldtrigger' },

            { click : '.b-list-item:textEquals(Fixed Effort)' },

            { type : '[TAB]' },

            (next) => {
                t.is(gantt.taskStore.getAt(2).milestone, false, 'Switched to fixed effort');
                next();
            },

            { dblclick : '[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Effort)' },

            { click : '.b-fieldtrigger' },

            { click : '.b-list-item:textEquals(Fixed Duration)' },

            { type : '[TAB]' },

            (next) => {
                t.is(gantt.taskStore.getAt(2).schedulingMode, 'FixedDuration', 'Switched to fixed duration');
                next();
            }
        );
    });

    t.it('Should update display value when scheduling mode is changed', (t) => {
        gantt = t.getGantt({
            appendTo : document.body,
            id       : 'gantt',
            columns  : [
                { type : SchedulingModeColumn.type, width : 80 }
            ]
        });

        const
            model = gantt.taskStore.getAt(2),
            project = gantt.project;

        t.chain(
            { waitForRowsVisible : gantt },

            async() => project.waitForPropagateCompleted(),

            async() => {
                model.schedulingMode = 'FixedUnits';
                await project.propagate();
                t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Units)', 'Cell re-rendered correctly');

                model.schedulingMode = 'FixedEffort';
                await project.propagate();
                t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Effort)', 'Cell re-rendered correctly');

                model.schedulingMode = 'FixedDuration';
                await project.propagate();
                t.selectorExists('[data-index=2] [data-column=schedulingMode]:textEquals(Fixed Duration)', 'Cell re-rendered correctly');
            }
        );
    });
});
