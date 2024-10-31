!(function(global) {
  "use strict";

  var locales = {};
  locales["en-US"] = {};
  locales["fr-FR"] = {
    relativeTime: {
      future: "dans %s",
      past: "il y a %s",
      s: "une seconde",
      ss: "%d secondes",
      m: "une minute",
      mm: "%d minutes",
      h: "une heure",
      hh: "%d heures",
      d: "un jour",
      dd: "%d jours",
      w: "une semaine",
      ww: "%d semaines",
      M: "un mois",
      MM: "%d mois",
      y: "un an",
      yy: "%d ans",
    },
    latin: true,
    parseDate: "D M Y",
    parseTime: "h m",
    months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
      "_"
    ),
    monthsShort: "jan_fév_mar_avr_mai_juin_juil_aoû_sep_oct_nov_déc".split("_"),
    weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort: "dim_lun_mar_mer_jeu_ven_sam".split("_"),
    weekdaysMin: "di_lu_ma_me_je_ve_sa".split("_"),
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
    },
  };

  var def = {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "one second",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
      },
      latin: true,
      parseDate: "Y M D",
      parseTime: "h m pm",
      months: "january_february_march_april_may_june_july_august_september_october_november_december".split(
        "_"
      ),
      monthsShort: "jan_feb_mar_apr_may_jun_jul_aug_sep_oct_nov_dec".split("_"),
      weekdays: "sunday_monday_tuesday_wednesday_thursday_friday_saturday".split(
        "_"
      ),
      weekdaysShort: "sun_mon_tue_wed_thu_fri_sat".split("_"),
      weekdaysMin: "su_mo_tu_we_th_fr_sa".split("_"),
      week: {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 1st is the first week of the year.
      },
    },
    MINUTE = 60,
    HOUR = 3600,
    DAY = 86400,
    WEEK = 604800,
    MONTH = 2592000,
    YEAR = 31536000;

  for (var lang in locales) {
    if (locales.hasOwnProperty(lang)) {
      locales[lang] = $extend(true, {}, def, locales[lang]);
      locales[lang].testMonths = locales[lang].months;
      locales[lang].testMonthsShort = locales[lang].monthsShort;
      if (locales[lang].latin) {
        locales[lang].testMonths = locales[lang].testMonths.map(function(item) {
          //console.log(item)
          return item.replace(/[^a-zA-Z|]/g, ".");
        });
        //console.log(locales[lang].testMonths)
        locales[lang].testMonthsShort = locales[lang].testMonthsShort.map(
          function(item) {
            return item.replace(/[^a-zA-Z|]/g, ".");
          }
        );
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  function pad(n) {
    return ("0" + n).slice(-2);
  }

  // http://www.htmlgoodies.com/html5/javascript/date-parsing-using-javascript-and-regular-expressions.html#fbid=i0NTRM9IjMm

  // https://regex101.com/r/qV8fK6/2
  // https://regex101.com/r/sX1vU5/1
  var REG = {
    Y: /\d{2,4}/,
    M: /0[1-9]|1[0-2]|[1-9](?!\d)/,
    D: /0[1-9]|[1-2][0-9]|3[0-1]|[1-9](?!\d)/,
    h: /0[0-9]|1[0-9]|2[0-3]|[1-9]|[1-9](?!\d)/,
    m: /0[0-9]|[1-5][0-9]|[1-9](?!\d)/,

    dSep: /[ -\/]/,
    hSep: /\s*(?::|h|heures?)\s*/,
    mSep: /\s*(?::|m|minutes?)\s*/,
  };
  REG.s = REG.m;

  REG.date = /(?:^|\W)([0-9]{2,4})[ -\/](0[1-9]|[1-2][0-9]|3[0-1])[ -\/](0[1-9]|1[0-2]|[1-9][^\d])/i;
  REG.time = /(?:^|\W)(0[0-9]|1[0-9]|2[0-3]|[1-9])\s*(?::|h|heures)\s*(0[0-9]|[1-5][0-9])\s*(pm?)?/i;

  function buildReg() {
    var loc = locales[currentLocale];
    var parseDate = loc.parseDate;
    var parseTime = loc.parseTime;

    //var months = (loc.months.join('|') + '|' + loc.monthsShort.join('|')).replace(/é/g,'[ée]').replace(/û/g,'[ûu]')
    var months =
      "|" + (loc.testMonths.join("|") + "|" + loc.testMonthsShort.join("|"));

    var regDateSource = []; // /(?:^|\W)/.source

    parseDate.split(" ").forEach(function(item) {
      regDateSource.push(
        "(" + REG[item].source + (item === "M" ? months : "") + ")"
      );
    });

    REG.date = new RegExp(
      /(?:^|\W)/.source + regDateSource.join(REG.dSep.source),
      "i"
    );

    //console.log(REG.date)
  }

  function reIndexOf(arr, rx) {
    for (var i in arr) {
      if (arr[i].toString().match(rx)) {
        return i;
      }
    }
    return -1;
  }

  function checkFormat(obj, str, reg, list) {
    var list = list.split(" ");
    var found = false;
    str.replace(reg, function() {
      found = true;
      for (var i = 0, l = list.length; i < l; i++) {
        var arg = arguments[i + 1];
        if (obj.hasOwnProperty(list[i])) {
          var n = arg * 1;
          if (n === arg * 1) {
            obj[list[i]] = n;
          } else {
            if (list[i] === "pm") obj[list[i]] = true;
            if (list[i] === "M") {
              var month = -1;
              if (locales[currentLocale].latin) {
                locales[currentLocale].testMonths.forEach(function(item, i) {
                  var re = new RegExp(item, "i");
                  if (re.test(arg)) {
                    month = i;
                  }
                });
                //console.log(month)
                if (month === -1) {
                  locales[currentLocale].testMonthsShort.forEach(function(
                    item,
                    i
                  ) {
                    var re = new RegExp(item, "i");
                    if (re.test(arg)) {
                      month = i;
                    }
                  });
                }
                if (month > -1) obj[list[i]] = month + 1;
              } else {
                if (
                  (month = locales[currentLocale].testMonths.indexOf(
                    arg.toLowerCase()
                  )) > -1
                ) {
                  obj[list[i]] = month + 1;
                } else if (
                  (month = locales[currentLocale].testMonthsShort.indexOf(
                    arg.toLowerCase()
                  )) > -1
                ) {
                  obj[list[i]] = month + 1;
                }
              }
            }
          }
        }
      }
      if (obj.Y < 100) obj.Y = obj.Y > 68 ? 1900 + obj.Y : 2000 + obj.Y;
    });
    return found;
  }

  function parser(str) {
    var obj = { Y: 0, M: 0, D: 0, h: 0, m: 0, s: 0, pm: false };
    //console.log(REG.date)
    checkFormat(obj, str, REG.date, locales[currentLocale].parseDate);
    checkFormat(obj, str, REG.time, locales[currentLocale].parseTime);
    //console.log(obj)
    return new Date(
      obj.Y,
      obj.M - 1,
      obj.D,
      obj.h + (obj.pm ? 12 : 0),
      obj.m,
      obj.s
    );
  }

  function parseDate(arg) {
    if (arg == null) return new Date();
    if (arg instanceof Date) return arg;
    //console.log(arg)
    var out =
      arg * 1 === arg
        ? new Date(arg)
        : //: parser(arg)
          navigator.userAgent.match(/MSIE\s([^;]*)/)
          ? Date.parse(arg.replace(/( \+)/, " UTC$1"))
          : new Date(Date.parse(arg));
    return isNaN(out.getTime()) ? new Date() : out;
  }

  function _date(arg) {
    //console.log(1, new Error())
    if (arg instanceof Era) return arg;
    return new Era(arg);
  }

  var today = new Date();

  function Era(arg) {
    today = new Date();

    function init(fromDate, toDate) {
      var words = locales[currentLocale].relativeTime,
        date = parseDate(fromDate),
        calendar = date.toLocaleDateString(currentLocale),
        time = date.toLocaleTimeString(currentLocale),
        diff,
        unit = "",
        future = false;

      function word() {
        var s = (words[diff > 1 ? unit + unit : unit] || diff + "").replace(
          "%d",
          diff
        );
        return words[future ? "future" : "past"].replace("%s", s);
      }

      calendar = calendar
        .split("/")
        .map(function(arg) {
          return pad(arg);
        })
        .join("/");

      toDate = arguments.length > 1 ? parseDate(toDate) : today;
      var diffN = (toDate * 1 - date * 1) / 1000;
      if (diffN < 0) future = true;
      diffN = Math.abs(diffN);

      var ref = ["ms", "s", "m", "h", "d", "w", "M", "y"];
      if (future) {
        // thanks : http://stackoverflow.com/a/6549563/1289275
        var rel = [
          diffN,
          (diffN + 1) / MINUTE,
          (diffN + MINUTE) / HOUR,
          (diffN + HOUR) / DAY,
          (diffN + DAY) / WEEK,
          (diffN + DAY) / MONTH,
          (diffN + DAY) / YEAR,
          0,
        ];
      } else {
        var rel = [
          diffN,
          (diffN + 1) / MINUTE,
          (diffN + MINUTE) / HOUR,
          (diffN + HOUR) / DAY,
          (diffN + DAY) / WEEK,
          (diffN + DAY) / MONTH,
          (diffN + DAY) / YEAR,
          0,
        ];
      }

      for (var i = 0, l = rel.length; i < l; i++) {
        if (rel[i + 1] <= 1) {
          diff = Math.trunc(rel[i]);
          unit = ref[i + 1];
          break;
        }
      }

      var that = this;

      $extend(this, {
        object: date,
        diff: diff,

        date: calendar,
        human: calendar + " " + time,
        time: time,
        string: {
          relative: word(),
          day: locales[currentLocale].weekdays[date.getDay()],
          month: locales[currentLocale].months[date.getMonth()],
          min: {
            relative: word(),
            day: locales[currentLocale].weekdaysMin[date.getDay()],
            month: locales[currentLocale].monthsShort[date.getMonth()],
          },
        },
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: pad(date.getHours()),
        minutes: pad(date.getMinutes()),
        seconds: pad(date.getSeconds()),
        // TEMP : API testing...
        next: {
          year: function(n) {
            next(date, "FullYear", n);
            return that;
          },
          month: function(n) {
            next(date, "Month", n);
            return that;
          },
          day: function(n) {
            next(date, "Date", n);
            return that;
          },
          hour: function(n) {
            next(date, "Hours", n);
            return that;
          },
          minute: function(n) {
            next(date, "Minutes", n);
            return that;
          },
          second: function(n) {
            next(date, "Seconds", n);
            return that;
          },
        },
        prev: {
          year: function(n) {
            prev(date, "FullYear", n);
            return that;
          },
          month: function(n) {
            prev(date, "Month", n);
            return that;
          },
          day: function(n) {
            prev(date, "Date", n);
            return that;
          },
          hour: function(n) {
            prev(date, "Hours", n);
            return that;
          },
          minute: function(n) {
            prev(date, "Minutes", n);
            return that;
          },
          second: function(n) {
            prev(date, "Seconds", n);
            return that;
          },
        },
        isValid: function() {
          return !isNaN(date.getTime());
        },
        isToday: function() {
          return today.toDateString() === date.toDateString();
        },
      });
    }

    var that = this;
    function next(date, type, n) {
      //console.log()
      date["set" + type](
        date["get" + type]() + (typeof n === "number" ? n : 1)
      );
      init.call(that, date);
    }
    function prev(date, type, n) {
      date["set" + type](
        date["get" + type]() - (typeof n === "number" ? n : 1)
      );
      init.call(that, date);
    }

    init.apply(this, arguments);
  }

  Era.prototype = {
    clone: function() {
      return new Era(this.object);
    },
  };

  var currentLocale = "en-US";
  _date.setLocale = function(locale) {
    currentLocale = locale;
    buildReg();
    _date.locale = locales[locale];
    return locales[currentLocale];
  };
  _date.setLocale("en-US");

  _date.parse = function(date) {
    return _date(parser(date));
  };

  global.$date = _date;
})(this);
