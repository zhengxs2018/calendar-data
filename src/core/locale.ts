import { isObject } from '../common/utils'

import config from '../config'
import zh from '../locale/zh'

export interface Locale {
  name: string
  weekdays: string[]
  weekdaysShort: string[]
  weekdaysAbbr: string[]
}

/**
 * global loaded locale
 *
 * @private
 */
const LS: Record<string, Locale> = {
  zh: zh,
  'zh-cn': zh
}

export function parseLocale(preset?: string | Locale, locale?: Locale): Locale {
  if (typeof preset === 'string') {
    if (LS.hasOwnProperty(preset)) {
      return LS[preset]
    }
    if (isObject(locale)) {
      LS[preset] = locale
      return locale
    }
  } else if (isObject(preset)) {
    const { name } = preset
    LS[name] = preset
    return preset
  }
  return LS[config.locale] || zh
}

export default LS
