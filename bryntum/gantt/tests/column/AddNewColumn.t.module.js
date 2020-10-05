
StartTest(t => {

    let gantt,
        addNewColumn;

    t.beforeEach(() => {
        gantt && gantt.destroy();
        gantt = t.getGantt({
            appendTo : document.body,

            id : 'gantt',

            subGridConfigs : {
                locked : {
                    width : 200
                }
            },
            columns : [
                { type : 'name' },
                { text : 'foo' },
                { text : 'bar' },
                { text : 'baz' },
                { type : 'addnew', width : 80 }
            ]
        });
        addNewColumn = gantt.columns.getAt(4);
    });

    t.it('Check all extra available columns', (t) => {

        t.chain(
            { waitForRowsVisible : gantt },

            { click : addNewColumn.columnCombo.input },

            () => {
                t.isDeeply(addNewColumn.columnCombo.picker.store.records.map(r => ({ id : r.id, text : r.text })),
                    [
                        { id : 'percentdone', text : '% Done' },
                        { id : 'resourceassignment', text : 'Assigned Resources' },
                        { id : 'calendar', text : 'Calendar' },
                        { id : 'constraintdate', text : 'Constraint Date' },
                        { id : 'constrainttype', text : 'Constraint Type' },
                        { id : 'deadlinedate', text : 'Deadline' },
                        { id : 'duration', text : 'Duration' },
                        { id : 'earlyenddate', text : 'Early End' },
                        { id : 'earlystartdate', text : 'Early Start' },
                        { id : 'effort', text : 'Effort' },
                        { id : 'eventmode', text : 'Event mode' },
                        { id : 'enddate', text : 'Finish' },
                        { id : 'lateenddate', text : 'Late End' },
                        { id : 'latestartdate', text : 'Late Start' },
                        { id : 'manuallyscheduled', text : 'Manually scheduled' },
                        { id : 'milestone', text : 'Milestone' },
                        { id : 'note', text : 'Note' },
                        { id : 'predecessor', text : 'Predecessors' },
                        { id : 'rollup', text : 'Rollup' },
                        { id : 'schedulingmodecolumn', text : 'Scheduling Mode' },
                        { id : 'sequence', text : 'Sequence' },
                        { id : 'showintimeline', text : 'Show in timeline' },
                        { id : 'startdate', text : 'Start' },
                        { id : 'successor', text : 'Successors' },
                        { id : 'totalslack', text : 'Total Slack' },
                        { id : 'wbs', text : 'WBS' }
                    ],
                    'Correct available columns');
            });
    });

    t.it('Create new column', (t) => {
        const
            newColumnsStore = addNewColumn.columnCombo.store,
            firstColumnClass = newColumnsStore.getAt(0).value,
            secondColumnClass = newColumnsStore.getAt(1).value;

        t.chain(
            { waitForRowsVisible : gantt },

            { click : addNewColumn.columnCombo.input },

            next => {
                t.click(addNewColumn.columnCombo.picker.getItem(0)).then(next);
            },

            { waitFor : () => !addNewColumn.columnCombo.picker.isVisible },

            // The first column class must now be present
            next => {
                t.ok(gantt.columns.some(c => c.constructor === firstColumnClass));
                next();
            },

            { click : addNewColumn.columnCombo.input },

            next => {
                t.click(addNewColumn.columnCombo.picker.getItem(0)).then(next);
            },

            { waitFor : () => !addNewColumn.columnCombo.picker.isVisible },

            // The second column class must now be present
            () => {
                t.ok(gantt.columns.some(c => c.constructor === secondColumnClass));
            }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8133/details
    t.it('should not cause scroll to be reset when hiding a column', (t) => {

        t.chain(
            { waitForRowsVisible : gantt },

            next => {
                gantt.subGrids.locked.scrollable.x = 100;
                next();
            },

            { rightClick : '.b-grid-header-text:contains(foo)' },
            { click : '.b-menu-text:contains(Hide)' },

            () => {
                gantt.columns.getAt(2).hidden = true;

                t.is(gantt.subGrids.locked.scrollable.x, 100, 'Scroll intact');
            }
        );
    });
});
