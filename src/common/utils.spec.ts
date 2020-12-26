import { strictEqual, deepStrictEqual } from 'power-assert'

import {
  getWeekdays,
  getMonthDayCount,
  isLeap,
  isWeekend,
  getPreviousMonth,
  getNextMonth,
  isObject
} from './utils'

describe('test common/utils.js', function () {
  it('getWeekdays(firstWeekDay)', function () {
    const cases: Array<[number, number[], string]> = [
      [0, [0, 1, 2, 3, 4, 5, 6], '周日数据异常'],
      [1, [1, 2, 3, 4, 5, 6, 0], '周一数据异常'],
      [2, [2, 3, 4, 5, 6, 0, 1], '周二数据异常'],
      [3, [3, 4, 5, 6, 0, 1, 2], '周三数据异常'],
      [4, [4, 5, 6, 0, 1, 2, 3], '周四数据异常'],
      [5, [5, 6, 0, 1, 2, 3, 4], '周五数据异常'],
      [6, [6, 0, 1, 2, 3, 4, 5], '周六数据异常']
    ]

    cases.forEach(([actual, expected, message]) => {
      deepStrictEqual(getWeekdays(actual), expected, message)
    })
  })

  it('getMonthDayCount(year, month)', function () {
    const cases: Array<[string, number, string]> = [
      ['2019-01', 31, '1月份有31天'],
      ['2019-02', 28, '2019年非闰年，2月分有28天'],
      ['2019-03', 31, '3月份有31天'],
      ['2020-02', 29, '2000年为闰年，2月分有29天']
    ]

    cases.forEach(([actual, expected, message]) => {
      const [year, month] = actual.split('-').map(Number)
      strictEqual(getMonthDayCount(year, month), expected, message)
    })
  })

  it('isLeap(year)', function () {
    const cases: Array<[number, boolean, string]> = [
      [1984, true, '1984年为闰年'],
      [1988, true, '1988年为闰年'],
      [1993, false, '1993年非闰年'],
      [2000, true, '2000年为闰年'],
      [2001, false, '2001年非闰年']
    ]

    cases.forEach(([actual, expected, message]) => {
      strictEqual(isLeap(actual), expected, message)
    })
  })

  it('isWeekend(day)', function () {
    const cases: Array<[number, boolean, string]> = [
      [0, true, '周日判断失败'],
      [1, false, '周一判断失败'],
      [5, false, '周五判断失败'],
      [6, true, '周六判断失败']
    ]

    cases.forEach(([actual, expected, message]) => {
      strictEqual(isWeekend(actual), expected, message)
    })
  })

  it('getPreviousMonth(year, month)', function () {
    const cases: Array<[string, string, string]> = [
      ['2019-01', '2018-12', '跨年度获取上一个月失败'],
      ['2019-02', '2019-01', '获取2月的前一个月失败'],
      ['2019-03', '2019-02', '获取3月的前一个月失败'],
      ['2020-01', '2019-12', '跨年度获取上一个月失败']
    ]

    cases.forEach(([actual, expected, message]) => {
      const [year, month] = actual.split('-').map(Number)
      const format = ([y, m]: number[]): string => {
        return `${y}-${m.toString().padStart(2, '0')}`
      }
      strictEqual(format(getPreviousMonth(year, month)), expected, message)
    })
  })

  it('getNextMonth(year, month)', function () {
    const cases: Array<[string, string, string]> = [
      ['2018-12', '2019-01', '跨年度获取下一个月失败'],
      ['2019-02', '2019-03', '获取2月的下一个月失败'],
      ['2019-03', '2019-04', '获取3月的下一个月失败'],
      ['2019-12', '2020-01', '跨年度获取下一个月失败']
    ]

    cases.forEach(([actual, expected, message]) => {
      const [year, month] = actual.split('-').map(Number)
      const format = ([y, m]: number[]): string => {
        return `${y}-${m.toString().padStart(2, '0')}`
      }
      strictEqual(format(getNextMonth(year, month)), expected, message)
    })
  })

  it('getNextMonth(year, month)', function () {
    const cases: Array<[unknown, boolean, string]> = [
      ['', false, '字符串 被判断为对象'],
      [null, false, 'null 被判断为对象'],
      [false, false, 'false 被判断为对象'],
      [true, false, 'true 被判断为对象'],
      [1, false, '数字 被判断为对象'],
      [{}, true, '对象 判断失败']
    ]

    cases.forEach(([actual, expected, message]) => {
      strictEqual(isObject(actual), expected, message)
    })
  })
})
