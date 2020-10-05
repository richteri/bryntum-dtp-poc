StartTest('Test buttons tooltips', function (t) {
  t.it('Wait for docs live demo to load', function (t) {
    t.chain({
      setWindowSize: [1280, 1024]
    }, {
      waitFor: function waitFor() {
        return bryntum.query('panel') && bryntum.query('panel').tbar;
      }
    });
  });
  t.it('Check toolbar buttons tooltips', function (t) {
    t.chain(Object.values(bryntum.query('panel').tbar.widgetMap).map(function (button) {
      if (button.$name === 'Button' && button.tooltip) {
        return [{
          moveMouseTo: button.element
        }, {
          waitForSelector: ".b-tooltip:contains(".concat(button.tooltip.html, ")"),
          desc: 'Correct tooltip shown'
        }];
      }
    }));
  });
});