import { deepStrictEqual } from 'power-assert'

import zh from '../locale/zh'

import { parseLocale, Locale } from './locale'

describe('test core/locale.js', function () {
  it('parseLocale(preset)', function () {
    const cases: Array<[string, Locale, string]> = [
      ['zh', zh, '中文语言包获取失败'],
      ['abcd', zh, '语言包不存在时没有返回默认的语言包']
    ]

    cases.forEach(([lang, locale, message]) => {
      deepStrictEqual(parseLocale(lang), locale, message)
    })
  })

  it('parseLocale(lang, locale)', function () {
    const abcd: Locale = {
      name: 'abcd',
      weekdays: ['aaa', 'bbb', 'ccc', 'ddd'],
      weekdaysShort: ['aaa', 'bbb', 'ccc', 'ddd'],
      weekdaysAbbr: ['aaa', 'bbb', 'ccc', 'ddd']
    }

    deepStrictEqual(parseLocale('abcd', abcd), abcd, '语言包设置失败')
    deepStrictEqual(parseLocale('abcd').name, abcd.name, '语言包设置失败')
  })

  it('parseLocale(locale)', function () {
    const qwer: Locale = {
      name: 'qwer',
      weekdays: ['aaa', 'bbb', 'ccc', 'ddd'],
      weekdaysShort: ['aaa', 'bbb', 'ccc', 'ddd'],
      weekdaysAbbr: ['aaa', 'bbb', 'ccc', 'ddd']
    }

    deepStrictEqual(parseLocale(qwer), qwer, '语言包设置失败')
    deepStrictEqual(parseLocale('qwer').name, qwer.name, '语言包设置失败')
  })
})
