function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt, exporter;
  t.beforeEach(function () {
    gantt && gantt.destroy();
    exporter && exporter.destroy();
  });
  t.it('Exported columns should be properly converted to strings', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var exporter, _exporter$export, rows, row;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                tasks: [{
                  id: 1,
                  name: 'Task 1',
                  startDate: '2017-01-16',
                  duration: 1
                }, {
                  id: 2,
                  name: 'Task 2',
                  startDate: '2017-01-16',
                  duration: 1
                }, {
                  id: 3,
                  name: 'Task 3',
                  startDate: '2017-01-16',
                  duration: 1,
                  calendar: 'general',
                  constraintDate: '2017-01-18',
                  constraintType: 'startnolaterthan',
                  effort: 1,
                  percentDone: 34,
                  showInTimeline: true
                }, {
                  id: 4,
                  name: 'Task 4',
                  startDate: '2017-01-16',
                  duration: 1
                }, {
                  id: 5,
                  name: 'Task 5',
                  startDate: '2017-01-16',
                  duration: 1
                }, {
                  id: 6,
                  name: 'empty'
                }],
                dependencies: [{
                  fromTask: 1,
                  toTask: 3
                }, {
                  fromTask: 2,
                  toTask: 3
                }, {
                  fromTask: 3,
                  toTask: 4
                }, {
                  fromTask: 3,
                  toTask: 5
                }],
                assignments: [{
                  event: 3,
                  resource: 1
                }, {
                  event: 3,
                  resource: 2,
                  units: 50
                }, {
                  event: 3,
                  resource: 3,
                  units: 10
                }],
                resources: [{
                  id: 1,
                  name: 'Andy'
                }, {
                  id: 2,
                  name: 'Dwight'
                }, {
                  id: 3,
                  name: 'Jim'
                }],
                columns: [{
                  type: 'calendar'
                }, {
                  type: 'constraintdate'
                }, {
                  type: 'constrainttype'
                }, {
                  type: 'duration'
                }, {
                  type: 'earlyenddate'
                }, {
                  type: 'earlystartdate'
                }, {
                  type: 'effort'
                }, {
                  type: 'enddate'
                }, {
                  type: 'eventmode'
                }, {
                  type: 'lateenddate'
                }, {
                  type: 'latestartdate'
                }, {
                  type: 'manuallyscheduled'
                }, {
                  type: 'milestone'
                }, {
                  type: 'name'
                }, {
                  type: 'note'
                }, {
                  type: 'percentdone'
                }, {
                  type: 'predecessor'
                }, {
                  type: 'resourceassignment'
                }, {
                  type: 'schedulingmodecolumn'
                }, {
                  type: 'sequence'
                }, {
                  type: 'showintimeline'
                }, {
                  type: 'startdate'
                }, {
                  type: 'successor'
                }, {
                  type: 'totalslack'
                }, {
                  type: 'wbs'
                }],
                subGridConfigs: {
                  normal: {
                    width: 100
                  }
                }
              });
              _context.next = 3;
              return gantt.project.waitForPropagateCompleted();

            case 3:
              exporter = new TableExporter({
                target: gantt
              });
              _exporter$export = exporter.export(), rows = _exporter$export.rows; // rows would have class instances as values, need to stringify them all

              row = rows[2].map(function (cell) {
                return cell instanceof Date ? DateHelper.format(cell, 'YYYY-MM-DD') : cell.toString();
              });
              t.isDeeply(row, ['General', '2017-01-18', 'Start no later than', '1 day', '2017-01-18', '2017-01-17', '1 hour', '2017-01-18', 'Auto', '2017-01-18', '2017-01-17', 'false', 'false', 'Task 3', '', '34%', '1;2', 'Andy 100%,Dwight 50%,Jim 10%', 'Normal', '3', 'true', '2017-01-17', '4;5', '0 days', '3'], 'Task 3 exported fine');
              row = rows[5].map(function (cell) {
                return cell instanceof Date ? DateHelper.format(cell, 'YYYY-MM-DD') : cell.toString();
              });
              t.isDeeply(row, ['', // calendar
              '', // constraintdate
              '', // constrainttype
              '', // duration
              '', // earlyenddate
              '2017-01-16', // earlystartdate
              '', // effort
              '', // enddate
              'Auto', // eventmode
              '2017-01-19', // lateenddate
              '', // latestartdate
              'false', // manuallyscheduled
              'false', // milestone
              'empty', // name
              '', // note
              '0%', // percentdone
              '', // predecessor
              '', // resourceassignment
              'Normal', // schedulingmodecolumn
              '6', // sequence
              '', // showintimeline
              '2017-01-16', // startdate
              '', // successor
              '', // totalslack
              '6' // wbs
              ], 'Empty task 6 is exported fine');

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});