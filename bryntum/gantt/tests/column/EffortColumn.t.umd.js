function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    gantt && gantt.destroy();
  }); // Here we check that effort column shows the same value which is showed in its editor #950

  t.it('Should use the same value for column rendering and editor', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: DurationColumn.type,
        width: 150
      }, {
        type: EffortColumn.type,
        width: 150
      }]
    });
    t.chain({
      waitForRowsVisible: gantt
    }, function (next) {
      var task = gantt.taskStore.getAt(2),
          _t$query = t.query('[data-index=2] [data-column=fullDuration]'),
          _t$query2 = _slicedToArray(_t$query, 1),
          durationCellEl = _t$query2[0],
          fullDurationRendered = durationCellEl.innerHTML,
          fullDurationTask = task.fullDuration,
          _t$query3 = t.query('[data-index=2] [data-column=fullEffort]'),
          _t$query4 = _slicedToArray(_t$query3, 1),
          effortCellEl = _t$query4[0],
          fullEffortRendered = effortCellEl.innerHTML,
          fullEffortTask = task.fullEffort;

      fullDurationTask.unit = DateHelper.parseTimeUnit(fullDurationTask.unit);
      fullEffortTask.unit = DateHelper.parseTimeUnit(fullEffortTask.unit);
      t.ok(durationCellEl, 'Duration cell rendered');
      t.isDeeply(DateHelper.parseDuration(fullDurationRendered), fullDurationTask, 'Duration is rendered properly');
      t.ok(effortCellEl, 'Effort cell rendered');
      t.isDeeply(DateHelper.parseDuration(fullEffortRendered), fullEffortTask, 'Effort is rendered properly');
      next(fullEffortRendered);
    }, {
      dblClick: '[data-index=2] [data-column=fullEffort]'
    }, function (next, clickedCellEl) {
      var _t$query5 = t.query('.b-cell-editor input'),
          _t$query6 = _slicedToArray(_t$query5, 1),
          editorInputEl = _t$query6[0];

      t.is(editorInputEl.value, clickedCellEl.textContent, 'Editor value is correct');
    });
  });
  t.it('Should changed effort value using editor', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      id: 'gantt',
      columns: [{
        type: EffortColumn.type,
        width: 150
      }]
    });
    t.chain({
      dblClick: '[data-index=2] [data-column=fullEffort]'
    }, {
      type: '100 m'
    }, function (next) {
      var task = gantt.taskStore.getAt(2);
      t.is(task.effort, 100, 'Effort has been changed correctly');
      t.is(task.effortUnit, 'minute', 'Effort unit has been changed correctly');
      next();
    }, // Cannot edit parent
    {
      dblClick: '.b-tree-parent-row [data-column=fullEffort]'
    }, function () {
      t.selectorNotExists('.b-editor', 'Editor not shown for parent task');
    });
  });
});