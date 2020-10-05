StartTest(function (t) {
  t.it('Foreign id accessors should work', function (t) {
    var project = t.getProject();
    var dependency = project.dependencyStore.first;
    t.is(dependency.from, 11, 'Correct from');
    t.is(dependency.to, 14, 'Correct to');
  });
});