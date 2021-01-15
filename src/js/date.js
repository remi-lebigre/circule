class DateFormatter {
  MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

  constructor ({elements}) {
    console.debug('New date-formatter')
    elements.forEach(this.replaceDate)
  }

  replaceDate = el => el.innerText = this.format(el.innerText)

  format = date => {
    const [_year, month, day] = date.split('-')
    return `${day} ${this.MONTHS[month - 1]}`
  }
}

export default DateFormatter
