function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams = function parseParams(paramString) {
  var result = {},
      params = paramString ? paramString.split('&') : []; // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
  // So we cannot use .split('='). Using forEach instead of for...of for IE

  params.forEach(function (nameValuePair) {
    var _paramValueRegExp$exe = paramValueRegExp.exec(nameValuePair),
        _paramValueRegExp$exe2 = _slicedToArray(_paramValueRegExp$exe, 3),
        match = _paramValueRegExp$exe2[0],
        name = _paramValueRegExp$exe2[1],
        value = _paramValueRegExp$exe2[2],
        decodedName = decodeURIComponent(name),
        decodedValue = decodeURIComponent(value);

    if (match) {
      var paramValue = result[decodedName];

      if (paramValue) {
        if (!Array.isArray(paramValue)) {
          paramValue = result[decodedName] = [paramValue];
        }

        paramValue.push(decodedValue);
      } else {
        result[decodedName] = decodedValue;
      }
    }
  });
  return result;
};

Class('BryntumCoreTest', {
  isa: Siesta.Test.Browser,
  has: {
    waitForScrolling: true,
    applyTestConfigs: true
  },
  override: {
    setup: function setup(callback, errback) {
      var me = this,
          isTeamCity = location.search.includes('IS_TEAMCITY'),
          allowedMessageRe = /promise rejection/,
          harness = me.harness,
          global = me.global,
          b = global.bryntum,
          ns = b && (b.core || b.grid || b.scheduler || b.schedulerpro || b.gantt); // running with bundle, but tests are written for import. need to publish all classes to global

      if (ns) {
        // If there's no UI, disable creation of debugging data by Base constructor
        if (!window.Ext) {
          global.bryntum.DISABLE_DEBUG = true;
        }

        for (var className in ns) {
          if (!global[className]) global[className] = ns[className];
        }
      }

      if (!harness.getDescriptorConfig(harness.getScriptDescriptor(me), 'usesConsole')) {
        console.clear(); // Allow no noise in the console

        ['error', 'warn', 'log', 'info'].forEach(function (level) {
          global.console[level] = function () {
            var _console;

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (!allowedMessageRe.exec(args[0])) {
              me.fail(['console output: '].concat(args).join(''));
            }

            (_console = console)[level].apply(_console, args);
          };

          global.console[level].direct = function () {
            var _console2;

            return (_console2 = console)[level].apply(_console2, arguments);
          };
        });
      }

      var testDescriptor = harness.getScriptDescriptor(me); // Allow tests to modify configuration of class instances

      global.__applyTestConfigs = 'applyTestConfigs' in testDescriptor ? testDescriptor.applyTestConfigs : me.applyTestConfigs;

      if (isTeamCity && harness.isRerunningFailedTests) {
        me.startVideoRecording(callback);
      } else {
        me.SUPER(callback, errback);
      }

      if (global && global.DOMRect) {
        Object.defineProperty(global.DOMRect.prototype, 'x', {
          get: function get() {
            return me.fail('x property accessed from a DOMRect');
          }
        });
        Object.defineProperty(global.DOMRect.prototype, 'y', {
          get: function get() {
            return me.fail('y property accessed from a DOMRect');
          }
        });
      }
    },
    it: function it(name, callback) {
      if (name.startsWith('TOUCH:') && (!window.Touch || !window.TouchEvent)) {
        arguments[1] = function (t) {
          t.diag('Test skipped for non-touch browsers');
        };
      }

      return this.SUPERARG(arguments);
    },
    launchSpecs: function launchSpecs() {
      var me = this,
          beforeEach = me.beforeEachHooks[0]; // If beforeEach inside the test doesn't create new instances, let's wait for any timeouts to complete before starting new t.it

      if (!beforeEach || !beforeEach.code.toString().match('new ')) {
        me.beforeEach(function (t, callback) {
          return me.verifyNoTimeoutsBeforeSubTest(t, callback);
        });
      }

      return me.SUPERARG(arguments);
    },
    earlySetup: function earlySetup(callback, errback) {
      var me = this,
          testDescriptor = me.harness.getScriptDescriptor(me.url),
          earlySetup = testDescriptor.earlySetup; // if we have a URL to load early before the test gets started

      if (earlySetup) {
        var SUPER = me.SUPER,
            args = arguments; // request earlySetup.url before running the test

        fetch(earlySetup.url).then(function (response) {
          earlySetup.callback(response, testDescriptor, me, function () {
            return SUPER.apply(me, args);
          });
        }).catch(function () {
          return errback("Requesting ".concat(earlySetup.url, " failed"));
        });
      } else {
        me.SUPER(callback, errback);
      }
    },
    onTearDown: function onTearDown(fn) {
      this._tearDownHook = fn;
    },
    tearDown: function tearDown(callback, errback) {
      var me = this,
          testDescriptor = me.harness.getScriptDescriptor(me.url),
          tearDown = testDescriptor.tearDown,
          SUPER = me.SUPER,
          args = arguments;

      if (me.isFailed() && me.rootCause && me.rootCause.nbrFramesRecorded > 3) {
        var failedAssertions = me.getFailedAssertions(),
            failMsg = failedAssertions[0] && (failedAssertions[0].description || failedAssertions[0].annotation),
            err = new Error(me.name + ' - ' + (failMsg || ''));
        me.rootCause.finalizeSiestaTestCallback = callback;
        me.rootCause.logException(err);
      } else if (me._tearDownHook) {
        me._tearDownHook(function () {
          return SUPER.apply(me, args);
        });
      } // if we have a URL to load after the test finishes
      else if (tearDown) {
          // request tearDown.url after the test completion
          fetch(tearDown.url).then(function (response) {
            tearDown.callback(response, testDescriptor, me, function () {
              return SUPER.apply(me, args);
            });
          }).catch(function () {
            return errback("Requesting ".concat(tearDown.url, " failed"));
          });
        } else {
          me.SUPERARG(args);
        }
    },
    // Ensure we don't start next t.it if there are active timeouts
    verifyNoTimeoutsBeforeSubTest: function verifyNoTimeoutsBeforeSubTest(test, callback) {
      var me = this;

      if (!me.harness.getScriptDescriptor(me).disableNoTimeoutsCheck) {
        var pollCount = 0;

        var bryntum = me.global && me.global.bryntum,
            poll = function poll() {
          if (!bryntum || !bryntum.globalDelays || bryntum.globalDelays.isEmpty()) {
            callback();
          } else {
            me.global && me.global.setTimeout(poll, pollCount ? 50 : 0);
            pollCount++;
          }
        };

        poll();
      } else {
        callback();
      }
    } // Do not remove, handy for finding "leaking" timers
    // launchSubTest(subTest, callback) {
    //     if (this.global.bryntum && this.global.bryntum.globalDelays && !this.global.bryntum.globalDelays.isEmpty()) {
    //         debugger;
    //         this.fail('Active timeouts found');
    //     }
    //     this.SUPERARG(arguments);
    // }

  },
  methods: {
    initialize: function initialize() {
      this.SUPERARG(arguments);
      this.on('beforetestfinalizeearly', this.performPostTestSanityChecks);
    },
    // Fail tests in automation containing iit()
    iit: function iit(descr) {
      if (this.project.isAutomated && location.host !== 'lh') {
        this.fail('No iit allowed in automation mode - t.iit: ' + descr);
      }

      return this.SUPERARG(arguments);
    },
    performPostTestSanityChecks: function performPostTestSanityChecks(evt, t) {
      if (!this.parent && !this.url.match(/docs\//)) {
        this.assertNoDomGarbage(t);
        this.assertNoResizeMonitors();
      }
    },
    delayedTouchDragBy: function delayedTouchDragBy(target, delta) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.touchStart(target);

              case 2:
                _context.next = 4;
                return _this.waitForTouchTimeoutToExpire();

              case 4:
                _context.next = 6;
                return _this.movePointerBy(delta);

              case 6:
                _this.touchEnd();

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    delayedTouchDragTo: function delayedTouchDragTo(source, target) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this2.touchStart(source);

              case 2:
                _context2.next = 4;
                return _this2.waitForTouchTimeoutToExpire();

              case 4:
                _context2.next = 6;
                return _this2.movePointerTo(target);

              case 6:
                _this2.touchEnd();

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    waitForTouchTimeoutToExpire: function waitForTouchTimeoutToExpire() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var delays;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                delays = _this3.global.bryntum.globalDelays;
                return _context3.abrupt("return", _this3.waitFor(function () {
                  var foundTimeout;
                  delays.timeouts.forEach(function (o) {
                    if (o.name === 'touchStartDelay') {
                      foundTimeout = true;
                    }
                  });
                  return !foundTimeout;
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    isOnline: function isOnline() {
      return window.location.href.match(/bryntum\.com/i);
    },
    addListenerToObservable: function addListenerToObservable(observable, event, listener, isSingle) {
      if ('on' in observable) {
        observable.on(event, listener);
      } else if ('addEventListener' in observable) {
        observable.addEventListener(event, listener);
      }
    },
    removeListenerFromObservable: function removeListenerFromObservable(observable, event, listener) {
      // Observable might be destroyed way before test is finalized. In that case it won't have `un` method
      // t.firesOnce(popup, 'beforehide');
      // t.firesOnce(popup, 'hide');
      // popup.destroy();
      if (observable && observable.un) {
        observable.un(event, listener);
      }
    },
    getTimeZone: function getTimeZone() {
      var Date = this.global.Date,
          date = new Date();
      return date.toLocaleString().replace(/.*(GMT.*)/, '$1');
    },
    getDSTDates: function getDSTDates() {
      var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2012;
      var Date = this.global.Date,
          yearStart = new Date(year, 0, 1),
          yearEnd = new Date(year, 11, 31),
          dstDates = [];

      for (var i = yearStart; i <= yearEnd; i = new Date(i.setDate(i.getDate() + 1))) {
        var midnightOffset = new Date(year, i.getMonth(), i.getDate()).getTimezoneOffset(),
            noonOffset = new Date(year, i.getMonth(), i.getDate(), 12).getTimezoneOffset();
        if (midnightOffset != noonOffset) dstDates.push(i);
      }

      return dstDates;
    },
    assertNoDomGarbage: function assertNoDomGarbage(t) {
      var me = this,
          body = me.global.document.body,
          invalid = ['[id*="undefined"]', '[id*="null"]', '[class*="undefined"]', '[class*="null"]', '[class*="null"]']; // Data URL can violate the check for NaN in some cases
      // Array.from() used for IE11 compatibility

      Array.from(body.querySelectorAll('.b-sch-background-canvas')).forEach(function (e) {
        return e.remove();
      });
      me.contentNotLike(body, 'NaN', 'No "NaN" string found in DOM');
      me.contentNotLike(body, ' id=""', 'No empty id found in DOM');
      me.contentNotLike(body, /L{.*?}/, 'No non-localized string templates L{xx}');

      if (!t.skipSanityChecks) {
        // Remove embedded JS code blocks like `href="data:text/javascript;..."` or `<code>...</code>` from checking
        var outerHTML = body.outerHTML.replace(/href="data:text\/javascript[\s\S]*?"/gm, '').replace(/<code[\s\S]*?<\/code>/gm, '');
        me.unlike(outerHTML, /object object|undefined/i, 'No "Object object" or undefined string found in DOM');

        if (me.global.monkeyActions && outerHTML.match(/object object|undefined/i)) {
          me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
        }
      }

      if (me.$(invalid.join(','), body).length) {
        me.selectorNotExists(invalid, 'No DOM attribute garbage found in DOM');

        if (me.global.monkeyActions && body.querySelector(invalid)) {
          me.fail('Monkey steps:' + JSON.stringify(me.global.monkeyActions));
        }
      }
    },
    assertNoResizeMonitors: function assertNoResizeMonitors() {
      var _this4 = this;

      Array.from(document.querySelectorAll('*')).forEach(function (e) {
        if (e._bResizemonitor && e._bResizemonitor.handlers.length) {
          _this4.fail("".concat(e.tagName, "#e.id has ").concat(e._bResizemonitor.handlers.length, " resize monitors attached"));
        }
      });
    },
    // Never start an action is animations or scrolling is ongoing
    waitForAnimations: function waitForAnimations(callback) {
      this.waitForSelectorNotFound(".b-animating,.b-aborting".concat(this.waitForScrolling ? ',.b-scrolling' : ''), callback);
    },
    waitForAnimationFrame: function waitForAnimationFrame(next) {
      var frameFired = false;
      this.waitFor(function () {
        return frameFired;
      }, next);
      requestAnimationFrame(function () {
        frameFired = true;
      });
    },
    // Allows `await t.animationFrame`
    animationFrame: function animationFrame() {
      var frames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var global = this.global;
      var count = 0,
          resolveFn;

      function frame() {
        if (count++ < frames) {
          global.requestAnimationFrame(function () {
            return frame();
          });
        } else {
          resolveFn();
        }
      }

      return new Promise(function (resolve) {
        resolveFn = resolve;
        frame();
      });
    },
    waitForAsync: function waitForAsync(fn) {
      var _this5 = this;

      return new Promise(function (resolve) {
        return _this5.waitFor(fn, resolve);
      });
    },

    /**
     * Registers the passed URL to return the passed mocked up Fetch Response object to the
     * AjaxHelper's promise resolve function.
     * @param {String} url The url to return mock data for
     * @param {Object|Function} response A mocked up Fetch Response object which must contain
     * at least a `responseText` property, or a function to which the `url` and a `params` object
     * is passed which returns that.
     * @param {String} response.responseText The data to return.
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
     */
    mockUrl: function mockUrl(url, response) {
      var me = this,
          AjaxHelper = me.global.AjaxHelper;

      if (!AjaxHelper) {
        throw new Error('AjaxHelper must be injected into the global namespace');
      }

      (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response; // Inject the override into the AjaxHelper instance

      if (!AjaxHelper.originalFetch) {
        // cannot use Reflect in IE11
        //Reflect.set(AjaxHelper, 'originalFetch', AjaxHelper.fetch);
        //Reflect.set(AjaxHelper, 'fetxh', Test.mockAjaxFetch.bind(Test));
        AjaxHelper.originalFetch = AjaxHelper.fetch;
      }

      AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
    },
    mockAjaxFetch: function mockAjaxFetch(url, options) {
      var urlAndParams = url.split('?'),
          win = this.global;
      var result = this.mockAjaxMap[urlAndParams[0]],
          parsedJson = null;

      if (result) {
        if (typeof result === 'function') {
          result = result(urlAndParams[0], parseParams(urlAndParams[1]), options);
        }

        try {
          parsedJson = options.parseJson && JSON.parse(result.responseText);
        } catch (error) {
          parsedJson = null;
          result.error = error;
        }

        result = win.Object.assign({
          status: 200,
          ok: true,
          headers: new win.Headers(),
          statusText: 'OK',
          url: url,
          parsedJson: parsedJson,
          text: function text() {
            return new Promise(function (resolve) {
              resolve(result.responseText);
            });
          },
          json: function json() {
            return new Promise(function (resolve) {
              resolve(parsedJson);
            });
          }
        }, result);
        return new win.Promise(function (resolve, reject) {
          if (result.synchronous) {
            result.rejectPromise ? reject('Promise rejected!') : resolve(result);
          } else {
            win.setTimeout(function () {
              result.rejectPromise ? reject('Promise rejected!') : resolve(result);
            }, 'delay' in result ? result.delay : 100);
          }
        });
      } else {
        return win.AjaxHelper.originalFetch(url, options);
      }
    },

    /**
     * Deregisters the passed URL from the mocked URL map
     */
    unmockUrl: function unmockUrl(url) {
      if (this.mockAjaxMap) {
        delete this.mockAjaxMap[url];
      }
    },
    isRectApproxEqual: function isRectApproxEqual(rect1, rect2, threshold, descr) {
      for (var o in rect1) {
        this.isApprox(rect1[o], rect2[o], threshold, descr || '');
      }
    },
    // t.isCssTextEqual(element, 'position: absolute; color: blue;')
    isCssTextEqual: function isCssTextEqual(src, cssText, desc) {
      if (src instanceof this.global.HTMLElement) {
        src = src.style.cssText;
      }

      if (src === cssText) {
        this.pass(desc || 'Style matches');
      } else {
        var srcParts = src.split(';').map(function (p) {
          return p.trim();
        }),
            targetParts = cssText.split(';').map(function (p) {
          return p.trim();
        });
        srcParts.sort();
        targetParts.sort();
        this.isDeeply(srcParts, targetParts);
      }
    },
    startVideoRecording: function startVideoRecording(callback) {
      var me = this,
          document = me.global.document,
          script = document.createElement('script');
      script.crossOrigin = 'anonymous';
      script.src = 'https://app.therootcause.io/rootcause-full.js';
      script.addEventListener('load', startRootCause);
      script.addEventListener('error', callback);
      document.head.appendChild(script);

      function startRootCause() {
        me.on('testupdate', me.onTestUpdate, me);
        me.rootCause = new me.global.RC.Logger({
          nbrFramesRecorded: 0,
          captureScreenshot: false,
          applicationId: '2709a8dbc83ccd7c7dd07f79b92b5f3a90182f93',
          maxNbrLogs: 1,
          recordSessionVideo: true,
          videoBaseUrl: me.global.location.href.replace(me.global.location.host, 'qa.bryntum.com'),
          logToConsole: function logToConsole() {},
          // Ignore fails in non-DOM tests which should never be flaky, and video won't help
          processVideoFrameFn: function processVideoFrameFn(frame) {
            // enum VideoRecordingMessage {
            //     setBaseUrl,
            //     applyDomSnapshot,
            //     applyPointerPosition,
            //     applyPointerState,
            //     applyElementValueChange,
            //     applyElementCheckedChange,
            //     applyWindowResize,
            //     applyDomScroll,
            //     applyDomMutation
            // }
            // Ignore initial video snapshot frames
            if (frame && frame[0] > 1) {
              this.nbrFramesRecorded++;
            }
          },
          onErrorLogged: function onErrorLogged(responseText) {
            var data;

            try {
              data = JSON.parse(responseText);
            } catch (e) {}

            if (data && data.id) {
              me.fail("[video=".concat(data.id, "]"));
            }

            this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
          },
          onErrorLogFailed: function onErrorLogFailed() {
            this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
          }
        });

        if (me.rootCause.socket && me.rootCause.socket.readyState === WebSocket.OPEN) {
          callback.call(me);
        } else {
          me.rootCause.socket.addEventListener('open', callback.bind(me));
        }
      }
    },
    onTestUpdate: function onTestUpdate(event, test, result) {
      if (typeof result.passed === 'boolean') {
        this.rootCause.addLogEntry({
          type: result.passed ? 'pass' : 'fail',
          glyph: result.passed ? 'check' : 'times',
          message: (result.description || '') + (result.annotation ? result.annotation + ' \nresult.annotation' : '')
        });
      }
    },
    handlerThrowsOk: function handlerThrowsOk(fn) {
      var me = this,
          oldOnError = me.global.onerror;
      var success = false,
          doneCalled = false;

      var done = function done() {
        if (!doneCalled) {
          doneCalled = true;
          me.global.onerror = oldOnError;

          if (success) {
            me.pass('Expected error was thrown');
          } else {
            me.fail('Expected error was not thrown');
          }

          me.endAsync(async);
        }
      };

      me.global.onerror = function (ex) {
        success = true;
        done();
        return true;
      };

      var async = me.beginAsync(); // We must return the destroy method first in case the
      // passed method is not in fact async.

      setTimeout(fn, 0);
      return done;
    },
    removeIframe: function removeIframe(iframeId) {
      var t = this,
          _document = t.global.document,
          iframe = _document.getElementById(iframeId);

      if (iframe) {
        iframe.parentElement.removeChild(iframe);
      } else {
        t.fail('Cannot find iframe with id ' + iframeId);
      }
    },
    setIframeUrl: function setIframeUrl(iframe, url, callback) {
      var _this6 = this;

      var async = this.beginAsync(),
          doc = iframe.contentDocument;

      iframe.onload = function () {
        _this6.endAsync(async);

        iframe.onload = undefined;
        callback();
      };

      if (url && doc.location !== url) {
        doc.location = url;
      } else {
        doc.location.reload();
      }
    },
    setIframe: function setIframe(config) {
      config = config || {};

      var t = this,
          id = config.iframeId || config.id,
          _config = config,
          onload = _config.onload,
          html = _config.html,
          _config$height = _config.height,
          height = _config$height === void 0 ? 1600 : _config$height,
          _config$width = _config.width,
          width = _config$width === void 0 ? 900 : _config$width,
          _document = t.global.document,
          iframe = _document.body.appendChild(_document.createElement('iframe'));

      var async = config.async;
      iframe.width = width;
      iframe.height = height;

      if (id) {
        iframe.setAttribute('id', id);
      }

      var doc = iframe.contentWindow.document;

      if (onload) {
        async = async || t.beginAsync();

        iframe.onload = function () {
          t.endAsync(async);
          onload(doc, iframe);
        };
      }

      if (html) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      return iframe;
    },
    setIframeAsync: function setIframeAsync(config) {
      var _this7 = this;

      return new this.global.Promise(function (resolve) {
        _this7.setIframe(_this7.global.Object.assign(config, {
          onload: function onload(document, iframe) {
            resolve({
              document: document,
              iframe: iframe
            });
          }
        }));
      });
    },
    scrollIntoView: function scrollIntoView(selector, callback) {
      this.global.document.querySelector(selector).scrollIntoView();
      callback && callback();
    },
    getSVGBox: function getSVGBox(svgElement) {
      var svgBox = svgElement.getBBox(),
          containerBox = svgElement.viewportElement.getBoundingClientRect();
      return {
        left: svgBox.x + containerBox.left,
        right: svgBox.x + containerBox.left + svgBox.width,
        top: svgBox.y + containerBox.top,
        bottom: svgBox.y + containerBox.top + svgBox.height
      };
    },
    samePx: function samePx(value, compareWith) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return Math.abs(value - compareWith) <= threshold * (window.devicePixelRatio || 1);
    },
    sameRect: function sameRect(rect1, rect2) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements
      return this.samePx(rect1.top, rect2.top, threshold) && this.samePx(rect1.left, rect2.left, threshold) && this.samePx(rect1.width, rect2.width, threshold) && this.samePx(rect1.height, rect2.height, threshold);
    },
    isApproxPx: function isApproxPx(value, compareWith) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var desc = arguments.length > 3 ? arguments[3] : undefined;

      if (typeof threshold === 'string') {
        desc = threshold;
        threshold = 1;
      } // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements


      this.isApprox(value, compareWith, threshold * (window.devicePixelRatio || 1), desc);
    },
    isApproxRect: function isApproxRect(rect1, rect2) {
      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var desc = arguments.length > 3 ? arguments[3] : undefined;
      this.isApproxPx(rect1.top, rect2.top, threshold, "".concat(desc, " top value"));
      this.isApproxPx(rect1.left, rect2.left, threshold, "".concat(desc, " left value"));
      this.isApproxPx(rect1.width, rect2.width, threshold, "".concat(desc, " width value"));
      this.isApproxPx(rect1.height, rect2.height, threshold, "".concat(desc, " height value"));
    },
    elementToObject: function elementToObject(element) {
      if (element instanceof this.global.HTMLElement) {
        var result = {
          children: []
        },
            attributes = element.attributes,
            children = element.children;

        for (var i = 0, l = attributes.length; i < l; i++) {
          var attr = attributes[i];

          if (typeof attr.value === 'string') {
            if (attr.value.length > 0) {
              result[attr.name] = attr.value;
            }
          } else {
            result[attr.name] = attr.value;
          }
        }

        for (var _i2 = 0, _l = children.length; _i2 < _l; _i2++) {
          result.children.push(this.elementToObject(children[_i2]));
        }

        return result;
      }
    },
    smartMonkeys: function smartMonkeys(description) {
      var buttons = this.global.document.querySelectorAll('.demo-header button:not(#fullscreen-button)');

      if (buttons.length > 0) {
        // Array.from() used for IE11 compatibility. Extra fullscreen check for framework buttons
        Array.from(buttons).forEach(function (button) {
          return !button.disabled && !button.querySelector('.b-icon-fullscreen') && button.click();
        });
        this.pass(description || 'Smart monkeys clicking around did not produce errors');
      }
    },
    query: function query(selector, root) {
      var me = this;
      selector = selector.trim(); // Handle potential nested iframes

      root = root || me.getNestedRoot(selector);
      selector = selector.split('->').pop().trim();

      if (selector.match(/=>/)) {
        var bryntum = me.getGlobal(root).bryntum,
            parts = selector.split('=>'),
            cssSelector = parts.pop().trim(),
            bryntumSelector = parts[0].trim(),
            widgets = bryntum.queryAll(bryntumSelector);
        return widgets.map(function (widget) {
          return me.query(cssSelector, widget.element)[0];
        }).filter(function (result) {
          return Boolean(result);
        });
      } else if (selector.match(/\s*>>/)) {
        var _bryntum = me.getGlobal(root).bryntum;
        return _bryntum.queryAll(selector.substr(2)).map(function (widget) {
          return widget.element;
        });
      }

      return me.SUPERARG([selector, root]);
    },
    setRandomPHPSession: function setRandomPHPSession() {
      // Sets random cookie session ID per test
      var rndStr = Math.random().toString(16).substring(2),
          cookie = "".concat(this.url, " ").concat(rndStr).replace(/[ .\\/&?=]/gm, '-').toLowerCase();
      this.diag("PHPSESSID: ".concat(cookie));
      this.global.document.cookie = "PHPSESSID=".concat(cookie);
    },
    rect: function rect(selectorOrEl) {
      return this.normalizeElement(selectorOrEl).getBoundingClientRect();
    }
  }
}); // eslint-disable-next-line no-unused-vars

var BryntumTestHelper = /*#__PURE__*/function () {
  function BryntumTestHelper() {
    _classCallCheck(this, BryntumTestHelper);
  }

  _createClass(BryntumTestHelper, null, [{
    key: "prepareMonkeyTests",
    value: function prepareMonkeyTests(items) {
      var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var mode = arguments.length > 2 ? arguments[2] : undefined;
      var urls = [];
      return items.map(function (item) {
        if (item && item.skipMonkey !== true) {
          // Append ../examples to the string item if it doesn't start with it (to simplify configs)
          var cfg = Object.assign({}, item instanceof Object ? item : {
            pageUrl: "".concat(!item.startsWith('../examples') ? '../examples/' : '').concat(item)
          });

          if (cfg.pageUrl) {
            if (!cfg.keepPageUrl && ['umd', 'module'].includes(mode)) {
              var parts = cfg.pageUrl.split('?');
              cfg.pageUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + "index.".concat(mode, ".html?") + (parts[1] || '');
            } // Prepare url-friendly id


            var id = cfg.pageUrl.replace(/\.+\//g, '').replace(/[?&./]/g, '-').replace('--', '-');
            cfg.isMonkey = true;
            cfg.keepPageUrl = true;
            cfg.url = "".concat(root, "examples/monkey.t.js?id=").concat(id, "&monkey"); // Avoid duplicates

            if (!urls.includes(cfg.url)) {
              urls.push(cfg.url);
              return cfg;
            }
          }
        }
      });
    }
  }, {
    key: "updateTitle",
    value: function updateTitle(item, testUrl) {
      // Split testUrl to display in tree grid
      if (testUrl && typeof URL === 'function') {
        var url = new URL("http://bryntum.com/".concat(testUrl)),
            pathName = url.pathname,
            idx = pathName.lastIndexOf('/'),
            testName = pathName.substring(idx + 1),
            testPath = !item.isMonkey ? pathName.substring(1, idx) : item.pageUrl;
        item.title = "".concat(testName).concat(url.search, " ").concat(testPath !== '' ? "[ ".concat(testPath, " ]") : '');
      }
    }
  }, {
    key: "prepareItem",
    value: function prepareItem(item, mode, isTrial) {
      // Update test url and pageUrl for mode
      if (mode !== 'es6') {
        if (item.url && !item.keepUrl) {
          item.url = item.url.replace('.t.js', ".t.".concat(mode, ".js"));
        }

        if (item.pageUrl && !item.keepPageUrl && !(mode === 'module' && isTrial)) {
          // keep querystring also for bundle (works with both url/?develop and url?develop)
          var qs = item.pageUrl.match(/(.*?)(\/*)([?#].*)/);

          if (qs) {
            item.pageUrl = "".concat(qs[1], "/index.").concat(mode, ".html").concat(qs[3]);
          } else {
            item.pageUrl += "/index.".concat(mode, ".html");
          }
        }
      }

      this.updateTitle(item, item.url || item.pageUrl);
    }
  }, {
    key: "normalizeItem",
    value: function normalizeItem(item, mode) {
      // Apply custom properties for mode or default
      if (item instanceof Object) {
        for (var key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            var val = item[key];

            if (val && (val[mode] || val.default)) {
              item[key] = val[mode] ? val[mode] : val.default;
            }
          }
        }
      }
    }
  }, {
    key: "prepareItems",
    value: function prepareItems(items, mode, isTrial) {
      items && items.map(function (item, i) {
        if (item) {
          BryntumTestHelper.normalizeItem(item, mode); // Include for bundle and skip handling

          if (item.skip !== null && item.skip === true || item.includeFor && item.includeFor.replace(' ', '').split(',').indexOf(mode) === -1) {
            items[i] = null;
          } else {
            // Normalize URL
            if (typeof item === 'string') {
              item = items[i] = {
                url: item
              };
            }

            BryntumTestHelper.prepareItem(items[i], mode, isTrial);
            BryntumTestHelper.prepareItems(item.items, mode, isTrial);
          }
        }
      });
      return items;
    }
  }]);

  return BryntumTestHelper;
}();