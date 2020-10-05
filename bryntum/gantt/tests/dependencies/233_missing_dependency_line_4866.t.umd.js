// TODO: PORT THIS TEST
StartTest(function (t) {// var gantt, taskStore, dependencyStore;
  //
  // t.beforeEach(function(t) {
  //
  //     gantt && Ext.destroy(gantt);
  //
  //     gantt = t.getGantt({
  //         renderTo : Ext.getBody(),
  //
  //         columns : [
  //             {
  //                 xtype : 'namecolumn'
  //             }
  //         ],
  //
  //         viewPreset    : 'weekAndDayLetter',
  //         startDate     : new Date(2017, 9, 10),
  //         endDate       : new Date(2017, 10, 10),
  //         showTodayLine : true,
  //
  //         taskStore : (taskStore = new Gantt.data.TaskStore({
  //             proxy : 'memory',
  //             root  : {
  //                 expanded : true,
  //                 children : []
  //             }
  //         })),
  //
  //         dependencyStore : (dependencyStore = new Gantt.data.DependencyStore({
  //             proxy : 'memory'
  //         }))
  //     });
  //
  // });
  //
  // t.it('Should render render dependencies which are out of current time span upon data loading', function(t) {
  //
  //     t.chain(
  //         function(next) {
  //             dependencyStore.loadData([{
  //                 From : 1,
  //                 To   : 2,
  //                 Type : 2
  //             }, {
  //                 From : 2,
  //                 To   : 3,
  //                 Type : 2
  //             }, {
  //                 From : 1,
  //                 To   : 3,
  //                 Type : 2
  //             }]);
  //
  //             taskStore.proxy.data = [{
  //                 id        : 1,
  //                 Name      : 'August task',
  //                 StartDate : new Date(2017, 8, 1),
  //                 EndDate   : new Date(2017, 8, 8),
  //                 leaf      : true
  //             }, {
  //                 id        : 2,
  //                 Name      : 'September task',
  //                 StartDate : new Date(2017, 8, 10),
  //                 EndDate   : new Date(2017, 8, 18),
  //                 leaf      : true
  //             }, {
  //                 id        : 3,
  //                 Name      : 'October task',
  //                 StartDate : new Date(2017, 8, 20),
  //                 EndDate   : new Date(2017, 8, 28),
  //                 leaf      : true
  //             }];
  //
  //             taskStore.load();
  //
  //             next();
  //         },
  //         { waitFor : 500 },
  //         function(next) {
  //             gantt.shiftPrevious();
  //             gantt.shiftPrevious();
  //             gantt.shiftPrevious();
  //             gantt.shiftPrevious();
  //             next();
  //         },
  //         { waitFor : 100 }, // For dependencies to draw
  //         function(next) {
  //             t.selectorExists('.sch-dependency', 'Dependency lines are visible');
  //         }
  //     );
  // });
});