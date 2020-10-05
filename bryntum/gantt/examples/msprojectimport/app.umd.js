function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _bryntum$gantt = bryntum.gantt,
    StringHelper = _bryntum$gantt.StringHelper,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    AjaxHelper = _bryntum$gantt.AjaxHelper,
    Toast = _bryntum$gantt.Toast;
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function lowerCaseConfig(data) {
  var config = {};
  Object.keys(data).forEach(function (key) {
    config[StringHelper.lowercaseFirstLetter(key)] = data[key];
  });
  return config;
}

var Importer = /*#__PURE__*/function () {
  function Importer(project) {
    _classCallCheck(this, Importer);

    var me = this;
    Object.assign(me, {
      project: project,
      taskStore: project.taskStore,
      dependencyStore: project.dependencyStore,
      resourceStore: project.resourceStore,
      assignmentStore: project.assignmentStore,
      calendarManager: project.calendarManagerStore
    });
  }

  _createClass(Importer, [{
    key: "importData",
    value: function importData(data) {
      var me = this;
      Object.assign(me, {
        calendarMap: {},
        projectCalendar: null,
        resourceMap: {},
        taskMap: {}
      });
      me.calendarManager.rootNode = me.processCalendars(data);
      var tasks = me.getTaskTree(Array.isArray(data.tasks) ? data.tasks : [data.tasks]);
      me.resourceStore.data = me.processResources(data);
      me.dependencyStore.data = me.processDependencies(data); // set project calendar if it's provided
      // we set project calendar in silent mode to not readjust all the tasks

      if (me.projectCalendar) {
        me.project.calendar = me.calendarMap[me.projectCalendar];
      }

      me.taskStore.rootNode.clearChildren();
      me.taskStore.rootNode.appendChild(tasks[0].children); // have to process assigments only after new project calendar is set

      me.assignmentStore.data = me.processAssignments(data);
    } // region RESOURCES

  }, {
    key: "processResources",
    value: function processResources(data) {
      return data.resources.map(this.processResource, this);
    }
  }, {
    key: "processResource",
    value: function processResource(data) {
      var id = data.Id;
      delete data.Id;
      data.calendar = this.calendarMap[data.Calendar];
      var resource = new this.resourceStore.modelClass(lowerCaseConfig(data));
      this.resourceMap[id] = resource;
      return resource;
    } // endregion
    // region DEPENDENCIES

  }, {
    key: "processDependencies",
    value: function processDependencies(data) {
      return data.dependencies.map(this.processDependency, this);
    }
  }, {
    key: "processDependency",
    value: function processDependency(data) {
      var me = this,
          fromId = data.From,
          toId = data.To;
      delete data.From;
      delete data.To;
      delete data.Id;
      var dep = new me.dependencyStore.modelClass(lowerCaseConfig(data));
      dep.fromEvent = me.taskMap[fromId].id;
      dep.toEvent = me.taskMap[toId].id;
      return dep;
    } // endregion
    // region ASSIGNMENTS

  }, {
    key: "processAssignments",
    value: function processAssignments(data) {
      return data.assignments.map(this.processAssignment, this);
    }
  }, {
    key: "processAssignment",
    value: function processAssignment(data) {
      var me = this,
          resourceId = data.ResourceId,
          taskId = data.TaskId;
      delete data.Id;
      delete data.ResourceId;
      delete data.TaskId;
      return new me.assignmentStore.modelClass({
        units: data.Units,
        event: me.taskMap[taskId],
        resource: me.taskMap[resourceId]
      });
    } // endregion
    // region TASKS

  }, {
    key: "getTaskTree",
    value: function getTaskTree(tasks) {
      return tasks.map(this.processTask, this);
    }
  }, {
    key: "processTask",
    value: function processTask(data) {
      var me = this,
          id = data.Id,
          children = data.children;
      delete data.children;
      delete data.Id;
      delete data.Milestone;
      data.calendar = me.calendarMap[data.calendar];
      var t = new me.taskStore.modelClass(lowerCaseConfig(data));

      if (children) {
        t.appendChild(me.getTaskTree(children));
      }

      t._Id = id;
      me.taskMap[t._Id] = t;
      return t;
    } // endregion
    // region CALENDARS

  }, {
    key: "processCalendarChildren",
    value: function processCalendarChildren(children) {
      return children.map(this.processCalendar, this);
    }
  }, {
    key: "processCalendarIntervals",
    value: function processCalendarIntervals(data) {
      var result = [],
          intervals = data.DefaultAvailability;

      if (intervals && intervals.length) {
        // Iterate over every element, making non working intervals
        for (var i = 0, l = intervals.length - 1; i < l; i++) {
          var start = intervals[i],
              end = intervals[i + 1];
          result.push({
            recurrentStartDate: "every weekday at ".concat(start.split('-')[1]),
            recurrentEndDate: "every weekday at ".concat(end.split('-')[0]),
            isWorking: false
          });
        } // connect last and first availability intervals


        result.push({
          recurrentStartDate: "every weekday at ".concat(intervals[intervals.length - 1].split('-')[1]),
          recurrentEndDate: "every weekday at ".concat(intervals[0].split('-')[0]),
          isWorking: false
        });
      }

      result.push({
        recurrentStartDate: "on ".concat(days[data.WeekendFirstDay], " at 0:00"),
        recurrentEndDate: "on ".concat(days[days.length - 1 == data.WeekendSecondDay ? 0 : data.WeekendSecondDay + 1], " at 00:00"),
        isWorking: false
      });
      return result;
    }
  }, {
    key: "processCalendar",
    value: function processCalendar(data) {
      var me = this,
          id = data.Id,
          children = data.children,
          intervals = me.processCalendarIntervals(data);
      delete data.children;
      delete data.Id;
      var t = new me.calendarManager.modelClass({
        name: data.Name,
        daysPerWeek: data.DaysPerWeek,
        daysPerMonth: data.DaysPerMonth,
        leaf: data.leaf,
        expanded: true,
        intervals: intervals
      });

      if (children) {
        t.appendChild(me.processCalendarChildren(children));
      }

      t._Id = id;
      me.calendarMap[t._Id] = t;
      return t;
    } // Entry point of calendars loading

  }, {
    key: "processCalendars",
    value: function processCalendars(data) {
      var me = this,
          metaData = data.calendars.metaData;
      delete data.calendars.metaData;
      var processed = me.processCalendarChildren(data.calendars.children); // remember passed project calendar identifier ..we will set it later after tasks are loaded

      me.projectCalendar = metaData && metaData.projectCalendar;
      return processed;
    } // endregion

  }]);

  return Importer;
}();
/* eslint-disable no-unused-vars */


var project = window.project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
}),
    importer = new Importer(project),
    _WidgetHelper$append = WidgetHelper.append([{
  type: 'filepicker',
  text: 'File',
  buttonConfig: {
    cls: 'b-blue b-raised'
  },
  listeners: {
    change: function change(_ref) {
      var files = _ref.files;

      if (files.length) {
        sendBtn.enable();
      } else {
        sendBtn.disable();
      }
    },
    clear: function clear() {
      sendBtn.disable();
    }
  }
}, {
  type: 'button',
  text: 'Import data',
  cls: 'b-orange b-raised b-load-button',
  disabled: true,
  onClick: function onClick() {
    var files = input.files;

    if (files) {
      var formData = new FormData();
      formData.append('mpp-file', files[0]);
      gantt.maskBody('Importing project ...');
      AjaxHelper.post('php/load.php', formData, {
        parseJson: true
      }).then( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
          var json;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  json = response.parsedJson;

                  if (!(json.success && json.data)) {
                    _context.next = 11;
                    break;
                  }

                  importer.importData(json.data);
                  gantt.zoomToFit();
                  _context.next = 6;
                  return project.propagate();

                case 6:
                  input.clear();
                  gantt.unmaskBody();
                  Toast.show('File imported successfully!');
                  _context.next = 12;
                  break;

                case 11:
                  onError("Import error: ".concat(json.msg));

                case 12:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()).catch(function (response) {
        onError("Import error: ".concat(response.error || response.message));
      });
    }
  }
}], {
  insertFirst: document.getElementById('tools') || document.body
}),
    _WidgetHelper$append2 = _slicedToArray(_WidgetHelper$append, 2),
    input = _WidgetHelper$append2[0],
    sendBtn = _WidgetHelper$append2[1];

var gantt = new Gantt({
  adopt: 'container',
  startDate: '2019-01-08',
  endDate: '2019-04-01',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 250
  }],
  viewPreset: 'weekAndDayLetter'
});

function onError(text) {
  gantt.unmaskBody();
  console.error(text);
  Toast.show({
    html: text,
    color: 'b-red',
    style: 'color:white',
    timeout: 3000
  });
}

project.load();