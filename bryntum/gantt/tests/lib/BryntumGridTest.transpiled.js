function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* globals $: true */
Class('BryntumGridTest', {
  // eslint-disable-next-line no-undef
  isa: BryntumCoreTest,
  override: {
    earlySetup: function earlySetup(callback, errback) {
      // Reset localstore (theme and language etc) for each test
      Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('b-')) {
          localStorage.removeItem(key);
        }
      });
      this.SUPER(callback, errback);
    }
  },
  methods: {
    getRemoteGrid: function getRemoteGrid(cfg) {
      var me = this,
          url = me.url + '/' + me.generation,
          generator = me.global.DataGenerator;
      generator && generator.reset();
      cfg = cfg || {};
      cfg.store = {
        fields: [{
          name: 'fullName',
          dataSource: 'name'
        }, {
          name: 'ageInYears',
          dataSource: 'age'
        }, {
          name: 'town',
          dataSource: 'city'
        }, {
          name: 'favouriteFood',
          dataSource: 'food'
        }, {
          name: 'favouriteColor',
          dataSource: 'color'
        }, {
          name: 'codingScore',
          dataSource: 'score'
        }, {
          name: 'codingRank',
          dataSource: 'rank'
        }, {
          name: 'codingPercent',
          dataSource: 'percent'
        }, {
          name: 'startDate',
          dataSource: 'start',
          type: 'date'
        }],
        readUrl: url,
        autoLoad: true
      };
      me.mockUrl(url, {
        synchronous: true,
        responseText: JSON.stringify(cfg.data || generator.generateData(cfg.count || 25))
      });

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'fullName',
          width: 150,
          editor: 'text',
          cellCls: 'name'
        }, {
          text: 'Age',
          field: 'ageInYears',
          width: 100,
          editor: 'number',
          cellCls: 'age',
          filterType: 'number'
        }, {
          text: 'City',
          field: 'town',
          flex: 2,
          editor: false,
          cellCls: 'city'
        }, {
          text: 'Food',
          field: 'favouriteFood',
          flex: 1,
          cellCls: 'food'
        }, {
          text: 'Color',
          field: 'favouriteColor',
          flex: 1,
          editor: {
            type: 'combo',
            items: generator ? generator.colors : []
          },
          cellCls: 'color'
        }, {
          // initially hidden column must not be navigated to by tests
          text: 'Start Date',
          type: 'date',
          field: 'startDate',
          hidden: true
        }];
      }

      if (cfg.extraColumns) {
        cfg.columns.push.apply(cfg.columns, cfg.extraColumns);
      }

      return me.getGrid(cfg);
    },
    getGrid: function getGrid(cfg) {
      if (!cfg) cfg = {};
      var generator = this.global.DataGenerator;
      generator && generator.reset();

      if (generator && !cfg.data && !cfg.store) {
        cfg.data = generator.generateData(cfg.count || 25, cfg.randomHeight);
      }

      if (generator && cfg.store && !cfg.store.data && !cfg.store.readUrl) {
        cfg.store.data = generator.generateData(cfg.count || 25, cfg.randomHeight);
      }

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'name',
          width: 150,
          editor: 'text',
          cellCls: 'name'
        }, {
          text: 'Age',
          field: 'age',
          width: 100,
          editor: 'number',
          cellCls: 'age'
        }, {
          text: 'City',
          field: 'city',
          flex: 2,
          editor: false,
          cellCls: 'city'
        }, {
          text: 'Food',
          field: 'food',
          flex: 1,
          cellCls: 'food'
        }, {
          text: 'Color',
          field: 'color',
          flex: 1,
          editor: {
            type: 'combo',
            items: generator ? generator.colors : []
          },
          cellCls: 'color'
        }];
      }

      if (cfg.rowNumber) {
        cfg.columns.unshift({
          type: 'rownumber'
        });
      }

      if (!cfg.appendTo) {
        cfg.appendTo = this.global.document.body;
      }

      var grid = new this.global.Grid(cfg);

      if (grid.isVisible && cfg.sanityCheck !== false) {
        this.checkGridSanity(grid);
      }

      return grid;
    },
    getTree: function getTree(cfg) {
      if (!cfg) cfg = {};
      cfg.features = cfg.features || {};
      cfg.features.tree = cfg.features.tree || true;

      if (!cfg.data && !cfg.store) {
        cfg.data = [{
          id: 1000,
          StartDate: '2018-01-16',
          Name: 'Project A',
          Description: 'Project A description',
          PercentDone: 50,
          Duration: 20,
          expanded: true,
          children: [{
            id: 1,
            Name: 'Planning',
            PercentDone: 50,
            StartDate: '2018-01-16',
            Duration: 10,
            expanded: true,
            children: [{
              id: 11,
              leaf: true,
              Name: 'Investigate',
              PercentDone: 50,
              StartDate: '2018-01-16',
              Duration: 8
            }, {
              id: 12,
              leaf: true,
              Name: 'Assign resources',
              PercentDone: 50,
              StartDate: '2018-01-16',
              Duration: 10
            }, {
              id: 13,
              leaf: true,
              Name: 'Gather documents',
              PercentDone: 50,
              StartDate: '2018-01-16',
              Duration: 10
            }, {
              id: 17,
              leaf: true,
              Name: 'Report to management',
              PercentDone: 0,
              StartDate: '2018-01-28',
              Duration: 0
            }]
          }, {
            id: 4,
            Name: 'Implementation Phase',
            PercentDone: 45,
            StartDate: '2018-01-30',
            Duration: 10,
            expanded: true,
            children: [{
              id: 34,
              leaf: true,
              Name: 'Preparation work',
              PercentDone: 30,
              StartDate: '2018-01-30',
              Duration: 5
            }, {
              id: 16,
              leaf: true,
              Name: 'Choose technology suite',
              PercentDone: 30,
              StartDate: '2018-01-30',
              Duration: 5
            }, {
              id: 15,
              Name: 'Build prototype',
              PercentDone: 60,
              StartDate: '2018-02-06',
              Duration: 5,
              expanded: false,
              children: [{
                id: 20,
                leaf: true,
                Name: 'Step 1',
                PercentDone: 60,
                StartDate: '2018-02-06',
                Duration: 4
              }, {
                id: 19,
                leaf: true,
                Name: 'Step 2',
                PercentDone: 60,
                StartDate: '2018-02-06',
                Duration: 4
              }, {
                id: 18,
                leaf: true,
                Name: 'Step 3',
                PercentDone: 60,
                StartDate: '2018-02-06',
                Duration: 4
              }, {
                id: 21,
                leaf: true,
                Name: 'Follow up with customer',
                PercentDone: 60,
                StartDate: '2018-02-10',
                Duration: 1
              }]
            }]
          }, {
            id: 5,
            leaf: true,
            Name: 'Customer approval',
            PercentDone: 0,
            StartDate: '2018-02-11',
            Duration: 0
          }]
        }, {
          id: 1001,
          StartDate: '2018-01-23',
          Name: 'Project B',
          Description: 'Project B description goes here',
          PercentDone: 35,
          Duration: 25,
          expanded: true,
          children: [{
            id: 10,
            Name: 'Planning',
            PercentDone: 50,
            StartDate: '2018-01-23',
            Duration: 10,
            expanded: true,
            children: [{
              id: 110,
              leaf: true,
              Name: 'Investigate',
              PercentDone: 50,
              StartDate: '2018-01-23',
              Duration: 5
            }, {
              id: 120,
              leaf: true,
              Name: 'Assign resources',
              PercentDone: 50,
              StartDate: '2018-01-23',
              Duration: 10
            }, {
              id: 130,
              leaf: true,
              Name: 'Gather documents',
              PercentDone: 50,
              StartDate: '2018-01-23',
              Duration: 10
            }, {
              id: 170,
              leaf: true,
              Name: 'Report to management',
              PercentDone: 0,
              StartDate: '2018-02-04',
              Duration: 0
            }]
          }, {
            id: 40,
            Name: 'Implementation Phase 1',
            PercentDone: 40,
            StartDate: '2018-02-06',
            Duration: 6,
            expanded: false,
            children: [{
              id: 340,
              leaf: true,
              Name: 'Preparation work',
              PercentDone: 30,
              StartDate: '2018-02-06',
              Duration: 5
            }, {
              id: 140,
              leaf: true,
              Name: 'Evaluate chipsets',
              PercentDone: 30,
              StartDate: '2018-02-06',
              Duration: 5
            }, {
              id: 160,
              leaf: true,
              Name: 'Choose technology suite',
              PercentDone: 30,
              StartDate: '2018-02-06',
              Duration: 5
            }, {
              id: 150,
              Name: 'Build prototype',
              PercentDone: 60,
              StartDate: '2018-02-07',
              Duration: 5,
              expanded: true,
              children: [{
                id: 200,
                leaf: true,
                Name: 'Step 1',
                PercentDone: 60,
                StartDate: '2018-02-07',
                Duration: 4
              }, {
                id: 190,
                leaf: true,
                Name: 'Step 2',
                PercentDone: 60,
                StartDate: '2018-02-07',
                Duration: 4
              }, {
                id: 180,
                leaf: true,
                Name: 'Step 3',
                PercentDone: 60,
                StartDate: '2018-02-07',
                Duration: 4
              }, {
                id: 210,
                leaf: true,
                Name: 'Follow up with customer',
                PercentDone: 60,
                StartDate: '2018-02-13',
                Duration: 1
              }]
            }]
          }, {
            id: 50,
            leaf: true,
            Name: 'Customer approval',
            PercentDone: 0,
            StartDate: '2018-02-14',
            Duration: 0
          }, {
            id: 60,
            Name: 'Implementation Phase 2',
            PercentDone: 15,
            StartDate: '2018-02-15',
            Duration: 8,
            expanded: false,
            children: [{
              id: 250,
              leaf: true,
              Name: 'Task 1',
              PercentDone: 10,
              StartDate: '2018-02-15',
              Duration: 8
            }, {
              id: 260,
              leaf: true,
              Name: 'Task 2',
              PercentDone: 20,
              StartDate: '2018-02-15',
              Duration: 8
            }, {
              id: 270,
              leaf: true,
              Name: 'Task 3',
              PercentDone: 20,
              StartDate: '2018-02-15',
              Duration: 8
            }]
          }, {
            id: 100,
            leaf: true,
            Name: 'Customer approval 2',
            PercentDone: 0,
            StartDate: '2018-02-25',
            Duration: 0
          }]
        }];
      }

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'Name',
          width: 150,
          editor: 'text',
          cellCls: 'name',
          type: 'tree'
        }, {
          text: 'PercentDone',
          field: 'PercentDone',
          width: 100,
          editor: 'number',
          cellCls: 'age'
        }, {
          text: 'Date',
          field: 'StartDate',
          flex: 2,
          editor: false
        }];
      }

      if (!cfg.appendTo) {
        cfg.appendTo = this.global.document.body;
      }

      return new this.global.TreeGrid(cfg);
    },
    checkGridSanity: function checkGridSanity(grid, next) {
      var _this = this;

      var cols = grid.columns || grid._columnStore,
          // Fallback for IE, some transpilation problem
      columns = cols.leaves.filter(function (col) {
        return !col.hidden;
      }),
          shrinkwrapGroupColumns = cols.allRecords.filter(function (c) {
        return c.children && !c.width && !c.flex && c.children.every(function (cc) {
          return cc.width;
        });
      }),
          columnCount = columns.length,
          rows = grid.rowManager.rows,
          rowCount = rows.length,
          headerEls = [],
          footerEls = [],
          IE11FlexRe = /calc\((\d+)px - \d+px\)/;
      var i;

      for (i = 0; i < columnCount; i++) {
        headerEls[i] = grid.getHeaderElement(columns[i].id);
        footerEls[i] = grid.fromCache(".b-grid-footer[data-column-id=".concat(columns[i].id, "]"));
      }

      var _loop = function _loop() {
        var headerEl = headerEls[i],
            footerEl = footerEls[i],
            column = columns[i],
            othersFlexed = grid.subGrids[column.region].columns.some(function (c) {
          return c !== column && !c.hidden && c.flex;
        }); // Allow width : '100px' as well as width : 100

        var w = column.width;

        if (w && w.endsWith && w.endsWith('px')) {
          w = parseInt(w);
        } // Check that columns configured with flex are obeying both in header and in any footer


        if (column.flex) {
          var domFlex = new RegExp("^".concat(column.flex, " 1 0(?:px|%)$"));

          if (headerEl && !domFlex.test(headerEl.style.flex)) {
            _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] not flexed as configured"));
          }

          if (footerEl && !domFlex.test(footerEl.style.flex)) {
            _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] not flexed as configured"));
          }
        } // Check that columns configured with a numeric width are obeying both in header and in any footer
        else if (typeof w === 'number') {
            // Last column in a grid which is configured fillLastColumn : true is special
            if (grid.fillLastColumn && column.isLastInSubGrid) {
              // If there is flex in siblings, then this column won't need to to fill
              // the grid, and it should attain its configured width
              if (othersFlexed) {
                if (headerEl && headerEl.offsetWidth !== w) {
                  _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] does not match its configured width"));
                }

                if (footerEl && _this.isElementVisible(footerEl) && footerEl.offsetWidth !== w) {
                  _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] does not match its configured width"));
                }
              } // If there's no flex in siblings, we must have a flex-grow style in order to satisfy the fillLastColumn
              else {
                  if (headerEl && isNaN(headerEl.ownerDocument.defaultView.getComputedStyle(headerEl).getPropertyValue('flex-grow'))) {
                    _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] should be flex:1 "));
                  }

                  if (footerEl && isNaN(headerEl.ownerDocument.defaultView.getComputedStyle(footerEl).getPropertyValue('flex-grow'))) {
                    _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] should be flex:1 "));
                  }
                }
            } else {
              if (headerEl && headerEl.offsetWidth !== w) {
                _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] does not match its configured width"));
              }

              if (footerEl && _this.isElementVisible(footerEl) && footerEl.offsetWidth !== w) {
                _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] does not match its configured width"));
              }
            }
          }
      };

      for (i = 0; i < columnCount; i++) {
        _loop();
      } // Check that group columns which have no flex and no width, who's children are all widthed
      // acquire the sum of the width of the children


      for (i = 0; i < shrinkwrapGroupColumns.length; i++) {
        var el = shrinkwrapGroupColumns[i].element,
            column = shrinkwrapGroupColumns[i],
            childTotalWidth = column.children.reduce(function (result, col) {
          return result += col.element.offsetWidth;
        }, 0);

        if (el.offsetWidth !== childTotalWidth) {
          this.fail("Grid ".concat(grid.id, ", group header[").concat(i, "] does not shrinkwrap its widthed children"));
        }
      }

      if (!grid.hideHeaders) {
        for (i = 0; i < rowCount; i++) {
          var row = rows[i];

          for (var col = 0; col < columnCount; col++) {
            var columnId = columns[col].id,
                cell = grid.getCell({
              id: row.id,
              columnId: columnId
            }),
                headerCell = headerEls[col],
                cellWidth = cell.offsetWidth,
                headerWidth = headerCell.offsetWidth;
            var headerStyleWidth = headerWidth; // TODO: Remove this when IE11 retires.
            // Get style width to be sure it was added to header's flexBasis (Grid/view/Bar.js)
            // Actual width may differ so just check style value

            if (this.browser.msie && headerCell.style.flexBasis) {
              var reMatch = void 0;

              if (reMatch = headerCell.style.flexBasis.match(IE11FlexRe)) {
                headerStyleWidth = parseInt(reMatch[1], 0);
              }
            }

            var validDelta = this.browser.msie || this.browser.msedge ? 2 : 1;

            if (!this.samePx(cellWidth, headerWidth, validDelta) && !this.samePx(cellWidth, headerStyleWidth)) {
              this.fail("Grid ".concat(grid.id, " offsetWidth: cell[row=").concat(i, ",col=").concat(col, "] (").concat(cellWidth, ") != header[col=").concat(col, ",id=\"").concat(columnId, "\"] (").concat(headerWidth, ")"));
            }
          }
        }
      } // Check post render height cache (Edge sometimes gives 1.2, but looks visually ok)
      // Scaling (The scaleToFitWidth config) causes this to fail in IE (Trident engine).


      if (!(navigator.userAgent.match(/trident/i) && grid.element.style.transform.indexOf('scale') > -1)) {
        if (!this.samePx(grid.bodyHeight, grid.bodyContainer.getBoundingClientRect().height, 2)) {
          this.fail("Grid ".concat(grid.id, " bodyHeight (").concat(grid.bodyHeight, ") != bodyContainer.offsetHeight (").concat(grid.bodyContainer.getBoundingClientRect().height, ")"));
        }
      }

      next && next();
    },
    waitForCellEditing: function waitForCellEditing(grid, next) {
      var inputField;
      this.waitFor(function () {
        var editorContext = grid.features.cellEdit.editorContext;

        if (editorContext) {
          inputField = editorContext.editor.inputField;
          return editorContext.editor.containsFocus;
        }
      }, function () {
        return next(inputField);
      });
    },
    waitForRowsVisible: function waitForRowsVisible(grid, next) {
      if (typeof grid === 'function') {
        next = grid;
        grid = null;
      }

      var root = grid && grid.element || this.global.document.body;
      this.waitFor(function () {
        return root.querySelector('.b-grid-cell');
      }, next);
    },
    waitForGridEvent: function waitForGridEvent(object, event, next) {
      var _object$on;

      object.on((_object$on = {}, _defineProperty(_object$on, event, function () {
        return setTimeout(next, 100);
      }), _defineProperty(_object$on, "once", true), _object$on));
    },
    waitForGridEvents: function waitForGridEvents(list, next) {
      var _this2 = this;

      var counter = 0;

      var handler = function handler() {
        return ++counter === list.length && next();
      };

      list.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            object = _ref2[0],
            event = _ref2[1];

        return _this2.waitForGridEvent(object, event, handler);
      });
    },
    getFirstRenderedRow: function getFirstRenderedRow(grid) {
      var root = grid && grid.element || this.global.document.body,
          rows = root.querySelectorAll('.b-grid-row');
      var y = Number.MAX_VALUE,
          row;
      [].forEach.call(rows, function (node) {
        var nodeY = node.getBoundingClientRect();

        if (nodeY.top < y) {
          y = nodeY.top;
          row = node;
        }
      });
      return row;
    },
    getLastRenderedRow: function getLastRenderedRow(grid) {
      var root = grid && grid.element || this.global.document.body,
          rows = root.querySelectorAll('.b-grid-row');
      var y = -1,
          row;
      [].forEach.call(rows, function (node) {
        var nodeY = node.getBoundingClientRect();

        if (nodeY.top > y) {
          y = nodeY.top;
          row = node;
        }
      });
      return row;
    },
    //region EXPORT
    overrideAjaxHelper: function overrideAjaxHelper() {
      var me = this;

      var AjaxHelperOverride = /*#__PURE__*/function () {
        function AjaxHelperOverride() {
          _classCallCheck(this, AjaxHelperOverride);
        }

        _createClass(AjaxHelperOverride, null, [{
          key: "fetch",
          value: function fetch(url, params) {
            if (/export$/g.test(url)) {
              var body = JSON.parse(params.body);
              return new Promise(function (resolve) {
                resolve({
                  ok: true,
                  request: {
                    params: params,
                    body: body
                  },
                  json: function json() {
                    return Promise.resolve({});
                  },
                  parsedJson: {}
                });
              });
            } else {
              return this._overridden.fetch(url, params);
            }
          }
        }, {
          key: "target",
          get: function get() {
            return {
              class: me.global.AjaxHelper
            };
          }
        }]);

        return AjaxHelperOverride;
      }();

      this.global.Override.apply(AjaxHelperOverride);
    },
    generateGridByPages: function generateGridByPages() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$rowsPerPage = _ref3.rowsPerPage,
          rowsPerPage = _ref3$rowsPerPage === void 0 ? 10 : _ref3$rowsPerPage,
          _ref3$rowHeight = _ref3.rowHeight,
          rowHeight = _ref3$rowHeight === void 0 ? 50 : _ref3$rowHeight,
          _ref3$verticalPages = _ref3.verticalPages,
          verticalPages = _ref3$verticalPages === void 0 ? 1 : _ref3$verticalPages,
          _ref3$horizontalPages = _ref3.horizontalPages,
          horizontalPages = _ref3$horizontalPages === void 0 ? 1 : _ref3$horizontalPages,
          _ref3$height = _ref3.height,
          height = _ref3$height === void 0 ? 300 : _ref3$height,
          _ref3$width = _ref3.width,
          width = _ref3$width === void 0 ? 500 : _ref3$width;

      // Paper height in
      var paperHeight = this.global.PaperFormat.A4.height * 96,
          paperWidth = this.global.PaperFormat.A4.width * 96,
          columnsNumber = 4,
          // Make columns wide enough to extend exported content to two columns
      columnWidth = Math.floor(paperWidth / columnsNumber) * horizontalPages,
          // Make header and footer to take as much space to leave only 10 rows on each page
      headerHeight = Math.floor((paperHeight - rowHeight * rowsPerPage) / 2);
      var grid = new this.global.Grid({
        appendTo: this.global.document.body,
        width: width,
        height: height,
        rowHeight: rowHeight - 1,
        // including standard row border that would be even 50
        columns: [{
          field: 'name',
          width: columnWidth,
          headerRenderer: function headerRenderer(_ref4) {
            var headerElement = _ref4.headerElement;
            headerElement.style.height = "".concat(rowHeight - 1, "px");
            return 'Name';
          }
        }, {
          text: 'Age',
          field: 'age',
          width: columnWidth
        }, {
          text: 'Color',
          field: 'color',
          width: columnWidth
        }, {
          text: 'City',
          field: 'city',
          width: columnWidth
        }],
        data: this.global.DataGenerator.generateData(verticalPages * rowsPerPage - 1),
        // header is as high as row and exported too
        features: {
          pdfExport: {
            exportServer: '/export',
            headerTpl: function headerTpl(_ref5) {
              var currentPage = _ref5.currentPage;
              return "<div style=\"height:".concat(headerHeight, "px;background-color: grey\">\n                    ").concat(currentPage != null ? "Page ".concat(currentPage) : 'HEAD', "</div>");
            },
            footerTpl: function footerTpl() {
              return "<div style=\"height:".concat(headerHeight, "px;background-color: grey\">FOOT</div>");
            }
          }
        }
      });
      return {
        grid: grid,
        paperHeight: paperHeight,
        paperWidth: paperWidth,
        columnWidth: columnWidth,
        headerHeight: headerHeight,
        rowHeight: rowHeight
      };
    },
    getExportHtml: function getExportHtml(grid, exportConfig) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return grid._features.pdfExport.export(exportConfig);

              case 2:
                result = _context.sent;
                return _context.abrupt("return", result.response.request.body.html);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    assertHeaderPosition: function assertHeaderPosition(doc) {
      var contentElBox = doc.querySelector('.b-export-content').getBoundingClientRect(),
          headerElBox = doc.querySelector('.b-export-header').getBoundingClientRect(),
          pass = true;

      if (headerElBox.top !== 0) {
        this.fail('Header el is aligned with page top', {
          got: headerElBox.top,
          need: 0
        });
        pass = false;
      }

      if (headerElBox.width !== contentElBox.width) {
        this.fail('Header el width is ok', {
          got: headerElBox.width,
          need: contentElBox.width
        });
        pass = false;
      }

      return pass;
    },
    assertFooterPosition: function assertFooterPosition(doc) {
      var contentElBox = doc.querySelector('.b-export-content').getBoundingClientRect(),
          footerEl = doc.querySelector('.b-export-footer'),
          footerElBox = footerEl.getBoundingClientRect(),
          pass = true,
          bodyBottom = doc.body.getBoundingClientRect().bottom; // Assert footer is aligned with the page bottom

      if (Math.abs(footerElBox.bottom - bodyBottom) > 1) {
        this.fail('Footer el is aligned with page bottom', {
          got: footerElBox.bottom,
          need: bodyBottom
        });
        pass = false;
      } // Assert footer width


      if (footerElBox.width !== contentElBox.width) {
        this.fail('Footer el width is ok', {
          got: footerElBox.width,
          need: contentElBox.width
        });
        pass = false;
      }

      if (!bowser.msie) {
        // Assert footer element is visible/reachable
        var fromPoint = doc.elementFromPoint(footerElBox.left + footerElBox.width / 2, footerElBox.top + footerElBox.height / 2),
            el = fromPoint && fromPoint.closest('.b-export-footer');

        if (el !== footerEl) {
          this.fail('Footer element is not reachable', {
            got: el,
            need: footerEl
          });
          pass = false;
        }
      }

      return pass;
    },
    assertGridHeader: function assertGridHeader(doc) {
      var headerEl = doc.querySelector('.b-export-header'),
          gridHeaderEl = doc.querySelector('header.b-grid-header-container'),
          headerBox = headerEl && headerEl.getBoundingClientRect(),
          gridHeaderBox = gridHeaderEl.getBoundingClientRect(),
          expectedTop = headerEl ? headerBox.bottom : 0;
      var pass = true; // Assert header vertical position

      if (Math.abs(expectedTop - gridHeaderBox.top) > 1) {
        pass = false;
        this.fail('Grid header is not aligned to the export header/page top', {
          got: gridHeaderBox.top,
          gotDesc: 'Grid header top position',
          need: expectedTop
        });
      } // Assert header element is visible


      var elAtPoint = doc.elementFromPoint(gridHeaderBox.left + gridHeaderBox.width / 2, gridHeaderBox.top + gridHeaderBox.height / 2),
          el = elAtPoint && $(elAtPoint).closest('.b-grid-header-container').get(0);

      if (el !== gridHeaderEl) {
        pass = false;
        this.fail('Grid header is not reachable', {
          got: el,
          need: gridHeaderEl
        });
      } // Assert first row is aligned with grid header


      var cellEl = doc.elementFromPoint(gridHeaderBox.left + gridHeaderBox.width / 2, gridHeaderBox.bottom + 1),
          rowEl = cellEl && $(cellEl).closest('.b-grid-row').get(0),
          rowBox = rowEl && rowEl.getBoundingClientRect();

      if (!rowBox) {
        pass = false;
        this.fail('Row el not found. Is header visible in the viewport?');
      } else if (Math.abs(gridHeaderBox.bottom - rowBox.top) > 1) {
        pass = false;
        this.fail('First visible row is not aligned with grid header', {
          got: rowBox.top,
          gotDesc: 'Row top',
          need: gridHeaderBox.bottom,
          needDesc: 'Header bottom'
        });
      }

      return pass;
    },
    assertRowAlignedWithGridHeader: function assertRowAlignedWithGridHeader(doc) {
      var rowEl = doc.querySelector('.b-grid-row'),
          rowElBox = rowEl.getBoundingClientRect(),
          gridHeaderBox = doc.querySelector('header.b-grid-header-container').getBoundingClientRect();
      this.isApprox(rowElBox.top, gridHeaderBox.bottom, 1, 'First row is aligned with grid header');
    },
    assertRowsExportedWithoutGaps: function assertRowsExportedWithoutGaps(doc) {
      var _this3 = this;

      var assertStartsWithRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var assertEndsWithRow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var assertLastRowVisible = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var regions = Array.from(doc.querySelectorAll('.b-grid-subgrid')),
          pass = true;
      regions.forEach(function (regionEl) {
        var name = regionEl.dataset.region,
            rows = Array.from(regionEl.querySelectorAll('.b-grid-row'));
        var previousRowBottom;
        rows.forEach(function (rowEl, index) {
          var rowElBox = rowEl.getBoundingClientRect();

          if (index === 0) {
            previousRowBottom = rowElBox.bottom;

            if (assertStartsWithRow) {
              var headerElBox = doc.querySelector('.b-export-header').getBoundingClientRect();

              if (!(rowElBox.top <= headerElBox.bottom && rowElBox.bottom >= headerElBox.bottom)) {
                _this3.fail('Gap found between first row on the page and page header', {
                  got: [rowElBox.top, rowElBox.bottom],
                  gotDesc: 'Row [top, bottom]',
                  need: headerElBox.bottom,
                  needDesc: 'Header bottom'
                });

                pass = false;
              }
            }
          } else {
            // Firefox requires bigger threshold
            if (rowElBox.top - previousRowBottom > 0.5) {
              _this3.fail("Row ".concat(index, " is not aligned with previous row in ").concat(name, " subgrid"), {
                got: rowElBox.top,
                need: previousRowBottom
              });

              pass = false;
            }

            previousRowBottom = rowElBox.bottom;

            if (index === rows.length - 1) {
              if (assertEndsWithRow) {
                var footerElBox = doc.querySelector('.b-export-footer').getBoundingClientRect();

                if (!(Math.round(rowElBox.bottom) >= Math.round(footerElBox.top))) {
                  _this3.fail('Gap found between last row on the page and page footer', {
                    got: rowElBox.bottom,
                    need: footerElBox.top,
                    needDesc: 'Need greater or equal to'
                  });

                  pass = false;
                }
              }

              if (assertLastRowVisible) {
                var gridBox = doc.querySelector('.b-gridbase').getBoundingClientRect(); // Use round because we are dealing with fractions of pixels
                // 1px approximation for FF

                if (Math.round(gridBox.bottom) + 1 < Math.round(rowElBox.bottom)) {
                  _this3.fail('Last row element is not fully visible', {
                    got: gridBox.bottom,
                    need: rowElBox.bottom,
                    gotDesc: 'Grid element ends at',
                    needDesc: 'Row element ends at'
                  });

                  pass = false;
                }
              }
            }
          }
        });
      });
      return pass;
    },
    assertGridHeightAlignedWithLastRow: function assertGridHeightAlignedWithLastRow(doc) {
      var rowEl = doc.querySelector('.b-grid-row:last-child'),
          rowElBox = rowEl.getBoundingClientRect(),
          footerEl = doc.querySelector('.b-grid-footer-container'),
          footerElBox = footerEl.getBoundingClientRect(),
          gridEl = doc.querySelector('.b-export-viewport > div'),
          gridElBox = gridEl.getBoundingClientRect();
      this.isApprox(gridElBox.bottom - footerElBox.height, rowElBox.bottom, 2, 'Grid bottom is aligned with last row bottom');
    } //endregion

  }
});