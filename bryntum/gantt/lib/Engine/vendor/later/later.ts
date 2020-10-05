/**
 * The code just copy/pasted from pre-built later.js file and made exported
 *
 * @private
 */
// @ts-ignore
export const later : any = (function() {
// @ts-ignore
  "use strict";
// @ts-ignore
  var later = {
// @ts-ignore
    version: "1.2.0"
// @ts-ignore
  };
// @ts-ignore
  if (!Array.prototype.indexOf) {
// @ts-ignore
    Array.prototype.indexOf = function(searchElement) {
// @ts-ignore
      "use strict";
// @ts-ignore
      if (this == null) {
// @ts-ignore
        throw new TypeError();
// @ts-ignore
      }
// @ts-ignore
      var t = Object(this);
// @ts-ignore
      var len = t.length >>> 0;
// @ts-ignore
      if (len === 0) {
// @ts-ignore
        return -1;
// @ts-ignore
      }
// @ts-ignore
      var n = 0;
// @ts-ignore
      if (arguments.length > 1) {
// @ts-ignore
        n = Number(arguments[1]);
// @ts-ignore
        if (n != n) {
// @ts-ignore
          n = 0;
// @ts-ignore
        } else if (n != 0 && n != Infinity && n != -Infinity) {
// @ts-ignore
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      if (n >= len) {
// @ts-ignore
        return -1;
// @ts-ignore
      }
// @ts-ignore
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
// @ts-ignore
      for (;k < len; k++) {
// @ts-ignore
        if (k in t && t[k] === searchElement) {
// @ts-ignore
          return k;
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return -1;
// @ts-ignore
    };
// @ts-ignore
  }
// @ts-ignore
  if (!String.prototype.trim) {
// @ts-ignore
    String.prototype.trim = function() {
// @ts-ignore
      return this.replace(/^\s+|\s+$/g, "");
// @ts-ignore
    };
// @ts-ignore
  }
// @ts-ignore
  later.array = {};
// @ts-ignore
  later.array.sort = function(arr, zeroIsLast) {
// @ts-ignore
    arr.sort(function(a, b) {
// @ts-ignore
      return +a - +b;
// @ts-ignore
    });
// @ts-ignore
    if (zeroIsLast && arr[0] === 0) {
// @ts-ignore
      arr.push(arr.shift());
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.array.next = function(val, values, extent) {
// @ts-ignore
    var cur, zeroIsLargest = extent[0] !== 0, nextIdx = 0;
// @ts-ignore
    for (var i = values.length - 1; i > -1; --i) {
// @ts-ignore
      cur = values[i];
// @ts-ignore
      if (cur === val) {
// @ts-ignore
        return cur;
// @ts-ignore
      }
// @ts-ignore
      if (cur > val || cur === 0 && zeroIsLargest && extent[1] > val) {
// @ts-ignore
        nextIdx = i;
// @ts-ignore
        continue;
// @ts-ignore
      }
// @ts-ignore
      break;
// @ts-ignore
    }
// @ts-ignore
    return values[nextIdx];
// @ts-ignore
  };
// @ts-ignore
  later.array.nextInvalid = function(val, values, extent) {
// @ts-ignore
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val), start = next;
// @ts-ignore
    while (next === (values[i] || zeroVal)) {
// @ts-ignore
      next++;
// @ts-ignore
      if (next > max) {
// @ts-ignore
        next = min;
// @ts-ignore
      }
// @ts-ignore
      i++;
// @ts-ignore
      if (i === len) {
// @ts-ignore
        i = 0;
// @ts-ignore
      }
// @ts-ignore
      if (next === start) {
// @ts-ignore
        return undefined;
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    return next;
// @ts-ignore
  };
// @ts-ignore
  later.array.prev = function(val, values, extent) {
// @ts-ignore
    var cur, len = values.length, zeroIsLargest = extent[0] !== 0, prevIdx = len - 1;
// @ts-ignore
    for (var i = 0; i < len; i++) {
// @ts-ignore
      cur = values[i];
// @ts-ignore
      if (cur === val) {
// @ts-ignore
        return cur;
// @ts-ignore
      }
// @ts-ignore
      if (cur < val || cur === 0 && zeroIsLargest && extent[1] < val) {
// @ts-ignore
        prevIdx = i;
// @ts-ignore
        continue;
// @ts-ignore
      }
// @ts-ignore
      break;
// @ts-ignore
    }
// @ts-ignore
    return values[prevIdx];
// @ts-ignore
  };
// @ts-ignore
  later.array.prevInvalid = function(val, values, extent) {
// @ts-ignore
    var min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0, next = val, i = values.indexOf(val), start = next;
// @ts-ignore
    while (next === (values[i] || zeroVal)) {
// @ts-ignore
      next--;
// @ts-ignore
      if (next < min) {
// @ts-ignore
        next = max;
// @ts-ignore
      }
// @ts-ignore
      i--;
// @ts-ignore
      if (i === -1) {
// @ts-ignore
        i = len - 1;
// @ts-ignore
      }
// @ts-ignore
      if (next === start) {
// @ts-ignore
        return undefined;
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    return next;
// @ts-ignore
  };
// @ts-ignore
  later.day = later.D = {
// @ts-ignore
    name: "day",
// @ts-ignore
    range: 86400,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.D || (d.D = later.date.getDate.call(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.D.val(d) === (val || later.D.extent(d)[1]);
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      if (d.DExtent) return d.DExtent;
// @ts-ignore
      var month = later.M.val(d), max = later.DAYS_IN_MONTH[month - 1];
// @ts-ignore
      if (month === 2 && later.dy.extent(d)[1] === 366) {
// @ts-ignore
        max = max + 1;
// @ts-ignore
      }
// @ts-ignore
      return d.DExtent = [ 1, max ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.DStart || (d.DStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.DEnd || (d.DEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > later.D.extent(d)[1] ? 1 : val;
// @ts-ignore
      var month = later.date.nextRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
// @ts-ignore
      val = val > DMax ? 1 : val || DMax;
// @ts-ignore
      return later.date.next(later.Y.val(month), later.M.val(month), val);
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      var month = later.date.prevRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
// @ts-ignore
      return later.date.prev(later.Y.val(month), later.M.val(month), val > DMax ? DMax : val || DMax);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.dayOfWeekCount = later.dc = {
// @ts-ignore
    name: "day of week count",
// @ts-ignore
    range: 604800,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.dc || (d.dc = Math.floor((later.D.val(d) - 1) / 7) + 1);
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.dc.val(d) === val || val === 0 && later.D.val(d) > later.D.extent(d)[1] - 7;
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      return d.dcExtent || (d.dcExtent = [ 1, Math.ceil(later.D.extent(d)[1] / 7) ]);
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.dcStart || (d.dcStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(1, (later.dc.val(d) - 1) * 7 + 1 || 1)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.dcEnd || (d.dcEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.dc.val(d) * 7, later.D.extent(d)[1])));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > later.dc.extent(d)[1] ? 1 : val;
// @ts-ignore
      var month = later.date.nextRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
// @ts-ignore
      val = val > dcMax ? 1 : val;
// @ts-ignore
      var next = later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
// @ts-ignore
      if (next.getTime() <= d.getTime()) {
// @ts-ignore
        month = later.M.next(d, later.M.val(d) + 1);
// @ts-ignore
        return later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      var month = later.date.prevRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
// @ts-ignore
      val = val > dcMax ? dcMax : val || dcMax;
// @ts-ignore
      return later.dc.end(later.date.prev(later.Y.val(month), later.M.val(month), 1 + 7 * (val - 1)));
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.dayOfWeek = later.dw = later.d = {
// @ts-ignore
    name: "day of week",
// @ts-ignore
    range: 86400,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.dw || (d.dw = later.date.getDay.call(d) + 1);
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.dw.val(d) === (val || 7);
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 1, 7 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return later.D.start(d);
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return later.D.end(d);
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > 7 ? 1 : val || 7;
// @ts-ignore
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val <= later.dw.val(d) ? 7 : 0));
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      val = val > 7 ? 7 : val || 7;
// @ts-ignore
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val >= later.dw.val(d) ? -7 : 0));
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.dayOfYear = later.dy = {
// @ts-ignore
    name: "day of year",
// @ts-ignore
    range: 86400,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.dy || (d.dy = Math.ceil(1 + (later.D.start(d).getTime() - later.Y.start(d).getTime()) / later.DAY));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.dy.val(d) === (val || later.dy.extent(d)[1]);
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      var year = later.Y.val(d);
// @ts-ignore
      return d.dyExtent || (d.dyExtent = [ 1, year % 4 ? 365 : 366 ]);
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return later.D.start(d);
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return later.D.end(d);
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > later.dy.extent(d)[1] ? 1 : val;
// @ts-ignore
      var year = later.date.nextRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
// @ts-ignore
      val = val > dyMax ? 1 : val || dyMax;
// @ts-ignore
      return later.date.next(later.Y.val(year), later.M.val(year), val);
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      var year = later.date.prevRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
// @ts-ignore
      val = val > dyMax ? dyMax : val || dyMax;
// @ts-ignore
      return later.date.prev(later.Y.val(year), later.M.val(year), val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.hour = later.h = {
// @ts-ignore
    name: "hour",
// @ts-ignore
    range: 3600,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.h || (d.h = later.date.getHour.call(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.h.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 0, 23 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.hStart || (d.hStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.hEnd || (d.hEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > 23 ? 0 : val;
// @ts-ignore
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.h.val(d) ? 1 : 0), val);
// @ts-ignore
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
// @ts-ignore
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), val + 1);
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      val = val > 23 ? 23 : val;
// @ts-ignore
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.h.val(d) ? -1 : 0), val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.minute = later.m = {
// @ts-ignore
    name: "minute",
// @ts-ignore
    range: 60,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.m || (d.m = later.date.getMin.call(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.m.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      return [ 0, 59 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.mStart || (d.mStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.mEnd || (d.mEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      var m = later.m.val(d), s = later.s.val(d), inc = val > 59 ? 60 - m : val <= m ? 60 - m + val : val - m, next = new Date(d.getTime() + inc * later.MIN - s * later.SEC);
// @ts-ignore
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
// @ts-ignore
        next = new Date(d.getTime() + (inc + 120) * later.MIN - s * later.SEC);
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      val = val > 59 ? 59 : val;
// @ts-ignore
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d) + (val >= later.m.val(d) ? -1 : 0), val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.month = later.M = {
// @ts-ignore
    name: "month",
// @ts-ignore
    range: 2629740,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.M || (d.M = later.date.getMonth.call(d) + 1);
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.M.val(d) === (val || 12);
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 1, 12 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.MStart || (d.MStart = later.date.next(later.Y.val(d), later.M.val(d)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.MEnd || (d.MEnd = later.date.prev(later.Y.val(d), later.M.val(d)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > 12 ? 1 : val || 12;
// @ts-ignore
      return later.date.next(later.Y.val(d) + (val > later.M.val(d) ? 0 : 1), val);
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      val = val > 12 ? 12 : val || 12;
// @ts-ignore
      return later.date.prev(later.Y.val(d) - (val >= later.M.val(d) ? 1 : 0), val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.second = later.s = {
// @ts-ignore
    name: "second",
// @ts-ignore
    range: 1,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.s || (d.s = later.date.getSec.call(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.s.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 0, 59 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      var s = later.s.val(d), inc = val > 59 ? 60 - s : val <= s ? 60 - s + val : val - s, next = new Date(d.getTime() + inc * later.SEC);
// @ts-ignore
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
// @ts-ignore
        next = new Date(d.getTime() + (inc + 7200) * later.SEC);
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val, cache) {
// @ts-ignore
      val = val > 59 ? 59 : val;
// @ts-ignore
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d) + (val >= later.s.val(d) ? -1 : 0), val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.time = later.t = {
// @ts-ignore
    name: "time",
// @ts-ignore
    range: 1,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.t || (d.t = later.h.val(d) * 3600 + later.m.val(d) * 60 + later.s.val(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.t.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 0, 86399 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > 86399 ? 0 : val;
// @ts-ignore
      var next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.t.val(d) ? 1 : 0), 0, 0, val);
// @ts-ignore
      if (!later.date.isUTC && next.getTime() < d.getTime()) {
// @ts-ignore
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), later.m.val(next), val + 7200);
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      val = val > 86399 ? 86399 : val;
// @ts-ignore
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.t.val(d) ? -1 : 0), 0, 0, val);
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.weekOfMonth = later.wm = {
// @ts-ignore
    name: "week of month",
// @ts-ignore
    range: 604800,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.wm || (d.wm = (later.D.val(d) + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(d))) / 7);
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.wm.val(d) === (val || later.wm.extent(d)[1]);
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      return d.wmExtent || (d.wmExtent = [ 1, (later.D.extent(d)[1] + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(later.M.end(d)))) / 7 ]);
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.wmStart || (d.wmStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(later.D.val(d) - later.dw.val(d) + 1, 1)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.wmEnd || (d.wmEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.D.val(d) + (7 - later.dw.val(d)), later.D.extent(d)[1])));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > later.wm.extent(d)[1] ? 1 : val;
// @ts-ignore
      var month = later.date.nextRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
// @ts-ignore
      val = val > wmMax ? 1 : val || wmMax;
// @ts-ignore
      return later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2)));
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      var month = later.date.prevRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
// @ts-ignore
      val = val > wmMax ? wmMax : val || wmMax;
// @ts-ignore
      return later.wm.end(later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2))));
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.weekOfYear = later.wy = {
// @ts-ignore
    name: "week of year (ISO)",
// @ts-ignore
    range: 604800,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      if (d.wy) return d.wy;
// @ts-ignore
      var wThur = later.dw.next(later.wy.start(d), 5), YThur = later.dw.next(later.Y.prev(wThur, later.Y.val(wThur) - 1), 5);
// @ts-ignore
      return d.wy = 1 + Math.ceil((wThur.getTime() - YThur.getTime()) / later.WEEK);
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.wy.val(d) === (val || later.wy.extent(d)[1]);
// @ts-ignore
    },
// @ts-ignore
    extent: function(d) {
// @ts-ignore
      if (d.wyExtent) return d.wyExtent;
// @ts-ignore
      var year = later.dw.next(later.wy.start(d), 5), dwFirst = later.dw.val(later.Y.start(year)), dwLast = later.dw.val(later.Y.end(year));
// @ts-ignore
      return d.wyExtent = [ 1, dwFirst === 5 || dwLast === 5 ? 53 : 52 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.wyStart || (d.wyStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.wyEnd || (d.wyEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      val = val > later.wy.extent(d)[1] ? 1 : val;
// @ts-ignore
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.nextRollover(wyThur, val, later.wy, later.Y);
// @ts-ignore
      if (later.wy.val(year) !== 1) {
// @ts-ignore
        year = later.dw.next(year, 2);
// @ts-ignore
      }
// @ts-ignore
      var wyMax = later.wy.extent(year)[1], wyStart = later.wy.start(year);
// @ts-ignore
      val = val > wyMax ? 1 : val || wyMax;
// @ts-ignore
      return later.date.next(later.Y.val(wyStart), later.M.val(wyStart), later.D.val(wyStart) + 7 * (val - 1));
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      var wyThur = later.dw.next(later.wy.start(d), 5), year = later.date.prevRollover(wyThur, val, later.wy, later.Y);
// @ts-ignore
      if (later.wy.val(year) !== 1) {
// @ts-ignore
        year = later.dw.next(year, 2);
// @ts-ignore
      }
// @ts-ignore
      var wyMax = later.wy.extent(year)[1], wyEnd = later.wy.end(year);
// @ts-ignore
      val = val > wyMax ? wyMax : val || wyMax;
// @ts-ignore
      return later.wy.end(later.date.next(later.Y.val(wyEnd), later.M.val(wyEnd), later.D.val(wyEnd) + 7 * (val - 1)));
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.year = later.Y = {
// @ts-ignore
    name: "year",
// @ts-ignore
    range: 31556900,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.Y || (d.Y = later.date.getYear.call(d));
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.Y.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 1970, 2099 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d.YStart || (d.YStart = later.date.next(later.Y.val(d)));
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d.YEnd || (d.YEnd = later.date.prev(later.Y.val(d)));
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      return val > later.Y.val(d) && val <= later.Y.extent()[1] ? later.date.next(val) : later.NEVER;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      return val < later.Y.val(d) && val >= later.Y.extent()[0] ? later.date.prev(val) : later.NEVER;
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.fullDate = later.fd = {
// @ts-ignore
    name: "full date",
// @ts-ignore
    range: 1,
// @ts-ignore
    val: function(d) {
// @ts-ignore
      return d.fd || (d.fd = d.getTime());
// @ts-ignore
    },
// @ts-ignore
    isValid: function(d, val) {
// @ts-ignore
      return later.fd.val(d) === val;
// @ts-ignore
    },
// @ts-ignore
    extent: function() {
// @ts-ignore
      return [ 0, 3250368e7 ];
// @ts-ignore
    },
// @ts-ignore
    start: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    end: function(d) {
// @ts-ignore
      return d;
// @ts-ignore
    },
// @ts-ignore
    next: function(d, val) {
// @ts-ignore
      return later.fd.val(d) < val ? new Date(val) : later.NEVER;
// @ts-ignore
    },
// @ts-ignore
    prev: function(d, val) {
// @ts-ignore
      return later.fd.val(d) > val ? new Date(val) : later.NEVER;
// @ts-ignore
    }
// @ts-ignore
  };
// @ts-ignore
  later.modifier = {};
// @ts-ignore
  later.modifier.after = later.modifier.a = function(constraint, values) {
// @ts-ignore
    var value = values[0];
// @ts-ignore
    return {
// @ts-ignore
      name: "after " + constraint.name,
// @ts-ignore
      range: (constraint.extent(new Date())[1] - value) * constraint.range,
// @ts-ignore
      val: constraint.val,
// @ts-ignore
      isValid: function(d, val) {
// @ts-ignore
        return this.val(d) >= value;
// @ts-ignore
      },
// @ts-ignore
      extent: constraint.extent,
// @ts-ignore
      start: constraint.start,
// @ts-ignore
      end: constraint.end,
// @ts-ignore
      next: function(startDate, val) {
// @ts-ignore
        if (val != value) val = constraint.extent(startDate)[0];
// @ts-ignore
        return constraint.next(startDate, val);
// @ts-ignore
      },
// @ts-ignore
      prev: function(startDate, val) {
// @ts-ignore
        val = val === value ? constraint.extent(startDate)[1] : value - 1;
// @ts-ignore
        return constraint.prev(startDate, val);
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.modifier.before = later.modifier.b = function(constraint, values) {
// @ts-ignore
    var value = values[values.length - 1];
// @ts-ignore
    return {
// @ts-ignore
      name: "before " + constraint.name,
// @ts-ignore
      range: constraint.range * (value - 1),
// @ts-ignore
      val: constraint.val,
// @ts-ignore
      isValid: function(d, val) {
// @ts-ignore
        return this.val(d) < value;
// @ts-ignore
      },
// @ts-ignore
      extent: constraint.extent,
// @ts-ignore
      start: constraint.start,
// @ts-ignore
      end: constraint.end,
// @ts-ignore
      next: function(startDate, val) {
// @ts-ignore
        val = val === value ? constraint.extent(startDate)[0] : value;
// @ts-ignore
        return constraint.next(startDate, val);
// @ts-ignore
      },
// @ts-ignore
      prev: function(startDate, val) {
// @ts-ignore
        val = val === value ? value - 1 : constraint.extent(startDate)[1];
// @ts-ignore
        return constraint.prev(startDate, val);
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.compile = function(schedDef) {
// @ts-ignore
    var constraints = [], constraintsLen = 0, tickConstraint;
// @ts-ignore
    for (var key in schedDef) {
// @ts-ignore
      var nameParts = key.split("_"), name = nameParts[0], mod = nameParts[1], vals = schedDef[key], constraint = mod ? later.modifier[mod](later[name], vals) : later[name];
// @ts-ignore
      constraints.push({
// @ts-ignore
        constraint: constraint,
// @ts-ignore
        vals: vals
// @ts-ignore
      });
// @ts-ignore
      constraintsLen++;
// @ts-ignore
    }
// @ts-ignore
    constraints.sort(function(a, b) {
// @ts-ignore
      var ra = a.constraint.range, rb = b.constraint.range;
// @ts-ignore
      return rb < ra ? -1 : rb > ra ? 1 : 0;
// @ts-ignore
    });
// @ts-ignore
    tickConstraint = constraints[constraintsLen - 1].constraint;
// @ts-ignore
    function compareFn(dir) {
// @ts-ignore
      return dir === "next" ? function(a, b) {
// @ts-ignore
        return a.getTime() > b.getTime();
// @ts-ignore
      } : function(a, b) {
// @ts-ignore
        return b.getTime() > a.getTime();
// @ts-ignore
      };
// @ts-ignore
    }
// @ts-ignore
    return {
// @ts-ignore
      start: function(dir, startDate) {
// @ts-ignore
        var next = startDate, nextVal = later.array[dir], maxAttempts = 1e3, done;
// @ts-ignore
        while (maxAttempts-- && !done && next) {
// @ts-ignore
          done = true;
// @ts-ignore
          for (var i = 0; i < constraintsLen; i++) {
// @ts-ignore
            var constraint = constraints[i].constraint, curVal = constraint.val(next), extent = constraint.extent(next), newVal = nextVal(curVal, constraints[i].vals, extent);
// @ts-ignore
            if (!constraint.isValid(next, newVal)) {
// @ts-ignore
              next = constraint[dir](next, newVal);
// @ts-ignore
              done = false;
// @ts-ignore
              break;
// @ts-ignore
            }
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
        if (next !== later.NEVER) {
// @ts-ignore
          next = dir === "next" ? tickConstraint.start(next) : tickConstraint.end(next);
// @ts-ignore
        }
// @ts-ignore
        return next;
// @ts-ignore
      },
// @ts-ignore
      end: function(dir, startDate) {
// @ts-ignore
        var result, nextVal = later.array[dir + "Invalid"], compare = compareFn(dir);
// @ts-ignore
        for (var i = constraintsLen - 1; i >= 0; i--) {
// @ts-ignore
          var constraint = constraints[i].constraint, curVal = constraint.val(startDate), extent = constraint.extent(startDate), newVal = nextVal(curVal, constraints[i].vals, extent), next;
// @ts-ignore
          if (newVal !== undefined) {
// @ts-ignore
            next = constraint[dir](startDate, newVal);
// @ts-ignore
            if (next && (!result || compare(result, next))) {
// @ts-ignore
              result = next;
// @ts-ignore
            }
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
        return result;
// @ts-ignore
      },
// @ts-ignore
      tick: function(dir, date) {
// @ts-ignore
        return new Date(dir === "next" ? tickConstraint.end(date).getTime() + later.SEC : tickConstraint.start(date).getTime() - later.SEC);
// @ts-ignore
      },
// @ts-ignore
      tickStart: function(date) {
// @ts-ignore
        return tickConstraint.start(date);
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.schedule = function(sched) {
// @ts-ignore
    if (!sched) throw new Error("Missing schedule definition.");
// @ts-ignore
    if (!sched.schedules) throw new Error("Definition must include at least one schedule.");
// @ts-ignore
    var schedules = [], schedulesLen = sched.schedules.length, exceptions = [], exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;
// @ts-ignore
    for (var i = 0; i < schedulesLen; i++) {
// @ts-ignore
      schedules.push(later.compile(sched.schedules[i]));
// @ts-ignore
    }
// @ts-ignore
    for (var j = 0; j < exceptionsLen; j++) {
// @ts-ignore
      exceptions.push(later.compile(sched.exceptions[j]));
// @ts-ignore
    }
// @ts-ignore
    function getInstances(dir, count, startDate, endDate, isRange) {
// @ts-ignore
      var compare = compareFn(dir), loopCount = count, maxAttempts = 1e3, schedStarts = [], exceptStarts = [], next, end, results = [], isForward = dir === "next", lastResult, rStart = isForward ? 0 : 1, rEnd = isForward ? 1 : 0;
// @ts-ignore
      startDate = startDate ? new Date(startDate) : new Date();
// @ts-ignore
      if (!startDate || !startDate.getTime()) throw new Error("Invalid start date.");
// @ts-ignore
      setNextStarts(dir, schedules, schedStarts, startDate);
// @ts-ignore
      setRangeStarts(dir, exceptions, exceptStarts, startDate);
// @ts-ignore
      while (maxAttempts-- && loopCount && (next = findNext(schedStarts, compare))) {
// @ts-ignore
        if (endDate && compare(next, endDate)) {
// @ts-ignore
          break;
// @ts-ignore
        }
// @ts-ignore
        if (exceptionsLen) {
// @ts-ignore
          updateRangeStarts(dir, exceptions, exceptStarts, next);
// @ts-ignore
          if (end = calcRangeOverlap(dir, exceptStarts, next)) {
// @ts-ignore
            updateNextStarts(dir, schedules, schedStarts, end);
// @ts-ignore
            continue;
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
        if (isRange) {
// @ts-ignore
          var maxEndDate = calcMaxEndDate(exceptStarts, compare);
// @ts-ignore
          end = calcEnd(dir, schedules, schedStarts, next, maxEndDate);
// @ts-ignore
          var r = isForward ? [ new Date(Math.max(startDate, next)), end ? new Date(endDate ? Math.min(end, endDate) : end) : undefined ] : [ end ? new Date(endDate ? Math.max(endDate, end.getTime() + later.SEC) : end.getTime() + later.SEC) : undefined, new Date(Math.min(startDate, next.getTime() + later.SEC)) ];
// @ts-ignore
          if (lastResult && r[rStart].getTime() === lastResult[rEnd].getTime()) {
// @ts-ignore
            lastResult[rEnd] = r[rEnd];
// @ts-ignore
            loopCount++;
// @ts-ignore
          } else {
// @ts-ignore
            lastResult = r;
// @ts-ignore
            results.push(lastResult);
// @ts-ignore
          }
// @ts-ignore
          if (!end) break;
// @ts-ignore
          updateNextStarts(dir, schedules, schedStarts, end);
// @ts-ignore
        } else {
// @ts-ignore
          results.push(isForward ? new Date(Math.max(startDate, next)) : getStart(schedules, schedStarts, next, endDate));
// @ts-ignore
          tickStarts(dir, schedules, schedStarts, next);
// @ts-ignore
        }
// @ts-ignore
        loopCount--;
// @ts-ignore
      }
// @ts-ignore
      for (var i = 0, len = results.length; i < len; i++) {
// @ts-ignore
        var result = results[i];
// @ts-ignore
        results[i] = Object.prototype.toString.call(result) === "[object Array]" ? [ cleanDate(result[0]), cleanDate(result[1]) ] : cleanDate(result);
// @ts-ignore
      }
// @ts-ignore
      return results.length === 0 ? later.NEVER : count === 1 ? results[0] : results;
// @ts-ignore
    }
// @ts-ignore
    function cleanDate(d) {
// @ts-ignore
      if (d instanceof Date && !isNaN(d.valueOf())) {
// @ts-ignore
        return new Date(d);
// @ts-ignore
      }
// @ts-ignore
      return undefined;
// @ts-ignore
    }
// @ts-ignore
    function setNextStarts(dir, schedArr, startsArr, startDate) {
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        startsArr[i] = schedArr[i].start(dir, startDate);
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function updateNextStarts(dir, schedArr, startsArr, startDate) {
// @ts-ignore
      var compare = compareFn(dir);
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        if (startsArr[i] && !compare(startsArr[i], startDate)) {
// @ts-ignore
          startsArr[i] = schedArr[i].start(dir, startDate);
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function setRangeStarts(dir, schedArr, rangesArr, startDate) {
// @ts-ignore
      var compare = compareFn(dir);
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        var nextStart = schedArr[i].start(dir, startDate);
// @ts-ignore
        if (!nextStart) {
// @ts-ignore
          rangesArr[i] = later.NEVER;
// @ts-ignore
        } else {
// @ts-ignore
          rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function updateRangeStarts(dir, schedArr, rangesArr, startDate) {
// @ts-ignore
      var compare = compareFn(dir);
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        if (rangesArr[i] && !compare(rangesArr[i][0], startDate)) {
// @ts-ignore
          var nextStart = schedArr[i].start(dir, startDate);
// @ts-ignore
          if (!nextStart) {
// @ts-ignore
            rangesArr[i] = later.NEVER;
// @ts-ignore
          } else {
// @ts-ignore
            rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function tickStarts(dir, schedArr, startsArr, startDate) {
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
// @ts-ignore
          startsArr[i] = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function getStart(schedArr, startsArr, startDate, minEndDate) {
// @ts-ignore
      var result;
// @ts-ignore
      for (var i = 0, len = startsArr.length; i < len; i++) {
// @ts-ignore
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
// @ts-ignore
          var start = schedArr[i].tickStart(startDate);
// @ts-ignore
          if (minEndDate && start < minEndDate) {
// @ts-ignore
            return minEndDate;
// @ts-ignore
          }
// @ts-ignore
          if (!result || start > result) {
// @ts-ignore
            result = start;
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return result;
// @ts-ignore
    }
// @ts-ignore
    function calcRangeOverlap(dir, rangesArr, startDate) {
// @ts-ignore
      var compare = compareFn(dir), result;
// @ts-ignore
      for (var i = 0, len = rangesArr.length; i < len; i++) {
// @ts-ignore
        var range = rangesArr[i];
// @ts-ignore
        if (range && !compare(range[0], startDate) && (!range[1] || compare(range[1], startDate))) {
// @ts-ignore
          if (!result || compare(range[1], result)) {
// @ts-ignore
            result = range[1];
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return result;
// @ts-ignore
    }
// @ts-ignore
    function calcMaxEndDate(exceptsArr, compare) {
// @ts-ignore
      var result;
// @ts-ignore
      for (var i = 0, len = exceptsArr.length; i < len; i++) {
// @ts-ignore
        if (exceptsArr[i] && (!result || compare(result, exceptsArr[i][0]))) {
// @ts-ignore
          result = exceptsArr[i][0];
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return result;
// @ts-ignore
    }
// @ts-ignore
    function calcEnd(dir, schedArr, startsArr, startDate, maxEndDate) {
// @ts-ignore
      var compare = compareFn(dir), result;
// @ts-ignore
      for (var i = 0, len = schedArr.length; i < len; i++) {
// @ts-ignore
        var start = startsArr[i];
// @ts-ignore
        if (start && start.getTime() === startDate.getTime()) {
// @ts-ignore
          var end = schedArr[i].end(dir, start);
// @ts-ignore
          if (maxEndDate && (!end || compare(end, maxEndDate))) {
// @ts-ignore
            return maxEndDate;
// @ts-ignore
          }
// @ts-ignore
          if (!result || compare(end, result)) {
// @ts-ignore
            result = end;
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return result;
// @ts-ignore
    }
// @ts-ignore
    function compareFn(dir) {
// @ts-ignore
      return dir === "next" ? function(a, b) {
// @ts-ignore
        return !b || a.getTime() > b.getTime();
// @ts-ignore
      } : function(a, b) {
// @ts-ignore
        return !a || b.getTime() > a.getTime();
// @ts-ignore
      };
// @ts-ignore
    }
// @ts-ignore
    function findNext(arr, compare) {
// @ts-ignore
      var next = arr[0];
// @ts-ignore
      for (var i = 1, len = arr.length; i < len; i++) {
// @ts-ignore
        if (arr[i] && compare(next, arr[i])) {
// @ts-ignore
          next = arr[i];
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return next;
// @ts-ignore
    }
// @ts-ignore
    return {
// @ts-ignore
      isValid: function(d) {
// @ts-ignore
        return getInstances("next", 1, d, d) !== later.NEVER;
// @ts-ignore
      },
// @ts-ignore
      next: function(count, startDate, endDate) {
// @ts-ignore
        return getInstances("next", count || 1, startDate, endDate);
// @ts-ignore
      },
// @ts-ignore
      prev: function(count, startDate, endDate) {
// @ts-ignore
        return getInstances("prev", count || 1, startDate, endDate);
// @ts-ignore
      },
// @ts-ignore
      nextRange: function(count, startDate, endDate) {
// @ts-ignore
        return getInstances("next", count || 1, startDate, endDate, true);
// @ts-ignore
      },
// @ts-ignore
      prevRange: function(count, startDate, endDate) {
// @ts-ignore
        return getInstances("prev", count || 1, startDate, endDate, true);
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.setTimeout = function(fn, sched) {
// @ts-ignore
    var s = later.schedule(sched), t;
// @ts-ignore
    if (fn) {
// @ts-ignore
      scheduleTimeout();
// @ts-ignore
    }
// @ts-ignore
    function scheduleTimeout() {
// @ts-ignore
      var now = Date.now(), next = s.next(2, now);
// @ts-ignore
      if (!next[0]) {
// @ts-ignore
        t = undefined;
// @ts-ignore
        return;
// @ts-ignore
      }
// @ts-ignore
      var diff = next[0].getTime() - now;
// @ts-ignore
      if (diff < 1e3) {
// @ts-ignore
        diff = next[1] ? next[1].getTime() - now : 1e3;
// @ts-ignore
      }
// @ts-ignore
      if (diff < 2147483647) {
// @ts-ignore
        t = setTimeout(fn, diff);
// @ts-ignore
      } else {
// @ts-ignore
        t = setTimeout(scheduleTimeout, 2147483647);
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    return {
// @ts-ignore
      isDone: function() {
// @ts-ignore
        return !t;
// @ts-ignore
      },
// @ts-ignore
      clear: function() {
// @ts-ignore
        clearTimeout(t);
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.setInterval = function(fn, sched) {
// @ts-ignore
    if (!fn) {
// @ts-ignore
      return;
// @ts-ignore
    }
// @ts-ignore
    var t = later.setTimeout(scheduleTimeout, sched), done = t.isDone();
// @ts-ignore
    function scheduleTimeout() {
// @ts-ignore
      if (!done) {
// @ts-ignore
        fn();
// @ts-ignore
        t = later.setTimeout(scheduleTimeout, sched);
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    return {
// @ts-ignore
      isDone: function() {
// @ts-ignore
        return t.isDone();
// @ts-ignore
      },
// @ts-ignore
      clear: function() {
// @ts-ignore
        done = true;
// @ts-ignore
        t.clear();
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.date = {};
// @ts-ignore
  later.date.timezone = function(useLocalTime) {
// @ts-ignore
    later.date.build = useLocalTime ? function(Y, M, D, h, m, s) {
// @ts-ignore
      return new Date(Y, M, D, h, m, s);
// @ts-ignore
    } : function(Y, M, D, h, m, s) {
// @ts-ignore
      return new Date(Date.UTC(Y, M, D, h, m, s));
// @ts-ignore
    };
// @ts-ignore
    var get = useLocalTime ? "get" : "getUTC", d = Date.prototype;
// @ts-ignore
    later.date.getYear = d[get + "FullYear"];
// @ts-ignore
    later.date.getMonth = d[get + "Month"];
// @ts-ignore
    later.date.getDate = d[get + "Date"];
// @ts-ignore
    later.date.getDay = d[get + "Day"];
// @ts-ignore
    later.date.getHour = d[get + "Hours"];
// @ts-ignore
    later.date.getMin = d[get + "Minutes"];
// @ts-ignore
    later.date.getSec = d[get + "Seconds"];
// @ts-ignore
    later.date.isUTC = !useLocalTime;
// @ts-ignore
  };
// @ts-ignore
  later.date.UTC = function() {
// @ts-ignore
    later.date.timezone(false);
// @ts-ignore
  };
// @ts-ignore
  later.date.localTime = function() {
// @ts-ignore
    later.date.timezone(true);
// @ts-ignore
  };
// @ts-ignore
  later.date.UTC();
// @ts-ignore
  later.SEC = 1e3;
// @ts-ignore
  later.MIN = later.SEC * 60;
// @ts-ignore
  later.HOUR = later.MIN * 60;
// @ts-ignore
  later.DAY = later.HOUR * 24;
// @ts-ignore
  later.WEEK = later.DAY * 7;
// @ts-ignore
  later.DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
// @ts-ignore
  later.NEVER = 0;
// @ts-ignore
  later.date.next = function(Y, M, D, h, m, s) {
// @ts-ignore
    return later.date.build(Y, M !== undefined ? M - 1 : 0, D !== undefined ? D : 1, h || 0, m || 0, s || 0);
// @ts-ignore
  };
// @ts-ignore
  later.date.nextRollover = function(d, val, constraint, period) {
// @ts-ignore
    var cur = constraint.val(d), max = constraint.extent(d)[1];
// @ts-ignore
    return (val || max) <= cur || val > max ? new Date(period.end(d).getTime() + later.SEC) : period.start(d);
// @ts-ignore
  };
// @ts-ignore
  later.date.prev = function(Y, M, D, h, m, s) {
// @ts-ignore
    var len = arguments.length;
// @ts-ignore
    M = len < 2 ? 11 : M - 1;
// @ts-ignore
    D = len < 3 ? later.D.extent(later.date.next(Y, M + 1))[1] : D;
// @ts-ignore
    h = len < 4 ? 23 : h;
// @ts-ignore
    m = len < 5 ? 59 : m;
// @ts-ignore
    s = len < 6 ? 59 : s;
// @ts-ignore
    return later.date.build(Y, M, D, h, m, s);
// @ts-ignore
  };
// @ts-ignore
  later.date.prevRollover = function(d, val, constraint, period) {
// @ts-ignore
    var cur = constraint.val(d);
// @ts-ignore
    return val >= cur || !val ? period.start(period.prev(d, period.val(d) - 1)) : period.start(d);
// @ts-ignore
  };
// @ts-ignore
  later.parse = {};
// @ts-ignore
  later.parse.cron = function(expr, hasSeconds) {
// @ts-ignore
    var NAMES = {
// @ts-ignore
      JAN: 1,
// @ts-ignore
      FEB: 2,
// @ts-ignore
      MAR: 3,
// @ts-ignore
      APR: 4,
// @ts-ignore
      MAY: 5,
// @ts-ignore
      JUN: 6,
// @ts-ignore
      JUL: 7,
// @ts-ignore
      AUG: 8,
// @ts-ignore
      SEP: 9,
// @ts-ignore
      OCT: 10,
// @ts-ignore
      NOV: 11,
// @ts-ignore
      DEC: 12,
// @ts-ignore
      SUN: 1,
// @ts-ignore
      MON: 2,
// @ts-ignore
      TUE: 3,
// @ts-ignore
      WED: 4,
// @ts-ignore
      THU: 5,
// @ts-ignore
      FRI: 6,
// @ts-ignore
      SAT: 7
// @ts-ignore
    };
// @ts-ignore
    var REPLACEMENTS = {
// @ts-ignore
      "* * * * * *": "0/1 * * * * *",
// @ts-ignore
      "@YEARLY": "0 0 1 1 *",
// @ts-ignore
      "@ANNUALLY": "0 0 1 1 *",
// @ts-ignore
      "@MONTHLY": "0 0 1 * *",
// @ts-ignore
      "@WEEKLY": "0 0 * * 0",
// @ts-ignore
      "@DAILY": "0 0 * * *",
// @ts-ignore
      "@HOURLY": "0 * * * *"
// @ts-ignore
    };
// @ts-ignore
    var FIELDS = {
// @ts-ignore
      s: [ 0, 0, 59 ],
// @ts-ignore
      m: [ 1, 0, 59 ],
// @ts-ignore
      h: [ 2, 0, 23 ],
// @ts-ignore
      D: [ 3, 1, 31 ],
// @ts-ignore
      M: [ 4, 1, 12 ],
// @ts-ignore
      Y: [ 6, 1970, 2099 ],
// @ts-ignore
      d: [ 5, 1, 7, 1 ]
// @ts-ignore
    };
// @ts-ignore
    function getValue(value, offset, max) {
// @ts-ignore
      return isNaN(value) ? NAMES[value] || null : Math.min(+value + (offset || 0), max || 9999);
// @ts-ignore
    }
// @ts-ignore
    function cloneSchedule(sched) {
// @ts-ignore
      var clone = {}, field;
// @ts-ignore
      for (field in sched) {
// @ts-ignore
        if (field !== "dc" && field !== "d") {
// @ts-ignore
          clone[field] = sched[field].slice(0);
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return clone;
// @ts-ignore
    }
// @ts-ignore
    function add(sched, name, min, max, inc) {
// @ts-ignore
      var i = min;
// @ts-ignore
      if (!sched[name]) {
// @ts-ignore
        sched[name] = [];
// @ts-ignore
      }
// @ts-ignore
      while (i <= max) {
// @ts-ignore
        if (sched[name].indexOf(i) < 0) {
// @ts-ignore
          sched[name].push(i);
// @ts-ignore
        }
// @ts-ignore
        i += inc || 1;
// @ts-ignore
      }
// @ts-ignore
      sched[name].sort(function(a, b) {
// @ts-ignore
        return a - b;
// @ts-ignore
      });
// @ts-ignore
    }
// @ts-ignore
    function addHash(schedules, curSched, value, hash) {
// @ts-ignore
      if (curSched.d && !curSched.dc || curSched.dc && curSched.dc.indexOf(hash) < 0) {
// @ts-ignore
        schedules.push(cloneSchedule(curSched));
// @ts-ignore
        curSched = schedules[schedules.length - 1];
// @ts-ignore
      }
// @ts-ignore
      add(curSched, "d", value, value);
// @ts-ignore
      add(curSched, "dc", hash, hash);
// @ts-ignore
    }
// @ts-ignore
    function addWeekday(s, curSched, value) {
// @ts-ignore
      var except1 = {}, except2 = {};
// @ts-ignore
      if (value === 1) {
// @ts-ignore
        add(curSched, "D", 1, 3);
// @ts-ignore
        add(curSched, "d", NAMES.MON, NAMES.FRI);
// @ts-ignore
        add(except1, "D", 2, 2);
// @ts-ignore
        add(except1, "d", NAMES.TUE, NAMES.FRI);
// @ts-ignore
        add(except2, "D", 3, 3);
// @ts-ignore
        add(except2, "d", NAMES.TUE, NAMES.FRI);
// @ts-ignore
      } else {
// @ts-ignore
        add(curSched, "D", value - 1, value + 1);
// @ts-ignore
        add(curSched, "d", NAMES.MON, NAMES.FRI);
// @ts-ignore
        add(except1, "D", value - 1, value - 1);
// @ts-ignore
        add(except1, "d", NAMES.MON, NAMES.THU);
// @ts-ignore
        add(except2, "D", value + 1, value + 1);
// @ts-ignore
        add(except2, "d", NAMES.TUE, NAMES.FRI);
// @ts-ignore
      }
// @ts-ignore
      s.exceptions.push(except1);
// @ts-ignore
      s.exceptions.push(except2);
// @ts-ignore
    }
// @ts-ignore
    function addRange(item, curSched, name, min, max, offset) {
// @ts-ignore
      var incSplit = item.split("/"), inc = +incSplit[1], range = incSplit[0];
// @ts-ignore
      if (range !== "*" && range !== "0") {
// @ts-ignore
        var rangeSplit = range.split("-");
// @ts-ignore
        min = getValue(rangeSplit[0], offset, max);
// @ts-ignore
        max = getValue(rangeSplit[1], offset, max) || max;
// @ts-ignore
      }
// @ts-ignore
      add(curSched, name, min, max, inc);
// @ts-ignore
    }
// @ts-ignore
    function parse(item, s, name, min, max, offset) {
// @ts-ignore
      var value, split, schedules = s.schedules, curSched = schedules[schedules.length - 1];
// @ts-ignore
      if (item === "L") {
// @ts-ignore
        item = min - 1;
// @ts-ignore
      }
// @ts-ignore
      if ((value = getValue(item, offset, max)) !== null) {
// @ts-ignore
        add(curSched, name, value, value);
// @ts-ignore
      } else if ((value = getValue(item.replace("W", ""), offset, max)) !== null) {
// @ts-ignore
        addWeekday(s, curSched, value);
// @ts-ignore
      } else if ((value = getValue(item.replace("L", ""), offset, max)) !== null) {
// @ts-ignore
        addHash(schedules, curSched, value, min - 1);
// @ts-ignore
      } else if ((split = item.split("#")).length === 2) {
// @ts-ignore
        value = getValue(split[0], offset, max);
// @ts-ignore
        addHash(schedules, curSched, value, getValue(split[1]));
// @ts-ignore
      } else {
// @ts-ignore
        addRange(item, curSched, name, min, max, offset);
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function isHash(item) {
// @ts-ignore
      return item.indexOf("#") > -1 || item.indexOf("L") > 0;
// @ts-ignore
    }
// @ts-ignore
    function itemSorter(a, b) {
// @ts-ignore
      return isHash(a) && !isHash(b) ? 1 : a - b;
// @ts-ignore
    }
// @ts-ignore
    function parseExpr(expr) {
// @ts-ignore
      var schedule = {
// @ts-ignore
        schedules: [ {} ],
// @ts-ignore
        exceptions: []
// @ts-ignore
      }, components = expr.replace(/(\s)+/g, " ").split(" "), field, f, component, items;
// @ts-ignore
      for (field in FIELDS) {
// @ts-ignore
        f = FIELDS[field];
// @ts-ignore
        component = components[f[0]];
// @ts-ignore
        if (component && component !== "*" && component !== "?") {
// @ts-ignore
          items = component.split(",").sort(itemSorter);
// @ts-ignore
          var i, length = items.length;
// @ts-ignore
          for (i = 0; i < length; i++) {
// @ts-ignore
            parse(items[i], schedule, field, f[1], f[2], f[3]);
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return schedule;
// @ts-ignore
    }
// @ts-ignore
    function prepareExpr(expr) {
// @ts-ignore
      var prepared = expr.toUpperCase();
// @ts-ignore
      return REPLACEMENTS[prepared] || prepared;
// @ts-ignore
    }
// @ts-ignore
    var e = prepareExpr(expr);
// @ts-ignore
    return parseExpr(hasSeconds ? e : "0 " + e);
// @ts-ignore
  };
// @ts-ignore
  later.parse.recur = function() {
// @ts-ignore
    var schedules = [], exceptions = [], cur, curArr = schedules, curName, values, every, modifier, applyMin, applyMax, i, last;
// @ts-ignore
    function add(name, min, max) {
// @ts-ignore
      name = modifier ? name + "_" + modifier : name;
// @ts-ignore
      if (!cur) {
// @ts-ignore
        curArr.push({});
// @ts-ignore
        cur = curArr[0];
// @ts-ignore
      }
// @ts-ignore
      if (!cur[name]) {
// @ts-ignore
        cur[name] = [];
// @ts-ignore
      }
// @ts-ignore
      curName = cur[name];
// @ts-ignore
      if (every) {
// @ts-ignore
        values = [];
// @ts-ignore
        for (i = min; i <= max; i += every) {
// @ts-ignore
          values.push(i);
// @ts-ignore
        }
// @ts-ignore
        last = {
// @ts-ignore
          n: name,
// @ts-ignore
          x: every,
// @ts-ignore
          c: curName.length,
// @ts-ignore
          m: max
// @ts-ignore
        };
// @ts-ignore
      }
// @ts-ignore
      values = applyMin ? [ min ] : applyMax ? [ max ] : values;
// @ts-ignore
      var length = values.length;
// @ts-ignore
      for (i = 0; i < length; i += 1) {
// @ts-ignore
        var val = values[i];
// @ts-ignore
        if (curName.indexOf(val) < 0) {
// @ts-ignore
          curName.push(val);
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      values = every = modifier = applyMin = applyMax = 0;
// @ts-ignore
    }
// @ts-ignore
    return {
// @ts-ignore
      schedules: schedules,
// @ts-ignore
      exceptions: exceptions,
// @ts-ignore
      on: function() {
// @ts-ignore
        values = arguments[0] instanceof Array ? arguments[0] : arguments;
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      every: function(x) {
// @ts-ignore
        every = x || 1;
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      after: function(x) {
// @ts-ignore
        modifier = "a";
// @ts-ignore
        values = [ x ];
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      before: function(x) {
// @ts-ignore
        modifier = "b";
// @ts-ignore
        values = [ x ];
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      first: function() {
// @ts-ignore
        applyMin = 1;
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      last: function() {
// @ts-ignore
        applyMax = 1;
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      time: function() {
// @ts-ignore
        for (var i = 0, len = values.length; i < len; i++) {
// @ts-ignore
          var split = values[i].split(":");
// @ts-ignore
          if (split.length < 3) split.push(0);
// @ts-ignore
          values[i] = +split[0] * 3600 + +split[1] * 60 + +split[2];
// @ts-ignore
        }
// @ts-ignore
        add("t");
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      second: function() {
// @ts-ignore
        add("s", 0, 59);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      minute: function() {
// @ts-ignore
        add("m", 0, 59);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      hour: function() {
// @ts-ignore
        add("h", 0, 23);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      dayOfMonth: function() {
// @ts-ignore
        add("D", 1, applyMax ? 0 : 31);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      dayOfWeek: function() {
// @ts-ignore
        add("d", 1, 7);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      onWeekend: function() {
// @ts-ignore
        values = [ 1, 7 ];
// @ts-ignore
        return this.dayOfWeek();
// @ts-ignore
      },
// @ts-ignore
      onWeekday: function() {
// @ts-ignore
        values = [ 2, 3, 4, 5, 6 ];
// @ts-ignore
        return this.dayOfWeek();
// @ts-ignore
      },
// @ts-ignore
      dayOfWeekCount: function() {
// @ts-ignore
        add("dc", 1, applyMax ? 0 : 5);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      dayOfYear: function() {
// @ts-ignore
        add("dy", 1, applyMax ? 0 : 366);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      weekOfMonth: function() {
// @ts-ignore
        add("wm", 1, applyMax ? 0 : 5);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      weekOfYear: function() {
// @ts-ignore
        add("wy", 1, applyMax ? 0 : 53);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      month: function() {
// @ts-ignore
        add("M", 1, 12);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      year: function() {
// @ts-ignore
        add("Y", 1970, 2450);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      fullDate: function() {
// @ts-ignore
        for (var i = 0, len = values.length; i < len; i++) {
// @ts-ignore
          values[i] = values[i].getTime();
// @ts-ignore
        }
// @ts-ignore
        add("fd");
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      customModifier: function(id, vals) {
// @ts-ignore
        var custom = later.modifier[id];
// @ts-ignore
        if (!custom) throw new Error("Custom modifier " + id + " not recognized!");
// @ts-ignore
        modifier = id;
// @ts-ignore
        values = arguments[1] instanceof Array ? arguments[1] : [ arguments[1] ];
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      customPeriod: function(id) {
// @ts-ignore
        var custom = later[id];
// @ts-ignore
        if (!custom) throw new Error("Custom time period " + id + " not recognized!");
// @ts-ignore
        add(id, custom.extent(new Date())[0], custom.extent(new Date())[1]);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      startingOn: function(start) {
// @ts-ignore
        return this.between(start, last.m);
// @ts-ignore
      },
// @ts-ignore
      between: function(start, end) {
// @ts-ignore
        cur[last.n] = cur[last.n].splice(0, last.c);
// @ts-ignore
        every = last.x;
// @ts-ignore
        add(last.n, start, end);
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      and: function() {
// @ts-ignore
        cur = curArr[curArr.push({}) - 1];
// @ts-ignore
        return this;
// @ts-ignore
      },
// @ts-ignore
      except: function() {
// @ts-ignore
        curArr = exceptions;
// @ts-ignore
        cur = null;
// @ts-ignore
        return this;
// @ts-ignore
      }
// @ts-ignore
    };
// @ts-ignore
  };
// @ts-ignore
  later.parse.text = function(str) {
// @ts-ignore
    var recur = later.parse.recur, pos = 0, input = "", error;
// @ts-ignore
    var TOKENTYPES = {
// @ts-ignore
      eof: /^$/,
// @ts-ignore
      rank: /^((\d\d\d\d)|([2-5]?1(st)?|[2-5]?2(nd)?|[2-5]?3(rd)?|(0|[1-5]?[4-9]|[1-5]0|1[1-3])(th)?))\b/,
// @ts-ignore
      time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
// @ts-ignore
      dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
// @ts-ignore
      monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
// @ts-ignore
      yearIndex: /^(\d\d\d\d)\b/,
// @ts-ignore
      every: /^every\b/,
// @ts-ignore
      after: /^after\b/,
// @ts-ignore
      before: /^before\b/,
// @ts-ignore
      second: /^(s|sec(ond)?(s)?)\b/,
// @ts-ignore
      minute: /^(m|min(ute)?(s)?)\b/,
// @ts-ignore
      hour: /^(h|hour(s)?)\b/,
// @ts-ignore
      day: /^(day(s)?( of the month)?)\b/,
// @ts-ignore
      dayInstance: /^day instance\b/,
// @ts-ignore
      dayOfWeek: /^day(s)? of the week\b/,
// @ts-ignore
      dayOfYear: /^day(s)? of the year\b/,
// @ts-ignore
      weekOfYear: /^week(s)?( of the year)?\b/,
// @ts-ignore
      weekOfMonth: /^week(s)? of the month\b/,
// @ts-ignore
      weekday: /^weekday\b/,
// @ts-ignore
      weekend: /^weekend\b/,
// @ts-ignore
      month: /^month(s)?\b/,
// @ts-ignore
      year: /^year(s)?\b/,
// @ts-ignore
      between: /^between (the)?\b/,
// @ts-ignore
      start: /^(start(ing)? (at|on( the)?)?)\b/,
// @ts-ignore
      at: /^(at|@)\b/,
// @ts-ignore
      and: /^(,|and\b)/,
// @ts-ignore
      except: /^(except\b)/,
// @ts-ignore
      also: /(also)\b/,
// @ts-ignore
      first: /^(first)\b/,
// @ts-ignore
      last: /^last\b/,
// @ts-ignore
      "in": /^in\b/,
// @ts-ignore
      of: /^of\b/,
// @ts-ignore
      onthe: /^on the\b/,
// @ts-ignore
      on: /^on\b/,
// @ts-ignore
      through: /(-|^(to|through)\b)/
// @ts-ignore
    };
// @ts-ignore
    var NAMES = {
// @ts-ignore
      jan: 1,
// @ts-ignore
      feb: 2,
// @ts-ignore
      mar: 3,
// @ts-ignore
      apr: 4,
// @ts-ignore
      may: 5,
// @ts-ignore
      jun: 6,
// @ts-ignore
      jul: 7,
// @ts-ignore
      aug: 8,
// @ts-ignore
      sep: 9,
// @ts-ignore
      oct: 10,
// @ts-ignore
      nov: 11,
// @ts-ignore
      dec: 12,
// @ts-ignore
      sun: 1,
// @ts-ignore
      mon: 2,
// @ts-ignore
      tue: 3,
// @ts-ignore
      wed: 4,
// @ts-ignore
      thu: 5,
// @ts-ignore
      fri: 6,
// @ts-ignore
      sat: 7,
// @ts-ignore
      "1st": 1,
// @ts-ignore
      fir: 1,
// @ts-ignore
      "2nd": 2,
// @ts-ignore
      sec: 2,
// @ts-ignore
      "3rd": 3,
// @ts-ignore
      thi: 3,
// @ts-ignore
      "4th": 4,
// @ts-ignore
      "for": 4
// @ts-ignore
    };
// @ts-ignore
    function t(start, end, text, type) {
// @ts-ignore
      return {
// @ts-ignore
        startPos: start,
// @ts-ignore
        endPos: end,
// @ts-ignore
        text: text,
// @ts-ignore
        type: type
// @ts-ignore
      };
// @ts-ignore
    }
// @ts-ignore
    function peek(expected) {
// @ts-ignore
      var scanTokens = expected instanceof Array ? expected : [ expected ], whiteSpace = /\s+/, token, curInput, m, scanToken, start, len;
// @ts-ignore
      scanTokens.push(whiteSpace);
// @ts-ignore
      start = pos;
// @ts-ignore
      while (!token || token.type === whiteSpace) {
// @ts-ignore
        len = -1;
// @ts-ignore
        curInput = input.substring(start);
// @ts-ignore
        token = t(start, start, input.split(whiteSpace)[0]);
// @ts-ignore
        var i, length = scanTokens.length;
// @ts-ignore
        for (i = 0; i < length; i++) {
// @ts-ignore
          scanToken = scanTokens[i];
// @ts-ignore
          m = scanToken.exec(curInput);
// @ts-ignore
          if (m && m.index === 0 && m[0].length > len) {
// @ts-ignore
            len = m[0].length;
// @ts-ignore
            token = t(start, start + len, curInput.substring(0, len), scanToken);
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
        if (token.type === whiteSpace) {
// @ts-ignore
          start = token.endPos;
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return token;
// @ts-ignore
    }
// @ts-ignore
    function scan(expectedToken) {
// @ts-ignore
      var token = peek(expectedToken);
// @ts-ignore
      pos = token.endPos;
// @ts-ignore
      return token;
// @ts-ignore
    }
// @ts-ignore
    function parseThroughExpr(tokenType) {
// @ts-ignore
      var start = +parseTokenValue(tokenType), end = checkAndParse(TOKENTYPES.through) ? +parseTokenValue(tokenType) : start, nums = [];
// @ts-ignore
      for (var i = start; i <= end; i++) {
// @ts-ignore
        nums.push(i);
// @ts-ignore
      }
// @ts-ignore
      return nums;
// @ts-ignore
    }
// @ts-ignore
    function parseRanges(tokenType) {
// @ts-ignore
      var nums = parseThroughExpr(tokenType);
// @ts-ignore
      while (checkAndParse(TOKENTYPES.and)) {
// @ts-ignore
        nums = nums.concat(parseThroughExpr(tokenType));
// @ts-ignore
      }
// @ts-ignore
      return nums;
// @ts-ignore
    }
// @ts-ignore
    function parseEvery(r) {
// @ts-ignore
      var num, period, start, end;
// @ts-ignore
      if (checkAndParse(TOKENTYPES.weekend)) {
// @ts-ignore
        r.on(NAMES.sun, NAMES.sat).dayOfWeek();
// @ts-ignore
      } else if (checkAndParse(TOKENTYPES.weekday)) {
// @ts-ignore
        r.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();
// @ts-ignore
      } else {
// @ts-ignore
        num = parseTokenValue(TOKENTYPES.rank);
// @ts-ignore
        r.every(num);
// @ts-ignore
        period = parseTimePeriod(r);
// @ts-ignore
        if (checkAndParse(TOKENTYPES.start)) {
// @ts-ignore
          num = parseTokenValue(TOKENTYPES.rank);
// @ts-ignore
          r.startingOn(num);
// @ts-ignore
          parseToken(period.type);
// @ts-ignore
        } else if (checkAndParse(TOKENTYPES.between)) {
// @ts-ignore
          start = parseTokenValue(TOKENTYPES.rank);
// @ts-ignore
          if (checkAndParse(TOKENTYPES.and)) {
// @ts-ignore
            end = parseTokenValue(TOKENTYPES.rank);
// @ts-ignore
            r.between(start, end);
// @ts-ignore
          }
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
    }
// @ts-ignore
    function parseOnThe(r) {
// @ts-ignore
      if (checkAndParse(TOKENTYPES.first)) {
// @ts-ignore
        r.first();
// @ts-ignore
      } else if (checkAndParse(TOKENTYPES.last)) {
// @ts-ignore
        r.last();
// @ts-ignore
      } else {
// @ts-ignore
        r.on(parseRanges(TOKENTYPES.rank));
// @ts-ignore
      }
// @ts-ignore
      parseTimePeriod(r);
// @ts-ignore
    }
// @ts-ignore
    function parseScheduleExpr(str) {
// @ts-ignore
      pos = 0;
// @ts-ignore
      input = str;
// @ts-ignore
      error = -1;
// @ts-ignore
      var r = recur();
// @ts-ignore
      while (pos < input.length && error < 0) {
// @ts-ignore
        var token = parseToken([ TOKENTYPES.every, TOKENTYPES.after, TOKENTYPES.before, TOKENTYPES.onthe, TOKENTYPES.on, TOKENTYPES.of, TOKENTYPES["in"], TOKENTYPES.at, TOKENTYPES.and, TOKENTYPES.except, TOKENTYPES.also ]);
// @ts-ignore
        switch (token.type) {
// @ts-ignore
         case TOKENTYPES.every:
// @ts-ignore
          parseEvery(r);
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.after:
// @ts-ignore
          if (peek(TOKENTYPES.time).type !== undefined) {
// @ts-ignore
            r.after(parseTokenValue(TOKENTYPES.time));
// @ts-ignore
            r.time();
// @ts-ignore
          } else {
// @ts-ignore
            r.after(parseTokenValue(TOKENTYPES.rank));
// @ts-ignore
            parseTimePeriod(r);
// @ts-ignore
          }
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.before:
// @ts-ignore
          if (peek(TOKENTYPES.time).type !== undefined) {
// @ts-ignore
            r.before(parseTokenValue(TOKENTYPES.time));
// @ts-ignore
            r.time();
// @ts-ignore
          } else {
// @ts-ignore
            r.before(parseTokenValue(TOKENTYPES.rank));
// @ts-ignore
            parseTimePeriod(r);
// @ts-ignore
          }
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.onthe:
// @ts-ignore
          parseOnThe(r);
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.on:
// @ts-ignore
          r.on(parseRanges(TOKENTYPES.dayName)).dayOfWeek();
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.of:
// @ts-ignore
          r.on(parseRanges(TOKENTYPES.monthName)).month();
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES["in"]:
// @ts-ignore
          r.on(parseRanges(TOKENTYPES.yearIndex)).year();
// @ts-ignore
          break;
// @ts-ignore

// @ts-ignore
         case TOKENTYPES.at:
// @ts-ignore
          r.on(parseTokenValue(TOKENTYPES.time)).time();
// @ts-ignore
          while (checkAndParse(TOKENTYPES.and)) {
// @ts-ignore
            r.on(parseTokenValue(TOKENTYPES.time)).time();
// @ts-ignore
          }
// @ts-ignore
          break;

// @ts-ignore
         case TOKENTYPES.and:
// @ts-ignore
          break;

// @ts-ignore
         case TOKENTYPES.also:
// @ts-ignore
          r.and();
// @ts-ignore
          break;

// @ts-ignore
         case TOKENTYPES.except:
// @ts-ignore
          r.except();
// @ts-ignore
          break;

// @ts-ignore
         default:
// @ts-ignore
          error = pos;
// @ts-ignore
        }
// @ts-ignore
      }
// @ts-ignore
      return {
// @ts-ignore
        schedules: r.schedules,
// @ts-ignore
        exceptions: r.exceptions,
// @ts-ignore
        error: error
// @ts-ignore
      };
// @ts-ignore
    }
// @ts-ignore
    function parseTimePeriod(r) {
// @ts-ignore
      var timePeriod = parseToken([ TOKENTYPES.second, TOKENTYPES.minute, TOKENTYPES.hour, TOKENTYPES.dayOfYear, TOKENTYPES.dayOfWeek, TOKENTYPES.dayInstance, TOKENTYPES.day, TOKENTYPES.month, TOKENTYPES.year, TOKENTYPES.weekOfMonth, TOKENTYPES.weekOfYear ]);
// @ts-ignore
      switch (timePeriod.type) {
// @ts-ignore
       case TOKENTYPES.second:
// @ts-ignore
        r.second();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.minute:
// @ts-ignore
        r.minute();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.hour:
// @ts-ignore
        r.hour();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.dayOfYear:
// @ts-ignore
        r.dayOfYear();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.dayOfWeek:
// @ts-ignore
        r.dayOfWeek();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.dayInstance:
// @ts-ignore
        r.dayOfWeekCount();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.day:
// @ts-ignore
        r.dayOfMonth();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.weekOfMonth:
// @ts-ignore
        r.weekOfMonth();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.weekOfYear:
// @ts-ignore
        r.weekOfYear();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.month:
// @ts-ignore
        r.month();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.year:
// @ts-ignore
        r.year();
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       default:
// @ts-ignore
        error = pos;
// @ts-ignore
      }
// @ts-ignore
      return timePeriod;
// @ts-ignore
    }
// @ts-ignore
    function checkAndParse(tokenType) {
// @ts-ignore
      var found = peek(tokenType).type === tokenType;
// @ts-ignore
      if (found) {
// @ts-ignore
        scan(tokenType);
// @ts-ignore
      }
// @ts-ignore
      return found;
// @ts-ignore
    }
// @ts-ignore
    function parseToken(tokenType) {
// @ts-ignore
      var t = scan(tokenType);
// @ts-ignore
      if (t.type) {
// @ts-ignore
        t.text = convertString(t.text, tokenType);
// @ts-ignore
      } else {
// @ts-ignore
        error = pos;
// @ts-ignore
      }
// @ts-ignore
      return t;
// @ts-ignore
    }
// @ts-ignore
    function parseTokenValue(tokenType) {
// @ts-ignore
      return parseToken(tokenType).text;
// @ts-ignore
    }
// @ts-ignore
    function convertString(str, tokenType) {
// @ts-ignore
      var output = str;
// @ts-ignore
      switch (tokenType) {
// @ts-ignore
       case TOKENTYPES.time:
// @ts-ignore
        var parts = str.split(/(:|am|pm)/), hour = parts[3] === "pm" && parts[0] < 12 ? parseInt(parts[0], 10) + 12 : parts[0], min = parts[2].trim();
// @ts-ignore
        output = (hour.length === 1 ? "0" : "") + hour + ":" + min;
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.rank:
// @ts-ignore
        output = parseInt(/^\d+/.exec(str)[0], 10);
// @ts-ignore
        break;
// @ts-ignore

// @ts-ignore
       case TOKENTYPES.monthName:
// @ts-ignore
       case TOKENTYPES.dayName:
// @ts-ignore
        output = NAMES[str.substring(0, 3)];
// @ts-ignore
        break;
// @ts-ignore
      }
// @ts-ignore
      return output;
// @ts-ignore
    }
// @ts-ignore
    return parseScheduleExpr(str.toLowerCase());
// @ts-ignore
  };
// @ts-ignore
  return later;
// @ts-ignore
})();

// Set the local time mode for "later" library
// @ts-ignore
later.date.localTime()

// @ts-ignore
export default later
