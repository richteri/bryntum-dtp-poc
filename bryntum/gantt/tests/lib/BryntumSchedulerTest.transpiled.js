function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Class('BryntumSchedulerTest', {
  // eslint-disable-next-line no-undef
  isa: BryntumGridTest,
  // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)
  override: {
    mimicFocusOnMouseDown: function mimicFocusOnMouseDown(el, mouseDownEvent) {
      // Allow mousedown on label to run its course
      if (el.tagName !== 'LABEL') {
        this.SUPER(el, mouseDownEvent);
      }
    }
  },
  methods: {
    getTimeAxis: function getTimeAxis(TimeAxis, PresetManager, presetName, cfg) {
      var Date = this.global.Date;
      return new TimeAxis(this.global.Object.assign({
        startDate: new Date(2010, 1, 1),
        endDate: new Date(2010, 1, 11),
        weekStartDay: 1,
        viewPreset: presetName
      }, cfg));
    },
    getAssignmentStore: function getAssignmentStore(config) {
      var nbrAssignments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var AssignmentStore = this.global.AssignmentStore;
      return new AssignmentStore(this.global.Object.assign({
        data: function () {
          var records = [];

          for (var i = 1; i <= nbrAssignments; i++) {
            records.push({
              id: 'a' + i,
              eventId: i,
              resourceId: 'r' + i
            });
          }

          return records;
        }()
      }, config || {}));
    },
    getEventStore: function getEventStore(config) {
      var nbrEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var storeClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.global.EventStore;
      var _this$global = this.global,
          Date = _this$global.Date,
          Object = _this$global.Object;
      return new storeClass(Object.assign({
        data: function () {
          var events = [];

          for (var i = 1; i <= nbrEvents; i++) {
            events.push({
              id: i,
              cls: 'event' + i,
              resourceId: 'r' + i,
              name: 'Assignment ' + i,
              startDate: new Date(2011, 0, 3 + i),
              endDate: new Date(2011, 0, 5 + i)
            });
          }

          return events;
        }()
      }, config || {}));
    },
    getResourceStore: function getResourceStore(config) {
      var ResourceStore = this.global.ResourceStore;
      config = config || {};
      return new ResourceStore(this.global.Object.assign({
        data: [{
          id: 'r1',
          name: 'Mike'
        }, {
          id: 'r2',
          name: 'Linda'
        }, {
          id: 'r3',
          name: 'Don'
        }, {
          id: 'r4',
          name: 'Karen'
        }, {
          id: 'r5',
          name: 'Doug'
        }, {
          id: 'r6',
          name: 'Peter'
        }]
      }, config));
    },
    getResourceStore2: function getResourceStore2(config, nbrResources) {
      var ResourceStore = this.global.ResourceStore;
      return new ResourceStore(this.global.Object.assign({
        data: function () {
          var resources = [];

          for (var i = 1; i <= nbrResources; i++) {
            resources.push({
              id: 'r' + i,
              name: 'Resource ' + i
            });
          }

          return resources;
        }()
      }, config));
    },
    getResourceTreeStore: function getResourceTreeStore(config) {
      var ResourceStore = this.global.ResourceStore;
      config = config || {};
      return new ResourceStore(this.global.Object.assign({
        tree: true,
        data: [{
          id: 'r1',
          name: 'Kastrup Airport',
          expanded: true,
          children: [{
            id: 'r2',
            name: 'Terminal A',
            expanded: false,
            children: [{
              id: 'r3',
              name: 'Gates 1 - 5',
              expanded: true,
              children: [{
                id: 'r4',
                name: 'Gate 1'
              }, {
                id: 'r5',
                name: 'Gate 2'
              }, {
                id: 'r6',
                name: 'Gate 3'
              }, {
                id: 'r7',
                name: 'Gate 4'
              }, {
                id: 'r8',
                name: 'Gate 5'
              }]
            }]
          }, {
            id: 'r42222',
            name: 'Gate 1214312421'
          }]
        } // eof Kastrup
        ] // eof data

      }, config));
    },
    getDependencyStore: function getDependencyStore(config, nbrEvents) {
      var DependencyStore = this.global.DependencyStore;
      if (nbrEvents === undefined) nbrEvents = 5;
      return new DependencyStore(this.global.Object.assign({
        data: function () {
          var dependencies = [];

          for (var i = 1; i <= nbrEvents - 1; i++) {
            dependencies.push({
              id: i,
              from: i,
              to: i + 1
            });
          }

          return dependencies;
        }()
      }, config || {}));
    },
    getScheduler: function getScheduler(config, nbrEvents) {
      var _this$global2 = this.global,
          Date = _this$global2.Date,
          Scheduler = _this$global2.Scheduler,
          Object = _this$global2.Object;
      config = config || {};

      if (!config.features) {
        config.features = {
          eventEdit: false,
          // some tests not written to have event editor or context menu
          eventContextMenu: false,
          contextMenu: false
        };
      } // Secret flag to easily get a scheduler tree
      //if (config.__tree) {
      //    return this.getSchedulerTree(config, nbrEvents);
      //}


      if (config.dependencyStore === true) {
        config.dependencyStore = this.getDependencyStore({}, nbrEvents);
      }

      if ((config.dependencyStore || config.dependencies) && !config.features.dependencies) config.features.dependencies = true;

      if (!('startDate' in config)) {
        config.startDate = new Date(2011, 0, 3);
        config.endDate = new Date(2011, 0, 13);
      }

      if (!config.events && !config.eventStore) {
        config.eventStore = this.getEventStore({}, nbrEvents);
      }

      if (!config.resources && !config.resourceStore) {
        config.resourceStore = this.getResourceStore();
      }

      if (!config.appendTo) {
        config.appendTo = this.global.document.body;
      }

      var scheduler = new Scheduler(Object.assign({
        viewPreset: 'dayAndWeek',
        rowHeight: 45,
        // Setup static columns
        columns: [{
          text: 'Name',
          sortable: true,
          width: 100,
          field: 'name',
          locked: true
        }],
        destroyStores: true,
        useInitialAnimation: false
      }, config));

      if (scheduler.isVisible && config.sanityCheck !== false) {
        this.checkGridSanity(scheduler);
      }

      return scheduler;
    },
    getVerticalScheduler: function getVerticalScheduler(config) {
      var _this$global3 = this.global,
          Date = _this$global3.Date,
          Object = _this$global3.Object,
          document = _this$global3.document;

      if (!config) {
        config = {};
      }

      return new this.global.Scheduler(Object.assign({
        appendTo: document.body,
        mode: 'vertical',
        startDate: new Date(2019, 5, 1),
        endDate: new Date(2019, 6, 1),
        useInitialAnimation: false,
        enableEventAnimations: false,
        barMargin: 0,
        events: [{
          id: 1,
          name: 'Event 1',
          resourceId: 'r1',
          startDate: new Date(2019, 4, 28),
          duration: 2
        }, {
          id: 2,
          name: 'Event 2',
          resourceId: 'r1',
          startDate: new Date(2019, 4, 29),
          duration: 4
        }, {
          id: 3,
          name: 'Event 3',
          resourceId: 'r2',
          startDate: new Date(2019, 5, 1),
          duration: 4
        }, {
          id: 4,
          name: 'Event 4',
          resourceId: 'r3',
          startDate: new Date(2019, 5, 5),
          duration: 5
        }, {
          id: 5,
          name: 'Event 5',
          resourceId: 'r4',
          startDate: new Date(2019, 5, 8),
          duration: 2
        }, {
          id: 6,
          name: 'Event 6',
          resourceId: 'r1',
          startDate: new Date(2019, 5, 20),
          duration: 2
        }, {
          id: 7,
          name: 'Event 7',
          resourceId: 'r1',
          startDate: new Date(2019, 5, 25),
          duration: 2
        }, {
          id: 8,
          name: 'Event 8',
          resourceId: 'r9',
          startDate: new Date(2019, 5, 25),
          duration: 2
        }, // Initially outside of timeaxis
        {
          id: 1000,
          name: 'Event 1000',
          resourceId: 'r1',
          startDate: new Date(2019, 4, 10),
          duration: 2
        }, {
          id: 1001,
          name: 'Event 1001',
          resourceId: 'r1',
          startDate: new Date(2019, 6, 20),
          duration: 2
        }],
        resources: [{
          id: 'r1',
          name: 'Resource 1',
          location: 'Location 1'
        }, {
          id: 'r2',
          name: 'Resource 2',
          location: 'Location 2'
        }, {
          id: 'r3',
          name: 'Resource 3',
          location: 'Location 1'
        }, {
          id: 'r4',
          name: 'Resource 4',
          location: 'Location 2'
        }, {
          id: 'r5',
          name: 'Resource 5',
          location: 'Location 1'
        }, {
          id: 'r6',
          name: 'Resource 6',
          location: 'Location 2'
        }, {
          id: 'r7',
          name: 'Resource 7',
          location: 'Location 1'
        }, {
          id: 'r8',
          name: 'Resource 8'
        }, {
          id: 'r9',
          name: 'Resource 9',
          location: 'Location 1'
        }],
        resourceTimeRanges: [{
          id: 1,
          name: 'Resource range 1',
          resourceId: 'r3',
          startDate: new Date(2019, 4, 28),
          duration: 10
        }],
        timeRanges: [{
          id: 1,
          name: 'Range 1',
          startDate: new Date(2019, 4, 29),
          duration: 4
        }, {
          id: 2,
          name: 'Line 2',
          startDate: new Date(2019, 5, 6)
        }]
      }, config));
    },
    getVerticalSchedulerMulti: function getVerticalSchedulerMulti(config) {
      if (!config) {
        config = {};
      } //return new this.global.Scheduler(


      return this.getVerticalScheduler(this.global.Object.assign({
        events: [{
          id: 1,
          name: 'Event 1',
          startDate: new this.global.Date(2019, 4, 28),
          duration: 2
        }, {
          id: 2,
          name: 'Event 2',
          startDate: new this.global.Date(2019, 4, 29),
          duration: 4
        }, {
          id: 3,
          name: 'Event 3',
          startDate: new this.global.Date(2019, 5, 1),
          duration: 4
        }, {
          id: 4,
          name: 'Event 4',
          startDate: new this.global.Date(2019, 5, 5),
          duration: 5
        }, {
          id: 5,
          name: 'Event 5',
          startDate: new this.global.Date(2019, 5, 8),
          duration: 2
        }, {
          id: 6,
          name: 'Event 6',
          startDate: new this.global.Date(2019, 5, 20),
          duration: 2
        }, {
          id: 7,
          name: 'Event 7',
          startDate: new this.global.Date(2019, 5, 25),
          duration: 2
        }, {
          id: 8,
          name: 'Event 8',
          startDate: new this.global.Date(2019, 5, 25),
          duration: 2
        }],
        assignments: [{
          id: 'a1',
          resourceId: 'r1',
          eventId: 1
        }, {
          id: 'a2',
          resourceId: 'r1',
          eventId: 2
        }, {
          id: 'a3',
          resourceId: 'r1',
          eventId: 3
        }, {
          id: 'a4',
          resourceId: 'r1',
          eventId: 4
        }, {
          id: 'a5',
          resourceId: 'r2',
          eventId: 1
        }, {
          id: 'a6',
          resourceId: 'r2',
          eventId: 2
        }, {
          id: 'a7',
          resourceId: 'r3',
          eventId: 4
        }, {
          id: 'a8',
          resourceId: 'r3',
          eventId: 5
        }, {
          id: 'a9',
          resourceId: 'r3',
          eventId: 6
        }, {
          id: 'a10',
          resourceId: 'r4',
          eventId: 1
        }, {
          id: 'a11',
          resourceId: 'r5',
          eventId: 7
        }, {
          id: 'a12',
          resourceId: 'r6',
          eventId: 8
        }, {
          id: 'a13',
          resourceId: 'r7',
          eventId: 7
        }, {
          id: 'a14',
          resourceId: 'r8',
          eventId: 8
        }, {
          id: 'a15',
          resourceId: 'r9',
          eventId: 1
        }]
      }, config));
    },
    isDeeplyUnordered: function isDeeplyUnordered(array, toMatch, desc) {
      var failDesc = 'isDeeplyUnordered check failed: ' + desc,
          passDesc = 'isDeeplyUnordered check passed: ' + desc;

      if (!this.global.Array.isArray(array) || !this.global.Array.isArray(toMatch)) {
        return this.isDeeply.apply(this, arguments);
      }

      if (array.length !== toMatch.length) {
        this.fail(failDesc);
        return;
      }

      var joined = array.concat(toMatch),
          set = new this.global.Set(joined);

      if (set.size !== array.length) {
        this.fail(failDesc);
        return;
      }

      this.pass(passDesc);
    },
    snapShotListeners: function snapShotListeners(observable, name) {
      var _this = this;

      this._observableData = this._observableData || {};
      this._observableData[name] = {}; // if (!name) throw 'Must provide a name for the observable';

      Object.keys(observable.eventListeners).forEach(function (key) {
        _this._observableData[name][key] = observable.eventListeners[key].slice();
      });
    },
    verifyListeners: function verifyListeners(observable, name, allowedObservers) {
      var _this2 = this;

      var needListeners = this._observableData[name];
      var count = 0;

      function logListener(listener) {
        var result = Object.assign({}, listener);
        result.thisObj = result.thisObj && result.thisObj.constructor.name || undefined;
        return result;
      }

      allowedObservers = allowedObservers || [];
      Object.keys(observable.eventListeners).forEach(function (key) {
        if (!needListeners[key]) {
          observable.eventListeners[key].forEach(function (listener) {
            if (!allowedObservers.includes(listener.thisObj)) {
              count++;

              _this2.is(logListener(listener), null, "Extra ".concat(key, " event listener found"));
            }
          });
        } else {
          observable.eventListeners[key].forEach(function (listener) {
            if (!needListeners[key].includes(listener) && !allowedObservers.includes(listener.thisObj)) {
              count++;

              _this2.is(logListener(listener), null, "Extra ".concat(key, " event listener found"));
            }
          });
          needListeners[key].forEach(function (listener) {
            if (observable.eventListeners[key].indexOf(listener) === -1) {
              _this2.is(null, logListener(listener), "".concat(key, " event listener is missing"));
            }
          });
        }
      });
      this.is(count, 0, 'No extra listeners found');
    },
    getHeaderAndBodyScrollValues: function getHeaderAndBodyScrollValues(scheduler) {
      var bodyScroll = scheduler.timeAxisSubGrid.scrollable.x,
          headerScroll = scheduler.timeAxisSubGrid.header.scrollable.x;
      return {
        header: headerScroll,
        body: bodyScroll
      };
    },
    waitForHeaderAndBodyScrollSynced: function waitForHeaderAndBodyScrollSynced(scheduler, next) {
      var _this3 = this;

      this.waitFor(function () {
        var values = _this3.getHeaderAndBodyScrollValues(scheduler);

        return values.header === values.body;
      }, next);
    },
    // waitForPropagate : async function(partOfProject, next) {
    //     const async = this.beginAsync();
    //
    //     partOfProject = partOfProject.project || partOfProject;
    //
    //     await partOfProject.waitForPropagateCompleted();
    //
    //     this.endAsync(async);
    //
    //     next();
    // },
    assertHeaderAndBodyAreScrollSynced: function assertHeaderAndBodyAreScrollSynced(scheduler) {
      var values = this.getHeaderAndBodyScrollValues(scheduler);
      this.is(values.header, values.body, 'Header and body scroll is synced');
    },
    assertDependency: function assertDependency(scheduler, dependency) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          fromSide = _ref.fromSide,
          toSide = _ref.toSide,
          fromBox = _ref.fromBox,
          toBox = _ref.toBox;

      function getPointFromBox(record, side, box) {
        var adjustTop = 0,
            _scheduler$getElement = scheduler.getElementsFromEventRecord(record),
            _scheduler$getElement2 = _slicedToArray(_scheduler$getElement, 1),
            el = _scheduler$getElement2[0],
            viewStartDate = scheduler.startDate,
            viewEndDate = scheduler.endDate,
            OUTSIDE_VIEW_OFFSET = 40;

        var point,
            adjustLeft = 0,
            adjustRight = 0;

        if (box) {
          if (record.startDate > viewEndDate) {
            box.left = box.left + OUTSIDE_VIEW_OFFSET;
          } else if (record.endDate < viewStartDate) {
            box.left = box.left - OUTSIDE_VIEW_OFFSET;
          }

          box.right = box.left + box.width;
        } else {
          box = el.getBoundingClientRect();
        }

        if (record.milestone) {
          if (!el.classList.contains('b-sch-event-withicon')) {
            adjustLeft = -1 * (adjustRight = box.height / 2);
          } else {
            box = el.querySelector('*').getBoundingClientRect();
          }
        }

        switch (side) {
          case 'top':
            point = [box.left + box.width / 2, box.top];
            break;

          case 'bottom':
            point = [box.left + box.width / 2, box.bottom];
            break;

          case 'left':
            point = [box.left + adjustLeft, box.top + box.height / 2 - adjustTop];
            break;

          case 'right':
            point = [box.right + adjustRight, box.top + box.height / 2];
            break;

          case 'top-left':
            point = [box.left + adjustLeft, box.top];
            break;
        }

        return point;
      }

      function getFromSide(dependency) {
        return dependency.fromSide || (dependency.type < 2 ? 'left' : 'right');
      }

      function getToSide(dependency) {
        var result;

        if (dependency.toSide) {
          result = dependency.toSide;
        } else {
          result = dependency.type % 2 ? 'right' : 'left';
        }

        return result;
      }

      var from = dependency.sourceEvent,
          to = dependency.targetEvent;

      if (from && to) {
        // Using '_features' instead of 'features' for IE11 compatibility
        var dependencyEl = scheduler._features.dependencies.getElementForDependency(dependency),
            fromPoint = getPointFromBox(from, fromSide || getFromSide(dependency), fromBox),
            toPoint = getPointFromBox(to, toSide || getToSide(dependency), toBox),
            svgBox = dependencyEl.ownerSVGElement.getBoundingClientRect(),
            dependencyPoints = dependencyEl.getAttribute('points').split(' '),
            depStartPoint = dependencyPoints[0].split(',').map(function (item) {
          return parseInt(item);
        }),
            depEndPoint = dependencyPoints[dependencyPoints.length - 1].split(',').map(function (item) {
          return parseInt(item);
        }),
            depFromPoint = [depStartPoint[0] + svgBox.left, depStartPoint[1] + svgBox.top],
            depToPoint = [depEndPoint[0] + svgBox.left, depEndPoint[1] + svgBox.top];

        this.isApprox(depFromPoint[0], fromPoint[0], 1, "Dependency start point x is ok (".concat(from.name, ")"));
        this.isApprox(depFromPoint[1], fromPoint[1], 1, "Dependency start point y is ok (".concat(from.name, ")"));
        this.isApprox(depToPoint[0], toPoint[0], 1, "Dependency end point x is ok (".concat(to.name, ")"));
        this.isApprox(depToPoint[1], toPoint[1], 1, "Dependency end point y is ok (".concat(to.name, ")"));
      }
    },
    // Utility method to create steps to show contextmenu and click item.
    eventContextMenuSteps: function eventContextMenuSteps(testScheduler, event) {
      var _ref2;

      if (!(event instanceof testScheduler.eventStore.modelClass)) {
        event = testScheduler.eventStore.getById(event);
      }

      var steps = [function (next) {
        testScheduler.scrollEventIntoView(event).then(next);
      }, {
        rightclick: testScheduler.getElementFromEventRecord(event)
      }];

      for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2) - 1; i++) {
        steps.push({
          moveMouseTo: ".b-menuitem:contains(".concat(i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2], ")")
        });
      }

      steps.push({
        click: ".b-menuitem:contains(".concat((_ref2 = (arguments.length <= 2 ? 0 : arguments.length - 2) - 1 + 2, _ref2 < 2 || arguments.length <= _ref2 ? undefined : arguments[_ref2]), ")")
      });
      return steps;
    },
    //region Export
    generateSingleRowHeightDataSet: function generateSingleRowHeightDataSet(resourcesCount, startDate, endDate) {
      var dateHelper = this.global.DateHelper,
          resources = this.global.DataGenerator.generateData(resourcesCount),
          randomGenerator = new this.global.RandomGenerator(),
          events = [],
          dependencies = [],
          rangeCenter = dateHelper.add(startDate, Math.floor(dateHelper.getDurationInUnit(startDate, endDate, 'd') / 2), 'd'),
          ranges = [[null, startDate], [dateHelper.add(startDate, 1, 'd'), rangeCenter], [rangeCenter, endDate], [endDate, null]];

      function createRandomEvent(rangeStart, rangeEnd) {
        if (!rangeStart) {
          rangeStart = dateHelper.add(rangeEnd, -2, 'w');
        } else if (!rangeEnd) {
          rangeEnd = dateHelper.add(rangeStart, 2, 'w');
        }

        var rangeInDays = dateHelper.getDurationInUnit(rangeStart, rangeEnd, 'd'),
            startDay = randomGenerator.nextRandom(rangeInDays - 1),
            duration = randomGenerator.nextRandom(rangeInDays - startDay),
            startDate = dateHelper.add(rangeStart, startDay, 'd'),
            endDate = dateHelper.add(startDate, duration, 'd');
        return {
          startDate: startDate,
          endDate: endDate
        };
      }

      resources.forEach(function (resource) {
        for (var i = 0; i < 4; i++) {
          events.push(Object.assign({
            id: "".concat(resource.id, "-").concat(i),
            resourceId: resource.id,
            name: "Assignment ".concat(i + 1)
          }, createRandomEvent.apply(void 0, _toConsumableArray(ranges[i]))));
        }
      });
      events.forEach(function (record) {
        var // Don't target dependencies to milestones, see issue #21
        target = randomGenerator.fromArray(events.filter(function (r) {
          return r.id !== record.id && r.endDate - r.startDate !== 0;
        })),
            fromOutside = !dateHelper.intersectSpans(record.startDate, record.endDate, startDate, endDate),
            toOutside = !dateHelper.intersectSpans(target.startDate, target.endDate, startDate, endDate);
        dependencies.push({
          id: "".concat(record.id, "-").concat(target.id),
          from: record.id,
          to: target.id,
          type: randomGenerator.nextRandom(3),
          toOutside: toOutside,
          fromOutside: fromOutside
        });
      });
      return {
        resources: resources,
        events: events,
        dependencies: dependencies
      };
    },
    createSchedulerForExport: function createSchedulerForExport() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$verticalPages = _ref3.verticalPages,
          verticalPages = _ref3$verticalPages === void 0 ? 1 : _ref3$verticalPages,
          _ref3$horizontalPages = _ref3.horizontalPages,
          horizontalPages = _ref3$horizontalPages === void 0 ? 1 : _ref3$horizontalPages,
          _ref3$rowHeight = _ref3.rowHeight,
          rowHeight = _ref3$rowHeight === void 0 ? 50 : _ref3$rowHeight,
          _ref3$rowsPerPage = _ref3.rowsPerPage,
          rowsPerPage = _ref3$rowsPerPage === void 0 ? 10 : _ref3$rowsPerPage,
          _ref3$startDate = _ref3.startDate,
          startDate = _ref3$startDate === void 0 ? new this.global.Date(2019, 10, 4) : _ref3$startDate,
          _ref3$endDate = _ref3.endDate,
          endDate = _ref3$endDate === void 0 ? new this.global.Date(2019, 10, 18) : _ref3$endDate,
          _ref3$height = _ref3.height,
          height = _ref3$height === void 0 ? 450 : _ref3$height,
          _ref3$width = _ref3.width,
          width = _ref3$width === void 0 ? 600 : _ref3$width,
          _ref3$featuresConfig = _ref3.featuresConfig,
          featuresConfig = _ref3$featuresConfig === void 0 ? {} : _ref3$featuresConfig,
          _ref3$config = _ref3.config,
          config = _ref3$config === void 0 ? {} : _ref3$config;

      var timelineWeight = 0.75,
          paperHeight = this.global.PaperFormat.A4.height * 96,
          paperWidth = this.global.PaperFormat.A4.width * 96,
          viewPreset = 'weekAndDayLetter',
          presetInstance = this.global.PresetManager.getPreset(viewPreset),
          ticksAmount = this.global.DateHelper.getDurationInUnit(startDate, endDate, 'd'),
          timelineMinWidth = ticksAmount * presetInstance.tickWidth,
          proposedScheduleWidth = Math.max(horizontalPages * paperWidth * timelineWeight, timelineMinWidth),
          proposedTickWidth = Math.floor(proposedScheduleWidth / ticksAmount),
          normalRegionWidth = proposedTickWidth * ticksAmount,
          lockedRegionWidth = horizontalPages * paperWidth - normalRegionWidth - 5,
          // 5 - splitter width
      columnsNumber = 4,
          columnWidth = Math.floor(lockedRegionWidth / columnsNumber),
          // Make header and footer to take as much space to leave only ROWSPERPAGE rows on each page
      headerHeight = Math.floor((paperHeight - rowHeight * rowsPerPage) / 2);
      var columns = [{
        type: 'rownumber',
        id: 'rownumber',
        width: columnWidth,
        minWidth: columnWidth
      }, {
        id: 'name',
        field: 'name',
        width: columnWidth,
        minWidth: columnWidth,
        headerRenderer: function headerRenderer(_ref4) {
          var headerElement = _ref4.headerElement;
          headerElement.style.height = "".concat(rowHeight - 1, "px");
          return 'Name';
        }
      }, {
        text: 'First name',
        id: 'firstName',
        field: 'firstName',
        width: columnWidth,
        minWidth: columnWidth
      }, {
        text: 'Surname',
        id: 'surName',
        field: 'surName',
        width: columnWidth,
        minWidth: columnWidth
      }];

      var _this$generateSingleR = this.generateSingleRowHeightDataSet(verticalPages * rowsPerPage - 1, startDate, endDate),
          resources = _this$generateSingleR.resources,
          events = _this$generateSingleR.events,
          dependencies = _this$generateSingleR.dependencies;

      var features = Object.assign({
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
      }, featuresConfig);
      var scheduler = new this.global.Scheduler(Object.assign({
        appendTo: this.global.document.body,
        subGridConfigs: {
          locked: {
            width: Math.min(300, columnWidth * columnsNumber)
          }
        },
        weekStartDay: 1,
        rowHeight: rowHeight - 1,
        viewPreset: {
          base: viewPreset,
          tickWidth: proposedTickWidth
        },
        startDate: startDate,
        endDate: endDate,
        width: width,
        height: height,
        columns: columns,
        features: features,
        resources: resources,
        events: events,
        dependencies: dependencies
      }, config));
      return {
        scheduler: scheduler,
        headerHeight: headerHeight,
        rowHeight: rowHeight,
        rowsPerPage: rowsPerPage,
        paperHeight: paperHeight,
        paperWidth: paperWidth
      };
    },
    getFirstLastVisibleTicks: function getFirstLastVisibleTicks(doc, headerEl) {
      headerEl = headerEl || doc.querySelector('.b-sch-header-row.b-lowest ');
      var rectangle = this.global.Rectangle,
          exportBodyEl = doc.querySelector('.b-export-body'),
          exportBodyBox = rectangle.from(exportBodyEl),
          timeAxisEl = doc.querySelector('.b-grid-header-scroller-normal'),
          // header element might be moved outside of export body box with margin
      // and we only need left/right coordinates
      tmpBox = rectangle.from(timeAxisEl),
          headerBox = new rectangle(tmpBox.x, exportBodyBox.y, tmpBox.width, tmpBox.height).intersect(exportBodyBox),
          ticks = Array.from(headerEl.querySelectorAll('.b-sch-header-timeaxis-cell'));
      var firstTick, lastTick; // Sort elements by tick index

      ticks.sort(function (el1, el2) {
        var index1 = parseInt(el1.dataset.tickIndex);
        var index2 = parseInt(el2.dataset.tickIndex);
        return index1 - index2;
      }); // in IE11 we cannot use getElementFromPoint, so instead we iterate over all tick elements and check
      // if we can find first/last visible

      ticks.forEach(function (tickEl) {
        var tickBox = rectangle.from(tickEl);

        if (!firstTick) {
          if (tickBox.left <= headerBox.left && Math.round(tickBox.right) > Math.round(headerBox.left)) {
            firstTick = tickEl;
          }
        }

        if (!lastTick) {
          if (tickBox.left < headerBox.right && Math.round(tickBox.right) >= Math.round(headerBox.right)) {
            lastTick = tickEl;
          }
        }
      });
      return {
        firstTick: firstTick,
        lastTick: lastTick
      };
    },
    // In order to work this requires `window.DEBUG = true;` to be set in the `StartTest` method
    getDateRangeFromExportedPage: function getDateRangeFromExportedPage(doc) {
      var visible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var rectangle = this.global.Rectangle,
          exportBodyEl = doc.querySelector('.b-export-body'),
          exportBodyBox = rectangle.from(exportBodyEl),
          headerEl = doc.querySelector('.b-sch-timeaxiscolumn'),
          schedulerHeader = doc.querySelector('.b-schedulerheader'),
          // header element might be moved outside of export body box with margin
      // and we only need left/right coordinates
      tmpBox = rectangle.from(visible ? schedulerHeader : headerEl),
          headerBox = new rectangle(tmpBox.x, exportBodyBox.y, tmpBox.width, tmpBox.height).intersect(exportBodyBox),
          bottomHeaderEl = doc.querySelector('.b-sch-header-row.b-lowest '),
          ticks = Array.from(bottomHeaderEl.querySelectorAll('.b-sch-header-timeaxis-cell'));
      var firstTick, lastTick; // Sort elements by tick index

      ticks.sort(function (el1, el2) {
        var index1 = parseInt(el1.dataset.tickIndex);
        var index2 = parseInt(el2.dataset.tickIndex);
        return index1 - index2;
      });
      ticks.forEach(function (tickEl, index) {
        var tickBox = rectangle.from(tickEl);

        if (!firstTick && Math.round(tickBox.right) > Math.round(headerBox.left)) {
          firstTick = tickEl;
        }

        if (!lastTick) {
          if (index === ticks.length - 1 || Math.round(tickBox.right) >= Math.round(headerBox.right)) {
            lastTick = tickEl;
          }
        }
      });
      var startDate = new this.global.Date(parseInt(firstTick.dataset.date)),
          endDate = new this.global.Date(parseInt(lastTick.dataset.date));
      return {
        startDate: startDate,
        endDate: endDate
      };
    },
    assertTicksExportedWithoutGaps: function assertTicksExportedWithoutGaps(doc) {
      var _this4 = this;

      var rectangle = this.global.Rectangle,
          headerRows = Array.from(doc.querySelectorAll('.b-sch-header-row')),
          headerEls = Array.from(doc.querySelectorAll('.b-sch-header-row'));
      var pass = true;
      headerRows.forEach(function (headerRow) {
        var position = headerRow.dataset.headerPosition,
            tickEls = Array.from(headerRow.querySelectorAll('.b-sch-header-timeaxis-cell'));
        var prevRight, prevTickIndex; // Sort elements by tick index

        tickEls.sort(function (el1, el2) {
          var index1 = parseInt(el1.dataset.tickIndex);
          var index2 = parseInt(el2.dataset.tickIndex);

          if (index1 < index2) {
            return -1;
          } else if (index1 === index2) {
            return 0;
          } else {
            return 1;
          }
        });
        tickEls.forEach(function (tickEl, index) {
          var elBox = rectangle.from(tickEl),
              tickIndex = parseInt(tickEl.dataset.tickIndex);

          if (index === 0) {
            prevRight = elBox.right;
            prevTickIndex = tickIndex;
          } else {
            if (Math.abs(tickEl.left - prevRight) > 1) {
              _this4.fail("Tick ".concat(index, " in header ").concat(position, " is not aligned with previous one"), {
                got: elBox.left,
                need: prevRight
              });

              pass = false;
            }

            if (tickIndex !== prevTickIndex + 1) {
              _this4.fail("Unexpected tick index in header ".concat(position, ", got ").concat(tickIndex, " need ").concat(prevTickIndex + 1));

              pass = false;
            }

            prevRight = tickEl.left;
            prevTickIndex = tickIndex;
          }
        });
      });
      headerEls.forEach(function (headerEl) {
        var position = headerEl.dataset.headerPosition,
            _this4$getFirstLastVi = _this4.getFirstLastVisibleTicks(doc, headerEl),
            firstTick = _this4$getFirstLastVi.firstTick,
            lastTick = _this4$getFirstLastVi.lastTick;

        if (!firstTick) {
          _this4.fail("Time axis cell element wasn't found at the beginning of header ".concat(position));

          pass = false;
        }

        if (!lastTick) {
          _this4.fail("Time axis cell element wasn't found at the end of header ".concat(position));

          pass = false;
        }
      });
      return pass;
    },
    isExportedTickCount: function isExportedTickCount(doc, count) {
      this.is(doc.querySelectorAll('.b-lowest .b-sch-header-timeaxis-cell').length, count, 'Ticks count is ok');
    },
    assertExportedEventsList: function assertExportedEventsList(doc) {
      var _this5 = this;

      var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var rectangle = this.global.Rectangle,
          exportBodyEl = doc.querySelector(this.bowser.msie ? '.b-export-viewport' : '.b-export-body'),
          exportBodyBox = rectangle.from(exportBodyEl);
      var pass = true;
      events.forEach(function (event) {
        var eventElement = doc.querySelector("[data-event-id=\"".concat(event.id, "\"]"));

        if (!eventElement) {
          _this5.fail("Element is not found for event ".concat(event.id));

          pass = false;
        } else {
          var eventBox = rectangle.from(eventElement);

          if (!eventBox.intersect(exportBodyBox)) {
            _this5.fail("Event ".concat(event.id, " is not visible in the current view"), {
              got: eventBox,
              need: exportBodyBox,
              gotDesc: 'Event rectangle',
              needDesc: 'Body rectangle'
            });

            pass = false;
          }

          var resourceEl = doc.querySelector(".b-timeline-subgrid .b-grid-row[data-id=\"".concat(event.resourceId, "\"]")),
              resourceBox = rectangle.from(resourceEl);

          if (resourceBox.intersect(eventBox).height !== eventBox.height) {
            _this5.fail("Event ".concat(event.id, " is not aligned to its resource ").concat(event.resourceId), {
              got: eventBox,
              need: resourceBox,
              gotDesc: 'Event rectangle',
              needDesc: 'Resource rectangle'
            });
          }
        }
      });
      return pass;
    },
    assertExportedEventDependenciesList: function assertExportedEventDependenciesList(doc) {
      var _this6 = this;

      var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var arrowMargin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;
      var pass = true;

      function getPointFromBox(el, side) {
        var adjustLeft = 0,
            adjustRight = 0,
            box = el.getBoundingClientRect();
        var fromPoint;

        switch (side) {
          case 'top':
            fromPoint = [box.left + box.width / 2, box.top];
            break;

          case 'bottom':
            fromPoint = [box.left + box.width / 2, box.bottom];
            break;

          case 'left':
            fromPoint = [box.left - adjustLeft, box.top + box.height / 2];
            break;

          case 'right':
            fromPoint = [box.right + adjustRight, box.top + box.height / 2];
            break;
        }

        return fromPoint;
      }

      function getFromSide(dependency) {
        return dependency.fromSide || (dependency.type < 2 ? 'left' : 'right');
      }

      function getToSide(dependency) {
        return dependency.toSide || (dependency.type % 2 ? 'right' : 'left');
      }

      function getDependencyCoordinates(dependency, dependencyEl, fromEl, toEl, scale) {
        var svgBox = dependencyEl.ownerSVGElement.getBoundingClientRect(),
            dependencyPoints = dependencyEl.getAttribute('points').split(' '),
            depStartPoint = dependencyPoints[0].split(',').map(function (item) {
          return parseInt(item);
        }),
            depEndPoint = dependencyPoints[dependencyPoints.length - 1].split(',').map(function (item) {
          return parseInt(item);
        }),
            depFromPoint = [depStartPoint[0] * scale + svgBox.left, depStartPoint[1] * scale + svgBox.top],
            depToPoint = [depEndPoint[0] * scale + svgBox.left, depEndPoint[1] * scale + svgBox.top],
            fromPoint = fromEl && getPointFromBox(fromEl, getFromSide(dependency), fromEl.classList.contains('b-milestone-wrap')),
            toPoint = toEl && getPointFromBox(toEl, getToSide(dependency), toEl.classList.contains('b-milestone-wrap'));
        return {
          depFromPoint: depFromPoint,
          depToPoint: depToPoint,
          fromPoint: fromPoint,
          toPoint: toPoint
        };
      }

      function getScale(el) {
        return el.getBoundingClientRect().width / el.offsetWidth;
      }

      dependencies.forEach(function (dep) {
        // Firefox is case sensitive, has to be `depid` not `depId`
        var depElement = doc.querySelector("[depid=\"".concat(dep.id, "\"]"));

        if (!depElement) {
          _this6.fail("Element is not found for dependency ".concat(dep.id));

          pass = false;
        } else {
          var sourceEl = doc.querySelector("[data-event-id=\"".concat(dep.from, "\"]")),
              targetEl = doc.querySelector("[data-event-id=\"".concat(dep.to, "\"]")),
              scale = getScale(sourceEl || targetEl);

          var _getDependencyCoordin = getDependencyCoordinates(dep, depElement, sourceEl, targetEl, scale),
              depFromPoint = _getDependencyCoordin.depFromPoint,
              depToPoint = _getDependencyCoordin.depToPoint,
              fromPoint = _getDependencyCoordin.fromPoint,
              toPoint = _getDependencyCoordin.toPoint;

          if (fromPoint) {
            if (Math.abs(depFromPoint[0] - fromPoint[0]) > 1) {
              _this6.fail("Dependency ".concat(dep.id, " start point x is ok"), {
                got: depFromPoint[0],
                need: fromPoint[0]
              });

              pass = false;
            }

            if (Math.abs(depFromPoint[1] - fromPoint[1]) > 1) {
              _this6.fail("Dependency ".concat(dep.id, " start point y is ok"), {
                got: depFromPoint[1],
                need: fromPoint[1]
              });

              pass = false;
            }
          }

          if (toPoint) {
            if (Math.abs(depToPoint[0] - toPoint[0]) > 1) {
              _this6.fail("Dependency ".concat(dep.id, " end point x is ok"), {
                got: depToPoint[0],
                need: toPoint[0]
              });

              pass = false;
            }

            if (Math.abs(depToPoint[1] - toPoint[1]) > 1) {
              _this6.fail("Dependency ".concat(dep.id, " end point y is ok"), {
                got: depToPoint[1],
                need: toPoint[1]
              });

              pass = false;
            }
          }
        }
      });
      return pass;
    } //endregion

  }
}); // Override so that when we run grid tests over here in Scheduler, we run them on an instance of Scheduler

var getScheduler = BryntumSchedulerTest.prototype.getScheduler; // eslint-disable-line no-undef

BryntumSchedulerTest.prototype._getGrid = BryntumGridTest.prototype.getGrid; // eslint-disable-line no-undef

BryntumSchedulerTest.prototype.getGrid = function (cfg) {
  // eslint-disable-line no-undef
  if (!cfg.appendTo) {
    cfg.appendTo = this.scopeProvider.iframe.contentDocument.body;
  }

  return getScheduler.call(this, cfg);
};