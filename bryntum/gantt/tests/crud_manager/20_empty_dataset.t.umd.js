function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global ProjectModel */
StartTest(function (t) {
  var project, resourceStore, taskStore;
  t.beforeEach(function (t) {
    project = new ProjectModel({
      autoSync: false,
      transport: {
        load: {
          method: 'GET',
          paramName: 'q',
          url: './crud_manager/data/20_empty_dataset.json'
        },
        sync: {
          method: 'POST',
          url: '.'
        }
      },
      listeners: {
        loadfail: function loadfail() {
          return t.fail('Loading failed');
        },
        syncfail: function syncfail() {
          return t.fail('Persisting failed');
        }
      }
    });
    taskStore = project.eventStore;
    resourceStore = project.resourceStore;
  }); // #8394 https://app.assembla.com/spaces/bryntum/tickets/8394-crudmanager-reacts-incorrectly-and-tries-to-save-empty-changeset/details#

  t.it('CRUD manager shouldn\'t sync an empty dataset', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var async, task, resource;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return project.load();

            case 2:
              async = t.beginAsync();
              project.on({
                beforesync: function beforesync(_ref2) {
                  var pack = _ref2.pack;
                  // NOTE: it used to be like that:
                  // pack {
                  //     ...
                  //     resources : {
                  //         updated : [{id : 1}]
                  //     }
                  //
                  //     tasks : {
                  //         updated : [{id : 1}]
                  //     }
                  //     ...
                  // }
                  t.notOk(Object.prototype.hasOwnProperty.call(pack, 'resources'), 'Crud manager doesn\'t sync unchanged resources');
                  t.notOk(Object.prototype.hasOwnProperty.call(pack, 'tasks'), 'Crud manager doesn\'t sync unchanged tasks');
                  t.endAsync(async);
                  return false;
                },
                single: true
              });
              task = taskStore.getById(1);
              resource = resourceStore.getById(1);
              t.ok(task && resource, 'Got data'); // enable project auto syncing

              project.autoSync = true;
              _context.next = 10;
              return task.assign(resource);

            case 10:
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