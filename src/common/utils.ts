import { WEEKDAYS, DOUBLE_WEEKDAYS } from './constants'

/**
 * 获取周数组
 *
 * @param firstWeekDay 周开始时间
 *
 * @return 周数组
 */
export function getWeekdays(firstWeekDay: number = 0): number[] {
  if (firstWeekDay === 0) return WEEKDAYS
  return DOUBLE_WEEKDAYS.slice(firstWeekDay, firstWeekDay + 7)
}

/**
 * 获取一个月多少天
 *
 * @param year 年
 * @param month 月
 *
 * @return 天数
 */
export function getMonthDayCount(year: number, month: number): number {
  const time = new Date(year, month, 0, 0, 0, 0, 0)
  return time.getDate()
}

/**
 * 是否闰年
 *
 * @param year 年
 *
 * @return 如果返回 True 说明是闰年
 */
export function isLeap(year: number): boolean {
  return 0 == year % 4 && (year % 100 != 0 || year % 400 == 0)
}

/**
 * 是否周末
 *
 * @example 0 和 6 在JS中分别表示 周日 和 周六
 *
 * isWeekend(0)
 * // -> true
 *
 * isWeekend(6)
 * // -> true
 *
 * isWeekend(5)
 * // -> false
 *
 * @param day 判断日期
 *
 * @return 返回 True 表示是周末
 */
export function isWeekend(day: number): boolean {
  return day === 0 || day === 6
}

/**
 * 获取上一个月份
 *
 * @example 如果是1月，就自动回到上一年
 *
 * getPreviousMonth(2020, 1)
 * // -> [2019,12]
 *
 * getNextMonth(2020, 2)
 * // -> [2020,1]
 *
 * @param year   年份
 * @param month  月份
 *
 * @return 年份和月份
 */
export function getPreviousMonth(year: number, month: number): [number, number] {
  const preMonth = month - 1
  if (preMonth < 1) {
    return [year - 1, 12]
  }
  return [year, preMonth]
}

/**
 * 获取下一个月份
 *
 * @example 如果是12月，就自动进入下一年
 *
 * getNextMonth(2020, 11)
 * // -> [2020,11]
 *
 * getNextMonth(2020, 12)
 * // -> [2021,1]
 *
 * @param year   年份
 * @param month  月份
 *
 * @return 年份和月份
 */
export function getNextMonth(year: number, month: number): [number, number] {
  const value = month + 1
  if (value > 12) {
    return [year + 1, 1]
  }
  return [year, value]
}

/**
 * 判断是否为对象
 *
 * @private
 * @param obj 检查对象
 */
export function isObject<T = object>(obj: unknown): obj is T {
  return obj !== null && typeof obj === 'object'
}

export type CompareResult = {
  /**
   * 在本年内
   */
  inYear: boolean
  /**
   * 是上一个年
   */
  isPreviousYear: boolean
  /**
   * 是下一个年
   */
  isNextYear: boolean
  /**
   * 是上一个月
   */
  isPreviousMonth: boolean
  /**
   * 是下一个月
   */
  isNextMonth: boolean
  /**
   * 本月内
   */
  inMonth: boolean
}

/**
 * 年月比较
 *
 * @param year
 * @param month
 * @param targetYear
 * @param targetMonth
 */
export function compare(
  year: number,
  month: number,
  targetYear: number,
  targetMonth: number
): CompareResult {
  const result: CompareResult = {
    isPreviousYear: false,
    inYear: false,
    isNextYear: false,
    isPreviousMonth: false,
    inMonth: false,
    isNextMonth: false
  }

  if (year === targetYear) {
    result.inYear = true

    if (month < targetMonth) {
      result.isPreviousMonth = true
    } else if (month > targetMonth) {
      result.isNextMonth = true
    } else {
      result.inMonth = true
    }
  } else if (year > targetYear) {
    result.isPreviousYear = true
    result.isPreviousMonth = true
  } else {
    result.isNextYear = true
    result.isNextMonth = true
  }

  return result
}
