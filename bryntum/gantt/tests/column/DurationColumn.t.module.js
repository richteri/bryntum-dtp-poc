import { DurationColumn, NameColumn } from '../../build/gantt.module.js';
/* global ProjectModel */

StartTest((t) => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should render duration', (t) => {
        const project = new ProjectModel({
            startDate  : '2017-01-16',
            eventsData : [
                {
                    id          : 1,
                    cls         : 'id1',
                    name        : 'Planning',
                    percentDone : 60,
                    startDate   : '2017-01-16',
                    duration    : 10,
                    expanded    : true,
                    rollup      : true,
                    children    : [
                        {
                            id           : 11,
                            cls          : 'id11',
                            name         : 'Investigate',
                            percentDone  : 70,
                            startDate    : '2017-01-16',
                            duration     : 10,
                            durationUnit : 'day'
                        },
                        {
                            id           : 12,
                            cls          : 'id12',
                            name         : 'Assign resources',
                            percentDone  : 60,
                            startDate    : '2017-01-16',
                            duration     : 8,
                            durationUnit : 'minute'
                        },
                        {
                            id          : 13,
                            cls         : 'id13',
                            name        : 'Assign resources',
                            percentDone : 60,
                            startDate   : '2017-01-16'
                        }
                    ]
                }
            ]
        });

        gantt = t.getGantt({
            appendTo : document.body,
            height   : 300,
            project  : project,
            columns  : [
                { type : NameColumn.type, width : 150 },
                { type : DurationColumn.type, width : 150 }
            ]
        });

        t.chain(
            { waitForPropagate : project },

            { waitForSelector : '.b-number-cell:textEquals(10 days)' },
            { waitForSelector : '.b-number-cell:textEquals(8 minutes)' },
            { waitForSelector : '.b-grid-row:last-child .b-number-cell:empty' }
        );
    });

    t.it('Should not be allowed to edit duration on parents', t => {
        const project = new ProjectModel({
            startDate  : '2017-01-16',
            eventsData : [
                {
                    id          : 1,
                    name        : 'Planning',
                    percentDone : 60,
                    startDate   : '2017-01-16',
                    duration    : 10,
                    expanded    : true,
                    children    : [
                        {
                            id           : 11,
                            name         : 'Investigate',
                            percentDone  : 70,
                            startDate    : '2017-01-16',
                            duration     : 10,
                            durationUnit : 'day'
                        }
                    ]
                }
            ]
        });

        gantt = t.getGantt({
            appendTo : document.body,
            height   : 300,
            project  : project,
            columns  : [
                { type : NameColumn.type, width : 150 },
                { type : DurationColumn.type, width : 150 }
            ]
        });

        t.chain(
            { waitForPropagate : project },

            { dblClick : '.b-tree-parent-row [data-column=fullDuration]' },

            next => {
                t.selectorNotExists('.b-editor', 'No editor shown parent');
                next();
            },

            { dblClick : '.b-grid-row:not(.b-tree-parent-row) [data-column=fullDuration]' },

            { waitForSelector : '.b-editor', desc : 'Editor shown for child' }
        );
    });

    t.it('Should not try to instantly update invalid values', t => {
        gantt = t.getGantt({
            project : {
                eventsData : [
                    {
                        id       : 11,
                        duration : 10
                    }
                ]
            },
            columns : [
                { type : DurationColumn.type, width : 150 }
            ]
        });

        t.wontFire(gantt.taskStore, 'update');

        t.chain(
            { dblClick : '.b-grid-cell[data-column=fullDuration]' },
            { type : '-1', clearExisting : true }
        );
    });

    // https://github.com/bryntum/support/issues/1135
    t.it('Should sort duration values correctly', t => {
        gantt = t.getGantt({
            project : {
                eventsData : [
                    {
                        id          : 11,
                        name        : 'Planning',
                        percentDone : 60,
                        startDate   : '2017-01-16',
                        duration    : 10,
                        expanded    : true,
                        children    : [
                            {
                                id           : 1,
                                name         : 'One',
                                percentDone  : 70,
                                startDate    : '2017-01-16',
                                duration     : 1,
                                durationUnit : 'day'
                            },
                            {
                                id           : 2,
                                name         : 'Ten',
                                percentDone  : 70,
                                startDate    : '2017-01-16',
                                duration     : 10,
                                durationUnit : 'day'
                            },
                            {
                                id           : 3,
                                name         : 'Five',
                                percentDone  : 70,
                                startDate    : '2017-01-16',
                                duration     : 5,
                                durationUnit : 'day'
                            },
                            {
                                id           : 5,
                                name         : 'Thousand',
                                percentDone  : 70,
                                startDate    : '2017-01-16',
                                duration     : 1000,
                                durationUnit : 'second'
                            }
                        ]
                    }
                ]
            },
            columns : [
                { type : DurationColumn.type }
            ]
        });
        const tasks = gantt.taskStore.rootNode.firstChild.children;

        t.chain(
            { click : '.b-grid-header[data-column=fullDuration]' },

            async() => t.isDeeply(tasks.map(task => task.duration), [1000, 1, 5, 10]),

            { click : '.b-grid-header[data-column=fullDuration]' },

            async() => t.isDeeply(tasks.map(task => task.duration), [10, 5, 1, 1000])
        );
    });

    t.it('Should show error tooltip when finalizeCellEditor returns false', t => {
        gantt       = t.getGantt({
            project : {
                eventsData : [
                    {
                        id           : 1,
                        name         : 'Task',
                        startDate    : '2017-01-16',
                        duration     : 1,
                        durationUnit : 'day'
                    }
                ]
            },
            columns : [
                {
                    type             : DurationColumn.type,
                    finalizeCellEdit : async({ value }) => {

                        if (value.magnitude > 10) {
                            return 'foo';
                        }
                    }
                }
            ]
        });

        t.wontFire(gantt.taskStore, 'add', 'Tabbing out of invalid cell did not create a new row');

        t.chain(
            { dblclick : '.b-grid-cell[data-column=fullDuration]' },

            { type : '11d', clearExisting : true },

            { type : '[TAB]' },

            { waitForSelector : '#bryntum-field-errortip:contains(foo)' },

            async() => t.selectorExists('.b-durationfield.b-invalid')
        );
    });

    t.it('Should hide error tooltip when finalizeCellEditor returns true after first returning false', t => {
        gantt       = t.getGantt({
            project : {
                eventsData : [
                    {
                        id           : 1,
                        name         : 'Task',
                        startDate    : '2017-01-16',
                        duration     : 1,
                        durationUnit : 'day'
                    }
                ]
            },
            columns : [
                {
                    type             : DurationColumn.type,
                    finalizeCellEdit : async({ value }) => {
                        if (value.magnitude > 10) {
                            return 'foo';
                        }

                        return true;
                    }
                }
            ]
        });

        t.firesOnce(gantt.taskStore, 'add', 'Tabbing out of valid cell did create a new row');

        t.chain(
            { dblclick : '.b-grid-cell[data-column=fullDuration]' },

            { type : '11d', clearExisting : true },

            { type : '[TAB]' },

            { waitForSelector : '#bryntum-field-errortip:contains(foo)' },

            { type : '9d', clearExisting : true },
            { type : '[TAB]' },

            { waitForSelectorNotfound : '.b-durationfield.b-invalid' },

            { waitForSelector : '.b-textfield [name=name]:focus' },

            { type : 'Hello[ENTER]', clearExisting : true },

            () => t.is(gantt.taskStore.rootNode.lastChild.name, 'Hello')
        );
    });
});
