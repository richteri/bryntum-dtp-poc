function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var assignmentsManipulationStore;
  t.beforeEach(function (t) {
    if (assignmentsManipulationStore) {
      assignmentsManipulationStore.destroy();
      assignmentsManipulationStore = null;
    }
  });

  var getProject = function getProject() {
    return new MinimalGanttProject(t.getProjectData());
  };

  t.it('Should fill itself up using provided task', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var project, eventStore, resourceStore, assignmentStore, event, assignedResourcesCount;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore(), assignmentStore = project.getAssignmentStore();
              _context.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(117);
              assignmentsManipulationStore = new AssignmentsManipulationStore({
                projectEvent: event
              });
              t.is(assignmentsManipulationStore.resourceStore, resourceStore, 'Assignment manipulation store obtained resource store via event');
              t.is(assignmentsManipulationStore.assignmentStore, assignmentStore, 'Assignment manipulation store obtained assignment store via event');
              t.is(assignmentsManipulationStore.count, resourceStore.count, 'All resources are available for assignment');
              assignedResourcesCount = assignmentsManipulationStore.reduce(function (count, assignment) {
                return count + (assignment.event === event ? 1 : 0);
              }, 0);
              t.is(assignedResourcesCount, 2, "Event ".concat(event.id, " has ").concat(assignedResourcesCount, " resources assigned"));

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