/**
 * @author Saki
 * @date 2019-12-15 20:40:06
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-31 01:00:21
 */
StartTest(t => {
    t.it('Rendering', t => {
        t.chain(
            { waitForSelector : '.b-gantt' },
            { waitForSelector : '.b-gantt-task' }
        );
    });
    
    t.it('Context Menu', t => {
        t.chain(
            { contextmenu : '.b-sch-header-timeaxis-cell:textEquals(Mar 2017)' },
            { waitForSelector : '.b-menu-text:textEquals(Filter tasks)' },
            { waitForSelector : '.b-menu-text:textEquals(Zoom)' },
            { waitForSelector : '.b-menu-text:textEquals(Date range)' }
        );
    });

    t.it('Task Editor', t => {
        t.chain(
            { dblclick : '[data-task-id="11"]' },
            { waitForSelector : '.b-gantt-taskeditor' },
            { click : '[name="name"]' },
            { type : ' to do[ENTER]' },
            { waitForSelector : '.b-grid-cell :textEquals(Important task to do)' }
        );
    });

    t.it('Tooltips', t => {
        t.chain(
            { moveMouseTo : '[data-task-id="14"]' },
            { waitForSelector : '.b-gantt-task-title:textEquals(Email customer)' }
        );
    });

    t.it('Interaction', t => {
        t.chain(
            { waitForSelector : '.b-task-rollup', desc : 'Should have rollups' },

            { click : '.b-checkbox-label' },
            
            { waitForSelectorNotFound : '.b-task-rollup', desc : 'Shouldn\'t have rollups' }
        );
    });
});

// eof
