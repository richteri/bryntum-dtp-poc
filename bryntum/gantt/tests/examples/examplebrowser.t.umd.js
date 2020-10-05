StartTest(function (t) {
  var document;
  t.setWindowSize(1024, 768);
  t.beforeEach(function (t, next) {
    document = t.global.document;
    t.waitForSelector('.example', next);
  });
  t.it('Should initially scroll section into view if provided in hash', function (t) {
    t.chain({
      waitForSelector: '.b-gantt-task'
    }, {
      waitForElementTop: '#example-localization'
    }, // Force a reload to prove initial scrolling works reliably
    {
      waitForPageLoad: null,
      trigger: function trigger() {
        return t.global.location.reload();
      }
    }, {
      waitForElementTop: '#example-localization'
    }, function () {
      return t.pass('scrolled document to correct place');
    });
  });
  t.it('Rendering', function (t) {
    t.chain(function (next) {
      var example = document.querySelector('a#example-basic');
      example.scrollIntoView();
      t.isGreater(document.querySelectorAll('.example').length, 5, 'A bunch of examples displayed');
      t.isGreater(document.querySelectorAll('h2').length, 3, 'A bunch of headers displayed');
      var link = example.href,
          valid = link.match('basic$') || link.match('basic/bundle.htm$');
      t.ok(valid, 'First link looks correct');
      var browserEl = document.getElementById('browser');
      t.ok(browserEl.scrollHeight > browserEl.clientHeight, 'Browser element is scrollable');
      next();
    }, {
      moveCursorTo: '#example-basic .tooltip'
    }, {
      waitForSelector: '.b-tooltip:contains(Basic demo)',
      desc: 'Example tip shown'
    });
  });
  t.it('Changing theme', function (t) {
    t.chain( // Theme defaults to material, by using ?theme=material on url
    {
      waitFor: function waitFor() {
        return document.querySelector('#example-basic img').src.toLowerCase().match('thumb.material.png$');
      }
    }, // First item should not be a default theme since popup won't be hidden
    ['Dark', 'Default', 'Light', 'Material', 'Stockholm'].map(function (theme) {
      return [function (next) {
        document.documentElement.scrollTop = document.body.scrollTop = 0; // For IE 11

        next();
      }, {
        click: '[data-ref=infoButton]'
      }, {
        click: '[data-ref=themeCombo]'
      }, {
        click: ".b-list-item:contains(".concat(theme, ")"),
        desc: "Switching to ".concat(theme, " theme")
      }, {
        click: 'header'
      }, {
        waitForSelector: "img[src*=".concat(theme.toLowerCase(), "]")
      }, function (next) {
        var thumb = document.querySelector('#example-basic img');
        t.like(thumb.src.toLowerCase(), // eslint-disable-next-line no-useless-escape
        "basic/meta/thumb.".concat(theme.toLowerCase(), ".png"), 'Correct thumb src for basic demo');
        next();
      }];
    }));
  });
  t.it('Check thumbnail sizes', function (t) {
    var steps = [];
    document.querySelectorAll('.example').forEach(function (example) {
      steps.push({
        waitFor: function waitFor() {
          var img = document.querySelector("#".concat(example.id, " img")),
              rect = img.getBoundingClientRect();
          return t.samePx(rect.width, t.bowser.msie ? 256 : 275, 10) && t.samePx(rect.height, t.bowser.msie ? 192 : 206, 10);
        },
        desc: "Correct image size for: \"".concat(example.id, "\"")
      });
    });
    t.chain(steps);
  });
  t.it('Check tooltips for examples not available offline', function (t) {
    t.chain({
      scrollIntoView: 'a#example-angular-advanced'
    }, {
      waitForSelector: ' #example-angular-advanced i.b-fa-cog',
      desc: 'Correct info icon used'
    }, {
      moveCursorTo: '#example-angular-advanced .tooltip'
    }, {
      waitForSelector: '.b-tooltip-content:contains(This demo needs to be built before it can be viewed)',
      desc: 'Tooltip shown'
    }, {
      moveCursorTo: 'label.title',
      desc: 'Hiding tooltip to avoid aborting requests'
    }, {
      waitForSelectorNotFound: '.b-tooltip',
      desc: 'Tooltip hidden'
    });
  });
});