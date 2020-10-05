function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*global DocsBrowserInstance*/

/*eslint no-undef: "error"*/
DocsBrowserInstance.animateScroll = false;
describe('Open all links in guides', function (t) {
  var navigationTree = DocsBrowserInstance.navigationTree,
      data;
  var ignoreClasses = ['altinst'],
      // Don't look up these in the doc tree store
  sectionsRe = /#events$|#configs$|#properties$|#functions$/;

  var store = navigationTree.store,
      records = [],
      contentElement = document.getElementById('content'),
      findMemberInClass = function findMemberInClass(clsRecord, propertyType, memberName, isStatic) {
    var found = (clsRecord.data[propertyType] || []).find(function (mem) {
      return mem.name === memberName && mem.scope === 'static' === isStatic;
    });

    if (!found && clsRecord.data.extends) {
      var superClass = store.getById(clsRecord.data.extends[0]);
      found = findMemberInClass(superClass, propertyType, memberName, isStatic);
    }

    return found;
  },
      assert = function assert(records, callback) {
    var classRecord = records.shift();

    if (!classRecord) {
      callback();
      return;
    }

    location.hash = classRecord.data.fullName;
    t.it('Checking guide: ' + classRecord.name, function (t) {
      t.chain({
        waitForSelector: "#content h1:not(:empty)"
      }, {
        waitForSelector: '.b-docs-loaded'
      }, {
        waitForSelectorNotFound: '.external-target:empty'
      }, function (next) {
        t.notOk(contentElement.innerHTML.includes('<div class="description">undefined</div>'), 'No undefined descriptions');
        data = store.getById(classRecord.id).data; // records data is replaced when showing inherited, need to get it again

        next();
      }, // Trying this to see if it solves test being flaky in FF
      {
        waitFor: function waitFor() {
          return data.configs && data.configs.length ? contentElement.querySelectorAll('.configs .config').length === data.configs.length : true;
        }
      }, function (next) {
        if (data.configs && data.configs.length) {
          t.is(contentElement.querySelectorAll('.configs .config').length, data.configs.length, 'Configs rendered');
        }

        if (data.extends && data.extends.length) {
          t.ok(contentElement.querySelector('.extends'), 'Extends rendered');
        }

        if (data.functions && data.functions.length) {
          t.is(contentElement.querySelectorAll('.functions .function').length, data.functions.length, 'Functions rendered');

          var _iterator = _createForOfIteratorHelper(data.functions),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var f = _step.value;
              var fId = f.scope === 'static' ? f.name + '-static' : f.name;

              if (f.parameters) {
                t.is(contentElement.querySelectorAll('#content #function-' + fId + ' .function-body .parameter').length, f.parameters.length, fId + ': function params rendered');
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        if (data.properties && data.properties.length) {
          t.is(contentElement.querySelectorAll('.properties .property').length, data.properties.length, 'Properties rendered');
        }

        if (data.events) {
          t.is(contentElement.querySelectorAll('.events .event').length, data.events.length, 'Events rendered');

          var _iterator2 = _createForOfIteratorHelper(data.events),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var e = _step2.value;

              if (e.parameters) {
                t.is(contentElement.querySelectorAll('#event-' + e.name + '.event .parameter').length, e.parameters.length, e.name + ' event params rendered');
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } // verify all internal links are correct


        Array.from(contentElement.querySelectorAll('a[href^="#"]:not(.summary-icon):not(.inherited)')).forEach(function (node) {
          var href = node.getAttribute('href').substring(1),
              className = href.split('#')[0],
              member = href.split('#')[1],
              clsRecord = navigationTree.store.getById(className);

          if (!clsRecord && !ignoreClasses.includes(className)) {
            t.fail(classRecord.id + ': ' + className + ' not found');
          } else if (member) {
            var parts = member.split('-'),
                name = parts[1],
                type = parts[0],
                isStatic = parts.length === 3,
                propertyName = type === 'property' ? 'properties' : type + 's';
            var found = false;

            if (parts.length > 1) {
              found = findMemberInClass(clsRecord, propertyName, name, isStatic);
            }

            if (!found && !href.match(sectionsRe)) {
              t.fail(classRecord.id + ' - docs link not found: ' + href);
            }
          }
        }); // verify all links to global symbols are OK

        Array.from(contentElement.querySelectorAll('a.type[target=_blank]')).forEach(function (node) {
          var symbolName = node.innerHTML.trim().replace('[]', '').replace('...', '');

          if (symbolName !== 'TouchEvent' && symbolName !== 'undefined' && symbolName !== 'null' && symbolName !== 'Class' && !window[symbolName]) {
            t.fail(classRecord.id + ' - docs link not found: ' + symbolName);
          }
        });
        assert(records, callback);
      });
    });
  };

  t.chain({
    waitForEvent: [DocsBrowserInstance, 'load'],
    trigger: function trigger() {
      DocsBrowserInstance.onSettingsChange({
        settings: {
          showPublic: true,
          showInternal: true,
          showPrivate: true,
          showInherited: true
        }
      });
    }
  }, {
    waitForSelector: '#bryntumgantt:textEquals(Bryntum Gantt)',
    desc: 'Initial content shown'
  }, {
    waitForSelectorNotFound: '.loading'
  }, function (next) {
    navigationTree.expandAll();
    store.traverse(function (classRecord) {
      if (classRecord.isLeaf && classRecord.isGuide) {
        records.push(classRecord);
      }
    });
    assert(records, next);
  });
});