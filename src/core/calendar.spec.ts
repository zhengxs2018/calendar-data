import dayjs from 'dayjs'
import { strictEqual, deepStrictEqual } from 'power-assert'

import zh from '../locale/zh'
import { WEEKDAYS } from '../common/constants'

import { Calendar } from './calendar'
import { parseLocale } from './locale'

describe('test core/calendar.js', function () {
  it('Calendar#getWeekHead()', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      locale: 'zh'
    })

    const head = calendar.getWeekHead()

    deepStrictEqual(
      head.map((r) => r.day),
      WEEKDAYS,
      '一周7天数字对比失败'
    )
    deepStrictEqual(
      head.map((r) => r.name),
      zh.weekdays,
      '名称对比失败'
    )
    deepStrictEqual(
      head.map((r) => r.abbr),
      zh.weekdaysAbbr,
      '缩写对比失败'
    )
    deepStrictEqual(
      head.map((r) => r.short),
      zh.weekdaysShort,
      '短名称对比失败'
    )
  })

  it('Calendar#locale()', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      locale: 'zh',
      visibleWeeksCount: 6
    })

    deepStrictEqual(calendar.getWeekHead()[0].name, zh.weekdays[0], '名称获取失败')

    parseLocale({
      name: 'abcd',
      weekdays: ['你好啊'],
      weekdaysAbbr: ['好'],
      weekdaysShort: ['你好']
    })

    calendar.locale('abcd')

    deepStrictEqual(calendar.getWeekHead()[0].name, '你好啊', '名称获取失败')
    deepStrictEqual(calendar.getWeekHead()[0].abbr, '好', '名称获取失败')
    deepStrictEqual(calendar.getWeekHead()[0].short, '你好', '名称获取失败')
  })

  it('Calendar#getMonthCalendar(year, month)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-11-29', 0],
      ['2020-11-30', 1],
      ['2020-12-01', 2],
      ['2020-12-05', 6],
      ['2020-12-17', 18],
      ['2020-12-31', 32],
      ['2021-01-01', 33],
      ['2021-01-02', 34]
    ]

    const dates = calendar.getMonthCalendar(2020, 12).flat()

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getPreviousMonthCalendar(year, month)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-11-01', 0],
      ['2020-11-02', 1],
      ['2020-11-14', 13],
      ['2020-12-04', 33],
      ['2020-12-05', 34]
    ]

    const dates = calendar.getPreviousMonthCalendar(2020, 12).flat()

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getNextMonthCalendar(year, month)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-12-27', 0],
      ['2020-12-28', 1],
      ['2021-01-09', 13],
      ['2021-01-29', 33],
      ['2021-01-30', 34]
    ]

    const dates = calendar.getNextMonthCalendar(2020, 12).flat()

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getMonthDates(year, month)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-12-01', 0],
      ['2020-12-02', 1],
      ['2020-12-16', 15],
      ['2020-12-30', 29],
      ['2020-12-31', 30]
    ]

    const dates = calendar.getMonthDates(2020, 12)

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getWeekDates(year, month, date)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-12-06', 0],
      ['2020-12-07', 1],
      ['2020-12-08', 2],
      ['2020-12-09', 3],
      ['2020-12-10', 4],
      ['2020-12-11', 5],
      ['2020-12-12', 6]
    ]

    const dates = calendar.getWeekDates(2020, 12, 9)

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getPreviousWeekDates(year, month, date)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-11-29', 0],
      ['2020-11-30', 1],
      ['2020-12-01', 2],
      ['2020-12-02', 3],
      ['2020-12-03', 4],
      ['2020-12-04', 5],
      ['2020-12-05', 6]
    ]

    const dates = calendar.getPreviousWeekDates(2020, 12, 9)

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })

  it('Calendar#getNextWeekDates(year, month, date)', function () {
    const calendar = new Calendar({
      firstWeekDay: 0,
      visibleWeeksCount: 6
    })

    const cases: [string, number][] = [
      ['2020-12-13', 0],
      ['2020-12-14', 1],
      ['2020-12-15', 2],
      ['2020-12-16', 3],
      ['2020-12-17', 4],
      ['2020-12-18', 5],
      ['2020-12-19', 6]
    ]

    const dates = calendar.getNextWeekDates(2020, 12, 9)

    cases.forEach(([time, index]) => {
      strictEqual(dayjs(dates[index]).format('YYYY-MM-DD'), time, '日期生成异常')
    })
  })
})
