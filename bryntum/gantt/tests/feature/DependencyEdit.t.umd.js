StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
    gantt = null;
  });

  function handleSVGElement(t, action, selector) {
    return function (next) {
      t.waitForSelector(selector, function (el) {
        var element = el[0],
            ownerSVG = element.ownerSVGElement,
            ownerBox = ownerSVG.getBoundingClientRect(),
            elementBBox = element.getBBox();
        t[action]([ownerBox.left + elementBBox.x, ownerBox.top + elementBBox.y], next);
      });
    };
  }

  function dblclickSVGElement(t, selector) {
    return handleSVGElement(t, 'doubleClick', selector);
  }

  function setup() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    gantt && gantt.destroy();
    gantt = t.getGantt(Object.assign({
      appendTo: document.body,
      startDate: new Date(2018, 9, 14),
      endDate: new Date(2018, 9, 30),
      viewPreset: 'weekAndMonth',
      project: {
        startDate: new Date(2018, 9, 20),
        tasksData: [{
          id: 1,
          startDate: new Date(2018, 9, 20),
          duration: 2,
          name: 'task 1'
        }, {
          id: 2,
          startDate: new Date(2018, 9, 20),
          duration: 2,
          name: 'task 2'
        }],
        dependenciesData: [{
          id: 1,
          fromTask: 1,
          toTask: 2,
          type: 0
        }]
      },
      features: {
        dependencies: {
          showTooltip: false
        },
        taskTooltip: false,
        dependencyEdit: true
      }
    }, config));
  }

  t.it('Should show editor on dblclick on dependency', function (t) {
    setup();
    t.chain(dblclickSVGElement(t, '.b-sch-dependency'), {
      waitForSelector: '.b-popup .b-header-title:contains(Edit dependency)',
      desc: 'Popup shown with correct title'
    }, function () {
      var depFeature = gantt.features.dependencyEdit;
      t.hasValue(depFeature.fromNameField, 'task 1');
      t.hasValue(depFeature.toNameField, 'task 2');
      t.hasValue(depFeature.typeField, 0);
      t.is(depFeature.typeField.inputValue, 'Start to Start');
      t.selectorExists('label:contains(Lag)', 'Lag field should not exist by default');
    });
  });
  t.it('Should delete dependency on Delete click', function (t) {
    setup();
    t.firesOnce(gantt.dependencyStore, 'remove');
    t.chain(dblclickSVGElement(t, '.b-sch-dependency'), {
      click: '.b-popup button:textEquals(Delete)'
    }, {
      waitForSelectorNotFound: '.b-sch-dependency'
    });
  });
  t.it('Should change nothing on Cancel and close popup', function (t) {
    setup();
    t.wontFire(gantt.dependencyStore, 'change');
    t.chain(dblclickSVGElement(t, '.b-sch-dependency'), {
      click: '.b-popup button:textEquals(Cancel)'
    });
  });
  t.it('Should repaint and update model when changing type', function (t) {
    setup();
    t.firesOnce(gantt.dependencyStore, 'update');
    t.chain(dblclickSVGElement(t, '.b-sch-dependency'), function (next) {
      var depFeature = gantt.features.dependencyEdit;
      depFeature.typeField.value = 1;
      next();
    }, {
      click: '.b-popup button:textEquals(Save)'
    }, function () {
      t.is(gantt.dependencyStore.first.type, 1, 'Type updated');
    });
  });
  t.it('Should repaint and update model when changing lag', function (t) {
    setup();
    t.firesOnce(gantt.dependencyStore, 'update');
    t.chain(dblclickSVGElement(t, '.b-sch-dependency'), function (next) {
      var depFeature = gantt.features.dependencyEdit;
      depFeature.lagField.value = 2;
      next();
    }, {
      click: '.b-popup button:textEquals(Save)'
    }, {
      waitForPropagate: gantt.project
    }, function () {
      t.is(gantt.taskStore.last.startDate, new Date(2018, 9, 22), 'Lag change caused start date to be updated');
      t.is(gantt.dependencyStore.first.lag, 2, 'Lag updated');
    });
  });
});