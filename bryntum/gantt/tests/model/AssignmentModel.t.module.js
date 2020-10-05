
StartTest(t => {
    t.it('Foreign id accessors should work', t => {
        const project = t.getProject({
            assignmentsData : [
                { id : 1, event : 11, resource : 1 }
            ],

            resourcesData : [
                { id : 1 }
            ]
        });

        const
            { assignmentStore } = project,
            assignment          = assignmentStore.first;

        t.is(assignment.eventId, 11, 'Correct eventId');
        t.is(assignment.resourceId, 1, 'Correct resourceId');

        // Check that the check for duplicate assignments throws.
        const a = assignment.copy('duplicate-assignment');
        t.throwsOk(() => {
            // Add a copy of the first assignment as a "new" assignment. It should throw.
            assignmentStore.add(a);
        }, `Duplicate assignment Event: ${a.eventId} to resource: ${a.resourceId}`);
    });
});
