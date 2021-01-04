const template = tpl`
  <input class="input" type="text" />

  <div class="date-picker open-left">
    <table class="calendar-table">
      <thead>
        <tr>
          <th class="prev">
            <span></span>
          </th>
          <th colspan="5" class="month"></th>
          <th class="next">
            <span></span>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
`

class DatePicker extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'readonly', 'disabled']
  }

  constructor() {
    super()

    // 插入 dom
    this.appendChild(template.content.cloneNode(true))

    // 组件状态
    this.state = {
      year: null,
      month: null,
      date: null
    }

    const now = new Date()
    function isToday(year, month, date) {
      return (
        now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === date
      )
    }

    this.calendarData = calendar_data.create({
      /**
       * 自定义数据格式
       *
       * @param {Date} d
       * @param {Object} ctx
       */
      iteratee(d, ctx) {
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        const date = d.getDate()

        const cell = {
          year: year,
          month: month,
          date: date,
          isToday: isToday(year, month, date),
          isPrevMonth: false,
          isCurrentMonth: false,
          isNextMonth: false
        }

        if (ctx.year === year) {
          if (month < ctx.month) {
            cell.isPrevMonth = true
          } else if (month > ctx.month) {
            cell.isNextMonth = true
          } else {
            cell.isCurrentMonth = true
          }
        } else if (ctx.year > year) {
          cell.isPrevMonth = true
        } else {
          cell.isNextMonth = true
        }

        return cell
      }
    })

    /**
     * @type {HTMLDivElement}
     */
    this.pickerEl = this.querySelector('.date-picker')

    /**
     * @type {HTMLInputElement}
     */
    this.inputEl = this.querySelector('.input')

    /**
     * 是否在日历中移动
     *
     * @type {Boolean}
     */
    this.moving = false

    // 渲染日历头部
    this.renderWeekHead()

    // 如果没有设置 value 属性
    // 第一次不会触发，手动触发下
    if (this.hasAttribute('value') === false) {
      this.watchValue()
    }
  }

  /**
   * 生命周期
   *
   * @protected
   */
  connectedCallback() {
    const { inputEl, pickerEl } = this

    inputEl.addEventListener('input', (evt) => {
      evt.stopPropagation()
    })

    inputEl.addEventListener('select', (evt) => {
      evt.stopPropagation()
    })

    inputEl.addEventListener('change', this.handleInputChange.bind(this))

    inputEl.addEventListener('focus', () => {
      if (inputEl.readOnly || inputEl.disabled) return
      this.show()
    })

    inputEl.addEventListener('blur', () => {
      if (inputEl.readOnly || inputEl.disabled) return
      if (this.moving === false) {
        this.hide()
      }
    })

    pickerEl.addEventListener('mouseenter', () => {
      this.moving = true
    })

    pickerEl.addEventListener('mouseleave', () => {
      this.moving = false
    })

    pickerEl
      .querySelector('th.prev')
      .addEventListener('click', this.handlePreviousMonth.bind(this))

    pickerEl
      .querySelector('th.next')
      .addEventListener('click', this.handleNextMonth.bind(this))

    // 事件代理
    pickerEl.querySelector('tbody').addEventListener('click', (evt) => {
      if (evt.target.tagName === 'TD') {
        this.handleSelectEvent(evt)
      }
    })

    // clickOutside
    this.cancelClickOutside = clickOutside(this, () => this.hide())
  }

  /**
   * 生命周期
   *
   * @protected
   */
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case 'value':
        const parsed = dayjs(newValue)
        this.watchValue(parsed.isValid() ? newValue : null)
        this.updateInputValue()
        break
      case 'readonly':
        this.inputEl.readOnly = newValue !== null
        this.hide()
        break
      case 'disabled':
        this.inputEl.disabled = newValue !== null
        this.hide()
        break
    }
  }

  /**
   * 生命周期
   *
   * @protected
   */
  disconnectedCallback() {
    const { inputEl, pickerEl } = this

    inputEl.removeEventListener('change')
    inputEl.removeEventListener('input')
    inputEl.removeEventListener('focus')
    inputEl.removeEventListener('blur')

    pickerEl.removeEventListener('mouseenter')
    pickerEl.removeEventListener('mouseleave')

    pickerEl.querySelector('th.prev').removeEventListener('click')
    pickerEl.querySelector('th.next').removeEventListener('click')
    pickerEl.querySelector('tbody').removeEventListener('click')

    this.calendarData = null
    this.cancelClickOutside()
  }

  /**
   * 监听值变化
   *
   * @private
   * @param {String} value
   */
  watchValue(value) {
    const newState = {}
    const parsed = dayjs(value)

    if (parsed.isValid()) {
      newState.year = parsed.year()
      newState.month = parsed.month() + 1
      newState.date = parsed.date()
    } else {
      const now = new Date()

      newState.year = now.getFullYear()
      newState.month = now.getMonth() + 1
      newState.date = now.getDate()
    }

    // 修改组件状态
    this.setState(newState)
  }

  /**
   * 显示 picker
   *
   * @public
   */
  show() {
    const pickerEl = this.pickerEl
    const style = pickerEl.style

    style.display = 'block'
    style.top = Math.floor(this.offsetHeight + 10) + 'px'
    style.left = '0px'
  }

  /**
   * 隐藏
   *
   * @public
   */
  hide() {
    const pickerEl = this.pickerEl
    const style = pickerEl.style

    style.display = 'none'
  }

  /**
   * 输入框内容变化
   *
   * @private
   * @param {MouseEvent} event
   */
  handleInputChange(event) {
    event.stopPropagation()

    const value = event.target.value
    const parsed = dayjs(value)
    if (parsed.isValid() === false) return

    const inputEvent = new CustomEvent('input', {
      bubbles: true, // 事件冒泡
      cancelable: true, // 允许外部取消
      detail: {
        year: parsed.year(),
        month: parsed.month() + 1,
        date: parsed.date()
      }
    })

    if (this.dispatchEvent(inputEvent)) {
      this.watchValue(parsed.toDate())
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          cancelable: false,
          detail: this.state
        })
      )
    }
  }

  /**
   * 日期选中
   *
   * @private
   * @param {MouseEvent} event
   */
  handleSelectEvent(event) {
    const cell = event.target.cell
    const selectEvent = new CustomEvent('select', {
      bubbles: true, // 事件冒泡
      cancelable: true, // 允许外部取消
      detail: cell
    })

    this.dispatchEvent(selectEvent)

    if (selectEvent.defaultPrevented === false) {
      this.setState(_.pick(cell, 'year', 'month', 'date'))
      this.updateInputValue()
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          cancelable: false,
          detail: this.state
        })
      )
    }
  }

  /**
   * 切换到前一个月
   *
   * @private
   */
  handlePreviousMonth() {
    const state = this.state
    const [year, month] = calendar_data.getPreviousMonth(state.year, state.month)
    this.setState({ year, month })
  }

  /**
   * 切换到后一个月
   *
   * @private
   */
  handleNextMonth() {
    const state = this.state
    const [year, month] = calendar_data.getNextMonth(state.year, state.month)
    this.setState({ year, month })
  }

  /**
   * 更新输入框的值
   *
   * @private
   */
  updateInputValue() {
    const inputEl = this.inputEl
    const state = this.state

    inputEl.value = `${state.year}-${fillZero(state.month)}-${fillZero(state.date)}`
  }

  /**
   * 设置组件状态
   *
   * @protected
   */
  setState(newState) {
    // 如果数据没有更新就什么都不做
    if (_.isEqual(newState, this.state)) return false

    // 更新组件状态
    Object.assign(this.state, newState)

    const state = this.state

    // 强制重新渲染
    this.renderMonthCalendar(state.year, state.month)

    return true
  }

  /**
   * 渲染日历头部星期
   *
   * @private
   */
  renderWeekHead() {
    const pickerEl = this.pickerEl
    const calendarData = this.calendarData
    const theadEl = pickerEl.querySelector('thead')
    const trEl = document.createElement('tr')

    calendarData.getWeekHead().forEach((head) => {
      const thEl = document.createElement('th')

      thEl.innerText = head.abbr
      trEl.appendChild(thEl)
    })

    theadEl.appendChild(trEl)
  }

  /**
   * 渲染日历表格
   *
   * @private
   * @param {Number} year
   * @param {Number} month
   */
  renderMonthCalendar(year, month) {
    const pickerEl = this.pickerEl
    const monthEl = pickerEl.querySelector('.month')
    monthEl.innerText = `${year}-${fillZero(month)}`

    const tbody = pickerEl.querySelector('tbody')
    tbody.innerHTML = null

    const state = this.state
    const views = this.calendarData.getMonthCalendar(year, month)

    views.forEach((cell) => {
      const tr = document.createElement('tr')

      cell.forEach((cell) => {
        const td = document.createElement('td')

        if (cell.isToday) {
          td.classList.add('today')
        }

        if (cell.isPrevMonth || cell.isNextMonth) {
          td.classList.add('off')
        }

        if (
          cell.year === state.year &&
          cell.month === state.month &&
          cell.date === state.date
        ) {
          td.classList.add('active')
        }

        td.cell = cell
        td.innerText = cell.date

        tr.appendChild(td)
      })

      tbody.appendChild(tr)
    })
  }
}

window.customElements.define('date-picker', DatePicker)

/**
 *
 * @param {String} tplStr
 *
 * @return {HTMLTemplateElement}
 */
function tpl(tplStr) {
  const tpl = document.createElement('template')
  tpl.innerHTML = tplStr
  return tpl
}

function clickOutside(el, callback) {
  const handleElementClick = (evt) => {
    evt.stopPropagation()
  }
  el.addEventListener('click', handleElementClick)

  const handleWindowClick = () => {
    callback()
  }
  window.addEventListener('click', handleWindowClick)

  return () => {
    el.removeEventListener('click', handleElementClick)
    window.removeEventListener('click', handleWindowClick)
  }
}

/**
 *
 * @param {Number} num
 */
function fillZero(num, length = 2) {
  return num.toString().padStart(length, '0')
}
