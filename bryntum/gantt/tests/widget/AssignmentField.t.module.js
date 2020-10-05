import { AssignmentField, MinimalGanttProject } from '../../build/gantt.module.js';

StartTest((t) => {
    let field;

    t.beforeEach((t) => {
        field && field.destroy();
    });

    const getProject = () => {
        return new MinimalGanttProject(t.getProjectData());
    };

    t.it('Should show/hide picker on trigger click', (t) => {
        const
            project    = getProject(),
            eventStore = project.getEventStore();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event,
            store        : {
                floatAssignedResources : false
            }
        });

        t.chain(
            { click : () => field.triggers.expand.element },

            (next) => {
                t.elementIsVisible('.b-assignmentpicker', 'Picker is shown');
                next();
            },

            { click : () => field.triggers.expand.element },

            () => {
                t.selectorNotExists('.b-assignmentpicker', 'Picker is hidden');
            }
        );
    });

    t.it('Should save changes upon save button click', async (t) => {
        const
            project       = getProject(),
            eventStore    = project.getEventStore(),
            resourceStore = project.getResourceStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event,
            store        : {
                floatAssignedResources : false
            }
        });

        // Task(115) initially has 2 resources assigned
        // - Arcady(1) 100%
        // - Nick(8) 10%
        // let's unassign Nick and assign Maxim(7) with 50%

        const
            Arcady = resourceStore.getById(1),
            Nick   = resourceStore.getById(8),
            Maxim  = resourceStore.getById(7);

        t.chain(
            { click : () => field.triggers.expand.element },
            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox' },
            { dblclick : '.b-assignmentgrid .b-grid-row[data-index=6] .b-grid-cell[data-column=units]' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { type : '[Enter]' },
            { click : '.b-button:contains(Save)' },
            async () => {
                await project.waitForPropagateCompleted();

                const
                    arcadyAssignments = Array.from(Arcady.assignments),
                    nickAssignments   = Array.from(Nick.assignments),
                    maximAssignments  = Array.from(Maxim.assignments);

                t.is(arcadyAssignments.length, 1, 'Arcady assignment present');
                t.ok(arcadyAssignments[0].event === event && arcadyAssignments[0].units === 100, 'Arcady assignment is untouched');

                t.is(nickAssignments.length, 0, 'Nick assignment is removed');

                t.isDeeply(
                    maximAssignments.map(a => ({ event : a.event, units : a.units })).sort((a, b) => a.units - b.units),
                    [{
                        event : event,
                        units : 50
                    }, {
                        event : eventStore.getById(121),
                        units : 100
                    }],
                    'Maxim\'s assignments are ok'
                );
            }
        );
    });

    t.it('Should cancel changes upon cancel button click', async (t) => {
        const
            project         = getProject(),
            eventStore      = project.getEventStore(),
            assignmentStore = project.getAssignmentStore();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event,
            store        : {
                floatAssignedResources : false
            }
        });

        // Task(115) initially has 2 resources assigned
        // - Arcady(1) 100%
        // - Nick(8) 10%
        // Let's modify some assignments and then cancel, assignment store data should left untouched

        const initialAssignments = assignmentStore.map(a => a.data);

        t.chain(
            { click : () => field.triggers.expand.element },
            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox' },
            { dblclick : '.b-assignmentgrid .b-grid-row[data-index=6] .b-grid-cell[data-column=units]' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { click : '.b-spin-down' },
            { type : '[Enter]' },
            { click : '.b-button:contains(Cancel)' },
            () => {
                const assignments = assignmentStore.map(a => a.data);

                t.isDeeply(initialAssignments, assignments, 'Assignments are left untouched');
            }
        );
    });

    t.it('Should trigger minimal events on AssignmentStore', async t => {
        const
            project         = getProject(),
            eventStore      = project.getEventStore(),
            assignmentStore = project.getAssignmentStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event,
            store        : {
                floatAssignedResources : false
            }
        });

        t.firesOk(assignmentStore, {
            add    : 1,
            remove : 1,
            update : 0
        });

        // Task(115) initially has 2 resources assigned
        // Lets unassign both and assign 3 others

        t.chain(
            { click : () => field.triggers.expand.element },
            { waitForElementVisible : '.b-assignmentpicker' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=5] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=4] .b-checkbox' },
            { click : '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox' },
            { type : '[Enter]' },
            { click : '.b-button:contains(Save)' },
            { waitForPropagate : project },
            () => {
                t.notOk(field.store.changes, 'No changes remain on AssignmentsManipulationStore');
            }
        );
    });

    // https://github.com/bryntum/support/issues/449
    t.it('Should not select records which are not part of the filter result', async t => {
        const
            project         = getProject(),
            eventStore      = project.getEventStore(),
            assignmentStore = project.getAssignmentStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event
        });

        field.showPicker();
        t.wontFire(assignmentStore, 'change');

        t.is(field.chipStore.count, 2, '2 selected');

        await t.type('.b-filter-bar-field-input', 'foo');

        await t.waitForSelector('.b-grid-empty');

        await t.click('.b-check-header .b-field');

        await t.click('.b-button:textEquals(Save)');

        t.is(field.chipStore.count, 2, 'Still just original 2 selected');
    });

    t.it('Should not deselect selected records which are not part of the filter result when unchecking select all header box', async t => {
        const
            project         = getProject(),
            eventStore      = project.getEventStore(),
            assignmentStore = project.getAssignmentStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event
        });

        field.showPicker();
        t.wontFire(assignmentStore, 'change');

        t.is(field.chipStore.count, 2, '2 selected');

        await t.type('.b-filter-bar-field-input', 'foo');

        await t.waitForSelector('.b-grid-empty');

        await t.click('.b-check-header .b-field');
        await t.click('.b-check-header .b-field');

        t.is(field.chipStore.count, 2, 'Still just original 2 selected');
    });

    t.it('Should merge previously selected records which matches that are part of filtered result', async t => {
        const
            project    = getProject(),
            eventStore = project.getEventStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event
        });

        field.showPicker();

        t.is(field.chipStore.count, 2, '2 selected');

        await t.type('.b-filter-bar-field-input', 'Johan');

        await t.click('.b-check-header .b-field');

        await t.click('.b-button:textEquals(Save)');

        t.is(field.chipStore.count, 3, '3 selected');
    });

    t.it('Should not crash when clicking close icon on chip that is not part of filtered result set', async t => {
        const
            project    = getProject(),
            eventStore = project.getEventStore();

        await project.propagate();

        const event = eventStore.getById(115);

        field = new AssignmentField({
            appendTo     : document.body,
            width        : 300,
            projectEvent : event
        });

        field.showPicker();

        t.is(field.chipStore.count, 2, '2 selected');

        await t.type('.b-filter-bar-field-input', 'asf');

        await t.click('.b-chip .b-close-icon');

        t.is(field.chipStore.count, 1, '1 selected');
    });
});
