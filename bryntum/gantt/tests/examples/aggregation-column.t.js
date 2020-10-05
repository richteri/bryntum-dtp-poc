StartTest(t => {
    let gantt, task;

    t.waitFor(() => {
        gantt = bryntum.query('gantt');
        if (gantt) {
            task = gantt.taskStore.first;
            return true;
        }
    });

    t.it('Should edit child cost inline and recalculate parent cost', t =>   {
        t.chain(
            async() => {
                t.is(task.cost, 116750, 'Correct cost calculated');
            },
            { waitForSelector : '.b-grid-cell:contains("$116750")', description : 'Correct cost displayed' },
            {
                dblClick    : '.b-grid-row[data-index="2"] .b-grid-cell[data-column="cost"]',
                description : 'Open cost column editor'
            },
            { waitForSelector : '.b-grid-cell[data-column="cost"].b-editing', description : 'Editor displayed' },
            { type : '10[ENTER]', description : 'Edit Cost', clearExisting : true },
            async() => {
                t.is(task.cost, 116560, 'Correct cost calculated');
            },
            { waitForSelector : '.b-grid-cell:contains("$116560")', description : 'Correct cost displayed' }
        );
    });

    t.it('Should edit child cost in Task edit dialog and recalculate parent cost', t =>   {
        t.chain(
            {
                rightClick  : '.b-grid-row[data-index="2"] .b-grid-cell[data-column="cost"]',
                description : 'Open cost column editor'
            },
            { click : '.b-menu-text:contains(Edit)' },
            { click : '.b-numberfield input[name=cost]' },
            { type : '20', description : 'Edit Cost', clearExisting : true },
            { click : '.b-button:contains(Save)' },
            async() => {
                t.is(task.cost, 116570, 'Correct cost calculated');
            },
            { waitForSelector : '.b-grid-cell:contains("$116570")', description : 'Correct cost displayed' }
        );
    });

    t.it('Should not edit calculated parent cost', t =>   {
        t.chain(
            {
                dblClick    : '.b-grid-row[data-index="1"] .b-grid-cell[data-column="cost"]',
                description : 'Try to open cost column editor'
            },
            {
                waitForSelectorNotFound : '.b-grid-cell[data-column="cost"].b-editing',
                description             : 'Editor does not displayed'
            }
        );
    });

    t.it('Should edit parent name', t =>   {
        t.chain(
            {
                dblClick    : '.b-grid-row[data-index="1"] .b-grid-cell[data-column="name"]',
                description : 'Try to open name column editor'
            },
            {
                waitForSelector : '.b-grid-cell[data-column="name"].b-editing',
                description     : 'Editor is displayed'
            }
        );
    });

    // Caught by monkeytest
    t.it('Should not fail on dblclick at normal subgrid', t =>   {
        t.chain(
            { dblClick : '.b-grid-subgrid-normal', offset : [100, 50] }
        );
    });

});
