StartTest(function (t) {
  t.chain({
    click: '[data-ref=infoButton]'
  }, {
    waitForSelector: '[data-ref=localeCombo]'
  }, {
    click: '[data-ref=localeCombo]'
  }, {
    waitForSelector: '.b-list-item:contains(Svenska)'
  }, {
    click: '.b-list-item:contains(Svenska)'
  }, {
    moveMouseTo: '.b-task-baseline[data-index=2]'
  }, {
    waitForSelector: ':contains(Försenad start med 1 timme)'
  });
});