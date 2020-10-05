function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  t.it('Sequence number should work', function (t) {
    var task = new TaskModel({
      // 0
      children: [{}, // 1
      {
        // 2
        children: [{}, // 3
        {} // 4
        ]
      }, {} // 5
      ]
    });

    function getSequence() {
      var sequence = [];
      task.traverse(function (t) {
        return sequence.push(t.sequenceNumber);
      });
      return sequence;
    }

    t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5], 'Correct sequence numbers initially');
    task.firstChild.appendChild({});
    t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5, 6], 'Correct after appendChild');
    task.firstChild.insertChild(0, {});
    t.isDeeply(getSequence(), [0, 1, 2, 3, 4, 5, 6, 7], 'Correct after insertChild');
    task.firstChild.remove();
    t.isDeeply(getSequence(), [0, 1, 2, 3, 4], 'Correct after removing child');
  });
  t.it('Should handle non working time calendar config', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var project, taskStore, task, checkTask;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              checkTask = function _checkTask(duration, startDate, endDate) {
                t.is(task.duration, duration, 'Correct task duration');
                t.is(task.startDate, startDate, 'Correct task startDate');
                t.is(task.endDate, endDate, 'Correct task endDate');
              };

              project = new ProjectModel({
                calendar: 'general',
                tasksData: [{
                  id: 1,
                  startDate: new Date(2019, 6, 1),
                  endDate: new Date(2019, 6, 5)
                }],
                calendarsData: [{
                  id: 'general',
                  name: 'General',
                  intervals: [{
                    recurrentStartDate: 'on Sat at 0:00',
                    recurrentEndDate: 'on Mon at 0:00',
                    isWorking: false
                  }]
                }]
              }), taskStore = project.taskStore, task = taskStore.getById('1');
              checkTask(4, new Date(2019, 6, 1), new Date(2019, 6, 5));
              _context.next = 5;
              return task.setStartDate(new Date(2019, 6, 5));

            case 5:
              checkTask(4, new Date(2019, 6, 5), new Date(2019, 6, 11));
              _context.next = 8;
              return task.setStartDate(new Date(2019, 6, 8));

            case 8:
              checkTask(4, new Date(2019, 6, 8), new Date(2019, 6, 12));
              _context.next = 11;
              return task.setDuration(10);

            case 11:
              checkTask(10, new Date(2019, 6, 8), new Date(2019, 6, 20));

            case 12:
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
  t.it('Should set percentDone to 0 when copying', function (t) {
    var task = new TaskModel({
      // 0
      name: 'foo',
      percentDone: 88.7878
    });
    t.is(task.renderedPercentDone, 89, 'Rounded when less than 99');
    t.is(task.renderedPercentDone, 89, 'Rounded when less than 99');
    task.percentDone = 99;
    t.is(task.renderedPercentDone, 99, 'Rounded <= less than 99');
    task.percentDone = 99.9;
    t.is(task.renderedPercentDone, 99, 'Floor if > than 99');
    task.percentDone = 100;
    t.is(task.renderedPercentDone, 100, 'Floor if > than 99');
    var copy = task.copy();
    t.is(copy.percentDone, 0, 'percentDone set to 0 for copied record');
    t.notOk(copy.isModified, 'No modifications in the copied record');
    t.ok(copy.isPhantom, 'The copied record is a phantom');
  });
});