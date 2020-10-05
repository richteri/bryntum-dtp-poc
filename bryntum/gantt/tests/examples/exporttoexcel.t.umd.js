StartTest(function (t) {
  // Sanity test just to check if feature is included
  t.chain({
    waitForSelector: '.b-gantt-task'
  });
});