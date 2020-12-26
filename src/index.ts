import config from './config'
import { parseLocale as locale } from './core/locale'

export * from './common/constants'
export * from './common/utils'

import { Calendar, CalendarOptions, Iteratee } from './core/calendar'

export function create<T = Date>(options?: CalendarOptions<T>) {
  return new Calendar<T>(options)
}

export { locale, config, Calendar }

export type { CalendarOptions, Iteratee }

export default {
  config,
  locale,
  create,
  version: '__VERSION__'
}
