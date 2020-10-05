const
    paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams      = function(paramString) {
        const
            result = {},
            params = paramString ? paramString.split('&') : [];

        // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
        // So we cannot use .split('='). Using forEach instead of for...of for IE
        params.forEach(nameValuePair => {
            const
                [match, name, value] = paramValueRegExp.exec(nameValuePair),
                decodedName          = decodeURIComponent(name),
                decodedValue         = decodeURIComponent(value);

            if (match) {
                let paramValue = result[decodedName];

                if (paramValue) {
                    if (!Array.isArray(paramValue)) {
                        paramValue = result[decodedName] = [paramValue];
                    }
                    paramValue.push(decodedValue);
                }
                else {
                    result[decodedName] = decodedValue;
                }
            }
        });

        return result;
    };

Class('BryntumCoreTest', {

    isa : Siesta.Test.Browser,

    has : {
        waitForScrolling : true,
        applyTestConfigs : true
    },

    override : {
        setup(callback, errback) {
            const
                me                  = this,
                isTeamCity          = location.search.includes('IS_TEAMCITY'),
                allowedMessageRe    = /promise rejection/,
                { harness, global } = me,
                b                   = global.bryntum,
                ns                  = b && (b.core || b.grid || b.scheduler || b.schedulerpro || b.gantt);

            // running with bundle, but tests are written for import. need to publish all classes to global
            if (ns) {

                // If there's no UI, disable creation of debugging data by Base constructor
                if (!window.Ext) {
                    global.bryntum.DISABLE_DEBUG = true;
                }

                for (const className in ns) {
                    if (!global[className]) global[className] = ns[className];
                }
            }

            if (!harness.getDescriptorConfig(harness.getScriptDescriptor(me), 'usesConsole')) {
                console.clear();

                // Allow no noise in the console
                ['error', 'warn', 'log', 'info'].forEach(level => {
                    global.console[level] = (...args) => {
                        if (!allowedMessageRe.exec(args[0])) {
                            me.fail(['console output: ', ...args].join(''));
                        }

                        console[level](...args);
                    };

                    global.console[level].direct = (...args) => console[level](...args);
                });
            }

            const testDescriptor = harness.getScriptDescriptor(me);

            // Allow tests to modify configuration of class instances
            global.__applyTestConfigs = 'applyTestConfigs' in testDescriptor ? testDescriptor.applyTestConfigs : me.applyTestConfigs;

            if (isTeamCity && harness.isRerunningFailedTests) {
                me.startVideoRecording(callback);
            }
            else {
                me.SUPER(callback, errback);
            }

            if (global && global.DOMRect) {
                Object.defineProperty(global.DOMRect.prototype, 'x', {
                    get : () => me.fail('x property accessed from a DOMRect')
                });
                Object.defineProperty(global.DOMRect.prototype, 'y', {
                    get : () => me.fail('y property accessed from a DOMRect')
                });
            }
        },

        it(name, callback) {
            if (name.startsWith('TOUCH:') && (!window.Touch || !window.TouchEvent)) {
                arguments[1] = t => {
                    t.diag('Test skipped for non-touch browsers');
                };
            }
            return this.SUPERARG(arguments);
        },

        launchSpecs() {
            const me         = this,
                beforeEach = me.beforeEachHooks[0];

            // If beforeEach inside the test doesn't create new instances, let's wait for any timeouts to complete before starting new t.it
            if (!beforeEach || !beforeEach.code.toString().match('new ')) {
                me.beforeEach((t, callback) => me.verifyNoTimeoutsBeforeSubTest(t, callback));
            }

            return me.SUPERARG(arguments);
        },

        earlySetup(callback, errback) {
            const me             = this,
                testDescriptor = me.harness.getScriptDescriptor(me.url),
                { earlySetup } = testDescriptor;

            // if we have a URL to load early before the test gets started
            if (earlySetup) {
                const { SUPER } = me,
                    args      = arguments;

                // request earlySetup.url before running the test
                fetch(earlySetup.url).then(response => {
                    earlySetup.callback(response, testDescriptor, me, () => SUPER.apply(me, args));
                }).catch(() => errback(`Requesting ${earlySetup.url} failed`));
            }
            else {
                me.SUPER(callback, errback);
            }
        },

        onTearDown(fn) {
            this._tearDownHook = fn;
        },

        tearDown(callback, errback) {
            const me             = this,
                testDescriptor = me.harness.getScriptDescriptor(me.url),
                { tearDown }   = testDescriptor,
                { SUPER }      = me,
                args           = arguments;

            if (me.isFailed() && me.rootCause && me.rootCause.nbrFramesRecorded > 3) {
                const
                    failedAssertions = me.getFailedAssertions(),
                    failMsg          = failedAssertions[0] && (failedAssertions[0].description || failedAssertions[0].annotation),
                    err              = new Error(me.name + ' - ' + (failMsg || ''));

                me.rootCause.finalizeSiestaTestCallback = callback;
                me.rootCause.logException(err);
            }
            else if (me._tearDownHook) {
                me._tearDownHook(() => SUPER.apply(me, args));
            }
            // if we have a URL to load after the test finishes
            else if (tearDown) {
                // request tearDown.url after the test completion
                fetch(tearDown.url).then(response => {
                    tearDown.callback(response, testDescriptor, me, () => SUPER.apply(me, args));
                }).catch(() => errback(`Requesting ${tearDown.url} failed`));
            }
            else {
                me.SUPERARG(args);
            }
        },

        // Ensure we don't start next t.it if there are active timeouts
        verifyNoTimeoutsBeforeSubTest(test, callback) {
            const me = this;

            if (!me.harness.getScriptDescriptor(me).disableNoTimeoutsCheck) {
                let pollCount = 0;
                const
                    bryntum = me.global && me.global.bryntum,
                    poll    = () => {
                        if (!bryntum || !bryntum.globalDelays || bryntum.globalDelays.isEmpty()) {
                            callback();
                        }
                        else {
                            me.global && me.global.setTimeout(poll, pollCount ? 50 : 0);
                            pollCount++;
                        }
                    };

                poll();
            }
            else {
                callback();
            }
        }

        // Do not remove, handy for finding "leaking" timers
        // launchSubTest(subTest, callback) {
        //     if (this.global.bryntum && this.global.bryntum.globalDelays && !this.global.bryntum.globalDelays.isEmpty()) {
        //         debugger;
        //         this.fail('Active timeouts found');
        //     }
        //     this.SUPERARG(arguments);
        // }
    },

    methods : {
        initialize() {
            this.SUPERARG(arguments);

            this.on('beforetestfinalizeearly', this.performPostTestSanityChecks);
        },

        // Fail tests in automation containing iit()
        iit(descr) {
            if (this.project.isAutomated && location.host !== 'lh') {
                this.fail('No iit allowed in automation mode - t.iit: ' + descr);
            }
            return this.SUPERARG(arguments);
        },

        performPostTestSanityChecks(evt, t) {
            if (!this.parent && !this.url.match(/docs\//)) {
                this.assertNoDomGarbage(t);
                this.assertNoResizeMonitors();
            }
        },

        async delayedTouchDragBy(target, delta) {
            await this.touchStart(target);
            await this.waitForTouchTimeoutToExpire();
            await this.movePointerBy(delta);
            this.touchEnd();
        },

        async delayedTouchDragTo(source, target) {
            await this.touchStart(source);
            await this.waitForTouchTimeoutToExpire();
            await this.movePointerTo(target);
            this.touchEnd();
        },

        async waitForTouchTimeoutToExpire() {
            const delays = this.global.bryntum.globalDelays;

            return this.waitFor(() => {
                let foundTimeout;
                delays.timeouts.forEach(o => {
                    if (o.name === 'touchStartDelay') {
                        foundTimeout = true;
                    }
                });
                return !foundTimeout;
            });
        },

        isOnline() {
            return window.location.href.match(/bryntum\.com/i);
        },

        addListenerToObservable(observable, event, listener, isSingle) {
            if ('on' in observable) {
                observable.on(event, listener);
            }
            else if ('addEventListener' in observable) {
                observable.addEventListener(event, listener);
            }
        },

        removeListenerFromObservable(observable, event, listener) {
            // Observable might be destroyed way before test is finalized. In that case it won't have `un` method
            // t.firesOnce(popup, 'beforehide');
            // t.firesOnce(popup, 'hide');
            // popup.destroy();
            if (observable && observable.un) {
                observable.un(event, listener);
            }
        },

        getTimeZone : function() {
            const
                Date = this.global.Date,
                date = new Date();

            return date.toLocaleString().replace(/.*(GMT.*)/, '$1');
        },

        getDSTDates(year = 2012) {
            const
                Date      = this.global.Date,
                yearStart = new Date(year, 0, 1),
                yearEnd   = new Date(year, 11, 31),
                dstDates  = [];

            for (let i = yearStart; i <= yearEnd; i = new Date(i.setDate(i.getDate() + 1))) {
                const
                    midnightOffset = new Date(year, i.getMonth(), i.getDate()).getTimezoneOffset(),
                    noonOffset     = new Date(year, i.getMonth(), i.getDate(), 12).getTimezoneOffset();

                if (midnightOffset != noonOffset) dstDates.push(i);
            }

            return dstDates;
        },

        assertNoDomGarbage(t) {
            const
                me      = this,
                body    = me.global.document.body,
                invalid = [
                    '[id*="undefined"]',
                    '[id*="null"]',
                    '[class*="undefined"]',
                    '[class*="null"]',
                    '[class*="null"]'
                ];

            // Data URL can violate the check for NaN in some cases
            // Array.from() used for IE11 compatibility
            Array.from(body.querySelectorAll('.b-sch-background-canvas')).forEach(e => e.remove());

            me.contentNotLike(body, 'NaN', 'No "NaN" string found in DOM');
            me.contentNotLike(body, ' id=""', 'No empty id found in DOM');
            me.contentNotLike(body, /L{.*?}/, 'No non-localized string templates L{xx}');

            if (!t.skipSanityChecks) {
                // Remove embedded JS code blocks like `href="data:text/javascript;..."` or `<code>...</code>` from checking
                const
                    outerHTML = body.outerHTML.replace(/href="data:text\/javascript[\s\S]*?"/gm, '').replace(/<code[\s\S]*?<\/code>/gm, '');

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

        assertNoResizeMonitors() {
            Array.from(document.querySelectorAll('*')).forEach(e => {
                if (e._bResizemonitor && e._bResizemonitor.handlers.length) {
                    this.fail(`${e.tagName}#e.id has ${e._bResizemonitor.handlers.length} resize monitors attached`);
                }
            });
        },

        // Never start an action is animations or scrolling is ongoing
        waitForAnimations(callback) {
            this.waitForSelectorNotFound(`.b-animating,.b-aborting${this.waitForScrolling ? ',.b-scrolling' : ''}`, callback);
        },

        waitForAnimationFrame(next) {
            let frameFired = false;

            this.waitFor(function() {
                return frameFired;
            }, next);
            requestAnimationFrame(function() {
                frameFired = true;
            });
        },

        // Allows `await t.animationFrame`
        animationFrame(frames = 1) {
            const global = this.global;

            let count = 0,
                resolveFn;

            function frame() {
                if (count++ < frames) {
                    global.requestAnimationFrame(() => frame());
                }
                else {
                    resolveFn();
                }
            }

            return new Promise(resolve => {
                resolveFn = resolve;
                frame();
            });
        },

        waitForAsync(fn) {
            return new Promise(resolve => this.waitFor(fn, resolve));
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
        mockUrl(url, response) {
            const
                me         = this,
                AjaxHelper = me.global.AjaxHelper;

            if (!AjaxHelper) {
                throw new Error('AjaxHelper must be injected into the global namespace');
            }

            (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response;

            // Inject the override into the AjaxHelper instance
            if (!AjaxHelper.originalFetch) {
                // cannot use Reflect in IE11
                //Reflect.set(AjaxHelper, 'originalFetch', AjaxHelper.fetch);
                //Reflect.set(AjaxHelper, 'fetxh', Test.mockAjaxFetch.bind(Test));
                AjaxHelper.originalFetch = AjaxHelper.fetch;
            }
            AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
        },

        mockAjaxFetch(url, options) {
            const
                urlAndParams = url.split('?'),
                win          = this.global;

            let result     = this.mockAjaxMap[urlAndParams[0]],
                parsedJson = null;

            if (result) {
                if (typeof result === 'function') {
                    result = result(urlAndParams[0], parseParams(urlAndParams[1]), options);
                }
                try {
                    parsedJson = options.parseJson && JSON.parse(result.responseText);
                }
                catch (error) {
                    parsedJson = null;
                    result.error = error;
                }

                result = win.Object.assign({
                    status     : 200,
                    ok         : true,
                    headers    : new win.Headers(),
                    statusText : 'OK',
                    url        : url,
                    parsedJson : parsedJson,
                    text       : () => new Promise((resolve) => {
                        resolve(result.responseText);
                    }),
                    json : () => new Promise((resolve) => {
                        resolve(parsedJson);
                    })
                }, result);

                return new win.Promise(function(resolve, reject) {
                    if (result.synchronous) {
                        result.rejectPromise ? reject('Promise rejected!') : resolve(result);
                    }
                    else {
                        win.setTimeout(function() {
                            result.rejectPromise ? reject('Promise rejected!') : resolve(result);
                        }, ('delay' in result ? result.delay : 100));
                    }
                });
            }
            else {
                return win.AjaxHelper.originalFetch(url, options);
            }
        },

        /**
         * Deregisters the passed URL from the mocked URL map
         */
        unmockUrl(url) {
            if (this.mockAjaxMap) {
                delete this.mockAjaxMap[url];
            }
        },

        isRectApproxEqual(rect1, rect2, threshold, descr) {
            for (const o in rect1) {
                this.isApprox(rect1[o], rect2[o], threshold, descr || '');
            }
        },

        // t.isCssTextEqual(element, 'position: absolute; color: blue;')
        isCssTextEqual(src, cssText, desc) {
            if (src instanceof this.global.HTMLElement) {
                src = src.style.cssText;
            }
            if (src === cssText) {
                this.pass(desc || 'Style matches');
            }
            else {
                const
                    srcParts    = src.split(';').map(p => p.trim()),
                    targetParts = cssText.split(';').map(p => p.trim());

                srcParts.sort();
                targetParts.sort();

                this.isDeeply(srcParts, targetParts);
            }
        },

        startVideoRecording(callback) {
            const
                me       = this,
                document = me.global.document,
                script   = document.createElement('script');

            script.crossOrigin = 'anonymous';
            script.src = 'https://app.therootcause.io/rootcause-full.js';
            script.addEventListener('load', startRootCause);
            script.addEventListener('error', callback);

            document.head.appendChild(script);

            function startRootCause() {
                me.on('testupdate', me.onTestUpdate, me);

                me.rootCause = new me.global.RC.Logger({
                    nbrFramesRecorded  : 0,
                    captureScreenshot  : false,
                    applicationId      : '2709a8dbc83ccd7c7dd07f79b92b5f3a90182f93',
                    maxNbrLogs         : 1,
                    recordSessionVideo : true,
                    videoBaseUrl       : me.global.location.href.replace(me.global.location.host, 'qa.bryntum.com'),
                    logToConsole       : () => {},

                    // Ignore fails in non-DOM tests which should never be flaky, and video won't help
                    processVideoFrameFn : function(frame) {
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

                    onErrorLogged : function(responseText) {
                        let data;

                        try {
                            data = JSON.parse(responseText);
                        }
                        catch (e) {
                        }

                        if (data && data.id) {
                            me.fail(`[video=${data.id}]`);
                        }
                        this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
                    },
                    onErrorLogFailed : function() {
                        this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
                    }
                });

                if (me.rootCause.socket && me.rootCause.socket.readyState === WebSocket.OPEN) {
                    callback.call(me);
                }
                else {
                    me.rootCause.socket.addEventListener('open', callback.bind(me));
                }
            }
        },

        onTestUpdate : function(event, test, result) {
            if (typeof result.passed === 'boolean') {
                this.rootCause.addLogEntry({
                    type    : result.passed ? 'pass' : 'fail',
                    glyph   : result.passed ? 'check' : 'times',
                    message : (result.description || '') + (result.annotation ? result.annotation + ' \nresult.annotation' : '')
                });
            }
        },

        handlerThrowsOk(fn) {
            const me         = this,
                oldOnError = me.global.onerror;

            let success    = false,
                doneCalled = false;

            const done = function() {
                if (!doneCalled) {
                    doneCalled = true;
                    me.global.onerror = oldOnError;
                    if (success) {
                        me.pass('Expected error was thrown');
                    }
                    else {
                        me.fail('Expected error was not thrown');
                    }
                    me.endAsync(async);
                }
            };

            me.global.onerror = function(ex) {
                success = true;
                done();
                return true;
            };

            const async = me.beginAsync();

            // We must return the destroy method first in case the
            // passed method is not in fact async.
            setTimeout(fn, 0);

            return done;
        },

        removeIframe(iframeId) {
            const
                t         = this,
                _document = t.global.document,
                iframe    = _document.getElementById(iframeId);
            if (iframe) {
                iframe.parentElement.removeChild(iframe);
            }
            else {
                t.fail('Cannot find iframe with id ' + iframeId);
            }
        },

        setIframeUrl(iframe, url, callback) {
            const async = this.beginAsync(),
                doc   = iframe.contentDocument;

            iframe.onload = () => {
                this.endAsync(async);
                iframe.onload = undefined;
                callback();
            };

            if (url && doc.location !== url) {
                doc.location = url;
            }
            else {
                doc.location.reload();
            }

        },

        setIframe(config) {
            config = config || {};

            const
                t         = this,
                id        = config.iframeId || config.id,
                {
                    onload,
                    html,
                    height = 1600,
                    width  = 900
                }         = config,
                _document = t.global.document,
                iframe    = _document.body.appendChild(_document.createElement('iframe'));

            let async = config.async;

            iframe.width = width;
            iframe.height = height;

            if (id) {
                iframe.setAttribute('id', id);
            }

            const doc = iframe.contentWindow.document;

            if (onload) {
                async = async || t.beginAsync();

                iframe.onload = function() {
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

        setIframeAsync(config) {
            return new this.global.Promise(resolve => {
                this.setIframe(this.global.Object.assign(config, {
                    onload : (document, iframe) => {
                        resolve({ document, iframe });
                    }
                }));
            });
        },

        scrollIntoView(selector, callback) {
            this.global.document.querySelector(selector).scrollIntoView();
            callback && callback();
        },

        getSVGBox(svgElement) {
            const
                svgBox       = svgElement.getBBox(),
                containerBox = svgElement.viewportElement.getBoundingClientRect();

            return {
                left   : svgBox.x + containerBox.left,
                right  : svgBox.x + containerBox.left + svgBox.width,
                top    : svgBox.y + containerBox.top,
                bottom : svgBox.y + containerBox.top + svgBox.height
            };
        },

        samePx(value, compareWith, threshold = 1) {
            return Math.abs(value - compareWith) <= threshold * (window.devicePixelRatio || 1);
        },

        sameRect(rect1, rect2, threshold = 1) {
            // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements
            return this.samePx(rect1.top, rect2.top, threshold) &&
                this.samePx(rect1.left, rect2.left, threshold) &&
                this.samePx(rect1.width, rect2.width, threshold) &&
                this.samePx(rect1.height, rect2.height, threshold);
        },

        isApproxPx(value, compareWith, threshold = 1, desc) {
            if (typeof threshold === 'string') {
                desc = threshold;
                threshold = 1;
            }
            // Extend isApprox to use window.devicePixelRatio for HiDPI display measurements
            this.isApprox(value, compareWith, threshold * (window.devicePixelRatio || 1), desc);
        },

        isApproxRect(rect1, rect2, threshold = 1, desc) {
            this.isApproxPx(rect1.top, rect2.top, threshold, `${desc} top value`);
            this.isApproxPx(rect1.left, rect2.left, threshold, `${desc} left value`);
            this.isApproxPx(rect1.width, rect2.width, threshold, `${desc} width value`);
            this.isApproxPx(rect1.height, rect2.height, threshold, `${desc} height value`);
        },

        elementToObject(element) {
            if (element instanceof this.global.HTMLElement) {
                const
                    result     = {
                        children : []
                    },
                    attributes = element.attributes,
                    children   = element.children;

                for (let i = 0, l = attributes.length; i < l; i++) {
                    const attr = attributes[i];

                    if (typeof attr.value === 'string') {
                        if (attr.value.length > 0) {
                            result[attr.name] = attr.value;
                        }
                    }
                    else {
                        result[attr.name] = attr.value;
                    }
                }

                for (let i = 0, l = children.length; i < l; i++) {
                    result.children.push(this.elementToObject(children[i]));
                }

                return result;
            }
        },

        smartMonkeys(description) {
            const
                buttons = this.global.document.querySelectorAll('.demo-header button:not(#fullscreen-button)');
            if (buttons.length > 0) {
                // Array.from() used for IE11 compatibility. Extra fullscreen check for framework buttons
                Array.from(buttons).forEach(button => !button.disabled && !button.querySelector('.b-icon-fullscreen') && button.click());
                this.pass(description || 'Smart monkeys clicking around did not produce errors');
            }
        },

        query : function(selector, root) {
            const me = this;

            selector = selector.trim();

            // Handle potential nested iframes
            root = root || me.getNestedRoot(selector);

            selector = selector.split('->').pop().trim();

            if (selector.match(/=>/)) {
                const
                    bryntum         = me.getGlobal(root).bryntum,
                    parts           = selector.split('=>'),
                    cssSelector     = parts.pop().trim(),
                    bryntumSelector = parts[0].trim(),
                    widgets         = bryntum.queryAll(bryntumSelector);

                return widgets.map(widget => me.query(cssSelector, widget.element)[0]).filter(result => Boolean(result));
            }
            else if (selector.match(/\s*>>/)) {
                const bryntum = me.getGlobal(root).bryntum;

                return bryntum.queryAll(selector.substr(2)).map(widget => widget.element);
            }

            return me.SUPERARG([selector, root]);
        },

        setRandomPHPSession() {
            // Sets random cookie session ID per test
            const
                rndStr = Math.random().toString(16).substring(2),
                cookie = `${this.url} ${rndStr}`.replace(/[ .\\/&?=]/gm, '-').toLowerCase();

            this.diag(`PHPSESSID: ${cookie}`);
            this.global.document.cookie = `PHPSESSID=${cookie}`;
        },

        rect(selectorOrEl) {
            return this.normalizeElement(selectorOrEl).getBoundingClientRect();
        }
    }
});

// eslint-disable-next-line no-unused-vars
class BryntumTestHelper {

    static prepareMonkeyTests(items, root = '', mode) {
        const urls = [];
        return items.map((item) => {
            if (item && (item.skipMonkey !== true)) {
                // Append ../examples to the string item if it doesn't start with it (to simplify configs)
                const cfg = Object.assign({}, item instanceof Object ? item : {
                    pageUrl : `${!item.startsWith('../examples') ? '../examples/' : ''}${item}`
                });

                if (cfg.pageUrl) {
                    if (!cfg.keepPageUrl && ['umd', 'module'].includes(mode)) {
                        const parts = cfg.pageUrl.split('?');
                        cfg.pageUrl = parts[0] + (parts[0].endsWith('/') ? '' : '/') + `index.${mode}.html?` + (parts[1] || '');
                    }

                    // Prepare url-friendly id
                    const id = cfg.pageUrl.replace(/\.+\//g, '').replace(/[?&./]/g, '-').replace('--', '-');
                    cfg.isMonkey = true;
                    cfg.keepPageUrl = true;
                    cfg.url = `${root}examples/monkey.t.js?id=${id}&monkey`;
                    // Avoid duplicates
                    if (!urls.includes(cfg.url)) {
                        urls.push(cfg.url);
                        return cfg;
                    }
                }
            }
        });
    }

    static updateTitle(item, testUrl) {
        // Split testUrl to display in tree grid
        if (testUrl && (typeof URL === 'function')) {
            const
                url      = new URL(`http://bryntum.com/${testUrl}`),
                pathName = url.pathname,
                idx      = pathName.lastIndexOf('/'),
                testName = pathName.substring(idx + 1),
                testPath = !item.isMonkey ? pathName.substring(1, idx) : item.pageUrl;
            item.title = `${testName}${url.search} ${testPath !== '' ? `[ ${testPath} ]` : ''}`;
        }
    }

    static prepareItem(item, mode, isTrial) {
        // Update test url and pageUrl for mode
        if (mode !== 'es6') {
            if (item.url && !item.keepUrl) {
                item.url = item.url.replace('.t.js', `.t.${mode}.js`);
            }

            if (item.pageUrl && !item.keepPageUrl && !(mode === 'module' && isTrial)) {
                // keep querystring also for bundle (works with both url/?develop and url?develop)
                const qs = item.pageUrl.match(/(.*?)(\/*)([?#].*)/);
                if (qs) {
                    item.pageUrl = `${qs[1]}/index.${mode}.html${qs[3]}`;
                }
                else {
                    item.pageUrl += `/index.${mode}.html`;
                }
            }

        }
        this.updateTitle(item, item.url || item.pageUrl);
    }

    static normalizeItem(item, mode) {
        // Apply custom properties for mode or default
        if (item instanceof Object) {
            for (const key in item) {
                if (Object.prototype.hasOwnProperty.call(item, key)) {
                    const val = item[key];
                    if (val && (val[mode] || val.default)) {
                        item[key] = val[mode] ? val[mode] : val.default;
                    }
                }
            }
        }
    }

    static prepareItems(items, mode, isTrial) {
        items && items.map((item, i) => {
            if (item) {
                BryntumTestHelper.normalizeItem(item, mode);
                // Include for bundle and skip handling
                if (item.skip !== null && item.skip === true ||
                    (item.includeFor && item.includeFor.replace(' ', '').split(',').indexOf(mode) === -1)) {
                    items[i] = null;
                }
                else {
                    // Normalize URL
                    if (typeof item === 'string') {
                        item = items[i] = { url : item };
                    }
                    BryntumTestHelper.prepareItem(items[i], mode, isTrial);
                    BryntumTestHelper.prepareItems(item.items, mode, isTrial);
                }
            }
        });
        return items;
    }
}
