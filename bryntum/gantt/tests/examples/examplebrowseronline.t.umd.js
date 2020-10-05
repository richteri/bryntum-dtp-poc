StartTest(function (t) {
  t.setWindowSize(1024, 768);
  t.beforeEach(function (t, next) {
    t.waitForSelector('.example', next);
  });
  t.it('Check tooltips for examples available online', function (t) {
    t.chain({
      scrollIntoView: 'a#example-angular-advanced'
    }, {
      waitForSelector: ' #example-angular-advanced i.b-fa-info',
      desc: 'Correct info icon used'
    }, {
      moveCursorTo: '#example-angular-advanced .tooltip'
    }, {
      waitForSelector: '.b-tooltip-content',
      desc: 'Tooltip shown'
    }, {
      waitForSelectorNotFound: '.b-tooltip-content:contains(This demo needs to be built before it can be viewed)',
      desc: 'Tooltip has not build text'
    }, {
      moveCursorTo: 'label.title',
      desc: 'Hiding tooltip to avoid aborting requests'
    }, {
      waitForSelectorNotFound: '.b-tooltip',
      desc: 'Tooltip hidden'
    });
  });
  t.it('Check tooltips for examples not available online', function (t) {
    t.chain({
      scrollIntoView: 'a#example-custom-build'
    }, {
      waitForSelector: ' #example-custom-build i.b-fa-cog',
      desc: 'Correct info icon used'
    }, {
      moveCursorTo: '#example-custom-build .tooltip'
    }, {
      waitForSelector: '.b-tooltip-content:contains(This demo is not viewable online, but included when you download the trial)',
      desc: 'Tooltip has correct text'
    }, {
      moveCursorTo: 'label.title',
      desc: 'Hiding tooltip to avoid aborting requests'
    }, {
      waitForSelectorNotFound: '.b-tooltip',
      desc: 'Tooltip hidden'
    });
  });
});