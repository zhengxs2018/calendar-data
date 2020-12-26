import { SUNDAY } from './common/constants'

/**
 * @private
 */
export interface Configuration {
  /**
   * 一周开始的时间
   */
  firstWeekDay: number
  /**
   * 月日历上显示的星期数量
   */
  visibleWeeksCount: number
  /**
   * 默认语言
   */
  locale: string
}

const config: Configuration = {
  /**
   * 一周开始的时间
   */
  firstWeekDay: SUNDAY,
  /**
   * 日历可见的周数量
   */
  visibleWeeksCount: 6,
  /**
   * 默认语言
   */
  locale: 'cn'
}

export default config
