/*KEEP*/import { Grid } from '../../../Grid/build/grid.module.js';
/*KEEP*/import { Scheduler } from '../../../Scheduler/build/scheduler.module.js';
/*KEEP*/import { Gantt } from '../../build/gantt.module.js';

// NOTE: Any changes here should also be applied to grid-and-scheduler-module-online.t.js

StartTest(t => {
    t.ok(Grid, 'Grid available');
    t.ok(Scheduler, 'Scheduler available');
    t.ok(Gantt, 'Gantt available');

    new Grid({
        appendTo : document.body,
        id       : 'grid',
        width    : 1024,
        height   : 300,
        columns  : [
            { field : 'name', text : 'Name' }
        ],
        data : [
            { name : 'Mr Fantastic' }
        ]
    });

    new Scheduler({
        appendTo  : document.body,
        id        : 'scheduler',
        width     : 1024,
        height    : 300,
        resources : [
            { id : 1, name : 'The Thing' }
        ],
        startDate : new Date(2019, 4, 1),
        endDate   : new Date(2019, 4, 31),
        events    : [
            { resourceId : 1, startDate : new Date(2019, 4, 21), duration : 2 }
        ]
    });

    new Gantt({
        appendTo : document.body,
        id       : 'gantt',
        width    : 1024,
        height   : 300,
        project : {
            eventsData : [{}]
        }
    });

    t.chain(
        { waitForSelector : '.b-grid#grid', desc : 'Grid element found' },
        { waitForSelector : '.b-scheduler#scheduler', desc : 'Scheduler element found' },
        { rightClick : '#grid .b-grid-cell', desc : 'Grid: trigger element added to float root' },
        { rightClick : '#scheduler .b-sch-timeaxis-cell', desc : 'Scheduler: trigger element added to float root' },
        { rightClick : '#gantt .b-sch-timeaxis-cell', desc : 'Gantt: trigger element added to float root' },

        { waitForSelector : '.b-float-root' },

        () => {
            t.selectorCountIs('.b-float-root', 1, 'Single float root');

            t.notOk('BUNDLE_EXCEPTION' in window, 'No exception from including all 3 products');
        }
    );
});
