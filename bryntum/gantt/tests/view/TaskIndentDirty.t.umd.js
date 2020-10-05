StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Sanity', function (t) {
    gantt = t.getGantt({
      height: 700,
      appendTo: document.body,
      project: {
        startDate: '2017-06-19',
        eventsData: [{
          id: 3,
          name: 'Task 3',
          startDate: '2017-06-19',
          endDate: '2017-06-24'
        }, {
          id: 4,
          name: 'Task 4',
          startDate: '2017-06-19',
          endDate: '2017-06-24'
        }, {
          id: 5,
          name: 'Task 5',
          startDate: '2017-06-19',
          endDate: '2017-06-24'
        }]
      },
      startDate: '2017-06-19'
    });
    var taskStore = gantt.taskStore,
        node3 = taskStore.getById(3),
        node4 = taskStore.getById(4),
        node5 = taskStore.getById(5);
    t.chain(function (next) {
      gantt.indent([node4, node5]).then(next);
    }, function () {
      t.ok(node4.modifications.parentId, 'Node4 parentId dirty after indent');
      t.ok(node5.modifications.parentId, 'Node5 parentId dirty after indent');
      t.notOk(node3.isLeaf, 'Node3 is not leaf');
      t.ok(node4.isLeaf, 'Node4 is still leaf');
      t.ok(node5.isLeaf, 'Node5 is still leaf');
    });
  });
});