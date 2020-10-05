StartTest(function (t) {
  //All locales are preloaded via alsoPreload in tests/index.js
  function applyLocale(t, name) {
    t.diag("Applying locale ".concat(name));
    return LocaleManager.locale = window.bryntum.locales[name];
  }

  var gantt;
  t.beforeEach(function (t, next) {
    gantt && gantt.destroy(); // Wait for locales to load

    t.waitFor(function () {
      return window.bryntum.locales;
    }, next);
  });
  t.it('Should update project labels after localization change', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      tasks: [{
        id: 1,
        name: 'task 1',
        startDate: '2017-01-16',
        duration: 10
      }],
      features: {
        projectLines: true
      }
    });
    Object.keys(window.bryntum.locales).forEach(function (name) {
      t.describe("".concat(name, " locale is ok"), function (t) {
        var locale = applyLocale(t, name),
            lines = document.querySelectorAll('.b-sch-timerange label');
        t.contentLike(lines[0], locale.ProjectLines['Project Start'], 'Project Start localization is ok');
        t.contentLike(lines[1], locale.ProjectLines['Project End'], 'Project End localization is ok');
      });
    });
  });
});