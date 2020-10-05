
StartTest(t => {
    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should render dependencies', t => {
        gantt = t.getGantt({
            appendTo : document.body
        });

        t.selectorCountIs('.b-sch-dependency', 10, 'Elements found for all valid dependencies');

        gantt.dependencies.forEach(dep => t.assertDependency(gantt, dep));
    });

    t.it('Creating dependencies with D&D', t => {
        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        const project = gantt.project,
            t12 = project.getEventStore().getById(12),
            t13 = project.getEventStore().getById(13);

        t.chain(
            async() => {
                t.is(t12.startDate, t13.startDate, 'Tasks 12 and 13 start at the same time');
            },
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                waitForElementVisible : '.b-sch-terminal-right'
            },
            {
                drag     : '.b-sch-terminal-right',
                to       : "[data-task-id='13'] .b-gantt-task",
                dragOnly : true
            },
            {
                moveCursorTo : "[data-task-id='13'] .b-gantt-task .b-sch-terminal-left"
            },
            {
                mouseUp : null
            },
            async() => {
                await project.waitForPropagateCompleted();

                t.is(t13.startDate, t12.endDate, 'Task 13 shifted to start after Task 12 ends after dependency creation');
            }
        );
    });

    t.it('Aborting creating dependency shouldn\'t throw an exception in Gantt', async t => {

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        const done = t.livesOkAsync('No expcetion thrown');

        t.chain(
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                waitForElementVisible : '.b-sch-terminal-right'
            },
            {
                drag : '.b-sch-terminal-right',
                to   : "[data-task-id='13'] .b-gantt-task"
            },
            done
        );
    });

    t.it('Creating: Should not be valid to drop on a task bar', t => {

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                waitForElementVisible : '.b-sch-terminal-right'
            },
            {
                drag     : '.b-sch-terminal-right',
                to       : "[data-task-id='13'] .b-gantt-task",
                dragOnly : true
            },
            {
                waitForElementVisible : '.b-tooltip .b-icon-invalid'
            },
            {
                mouseUp : null
            }
        );
    });

    t.it('Creating: Validating dependencies while D&D', t => {

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            },
            dependencies : []
        });

        t.chain(
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                waitForElementVisible : '.b-sch-terminal-right'
            },
            {
                drag     : '.b-sch-terminal-right',
                to       : "[data-task-id='13'] .b-gantt-task",
                dragOnly : true
            },
            {
                moveCursorTo : "[data-task-id='13'] .b-gantt-task .b-sch-terminal-left"
            },
            // Happens too fast after change to validate only once per terminal
            // {
            //     waitForElementVisible : '.b-tooltip .b-icon-checking'
            // },
            {
                waitForElementVisible : '.b-tooltip .b-icon-valid'
            },
            {
                waitForElementVisible : '.b-sch-terminal-left.b-valid'
            },
            {
                mouseUp : null
            },

            { waitForSelector : '.b-sch-dependency' }
        );
    });

    t.it('Creating: Should not be valid to create dependencies between connected tasks', t => {

        gantt = t.getGantt({
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        t.wontFire(gantt.dependencyStore, 'add');

        t.chain(
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                waitForElementVisible : '.b-sch-terminal-right'
            },
            {
                drag     : '.b-sch-terminal-right',
                to       : "[data-task-id='14'] .b-gantt-task",
                dragOnly : true
            },
            {
                moveCursorTo : "[data-task-id='14'] .b-gantt-task .b-sch-terminal-left"
            },
            // Happens too fast after change to validate only once per terminal
            // {
            //     waitForElementVisible : '.b-tooltip .b-icon-checking'
            // },
            {
                waitForElementVisible : '.b-tooltip .b-icon-invalid'
            },
            {
                waitForElementVisible : '.b-sch-terminal-left.b-invalid'
            },
            {
                mouseUp : null
            }
        );
    });

    t.it('Editing dependencies', async t => {
        gantt = t.getGantt({
            columns : [{
                text  : 'Predecessors',
                field : 'predecessors',
                type  : 'dependency',
                width : 200
            }],
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        const project       = gantt.project;

        await project.waitForPropagateCompleted();

        const multiDepTask = project.eventStore.find(t => t.predecessors.length === 3),
            multiDepTaskPredecessorCellCtx = {
                id       : multiDepTask.id,
                columnId : 'predecessors'
            };

        let predecessors = multiDepTask.predecessors,
            predecessorField, tabs, dependencyGrid, predecessorPicker, saveButton, durationField;

        // Initial values correct
        t.is(predecessors[0].toString(true), '11');
        t.is(predecessors[1].toString(true), '12');
        t.is(predecessors[2].toString(true), '13');
        t.is(gantt.getCell(multiDepTaskPredecessorCellCtx).innerText, '11;12;13');

        t.chain(
            {
                waitFor : () => gantt.features.cellEdit.editorContext,
                trigger : { doubleclick : () => gantt.getCell(multiDepTaskPredecessorCellCtx) }
            },

            next => {
                predecessorField = gantt.features.cellEdit.editorContext.editor.inputField;

                // Field is populated correctly both in underlying Dependency record content and raw value
                t.is(predecessorField.input.value, '11;12;13');
                t.isDeeply(predecessorField.value, predecessors);

                next();
            },

            {
                // Expand the dropdown
                waitFor : () => predecessorField.picker.isVisible,
                trigger : { click : () => predecessorField.triggers.expand.element }
            },

            next => {
                t.selectorExists('.b-list-item.id11.b-selected.b-fs');
                t.selectorExists('.b-list-item.id12.b-selected.b-fs');
                t.selectorExists('.b-list-item.id13.b-selected.b-fs');
                next();
            },

            // Toggle the to side to make the relationship FF
            { click : '.b-list-item.id11.b-selected.b-fs [data-side="to"]' },

            next => {
                t.is(predecessorField.input.value, '11FF;12;13');
                next();
            },

            // Toggle the from side to make the relationship SF
            { click : '.b-list-item.id11.b-selected.b-ff [data-side="from"]' },

            next => {
                t.is(predecessorField.input.value, '11SF;12;13');
                next();
            },

            // Toggle the to side to make the relationship SS
            { click : '.b-list-item.id11.b-selected.b-sf [data-side="to"]' },

            next => {
                t.is(predecessorField.input.value, '11SS;12;13');
                next();
            },

            // Toggle the from side to make the relationship FS
            { click : '.b-list-item.id11.b-selected.b-ss [data-side="from"]' },

            next => {
                t.is(predecessorField.input.value, '11;12;13');
                next();
            },

            { click : '.b-list-item.id11.b-selected.b-fs .b-predecessor-item-text' },

            // Task 11 is no longer a predecessor
            next => {
                t.selectorNotExists('.b-list-item.id11.b-selected.b-fs');
                t.is(predecessorField.input.value, '12;13');
                next();
            },

            { click : '.b-list-item.id11 .b-predecessor-item-text' },

            // Task 11 is a predecessor again
            next => {
                t.selectorExists('.b-list-item.id11.b-selected.b-fs');
                t.is(predecessorField.input.value, '12;13;11');
                t.moveMouseTo(predecessorField.input, next);
            },

            // -----------------------

            // Double click the destination task of these three deps
            { dblclick : '.b-gantt-task-wrap[data-task-id="14"]' },

            // Select the predecessors tab of the TabPanel
            { click : '.b-tabpanel-tab.b-predecessors-tab' },

            // Begin editing the link type of the first dep
            { dblclick : '.b-grid-cell[data-column="type"]' },

            // Collect widget refs
            next => {
                // All three incoming dependencies have zero lag to begin with
                t.selectorCountIs('.b-grid-cell:contains("0 days")', 3);

                saveButton = gantt.features.taskEdit.editor.widgetMap.saveButton;
                tabs = gantt.features.taskEdit.editor.widgetMap.tabs.widgetMap;
                dependencyGrid = tabs.predecessorstab.widgetMap['predecessorstab-grid'];
                next();
            },

            // Dropdown the link types
            next => {
                predecessorPicker = dependencyGrid.features.cellEdit.editorContext.editor.inputField;

                next();
            },

            {
                waitFor : () => predecessorPicker.picker.isVisible,
                trigger : { click : () => predecessorPicker.triggers.expand.element }
            },

            // Select the SS item
            { click : '.b-list-item[data-index="0"]' },

            // This will finish dependency type editing and start propagation, plus it will start full lag editing
            { dblclick : '.b-grid-cell[data-column="fullLag"]' },

            async() => project.waitForPropagateCompleted(),

            next => {
                durationField = dependencyGrid.features.cellEdit.editorContext.editor.inputField;
                next();
            },

            // Make it +1 day
            { click : () => durationField.triggers.spin.upButton },

            // Wait for the propagate of the changed value
            async() => project.waitForPropagateCompleted(),

            // Editing must not have been stopped by a store reload.
            next => {
                t.ok(dependencyGrid.features.cellEdit.editorContext && dependencyGrid.features.cellEdit.editorContext.editor.containsFocus, 'Changing the lag did not terminate the edit');
                next();
            },

            // Save the edit
            { click : () => saveButton.element },

            // Check that the cell has been updtaed
            { waitFor : () => gantt.getCell(multiDepTaskPredecessorCellCtx).innerText === '12SS+1d;13;11' },

            // Now lets edit that lag text
            { dblclick : gantt.getCell(multiDepTaskPredecessorCellCtx) },

            // Check that the editor has been primed with correct new textual value
            { waitFor : () => predecessorField.containsFocus && predecessorField.input.value === '12SS+1d;13;11' },

            // This just switches the lag from +1 day to -1 day
            { type : '12FF-1d;13;11[ENTER]', clearExisting : true },

            async() => project.waitForPropagateCompleted(),

            () => {
                predecessors = multiDepTask.predecessors;

                // Check the input was parsed correctly and the predecessors are correct
                t.is(predecessors[0].toString(true), '12FF-1d');
                t.is(predecessors[1].toString(true), '13');
                t.is(predecessors[2].toString(true), '11');
            }
        );
    });

    t.it('Should not cancel edit when editing a new dependency', async t => {
        gantt = t.getGantt({
            columns : [{
                text  : 'Predecessors',
                field : 'predecessors',
                type  : 'dependency',
                width : 200
            }],
            appendTo : document.body,
            features : {
                taskTooltip : false
            }
        });

        let editorContext;

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            next => {
                gantt.features.taskEdit.editor.widgetMap.tabs.layout.animateCardChange = false;
                next();
            },

            { click : '.b-tabpanel-tab-title:contains(Predecessors)' },

            { click : '.b-predecessorstab .b-add-button' },

            {
                waitFor : () => {
                    editorContext = gantt.features.taskEdit.editor.widgetMap['predecessorstab-grid'].features.cellEdit.editorContext;

                    return editorContext && editorContext.editor.containsFocus;
                }
            },

            next => {
                t.click(editorContext.editor.inputField.triggers.expand.element).then(next);
            },

            next => {
                t.click(editorContext.editor.inputField.picker.getItem(2)).then(next);
            },

            { type : '[TAB]' },

            // Nothing should happen. The test is that editiong does not finish
            // so there's no event to wait for.
            { waitFor : 500 },

            () => {
                editorContext = gantt.features.taskEdit.editor.widgetMap['predecessorstab-grid'].features.cellEdit.editorContext;

                t.ok(editorContext && editorContext.editor.containsFocus);
            }
        );
    });

    // https://github.com/bryntum/support/issues/338
    t.it('Creating: Should not crash when moving mouse outside schedule area', t => {

        gantt = t.getGantt({
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            {
                moveCursorTo : "[data-task-id='12'] .b-gantt-task"
            },
            {
                drag     : '.b-sch-terminal-right',
                to       : '.b-grid-splitter',
                dragOnly : true
            },

            { waitFor : 500, desc : 'Waiting for transition to end' }
        );
    });

    t.it('Should not throw an exception when mouse is moved out from task terminal of a removed task', t => {
        gantt = t.getGantt({
            transitionDuration    : 500,
            enableEventAnimations : true, // Needs explicitly configuring because IE11 turns animations off
            useInitialAnimation   : false,
            tasks                 : [
                {
                    id        : 41,
                    name      : 'Task 41',
                    cls       : 'task41',
                    startDate : '2017-01-16',
                    duration  : 2,
                    leaf      : true
                }
            ]
        });

        t.chain(
            { click : '.b-gantt-task' },
            { moveCursorTo : '.b-sch-terminal' },

            { type : '[DELETE]' },

            // This step is required to reproduce the bug, no extra mouse movement needed
            next => {
                // The bug happens when the element becomes `pointer-events: none;` due to being
                // put into an animated removing state. Mouseout is triggered in a real UI,
                // so we have to explicitly fire one here.
                t.simulator.simulateEvent(document.querySelector('.b-sch-terminal'), 'mouseout');
                next();
            },

            { waitForSelectorNotFound : gantt.unreleasedEventSelector, desc : 'Task was removed' }
        );
    });
});
