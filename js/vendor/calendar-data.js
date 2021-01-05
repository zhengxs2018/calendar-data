!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = 'undefined' != typeof globalThis ? globalThis : e || self).calendar_data = {}))
})(this, function (e) {
  'use strict'
  const t = [0, 1, 2, 3, 4, 5, 6],
    n = t.concat(t),
    a = { firstWeekDay: 0, visibleWeeksCount: 6, locale: 'cn' }
  function s(e = 0) {
    return 0 === e ? t : n.slice(e, e + 7)
  }
  function r(e, t) {
    return new Date(e, t, 0, 0, 0, 0, 0).getDate()
  }
  function i(e, t) {
    const n = t - 1
    return n < 1 ? [e - 1, 12] : [e, n]
  }
  function o(e, t) {
    const n = t + 1
    return n > 12 ? [e + 1, 1] : [e, n]
  }
  function u(e) {
    return null !== e && 'object' == typeof e
  }
  var l = {
    name: 'zh',
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    weekdaysAbbr: ['日', '一', '二', '三', '四', '五', '六']
  }
  const c = { zh: l, 'zh-cn': l }
  function h(e, t) {
    if ('string' == typeof e) {
      if (c.hasOwnProperty(e)) return c[e]
      if (u(t)) return (c[e] = t), t
    } else if (u(e)) {
      const { name: t } = e
      return (c[t] = e), e
    }
    return c[a.locale] || l
  }
  class D {
    constructor(e) {
      ;(this.visibleWeeksCount = 5),
        (e = e || {}),
        (this.firstWeekDay = e.firstWeekDay || a.firstWeekDay),
        (this.visibleWeeksCount = e.visibleWeeksCount || a.visibleWeeksCount),
        (this.weekdays = s(this.firstWeekDay)),
        (this.iteratee = (null == e ? void 0 : e.iteratee) || ((e) => e)),
        this.locale(e.locale)
    }
    locale(e, t) {
      return (this._locale = h(e, t)), this
    }
    getWeekHead() {
      const { weekdays: e, weekdaysAbbr: t, weekdaysShort: n } = this._locale
      return this.weekdays.map((a) => ({ day: a, name: e[a], abbr: t[a], short: n[a] }))
    }
    getMonthCalendar(e, t) {
      const n = [],
        a = this.iteratee,
        s = 7 * this.visibleWeeksCount
      let r = []
      return (
        this.unstable_iterDates(e, t, 1, s, !0, (s, i) => {
          i % 7 || (r = n[i / 7] = []), r.push(a(s, { year: e, month: t }))
        }),
        n
      )
    }
    getPreviousMonthCalendar(e, t) {
      return this.getMonthCalendar(...i(e, t))
    }
    getNextMonthCalendar(e, t) {
      return this.getMonthCalendar(...o(e, t))
    }
    getMonthDates(e, t) {
      const n = [],
        a = r(e, t)
      return (
        this.unstable_iterDates(e, t, 1, a, !1, (e) => {
          n.push(e)
        }),
        n
      )
    }
    getWeekDates(e, t, n) {
      const a = []
      return (
        this.unstable_iterDates(e, t, n, 7, !0, (e) => {
          a.push(e)
        }),
        a
      )
    }
    getPreviousWeekDates(e, t, n) {
      const a = this.unstable_getPreviousWeekStartTime(e, t, n)
      return this.getWeekDates(a.getFullYear(), a.getMonth() + 1, a.getDate())
    }
    getNextWeekDates(e, t, n) {
      const a = this.unstable_getNextWeekWeekStartTime(e, t, n)
      return this.getWeekDates(a.getFullYear(), a.getMonth() + 1, a.getDate())
    }
    unstable_getNextWeekWeekStartTime(e, t, n) {
      const a = new Date(e, t - 1, n, 0, 0, 0, 0)
      return a.setDate(a.getDate() - this.weekdays.indexOf(a.getDay()) + 7), a
    }
    unstable_getPreviousWeekStartTime(e, t, n) {
      const a = new Date(e, t - 1, n, 0, 0, 0, 0)
      return a.setDate(a.getDate() - this.weekdays.indexOf(a.getDay()) - 7), a
    }
    unstable_iterDates(e, t, n, a, s, r) {
      const i = this.weekdays,
        o = new Date(e, t - 1, n, 0, 0, 0, 0)
      !0 === s && o.setDate(o.getDate() - i.indexOf(o.getDay()))
      for (let e = 0; e < a; e++) r(new Date(o), e), o.setDate(o.getDate() + 1)
    }
    static printCalendar(e, t, n, a = !1) {
      const s = e.getWeekHead().map((e) => e.abbr),
        r = e.getMonthCalendar(2020, 12).map((e) => {
          const r = {}
          return (
            e.forEach((e, i) => {
              var o
              ;(a || ((o = e).getFullYear() === t && o.getMonth() + 1 === n)) &&
                (r[s[i]] = e.getDate())
            }),
            r
          )
        })
      console.table(r, s)
    }
  }
  function g(e) {
    return new D(e)
  }
  var d = { config: a, locale: h, create: g, version: '0.1.0-rc.1' }
  ;(e.Calendar = D),
    (e.DOUBLE_WEEKDAYS = n),
    (e.FRIDAY = 5),
    (e.MONDAY = 1),
    (e.SATURDAY = 6),
    (e.SUNDAY = 0),
    (e.THURSDAY = 4),
    (e.TUESDAY = 2),
    (e.WEDNESDAY = 3),
    (e.WEEKDAYS = t),
    (e.config = a),
    (e.create = g),
    (e.default = d),
    (e.getMonthDayCount = r),
    (e.getNextMonth = o),
    (e.getPreviousMonth = i),
    (e.getWeekdays = s),
    (e.isLeap = function (e) {
      return 0 == e % 4 && (e % 100 != 0 || e % 400 == 0)
    }),
    (e.isObject = u),
    (e.isWeekend = function (e) {
      return 0 === e || 6 === e
    }),
    (e.locale = h),
    Object.defineProperty(e, '__esModule', { value: !0 })
})
