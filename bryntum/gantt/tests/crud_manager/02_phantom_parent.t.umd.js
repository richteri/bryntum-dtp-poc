function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var project;
  Object.assign(window, {
    AjaxHelper: AjaxHelper
  });
  t.beforeEach(function () {
    project && project.destroy();
  });
  t.it('Should send phantom parent id for added tasks', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
      var parent1, child12, newParent, _newParent$children, child21, child22, _project$getChangeSet, tasks, _parent1$children, child11, _project$getChangeSet2;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              t.mockUrl('load', {
                responseText: JSON.stringify({
                  success: true,
                  tasks: {
                    rows: [{
                      id: 1,
                      name: 'Parent 1',
                      children: [{
                        id: 11,
                        name: 'Child 1-1',
                        startDate: '2020-03-20',
                        duration: 1
                      }]
                    }]
                  }
                })
              });
              project = new ProjectModel({
                transport: {
                  load: {
                    url: 'load'
                  },
                  sync: {
                    url: 'sync'
                  }
                }
              });
              _context.next = 4;
              return project.load();

            case 4:
              t.diag('Add new records');
              parent1 = project.taskStore.getById(1);
              child12 = parent1.appendChild({
                name: 'Child 1-2',
                duration: 2
              });
              newParent = parent1.parent.appendChild({
                name: 'Parent 2',
                children: [{
                  name: 'Child 2-1',
                  startDate: '2020-03-20',
                  duration: 2
                }, {
                  name: 'Child 2-2',
                  startDate: '2020-03-20',
                  duration: 1
                }]
              });
              _newParent$children = _slicedToArray(newParent.children, 2), child21 = _newParent$children[0], child22 = _newParent$children[1]; // Child 1-2 is supposed to stretch parent

              _context.next = 11;
              return project.propagate();

            case 11:
              _project$getChangeSet = project.getChangeSetPackage(), tasks = _project$getChangeSet.tasks;
              t.isDeeplySubset([{
                id: parent1.id,
                endDate: new Date(2020, 2, 22)
              }], tasks.updated, 'Parent updated');
              t.isDeeplySubset([{
                $PhantomId: child12.id,
                parentId: parent1.id
              }, {
                $PhantomId: newParent.id,
                parentId: null,
                children: undefined
              }, {
                $PhantomId: child21.id,
                $PhantomParentId: newParent.id,
                parentId: newParent.id
              }, {
                $PhantomId: child22.id,
                $PhantomParentId: newParent.id,
                parentId: newParent.id
              }], tasks.added, 'Task add request is ok');
              t.diag('Move nodes in tree');
              _parent1$children = _slicedToArray(parent1.children, 1), child11 = _parent1$children[0];
              newParent.appendChild(child11);
              parent1.appendChild(child21);
              _project$getChangeSet2 = project.getChangeSetPackage();
              tasks = _project$getChangeSet2.tasks;
              t.isDeeplySubset([{
                id: parent1.id,
                endDate: new Date(2020, 2, 22)
              }, {
                id: child11.id,
                $PhantomParentId: newParent.id,
                parentId: newParent.id
              }], tasks.updated, 'Tasks update request is ok');
              t.isDeeplySubset([{
                $PhantomId: child12.id,
                parentId: parent1.id
              }, {
                $PhantomId: newParent.id,
                parentId: null,
                children: undefined
              }, {
                $PhantomId: child21.id,
                $PhantomParentId: undefined,
                parentId: parent1.id
              }, {
                $PhantomId: child22.id,
                $PhantomParentId: newParent.id,
                parentId: newParent.id
              }], tasks.added, 'Tasks add request is ok');

            case 22:
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