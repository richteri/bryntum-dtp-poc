function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    ProjectGenerator = _bryntum$gantt.ProjectGenerator;
/* eslint-disable no-unused-vars */

var gantt,
    project = window.project = new ProjectModel();

var _WidgetHelper$append = WidgetHelper.append([{
  type: 'number',
  label: 'Tasks',
  tooltip: 'Enter number of tasks to generate and press [ENTER]. Tasks are divided into blocks of ten',
  value: 1000,
  min: 10,
  max: 10000,
  width: 180,
  step: 10,
  onChange: function onChange(_ref) {
    var userAction = _ref.userAction;
    gantt.generateDataset();
  }
}, {
  type: 'number',
  label: 'Project size',
  tooltip: 'Enter number of tasks that should be connected into a "project" (multipliers of 10)',
  min: 10,
  max: 1000,
  value: 50,
  width: 180,
  step: 10,
  onChange: function onChange(_ref2) {
    var userAction = _ref2.userAction;
    gantt.generateDataset();
  }
}], {
  insertFirst: document.getElementById('tools') || document.body,
  cls: 'b-bright'
}),
    _WidgetHelper$append2 = _slicedToArray(_WidgetHelper$append, 2),
    taskCountField = _WidgetHelper$append2[0],
    projectSizeField = _WidgetHelper$append2[1];

gantt = new Gantt({
  adopt: 'container',
  emptyText: '',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 200
  }, {
    type: 'startdate',
    text: 'Start date'
  }, {
    type: 'duration',
    text: 'Duration'
  }],
  columnLines: false,
  generateDataset: function generateDataset() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var mask, config;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              taskCountField.disabled = projectSizeField.disabled = true;
              mask = _this.mask('Generating project');
              _context2.next = 4;
              return ProjectGenerator.generateAsync(taskCountField.value, projectSizeField.value, function (count) {
                mask.text = "Generating tasks: ".concat(count, "/").concat(taskCountField.value);
              });

            case 4:
              config = _context2.sent;

              _this.setTimeSpan(config.startDate, config.endDate);

              mask.text = 'Calculating schedule'; // Required to allow browser to update DOM before calculation starts

              _this.requestAnimationFrame( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        project.startDate = config.startDate;
                        project.endDate = config.endDate;
                        project.taskStore.data = config.tasksData;
                        project.dependencyStore.data = config.dependenciesData;
                        _context.next = 6;
                        return project.propagate();

                      case 6:
                        _this.unmask();

                        taskCountField.disabled = projectSizeField.disabled = false;

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
});
gantt.generateDataset();