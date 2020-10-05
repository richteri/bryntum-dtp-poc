function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _bryntum$gantt = bryntum.gantt,
    AjaxHelper = _bryntum$gantt.AjaxHelper,
    BrowserHelper = _bryntum$gantt.BrowserHelper,
    DomHelper = _bryntum$gantt.DomHelper,
    EventHelper = _bryntum$gantt.EventHelper,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    Popup = _bryntum$gantt.Popup,
    GlobalEvents = _bryntum$gantt.GlobalEvents,
    VersionHelper = _bryntum$gantt.VersionHelper,
    StringHelper = _bryntum$gantt.StringHelper;
/* eslint-disable no-new */
// TODO: convert to ES6. Originally wanted to avoid babeling both doing that now anyway so...

var ExamplesApp = /*#__PURE__*/function () {
  function ExamplesApp() {
    _classCallCheck(this, ExamplesApp);

    var me = this,
        product = StringHelper.capitalizeFirstLetter(shared.productName),
        version = VersionHelper.getVersion(shared.productName);
    me.examples = window.examples || [];
    me.currentTipLoadPromiseByURL = {}; // remove prerendered examples

    me.examplesContainerEl = document.getElementById('scroller');
    me.examplesContainerEl.innerHTML = '';
    document.body.classList.add(shared.theme); // Add style for IE11

    if (BrowserHelper.isIE11) {
      document.body.classList.add('b-ie');
    }

    document.getElementById('title').innerHTML = "Bryntum ".concat(product, " ").concat(version);
    GlobalEvents.on({
      theme: function theme() {
        document.body.classList.remove(shared.prevTheme);
        document.body.classList.add(shared.theme);

        if (me.rendered) {
          me.updateThumbs();
        }
      }
    });
    me.isOnline = /^(www\.)?bryntum\.com/.test(location.host) || location.search.includes('online');
    me.buildTip = me.isOnline ? 'This demo is not viewable online, but included when you download the trial. ' : 'This demo needs to be built before it can be viewed. '; // Do not display documentation button online, paths will be wrong

    WidgetHelper.append([{
      type: 'button',
      text: 'Documentation',
      icon: 'b-fa b-fa-book-open',
      cls: 'b-blue b-raised',
      href: me.isOnline ? '/docs/' + product.toLowerCase() : '../docs'
    }].concat(me.isOnline ? {
      type: 'button',
      id: 'downloadtrial',
      text: 'Download Trial',
      icon: 'b-fa b-fa-download',
      cls: 'b-green b-raised',
      menu: {
        type: 'trialpanel',
        productId: shared.productName,
        align: {
          align: 't-b',
          constrainPadding: 20
        }
      }
    } : []), {
      insertFirst: document.getElementById('tools') || document.body,
      cls: 'b-bright'
    });

    if (location.search.match('prerender')) {
      me.embedDescriptions().then(me.render.bind(me));
    } else {
      me.render();
    }

    window.addEventListener('DOMContentLoaded', me.setInitialScroll);
  }

  _createClass(ExamplesApp, [{
    key: "onCloseClick",
    value: function onCloseClick() {
      document.getElementById('intro').style.maxHeight = '0';
    }
  }, {
    key: "updateThumbs",
    value: function updateThumbs() {
      // replace thumb with new theme
      Array.from(document.querySelectorAll('.image img')).forEach(function (img) {
        img.src = img.src.replace(/thumb\..*?\.png/, "thumb.".concat(shared.theme, ".png").toLowerCase());
      });
    }
  }, {
    key: "setInitialScroll",
    value: function setInitialScroll() {
      if (location.hash) {
        var exampleOrSectionId = window.location.hash.split('#')[1];

        if (exampleOrSectionId) {
          var element = document.getElementById(exampleOrSectionId);

          if (element) {
            element.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, {
    key: "template",
    value: function template(data) {
      var _this = this;

      var theme = shared.theme,
          version = VersionHelper.getVersion(shared.productName),
          isNew = function isNew(example) {
        return version && example.since && version.startsWith(example.since);
      },
          isUpdated = function isUpdated(example) {
        return version && example.updated && version.startsWith(example.updated);
      };

      return data.examples.map(function (example) {
        // Show build popup for examples marked as offline and for those who need building when demo browser is offline
        var hasPopup = example.build && !_this.isOnline || example.offline;
        return "".concat(example.firstInGroup ? "\n                <h2 id=\"".concat(example.group, "\" class=\"group-header ").concat(example.group, "\">").concat(example.group, "</h2>\n                <section class=\"examples\">\n                ") : '', "\n                <a\n                    draggable=\"false\"\n                    class=\"example ").concat(isNew(example) ? 'new' : '', " ").concat(isUpdated(example) ? 'updated' : '', "\"\n                    id=\"example-").concat(example.folder.replace(/\//gm, '-'), "\"\n                    ").concat(example.offline ? '' : "href=\"".concat(example.folder, "\""), "\n                    ").concat(hasPopup ? "data-popup=\"".concat(example.folder, "\"") : '', "\n                    >\n                    <div class=\"image\">\n                        <img draggable=\"false\" src=\"").concat(example.folder, "/meta/thumb.").concat(theme.toLowerCase(), ".png\" alt=\"").concat(example.tooltip || example.title || '', "\">\n                        <i class=\"").concat(hasPopup ? 'tooltip b-fa b-fa-cog build' : 'tooltip b-fa b-fa-info', "\"></i>\n                        ").concat(example.version ? "<div class=\"version\">".concat(example.version, "</div>") : '', "\n                    </div>\n                    <label class=\"title\">").concat(example.title, "</label>\n                </a>\n                ").concat(example.lastInGroup ? '</section>' : '', "\n            ");
      }).join('');
    }
  }, {
    key: "render",
    value: function render() {
      var me = this,
          examples = me.examples,
          groupOrder = {
        Basic: 0,
        Intermediate: 1,
        Advanced: 2,
        Integration: 3,
        'Integration/Angular': 4,
        'Integration/React': 5,
        'Integration/Vue': 6
      };

      if (me.examplesContainerEl.children.length === 0) {
        examples.sort(function (a, b) {
          var first = groupOrder[a.group] + a.title.trim(),
              second = groupOrder[b.group] + b.title.trim();
          if (first < second) return -1;
          if (first > second) return 1;
          return 0;
        });
        var group = '',
            last = null;
        examples.forEach(function (r) {
          if (r.group !== group) {
            group = r.group;
            r.firstInGroup = true;
            if (last) last.lastInGroup = true;
          }

          last = r;
        });
        me.examplesContainerEl.innerHTML = me.template({
          examples: examples
        });
      } else {
        // We need this to correctly process thumbs in Edge
        me.updateThumbs();
      } // A singleton tooltip which displays example info on hover of (i) icons.


      WidgetHelper.attachTooltip(me.examplesContainerEl, {
        forSelector: 'i.tooltip',
        header: true,
        scrollAction: 'realign',
        textContent: true,
        getHtml: function () {
          var _getHtml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
            var tip, activeTarget, linkNode, url, u, requestPromise, response, json, html;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    tip = _ref.tip;
                    activeTarget = tip.activeTarget;

                    if (!activeTarget.dataset.tooltip) {
                      _context.next = 5;
                      break;
                    }

                    tip.titleElement.innerHTML = activeTarget.dataset.tooltipTitle;
                    return _context.abrupt("return", activeTarget.dataset.tooltip);

                  case 5:
                    linkNode = activeTarget.closest('a');
                    url = "".concat(linkNode.getAttribute('href') || linkNode.dataset.popup, "/app.config.json"); // Cancel all ongoing ajax loads (except for the URL we are interested in)
                    // before fetching tip content

                    for (u in me.currentTipLoadPromiseByURL) {
                      if (u !== url) {
                        me.currentTipLoadPromiseByURL[u].abort();
                      }
                    } // if we don't have ongoing requests to the URL


                    if (me.currentTipLoadPromiseByURL[url]) {
                      _context.next = 18;
                      break;
                    }

                    requestPromise = me.currentTipLoadPromiseByURL[url] = AjaxHelper.get(url, {
                      parseJson: true
                    });
                    _context.next = 12;
                    return requestPromise;

                  case 12:
                    response = _context.sent;
                    json = response.parsedJson;
                    html = activeTarget.dataset.tooltip = json.description.replace(/[\n\r]/g, '') + (/build/.test(activeTarget.className) ? "<br><b>".concat(me.buildTip, "</b>") : '');
                    activeTarget.dataset.tooltipTitle = tip.titleElement.innerHTML = json.title.replace(/[\n\r]/g, '');
                    delete me.currentTipLoadPromiseByURL[url];
                    return _context.abrupt("return", html);

                  case 18:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function getHtml(_x) {
            return _getHtml.apply(this, arguments);
          }

          return getHtml;
        }()
      });
      document.getElementById('intro').style.display = 'block';
      document.getElementById('close-button').addEventListener('click', me.onCloseClick.bind(me));
      document.body.addEventListener('error', me.onThumbError.bind(me), true);
      EventHelper.on({
        element: me.examplesContainerEl,
        click: function click(event) {
          var el = DomHelper.up(event.target, '[data-popup]');
          new Popup({
            forElement: el,
            cls: 'b-demo-unavailable',
            header: '<i class="b-fa b-fa-info-circle"></i> ' + (me.isOnline ? 'Download needed' : 'Needs building'),
            html: me.buildTip + "Browse to <b><a href=\"".concat(el.dataset.popup, "\">examples/").concat(el.dataset.popup, "</a></b> to find it"),
            closeAction: 'destroy',
            textContent: false,
            width: '18em',
            anchor: true,
            scrollAction: 'realign'
          });
          event.preventDefault();
        },
        delegate: '[data-popup]'
      });
      EventHelper.on({
        element: me.examplesContainerEl,
        click: function click(event) {
          // To be able to select example name, need to make the text do not work as a link
          if (window.getSelection().toString().length) {
            event.preventDefault();
          }
        },
        delegate: 'a.example label'
      });
      var demoDiv = document.getElementById('live-example'),
          widgetConfig = window.introWidget; // taken from `examples/_shared/data/examples.js`

      if (demoDiv && widgetConfig) {
        WidgetHelper.append(widgetConfig, 'live-example');
      }

      me.rendered = true;
    }
  }, {
    key: "embedDescriptions",
    value: function embedDescriptions() {
      var _this2 = this;

      return new Promise(function (resolve) {
        var me = _this2,
            promises = me.examples.map(function (example) {
          return AjaxHelper.get(example.folder + '/app.config.json', {
            parseJson: true
          }).then(function (response) {
            if (response.parsedJson) {
              example.tooltip = response.parsedJson.title + ' - ' + response.parsedJson.description.replace(/[\n\r]/g, ' ').replace(/"/g, '\'');
            }
          });
        });
        Promise.all(promises).then(resolve);
      });
    }
  }, {
    key: "onThumbError",
    value: function onThumbError(e) {
      if (e.target && e.target.src && e.target.src.includes('thumb')) {
        e.target.style.display = 'none';
      }
    }
  }]);

  return ExamplesApp;
}();

new ExamplesApp();