
StartTest(t => {
    t.it('Foreign id accessors should work', t => {
        const project = t.getProject();

        const dependency = project.dependencyStore.first;

        t.is(dependency.from, 11, 'Correct from');
        t.is(dependency.to, 14, 'Correct to');
    });
});
