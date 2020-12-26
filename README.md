# @zhengxs/calendar-data

[![lang](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/%40zhengxs%2Fcalendar-data.svg)](https://www.npmjs.com/package/%40zhengxs%2Fcalendar-data)
[![Downloads](https://img.shields.io/npm/dm/%40zhengxs%2Fcalendar-data.svg)](https://www.npmjs.com/package/%40zhengxs%2Fcalendar-data)
[![codecov](https://codecov.io/gh/zhengxs2018/calendar-data/branch/main/graph/badge.svg?token=JBYVAK2RRG)](https://codecov.io/gh/zhengxs2018/calendar-data)
[![Build Status](https://travis-ci.com/zhengxs2018/calendar-data.svg?branch=main)](https://travis-ci.com/zhengxs2018/calendar-data)

一个轻量的日历数据生成的 JavaScript 库，支持国际化的功能。支持 Nodejs 和浏览器。

- 🌐 国际化 I18n

[面向初学者：如何写一个日历组件](https://juejin.cn/post/6910585443345235975/)

## 快速开始

### 安装

```bash
$ npm install @zhengxs/calendar-data --save
```

### 使用

```javascript
import calendar from '@zhengxs/calendar-data'

// 全局设置每一周的开始
Calendar.config.firstWeekDay = 0

// 全局设置默认语言
Calendar.config.locale = 'cn'

// 全局添加语种
Calendar.locale({
  name: 'en',
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
  weekdaysAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
})

const calendar = Calendar.create({
  // 每一周的开始（0 表示星期一，6 表示星期天）
  firstWeekDay: 0,
  // 单个日历显示的周数量
  visibleWeeksCount: 6,
  // 设置语言
  locale: 'en'
})

// 获取日历上头部的内容
calendar.getWeekHead(2020, 12)
// ->
// [
//   { name: '星期日', ..., day: 0 },
//   { name: '星期一', ..., day: 1 },
//   { name: '星期二', ..., day: 2 },
//   { name: '星期三', ..., day: 3 },
//   { name: '星期四', ..., day: 4 },
//   { name: '星期五', ..., day: 5 },
//   { name: '星期六', ..., day: 6 },
// ]

// 生成 2020-12 月的日历数据
calendar.getMonthCalendar(2020, 12)
// -> 一个二维数组
// [
//   [Date(2020, 11, 29), ..., Date(2020, 12, 05)],
//   [Date(2020, 12, 06), ..., Date(2020, 12, 12)],
//   [Date(2020, 12, 13), ..., Date(2020, 12, 19)],
//   [Date(2020, 12, 20), ..., Date(2020, 12, 26)],
//   [Date(2020, 12, 27), ..., Date(2020, 01, 02)],
//   [Date(2021, 01, 03), ..., Date(2021, 01, 09)],
// ]

// 生成 2020-12 前面一个月的日历数据
calendar.getPreviousMonthCalendar(2020, 12)
// ->
// [
//   [Date(2020, 11, 01), ..., Date(2020, 11, 07)],
//   [Date(2020, 11, 08), ..., Date(2020, 11, 14)],
//   [Date(2020, 11, 15), ..., Date(2020, 11, 21)],
//   [Date(2020, 11, 22), ..., Date(2020, 11, 28)],
//   [Date(2020, 11, 29), ..., Date(2020, 11, 05)],
//   [Date(2020, 12, 06), ..., Date(2020, 12, 12)],
// ]

// 生成 2020-12 后面一个月的日历数据
calendar.getNextMonthCalendar(2020, 12)
// ->
// [
//   [Date(2020, 12, 27), ..., Date(2021, 01, 02)],
//   [Date(2021, 01, 03), ..., Date(2021, 01, 09)],
//   [Date(2021, 01, 10), ..., Date(2021, 01, 16)],
//   [Date(2021, 01, 17), ..., Date(2021, 01, 23)],
//   [Date(2021, 01, 24), ..., Date(2021, 01, 30)],
//   [Date(2021, 01, 31), ..., Date(2021, 02, 06)],
// ]

// 生成某个月的时间数据
calendar.getMonthDates(2020, 12)
// -> [Date(2020, 12, 01), ..., Date(2020, 12, 31)]

// 生成某个周的时间数据
calendar.getMonthDates(2020, 12, 03)
// -> [Date(2020, 11, 29), ..., Date(2020, 12, 05)]
```

## License

- MIT
