function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
  }); // https://github.com/bryntum/support/issues/426

  t.it('Should load resource with invalid calendar', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t) {
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
                      leaf: true,
                      startDate: '2020-03-17',
                      duration: 2
                    }]
                  },
                  resources: {
                    rows: [{
                      id: 1,
                      name: 'Albert',
                      calendar: ''
                    }]
                  },
                  assignments: {
                    rows: [{
                      id: 1,
                      resource: 1,
                      event: 1
                    }]
                  }
                })
              });
              project = new ProjectModel({
                transport: {
                  load: {
                    url: 'load'
                  }
                }
              });
              _context.next = 4;
              return project.load();

            case 4:
              t.is(project.resourceStore.first.calendar, project.calendar, 'Resource calendar is ok');

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/424

  t.it('Resource should not throw when trying to serialize calendar field', /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(t) {
      var _project$resourceStor, _project$resourceStor2, resource;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t.mockUrl('load', {
                responseText: JSON.stringify({
                  success: true
                })
              });
              project = new ProjectModel({
                transport: {
                  sync: {
                    url: 'sync'
                  }
                }
              });
              _project$resourceStor = project.resourceStore.add({
                name: 'new'
              }), _project$resourceStor2 = _slicedToArray(_project$resourceStor, 1), resource = _project$resourceStor2[0];
              t.isDeeply(resource.persistableData, {
                id: resource.id,
                name: 'new'
              });
              _context2.next = 6;
              return project.propagate();

            case 6:
              t.isDeeply(resource.persistableData, {
                id: resource.id,
                name: 'new',
                calendar: project.calendar.id
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }()); // https://github.com/bryntum/support/issues/427

  t.it('Should map calendar field', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(t) {
      var MyResource, _project$resourceStor3, _project$resourceStor4, resource;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              MyResource = /*#__PURE__*/function (_ResourceModel) {
                _inherits(MyResource, _ResourceModel);

                var _super = _createSuper(MyResource);

                function MyResource() {
                  _classCallCheck(this, MyResource);

                  return _super.apply(this, arguments);
                }

                _createClass(MyResource, null, [{
                  key: "fields",
                  get: function get() {
                    return [{
                      name: 'calendar',
                      dataSource: 'CalendarId',
                      serialize: function serialize(r) {
                        return r && r.id;
                      }
                    }];
                  }
                }]);

                return MyResource;
              }(ResourceModel);

              t.mockUrl('load', {
                responseText: JSON.stringify({
                  success: true,
                  project: {
                    calendar: 1
                  },
                  calendars: {
                    rows: [{
                      id: 1,
                      name: 'Calendar 1'
                    }, {
                      id: 2,
                      name: 'Calendar 2'
                    }]
                  },
                  tasks: {
                    rows: [{
                      id: 1,
                      leaf: true,
                      startDate: '2020-03-17',
                      duration: 2
                    }]
                  },
                  resources: {
                    rows: [{
                      id: 1,
                      name: 'Albert'
                    }]
                  },
                  assignments: {
                    rows: [{
                      id: 1,
                      resource: 1,
                      event: 1
                    }]
                  }
                })
              });
              project = new ProjectModel({
                resourceModelClass: MyResource,
                transport: {
                  load: {
                    url: 'load'
                  },
                  sync: {
                    url: 'sync'
                  }
                }
              });
              _context3.next = 5;
              return project.load();

            case 5:
              t.is(project.resourceStore.first.calendar, project.calendar, 'Resource calendar is ok');
              _project$resourceStor3 = project.resourceStore.add({
                name: 'new',
                CalendarId: 2
              }), _project$resourceStor4 = _slicedToArray(_project$resourceStor3, 1), resource = _project$resourceStor4[0];
              project.on({
                beforeSync: function beforeSync(_ref4) {
                  var pack = _ref4.pack;
                  t.isDeeply(pack.resources.added[0], {
                    $PhantomId: resource.id,
                    name: 'new'
                  }, 'Resource add request is ok before propagation');
                  return false;
                },
                once: true
              });
              _context3.next = 10;
              return project.sync().catch(function (e) {
                return t.pass('Sync request cancelled once');
              });

            case 10:
              _context3.next = 12;
              return project.propagate();

            case 12:
              project.on({
                beforeSync: function beforeSync(_ref5) {
                  var pack = _ref5.pack;
                  t.isDeeply(pack.resources.added[0], {
                    $PhantomId: resource.id,
                    CalendarId: 2,
                    name: 'new'
                  }, 'Resource add request is ok after propagation');
                  return false;
                },
                once: true
              });
              _context3.next = 15;
              return project.sync().catch(function (e) {
                return t.pass('Sync request cancelled twice');
              });

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});