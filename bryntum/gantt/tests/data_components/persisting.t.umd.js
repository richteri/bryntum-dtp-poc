function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should commit task store', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      overrideCrudStoreLoad: false,
      tasks: [{
        id: 1,
        cls: 'id1',
        startDate: '2017-01-16',
        endDate: '2017-01-18',
        name: 'Task 1',
        leaf: true
      }, {
        id: 2,
        cls: 'id2',
        startDate: '2017-01-18',
        endDate: '2017-01-20',
        name: 'Task 2',
        leaf: true
      }]
    });
    var taskStore = gantt.taskStore;

    AjaxHelper.post = function (url, data) {
      data.data.forEach(function (record) {
        t.notOk(record.hasOwnProperty('incomingDeps'), 'Incoming deps are not persisted');
        t.notOk(record.hasOwnProperty('outgoingDeps'), 'Outgoing deps are not persisted');
      });
      return Promise.resolve({
        parsedJson: {
          success: true,
          data: []
        }
      });
    };

    t.chain({
      waitForPropagate: gantt
    }, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt.dependencyStore.add({
                fromEvent: 1,
                toEvent: 2
              });
              _context.next = 3;
              return gantt.project.propagate();

            case 3:
              t.is(taskStore.getById(1).outgoingDeps.size, 1, '1 outgoing dep is found');
              t.is(taskStore.getById(2).incomingDeps.size, 1, '1 incoming dep is found');
              taskStore.updateUrl = 'foo'; // taskStore.on('beforerequest', ({ params }) => { debugger; });

              return _context.abrupt("return", taskStore.commit());

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
});