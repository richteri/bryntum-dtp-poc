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

(function () {
  var targetElement = document.querySelector('div[data-file="gantt/feature/TaskEditCustom.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>This example shows a custom Task Editor configuration. The built-in "Notes" tab is hidden, a custom "Files" tab is added, the "General" tab is renamed to "Common" and "Custom" field is appended to it. Double-click on a task bar to start editing:</p>'; //START
  // Project contains all the data and is responsible for correct scheduling

  var project = new bryntum.gantt.ProjectModel({
    startDate: new Date(2017, 0, 1),
    tasksData: [{
      id: 1,
      name: 'Write docs',
      expanded: true,
      custom: 'Parent custom field value',
      children: [// 'custom' field is auto exposed to Task model, then its name is used in TaskEditor to get/set values
      {
        id: 2,
        name: 'Proof-read docs',
        startDate: '2017-01-02',
        endDate: '2017-01-05',
        custom: 'Proof-read custom value'
      }, {
        id: 3,
        name: 'Release docs',
        startDate: '2017-01-09',
        endDate: '2017-01-10',
        custom: 'Release custom value'
      }]
    }],
    dependenciesData: [{
      fromTask: 2,
      toTask: 3
    }]
  }); // Custom FilesTab class (the last item of tabsConfig)

  var FilesTab = /*#__PURE__*/function (_Grid) {
    _inherits(FilesTab, _Grid);

    var _super = _createSuper(FilesTab);

    function FilesTab() {
      _classCallCheck(this, FilesTab);

      return _super.apply(this, arguments);
    }

    _createClass(FilesTab, [{
      key: "loadEvent",
      // eo getter defaultConfig
      value: function loadEvent(eventRecord) {
        var files = []; // prepare dummy files data

        switch (eventRecord.data.id) {
          case 1:
            files = [{
              name: 'Image1.png',
              icon: 'image'
            }, {
              name: 'Chart2.pdf',
              icon: 'chart-pie'
            }, {
              name: 'Spreadsheet3.pdf',
              icon: 'file-excel'
            }, {
              name: 'Document4.pdf',
              icon: 'file-word'
            }, {
              name: 'Report5.pdf',
              icon: 'user-chart'
            }];
            break;

          case 2:
            files = [{
              name: 'Chart11.pdf',
              icon: 'chart-pie'
            }, {
              name: 'Spreadsheet13.pdf',
              icon: 'file-excel'
            }, {
              name: 'Document14.pdf',
              icon: 'file-word'
            }];
            break;

          case 3:
            files = [{
              name: 'Image21.png',
              icon: 'image'
            }, {
              name: 'Spreadsheet23.pdf',
              icon: 'file-excel'
            }, {
              name: 'Document24.pdf',
              icon: 'file-word'
            }, {
              name: 'Report25.pdf',
              icon: 'user-chart'
            }];
            break;
        } // eo switch


        this.store.data = files;
      } // eo function loadEvent

    }], [{
      key: "type",
      get: function get() {
        return 'filestab';
      }
    }, {
      key: "defaultConfig",
      get: function get() {
        return {
          title: 'Files',
          defaults: {
            labelWidth: 200
          },
          columns: [{
            text: 'Files attached to task',
            field: 'name',
            type: 'template',
            template: function template(data) {
              return "<i class=\"b-fa b-fa-fw b-fa-".concat(data.record.data.icon, "\"></i>").concat(data.record.data.name);
            }
          }]
        };
      }
    }]);

    return FilesTab;
  }(Grid); // eo class FilesTab
  // register 'filestab' type


  BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab); // Panel holding toolbar and Gantt

  var panel = new bryntum.gantt.Gantt({
    appendTo: targetElement,
    flex: '1 0 100%',
    project: project,
    // Gantt needs project to get schedule data from
    startDate: new Date(2016, 11, 31),
    endDate: new Date(2017, 0, 11),
    height: 250,
    columns: [{
      type: 'name',
      field: 'name',
      text: 'Name'
    }],
    features: {
      taskEdit: {
        editorConfig: {
          height: '35em',
          extraItems: {
            generaltab: [{
              type: 'textfield',
              label: 'My Custom Field',
              name: 'custom' // name of the field matches data field name, so value is loaded/saved automatically

            }]
          }
        },
        tabsConfig: {
          // change title of General tab
          generaltab: {
            title: 'Common'
          },
          // remove Notes tab
          notestab: false,
          // add custom Files tab
          filestab: {
            type: 'filestab'
          }
        }
      } // eo taskEdit

    } // eo features

  }); //END
})(); // eof