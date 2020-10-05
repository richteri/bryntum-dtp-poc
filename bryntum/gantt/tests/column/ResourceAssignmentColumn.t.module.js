import { ResourceAssignmentColumn } from '../../build/gantt.module.js';
/* global Gantt */

StartTest((t) => {

    let gantt;

    t.beforeEach((t) => {
        gantt && gantt.destroy();
        gantt = null;
    });

    // Here we check that effort column shows the same value which is showed in its editor #950
    t.it('Should render column properly', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        let raColumn, gotData = false;

        t.chain(
            { waitForRowsVisible : gantt },

            (next) => {
                raColumn = gantt.columns.getById('resourceassignment');
                next();

            },

            ...project.getEventStore().map(event => async() => {

                await gantt.scrollCellIntoView({ id : event.id, columnId : 'resourceassignment' });

                const idx          = gantt.taskStore.allRecords.indexOf(event),
                    [cellEl]     = t.query(`.b-grid-row[data-index=${idx}] .b-grid-cell[data-column-id=resourceassignment]`),
                    valueElement = document.createElement('div');

                gotData = gotData || cellEl.innerHTML != '';

                raColumn.renderer({ value : event.assignments, cellElement : valueElement });
                t.is(cellEl.innerHTML, valueElement.innerHTML, 'Rendered ok');
            }),

            (next) => {
                t.ok(gotData, 'Resource assignment column data has been rendered');
            }
        );
    });

    t.it('Editor should be configurable with floating assignments behavior', async(t) => {
        const run = async(float) => {

            gantt = new Gantt({
                id              : 'gantt',
                appendTo        : document.body,
                rowHeight       : 45,
                taskStore       : t.getTaskStore(),
                resourceStore   : t.getTeamResourceStore(),
                assignmentStore : t.getTeamAssignmentStore(),
                columns         : [
                    { type : 'name', text : 'Name', width : 170, field : 'name' },
                    {
                        type   : ResourceAssignmentColumn.type,
                        width  : 250,
                        editor : { store : { floatAssignedResources : float } }
                    }
                ]
            });

            const project = gantt.project;

            await project.waitForPropagateCompleted();

            const
                eventStore      = project.eventStore,
                assignmentStore = project.assignmentStore,
                task1           = eventStore.getById(115),
                task1idx        = eventStore.allRecords.indexOf(task1),
                Terence         = project.resourceStore.getById(12);

            t.is(Terence.name, 'Terence', 'Got Terence');

            // Assigning Terence to task1, Terence is the last resource if sorted just by name, so he will be shown
            // last if rendered with floatAssignedResources : false config for assignment manipulation store, which
            // column editor should pass through
            assignmentStore.add({
                event    : task1,
                resource : Terence
            });

            await project.propagate();

            await new Promise(resolve => {
                t.chain(
                    { waitForRowsVisible : gantt },
                    async() => {
                        t.ok(Array.from(task1.assignments).some(a => a.resource === Terence), 'Terence is assigned to task1');
                    },
                    { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },
                    { click : '.b-assignmentfield .b-icon-down' },
                    { waitForElementVisible : '.b-assignmentpicker' },
                    // Finding Terence row, it should be last row in the grid
                    (next) => {

                        let teranceRow = t.query(`.b-assignmentpicker .b-grid-row:contains(${Terence.name})`);

                        t.ok(teranceRow && teranceRow.length, `Got ${Terence.name} row`);

                        teranceRow = teranceRow[0];

                        const terrenceIndex = Number(teranceRow.dataset.index);

                        t.selectorExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex}]`, `${Terence.name} row query is valid`);

                        if (float) {
                            t.selectorExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex + 1}]`, `${Terence.name} row is not the last row`);
                        }
                        else {
                            t.selectorNotExists(`.b-assignmentpicker .b-grid-row[data-index=${terrenceIndex + 1}]`, `${Terence.name} row is the last row`);
                        }

                        resolve();
                    }
                );
            });

            gantt.destroy();
            gantt = null;
        };

        t.diag('Testing with floating resources');
        await run(true);

        t.diag('Testing w/o floating resources');
        await run(false);
    });

    t.it('Should be possible to edit assignments', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore = project.eventStore,
            task1      = eventStore.getById(115),
            task1idx   = eventStore.allRecords.indexOf(task1),
            Arcady     = project.resourceStore.getById(1);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                t.ok(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is initially assigned to task1');
            },
            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                t.click(assignmentField.triggers.expand.element).then(next);
            },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },
            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is now unassigned from task1');
            }
        );
    });

    t.it('Should be possible to remove assignments by removing the chip from the ChipView', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore = project.eventStore,
            task1      = eventStore.getById(115),
            task1idx   = eventStore.allRecords.indexOf(task1),
            Arcady     = project.resourceStore.getById(1);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },

            async() => {
                t.ok(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is initially assigned to task1');
            },

            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                // Click the remove icon of Arcady's Chip
                t.click(assignmentField.chipView.getItem(0).querySelector('.b-icon-clear')).then(next);
            },

            { click : '.b-assignmentpicker .b-button:contains(Save)' },

            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === Arcady.id), 'Arcady is now unassigned from task1');
            }
        );
    });

    t.it('Should be possible to make assignments by checking a checkbox', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        const
            eventStore            = project.eventStore,
            task1                 = eventStore.getById(115),
            task1idx              = eventStore.allRecords.indexOf(task1),
            newlyAssignedResource = project.resourceStore.getAt(2);

        let assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === newlyAssignedResource.id), `${newlyAssignedResource.name} is not initially assigned to task1`);
            },
            { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;

                t.click(assignmentField.triggers.expand.element).then(next);
            },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=2] .b-checkbox' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },
            (next) => {
                t.notOk(Array.from(task1.assignments).some(a => a.resource.id === newlyAssignedResource.id), `${newlyAssignedResource.name} is now assigned to task1`);
            }
        );
    });

    t.it('Moving a picker column should not terminate the edit', async(t) => {
        const run = async(float) => {

            gantt = new Gantt({
                id              : 'gantt',
                appendTo        : document.body,
                rowHeight       : 45,
                taskStore       : t.getTaskStore(),
                resourceStore   : t.getTeamResourceStore(),
                assignmentStore : t.getTeamAssignmentStore(),
                columns         : [
                    { type : 'name', text : 'Name', width : 170, field : 'name' },
                    {
                        type   : ResourceAssignmentColumn.type,
                        width  : 250,
                        editor : { store : { floatAssignedResources : float } }
                    }
                ]
            });

            const project = gantt.project;

            await project.waitForPropagateCompleted();

            const task1idx = project.eventStore.allRecords.indexOf(project.eventStore.getById(115));

            await project.propagate();

            await new Promise(resolve => {
                t.chain(
                    { waitForRowsVisible : gantt },
                    { dblClick : `.b-grid-row[data-index=${task1idx}] .b-grid-cell[data-column=assignments]` },
                    { click : '.b-assignmentfield .b-icon-down' },
                    { waitForElementVisible : '.b-assignmentpicker' },

                    {
                        drag : '.b-assignmentpicker .b-grid-header:contains(Units)',
                        to   : '.b-assignmentpicker .b-grid-header:first-child'
                    },

                    // Picker should still be here
                    (next) => {
                        t.selectorExists('.b-assignmentpicker', 'Picker is still visible');

                        resolve();
                    }
                );
            });

            gantt.destroy();
            gantt = null;
        };

        t.diag('Testing with floating resources');
        await run(true);

        t.diag('Testing w/o floating resources');
        await run(false);
    });

    // Test should run though to completion. There's a throw for duplicated assignments
    t.it('Should not duplicate assignments when editing an unassigned task\'s assignments twice', async(t) => {
        gantt = new Gantt({
            id              : 'gantt',
            appendTo        : document.body,
            rowHeight       : 45,
            taskStore       : t.getTaskStore(),
            resourceStore   : t.getTeamResourceStore(),
            assignmentStore : t.getTeamAssignmentStore(),
            columns         : [
                { type : 'name', text : 'Name', width : 170, field : 'name' },
                { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250 }
            ]
        });

        const project = gantt.project;

        await project.waitForPropagateCompleted();

        let newTask, newTaskCell, assignmentField;

        t.chain(
            { waitForRowsVisible : gantt },

            { contextmenu : () => gantt.getCell({ record : gantt.taskStore.last, column : 1 }) },

            { moveMouseTo : '.b-menuitem:contains(Add)' },

            { click : '.b-menuitem:contains(Task below)' },

            next => {
                newTask     = gantt.taskStore.last;
                newTaskCell = gantt.getCell({ record : newTask, column : 1 });
                next();
            },

            { dblClick : () => newTaskCell },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                next();
            },

            { click : () => assignmentField.triggers.expand.element },

            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },

            { type : '[ENTER]' },

            // Start editing again with the same task.
            // The setProjectEvent should cause a correct data load even though it's the same event
            // as last time editing was invoked. It checks the event's generation now.
            { dblClick : () => newTaskCell },

            next => {
                assignmentField = gantt.features.cellEdit.editorContext.editor.inputField;
                next();
            },

            { click : () => assignmentField.triggers.expand.element },

            { waitForElementVisible : '.b-assignmentpicker' },
            { dblclick : '.b-assignmentgrid .b-grid-row[data-index=0] .b-grid-cell[data-column=units]' },
            { click : '.b-spin-down' },
            { click : '.b-assignmentpicker .b-button:contains(Save)' },

            { type : '[ENTER]' },

            () => {
                // We allocated Arcady, then changed the units down to 90
                t.is(newTask.assignments.length, 1);
                t.is(newTask.assignments[0].resource.name, 'Arcady');
                t.is(newTask.assignments[0].units, 90);
            }
        );
    });

    t.it('Should throw if not configuring avatars properly', (t) => {
        t.throwsOk(() => {
            gantt = t.getGantt({
                columns : [
                    { type : ResourceAssignmentColumn.type, id : 'resourceassignment', width : 250, showAvatars : true }
                ]
            });
        }, 'Must provide a resourceImageFolderPath where resource images are located');
    });

    t.it('Should render special image if images are not set on the resource', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : 'foo',
            assignments             : [
                { id : 1, event : 11, resource : 1 },
                { id : 2, event : 12, resource : 1 }
            ],
            resources : [
                { id : 1, name : 'Mike' },
                { id : 2, name : 'Dave' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true
                }
            ]
        });

        t.chain(
            {
                waitForSelector : '.b-resource-avatar-container img[src^=data]',
                desc            : 'resources without images should use default image'
            },
            {
                waitForSelectorNotFound : '.b-resource-avatar-container img:not([src^=data])',
                desc                    : 'resources without images should use default image'
            }
        );
    });

    t.it('Should render special image if resource images are not found', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : 'foo',
            assignments             : [
                { id : 1, event : 11, resource : 1 },
                { id : 2, event : 12, resource : 1 }
            ],
            resources : [
                { id : 1, name : 'Mike', image : 'nope' },
                { id : 2, name : 'Dave', image : 'nope2' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true
                }
            ]
        });

        t.chain(
            {
                waitForSelectorNotFound : '.b-resource-avatar-container img:not([src^=data])',
                desc                    : 'resources where image is not found should use default image'
            }
        );
    });

    t.it('Should render resource image if defined', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : '../examples/_shared/images/users/',
            assignments             : [
                { id : 1, event : 11, resource : 1 },
                { id : 2, event : 11, resource : 2, units : 50 },
                { id : 3, event : 11, resource : 3 }
            ],
            resources : [
                { id : 1, name : 'Mike', image : 'mike.jpg' },
                { id : 2, name : 'Dave', image : 'dave.jpg' },
                { id : 3, name : 'Secret Guy' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true,
                    width       : 100
                }
            ]
        });

        t.chain(
            { waitForSelector : '.b-resource-avatar-container img[src*=mike]' },
            { waitForSelector : '.b-resource-avatar-container img[src*=dave]' },

            () => {
                const
                    imgMike = document.querySelector('img[src*=mike]'),
                    imgDave = document.querySelector('img[src*=dave]');

                t.is(imgMike.getAttribute('data-btip'), 'Mike 100%');
                t.is(imgDave.getAttribute('data-btip'), 'Dave 50% (+1 more resources)');
            }
        );
    });

    t.it('Should show assigned resources in assignment field chip view when editing is started', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : '../examples/_shared/images/users/',
            assignments             : [
                { id : 1, event : 11, resource : 1, units : 50 },
                { id : 2, event : 12, resource : 2, units : 50 }
            ],
            resources : [
                { id : 1, name : 'Mike', image : 'mike.jpg' },
                { id : 2, name : 'Dave', image : 'dave.jpg' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true,
                    width       : 100
                }
            ]
        });

        t.chain(
            { dblclick : '.b-resource-avatar-container img[src*=mike]' },

            { waitForSelector : '.b-assignment-chipview .b-chip:contains(Mike 50%)' },

            { click : '.b-resource-avatar-container img[src*=dave]' },

            { waitForSelector : '.b-assignment-chipview .b-chip:contains(Dave 50%)' }
        );
    });

    t.it('Should not affect assigned resources if pressing cancel', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : '../examples/_shared/images/users/',
            assignments             : [
                { id : 1, event : 11, resource : 1, units : 50 },
                { id : 2, event : 12, resource : 2, units : 50 }
            ],
            resources : [
                { id : 1, name : 'Mike', image : 'mike.jpg' },
                { id : 2, name : 'Dave', image : 'dave.jpg' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true,
                    width       : 100
                }
            ]
        });

        t.chain(
            { dblclick : '.b-resource-avatar-container img[src*=mike]' },
            { type : '[DOWN]' },

            { click : '.b-assignmentpicker .b-button:contains(Cancel)' },

            { waitForSelector : '.b-assignment-chipview .b-chip:contains(Mike 50%)' },

            { click : '.b-tree-cell' },

            { dblclick : '.b-resource-avatar-container img[src*=mike]' },

            { waitForSelector : '.b-assignment-chipview .b-chip:contains(Mike 50%)' }
        );
    });

    t.it('Should not show field tooltip if no resources are assigned', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : '../examples/_shared/images/users/',
            assignments             : [
            ],
            resources : [
                { id : 1, name : 'Mike', image : 'mike.jpg' },
                { id : 2, name : 'Dave', image : 'dave.jpg' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true,
                    width       : 100
                }
            ]
        });

        t.chain(
            { dblClick : `.b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]` },
            { type : '[DOWN]' },

            { click : '.b-grid-cell.b-check-cell' },

            { click : '.b-assignmentpicker .b-button:contains(Cancel)' },
            { click : `.b-grid-row[data-index=3] .b-grid-cell[data-column=name]` },
            { click : `.b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]` },

            async() => t.selectorNotExists('[data-btip=true]')
        );
    });

    // https://github.com/bryntum/support/issues/391
    t.it('Should not crash when clicking outside assignment editor with cell editing active', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath : '../examples/_shared/images/users/',
            assignments             : [],
            resources               : [
                { id : 1, name : 'Mike', image : 'mike.jpg' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true,
                    width       : 100
                }
            ]
        });

        t.chain(
            { dblClick : `.b-grid-row[data-index=3] .b-grid-cell[data-column=assignments]` },
            { type : '[DOWN]' },

            { dblClick : '.b-grid-cell[data-column="units"]' },

            { type : '10' },
            { click : '.b-tree-cell' }
        );
    });

    // https://github.com/bryntum/support/issues/418
    t.it('Should rerender cells after a change in resourceStore', (t) => {
        gantt = t.getGantt({
            assignments : [
                { id : 1, event : 11, resource : 1, units : 50 }
            ],
            resources : [
                { id : 1, name : 'Mike' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : false
                }
            ]
        });

        t.chain(
            { waitForSelector : '.b-resourceassignment-cell:contains(Mike)' },

            async() => gantt.resourceStore.first.set('name', 'Dave'),

            { waitForSelector : '.b-resourceassignment-cell:contains(Dave)' }
        );
    });

    t.it('Should render defaultResourceImageName if provided', (t) => {
        gantt = t.getGantt({
            resourceImageFolderPath  : './',
            defaultResourceImageName : 'favicon-gantt.png',
            assignments              : [
                { id : 1, event : 11, resource : 1, units : 50 }
            ],
            resources : [
                { id : 1, name : 'Mike' }
            ],
            columns : [
                {
                    type        : ResourceAssignmentColumn.type,
                    showAvatars : true
                }
            ]
        });

        t.chain(
            { waitForSelector : '.b-resource-avatar-container img[src*="favicon-gantt.png"]' }
        );
    });
});
