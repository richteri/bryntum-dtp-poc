import { AssignmentGrid, MinimalGanttProject } from '../../build/gantt.module.js';

StartTest((t) => {

    let grid;

    t.beforeEach((t) => {
        grid && grid.destroy();
    });

    const getProject = () => {
        return new MinimalGanttProject(t.getProjectData());
    };

    t.it('Should render properly', async(t) => {
        const project = getProject(),
            eventStore = project.getEventStore(),
            resourceStore = project.getResourceStore();

        await project.propagate();

        const event = eventStore.getById(115);

        grid = new AssignmentGrid({
            projectEvent : event,
            appendTo     : document.body,
            width        : 350,
            store        : {
                floatAssignedResources : false
            }
        });

        // Task 115 has two resources assigned
        // - Arcady(1) 100%
        // - Nick(8) 10%

        const Arcady = resourceStore.getById(1),
            arcadyAssignment = grid.store.getResourceAssignment(Arcady),
            [arcadyInput] = t.query('div[data-index=0] input[type=checkbox]'),
            [arcadyNameCell] = t.query('div[data-index=0] div[data-column=resourceId]'),
            [arcadyUnitCell] = t.query('div[data-index=0] div[data-column=units]');

        t.ok(arcadyInput, 'Checkbox for Arcady is rendered');
        t.ok(arcadyInput.checked, 'Checkbox for Arcady is checked');

        t.ok(arcadyNameCell, 'Arcady name cell is rendered');
        t.is(arcadyNameCell.innerHTML, arcadyAssignment.name, 'Arcady name is rendered ok');

        t.ok(arcadyUnitCell, 'Aracady units cell is rendered');
        t.is(arcadyUnitCell.innerHTML, `${arcadyAssignment.units}%`, 'Arcady units are rendered ok');

        const Nick = resourceStore.getById(8),
            nickAssignment = grid.store.getResourceAssignment(Nick),
            [nickInput] = t.query('div[data-index=7] input[type=checkbox]'),
            [nickNameCell] = t.query('div[data-index=7] div[data-column=resourceId]'),
            [nickUnitCell] = t.query('div[data-index=7] div[data-column=units]');

        t.ok(nickInput, 'Checkbox for Nick is rendered');
        t.ok(nickInput.checked, 'Checkbox for Nick is checked');

        t.ok(nickNameCell, 'Nick name cell is rendered');
        t.is(nickNameCell.innerHTML, nickAssignment.name, 'Nick name is rendered ok');

        t.ok(nickUnitCell, 'Nick units cell is rendered');
        t.is(nickUnitCell.innerHTML, `${nickAssignment.units}%`, 'Nick units are rendered ok');

        // Now checking an unassigned resource Don

        const Don = resourceStore.getById(2),
            donAssignment = grid.store.getResourceAssignment(Don),
            [donInput] = t.query('div[data-index=1] input[type=checkbox]'),
            [donNameCell] = t.query('div[data-index=1] div[data-column=resourceId]'),
            [donUnitCell] = t.query('div[data-index=1] div[data-column=units]');

        t.ok(donInput, 'Checkbox for Don is rendered');
        t.notOk(donInput.checked, 'Checkbox for Don is not checked');

        t.ok(donNameCell, 'Don name cell is rendered');
        t.is(donNameCell.innerHTML, donAssignment.name, 'Don name is rendered ok');

        t.ok(donUnitCell, 'Don units cell is rendered');
        t.is(donUnitCell.innerHTML, '', 'Don units are rendered ok');
    });

    t.it('Should be possible to bulk assign/unassign resources', async(t) => {
        const project = getProject(),
            eventStore = project.getEventStore();

        let resourceCheckboxes;

        await project.propagate();

        const event = eventStore.getById(115);

        grid = new AssignmentGrid({
            projectEvent : event,
            appendTo     : document.body,
            width        : 350,
            store        : {
                floatAssignedResources : false
            }
        });

        // Task 115 has two resources assigned
        // - Arcady(1) 100%
        // - Nick(8) 10%

        // At the initial state assign all checkbox shouldn't be checked
        // since not all resources are assigned
        const [assignAllCb] = t.query('.b-check-header-with-checkbox .b-checkbox input');

        t.ok(assignAllCb, 'Assign all checkbox found');
        t.notOk(assignAllCb.checked, 'Assign all checkbox is not checked initially');

        // Assigning all the resources by sequentially checking all their checkboxes
        resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');

        await new Promise((resolve) => {
            t.chain(
                ...resourceCheckboxes.filter(cbEl => !cbEl.checked).map(cbEl => ({ click : cbEl })),
                () => {
                    resolve();
                }
            );
        });

        // Now assign all checkbox should be checked
        t.ok(assignAllCb.checked, 'Assign all checkbox is checked now');

        // Store should report all assigned
        t.is(grid.store.query(r => r.assigned).length, grid.store.count, 'All resources are assigned');

        // Now let's unassign all by bulk assignment/unassignment checkbox
        await new Promise((resolve) => {
            t.chain(
                { click : assignAllCb },
                resolve
            );
        });

        // All resource checkboxes should be unchecked
        resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');

        const allUncheked = resourceCheckboxes.every(cbEl => !cbEl.checked);

        t.ok(allUncheked, 'All checkboxes are unchecked');
        t.is(grid.store.query(r => r.assigned).length, 0, 'All resources are unassigned');

        // Now let's assugn all by bulk assignment/unassignment checkbox
        await new Promise((resolve) => {
            t.chain(
                { click : assignAllCb },
                resolve
            );
        });

        // All resource checkboxes should be checked
        resourceCheckboxes = t.query('.b-grid-row .b-checkbox input');

        const allChecked = resourceCheckboxes.every(cbEl => cbEl.checked);

        t.ok(allChecked, 'All checkboxes are checked');
        t.is(grid.store.query(r => r.assigned).length, grid.store.count, 'All resources are assigned');
    });

    t.it('Should be possible to edit assignment units', async(t) => {
        const project = getProject(),
            eventStore = project.getEventStore(),
            resourceStore = project.getResourceStore();

        await project.propagate();

        const event = eventStore.getById(115);

        grid = new AssignmentGrid({
            projectEvent : event,
            appendTo     : document.body,
            width        : 350,
            store        : {
                floatAssignedResources : false
            }
        });

        // Task 115 has two resources assigned
        // - Arcady(1) 100%
        // - Nick(8) 10%
        const Arcady = resourceStore.getById(1),
            arcadyAssignment = grid.store.getResourceAssignment(Arcady),
            [arcadyUnitCell] = t.query('div[data-index=0] div[data-column=units]');

        await new Promise((resolve) => {
            t.chain([
                { dblclick : arcadyUnitCell },
                { type : '[Backspace][Backspace][Backspace]75[Enter]' },
                resolve
            ]);
        });

        // Now Arcady assignment should have 75% units
        t.is(arcadyAssignment.units, 75, 'Assignment units are changed correctly');
    });
});
