StartTest(function (t) {
  var gantt = bryntum.query('gantt');
  t.chain({
    dblClick: '.b-grid-row[data-index="4"] .b-resourceassignment-cell'
  }, function (next) {
    t.click(gantt.features.cellEdit.editorContext.editor.inputField.triggers.expand.element);
    next();
  }, // Extra column must exist
  {
    waitForSelector: '.b-grid-header:contains(Calendar)'
  }, // Grouping must be present
  {
    waitForSelector: '.b-group-title:contains(Barcelona)'
  });
});