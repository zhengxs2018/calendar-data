import config from '../config'
import {
  compare,
  CompareResult,
  getWeekdays,
  getPreviousMonth,
  getNextMonth,
  getMonthDayCount
} from '../common/utils'

import { Locale, parseLocale } from './locale'

export interface DateObj {
  year: number
  month: number
  date: number
}

export interface Cell extends DateObj, CompareResult {
  isToday: boolean
}

export interface IterateeContext extends Omit<DateObj, 'date'> {
  cell: () => Cell
}

/**
 * 用于生成最终数据结构的迭代器
 */
export type Iteratee<T> = (date: Date, ctx: IterateeContext) => T

export interface CalendarOptions<T = Date> {
  firstWeekDay?: number
  visibleWeeksCount?: number
  locale?: string | Locale
  iteratee?: Iteratee<T>
}

export interface WeekHead {
  day: number
  name: string
  short: string
  abbr: string
}

export class Calendar<T = Date> {
  /**
   * 自定义迭代函数
   */
  iteratee: Iteratee<T>

  /**
   * 一星期的数字
   */
  weekdays: number[]

  /**
   * 一周开始的时间
   */
  firstWeekDay: number

  /**
   * 日历可见的周数量
   */
  visibleWeeksCount: number = 5

  /**
   * 本地化配置
   */
  private _locale!: Locale

  constructor(options?: CalendarOptions<T>) {
    options = options || {}

    this.firstWeekDay = options.firstWeekDay || config.firstWeekDay
    this.visibleWeeksCount = options.visibleWeeksCount || config.visibleWeeksCount
    this.weekdays = getWeekdays(this.firstWeekDay)
    this.iteratee = options?.iteratee || ((x) => (x as unknown) as T)
    this.locale(options.locale)
  }

  /**
   * 本地化语言环境设置
   *
   * @param locale
   */
  locale(name?: string | Locale, locale?: Locale): this {
    this._locale = parseLocale(name, locale)
    return this
  }

  /**
   * 获取日历头部周的名称列表
   *
   * @param style 名称风格
   */
  getWeekHead(): WeekHead[] {
    const { weekdays, weekdaysAbbr, weekdaysShort } = this._locale
    return this.weekdays.map((day) => ({
      day: day,
      name: weekdays[day],
      abbr: weekdaysAbbr[day],
      short: weekdaysShort[day]
    }))
  }

  /**
   * 获取某一个月日历数据
   *
   * @param year 年
   * @param month 月
   *
   * @return 二维数组结构的日期列表
   */
  getMonthCalendar(year: number, month: number): T[][] {
    const calendar: T[][] = []
    const iteratee = this.iteratee
    const count = this.visibleWeeksCount * 7

    const now = new Date()

    const nowObj = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate()
    }

    let week = []

    this.unstable_iterDates(year, month, 1, count, true, (dateObj, i) => {
      if (!(i % 7)) {
        week = calendar[i / 7] = []
      }

      week.push(
        iteratee(dateObj, {
          year: year,
          month: month,
          cell() {
            const curYear = dateObj.getFullYear()
            const curMonth = dateObj.getMonth() + 1
            const curDate = dateObj.getDate()

            const result = compare(curYear, curMonth, year, month)
            const { inMonth } = compare(curYear, curMonth, nowObj.year, nowObj.month)

            const data: Cell = {
              ...result,
              year: curYear,
              month: curMonth,
              date: curDate,
              isToday: inMonth && curDate === nowObj.date
            }

            return data
          }
        })
      )
    })

    return calendar
  }

  /**
   * 获取上个月日历数据
   *
   * @param year 年
   * @param month 月
   *
   * @return 二维数组结构的日期列表
   */
  getPreviousMonthCalendar(year: number, month: number): T[][] {
    return this.getMonthCalendar(...getPreviousMonth(year, month))
  }

  /**
   * 获取下个月日历数据
   *
   * @param year 年
   * @param month 月
   *
   * @return 二维数组结构的日期列表
   */
  getNextMonthCalendar(year: number, month: number): T[][] {
    return this.getMonthCalendar(...getNextMonth(year, month))
  }

  /**
   * 获取某一个月的时间列表
   *
   * @param year 年
   * @param month 月
   *
   * @return 时间列表
   */
  getMonthDates(year: number, month: number): Date[] {
    const dates: Date[] = []
    const count = getMonthDayCount(year, month)

    this.unstable_iterDates(year, month, 1, count, false, (date) => {
      dates.push(date)
    })

    return dates
  }

  /**
   * 获取某一周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getWeekDates(year: number, month: number, date: number): Date[] {
    const dates: Date[] = []

    this.unstable_iterDates(year, month, date, 7, true, (date) => {
      dates.push(date)
    })

    return dates
  }

  /**
   * 获取上周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getPreviousWeekDates(year: number, month: number, date: number): Date[] {
    const time = this.unstable_getPreviousWeekStartTime(year, month, date)
    return this.getWeekDates(time.getFullYear(), time.getMonth() + 1, time.getDate())
  }

  /**
   * 获取下周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getNextWeekDates(year: number, month: number, date: number): Date[] {
    const time = this.unstable_getNextWeekWeekStartTime(year, month, date)
    return this.getWeekDates(time.getFullYear(), time.getMonth() + 1, time.getDate())
  }

  /**
   * (不稳定) 获取下一周开始的时间
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间对象
   */
  unstable_getNextWeekWeekStartTime(year: number, month: number, date: number): Date {
    const time = new Date(year, month - 1, date, 0, 0, 0, 0)
    time.setDate(time.getDate() - this.weekdays.indexOf(time.getDay()) + 7)
    return time
  }

  /**
   * (不稳定) 获取上周开始的时间
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间对象
   */
  unstable_getPreviousWeekStartTime(year: number, month: number, date: number): Date {
    const time = new Date(year, month - 1, date, 0, 0, 0, 0)
    time.setDate(time.getDate() - this.weekdays.indexOf(time.getDay()) - 7)
    return time
  }

  /**
   * (不稳定) 根据指定时间开始生成时间列表
   *
   * @param year 年
   * @param month 月
   * @param date  日
   * @param count 生成的时间数量
   * @param resetStartOfWeek 是否从本周开始时间循环
   * @param cb 回调函数
   *
   * @return 时间列表
   */
  unstable_iterDates(
    year: number,
    month: number,
    date: number,
    count: number,
    resetStartOfWeek: boolean,
    cb: (date: Date, i: number) => void
  ): void {
    const weekdays = this.weekdays
    const cursor = new Date(year, month - 1, date, 0, 0, 0, 0)

    if (resetStartOfWeek === true) {
      cursor.setDate(cursor.getDate() - weekdays.indexOf(cursor.getDay()))
    }

    for (let i = 0; i < count; i++) {
      cb(new Date(cursor), i)
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  /**
   * 打印日历
   *
   * 仅在支持 console.table 的环境下可用
   *
   * @param calendar 日历对象
   * @param year     年
   * @param month    月
   */
  static printCalendar(
    calendar: Calendar,
    year: number,
    month: number,
    visible: boolean = false
  ): void {
    const columns = calendar.getWeekHead().map((w) => w.abbr)
    const arrays = calendar.getMonthCalendar(2020, 12)
    const rows = arrays.map((dates) => {
      const row: Record<string, number> = {}
      dates.forEach((date, index) => {
        if (visible || isCurrentMonth(date)) {
          row[columns[index]] = date.getDate()
        }
      })
      return row
    })

    function isCurrentMonth(d: Date) {
      return d.getFullYear() === year && d.getMonth() + 1 === month
    }

    console.table(rows, columns)
  }
}
