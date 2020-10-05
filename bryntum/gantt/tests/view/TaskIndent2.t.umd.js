StartTest(function (t) {
  var gantt, project;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function getGantt() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config.project = Object.assign({
      startDate: '2017-06-19',
      eventsData: [{
        id: 11,
        name: 'Node 11',
        startDate: '2017-06-19',
        endDate: '2017-06-24',
        expanded: true,
        children: [{
          id: 1,
          name: 'Node 1',
          startDate: '2017-06-19',
          endDate: '2017-06-24'
        }, {
          id: 2,
          name: 'Node 2',
          startDate: '2017-06-19',
          endDate: '2017-06-24',
          expanded: true,
          children: [{
            id: 3,
            name: 'Node 3',
            startDate: '2017-06-19',
            endDate: '2017-06-24'
          }, {
            id: 4,
            name: 'Node 4',
            startDate: '2017-06-19',
            endDate: '2017-06-24'
          }, {
            id: 5,
            name: 'Node 5',
            startDate: '2017-06-19',
            endDate: '2017-06-24'
          }]
        }]
      }]
    }, config.project);
    gantt = t.getGantt(Object.assign({
      height: 700,
      appendTo: document.body,
      startDate: config.project.startDate,
      features: {
        taskContextMenu: true,
        taskTooltip: false
      }
    }, config));
    project = gantt.project;
    return gantt;
  }

  t.it('Sanity checks', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-21',
          expanded: true,
          children: [{
            id: 2,
            name: 'Task 2',
            leaf: true,
            startDate: '2010-01-01',
            endDate: '2010-01-07'
          }, {
            id: 3,
            name: 'Task 3',
            leaf: true,
            startDate: '2010-01-07',
            endDate: '2010-01-09'
          }, {
            id: 4,
            name: 'Task 4',
            leaf: true,
            startDate: '2010-01-15',
            endDate: '2010-01-21'
          }]
        }]
      }
    }).taskStore,
        node2 = taskStore.getById(2),
        node3 = taskStore.getById(3),
        node4 = taskStore.getById(4);
    t.diag('node 3 indent');
    t.chain({
      waitForPropagate: project
    }, function (next) {
      gantt.indent(node3).then(next);
    }, // Wait for propagation to fix things
    {
      waitFor: function waitFor() {
        return !node2.isLeaf && node2.startDate.valueOf() === new Date(2010, 0, 1).valueOf() && node2.endDate.valueOf() === new Date(2010, 0, 3).valueOf();
      }
    }, function (next) {
      t.is(node3.startDate, new Date(2010, 0, 1), 'Node3 start');
      t.is(node3.endDate, new Date(2010, 0, 3), 'Node3 end');
      t.diag('node 4 indent');
      gantt.indent(node4).then(next);
    }, // Wait for propagation to fix things
    {
      waitFor: function waitFor() {
        return node4.parent === node2 && node2.startDate.valueOf() === new Date(2010, 0, 1).valueOf() && node2.endDate.valueOf() === new Date(2010, 0, 7).valueOf();
      }
    }, function () {
      t.is(node3.startDate, new Date(2010, 0, 1), 'Node3 start');
      t.is(node3.endDate, new Date(2010, 0, 3), 'Node3 end');
      t.is(node2.startDate, new Date(2010, 0, 1), 'Node2 start');
      t.is(node2.endDate, new Date(2010, 0, 7), 'Node2 end');
    });
  });
  t.it('Indent non-indentable node using UI must be no-op', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-21',
          expanded: true,
          children: [{
            id: 2,
            name: 'Task 2',
            leaf: true,
            startDate: '2010-01-01',
            endDate: '2010-01-07'
          }, {
            id: 3,
            name: 'Task 3',
            leaf: true,
            startDate: '2010-01-07',
            endDate: '2010-01-09'
          }, {
            id: 4,
            name: 'Task 4',
            leaf: true,
            startDate: '2010-01-15',
            endDate: '2010-01-21'
          }]
        }],
        dependenciesData: [// Will be invalid after task 3 becomes a child of task 2
        {
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var t2 = taskStore.getById(2),
        generation = taskStore.generation;
    t.chain({
      waitForPropagate: project
    }, function (next) {
      t.taskContextMenu(t2, 'Indent').then(next);
    }, // We are waiting for something *NOT* to happen. There should be no propagate
    // so we can't wait for it.
    {
      waitFor: 100
    }, function () {
      t.is(taskStore.generation, generation, 'TaskStore is unmodified');
    });
  });
  t.it('Indent non-indentable node using API must be no-op', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-21',
          expanded: true,
          children: [{
            id: 2,
            name: 'Task 2',
            leaf: true,
            startDate: '2010-01-01',
            endDate: '2010-01-07'
          }, {
            id: 3,
            name: 'Task 3',
            leaf: true,
            startDate: '2010-01-07',
            endDate: '2010-01-09'
          }, {
            id: 4,
            name: 'Task 4',
            leaf: true,
            startDate: '2010-01-15',
            endDate: '2010-01-21'
          }]
        }],
        dependenciesData: [// Will be invalid after task 3 becomes a child of task 2
        {
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var t2 = taskStore.getById(2),
        generation = taskStore.generation;
    t.chain({
      waitForPropagate: project
    }, function () {
      return gantt.indent([t2]);
    }, // We are waiting for something *NOT* to happen. There should be no propagate
    // so we can't wait for it.
    {
      waitFor: 100
    }, function () {
      t.is(taskStore.generation, generation, 'TaskStore is unmodified');
    });
  });
  t.it('Indent with dependencies linking a child-parent after move using UI must be reverted', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-21',
          expanded: true,
          children: [{
            id: 2,
            name: 'Task 2',
            leaf: true,
            startDate: '2010-01-01',
            endDate: '2010-01-07'
          }, {
            id: 3,
            name: 'Task 3',
            leaf: true,
            startDate: '2010-01-07',
            endDate: '2010-01-09'
          }, {
            id: 4,
            name: 'Task 4',
            leaf: true,
            startDate: '2010-01-15',
            endDate: '2010-01-21'
          }]
        }],
        dependenciesData: [// Will be invalid after task 3 becomes a child of task 2
        {
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var t1 = taskStore.getById(1),
        t3 = taskStore.getById(3);
    t.chain({
      waitForPropagate: project
    }, function (next) {
      t.taskContextMenu(t3, 'Indent').then(next);
    }, {
      waitForPropagate: project
    }, function () {
      t.is(t3.parent, t1, 'Task 3 has not been indented');
    });
  });
  t.it('Indent with dependencies linking a child-parent after move using API must be reverted', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-21',
          expanded: true,
          children: [{
            id: 2,
            name: 'Task 2',
            leaf: true,
            startDate: '2010-01-01',
            endDate: '2010-01-07'
          }, {
            id: 3,
            name: 'Task 3',
            leaf: true,
            startDate: '2010-01-07',
            endDate: '2010-01-09'
          }, {
            id: 4,
            name: 'Task 4',
            leaf: true,
            startDate: '2010-01-15',
            endDate: '2010-01-21'
          }]
        }],
        dependenciesData: [// Will be invalid after task 3 becomes a child of task 2
        {
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var t1 = taskStore.getById(1),
        t3 = taskStore.getById(3);
    t.chain({
      waitForPropagate: project
    }, function () {
      return gantt.indent([t3]);
    }, {
      waitForPropagate: project
    }, function () {
      t.is(t3.parent, t1, 'Task 3 has not been indented');
    });
  });
  t.it('Indent with dependencies where a cycle is created using UI must be reverted.', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-07'
        }, {
          id: 2,
          name: 'Task 2',
          startDate: '2010-01-07',
          endDate: '2010-01-10'
        }, {
          id: 3,
          name: 'Task 3',
          startDate: '2010-01-15',
          endDate: '2010-01-21'
        }],
        dependenciesData: [// 1->2->3
        // Will be invalid after task 3 becomes a child of task 1
        {
          id: 1,
          fromEvent: 1,
          toEvent: 2
        }, {
          id: 2,
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var root = taskStore.rootNode,
        t3 = taskStore.getById(3);
    t.chain({
      waitForPropagate: project
    }, function (next) {
      t.taskContextMenu(t3, 'Indent').then(next);
    }, {
      waitForPropagate: project
    }, function () {
      t.is(t3.parent, root, 'Task 3 has not been indented');
    });
  });
  t.it('Indent with dependencies where a cycle is created using API must be reverted.', function (t) {
    var taskStore = getGantt({
      project: {
        startDate: '2010-01-01',
        eventsData: [{
          id: 1,
          name: 'Task 1',
          startDate: '2010-01-01',
          endDate: '2010-01-07'
        }, {
          id: 2,
          name: 'Task 2',
          startDate: '2010-01-07',
          endDate: '2010-01-10'
        }, {
          id: 3,
          name: 'Task 3',
          startDate: '2010-01-15',
          endDate: '2010-01-21'
        }],
        dependenciesData: [// 1->2->3
        // Will be invalid after task 3 becomes a child of task 1
        {
          id: 1,
          fromEvent: 1,
          toEvent: 2
        }, {
          id: 2,
          fromEvent: 2,
          toEvent: 3
        }]
      }
    }).taskStore;
    var root = taskStore.rootNode,
        t3 = taskStore.getById(3);
    t.chain({
      waitForPropagate: project
    }, function () {
      return gantt.indent([t3]);
    }, {
      waitForPropagate: project
    }, function () {
      t.is(t3.parent, root, 'Task 3 has not been indented');
    });
  });
});