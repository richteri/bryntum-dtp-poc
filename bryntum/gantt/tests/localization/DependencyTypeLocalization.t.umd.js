function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var project; //All locales are preloaded via alsoPreload in tests/index.js

  function applyLocale(t, name) {
    t.diag("Applying locale ".concat(name));
    return LocaleManager.locale = window.bryntum.locales[name];
  }

  t.beforeEach( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = new ProjectModel({
                eventsData: function () {
                  return _toConsumableArray(new Array(5).keys()).map(function (index) {
                    return {
                      id: index + 1,
                      name: index + 1,
                      startDate: '2017-01-16',
                      duration: 1
                    };
                  });
                }(),
                dependenciesData: [{
                  fromEvent: 1,
                  toEvent: 5,
                  type: 0
                }, {
                  fromEvent: 2,
                  toEvent: 5,
                  type: 1
                }, {
                  fromEvent: 3,
                  toEvent: 5,
                  type: 2
                }, {
                  fromEvent: 4,
                  toEvent: 5,
                  type: 3
                }]
              });
              _context.next = 3;
              return project.waitForPropagateCompleted();

            case 3:
              // Wait for locales to load
              t.waitFor(function () {
                return window.bryntum.locales;
              }, next);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should localize dependency type in PredecessorsTab', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var depGrid;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return project.propagate();

            case 2:
              depGrid = new PredecessorsTab({
                appendTo: document.body
              });
              depGrid.height = 300;
              depGrid.loadEvent(project.eventStore.getById(5));
              Object.keys(window.bryntum.locales).forEach(function (name) {
                applyLocale(t, name);
                var dependencyTypes = Localizable().L('L{SchedulerProCommon.dependencyTypesLong}');
                Array.from(document.querySelectorAll('.b-grid-row [data-column="type"]')).forEach(function (el, index) {
                  t.contentLike(el, dependencyTypes[index], "Dependency type ".concat(index, " is localized properly in ").concat(name));
                });
              });
              depGrid.destroy();
              t.livesOk(function () {
                return applyLocale(t, 'En');
              }, 'Listener is removed properly');

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should localize dependency type in DependencyField', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var field;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return project.propagate();

            case 2:
              field = new DependencyField({
                appendTo: document.body,
                otherSide: 'from',
                ourSide: 'to'
              });
              field.value = project.dependencyStore.getRange();
              Object.keys(window.bryntum.locales).forEach(function (name) {
                applyLocale(t, name);
                var depNames = Localizable().L('L{GanttCommon.dependencyTypes}');
                t.is(field.input.value, "1".concat(depNames[0], ";2").concat(depNames[1], ";3;4").concat(depNames[3]), 'Dependency type is ok');
              });
              field.destroy();
              t.livesOk(function () {
                return applyLocale(t, 'En');
              }, 'Listeners destroyed correctly');

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should localize dependency type in DependencyTypePicker', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(t) {
      var picker;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return project.propagate();

            case 2:
              picker = new DependencyTypePicker({
                appendTo: document.body
              });
              Object.keys(window.bryntum.locales).forEach(function (name) {
                applyLocale(t, name);
                var dependencyTypes = Localizable().L('L{SchedulerProCommon.dependencyTypesLong}');
                picker.showPicker();
                dependencyTypes.forEach(function (item, index) {
                  t.contentLike(".b-list .b-list-item[data-index=".concat(index, "]"), item, "Dependency type ".concat(item, " is localized"));
                });
              });
              picker.destroy();
              t.livesOk(function () {
                return applyLocale(t, 'En');
              }, 'Listener is removed properly');

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
});