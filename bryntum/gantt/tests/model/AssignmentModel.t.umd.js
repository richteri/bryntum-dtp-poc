StartTest(function (t) {
  t.it('Foreign id accessors should work', function (t) {
    var project = t.getProject({
      assignmentsData: [{
        id: 1,
        event: 11,
        resource: 1
      }],
      resourcesData: [{
        id: 1
      }]
    });
    var assignmentStore = project.assignmentStore,
        assignment = assignmentStore.first;
    t.is(assignment.eventId, 11, 'Correct eventId');
    t.is(assignment.resourceId, 1, 'Correct resourceId'); // Check that the check for duplicate assignments throws.

    var a = assignment.copy('duplicate-assignment');
    t.throwsOk(function () {
      // Add a copy of the first assignment as a "new" assignment. It should throw.
      assignmentStore.add(a);
    }, "Duplicate assignment Event: ".concat(a.eventId, " to resource: ").concat(a.resourceId));
  });
});