StartTest(function (t) {
  window.AjaxHelper = AjaxHelper;
  var gantt;
  t.beforeEach(function () {
    if (gantt) {
      gantt.project.destroy();
      gantt.destroy();
    }
  });
  t.mockUrl('loadurl', {
    delay: 10,
    responseText: JSON.stringify({
      success: true,
      resources: {
        rows: [{
          id: 'a'
        }]
      },
      assignments: {
        rows: [{
          id: 'a1',
          resource: 'a',
          event: 1
        }]
      },
      tasks: {
        rows: [{
          id: 1,
          startDate: '2018-02-01',
          endDate: '2018-03-01'
        }]
      }
    })
  });
  t.mockUrl('syncurl', {
    delay: 10,
    responseText: JSON.stringify({
      success: true,
      resources: {
        rows: [{
          id: 'a'
        }]
      }
    })
  });
  t.it('loadMask is shown when loading is triggered on scheduler construction', function (t) {
    var async = t.beginAsync(),
        project = new ProjectModel({
      autoLoad: true,
      transport: {
        sync: {
          url: 'syncurl'
        },
        load: {
          url: 'loadurl'
        }
      }
    });
    gantt = new Gantt({
      appendTo: document.body,
      startDate: new Date(2018, 0, 30),
      endDate: new Date(2018, 2, 2),
      project: project
    });
    t.chain({
      waitForSelector: '.b-mask-content:contains(Loading)',
      desc: 'loadMask showed up'
    }, {
      waitForSelectorNotFound: '.b-mask-content:contains(Loading)',
      desc: 'loadMask disappeared'
    }, function () {
      return t.endAsync(async);
    });
  });
  t.it('loadMask is shown when loading is triggered after scheduler construction', function (t) {
    var async = t.beginAsync(),
        project = new ProjectModel({
      autoLoad: false,
      transport: {
        sync: {
          url: 'syncurl'
        },
        load: {
          url: 'loadurl'
        }
      }
    });
    gantt = new Gantt({
      appendTo: document.body,
      startDate: new Date(2018, 0, 30),
      endDate: new Date(2018, 2, 2),
      project: project
    });
    project.load();
    t.chain({
      waitForSelector: '.b-mask-content:contains(Loading)',
      desc: 'loadMask showed up'
    }, {
      waitForSelectorNotFound: '.b-mask-content:contains(Loading)',
      desc: 'loadMask disappeared'
    }, function () {
      return t.endAsync(async);
    });
  });
  t.it('syncMask is shown when loading is triggered after scheduler construction', function (t) {
    var async = t.beginAsync(),
        project = new ProjectModel({
      autoLoad: false,
      transport: {
        sync: {
          url: 'syncurl'
        },
        load: {
          url: 'loadurl'
        }
      }
    });
    gantt = new Gantt({
      appendTo: document.body,
      startDate: new Date(2018, 0, 30),
      endDate: new Date(2018, 2, 2),
      project: project
    });
    t.chain(function () {
      return project.load();
    }, function (next) {
      gantt.resourceStore.first.setName('foo');
      gantt.crudManager.sync();
      next();
    }, {
      waitForSelector: '.b-mask-content:contains(Saving)',
      desc: 'syncMask showed up'
    }, {
      waitForSelectorNotFound: '.b-mask-content:contains(Saving)',
      desc: 'syncMask disappeared'
    }, function () {
      return t.endAsync(async);
    });
  });
  t.it('Should hide "No records to display" when loading and show when loaded empty data', function (t) {
    t.mockUrl('loadurl', {
      delay: 1000,
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: []
        },
        assignments: {
          rows: []
        },
        tasks: {
          rows: []
        }
      })
    });
    var async = t.beginAsync(),
        project = new ProjectModel({
      autoLoad: false,
      transport: {
        sync: {
          url: 'syncurl'
        },
        load: {
          url: 'loadurl'
        }
      }
    });
    gantt = new Gantt({
      appendTo: document.body,
      startDate: new Date(2018, 0, 30),
      endDate: new Date(2018, 2, 2),
      project: project
    });
    t.selectorExists('.b-grid-empty', 'Gantt has the b-grid-empty class before load');
    project.load();
    t.chain({
      waitForSelector: '.b-mask-content:contains(Loading)',
      desc: 'loadMask showed up'
    }, function (next) {
      t.selectorNotExists('.b-grid-empty', 'Gantt has no b-grid-empty class when loading');
      next();
    }, {
      waitForSelectorNotFound: '.b-mask-content:contains(Loading)',
      desc: 'loadMask is hidden'
    }, {
      waitForSelector: '.b-grid-empty',
      desc: 'Gantt has b-grid-empty after loaded empty rows'
    }, function () {
      return t.endAsync(async);
    });
  });
});